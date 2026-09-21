import { supabase } from '../lib/supabase';
import type { CartItem, CustomerDetails } from '../types/cart';
import { generateOrderId } from '../utils/orderId';
import { getPrimaryWhatsApp, whatsappLink } from '../data/siteData';

export interface SubmitOrderResult {
  success: boolean;
  orderNumber: string;
  whatsappUrl?: string;
  error?: string;
}

export const submitOrder = async (
  items: CartItem[],
  customer: CustomerDetails,
): Promise<SubmitOrderResult> => {
  // 1. Anti-abuse cooldown check
  const LAST_ORDER_KEY = 'ts_farm_last_order_ts';
  if (typeof window !== 'undefined') {
    const lastSubmit = sessionStorage.getItem(LAST_ORDER_KEY);
    if (lastSubmit) {
      const elapsedSeconds = (Date.now() - parseInt(lastSubmit, 10)) / 1000;
      if (elapsedSeconds < 8) {
        return {
          success: false,
          orderNumber: '',
          error: 'Please wait a few seconds before submitting another order request.',
        };
      }
    }
  }

  // 2. Service-layer validation
  if (!items || items.length === 0) {
    return {
      success: false,
      orderNumber: '',
      error: 'Your cart is empty. Please add items before checking out.',
    };
  }

  // Check out of stock items
  const outOfStockItem = items.find((i) => (i as unknown as { stockStatus?: string }).stockStatus === 'out_of_stock');
  if (outOfStockItem) {
    return {
      success: false,
      orderNumber: '',
      error: `"${outOfStockItem.name}" is currently out of stock and cannot be ordered.`,
    };
  }

  const mangoTotalKg = items
    .filter((i) => i.category === 'mango')
    .reduce((sum, i) => sum + i.quantity, 0);

  // Enforce 5 KG mango minimum rule
  if (mangoTotalKg > 0 && mangoTotalKg < 5) {
    return {
      success: false,
      orderNumber: '',
      error: `Mango orders require a minimum of 5 KG for transit safety. Current total: ${mangoTotalKg} KG.`,
    };
  }

  // Validate required customer fields
  if (!customer.name?.trim()) {
    return { success: false, orderNumber: '', error: 'Customer name is required.' };
  }
  const cleanPhone = customer.phone?.replace(/\D/g, '') || '';
  if (cleanPhone.length < 10) {
    return { success: false, orderNumber: '', error: 'Please enter a valid 10-digit mobile number.' };
  }
  if (!customer.address?.trim()) {
    return { success: false, orderNumber: '', error: 'Delivery address is required.' };
  }
  if (!customer.townCity?.trim()) {
    return { success: false, orderNumber: '', error: 'Town / City is required.' };
  }
  if (!customer.district?.trim()) {
    return { success: false, orderNumber: '', error: 'District is required.' };
  }
  if (customer.pincode?.trim() && !/^\d{6}$/.test(customer.pincode.trim())) {
    return { success: false, orderNumber: '', error: 'Please enter a valid 6-digit postal PIN code.' };
  }

  const orderNumber = generateOrderId();
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

  // 2. Build Itemized breakdown for WhatsApp and Database
  const productsFormatted = items
    .map(
      (i, idx) =>
        `${idx + 1}. ${i.name} — ${i.quantity} ${i.unit}${
          i.price > 0 ? ` (₹${(i.price * i.quantity).toLocaleString('en-IN')})` : ''
        }`,
    )
    .join('\n');

  // 3. Prepare database payload (full schema)
  const fullPayload = {
    order_code: orderNumber,
    customer_name: customer.name.trim(),
    phone: cleanPhone,
    product: items.map((i) => `${i.name} (${i.quantity}${i.unit})`).join(', '),
    quantity_kg: mangoTotalKg,
    order_type: 'retail',
    status: 'pending',
    delivery_address: customer.address.trim(),
    town_city: customer.townCity.trim(),
    district: customer.district.trim(),
    pincode: customer.pincode?.trim() || '',
    total_amount: totalAmount,
    mango_total_kg: mangoTotalKg,
    items_json: items,
    notes: customer.notes?.trim() || '',
  };

  // 4. Persist to Supabase: Preferred Server-Side RPC create_farm_order
  let dbPersisted = false;
  let dbErrorMsg = '';
  let finalOrderCode = orderNumber;
  let finalTotalAmount = totalAmount;

  try {
    const { data: rpcData, error: rpcError } = await supabase.rpc('create_farm_order', {
      p_customer_name: customer.name.trim(),
      p_phone: cleanPhone,
      p_delivery_address: customer.address.trim(),
      p_town_city: customer.townCity.trim(),
      p_district: customer.district.trim(),
      p_pincode: customer.pincode?.trim() || '',
      p_notes: customer.notes?.trim() || '',
      p_items: items,
    });

    if (!rpcError && rpcData?.success) {
      dbPersisted = true;
      if (rpcData.order_code) finalOrderCode = rpcData.order_code;
      if (typeof rpcData.total_amount === 'number') finalTotalAmount = rpcData.total_amount;
    } else {
      // If RPC is not installed on remote database yet, gracefully fallback to direct table insert
      const { error: fullInsertError } = await supabase.from('orders').insert([fullPayload]);

      if (!fullInsertError) {
        dbPersisted = true;
      } else {
        if (fullInsertError.message?.includes('column') || fullInsertError.code === '42703') {
          const fallbackPayload = {
            customer_name: customer.name.trim(),
            phone: cleanPhone,
            product: `[${orderNumber}] ` + items.map((i) => `${i.name} (${i.quantity}${i.unit})`).join(', '),
            quantity_kg: mangoTotalKg,
            order_type: 'retail',
            status: 'pending',
          };
          const { error: fallbackError } = await supabase.from('orders').insert([fallbackPayload]);
          if (!fallbackError) {
            dbPersisted = true;
          } else {
            dbErrorMsg = fallbackError.message;
          }
        } else {
          dbErrorMsg = fullInsertError.message;
        }
      }
    }
  } catch (err: unknown) {
    dbErrorMsg = err instanceof Error ? err.message : 'Database connection error';
  }

  // Critical Requirement: If database creation fails, DO NOT open WhatsApp. Return error.
  if (!dbPersisted) {
    return {
      success: false,
      orderNumber,
      error: `Order could not be saved to farm database: ${dbErrorMsg || 'Service unavailable'}. Please retry.`,
    };
  }

  // 5. Only after successful order persistence, generate formatted WhatsApp URL (Phase 14 structure)
  const waMessage = `Hello TS Mango Farming,

I would like to place an order.

Order ID: ${finalOrderCode}

Customer: ${customer.name.trim()}
Phone: ${cleanPhone}
Address: ${customer.address.trim()}
City: ${customer.townCity.trim()}
District: ${customer.district.trim()}
Pincode: ${customer.pincode?.trim() || '—'}
${customer.notes?.trim() ? `Delivery Notes: ${customer.notes.trim()}\n` : ''}
Products:
${productsFormatted}

Total Quantity: ${totalQuantity} ${mangoTotalKg > 0 ? 'KG' : 'Units'}
${finalTotalAmount > 0 ? `Total Estimated Amount: ₹${finalTotalAmount.toLocaleString('en-IN')}\n` : ''}
Please confirm availability and final price.`;

  const whatsappUrl = whatsappLink(waMessage, getPrimaryWhatsApp());

  if (typeof window !== 'undefined') {
    sessionStorage.setItem('ts_farm_last_order_ts', Date.now().toString());
  }

  return {
    success: true,
    orderNumber: finalOrderCode,
    whatsappUrl,
  };
};

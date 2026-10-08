import { formatINR, getUpiIds, WHATSAPP_PRIMARY, whatsappLink } from '@/content/site';

export const ORDER_WHATSAPP = WHATSAPP_PRIMARY;

function orderDateIST(now = new Date()): string {
  const formatted = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(now);
  return `${formatted} IST`;
}

export function buildOrderMessage(input: {
  farmName: string;
  name: string;
  phone: string;
  address: string;
  items: { productName: string; category: string; qty: number; unit: string; price: number }[];
}): string {
  const address = input.address.replace(/\s*\n\s*/g, ', ').trim();
  const total = input.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const productBlocks = input.items.map((item, index) => {
    const line = item.price * item.qty;
    return [
      `Product_${index + 1}: ${item.productName}`,
      `Quantity: ${item.qty} ${item.unit}`,
      `Price: ${formatINR(item.price)}/${item.unit}`,
      `Total: ${formatINR(line)}`,
    ].join('\n');
  });
  const upiLines = getUpiIds().map((id) => `• ${id}`);

  return [
    `New Order – ${input.farmName}`,
    '',
    'Customer Details',
    `Name: ${input.name.trim()}`,
    `Phone: ${input.phone.trim()}`,
    `Address: ${address}`,
    'Source: Website',
    `Order Date: ${orderDateIST()}`,
    '',
    'Order Details',
    productBlocks.join('\n\n'),
    '',
    `Total Order Amount: ${formatINR(total)}`,
    '',
    'Payment Instructions',
    `Please pay the full amount of ${formatINR(total)} via UPI and send the payment screenshot in this chat for confirmation.`,
    '',
    'UPI IDs:',
    ...upiLines,
  ].join('\n');
}

export function openOrderWhatsApp(message: string) {
  const url = whatsappLink(message, ORDER_WHATSAPP);
  const tab = window.open(url, '_blank');
  if (tab) tab.opener = null;
}

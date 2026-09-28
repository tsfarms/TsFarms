import { formatINR, getUpiId, WHATSAPP_PRIMARY, whatsappLink } from '@/content/site';

export const ORDER_WHATSAPP = WHATSAPP_PRIMARY;

export function buildOrderMessage(input: {
  farmName: string;
  name: string;
  phone: string;
  address: string;
  items: { productName: string; category: string; qty: number; unit: string; price: number }[];
}): string {
  const address = input.address.replace(/\s*\n\s*/g, ', ').trim();
  const itemLines = input.items
    .map((item) => {
      const line = item.price * item.qty;
      return `- ${item.productName} | ${item.qty} | ${item.unit} | ${item.category} | ${formatINR(item.price)} | ${formatINR(line)}`;
    })
    .join('\n');
  const total = input.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const upiId = getUpiId();
  return [
    `New Order — ${input.farmName}`,
    `Name: ${input.name.trim()}`,
    `Phone: ${input.phone.trim()}`,
    `Address: ${address}`,
    'Items:',
    itemLines,
    `Total: ${formatINR(total)}`,
    'Note: Please pay the full amount via UPI now while placing this order.',
    `UPI ID: ${upiId}`,
    'Please send the UPI payment screenshot in this chat.',
    'Source: website',
  ].join('\n');
}

export function openOrderWhatsApp(message: string) {
  const url = whatsappLink(message, ORDER_WHATSAPP);
  const tab = window.open(url, '_blank');
  if (tab) tab.opener = null;
}

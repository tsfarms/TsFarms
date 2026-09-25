import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const whatsappWebhook = functions.https.onRequest(async (req, res) => {

  // GET — Meta verification handshake
  if (req.method === 'GET') {
    const mode      = req.query['hub.mode'];
    const token     = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.status(403).send('Forbidden');
    }
    return;
  }

  // POST — incoming messages
  if (req.method === 'POST') {
    try {
      const messages = req.body?.entry?.[0]?.changes?.[0]?.value?.messages;
      if (!messages || messages.length === 0) { res.status(200).send('ok'); return; }

      for (const message of messages) {
        if (message.type !== 'text') continue;

        const messageId = message.id;
        const fromPhone = message.from;
        const text: string = message.text.body;

        // Dedup check
        const existing = await db.collection('orders')
          .where('whatsapp_message_id', '==', messageId)
          .limit(1).get();
        if (!existing.empty) continue;

        // Parse order using the exact message format in the codebase:
        // "New Order — {farmName}\nName: ...\nPhone: ...\nAddress: ...\nItems:\n- name | qty | unit | category\n..."
        if (text.includes('New Order —')) {
          const lines = text.split('\n');

          const name    = lines.find(l => l.startsWith('Name:'))
                              ?.replace('Name:', '').trim() ?? fromPhone;
          const phone   = lines.find(l => l.startsWith('Phone:'))
                              ?.replace('Phone:', '').trim() ?? fromPhone;
          const addrIdx = lines.findIndex(l => l.startsWith('Address:'));
          const address = lines[addrIdx]?.replace('Address:', '').trim() ?? '';

          const itemLines = lines.filter(l => l.startsWith('- '));
          const items = itemLines.map(l => {
            const [productName, qty, unit, category] = l.replace('- ', '').split(' | ');
            return { productName: productName?.trim(), qty: qty?.trim(),
                     unit: unit?.trim(), category: category?.trim() };
          });

          await db.collection('orders').add({
            customer_name: name,
            customer_phone: phone,
            delivery_address: address,
            items,
            total_amount: 0,
            status: 'pending',
            source: 'whatsapp',
            whatsapp_message_id: messageId,
            created_at: admin.firestore.FieldValue.serverTimestamp(),
          });

        } else {
          // Not an order — save as enquiry
          await db.collection('enquiries').add({
            name: fromPhone,
            phone: fromPhone,
            interest: 'General',
            message: text,
            status: 'new',
            created_at: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      }
    } catch (err) {
      console.error('Webhook error:', err);
    }
    res.status(200).send('ok');
    return;
  }

  res.status(405).send('Method not allowed');
});

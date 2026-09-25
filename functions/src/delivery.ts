import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const sendDeliveryConfirmation = functions.https.onCall(
  async (data, context) => {

    // Auth check — Firebase onCall gives us context.auth automatically
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Login required');
    }

    const { orderId } = data;
    if (!orderId) {
      throw new functions.https.HttpsError('invalid-argument', 'orderId required');
    }

    const orderRef = db.collection('orders').doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      throw new functions.https.HttpsError('not-found', 'Order not found');
    }

    const order = orderSnap.data()!;

    if (order.status === 'delivered') {
      throw new functions.https.HttpsError('already-exists', 'Already delivered');
    }

    // Format phone: must be 91XXXXXXXXXX
    let phone = String(order.customer_phone).replace(/\D/g, '');
    if (phone.startsWith('0')) phone = '91' + phone.slice(1);
    if (phone.length === 10) phone = '91' + phone;

    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const token         = process.env.WHATSAPP_ACCESS_TOKEN;

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phone,
          type: 'text',
          text: {
            body: `✅ Your order from TS Mango Farming has been delivered!\n\nThank you for choosing us. We hope to serve you again soon. 🌿\n\nFor your next order, WhatsApp us anytime.`
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      console.error('Meta API error:', err);
      throw new functions.https.HttpsError('internal', 'WhatsApp send failed');
    }

    await orderRef.update({
      status: 'delivered',
      delivered_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
  }
);

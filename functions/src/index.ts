import * as admin from 'firebase-admin';

admin.initializeApp();

export { whatsappWebhook } from './webhook';
export { sendDeliveryConfirmation } from './delivery';

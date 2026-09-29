import type { FirebaseOptions } from 'firebase/app';

const env = import.meta.env;

export const firebaseConfig: FirebaseOptions = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyAXVjTMzzajaLL6qYsklBjUQQx1eVD7DRA',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'tsmangoes-001.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'tsmangoes-001',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'tsmangoes-001.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '720939285904',
  appId: env.VITE_FIREBASE_APP_ID || '1:720939285904:web:f157c214704e4405358715',
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || 'G-LH0CQVMZR2',
};

export const functionsRegion = env.VITE_FIREBASE_FUNCTIONS_REGION || 'us-central1';

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

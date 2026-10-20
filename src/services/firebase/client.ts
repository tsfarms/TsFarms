import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
import { getFunctions, type Functions } from 'firebase/functions';
import { firebaseConfig, functionsRegion } from './config';

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const functions: Functions = getFunctions(app, functionsRegion);
export let analytics: Analytics | null = null;

if (firebaseConfig.measurementId) {
  void isSupported().then((supported) => {
    if (supported) analytics = getAnalytics(app);
  });
}

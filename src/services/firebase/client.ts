import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
import { getFunctions, type Functions } from 'firebase/functions';
import { app, auth, db } from '@/lib/firebase';
import { firebaseConfig, functionsRegion } from './config';

export { app, auth, db };

export const functions: Functions = getFunctions(app, functionsRegion);
export let analytics: Analytics | null = null;

if (firebaseConfig.measurementId) {
  void isSupported().then((supported) => {
    if (supported) analytics = getAnalytics(app);
  });
}

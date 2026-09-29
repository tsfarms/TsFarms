import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getFunctions, type Functions } from 'firebase/functions';
import { firebaseConfig, functionsRegion, isFirebaseConfigured } from './config';

export const app: FirebaseApp | null = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const auth: Auth | null = app ? getAuth(app) : null;
export const db: Firestore | null = app ? getFirestore(app) : null;
export const functions: Functions | null = app ? getFunctions(app, functionsRegion) : null;
export let analytics: Analytics | null = null;

if (app && firebaseConfig.measurementId) {
  void isSupported().then((supported) => {
    if (supported && app) analytics = getAnalytics(app);
  });
}

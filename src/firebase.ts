import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Use initializeFirestore instead of getFirestore to enable experimentalForceLongPolling
// This helps resolve "unavailable" errors in restricted network environments or iframes.
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
}, firebaseConfig.firestoreDatabaseId);

export const auth = getAuth(app);

import { initializeApp } from 'firebase/app';
import { getDatabase, ref } from 'firebase/database';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FirebaseApiKey,
  authDomain: process.env.NEXT_PUBLIC_FirebaseAuthDomain,
  projectId: process.env.NEXT_PUBLIC_FirebaseProjectId,
  storageBucket: process.env.NEXT_PUBLIC_FirebaseStorageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FirebaseMessagingSenderId,
  appId: process.env.NEXT_PUBLIC_FirebaseAppId,
  measurementId: process.env.NEXT_PUBLIC_FirebaseMeasurementId,
  databaseURL: process.env.NEXT_PUBLIC_FirebaseDatabaseURL
};

export const firebaseApp = initializeApp(firebaseConfig);

const db = getDatabase(firebaseApp);
export const mainPathRef = ref(db, 'userId/');

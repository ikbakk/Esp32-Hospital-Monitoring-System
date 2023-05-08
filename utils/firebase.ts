import { initializeApp } from 'firebase/app';

export const firebaseConfig = {
  apiKey: process.env.FirebaseApiKey,
  authDomain: process.env.FirebaseAuthDomain,
  projectId: process.env.FirebaseProjectId,
  storageBucket: process.env.FirebaseStorageBucket,
  messagingSenderId: process.env.FirebaseMessagingSenderId,
  appId: process.env.FirebaseAppId,
  measurementId: process.env.FirebaseMeasurementId
};

export const firebaseApp = initializeApp(firebaseConfig);

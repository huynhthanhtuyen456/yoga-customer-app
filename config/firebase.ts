import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// You can get these values from your Firebase project settings
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey || "your-api-key",
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain || "your-project.firebaseapp.com",
  projectId: Constants.expoConfig?.extra?.firebaseProjectId || "your-project-id",
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket || "your-project.appspot.com",
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId || "your-sender-id",
  appId: Constants.expoConfig?.extra?.firebaseAppId || "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;

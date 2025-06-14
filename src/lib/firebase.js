// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchatapp-d1478.firebaseapp.com",
  projectId: "reactchatapp-d1478",
  storageBucket: "reactchatapp-d1478.firebasestorage.app",
  messagingSenderId: "1034823931466",
  appId: "1:1034823931466:web:c5b1f5c5a9f8b4b837f8b3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth()
export const db=getFirestore()
export const storage=getStorage()
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBuXEzsnsj6FbcsVpGBtMJpU1eBEUptlyk',
  authDomain: 'ecommerce-clone-f2ce3.firebaseapp.com',
  projectId: 'ecommerce-clone-f2ce3',
  storageBucket: 'ecommerce-clone-f2ce3.appspot.com',
  messagingSenderId: '713514396925',
  appId: '1:713514396925:web:e494042c3c77642bc1a294',
  measurementId: 'G-5DJ1Y5G9FL',
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth();

export { db, auth };

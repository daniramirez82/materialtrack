import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDy-BmHZy8LwEizpdsd031bkm0EhfIMh2s",
  authDomain: "staff-676c8.firebaseapp.com",
  projectId: "staff-676c8",
  storageBucket: "staff-676c8.appspot.com",
  messagingSenderId: "545622416055",
  appId: "1:545622416055:web:1cf9652899b92c17194b32",
  measurementId: "G-0JD9JE8ZFJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

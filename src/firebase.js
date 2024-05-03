import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAf57D6cD4p6dTD1Zs4AnSBeOfZ7uo4rfA",
  authDomain: "todoapp-c53aa.firebaseapp.com",
  projectId: "todoapp-c53aa",
  storageBucket: "todoapp-c53aa.appspot.com",
  messagingSenderId: "465856002199",
  appId: "1:465856002199:web:48e1551d28edbe8d7891d2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Inicializace Firestore
//const firestore = getFirestore(app);

export { db, collection, getDocs };

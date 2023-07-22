import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'
import { getFirestore} from '@firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA_XFmyI8Y3pHYKXXcYQQT1ba8Ya81Qvgc",
  authDomain: "winners-church-c5fbc.firebaseapp.com",
  databaseURL: "https://winners-church-c5fbc-default-rtdb.firebaseio.com",
  projectId: "winners-church-c5fbc",
  storageBucket: "winners-church-c5fbc.appspot.com",
  messagingSenderId: "406368857175",
  appId: "1:406368857175:web:7ee3b67a343bdb4c0e4712",
  measurementId: "G-5F0GX6ZK04"
  };

  const app = initializeApp(firebaseConfig); 
export  const storage = getStorage(app);

export  const db = getFirestore(app);




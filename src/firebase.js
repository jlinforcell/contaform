import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_wwVrnYcPIgfmloHnvdhd-HrA_g38thw",
  authDomain: "meusprojetos-jlinforcell.firebaseapp.com",
  projectId: "meusprojetos-jlinforcell",
  storageBucket: "meusprojetos-jlinforcell.appspot.com",
  messagingSenderId: "891643440001",
  appId: "1:891643440001:web:d91b94bffbdf2b32d21680",
  measurementId: "G-N7RNB4FZ9F"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

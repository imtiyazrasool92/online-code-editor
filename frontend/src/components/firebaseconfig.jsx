import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyBCRNb5eNGE483G5MOSue1vU1MwELqaiVE",
  authDomain: "online-code-editor-57c1a.firebaseapp.com",
  projectId: "online-code-editor-57c1a",
  storageBucket: "online-code-editor-57c1a.appspot.com",
  messagingSenderId: "140849506822",
  appId: "1:140849506822:web:b301dedba7965a9e25f187",
  
  measurementId: "G-JSZV1NRGYR"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

export {app,auth,db}

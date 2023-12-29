// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  //sendSignInLinkToEmail,isSignInWithEmailLink,signInWithEmailLink,signOut,signInWithPopup,createUserWithEmailAndPassword,signInWithEmailAndPassword,
  connectAuthEmulator,
} from "firebase/auth";
//import { onAuthStateChanged } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { getApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBISSc3EaCcch7wX9BxFdjtj6QMAe4xr6o",
  authDomain: "aniims.firebaseapp.com",
  databaseURL: "https://aniims-default-rtdb.firebaseio.com",
  projectId: "aniims",
  storageBucket: "aniims.appspot.com",
  messagingSenderId: "144488167199",
  appId: "1:144488167199:web:3c25bb41b97ec169f7222a",
  measurementId: "G-CSRK0VGSZ7",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const database = getDatabase(app);

//const analytics = getAnalytics(app);
const functions = getFunctions(getApp());
connectFunctionsEmulator(functions, "localhost", 5001);
connectAuthEmulator(auth, "http://localhost:9099");
connectFirestoreEmulator(firestore, "localhost", 8080);
connectStorageEmulator(storage, "localhost", 9199);
connectDatabaseEmulator(database, "localhost", 9090);

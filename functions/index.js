// import { collection, documentId } from "firebase/firestore";
const {
  beforeUserSignedIn,
  //beforeUserCreated,
} = require("firebase-functions/v2/identity");
const {
  onDocumentCreated,
  //onDocumentDeleted,
} = require("firebase-functions/v2/firestore");
const {
  onCall,
  //onRequest,
  HttpsError,
} = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
//const { onObjectFinalized } = require("firebase-functions/v2/storage");
const { setGlobalOptions } = require("firebase-functions/v2");

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

setGlobalOptions({ maxInstances: 10 });

const app = initializeApp(firebaseConfig);

const user = require("./user");
const triggers = require("./triggers");

module.exports = {
  ...user,
  ...triggers,
  //sendsms: require("./sms.js").sendsms,//recoveremail: require("./recoveremail.js").recoveremail,
  resetpassword: require("./password.js").resetpassword,
  generatethumb: require("./thumbnails.js").generatethumb,
};

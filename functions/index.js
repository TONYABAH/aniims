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
//const { getFirestore } = require("firebase-admin/firestore");
//const { getDatabase } = require("firebase-admin/database");
//const { getAuth } = require("firebase-admin/auth");
//const { logger } = require("firebase-functions");
//const { default: PasswordReset } = require("src/pages/PasswordReset.vue");
// Text Message API
//const API_TOKEN ="asJfv3w5wRJs89muVmGPIl3v4qJ7m7Dja1X60rPsNlxlYV6sVwsqoQmFIXol";
//const SMS_URL = "https://www.bulksmsnigeria.com/api/v1/sms/create?";
// Domain Info
//const DOMAIN = "aniims.web.app";
//const BASE_URL = "https://aniims.web.app";
//const BASE_URL = require("./baseurl.js").BASE_URL;
//const CONTINUE_URL = "https://aniims.web.app/";
//const SENDER_ID = "ANIIMS";

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
  //sendsms: require("./sms.js").sendsms,
  resetpassword: require("./password.js").resetpassword,
  recoveremail: require("./recoveremail.js").recoveremail,
  generatethumb: require("./thumbnails.js").generatethumb,
};

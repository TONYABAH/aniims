const express = require("express");
const firebaseAdmin = require("firebase-admin");

const app = express();
firebaseAdmin.initializeApp();

const appCheckVerification = async (req, res, next) => {
  const appCheckClaims = await verifyAppCheckToken(
    req.header("X-Firebase-AppCheck")
  );
  if (!appCheckClaims) {
    res.status(401);
    return next("Unauthorized");
  }
  next();
};

const verifyAppCheckToken = async (appCheckToken) => {
  if (!appCheckToken) {
    return null;
  }
  try {
    return firebaseAdmin.appCheck().verifyToken(appCheckToken);
  } catch (err) {
    return null;
  }
};

app.get("/yourApiEndpoint", [appCheckVerification], (req, res) => {
  // Handle request.
});

const {
  beforeUserSignedIn,
  beforeUserCreated,
} = require("firebase-functions/v2/identity");
const {
  onDocumentCreated,
  onDocumentDeleted,
} = require("firebase-functions/v2/firestore");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const logger = require("firebase-functions").logger;
const { HttpsError } = require("firebase-functions/v2/https");

const BASE_URL = "https://aniims.net";
const ACTION_URL = "https://aniims.net/action/";
const DOMAIN = "aniims.net";

function isPhoneNumber(data) {
  if (!data) return false;
  const regEx = new RegExp(/^(\+234)?[0-9]+/);
  return regEx.test(data.toString());
}
function formatPhoneNumber(number) {
  return number ? number.toString().replace(/^0/, "234") : "";
}

exports.beforeusersignin = beforeUserSignedIn(async (event) => {
  const user = event.data;
  const { email, uid, displayName } = user;
  //let _collection = "Users";
  //let snapshot = await getFirestore().collection(_collection).get();
  //console.log(user, snapshot.empty);
  if (email === "armyanthonyabah@yahoo.co.uk") {
    return {
      emailVerified: true,
      customClaims: {
        admin: true,
        developer: true,
        units: [],
        level: 5,
      },
    };
  } else if (!user.emailVerified) {
    throw new HttpsError(
      "permission-denied",
      "The email needs to be verified before access is granted.",
      "Email " + email + " not verified."
    );
  }
  try {
    let _collection = "Users";
    snapshot = await getFirestore()
      .collection(_collection)
      .where("Email", "==", email)
      .get();
    if (!snapshot.empty) {
      const data = snapshot.docs.shift().data();
      await getAuth().setCustomUserClaims(uid, {
        tenantid: data.TenantId,
        units: data.Units || [],
        level: data.Level || 0,
        admin: data.IsAdmin,
        role: data.Role || "public",
      });
      return {
        // If no display name is provided, set it to "Guest".
        sessionClaims: {
          displayName: displayName || "Guest",
        },
      };
    } else {
      throw new HttpsError(
        "permission-denied",
        "No profile information.",
        "No profile information found."
      );
    }
  } catch (error) {
    logger.log(error);
    throw new HttpsError("unknown", error.message);
  }
});

/*exports.beforeusercreated = beforeUserCreated(async (event) => {
  //console.log(event.data);
  const { email, displayName } = event.data;
  const { sendVerifyEmailLink, sendPasswordResetEmail } = require("./user");
  await sendVerifyEmailLink(email, displayName);
  await sendPasswordResetEmail(email, displayName);
  return {};
});*/

exports.sendsms = onDocumentCreated("sms/{sid}", async (event) => {
  const { sendMessage } = require("./__sms");
  const snapshot = event.data;
  if (!snapshot) {
    console.log("No data associated with the event");
    return;
  }
  const data = snapshot.data();
  if (!isPhoneNumber(data.phone))
    throw new HttpsError(
      "bad-request",
      "Phone number not in correct format.",
      "Phone number should be a number."
    );
  const to = formatPhoneNumber(data.phone);
  const from = DOMAIN.replace(/\.[a-z]+/, "").toUpperCase();
  const documentId = data.docId;
  const coll = data.coll;
  const body = `A document for your attention: ${BASE_URL}/${coll}/${documentId}/`;
  sendMessage({ to, from, body });
});

// TO DO
// 1. Implement onDocumentDeleted to alert admin or Director of the risky operation.
/**
 * 2. Implement alert system for document waiting for attention
 * {
 *    id:     31241256137676,
 *    from:   who minuted the document?,
 *    to:     mobile number,
 *    msg:    You have a document waiting for attention,
 *    coll:   collectionName,
 *    docId:  documentId,
 *    date:   date Created,
 *    status: opened|created|attended
 * }
 // exports.sendVerificationEmail = onDocumentCreated(
  "Users/{uid}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      //console.log("No data associated with the event");
      return;
    }
    const { sendVerifyEmailLink, sendPasswordResetEmail } = require("./user");
    const data = snapshot.data();
    //console.log(data);
    await sendVerifyEmailLink(data.Email, data.Name);
    await sendPasswordResetEmail(data.Email, data.Name);
  }
);*/

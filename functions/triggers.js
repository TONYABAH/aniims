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
const BASE_URL = require("./baseurl.js").BASE_URL;
const { MESSAGE_TYPE } = require("./emailservice.js");
const sendEmail = require("./emailservice.js");
const { sendPasswordResetEmail } = require("./password-reset-email.js");

async function sendAccountDeleteEmail(accountEmail, recipientName) {
  const options = {
    title: "Account deleted",
    recipientName,
    message: "Your acoount has been deleted and cannot be recovered",
    message2:
      "If you have not requested for account deletion, please contact admin.",
    link,
    button: false,
  };
  const info = await sendEmail(`${accountEmail}, 'admin@aniims.net'`, options);

  return info;
}
async function getNextCaseNumber() {
  //Use realtime database for Case Count
  const snapshot = await getDatabase().ref("cases").child("count").get();
  let count = snapshot?.val() || 0;
  count++;
  getDatabase().ref("cases/count").set(count);
  return count;
}
async function getNextDestructionApplicationNumber() {
  //Use realtime database for Case Count
  const snapshot = await getDatabase().ref("destructions").child("count").get();
  let count = snapshot?.val() || 0;
  count++;
  getDatabase().ref("destructions/count").set(count);
  return count;
}

async function updateDestruction(id) {
  try {
    const ApplicationNumber = await getNextDestructionApplicationNumber();
    //const data = { CaseNumber };
    getFirestore()
      .doc("Destructions/" + id)
      .update({ ApplicationNumber });
  } catch (error) {
    logger.error(error);
  }
}

exports.beforeusersignin = beforeUserSignedIn(async (event) => {
  const user = event.data;
  const { email, uid, displayName } = user;

  if (email === "armyanthonyabah@yahoo.co.uk") {
    const claims = event.data.customClaims || {
      //displayName: displayName || email,
      admin: true,
      developer: true,
      unit: null,
      level: 5,
    };
    if (!claims.level) {
      claims.level = 5;
      claims.admin = true;
      claims.developer = true;
      claims.unit = null;
    }
    return {
      emailVerified: true,
      customClaims: claims,
    };
  } else if (!user.emailVerified) {
    throw new HttpsError(
      "permission-denied",
      "The email needs to be verified before access is granted.",
      "Email " + email + " not verified."
    );
  } else {
    let snapshot = await getFirestore().collection("Users")?.get();
    //setCustomClaims(userRecord.uid, data);
    if (snapshot?.empty) {
      //console.log("No data associated with the event");
      return {
        emailVerified: false,
        disabled: true,
      };
    }
    const data = snapshot?.docs[0];
    return {
      //displayName: displayName || email,
      unit: data.Unit || null,
      level: data.Level || 0,
      admin: user.customClaims.admin || data.IsAdmin || false,
      location: data.Location || null,
      role: data.Role || "public",
    };
  }
});

exports.oncasecreated = onDocumentCreated(
  "Investigations/{id}",
  async (event) => {
    try {
      const snapshot = event.data;
      const id = event.params.id;
      if (!snapshot) {
        return;
      }
      const CaseNumber = await getNextCaseNumber();
      //const data = { CaseNumber };
      getFirestore()
        .doc("Investigations/" + id)
        .update({ CaseNumber });
    } catch (error) {
      logger.error(error);
    }
  }
);
exports.onusercreated = onDocumentCreated("Users/{uid}", async (event) => {
  //const { sendMessage } = require("./sms");
  const snapshot = event.data;
  const uid = event.params.uid;
  if (!snapshot) {
    return;
  }
  const data = snapshot.data();
  getAuth()
    .setCustomUserClaims(uid, {
      //displayName: displayName || email,
      unit: data.Unit || null,
      level: data.Level || 0,
      admin: data.IsAdmin || false,
      location: data.Location || null,
      role: data.Role || "public",
    })
    .then(() => {
      if (data.Email) {
        sendPasswordResetEmail(data.Email, data.Name).catch((e) =>
          logger.log(e.message)
        );
      }
      /*if (data.Phone) {
        const to = formatPhoneNumber(data.Phone);
        const from = DOMAIN.replace(/\.[a-z]+/, "").toUpperCase();
        const body = `Your account has been created, please check your email:${data.Email}`;
        sendMessage({ to, from, body });
      }*/
    })
    .catch((e) => {
      logger.log(e.message);
    });
});

/*exports.onuserdeleted = onDocumentDeleted("Users/{uid}", async (event) => {
  const snapshot = event.data;

  if (!snapshot) {
    return;
  }
  const data = snapshot.data();

  if (data.Email) {
    await sendAccountDeleteEmail(data.Email, data.Name).catch((e) => {
      logger.log(e);
    });
  }
});*/

exports.oncomplaintcreated = onDocumentCreated(
  "Complaints/{sid}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      //console.log("No data associated with the event");
      return;
    }
    const data = snapshot.data();
    let receiverEmail = data.Email;
    let recipientName = data.CoyName || "";

    if (!receiverEmail) return;
    //const { MESSAGE_TYPE } = await import("./emailservice.js");
    //const sendEmail = require("./emailservice.js").sendEmail;
    const link = `${BASE_URL}/my_petition`;
    const message = `Your complaint has been received and is being reviewed. Visit. ${link} to view status`;

    const options = {
      title: "Complaint received",
      recipientName,
      message,
      message2:
        "If you have not filed this complaint, please contact NAFDAC Investigation and Enforcement Directorate.",
      link,
      button: "Open in app",
      type: MESSAGE_TYPE.EMAIL_COMPLAINT,
    };
    const info = await sendEmail(receiverEmail, options);
    return info;
  }
);
exports.ondestructioncreated = onDocumentCreated(
  "Destructions/{id}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      //console.log("No data associated with the event");
      return;
    }
    const data = snapshot.data();
    updateDestruction(event.params.id);

    let receiverEmail = data.ContactEmail;
    let recipientName = data.ContactName;

    if (!receiverEmail) return;
    //const { MESSAGE_TYPE } = await import("./emailservice.js");
    //const sendEmail = require("./emailservice.js").sendEmail;
    const link = `${BASE_URL}/petition`;
    const message = `Your application for destruction of your obsolete products has been received and is being reviewed. Visit. ${link} to view status`;
    const options = {
      title: "Application received",
      recipientName,
      message,
      message2:
        "For further information, please contact NAFDAC Investigation and Enforcement Directorate.",
      link,
      button: "Open in app",
      type: MESSAGE_TYPE.EMAIL_DESTRUCTION,
    };
    const info = await sendEmail(receiverEmail, options);
    return info;
  }
);
exports.sendcustumemail = onDocumentCreated("Forms/{id}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    //console.log("No data associated with the event");
    return;
  }
  const data = snapshot.data();
  const sendEmail = require("./emailservice.js").sendEmail;

  const options = {
    title: data.Title,
    subject: data.Subject,
    receiverName: "Aniims Team",
    senderName: data.Name,
    message: data.Message || "",
    phone: data.Phone,
    senderEmail: data.Email,
    to: "support@aniims.net",
    type: "contact-form",
  };
  try {
    const info = await sendEmail("support@aniims.net", options);
    console.log(info);
    //return info;
  } catch (e) {
    console.log(e);
  }
});
/*function isPhoneNumber(data) {
  if (!data) return false;
  const regEx = new RegExp(/^(\+234)?[0-9]+/);
  return regEx.test(data.toString());
}
function formatPhoneNumber(number) {
  return number ? number.toString().replace(/^0/, "234") : "";
}*/
/*exports.oncommentcreated = onDocumentCreated(
  "Minutes/{minuteId}",
  async (event) => {
    const snapshot = event.data;
    //console.log(event);
    if (!snapshot) {
      //console.log("No data associated with the event");
      return;
    }
    const data = snapshot.data();
    const user = await getAuth().getUser(data.toid);
    if (!user) return;
    let to = formatPhoneNumber(user?.phoneNumber);
    let receiverEmail = user.email;
    const from = SENDER_ID;
    const documentId = event.params.docId;
    const coll = event.params.collectionId;
    const link = `${BASE_URL}/${coll}/#${documentId}/`;
    const body = `A document for your attention: ${link}`;
    //sendMessage({ to, from, body }, (err, info) => {
    // for production comment || info
    //if (err || info) {
      sendCustomEmail(
        receiverEmail,
        "Document waiting",
        snapshot.to,
        body,
        body,
        link,
        "Open document"
      ).catch((e) => {});
    //}
    //});
  }
);
exports.updatedocument = onCall(async (request) => {
  try {
    //let Level = request.auth?.token?.level;
    let data = request.data;
    let { collection, historyId, documentId, payload, user } = data;
    //console.log(data);
    if (!request.auth?.uid) {
      throw new HttpsError("bad-request", `User not logged in`);
    }
    await getFirestore().runTransaction(async (t) => {
      const doc = getFirestore().doc(collection + "/" + documentId);
      t.update(doc, payload);
      //console.log(Object.keys(payload));
      await addHistory(
        "Updated",
        collection,
        documentId,
        historyId,
        { fields: Object.keys(payload) },
        t,
        request.auth.uid,
        user
      );
    });
    return documentId;
  } catch (error) {
    logger.error(error);
    throw new HttpsError("unknown", error.message);
  }
});

exports.createdocument = onCall(async (request) => {
  try {
    let Level = request.auth?.token?.level;
    let data = request.data;
    let { collection, historyId, documentId, payload, user } = data;
    //delete data.historyId;
    if (!request.auth?.uid) {
      throw new HttpsError("bad-request", `User not logged in`);
    }

    await getFirestore().runTransaction(async (t) => {
      const doc = getFirestore().doc(collection + "/" + documentId);
      payload.id = documentId;
      t.create(doc, payload);
      await addHistory(
        "Created",
        collection,
        documentId,
        historyId,
        {},
        t,
        request.auth.uid,
        user
      );
    });
    return documentId;
  } catch (error) {
    logger.error(error);
    throw new HttpsError("unknown", error.message);
  }
});
async function addHistory(
  operation,
  collectionId,
  documentId,
  historyId,
  data,
  transaction,
  uid,
  user,
  unit
) {
  //const user = await getAuth().getUser(uid);
  const meta = {
    CollId: collectionId,
    DocId: documentId,
    Date: Date.now(),
    Op: operation,
    Unit: unit || null,
    User: {
      uid: uid,
      Name: user,
    },
  };
  };
  const _ref = getFirestore().doc("History" + "/" + historyId);

  return transaction.set(_ref, meta);
}

exports.sendsms = onDocumentCreated("sms/{sid}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    console.log("No data associated with the event");
    return;
  }
  const data = snapshot.data();
  if (!isPhoneNumber(data.Phone))
    throw new HttpsError(
      "bad-request",
      "Phone number not in correct format.",
      "Phone number should be a number."
    );
  //const { sendMessage } = require("./sms");
  const to = formatPhoneNumber(data.Phone);
  const from = DOMAIN.replace(/\.[a-z]+/, "").toUpperCase();
  const documentId = data.docId;
  const coll = data.coll;
  const body = `A document for your attention: ${BASE_URL}/${coll}/${documentId}/`;
  sendMessage({ to, from, body });
});*/

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
);

/*exports.beforeusercreated = beforeUserCreated(async (event) => {
  //console.log(event.data);
  const { email, displayName } = event.data;
  const { sendVerifyEmailLink, sendPasswordResetEmail } = require("./user");
  await sendVerifyEmailLink(email, displayName);
  await sendPasswordResetEmail(email, displayName);
  return {};
});
*/

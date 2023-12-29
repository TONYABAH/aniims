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
const { getFirestore } = require("firebase-admin/firestore");
const { getDatabase } = require("firebase-admin/database");
const { getAuth } = require("firebase-admin/auth");
const { logger } = require("firebase-functions");

// Text Message API
const API_TOKEN =
  "asJfv3w5wRJs89muVmGPIl3v4qJ7m7Dja1X60rPsNlxlYV6sVwsqoQmFIXol";
const SMS_URL = "https://www.bulksmsnigeria.com/api/v1/sms/create?";
// Domain Info
const DOMAIN = "aniims.web.app";
const BASE_URL = "https://aniims.web.app";
const CONTINUE_URL = "https://aniims.web.app/";
const SENDER_ID = "ANIIMS";

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

function formatPhoneNumber(number) {
  let phone = number.toString();
  return phone.indexOf("+") === 0 ? phone : phone.replace(/^0/, "+234");
}
function isPhoneNumber(data) {
  if (!data) return false;
  const regEx = new RegExp(/^(\+234)?[0-9]+/);
  return regEx.test(data.toString());
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
// Start listing users = require(the beginning, 1000 at a time.
const listAllUsers = (users, nextPageToken) => {
  // List batch of users, 1000 at a time.
  return getAuth()
    .listUsers(1000, nextPageToken)
    .then((listUsersResult) => {
      listUsersResult.users.forEach((userRecord) => {
        users.push(userRecord.toJSON());
      });
      if (listUsersResult.pageToken) {
        // List next batch of users.
        listAllUsers(users, listUsersResult.pageToken);
      }
      return Promise.resolve(users);
    })
    .catch((error) => {
      console.log("Error listing users:", error);
      Promise.reject(error);
    });
};
async function deleteUsers(uids = []) {
  try {
    //let result = 0;
    const deleteUsersResult = await getAuth().deleteUsers([...uids]);
    if (deleteUsersResult.successCount > 0) {
      logger.log(
        `Successfully deleted ${deleteUsersResult.successCount} users`
      );
      deleteUsersResult.errors.forEach((err) => {
        logger.log(err.error.toJSON());
      });
      //result = deleteUsersResult;
      return true;
    } else if (deleteUsersResult.failureCount > 0) {
      throw {
        message: `Failed to delete ${deleteUsersResult.failureCount} users`,
      };
    }
  } catch (error) {
    // console.log("Error deleting users:", error);
    //logger.error(error.message);
    throw new HttpsError("unknown", error.message);
  }
}
async function createUser(email, password, phone, name, emailVerified) {
  const userRecord = await getAuth().createUser({
    //uid: id,
    email: email.toLowerCase(),
    password,
    disabled: false,
    emailVerified,
    phoneNumber: formatPhoneNumber(phone),
    displayName: name,
    //photoURL,
  });

  return userRecord;
}
async function sendAccountRecoveryLink(receiverEmail, recipientName) {
  const sendEmail = require("./emailservice.js").sendEmail;
  const link = await getAuth().generateVerifyAndChangeEmailLink(receiverEmail);
  const options = {
    title: "Recover email",
    recipientName,
    message: "You have requested to recover your email.",
    message2: `Follow this link to reset your ANIIMS login email.`,
    //"Please follow the link below to change your account email.",
    link,
    button: "Recover my email",
  };
  const info = await sendEmail(receiverEmail, options);
  //logger.info("Message sent: %s", receiverEmail, info);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  return info;
}
const sendPasswordResetEmail = async function (receiverEmail, recipientName) {
  const sendEmail = require("./emailservice.js").sendEmail;
  const link = await getAuth().generatePasswordResetLink(
    receiverEmail,
    {
      url: CONTINUE_URL + "?email=" + receiverEmail,
    } //actionCodeSettings
  );
  const options = {
    title: "Recover password",
    recipientName,
    message: "You have requested to reset your account password.",
    message2:
      "Please confirm your action by visiting the following link below to complete password recovery.",
    link,
    button: "Reset my password",
  };
  const info = await sendEmail(receiverEmail, options);
  //logger.info("Message sent: %s", receiverEmail, info);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  return info;
};

const sendVerifyEmailLink = async function (receiverEmail, recipientName) {
  const link = await getAuth().generateEmailVerificationLink(
    receiverEmail,
    {
      url: CONTINUE_URL + "?email=" + receiverEmail,
    } //actionCodeSettings
  );
  const sendEmail = require("./emailservice.js").sendEmail;
  const options = {
    title: "Verify email",
    recipientName,
    message: "You have created account with ANIIMS.",
    message2:
      "Please confirm your email by visiting the following link below to verify email.",
    link,
    button: "Confirm my email",
  };
  const info = await sendEmail(receiverEmail, options);
  //logger.info("Message sent: %s", receiverEmail, info);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  return info;
};

function sendMessage(data, callback) {
  const https = require("https");
  const { to, from, body } = data;
  if (!isPhoneNumber(to)) {
    callback("Inalid phone number.");
    return;
  }
  //const uri = "https://www.bulksmsnigeria.com/api/v1/sms/create?";
  const query = `from=${from}&to=${to}&body=${body}&api_token=${API_TOKEN}`;
  const url = SMS_URL.concat(query);

  https
    .get(url, (resp) => {
      let data = "";
      // A chunk of data has been recieved.
      resp.on("data", (chunk) => {
        data += chunk;
      });
      // The whole response has been received. Print out the result.
      resp.on("end", () => {
        let info = JSON.parse(data).message;
        callback(null, info);
      });
    })
    .on("error", (err) => {
      console.log("Error: " + err.message);
      callback(err, null);
    });
}
async function sendCustomEmail(
  receiverEmail,
  title,
  recipientName,
  message,
  html,
  link,
  buttonText
) {
  const sendEmail = require("./emailservice.js").sendEmail;
  const options = {
    title,
    recipientName,
    message,
    message2: html,
    link,
    button: buttonText,
  };
  const info = await sendEmail(receiverEmail, options);
  //logger.info("Message sent: %s", receiverEmail, info);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  return info;
}
exports.resetpassword = onCall(async (request) => {
  if (!request.data?.email)
    throw new HttpsError("bad-request", "Email required");
  try {
    const userRecord = await getAuth().getUserByEmail(request.data.email);
    if (!userRecord) {
      throw new HttpsError("invalid-argument", "User record not found");
    }
    const info = await sendPasswordResetEmail(
      userRecord.email,
      userRecord.displayName
    );
    return info;
  } catch (error) {
    logger.log(error);
    throw new HttpsError("unknown", error.message);
  }
});

exports.recoveremail = onCall(async (request) => {
  if (!request.data?.email)
    throw new HttpsError("bad-request", "Email required");
  try {
    const userRecord = await getAuth().getUserByEmail(request.data.email);
    if (!userRecord) {
      throw new HttpsError("invalid-argument", "User record not found");
    }
    const info = await sendAccountRecoveryLink(
      userRecord.email,
      userRecord.displayName
    );
    return info;
  } catch (error) {
    logger.log(error);
    throw new HttpsError("unknown", error.message);
  }
});
async function setCustomClaims(uid, data) {
  getAuth()
    .setCustomUserClaims(uid, {
      //displayName: displayName || email,
      units: data.Units || [],
      level: data.Level || 0,
      admin: data.IsAdmin || false,
      location: data.Location || "",
      role: data.Role || "public",
    })
    .catch((e) => {
      logger.log(e.message);
    });
  if (!data.Email) return;
  sendPasswordResetEmail(data.Email, data.Name).catch((e) =>
    logger.log(e.message)
  );
}
exports.register = onCall(async (request) => {
  try {
    if (!request.auth?.uid || !request.auth?.token?.admin) {
      throw new HttpsError(
        "bad-request",
        `Staff user can be created only by logged in admin`
      );
    }
    if (!request.data?.Email || !request.data?.Phone || !request.data?.Name) {
      throw new HttpsError("bad-request", `No email address to register`);
    }
    let Level = 3;
    let data = request.data;
    data.Level = Level;
    let password = "password1";
    const userRecord = await createUser(
      data.Email,
      password,
      data.Phone,
      data.Name,
      false
      //data.photoURL || "https://example.com/123/photo.jpg"
    );
    await getFirestore()
      .collection("Users")
      .doc(userRecord.uid)
      .set({
        uid: userRecord.uid,
        ...data,
      });
    setCustomClaims(userRecord.uid, data);
    return userRecord.uid;
  } catch (error) {
    logger.error(error);
    throw new HttpsError("unknown", error.message);
  }
});

exports.deleteusers = onCall(async (request) => {
  try {
    return await deleteUsers(request.data.uids);
  } catch (error) {
    logger.error(error.message);
    throw new HttpsError("unknown", error.message);
  }
});
exports.listusers = onCall(async (request) => {
  try {
    const users = [];
    return await listAllUsers(users);
  } catch (error) {
    logger.error(error.message);
    throw new HttpsError("unknown", error.message);
  }
});
exports.getstaffbyid = onCall(async (request) => {
  try {
    if (!request.data?.staffId)
      throw new HttpsError(
        "bad-request",
        "User data required",
        "Username, password, role required"
      );
    //console.log(request.data);
    const staffId = request.data?.staffId;
    //const role = request.data?.role?.toLowerCase();
    let _collection = "Users";
    let filter = ["StaffId", "==", staffId.toUpperCase()];
    const snapshot = await getFirestore()
      .collection(_collection)
      .where(...filter)
      .get();
    if (snapshot.empty) {
      throw new HttpsError(
        "permission-denied",
        `User id '${staffId}' not found`
      );
    } else {
      let data = snapshot?.docs[0]?.data();
      return data;
    }
  } catch (error) {
    logger.error(error);
    throw new HttpsError("unknown", error.message);
  }
});
exports.getuser = onCall(async (request) => {
  try {
     let uid = request.data.uid;
     if (!uid) throw new HttpsError("bad-request", "User ID required");
    const userRecord = await getAuth().getUser(request.data.uid);
    return userRecord?.toJSON();
  } catch (error) {
    logger.error(error.message);
    throw new HttpsError("unknown", error.message);
  }
});
exports.getuserbyemail = onCall(async (request) => {
  try {
     let email = request.data.email;
     if (!email) throw new HttpsError("bad-request", "Email address required");
    const userRecord = await getAuth().getUserByEmail(request.data.email);
    return userRecord?.toJSON();
  } catch (error) {
    logger.error(error.message);
    throw new HttpsError("unknown", error.message);
  }
});
exports.getuserbyphonenumber = onCall(async (request) => {
  try {
    let phone = request.data.phone;
    if (!phone) throw new HttpsError("bad-request", "Phone number required");
    if (isPhoneNumber(phone)) phone = formatPhoneNumber(phone);
    //if (!phone)throw new HttpsError("bad-request", "Phone number not valid");

    const userRecord = await getAuth().getUserByPhoneNumber(phone);
    return userRecord?.toJSON();
  } catch (error) {
    //logger.error(error.message);
    throw new HttpsError("unknown", error.message);
  }
});

exports.updateuser = onCall(async (request) => {
  if (request?.auth?.token?.admin !== true)
    throw "Admin previaledge is needed to update user.";
  const uid = request.data.uid;
  const data = {};
  /*const {
    email,
    phoneNumber,
    emailVerified,
    password,
    displayName,
    photoURL,
    disabled,
  } = request.data;*/

  Object.keys(request.data).forEach((k) => {
    if (request.data[k] && k !== "uid") {
      data[k] = request.data[k];
    }
  });
  try {
    await getAuth().updateUser(uid, {
      ...data,
    });
  } catch (e) {
    logger.error(error.message);
    throw new HttpsError("unknown", error.message);
  }
});

exports.addunit = onCall(async (request) => {
  // try {
  if (!request.auth?.token?.admin) {
    throw new HttpsError(
      "permission-denied",
      `Units can be created only by logged in admin`
    );
  }
  let data = request.data;

  let snapshot = await getFirestore().collection("Units").add(data);
  return snapshot.id;
  //} catch (error) {
  //logger.error(error);
  //throw new HttpsError("unknown", error.message);
  //}
});

exports.addipo = onCall(async (request) => {
  try {
    if (!request.auth?.token?.admin) {
      throw new HttpsError(
        "permission-denied",
        `IPOs can be created only by logged in admin`
      );
    }
    if (!request.data.Email || !request.data.Phone || !request.data.Name) {
      throw new HttpsError("bad-request", `No email address to register`);
    }
    let Level = 2;
    let data = request.data;
    let password = "password1";
    data.Level = Level;
    const userRecord = await createUser(
      data.Email,
      password,
      data.Phone,
      data.Name,
      false
      //data.photoURL || "https://example.com/123/photo.jpg"
    );
    // Create the user
    await getFirestore()
      .collection("Users")
      .doc(userRecord.uid)
      .set({
        uid: userRecord.uid,
        ...data,
      });
    setCustomClaims(userRecord.uid, data);
    return userRecord.uid;
  } catch (error) {
    logger.error(error);
    throw new HttpsError("unknown", error.message);
  }
});

exports.adduser = onCall(async (request) => {
  try {
    let Level = 1;
    let data = request.data;
    data.Level = Level;
    let password = "password1";
    if (!request.data.Email || !request.data.Phone || !request.data.Name) {
      throw new HttpsError(
        "bad-request",
        `No email address, phone number of name to register`
      );
    }
    const userRecord = await createUser(
      data.Email,
      password,
      data.Phone,
      data.Name,
      false
      //data.photoURL || "https://example.com/123/photo.jpg"
    );
    // Create the user
    await getFirestore()
      .collection("Users")
      .doc(userRecord.uid)
      .set({
        uid: userRecord.uid,
        ...data,
      });
    setCustomClaims(userRecord.uid, data);
    return userRecord.uid;
  } catch (error) {
    logger.error(error);
    throw new HttpsError("unknown", error.message);
  }
});

exports.sendtextmessage = onCall(async (request) => {
  const { to, from, body } = request.data;
  if (!isPhoneNumber(to) || !isPhoneNumber(from)) {
    throw new Error("Inalid phone number detected");
  }
  sendMessage({ to, from, body }, (err, info) => {
    //if (err) return err;
    //if (info) return info;
  });
});

exports.setuserrights = onCall(async (request) => {
  try {
    if (!request.auth?.token?.admin) {
      throw new HttpsError(
        "permission-denied",
        `User can be updated only by logged in admin`
      );
    }
    let _collection = "Users";
    let user = await getAuth().getUser(request.data.uid);
    if (user) {
      let promises = [
        getAuth().updateUser(user.uid, {
          disabled: request.data?.Disabled || false,
        }),
        getAuth().setCustomUserClaims(user.uid, {
          ...request.data?.claims,
        }),
        getFirestore().collection(_collection).doc(request.data.uid),
      ];
      const [u, c, profile] = await Promise.all(promises);
      if (profile) {
        profile.update({
          Active: request.data?.Disabled ? false : true,
          Admin: request.data?.IaAdmin || false,
          //CanEditMail: request.data?.CanEditMail || false,
          //CanEditPayment: request.data?.CanEditPayment || false,
          //CanConfirmPayment: request.data?.CanConfirmPayment || false,
        });
      }
    }
  } catch (error) {
    logger.error(error);
    throw new HttpsError("unknown", error.message);
  }
});

exports.beforeusersignin = beforeUserSignedIn(async (event) => {
  const user = event.data;
  const { email, uid, displayName } = user;
  //let snapshot = await getFirestore().collection(_collection).get();
  if (email === "armyanthonyabah@yahoo.co.uk") {
    const claims = event.data.customClaims || {
      //displayName: displayName || email,
      admin: true,
      developer: true,
      units: [],
      level: 5,
    };
    if (!claims.level) {
      claims.level = 5;
      claims.admin = true;
      claims.developer = true;
      claims.units = [];
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
  }
});

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

    if (!isPhoneNumber(data.ContactPhone)) return;
    const to = formatPhoneNumber(data.ContactPhone);
    const from = SENDER_ID;
    //const documentId = data.id;
    const link = `${BASE_URL}/applications`;
    const body = `Your application for destruction received. Visit ${link} to view status`;
    sendMessage({ to, from, body }, (err, info) => {
      if (err) console.log(err);
    });
  }
);
exports.oncasecreated = onDocumentCreated("Cases/{id}", async (event) => {
  try {
    const snapshot = event.data;
    const id = event.params.id;
    if (!snapshot) {
      return;
    }
    const CaseNumber = await getNextCaseNumber();
    //const data = { CaseNumber };
    getFirestore()
      .doc("Cases/" + id)
      .update({ CaseNumber });
  } catch (error) {
    logger.error(error);
  }
});
exports.onusercreated = onDocumentCreated("Users/{uid}", async (event) => {
  const snapshot = event.data;
  const uid = event.params.uid;
  if (!snapshot) {
    return;
  }
  const data = snapshot.data();
  //getAuth.getUser(uid)
  getAuth()
    .setCustomUserClaims(uid, {
      //displayName: displayName || email,
      units: data.Units || [],
      level: data.Level || 0,
      admin: data.IsAdmin || false,
      location: data.Location || "",
      role: data.Role || "public",
    })
    .catch((e) => {
      logger.log(e.message);
    });
  if (!data.Email) return;
  sendPasswordResetEmail(data.Email, data.Name).catch((e) =>
    logger.log(e.message)
  );
});

exports.oncommentcreated = onDocumentCreated(
  "{collectionId}/{docId}/Minutes/{minuteId}",
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
    sendMessage({ to, from, body }, (err, info) => {
      // for production comment || info
      if (err || info) {
        sendCustomEmail(
          receiverEmail,
          "Document waiting",
          snapshot.to,
          body,
          body,
          link,
          "Open document"
        ).catch((e) => {});
      }
      //if (info) return info;
    });
  }
);

exports.oncomplaintcreated = onDocumentCreated(
  "Complaints/{sid}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      //console.log("No data associated with the event");
      return;
    }
    const data = snapshot.data();
    if (!isPhoneNumber(data.Phone)) return;
    const to = formatPhoneNumber(data.Phone);
    const from = SENDER_ID;
    //const documentId = data.id;
    const link = `${BASE_URL}/applications`;
    const body = `Your complaint received. Visit. ${link} to view status`;
    sendMessage({ to, from, body }, (err, info) => {
      //if (err) console.log(err);
    });
  }
);

async function addHistory(
  operation,
  collection,
  documentId,
  historyId,
  data,
  transaction,
  uid,
  user
) {
  //const user = await getAuth().getUser(uid);
  const d = {
    op: operation,
    time: Date.now(),
    coll: collection,
    doc: documentId,
    user: user,
    uid,
    ...data,
  };
  const _ref = getFirestore().doc(
    collection + "/" + documentId + "/" + "History" + "/" + historyId
  );

  return transaction.set(_ref, d);
}
exports.updatedocument = onCall(async (request) => {
  try {
    let Level = request.auth?.token?.level;
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
    /*if (collection === "Cases") {
      const caseNumber = await getNextCaseNumber();
      payload.CaseNumber = caseNumber;
    }*/
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

const {
  onCall,
  onRequest,
  HttpsError,
} = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const { logger } = require("firebase-functions");
const DOMAIN = "aniims.net";
const BASE_URL = "https://aniims.net";
const ACTION_URL = "https://aniims.net/";

function formatPhoneNumber(number) {
  return number ? number.toString().replace(/^0/, "+234") : "";
}
function isPhoneNumber(data) {
  if (!data) return false;
  const regEx = new RegExp(/^(\+234)?[0-9]+/);
  return regEx.test(data.toString());
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
async function sendEmailRecoveryEmail(receiverEmail, recipientName) {
  const sendEmail = require("./emailservice.js").sendEmail;
  const link = await getAuth().generateVerifyAndChangeEmailLink(
    receiverEmail,
    {
      url: ACTION_URL + "action/?email=" + receiverEmail,
    } //actionCodeSettings
  );
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
const sendPasswordResetEmail = (exports.sendPasswordResetEmail =
  async function (receiverEmail, recipientName) {
    const sendEmail = require("./emailservice.js").sendEmail;
    const link = await getAuth().generatePasswordResetLink(
      receiverEmail,
      {
        url: ACTION_URL + "action/?email=" + receiverEmail,
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
  });

const sendVerifyEmailLink = async function (receiverEmail, recipientName) {
  const link = await getAuth().generateEmailVerificationLink(
    receiverEmail,
    {
      url: ACTION_URL + "action/?email=" + receiverEmail,
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
    const info = await sendEmailRecoveryEmail(
      userRecord.email,
      userRecord.displayName
    );
    return info;
  } catch (error) {
    logger.log(error);
    throw new HttpsError("unknown", error.message);
  }
});

exports.register = onCall(async (request) => {
  try {
    if (!request.auth?.uid || !request.auth.token.admin) {
      throw new HttpsError(
        "permission-denied",
        `Staff user can be created only by logged in admin`
      );
    }
    if (!request.data.email || !request.Phone || !request.Name) {
      throw new HttpsError("bad-request", `No email address to register`);
    }
    let Level = 3;
    //let Category = "Staff";
    let data = request.data;
    let password = "password1";
    const userRecord = await createUser(
      data.Email,
      password,
      data.Phone,
      data.Name,
      false
      //data.photoURL || "https://example.com/123/photo.jpg"
    );
    let TenantId = data.Email;
    //console.log(data.Roles);

    if (data.Roles?.includes("HOD")) {
      TenantId = "Divisional Head";
    } else if (data.Roles?.includes("HOU")) {
      TenantId = "Unit Head";
    } else if (data.Roles?.includes("Director")) {
      TenantId = "Director";
    } else {
      TenantId = data.email;
    }
    await getFirestore()
      .collection("Users")
      .doc(userRecord.uid)
      .set({
        Level,
        TenantId,
        uid: userRecord.uid,
        ...data,
      });

    await sendVerifyEmailLink(userRecord.email, userRecord.displayName);
    //await sendPasswordResetEmail(userRecord.email, userRecord.displayName);
    return userRecord;
  } catch (error) {
    logger.error(error);
    throw new HttpsError("unknown", error.message);
  }
});

exports.getuseremail = onCall(async (request) => {
  try {
    if (
      !request.data?.id ||
      //!request.data?.password
      !request.data?.role
    )
      throw new HttpsError(
        "permission-denied",
        "User data required",
        "Username, password, role required"
      );
    //console.log(request.data);
    const id = request.data?.id;
    const role = request.data?.role?.toLowerCase();
    let _collection = "public";
    let filter = ["Email", "==", id];
    switch (role) {
      case "staff":
        _collection = "Staff";
        filter = ["StaffId", "==", id.toUpperCase()];
        break;
      case "ipo":
        _collection = "IPO";
        filter = ["Phone", "==", id];
        break;
      case "company":
        _collection = "Companies";
        filter = ["Email", "==", id.toLowerCase()];
        break;
      default:
    }
    const snapshot = await getFirestore()
      .collection(_collection)
      .where(...filter)
      .get();
    if (snapshot.empty) {
      throw new HttpsError("permission-denied", `User id '${id}' not found`);
      //return null;
    } else {
      let data = snapshot.docs[0]?.data();
      return data.Email;
    }
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

exports.getuser = onCall(async (request) => {
  try {
    const userRecord = await getAuth().getUser(request.data.uid);
    return userRecord?.toJSON();
  } catch (error) {
    logger.error(error.message);
    throw new HttpsError("unknown", error.message);
  }
});
exports.getuserbyemail = onCall(async (request) => {
  try {
    const userRecord = await getAuth().getUserByEmail(request.data.email);
    return userRecord?.toJSON();
  } catch (error) {
    logger.error(error.message);
    throw new HttpsError("unknown", error.message);
  }
});
exports.getuserbyphonenumber = onCall(async (request) => {
  try {
    const userRecord = await getAuth().getUserByPhoneNumber(request.data.phone);
    return userRecord?.toJSON();
  } catch (error) {
    logger.error(error.message);
    throw new HttpsError("unknown", error.message);
  }
});
exports.updateuser = onCall(async (request) => {
  if (request.auth.token.admin !== true) return;
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
  try {
    if (!request.auth?.token?.admin) {
      throw new HttpsError(
        "permission-denied",
        `Units can be created only by logged in admin`
      );
    }
    let data = request.data;

    return await getFirestore().collection("Units").add(data);
  } catch (error) {
    logger.error(error);
    throw new HttpsError("unknown", error.message);
  }
});
exports.addipo = onCall(async (request) => {
  try {
    if (!request.auth?.token?.admin) {
      throw new HttpsError(
        "permission-denied",
        `IPOs can be created only by logged in admin`
      );
    }
    if (!request.data.email || !request.data.Phone || !request.data.Name) {
      throw new HttpsError("bad-request", `No email address to register`);
    }
    let Level = 0;
    let data = request.data;
    let password = "password1";

    const userRecord = await createUser(
      data.Email,
      password,
      data.Phone,
      data.Name,
      false
      //data.photoURL || "https://example.com/123/photo.jpg"
    );
    let TenantId = data.Email;
    //console.log(data.Roles);
    await getFirestore()
      .collection("Users")
      .doc(userRecord.uid)
      .set({
        Level,
        TenantId,
        uid: userRecord.uid,
        ...data,
      });

    await sendVerifyEmailLink(userRecord.email, userRecord.displayName);
    //await sendPasswordResetEmail(userRecord.email, userRecord.displayName);
    return userRecord;
  } catch (error) {
    logger.error(error);
    throw new HttpsError("unknown", error.message);
  }
});

exports.addcompany = onCall(async (request) => {
  try {
    let Level = 0;
    // let Role = "Public";
    let data = request.data;
    let password = "password1";
    if (!request.data.email || !request.data.Phone || !request.data.Name) {
      throw new HttpsError("bad-request", `No email address to register`);
    }
    const userRecord = await createUser(
      data.Email,
      password,
      data.Phone,
      data.Name,
      false
      //data.photoURL || "https://example.com/123/photo.jpg"
    );
    let TenantId = data.Email;
    //console.log(data.Roles);
    await getFirestore()
      .collection("Users")
      .doc(userRecord.uid)
      .set({
        Level,
        TenantId,
        uid: userRecord.uid,
        ...data,
      });

    await sendVerifyEmailLink(userRecord.email, userRecord.displayName);
    //await sendPasswordResetEmail(userRecord.email, userRecord.displayName);
    return userRecord;
  } catch (error) {
    logger.error(error);
    throw new HttpsError("unknown", error.message);
  }
});
/*exports.verifyIdToken = onCall(async (request) => {
  // idToken comes from the client app
  return await getAuth().verifyIdToken(request.data.idToken);
});*/

/*exports.registeruser = onCall(async (request) => {
  try {
    if (!request.data.username || !request.data.password || !request.data.role)
      throw new HttpsError(
        "permission-denied",
        "User data required",
        "Username, password, role required"
      );
    const id = request.data?.username;
    const password = request.data?.password;
    const role = request.data?.role?.toLowerCase();
    let _collection = "public";
    let filter = ["Email", "==", id];
    let level = 0;
    switch (role) {
      case "staff":
        _collection = "Staff";
        level = 3;
        filter = ["StaffId", "==", id.toUpperCase()];
        break;
      case "ipo":
        _collection = "Ipos";
        level = 2;
        filter = ["Phone", "==", id];
        break;
      case "company":
      // _collection = "Companies";
      // level = 1;
      // filter = ["Email", "==", id.toLowerCase()];
      // break;
      default:
        level = 0;
    }
    const snapshot = await getFirestore()
      .collection(_collection)
      .where(...filter)
      .get();
    if (snapshot.empty) {
      throw new HttpsError(
        "permission-denied",
        `User id '${id}' is blocked from registering because the ID is not in our database`
      );
    } else {
      let data = snapshot.docs[0].data();
      const uid = snapshot.docs[0].id;
      const userRecord = await createUser(
        data.Email,
        password,
        data.Phone,
        data.Name
        //data.photoURL || "https://example.com/123/photo.jpg"
      );
      await getAuth().setCustomUserClaims(uid, {
        level,
      });

      await getFirestore()
        .collection("Users")
        .doc(uid)
        .set({
          roles: data.Roles || ["Public"],
          level,
        });
      const link = await getAuth().generateEmailVerificationLink(
        data.Email,
        {
          url: ACTION_URL + "?email=" + request.data.email,
        } //actionCodeSettings
      );
      await sendVerifyEmailLink(data.Email, userRecord.displayName, link);
      return userRecord;
    }
  } catch (error) {
    logger.error(error);
    throw new HttpsError("unknown", error.message);
  }
});*/

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");

const { logger } = require("firebase-functions");
//const ACTION_URL = "https://aniims.net/";
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
    //setCustomClaims(userRecord.uid, data);
    return userRecord.uid;
  } catch (error) {
    logger.error(error);
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
exports.deleteusers = onCall(async (request) => {
  try {
    return await deleteUsers(request.data.uids);
  } catch (error) {
    logger.error(error.message);
    throw new HttpsError("unknown", error.message);
  }
});
exports.deleteuser = onCall(async (request) => {
  try {
    await getAuth().deleteUser(request.data.uid);
    let result = await getFirestore()
      .collection("Users")
      ?.doc(request.data.uid)
      ?.delete();
    return result;
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
    let { uid, email, phone } = request.data;
    let userRecord = null;
    if (uid) {
      //if (!uid) throw new HttpsError("bad-request", "User ID required");
      userRecord = await getAuth().getUser(request.data.uid);
    } else if (email) {
      userRecord = await getAuth().getUserByEmail(request.data.email);
    } else if (phone) {
      if (isPhoneNumber(phone)) phone = formatPhoneNumber(phone);
      userRecord = await getAuth().getUserByPhoneNumber(phone);
    }
    return userRecord?.toJSON();
  } catch (error) {
    logger.error(error.message);
    throw new HttpsError("unknown", error.message);
  }
});

/**
 * @param {string} uid The ID of the user
 * @param {object} data User data, at least one field must be present
 {
    email: 'modifiedUser@example.com',
    phoneNumber: '+11234567890',
    emailVerified: true,
    password: 'newPassword',
    displayName: 'Jane Doe',
    photoURL: 'http://www.example.com/12345678/photo.png',
    disabled: true,
  }
 */
exports.updateuser = onCall(async (request) => {
  if (request?.auth?.token?.admin !== true)
    throw "Admin previaledge is needed to update user.";
  const uid = request.data.uid;
  const data = Object.assign({}, request.data);
  delete data.uid;

  try {
    await getAuth().updateUser(uid, data);
    let _data = {};
    if (data.phone) {
      _data.Phone = data.phoneNumber;
    }
    if (data.email) {
      _data.Email = data.email;
    }
    if (!data.phone && !data.email) return;
    await getFirestore()
      .collection("Users")
      .doc(uid)
      .set(_data, { merge: true });
    //.update()
    //.where("id", "==", uid).get()
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
    //setCustomClaims(userRecord.uid, data);
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
    //setCustomClaims(userRecord.uid, data);
    return userRecord.uid;
  } catch (error) {
    logger.error(error);
    throw new HttpsError("unknown", error.message);
  }
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

exports.resetpassword = onCall(async (request) => {
  if (!request.data?.email)
    throw new HttpsError("bad-request", "Email required");
  try {
    const userRecord = await getAuth().getUserByEmail(request.data.email);
    if (!userRecord) {
      throw new HttpsError("invalid-argument", "User record not found");
    }
    const sendPasswordResetEmail =
      require("./password-reset-email.js").sendPasswordResetEmail;
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

/*
async function sendEmailRecoveryEmail(accountEmail, newEmail, recipientName) {
  const sendEmail = require("./emailservice.js").sendEmail;
  const link = await getAuth().generateVerifyAndChangeEmailLink(
    accountEmail,
    newEmail
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
  const info = await sendEmail(accountEmail, options);
  //logger.info("Message sent: %s", receiverEmail, info);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  return info;
}
exports.getuserbyemail = onCall(async (request) => {
  try {
    let email = request.data.email;
    let phone = request.data.phone;
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

const sendVerifyEmailLink = async function (accountEmail, recipientName) {
  const link = await getAuth().generateEmailVerificationLink(
    accountEmail,
    {
      url: ACTION_URL + "action/?email=" + accountEmail,
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
  const info = await sendEmail(accountEmail, options);
  //logger.info("Message sent: %s", receiverEmail, info);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  return info;
};*/

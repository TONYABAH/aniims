const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getAuth } = require("firebase-admin/auth");
const { logger } = require("firebase-functions");
//const BASE_URL = require("./baseurl.js").BASE_URL;

exports.resetpassword = onCall(async (request) => {
  if (!request.data?.email)
    throw new HttpsError("bad-request", "Email required");
  try {
    const userRecord = await getAuth().getUserByEmail(request.data.email);
    if (!userRecord) {
      throw new HttpsError("invalid-argument", "User record not found");
    }
    /*const link = await getAuth().generatePasswordResetLink(request.data.email, {
      url: BASE_URL + request.data.email,
    });*/
    const sendPasswordResetEmail =
      require("./password-reset-email.js").sendPasswordResetEmail;
    const info = await sendPasswordResetEmail(
      userRecord.email,
      userRecord.displayName
    );
    //console.log(info);
    return info;
  } catch (error) {
    logger.log(error);
    throw new HttpsError("unknown", error.message);
  }
});

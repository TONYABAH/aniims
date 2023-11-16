const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getAuth } = require("firebase-admin/auth");
const { logger } = require("firebase-functions");
const { BASE_URL } = require("./__baseurl.js");

async function sendPasswordResetEmail(receiverEmail, recipientName, link) {
  const sendEmail = await (await import("./emailservice.js")).sendEmail;
  const options = {
    title: "Password reset",
    message:
      "Hi, " + recipientName + ", you have requested for password reset.",
    message2:
      "Please confirm your action by visiting the following link below to create a new password.",
    link,
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
    const link = await getAuth().generatePasswordResetLink(request.data.email, {
      email: BASE_URL,
    });
    const info = await sendPasswordResetEmail(
      userRecord.email,
      userRecord.displayName,
      link
    );
    return info;
  } catch (error) {
    logger.log(error);
    throw new HttpsError("unknown", error.message);
  }
});

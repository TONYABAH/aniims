const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getAuth } = require("firebase-admin/auth");
const { logger } = require("firebase-functions");
const { BASE_URL } = require("./baseurl.js");

async function sendPasswordResetEmail(receiverEmail, recipientName, link) {
  const sendEmail = require("./emailservice.js").sendEmail;
  const options = {
    title: "Recover email",
    message:
      "Hi, " +
      recipientName +
      ", you have requested to recover yoour email to previous.",
    message2:
      "Please confirm your action by visiting the following link below to restore your account with previous email.",
    link,
  };
  const info = await sendEmail(receiverEmail, options);
  //logger.info("Message sent: %s", receiverEmail, info);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  return info;
}
exports.recoveremail = onCall(async (request) => {
  if (!request.data?.email)
    throw new HttpsError("bad-request", "Email required");
  try {
    const userRecord = await getAuth().getUserByEmail(request.data.email);
    if (!userRecord) {
      throw new HttpsError("invalid-argument", "User record not found");
    }
    const link = await getAuth().generateVerifyAndChangeEmailLink(
      request.data.email,
      {
        url: BASE_URL,
      }
    );
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

const { getAuth } = require("firebase-admin/auth");
const BASE_URL = require("./baseurl.js").BASE_URL;

exports.sendPasswordResetEmail = async function (accountEmail, recipientName) {
  const sendEmail = require("./emailservice.js").sendEmail;
  const link = await getAuth().generatePasswordResetLink(
    accountEmail,
    {
      url: BASE_URL + "?email=" + accountEmail,
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
  const info = await sendEmail(accountEmail, options);
  //logger.info("Message sent: %s", receiverEmail, info);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  return info;
};

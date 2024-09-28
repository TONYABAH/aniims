const { getAuth } = require("firebase-admin/auth");
const BASE_URL = require("./baseurl.js").BASE_URL;

exports.sendPasswordResetEmail = async function (accountEmail, receiverName) {
  const sendEmail = require("./emailservice.js").sendEmail;
  var link = await getAuth().generatePasswordResetLink(
    accountEmail,
    {
      url: BASE_URL + "?email=" + accountEmail,
    } //actionCodeSettings
  );
  //var link = "https://aniims.net";
  const options = {
    title: "Recover password",
    subject: "Recover password",
<<<<<<< Updated upstream
    receiverName,
    to: accountEmail,
    senderEmail: "noreply@aniims.net",
    message:
      "You have requested to reset your account password. Please confirm your action by visiting the following link below to complete password recovery.",
=======
    name: recipientName,
    email: accountEmail,
    message: "You have requested to reset your account password.",
    message2:
      "Please confirm your action by visiting the following link below to complete password recovery.",
>>>>>>> Stashed changes
    link,
    button: "Reset my password",
    type: "password-reset",
  };
  const info = await sendEmail(accountEmail, options);
  //logger.info("Message sent: %s", receiverEmail, info);
  console.info("Message sent: %s", accountEmail);
  //Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  return info;
};

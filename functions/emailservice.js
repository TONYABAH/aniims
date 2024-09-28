//const Nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const path = require("path");
const fs = require("fs");

//const { fileURLToPath } = require("url");
//const filename = fileURLToPath(import.meta.url);
//const dirname = path.dirname(filename);
const MAILTRAP_SANDBOXTOKEN = "23006c7a9fc0c8bce33981cbce58f32d";
var transporter = null;

exports.MESSAGE_TYPE = {
  PASSWORD_RESET: "password-reset",
  EMAIL_VERIFY: "verify-email",
  EMAIL_LOGIN: "login",
  EMAIL_COMPLAINT: "complaint",
  EMAIL_DESTRUCTION: "destruction",
};

const env = {
  PORT: 3000,
  ADMIN_EMAIL: "support@aniims.net",
  SUPPORT_EMAIL: "support@aniims.net",
  NOREPLY_EMAIL: "no-reply@aniims.net",
};

//const MAILTRAP_SANDBOX = "15a7452b0e1ba686cb21f78c4ce52cdc";

function getTemplate(template) {
  let link = "email.html";
  switch (template) {
    case "password-reset":
      link = "password.html";
<<<<<<< Updated upstream
    //break;
    case "verify-email":
      link = "form.html";
    //break;
    case "login":
      link = "action.html";
    //break;
    case "complaint":
      link = "action.html";
    //break;
    case "destruction":
      link = "lean.html";
=======
      break;
    case "verify-email":
      link = "form.html";
      break;
    case "login":
      link = "action.html";
      break;
    case "complaint":
      link = "action.html";
      break;
    case "destruction":
      link = "action.html";
>>>>>>> Stashed changes
      break;
    default:
      link = "form.html";
  }
  const filePath = path.join(__dirname, "./templates/" + link);
  const source = fs.readFileSync(filePath, "utf-8").toString();
  const _template = handlebars.compile(source);
  return _template;
}
/**
 *
 * @param {*} to recipient email
 * @param {*} data {title, message, message second line, = require(email}
 * @returns Promise fullfilled with info about the email sent.
 */
exports.sendEmail = async function (to, data) {
  data.year = new Date().getFullYear();

  let htmlToSend = getTemplate(data.type || "")(data);
  //console.log(htmlToSend);
  const { sendMail } = require("./zeptomail");
<<<<<<< Updated upstream
  //try {
  var info = await sendMail(
    to,
    data.receiverName || "",
    "support@aniims.net",
    data.senderName || "Aniims Team",
    {
      //fromAddress: data.from || "support@aniims.net",
      //fromName: data.senderName || "Aniims Team",
      //toAddress: to,
      //toName: data.recipientName,
      subject: data.subject,
      text: data.message,
      html: htmlToSend,
      //headers: { "x-myheader": "test header" },
    },
    true
  );
  //console.log(info);
  return info;
  /*} catch (e) {
    console.log(JSON.stringify(e));
  }*/
=======
  try {
    var info = await sendMail(
      {
        fromAddress: data.from || "support@aniims.net",
        fromName: data.senderName || "Aniims Team",
        toAddress: to,
        toName: data.recipientName,
        subject: data.subject,
        text: data.message + " " + data.message2,
        html: htmlToSend,
        //headers: { "x-myheader": "test header" },
      },
      false
    );
    //console.log(info);
    return info;
  } catch (e) {
    console.log(e);
  }
>>>>>>> Stashed changes
};

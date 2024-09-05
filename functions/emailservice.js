const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const path = require("path");
const fs = require("fs");
//const { fileURLToPath } = require("url");
//import { logger } = require("firebase-functions/v2";
//const filename = fileURLToPath(import.meta.url);
//const dirname = path.dirname(filename);

var transporter = null;

const env = {
  PORT: 3000,
  ADMIN_EMAIL: "support@aniims.net",
  REPLY_EMAIL: "support@aniims.net",
  PORT: 465,
  USER: "support@aniims.net",
  PWD: "v&&b.'_IZX{q)R*",
  HOST: "smtp.titan.email",
  GMAIL_PORT: 587,
  GMAIL_USER: "tonyarmyabah@gmail.com",
  GMAIL_PWD: "ahbrggdybwvosjdj" || "qnsgnzeyoyevcaac",
  GMAIL_HOST: "smtp.gmail.com",
  mailtrap_user: "6ec6e4fa98b8d4",
  mailtrap_pwd: "83f7c4300ab8ab",
  mailtrap_host: "sandbox.smtp.mailtrap.io",
  mailtrap_port: 2525,
  SENDGRID_API_KEY:
    "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",
  SENDGRID_SMTP_API_KEY:
    "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",
};

exports.MESSAGE_TYPE = {
  PASSWORD_RESET: "password-reset",
  EMAIL_VERIFY: "verify-email",
  EMAIL_LOGIN: "login",
  EMAIL_COMPLAINT: "complaint",
  EMAIL_DESTRUCTION: "destruction",
};

function getTemplate(template) {
  let link = "email.html";
  switch (template) {
    case "password-reset":
      link = "actionemail.html";
      break;
    case "verify-email":
      link = "verifyemail.html";
      break;
    case "login":
      link = "email.html";
      break;
    case "complaint":
      link = "complaint.html";
      break;
    case "destruction":
      link = "destruction.html";
      break;
    default:
      link = "email_lean.html";
  }
  const filePath = path.join(__dirname, "./templates/" + link);
  const source = fs.readFileSync(filePath, "utf-8").toString();
  const _template = handlebars.compile(source);
  return _template;
}
/**
 *
 * @param {*} to recipient email
 * @param {*} link link to verify
 * @param {*} params {title, message, message second line, = require(email}
 * @returns Promise fullfilled with info about the email sent.
 */
exports.sendEmail = async function (
  to,
  {
    title,
    message,
    message2,
    link,
    type,
    from = '"Investigation and Enforcement" <' + env.REPLY_EMAIL + ">",
    button,
    recipientName,
  }
) {
  const replacements = {
    title,
    message,
    message2,
    link,
    button,
    recipientName,
    email: to,
    year: new Date().getFullYear(),
  };

  let htmlToSend = getTemplate(type)(replacements);
  const GMAIL = {
    host: env.GMAIL_HOST,
    port: env.GMAIL_PORT,
    auth: {
      user: env.GMAIL_USER,
      pass: env.GMAIL_PWD,
    },
  };
  transporter =
    transporter ||
    nodemailer.createTransport(
      GMAIL || {
        host: env.mailtrap_host,
        port: env.mailtrap_port,
        auth: {
          user: env.mailtrap_user,
          pass: env.mailtrap_pwd,
        },
      }
    );
  const info = await transporter.sendMail({
    from,
    to,
    subject: replacements.title,
    text: replacements.message + " " + replacements.message2,
    link,
    html: htmlToSend,
    //headers: { "x-myheader": "test header" },
  });
  //logger.log("Message sent: %s", to, info);
  //Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  return info;
};

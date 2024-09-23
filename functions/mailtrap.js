//import { MailtrapClient } from "mailtrap";
const { MailtrapClient } = require("mailtrap");
const config = {
  MAILTRAP_TOKEN: "f02a03f6eb5604b9b15c3a2cf105eb7b",
  mailtrap_user: "6ec6e4fa98b8d4",
  mailtrap_pwd: "83f7c4300ab8ab",
  mailtrap_host: "sandbox.smtp.mailtrap.io",
  mailtrap_port: 2525,
};
/**
 * For this example to work, you need to set up a sending domain,
 * and obtain a token that is authorized to send from the domain.
 */
exports.sendEmail = (data) => {
  const TOKEN = "f02a03f6eb5604b9b15c3a2cf105eb7b";
  const SENDER_EMAIL = "admin@aniims.net";
  const RECIPIENT_EMAIL = data.receiverEmail;

  const client = new MailtrapClient({ token: TOKEN });

  const sender = { name: "ANIIMS Team", email: SENDER_EMAIL };

  client
    .send({
      from: sender,
      to: [{ email: RECIPIENT_EMAIL }],
      subject: data.subject,
      text: data.text,
      html: data.html,
    })
    .then(console.log)
    .catch(console.error);
};

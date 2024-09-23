const brevo = require("@getbrevo/brevo");
const Nodemailer = require("nodemailer");
let defaultClient = brevo.ApiClient.instance;

let apiKey = defaultClient.authentications["apiKey"];
apiKey.apiKey =
  "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";

let apiInstance = new brevo.TransactionalEmailsApi();
let sendSmtpEmail = new brevo.SendSmtpEmail();

//transporter = transporter || Nodemailer.createTransport(BREVO);
const BREVO = {
  host: "smtp-relay.brevo.com",
  port: 587,
  //secure: true,
  auth: {
    user: "7c5829001@smtp-brevo.com",
    pass: "v6KLQ9Xd2t0SDCfc",
  },
};

sendSmtpEmail.subject = "My {{params.subject}}";
sendSmtpEmail.htmlContent =
  "<html><body><h1>Common: This is my first transactional email {{params.parameter}}</h1></body></html>";
sendSmtpEmail.sender = { name: "John", email: "example@example.com" };
sendSmtpEmail.to = [{ email: "tonyarmyabah@gmail.com", name: "Tony" }];
sendSmtpEmail.replyTo = { email: "support@aniims.com", name: "Anthony" };
sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
sendSmtpEmail.params = {
  parameter: "My param value",
  subject: "common subject",
};

apiInstance.sendTransacEmail(sendSmtpEmail).then(
  function (data) {
    console.log(
      "API called successfully. Returned data: " + JSON.stringify(data)
    );
  },
  function (error) {
    console.error(error);
  }
);

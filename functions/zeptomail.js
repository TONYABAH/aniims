//const { MailtrapTransport } = require("mailtrap");
<<<<<<< Updated upstream
async function sendByAPI(to, toName, from, fromName, data) {
=======
async function sendByAPI(data) {
>>>>>>> Stashed changes
  // https://www.npmjs.com/package/zeptomail
  // For ES6
  //import { SendMailClient } from "zeptomail";
  // For CommonJS
  var { SendMailClient } = require("zeptomail");

  const url = "api.zeptomail.com/";
  const token =
<<<<<<< Updated upstream
    "Zoho-enczapikey wSsVR61y/kKmW6ovnmGuJegwzwxXAFmiFUt1jASjuXauFv6T9McylhWbV1PxSfgcRWZoEzNE9ugtmktW2mJb2dksmApUACiF9mqRe1U4J3x17qnvhDzPWGlUkBCJL4gAzwtsmWliFcAi+g==";
  let client = new SendMailClient({ url, token });
  //console.log(data.toAddress);
  return await client.sendMail({
    from: {
      address: from || "admin@aniims.net",
      name: fromName || "noreply",
=======
    "Zoho-enczapikey wSsVR613+ELzB6goyDOoJbw9kFRSVl7/EU102lb0uCL+T6jC9Mc/lkGdBQKnHvkXFmc/EzAao+gqmhxR1DYIi9wqygpVDSiF9mqRe1U4J3x17qnvhDzNWW9YmhOLLo8KxgVomWBkFc4g+g==";
  let client = new SendMailClient({ url, token });
  //console.log(data);
  return await client.sendMail({
    from: {
      address: data.fromAddress || "admin@aniims.net",
      name: data.fromName || "noreply",
>>>>>>> Stashed changes
    },
    to: [
      {
        email_address: {
<<<<<<< Updated upstream
          address: to,
          name: toName || "",
=======
          address: data.toAddress,
          name: data.toName || "",
>>>>>>> Stashed changes
        },
      },
    ],
    subject: data.subject || "Test Email",
    htmlbody: data.html || "<div><b> Test email sent successfully.</b></div>",
  });
  //.then((resp) => console.log("success"))
  //.catch((error) => console.log("error"));
}

<<<<<<< Updated upstream
async function sendBySMTP(to, from, data) {
=======
async function sendBySMTP(data) {
>>>>>>> Stashed changes
  var nodemailer = require("nodemailer");
  var transport = nodemailer.createTransport({
    host: "smtp.zeptomail.com",
    port: 587,
<<<<<<< Updated upstream
    auth: {
      user: "support@aniims.net",
      pass: "wSsVR61x+UKjDqh+z2H5duhryAwBBVikHE972lHyuSD5T/DK88c8lhbLV1T1HaAZRzJpQmQW9718nhpV1GcMj9h7m1kGCiiF9mqRe1U4J3x17qnvhDzNX2RamxuJL44Bwghsn2ZlF8kh+g==",
=======
    secure: true,
    auth: {
      user: "support@aniims.net",
      //pass: "wSsVR613+ELzB6goyDOoJbw9kFRSVl7/EU102lb0uCL+T6jC9Mc/lkGdBQKnHvkXFmc/EzAao+gqmhxR1DYIi9wqygpVDSiF9mqRe1U4J3x17qnvhDzNWW9YmhOLLo8KxgVomWBkFc4g+g==",
      pass: "wSsVR613+ELzB6goyDOoJbw9kFRSVl7/EU102lb0uCL+T6jC9Mc/lkGdBQKnHvkXFmc/EzAao+gqmhxR1DYIi9wqygpVDSiF9mqRe1U4J3x17qnvhDzNWW9YmhOLLo8KxgVomWBkFc4g+g==",
>>>>>>> Stashed changes
    },
  });

  var mailOptions = {
<<<<<<< Updated upstream
    from: from || '"Aniims Team" <admin@aniims.net>',
    to: to,
    subject: data.subject || "Test Email",
    html: data.html || "Test email sent successfully.",
  };
  //console.log(mailOptions);
=======
    from: data.from || '"Aniims Team" <admin@aniims.net>',
    to: data.to,
    subject: data.subject || "Test Email",
    html: data.html || "Test email sent successfully.",
  };
>>>>>>> Stashed changes

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
<<<<<<< Updated upstream
    //console.log("Successfully sent", info);
=======
    console.log("Successfully sent", info);
>>>>>>> Stashed changes
    Promise.resolve(info);
  });
}

<<<<<<< Updated upstream
exports.sendMail = (to, toName, from, fromName, data, smtp) => {
  //console.log(data, smtp);
  if (smtp) {
    return sendBySMTP(to, `"${fromName}" <${from}>`, data);
  } else {
    return sendByAPI(to, toName, from, fromName, data);
=======
exports.sendMail = (data, smtp) => {
  //console.log(data, smtp);
  if (smtp) {
    return sendBySMTP(data);
  } else {
    return sendByAPI(data);
>>>>>>> Stashed changes
  }
};

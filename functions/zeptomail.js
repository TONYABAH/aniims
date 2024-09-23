//const { MailtrapTransport } = require("mailtrap");
async function sendByAPI(to, toName, from, fromName, data) {
  // https://www.npmjs.com/package/zeptomail
  // For ES6
  //import { SendMailClient } from "zeptomail";
  // For CommonJS
  var { SendMailClient } = require("zeptomail");

  const url = "api.zeptomail.com/";
  const token =
    "Zoho-enczapikey wSsVR61y/kKmW6ovnmGuJegwzwxXAFmiFUt1jASjuXauFv6T9McylhWbV1PxSfgcRWZoEzNE9ugtmktW2mJb2dksmApUACiF9mqRe1U4J3x17qnvhDzPWGlUkBCJL4gAzwtsmWliFcAi+g==";
  let client = new SendMailClient({ url, token });
  //console.log(data.toAddress);
  return await client.sendMail({
    from: {
      address: from || "admin@aniims.net",
      name: fromName || "noreply",
    },
    to: [
      {
        email_address: {
          address: to,
          name: toName || "",
        },
      },
    ],
    subject: data.subject || "Test Email",
    htmlbody: data.html || "<div><b> Test email sent successfully.</b></div>",
  });
  //.then((resp) => console.log("success"))
  //.catch((error) => console.log("error"));
}

async function sendBySMTP(to, from, data) {
  var nodemailer = require("nodemailer");
  var transport = nodemailer.createTransport({
    host: "smtp.zeptomail.com",
    port: 587,
    auth: {
      user: "support@aniims.net",
      pass: "wSsVR61x+UKjDqh+z2H5duhryAwBBVikHE972lHyuSD5T/DK88c8lhbLV1T1HaAZRzJpQmQW9718nhpV1GcMj9h7m1kGCiiF9mqRe1U4J3x17qnvhDzNX2RamxuJL44Bwghsn2ZlF8kh+g==",
    },
  });

  var mailOptions = {
    from: from || '"Aniims Team" <admin@aniims.net>',
    to: to,
    subject: data.subject || "Test Email",
    html: data.html || "Test email sent successfully.",
  };
  //console.log(mailOptions);

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    //console.log("Successfully sent", info);
    Promise.resolve(info);
  });
}

exports.sendMail = (to, toName, from, fromName, data, smtp) => {
  //console.log(data, smtp);
  if (smtp) {
    return sendBySMTP(to, `"${fromName}" <${from}>`, data);
  } else {
    return sendByAPI(to, toName, from, fromName, data);
  }
};

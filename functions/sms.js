const {
  onCall,
  //onRequest,
  HttpsError,
} = require("firebase-functions/v2/https");
const API_TOKEN =
  "asJfv3w5wRJs89muVmGPIl3v4qJ7m7Dja1X60rPsNlxlYV6sVwsqoQmFIXol";
const SMS_URL = "https://www.bulksmsnigeria.com/api/v1/sms/create?";
//const africaistalking_api_key = "fcec6cb7cbf0699b77660671507c207d6fa70a0791720bf75ae4d755f88b6466"
function isPhoneNumber(data) {
  if (!data) return false;
  const regEx = new RegExp(/^(\+234)?[0-9]+/);
  return regEx.test(data.toString());
}
function formatPhoneNumber(number) {
  return number ? number.toString().replace(/^0/, "234") : "";
}

const sendMessage = (data, callback) => {
  const https = require("https");
  const { to, from, body } = data;
  if (!isPhoneNumber(to)) {
    if (callback) callback("Inalid phone number.");
    return;
  }
  //https://www.bulksmsnigeria.com/api/v1/sms/create?";
  const query = `api_token=${API_TOKEN}&from=${from}&to=${to}&body=${body}`;
  const url = SMS_URL.concat(query);

  https
    .get(url, (resp) => {
      let data = "";
      // A chunk of data has been recieved.
      resp.on("data", (chunk) => {
        data += chunk;
      });
      // The whole response has been received. Print out the result.
      resp.on("end", () => {
        //console.log(data);
        try {
          let info = JSON.parse(data).message;
          if (callback) callback(null, info);
        } catch (e) {
          console.log(e.message);
        }
      });
    })
    .on("error", (err) => {
      console.log("Error: " + err.message);
      if (callback) callback(err, null);
    });
};

exports.sendsms = onCall(async (request) => {
  const { to, from, body } = request.data;
  if (!isPhoneNumber(to) || !isPhoneNumber(from)) {
    throw new Error("Inalid phone number detected");
  }
  sendMessage({ to, from, body }, (err, info) => {
    //if (err) return err;
    //if (info) return info;
  });
});
exports.sendMessage = sendMessage;

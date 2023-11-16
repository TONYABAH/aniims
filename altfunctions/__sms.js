const API_TOKEN =
  "asJfv3w5wRJs89muVmGPIl3v4qJ7m7Dja1X60rPsNlxlYV6sVwsqoQmFIXol";
function isPhoneNumber(data) {
  if (!data) return false;
  const regEx = new RegExp(/^(\+234)?[0-9]+/);
  return regEx.test(data.toString());
}
function formatPhoneNumber(number) {
  return number ? number.toString().replace(/^0/, "234") : "";
}
exports.sendMessage = function (data) {
  const https = require("https");
  const { to, from, body } = data;
  if (!isPhoneNumber(to) || !isPhoneNumber(from)) {
    throw new Error("Inalid phone number detected");
  }
  //const API_TOKEN = "asJfv3w5wRJs89muVmGPIl3v4qJ7m7Dja1X60rPsNlxlYV6sVwsqoQmFIXol";
  const uri = "https://www.bulksmsnigeria.com/api/v1/sms/create?";
  const query = `from=${from}&to=${to}&body=${body}&api_token=${API_TOKEN}`;
  const url = uri.concat(query);

  https
    .get(url, (resp) => {
      let data = "";
      // A chunk of data has been recieved.
      resp.on("data", (chunk) => {
        data += chunk;
      });
      // The whole response has been received. Print out the result.
      resp.on("end", () => {
        let url = JSON.parse(data).message;
        console.log(url);
      });
    })
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });
};

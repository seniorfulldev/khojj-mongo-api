const emailValidator = require("deep-email-validator");
const dns = require("dns");

const isEmailValid = async (email) => {
  return emailValidator.validate(email);
};

const mxValidate = async (e) => {
  return new Promise((resolve, reject) => {
        const domain = e.split("@")[1];
        dns.resolve(domain, "MX", function (err, addresses) {
          if (err) {
            resolve({error: "no MX record"});
          } else if (addresses && addresses.length > 0) {
            resolve(addresses);
          }
        });
  });
};

const emailvalidate = async (list) => {
  list.forEach((element) => {
    if (!element.email) {
      return;
    }
    element.email.map(async (validMail) => {
      const email =
        validMail.substr(-1) === "."
          ? validMail.substr(0, validMail.length - 1).toLocaleLowerCase()
          : validMail.toLocaleLowerCase();
      const { valid, reason, validators } = await isEmailValid(email);

      if (valid) {
        console.log(`email ${email} is validated.`);
      } else {
        console.log(`reason: ${validators[reason].reason}`);
      }
    });
  });
};
const Validate = {
  emailvalidate: emailvalidate,
  isEmailValid: isEmailValid,
  mxValidate: mxValidate,
};
module.exports = Validate;

const emailValidator = require("deep-email-validator");

const isEmailValid = async (email) => {
  return emailValidator.validate(email);
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

      console.log("valid", valid);
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
};
module.exports = Validate;

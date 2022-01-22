const sgMail = require("@sendgrid/mail");
module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email, // Change to your recipient
    from: "imogen@theblueprints.co", // Change to your verified sender
    subject: "Please confirm your account",
    text: "and easy to do anywhere, even with Node.js",
    html: `<h1>Email Confirmation</h1>
  <h2>Hello ${name}</h2>
  <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
  <a href=http://localhost:3000/api/auth/confirm/${confirmationCode}> Click here</a>
  </div>`,
  };

  sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode);
    })
    .catch((error) => {
      console.error(error);
    });
};

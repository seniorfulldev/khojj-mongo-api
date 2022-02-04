const userServices = require("../services/UserServices.js");
const config = require("../config/auth.config");
const nodemailer = require("../config/nodemailer.config");
let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");
const User = require("../models/UserModels");
exports.signup = async (req, res, next) => {
  const token = jwt.sign({ email: req.body.email }, config.secret);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    confirmationCode: token,
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({
      message: "User was registered successfully! Please check your email",
    });
    nodemailer.sendConfirmationEmail(
      user.username,
      user.email,
      user.confirmationCode
      );
    // res.redirect("/");
  });
};

exports.signin = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username });
  if (!user) {
    return res.status(404).send({ message: "User Not found." });
  }
  const passwordIsValid = bcrypt.compareSync(password, user.password);
  if (!passwordIsValid) {
    return res.status(401).send({
      accessToken: null,
      message: "Invalid Password!",
    });
  }
  if (user.status != "Active") {
    return res.status(401).send({
      message: "Pending Account. Please Verify Your Email!",
    });
  }
  const accessToken = jwt.sign({ id: user.id }, config.secret, {
    expiresIn: 86400, // 24 hours
  });
  // call toJSON method applied during model instantiation
  // return { ...user.toJSON(), accessToken };
  res.send({...user.toJSON(), accessToken,
    message: "User was registered successfully! Please check your email",
  });
};

exports.verifyUser = (req, res, next) => {
  User.findOne({
    confirmationCode: req.params.confirmationCode,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      user.status = "Active";
      user.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.redirect("http://localhost:4000/");
      });
    })
    .catch((e) => console.log("error", e));
};

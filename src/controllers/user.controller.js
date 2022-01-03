const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const userServices = require("../services/UserServices.js");

router.post("/signup", (req, res, next) => {
  const { password } = req.body;
  console.log("password", password);
  const salt = bcrypt.genSaltSync(10);
  req.body.password = bcrypt.hashSync(password, salt);

  userServices
    .register(req.body)
    .then(res.json({ success: true, message: "User registered successfully!" }))
    .catch((err) => next(err));
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  userServices
    .login({ username, password })
    .then((user) => {
      user
        ? res.json(user)
        : res.json({ error: "Username or password is incorrect" });
    })
    .catch((err) => next(err));
});

router.get("/:id", (req, res, next) => {
  userServices
    .getById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => next(err));
});

module.exports = router;

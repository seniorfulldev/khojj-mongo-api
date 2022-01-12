const userServices = require("../services/UserServices.js");

exports.signup = (req, res, next) => {
  userServices
    .register(req.body)
    .then(res.json({ success: true, message: "User registered successfully!" }))
    .catch((err) => next(err));
};

exports.signin = (req, res, next) => {
  const { username, password } = req.body;
  userServices
    .login({ username, password })
    .then((user) => {
      user
        ? res.json(user)
        : res.json({ error: "Username or password is incorrect" });
    })
    .catch((err) => next(err));
};

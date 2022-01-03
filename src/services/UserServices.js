const User = require("../models/UserModels");
const bcrypt = require("bcryptjs");
const config = require("../config/auth.config.js");

async function login({ username, password }) {
  let jwt = require("jsonwebtoken");
  const user = await User.findOne({ username: username });
  // synchronously compare user entered password with hashed password
  if (user && bcrypt.compareSync(password, user.password)) {
    const accessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    // call toJSON method applied during model instantiation
    return { ...user.toJSON(), accessToken };
  }
}

async function register(params) {
  // instantiate a user modal and save to mongoDB
  const user = new User(params);
  await user.save();
}

async function getById(id) {
  const user = await User.findById(id);
  // call toJSON method applied during model instantiation
  return user.toJSON();
}

async function findOne(params) {
  const user = await User.findOne(params);
  // call toJSON method applied during model instantiation
  return user ? user.toJSON() : user;
}

module.exports = {
  login,
  register,
  getById,
  findOne,
};

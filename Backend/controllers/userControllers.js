const HttpError = require("../models/httpError");
const uuid = require("uuid");
const mongoose = require("mongoose");
const User = require("../models/userSchema");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var Dummy_User = [
  {
    id: "u1",
    name: "Elon",
    email: "elon@paypal.com",
    password: "elontesla",
  },
];

const getUserById = async (req, res) => {
  const userId = req.params.userId;
  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    return next(error);
  }
  return res.json({ user: user });
};

const addUser = async (req, res, next) => {
  console.log(req.headers)
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(error);
    return next(new HttpError("sorry! something went wrong", 422));
  }
  
  let user;

  try {
    user = await User.findOne({ email: req.body.email });
  } catch (error) {
    return next(new HttpError("something went wrong!", 500));
  }

  if (user) {
    return next(new HttpError("user with same email already exist", 500));
  }


  const { name, email, password } = req.body;

  let passwordHashed;

  try {
    passwordHashed = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = HttpError("sorry couldn't add the user!!", 500);
    return next(error);
  }


  const createdUser = new User({
    name,
    email,
    password: passwordHashed,
    places: [],
  });


  try {
    const result = await createdUser.save();
  } catch (error) {
    return next(new HttpError("couldn't add new user", 500));
  }


  try {
    //not a promise but might fail 
    token = jwt.sign(
      { userid: createdUser.id, email: createdUser.email },//data that we want to include in the token may be string object 
      "this-is-super-secret-token",//private srting only server knows 
      { expiresIn: "1h" } //token expires time ,search more on documentation of jwt options 
    );// the token must expire
  } catch (err) {
    const error = new HttpError("couldn't login", 500);
    return next(error);
  }

  res
    .status(200)
    .json({
      message: "SignUp successfull",
      userid: createdUser.id,
      email: createdUser.email,
      token: token,
    });
  // res.json({ message: "user added" });
  // const {name,email,password} = req.body
  // const userExist = Dummy_User.find(user=>user.email===email)
  // if(userExist){
  //     const error = new HttpError('user Already exists',500)
  //     throw error
  // }
  // const user = {
  //     id:uuid.v4(),
  //     name,
  //     email,
  //     password    }
  // Dummy_User.push(user)
};

const login = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(error);
    return next(new HttpError("sorry! something went wrong"));
  }
  const { email, password } = req.body;
  let user;
  try {
    user = await User.findOne({ email: email });
  } catch (error) {
    next(new HttpError("something went wrong!!", 500));
  }

  if (!user) {
    return next(new HttpError("User does not exist!", 404));
  }
  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (err) {
    const error = new HttpError("couldn't login", 500);
    return next(err);
  }

  if (!isValidPassword) {
    return next(new HttpError("password doesnot match", 404));
  }
  try {
    token = jwt.sign(
      { userid: user.id, email: user.email },
      "this-is-super-secret-token",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("couldn't login", 500);
    return next(err);
  }

  res
    .status(200)
    .json({
      message: "login successfull",
      userid: user.id,
      email: user.email,
      token: token,
    });
};
const findAll = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (error) {
    return next(new HttpError("something went wrong!", 404));
  }
  return res.json({
    users: users.map((user) => user.toObject({ getters: true })),
  });
};
exports.getUserById = getUserById;
exports.addUser = addUser;
exports.login = login;
exports.findAll = findAll;

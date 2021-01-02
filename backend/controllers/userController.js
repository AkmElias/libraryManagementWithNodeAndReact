// @ts-nocheck
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {OAuth2Client} = require('google-auth-library')
const User = require("../models/User");
const { registerValidation, loginValidation } = require("../validation");

const outhClient = new OAuth2Client('819867897528-fgr4r0oej769ssbu1ivnp44ppqoafplt.apps.googleusercontent.com')

exports.signup = async (req, res, next) => {
  //validate before creating a new user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  //checking if the user already exist
  const emailExist = await User.findOne({ Email: req.body.Email });
  if (emailExist) throw new Error("Email or allready exists!");

  //hash the password
  let hashedPassword = bcrypt.hashSync(req.body.Password, 8);

  const user = new User({
    Name: req.body.Name,
    Email: req.body.Email,
    Role: req.body.Role,
    Password: hashedPassword,
  });

  try {
    const userSaved = await user.save();
    res.status(201).json({ user: user._id });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.login = async (req, res, next) => {
  //validate before creating a new user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  //checking if the user email exist
  const user = await User.findOne({ Email: req.body.Email });
  if (!user) throw new Error("Email or Password is wrong!");

  //checking password
  // @ts-ignore
  const validPass = await bcrypt.compare(req.body.Password, user.Password);
  if (!validPass) throw new Error("Email or Password is wrong!");

  //Create and assign token
  // @ts-ignore
  const token = jwt.sign(
    { _id: user._id, role: user.Role },
    process.env.TOKEN_SECRET
  );

  res.header("auth-token", token).send({ token: token, user: {_id: user._id, name: user.Name, role: user.Role} });
};


exports.googleLogin = async (req,res,next) => {
    //console.log('google..',req.body.tokenId)
    outhClient.verifyIdToken({idToken: req.body.tokenId,audience: '819867897528-fgr4r0oej769ssbu1ivnp44ppqoafplt.apps.googleusercontent.com'}).then(response => {
      // const {email_verified,name,email} = response;
      let email_verified = response.payload.email_verified;
      let email = response.payload.email;
      let name = response.payload.name;

     if(email_verified){
        User.findOne({Email: email}).exec( async (err,user) => {
          if(err) {
          return res.status(400).json({
            error: 'Something went wrong!'
          })
          } else {
            if(user) {
              const token = jwt.sign(
                { _id: user._id, role: user.Role },
                process.env.TOKEN_SECRET
              );
             // console.log('auth-token',token)
             res.header("auth-token", token).send({ token: token, user: {_id: user._id, name: user.Name,role: user.Role} });
            } else {
              let hashedPassword = bcrypt.hashSync(email + name , 8);
              const user = new User({
                Name: name,
                Email: email,
                Password: hashedPassword
              })
              
              try {
                const userSaved = await user.save();
                res.status(201).json({ user: user._id });
              } catch (err) {
                res.status(400).json({ error: 'something went wrong!' });
              }
            }
          }

        })
     }

    })
}

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.editUser = async (req, res, next) => {
  if (req.user._id != req.body.userId)
    return res.status(401).send("You are not permitted for this action!");
  try {
    const user = await User.updateOne(
      { _id: req.params.userId },
      { $set: { Name: req.body.Name, Email: req.body.Email } }
    );
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.deleteUser = async (req, res, next) => {
  if (req.user._id == req.body.userId || req.user.role === "admin") {
    try {
      const user = await User.deleteOne({ _id: req.params.userId });
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ message: err });
    }
  } else return res.status(401).send("You are not permitted for this action!");
};

exports.getUsers = async (req, res, next) => {
  if (req.user.role === "admin") {
    try {
      const users = await User.find();
      res.status(200).send(users);
    } catch (err) {
      next(err);
    }
  } else {
    return res.status(401).send("Not authorized for this action.");
  }
};

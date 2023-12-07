const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("Userdata");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const Mailgen = require("mailgen");
const JWT_SERECTKEY = process.env.JWT_SERECTKEY;
const nodemailer = require("nodemailer");

let MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Expense Tracker",
    link: "https://mailgen.js/",
  },
});

let config = {
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
};

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "please enter all the fields" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "user already exists" });
      }
      bcrypt.hash(password, 13).then((hashedpassword) => {
        const user = new User({
          email: email,
          password: hashedpassword,
          name,
        });
        user
          .save()
          .then(() => {
            return res.json({ message: "successfully Signup" });
          })
          .catch((error) => {
            return res.json({ error: error });
          });
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.send({ Status: "User not existed" });
    }
    const token = jwt.sign({ id: user._id }, JWT_SERECTKEY, {
      expiresIn: "1d",
    });
    let response = {
      body: {
        name: user.name,
        intro: `forgot password link : ${process.env.FRONTEND_URL}/reset-password/${user._id}/${token}`,
      },
    };

    let transporter = nodemailer.createTransport(config);
    let mail = MailGenerator.generate(response);
    let message = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Expense Tracker - Reset Password Link",
      html: mail,
    };

    transporter.sendMail(message).then(() => {
      return res.json({ message: "Success" });
    })
    .catch((error) => {
      return res.status(402).json({ error: error });
    });
  });
});

router.post("/signin", (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "please enter all the fields" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid mail or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign({ _id: savedUser._id }, JWT_SERECTKEY);
          const { _id, name, email } = savedUser;
          res.json({ token: token, user: { _id, name, email } });
        } else {
          res.json({ message: "incorrect password" });
        }
      })
      .catch((err) => {
        res.json({ error: err });
      });
  });
});

router.post('/reset-password/:id/:token', (req, res) => {
    const {id, token} = req.params
    const {password} = req.body

    jwt.verify(token, JWT_SERECTKEY, (err, decoded) => {
        if(err) {
            console.log(err);
            return res.status(402).json({Status: "Error with token"})
        } else {
            bcrypt.hash(password, 13)
            .then(hash => {
                User.findByIdAndUpdate({_id: id}, {password: hash})
                .then(u => res.status(200).send({Status: "Success"}))
                .catch(err => res.status(402).send({Status: err}))
            })
            .catch(err => res.status(402).send({Status: err}))
        }
    })
})

module.exports = router;

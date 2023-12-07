const nodemailer = require("nodemailer");
const {CronJob} = require("cron");
const mongoose = require("mongoose");
const Mailgen = require("mailgen");

let MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Expense Tracker",
    link: "https://mailgen.js/",
  },
});

let response = {
  body: {
    name: "Reminder to enter your expenses",
    intro: "submit the bills in the portal",
  },
};

let config = {
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
};

const job = new CronJob(
	'00 07 19 * * *', // cronTime
  async () => {

    const users = await mongoose.model("Userdata").find();
    
    // Send an email to each user
    for (const user of users) {
      let transporter = nodemailer.createTransport(config);
      let mail = MailGenerator.generate(response);
      let message = {
        from: process.env.EMAIL,
        to: user.email,
        subject: "Expense Tracker - Reminder",
        html: mail,
      };
  
      transporter
        .sendMail(message)
        .then(() => {
          return res.status(201).json({
            msg: `${user.email} should receive an email`,
          });
        })
        .catch((error) => {
          return error;
        });
    }
  }, // onTick
	null, // onComplete
	true, // start
);

job.start();
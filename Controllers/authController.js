const db = require("../.config");

const nodemailer = require("nodemailer");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const generateOTP = () => crypto.randomInt(100000, 999999).toString();





exports.login = (req, res) => {
  const { Email, Password } = req.body;

  const Sql = "select * from users where Email = ? and Password = ?";

  db.query(Sql, [Email, Password], (err, results) => {
    if (err) {
      return res.status(500).send({ msg: "database connection error" });
    }
    if (results.length > 0) {
      return res.status(200).send({ msg: "Login successful" });
    }
    return res.status(400).send({ msg: "Invalid credentials" });
  });
};
const { parsePhoneNumberFromString } = require("libphonenumber-js");







exports.signup = (req, res) => {
  const { FullName, Email, Password, ConfirmPassword, PhoneNumber } = req.body;
  

  if (!FullName || !Email || !Password || !ConfirmPassword || !PhoneNumber) {
    return res.status(400).send({ msg: "Please fill all fields" });
  }

  if (Password !== ConfirmPassword) {
    return res.status(400).send({ msg: "Passwords do not match" });
  }

  const parsedPhoneNumber = parsePhoneNumberFromString(PhoneNumber, "ET");
  if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
    return res.status(400).send({ msg: "Invalid phone number" });
  }
  const CheckQuery = "select * from users where Email = ?";
  db.query(CheckQuery, [Email], (err, results) => {
    if (err) {
      return res.status(500).send({ msg: "database connection error", err });
    }

    if (results.length > 0) {
      return res.status(400).send({ msg: " Email already exists" });
    }

    const CheckQuery = "select * from users where PhoneNumber = ?";
    db.query(CheckQuery, [PhoneNumber], (err, results) => {
      if (err) {
        return res.status(500).send({ msg: "database connection error" });
      }

      if (results.length > 0) {
        return res.status(400).send({ msg: "PhoneNumber already exists" });
      }
   const otp = generateOTP();
   const otpExpry = new Date(Date.now() + 5 * 60 * 1000);

      const sql = "INSERT INTO users set ?";
      const values = {
        FullName: FullName,
        Email: Email,
        Password: Password,
        ConfirmPassword: ConfirmPassword,
        PhoneNumber: PhoneNumber,
        otp: otp,
        otpExpry: otpExpry,
      };
      db.query(sql, values, (err, results) => {
        if (err) {
          return res.status(500).send({ msg: "Internal server error" , err});
        }
        if (results) {
          transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: Email,
            subject: "OTP",
            text: `your OTP is ${otp}`,
          });
          console.log("User created successfully please verfiy your email");
          return res.status(201).send({ msg: " user created successfully please verfiy your email" });
        }
      });
    });
  });
};






exports.verifyOTP = (req, res) => {
  const { Email, otp } = req.body;
};

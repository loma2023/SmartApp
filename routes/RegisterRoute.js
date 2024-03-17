const express = require("express");
const router = express.Router();
const Mailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const transporter = Mailer.createTransport({
  service: 'gmail',
  auth: {
    user: "loma2598@gmail.com",
    pass: "j t z s y v s j w a i v k y c s",
  }
});
require('dotenv').config()

const User = require("../models/UserSchema");
const Msg = require("../controllers/Msg");

router.get("/Register", (req, res) => {
  res.render("Auth/Register", { Title: "Register" });
});

router.get("/ConfirmEmail", (req, res) => {
  res.render("Auth/CodeTxt", { Title: "ConfirmEmail" })
})

let CodeTxt = ''
let RegisterObj = {}
router.post("/Register",
  [
    check("Email", { id: "Notification", txt: "يرجى ادخال عنوان بريد إلكتروني صالح" }).isEmail(),
    check("Password", { id: "Notification", txt: "يجب أن تكون كلمة المرور مكونه من 8 أحرف على الأقل مع حرف واحد كبير ورقم واحد" })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
  ],
  async (req, res) => {

    try {
      const objError = validationResult(req);
      if (objError.errors.length > 0) {
        return res.json([objError.errors[0].msg]);
      }
      console.log(req.body.Password)
      const isCurrentEmail = await User.findOne({ Email: req.body.Email });
      if (isCurrentEmail) {
        return res.json([Msg.Exist]);
      }

      // Create Random Code and Sent Email
      CodeTxt = ''
      const hexString = "0123456789"
      for (let i = 0; i < 6; i++) {
        CodeTxt += hexString[Math.floor(Math.random() * hexString.length)]
      }
      console.log(CodeTxt)
      const EmailObj = {
        from: req.body.Email,
        to: req.body.Email,
        subject: 'Verification Email',
        html: `<div>
                <h3>Welcome , ${req.body.Username}<br>Thank you for registering process we 
                need to verify your details.Please insert this Code to activate your account</h3>
                <h2>${CodeTxt}</h2>
              </div>`
      };

      let SendMail = await transporter.sendMail(EmailObj)
      if (SendMail) {
        RegisterObj = {
          Username: req.body.Username,
          NameCompany: req.body.NameCompany,
          Email: req.body.Email,
          Password: req.body.Password,
        }
        res.json([Msg.SendMail]);
      } else {
        res.json([Msg.NotSendMail]);
      }
    }

    catch (error) { console.log(error); }
  }
);

router.post("/ConfirmEmail", async (req, res) => {
  try {
    if (req.body.CodeTxt === CodeTxt) {
      const NewUser = await User.create(RegisterObj);
      let Code = {
        ID: NewUser._id,
        Obj: {
          ID: NewUser._id,
          Username: NewUser.Username,
        }
      }
      const token = jwt.sign(Code, process.env.JWT_SECRET_KEY);
      res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
      res.json([Msg.Success]);
    } else {
      res.json([Msg.WrongCode])
    }
  }

  catch (error) { console.log(error); }
});



module.exports = router;

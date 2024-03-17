const express = require("express");
const router = express.Router();
const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Mailer = require('nodemailer');
const multer = require("multer");
const { check, validationResult } = require("express-validator");
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });
// const upload = multer({ storage: multer.diskStorage({}) });
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const transporter = Mailer.createTransport({
  service: 'gmail',
  auth: {
    user: "loma2598@gmail.com",
    pass: "j t z s y v s j w a i v k y c s",
  }
});
require('dotenv').config()

const { RequireAuth, UnRequireAuth, CheckIfUser } = require("../middleware/middleware");
const User = require("../models/UserSchema");
const Msg = require("../controllers/Msg");

router.get("*", CheckIfUser);
router.post("*", CheckIfUser);

router.get("/", UnRequireAuth, (req, res) => {
  res.render("Auth/Login", { Title: "Login" });
});

router.get("/Login", UnRequireAuth, (req, res) => { 
  res.render("Auth/Login", { Title: "Login" });
});

router.post("/Login", async (req, res) => {
  let CheckUser; let UserData ; let TypeUser
  try {
    CheckUser = await User.findOne({ Email: req.body.Email });
    if (CheckUser) {TypeUser = "Admin" ;UserData = CheckUser }
    if (!CheckUser) {
      CheckUser = await User.findOne({ "DataUsers.Email": req.body.Email })
      if (CheckUser) {TypeUser ="User" ;UserData = CheckUser.DataUsers.find((item) => { return item.Email == req.body.Email; }) }
      if (!CheckUser) {
        return res.json([Msg.WrongEmail])
      }
    }
    const match = await bcrypt.compare(req.body.Password, CheckUser.Password);
    if (!match) { return res.json([Msg.WrongEmail]); }
    let Code = {
      ID: CheckUser._id,
      Obj: {
        ID: UserData._id,
        Username: UserData.Username,
        TypeUser: TypeUser ,
      }
    }
    var token = jwt.sign(Code, process.env.JWT_SECRET_KEY);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
    res.json([Msg.Success])
  }

  catch (error) { console.log(error); }

});

router.get("/ForgotPassword", (req, res) => {
  res.render("Auth/ForgotPassword", { Title: "ForgotPassword" })
})

// Create Random Code and Sent Email then Create cookie redirect to ResetPassword
let ForgotObj = { ID: "", }
router.post("/ForgotPassword", async (req, res) => {
  let CheckUser; let TypeUser; let UserData; let CodeTxt = '';
  try {
    CheckUser = await User.findOne({ Email: req.body.Email });
    if (CheckUser) { TypeUser = "Admin"; UserData = CheckUser; }
    if (!CheckUser) {
      CheckUser = await User.findOne({ "DataUsers.Email": req.body.Email })
      if (CheckUser) { TypeUser = "User"; UserData = CheckUser.DataUsers.find((item) => { return item.Email == req.body.Email; }) }
      if (!CheckUser) {
        return res.json([Msg.WrongEmail])
      }
    }

    const hexString = "0123456789"
    for (let i = 0; i < 6; i++) {
      CodeTxt += hexString[Math.floor(Math.random() * hexString.length)]
    }
    const EmailObj = {
      from: req.body.Email,
      to: req.body.Email,
      subject: 'Verification Email',
      html: `<div>
              <h3>Welcome , ${UserData.Username}<br>كود اعادة تعيين كلمة المورو الخاصه بك </h3>
              <h2>${CodeTxt}</h2>
            </div>`
    };

    let SendMail = await transporter.sendMail(EmailObj)
    if (SendMail) {
      ForgotObj = {
        ID: UserData._id,
        CodeTxt: CodeTxt,
        TypeUser: TypeUser,
      }
      res.json([Msg.SendMail]);
    } else {
      res.json([Msg.NotSendMail]);
    }
  }
  catch (error) { console.log(error); }

})

router.get("/ResetPassword", (req, res) => {
  res.render("Auth/CodeTxt", { Title: "ResetPassword" })
})
// Check If CodeTxt True redirect to NewPassword
router.post("/ResetPassword", async (req, res) => {
  try {
    if (req.body.CodeTxt === ForgotObj.CodeTxt) {
      res.json([Msg.Success]); // this json for redirect to NewPassword
    } else {
      res.json([Msg.WrongCode])
    }
  }
  catch (error) { console.log(error); }
});

router.get("/NewPassword", (req, res) => {
  if (ForgotObj.ID === "") {
    res.redirect("/Login")
  } else {
    res.render("Auth/NewPassword", { Title: "NewPassword" })
  }
})

router.post("/NewPassword",
  [
    check("Password", { id: "Notification", txt: "يجب أن تكون كلمة المرور مكونه من 8 أحرف على الأقل مع حرف واحد كبير ورقم واحد" })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
  ],
  async (req, res) => {
    const objError = validationResult(req);
    if (objError.errors.length > 0) {
      return res.json([objError.errors[0].msg]);
    }
    let HashedPassword = bcrypt.hashSync(req.body.Password, 10)

    try {
      if (ForgotObj.TypeUser === "Admin") {
        console.log("Admin")
        await User.updateOne(
          { _id: ForgotObj.ID },
          { Password: HashedPassword }
        );
      }
      if (ForgotObj.TypeUser === "User") {
        console.log("User")
        await User.updateOne(
          { "DataUsers._id": ForgotObj.ID },
          { "DataUsers.$.Password": HashedPassword, }
        )
      }
      res.json([Msg.Success]); // this json for redirect to Home
    }

    catch (error) { console.log(error); }

  });











router.get("/SignOut", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/Login");
});

router.get("/error", RequireAuth, (req, res) => {
  res.render("error");
});

router.get("/Home", RequireAuth, (req, res) => {
  var Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  User.findOne({ _id: Decode.ID })
    .then((result) => {
      res.render("Home", { MyData: result, User: Decode.Obj, moment: moment, Title: "Home" });
    })
    .catch((err) => {
      console.log(err);
    });
});


//  Setting Profile
router.post("/update-profile", RequireAuth, upload.single("avatar"), (req, res, next) => {
  cloudinary.uploader.upload(req.file.filename, { folder: "SmartApp/profile-imgs" }, async (error, result) => {
    if (result) {
      var Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
      const avatar = await User.updateOne(
        { _id: Decode.ID },
        { profileImage: result.secure_url }
      );
      res.redirect("/home");
    }
  });
}
);

module.exports = router;

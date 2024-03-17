const express = require("express");
const router = express.Router();
const moment = require("moment");
const jwt = require("jsonwebtoken");


require('dotenv').config()

const { RequireAuth, CheckIfUser } = require("../middleware/middleware");
const Msg = require("../controllers/Msg");
const User = require("../models/UserSchema");

router.get("*", CheckIfUser);
router.post("*", CheckIfUser);

// GET Requst
router.get("/DataSuppliers", RequireAuth, async (req, res) => {
  var Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  await User.findOne({ _id: Decode.ID })
    .then((result) => { res.render("CustomersSuppliers", { MyData: result, User: Decode.Obj, Title: "بيانات الموردين", moment: moment, }); })
    .catch((error) => { console.log(error); });
});

// POST AND GET Requst
router.post("/DataSuppliers", RequireAuth, async (req, res) => {
  var Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let MyMsg = {}

  await User.updateOne({ _id: Decode.ID }, {
    $push:
    {
      DataSuppliers: {
        Name: req.body.Name,
        City: req.body.City,
        Address: req.body.Address,
        Phone: req.body.Phone,
        Balance: req.body.Balance,
        createdBy: Decode.Obj.ID,
        createdAt: new Date(),
      }
    }
  })
    .then((result) => { MyMsg = Msg.Save })
    .catch(err => { return MyMsg = Msg.Error })

  await User.findOne({ _id: Decode.ID })
    .then((result) => { return res.json([MyMsg, result]) })
    .catch((err) => { console.log(err); });

});

// PUT AND GET Request
router.put("/DataSuppliers:id", RequireAuth, async (req, res) => {
  var Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let MyMsg = {}
  await User.updateOne(
    { "DataSuppliers._id": req.params.id },
    {
      "DataSuppliers.$.Name": req.body.Name,
      "DataSuppliers.$.City": req.body.City,
      "DataSuppliers.$.Address": req.body.Address,
      "DataSuppliers.$.Phone": req.body.Phone,
      "DataSuppliers.$.Balance": req.body.Balance,
      "DataSuppliers.$.createdBy": Decode.Obj.ID,
      "DataSuppliers.$.updatedAt": new Date(),
    }
  )
    .then((result) => { MyMsg = Msg.Edit })
    .catch(err => { return MyMsg = Msg.Error })

  await User.findOne({ _id: Decode.ID })
    .then((result) => { return res.json([MyMsg, result]) })
    .catch((err) => { console.log(err); });
});

// DELETE AND GET Request
router.delete("/DataSuppliers:id", RequireAuth, async (req, res) => {
  var Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let MyMsg = {}
  await User.updateOne(
    { "DataSuppliers._id": req.params.id },
    { $pull: { DataSuppliers: { _id: req.params.id } } }
  )
    .then((result) => { MyMsg = Msg.Delete })
    .catch(err => { return MyMsg = Msg.Error })

  await User.findOne({ _id: Decode.ID })
    .then((result) => { return res.json([MyMsg, result]) })
    .catch((err) => { console.log(err); });
});



module.exports = router;

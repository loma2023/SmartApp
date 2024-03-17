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
router.get("/DataProducts", RequireAuth, async (req, res) => {
  var Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  await User.findOne({ _id: Decode.ID })
    .then((result) => { res.render("Products", { MyData: result, User: Decode.Obj, Title: "المنتجات", moment: moment, }); })
    .catch((error) => { console.log(error); });
});
// POST AND GET Requst
router.post("/DataProducts", RequireAuth, async (req, res) => {
  var Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let MyMsg = {}
  await User.updateOne({ _id: Decode.ID }, {
    $push:
    {
      DataProducts: {
        NameProduct: req.body.NameProduct,
        MinQty: req.body.MinQty,
        MaxQty: req.body.MaxQty,
        QRCODE: req.body.QRCODE,
        Units: req.body.Units, 
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
router.put("/DataProducts:id", RequireAuth, async (req, res) => {
  var Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let MyMsg = {}
  await User.updateOne(
    { "DataProducts._id": req.params.id },
    {
      "DataProducts.$.NameProduct": req.body.NameProduct,
      "DataProducts.$.MinQty": req.body.MinQty,
      "DataProducts.$.MaxQty": req.body.MaxQty,
      "DataProducts.$.QRCODE": req.body.QRCODE, 
      "DataProducts.$.Units": req.body.Units, 
      "DataProducts.$.createdBy": Decode.Obj.ID,
      "DataProducts.$.updatedAt": new Date(),
    }
  )
    .then((result) => { MyMsg = Msg.Edit })
    .catch(err => { return MyMsg = Msg.Error })

  await User.findOne({ _id: Decode.ID })
    .then((result) => { return res.json([MyMsg, result]) })
    .catch((err) => { console.log(err); });
});

// DELETE AND GET Request
router.delete("/DataProducts:id", RequireAuth, async (req, res) => {
  var Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let MyMsg = {}
  await User.updateOne(
    { "DataProducts._id": req.params.id },
    { $pull: { DataProducts: { _id: req.params.id } } }
  )
    .then((result) => { MyMsg = Msg.Delete })
    .catch(err => { return MyMsg = Msg.Error })

  await User.findOne({ _id: Decode.ID })
    .then((result) => { return res.json([MyMsg, result]) })
    .catch((err) => { console.log(err); });
});



module.exports = router;
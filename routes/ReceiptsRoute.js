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
router.get("/NewReceipts-:Type", RequireAuth, async (req, res) => {
  var Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let Title 
  if (req.params.Type === "Sales") {Title = "فاتورة مبيعات"}
  else if(req.params.Type === "Purchases"){Title = "فاتورة مشتريات"}
  else{ res.render("Error", {User: Decode.Obj, Title: "Error", moment: moment, });return };
  
  await User.findOne({ _id: Decode.ID })
    .then((result) => { res.render("NewReceipts", { MyData: result, User: Decode.Obj, Title: Title, moment: moment, }); })
    .catch((error) => { console.log(error); });
});

// GET For Fetch
router.get("/GetReceipts", RequireAuth, async (req, res) => {
  var Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  await User.findOne({ _id: Decode.ID })
    .then((result) => { res.json(result)})
    .catch((error) => { console.log(error); });
});

// POST AND GET Requst
router.post("/DataReceipts", RequireAuth, async (req, res) => {
  var Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let MyMsg = {}
  await User.updateOne({ _id: Decode.ID }, {
    $push:
    {
      DataReceipts: {
        DateReceipt: req.body.DateReceipt,
        TypeReceipt: req.body.TypeReceipt,
        TypeAmount: req.body.TypeAmount,
        NamePerson: req.body.NamePerson,  // ID Customer
        SubTotal: req.body.SubTotal,
        Tax: req.body.Tax,
        Discount: req.body.Discount,
        Total: req.body.Total,
        Products: req.body.Products,
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
router.put("/DataReceipts:id", RequireAuth, async (req, res) => {
  var Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let MyMsg = {}
  await User.updateOne(
    { "DataReceipts._id": req.params.id },
    {
      "DataReceipts.$.DateReceipt": req.body.DateReceipt,
      "DataReceipts.$.TypeReceipt": req.body.TypeReceipt,
      "DataReceipts.$.TypeAmount": req.body.TypeAmount,
      "DataReceipts.$.NamePerson": req.body.NamePerson,  // ID Customer
      "DataReceipts.$.SubTotal": req.body.SubTotal,
      "DataReceipts.$.Tax": req.body.Tax,
      "DataReceipts.$.Discount": req.body.Discount,
      "DataReceipts.$.Total": req.body.Total,
      "DataReceipts.$.Products": req.body.Products,
      "DataReceipts.$.createdBy": Decode.Obj.ID,
      "DataReceipts.$.updatedAt": new Date(),
    }
  )
    .then((result) => { MyMsg = Msg.Edit })
    .catch(err => { return MyMsg = Msg.Error })

  await User.findOne({ _id: Decode.ID })
    .then((result) => { return res.json([MyMsg, result]) })
    .catch((err) => { console.log(err); });
});

// DELETE AND GET Request
router.delete("/DataReceipts:id", RequireAuth, async (req, res) => {
  var Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let MyMsg = {}
  await User.updateOne(
    { "DataReceipts._id": req.params.id },
    { $pull: { DataReceipts: { _id: req.params.id } } }
  )
    .then((result) => { MyMsg = Msg.Delete })
    .catch(err => { return MyMsg = Msg.Error })

  await User.findOne({ _id: Decode.ID })
    .then((result) => { return res.json([MyMsg, result]) })
    .catch((err) => { console.log(err); });
});



module.exports = router;
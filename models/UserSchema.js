const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  profileImage: String,
  Username: String,
  Email: String,
  Password: String,
  //  Array Customers
  DataCustomers: [{
    Name: String,
    City: String,
    Address: String,
    Phone: String,
    Balance: String,
    createdBy: String,
    createdAt: Date,
    updatedAt: { type: Date, default: Date.now },
  },],
  //  Array Suppliers
  DataSuppliers: [{
    Name: String,
    City: String,
    Address: String,
    Phone: String,
    Balance: String,
    createdBy: String,
    createdAt: Date,
    updatedAt: { type: Date, default: Date.now },
  },],
  //  Array Product
  DataProducts: [{
    NameProduct: String,
    MinQty: String,
    MaxQty: String,
    QRCODE:String,
    Units: Array,
    createdBy: String,
    createdAt: Date,
    updatedAt: { type: Date, default: Date.now },
  },],
  //  Array Receipts 
  DataReceipts: [{
    DateReceipt: String,
    TypeReceipt: String,
    TypeAmount: String,
    NamePerson: String,  // ID Customer
    SubTotal: String,
    Tax: String,
    Discount: String,
    Total: String,
    Products: Array,
    createdBy: String,
    createdAt: Date,
    updatedAt: { type: Date, default: Date.now },
  },],
  //  Array Users
  DataUsers: [{
    profileImage: String,
    Username: String,
    Email: String,
    Password: String,
    createdAt: Date,
    updatedAt: { type: Date, default: Date.now },
  },],
});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.Password = await bcrypt.hash(this.Password, salt);
  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;

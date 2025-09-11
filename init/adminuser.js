const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Admin schema
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
});
adminSchema.plugin(passportLocalMongoose);

// User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
});
userSchema.plugin(passportLocalMongoose);

const Admin = mongoose.model("Admin", adminSchema);
const User = mongoose.model("User", userSchema);

module.exports = { Admin, User };

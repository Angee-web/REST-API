const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    role: String,
})

const User = mongoose.model("User", UserSchema, "Users");

module.exports = User;
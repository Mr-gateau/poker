const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  name: String,
  key: String,
});

module.exports = mongoose.model("Users", User);

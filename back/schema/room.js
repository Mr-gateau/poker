const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Room = new Schema({
  room: String,
  value: Number,
  visible: Boolean,
  votes: Array,
  actualSession: String,
});

module.exports = mongoose.model("Room", Room);

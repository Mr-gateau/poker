const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Room = new Schema({
  room: String,
  value: Number,
  owner: Array,
  visible: { type: Boolean, default: false },
  votes: { type: Array, default: [] },
  hasVoted: { type: Object, default: {} },
  users: { type: Array, default: [] },
});

module.exports = mongoose.model("Room", Room);

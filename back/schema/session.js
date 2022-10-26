const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Session = new Schema({
  name: String,
});

module.exports = mongoose.model("Session", Session);

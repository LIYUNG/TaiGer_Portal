const mongoose = require("mongoose");
const documentation = new mongoose.Schema({
  Titel_: String,
  Category_: String,
  Content_: String,
  LastUpdate_: String,
  Content_: String,
});

module.exports = mongoose.model("documentation", documentation);

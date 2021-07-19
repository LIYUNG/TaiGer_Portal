const mongoose = require("mongoose");
const documentations = new mongoose.Schema({
  Titel_: String,
  Category_: String,
  Content_: String,
  LastUpdate_: String,
  Content_: String,
});

module.exports = mongoose.model("documentations", documentations);

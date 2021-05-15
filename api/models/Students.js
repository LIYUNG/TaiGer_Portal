const mongoose = require("mongoose");
// const Program = require("./Programs");
const schema = new mongoose.Schema({
	firstname_ : String,
	lastname_ : String,
	emailaddress_ : String,
	password_ : String,
	role: String
});

module.exports = mongoose.model("Student", schema);
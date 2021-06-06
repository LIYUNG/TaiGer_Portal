const mongoose = require("mongoose");
const schema = new mongoose.Schema({
	firstname_ : String,
	lastname_ : String,
	emailaddress_ : String,
	password_ : String,
	role_: String,
	agent_: [String],
	editor_: [String],
	applying_program_: [String]
});

module.exports = mongoose.model("students", schema);
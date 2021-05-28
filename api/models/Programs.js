const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	University : String,
	Program : String,
	Degree : String,
	TOEFL : String,
	IELTS : String,
	TestDaF : String,
	GMAT : String,
	GRE : String,
	applicationStart : String,
	applicationDeadline : String,
	weblink : String,
	FPSOlink : String,
	lastUpdate : String,
	applicationDocu : {
		CV : String,
		ML : String,
		RL : String,
		bachelorCertificate : String,
		bachelorTranscript : String,
		highSchoolDiploma : String,
		highSchoolTranscript : String,
		GSAT : String,
		EnglischCertificate : String,
		GermanCertificate : String,
		Essay : String,
		ECTS_coversion : String,
		courseDescription : String
	}
});

module.exports = mongoose.model("programs", schema);
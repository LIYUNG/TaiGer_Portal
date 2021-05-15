const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	university_ : String,
	programName_ : String,
	degreeTitle_ : String,
	TOEFL_ : String,
	IELTS_ : String,
	TestDaF_ : String,
	GMAT_ : String,
	GRE_ : String,
	applicationStart_ : String,
	applicationDeadline_ : String,
	weblink_ : String,
	FPSOlink_ : String,
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
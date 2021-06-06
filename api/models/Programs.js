const mongoose = require("mongoose");

const programs = new mongoose.Schema({
	University : String,
	Program : String,
	Degree : String,
	Semester : String,
	Want : String,
	TOEFL : String,
	IELTS : String,
	TestDaF : String,
	GMAT : String,
	GRE : String,
	Application_start_date : String,
	Application_end_date : String,
	Website : String,
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

// const Program = mongoose.model('Program', 'programs', 'Program');
// module.exports = { Program };


module.exports = mongoose.model("programs", programs);
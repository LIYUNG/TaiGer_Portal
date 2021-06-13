const mongoose = require("mongoose");

const programs = new mongoose.Schema({
	University_ : String,
	Program_ : String,
	Degree_ : String,
	Semester_ : String,
	Want_ : String,
	TOEFL_ : String,
	IELTS_ : String,
	TestDaF_ : String,
	GMAT_ : String,
	GRE_ : String,
	Application_start_date_ : String,
	Application_end_date_ : String,
	Website_ : String,
	FPSOlink_ : String,
	LastUpdate_ : String,
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
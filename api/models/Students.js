const mongoose = require("mongoose");
// const Program = mongoose.model('programs');
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
const schema = new mongoose.Schema({
	firstname_ : String,
	lastname_ : String,
	emailaddress_ : String,
	password_ : String,
	role_: String,
	agent_: [String],
	editor_: [String],
	applying_program_: [programs],
	// Program: [programs]
});

// const students = mongoose.model('students', 'schema', 'students');
// module.exports = { students };
module.exports = mongoose.model("students", schema);
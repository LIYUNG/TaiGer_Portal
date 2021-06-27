const mongoose = require("mongoose");

const uploadedDocsInfo = new mongoose.Schema({
	uploadStatus_: String,
	needToBeUpload_: String,
	filePath_: String,
	LastUploadDate_: String
});

const documents = new mongoose.Schema({
	CV_: uploadedDocsInfo,
	ML_: uploadedDocsInfo,
	RL_: uploadedDocsInfo,
	bachelorCertificate_: uploadedDocsInfo,
	bachelorTranscript_: uploadedDocsInfo,
	highSchoolDiploma_: uploadedDocsInfo,
	highSchoolTranscript_: uploadedDocsInfo,
	GSAT_: uploadedDocsInfo,
	EnglischCertificate_: uploadedDocsInfo,
	GermanCertificate_: uploadedDocsInfo,
	Essay_: uploadedDocsInfo,
	ECTS_conversion_: uploadedDocsInfo,
	courseDescription_: uploadedDocsInfo
});

const programs = new mongoose.Schema({
	University_: String,
	Program_: String,
	Degree_: String,
	Semester_: String,
	Want_: String,
	TOEFL_: String,
	IELTS_: String,
	TestDaF_: String,
	GMAT_: String,
	GRE_: String,
	Application_start_date_: String,
	Application_end_date_: String,
	Website_: String,
	FPSOlink_: String,
	LastUpdate_: String,
	applicationDocu_: [documents]
});

const schema = new mongoose.Schema({
	firstname_: String,
	lastname_: String,
	emailaddress_: String,
	password_: String,
	role_: String,
	agent_: [String],
	editor_: [String],
	applying_program_: [programs],
	uploadedDocs_: documents
});

module.exports = mongoose.model("students", schema);
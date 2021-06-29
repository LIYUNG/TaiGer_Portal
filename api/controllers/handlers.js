const Student = require("../models/Students");
const Program = require("../models/Programs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
// const path = require("path");
const bcrypt = require("bcrypt");
// var nodemailer = require('nodemailer');
const { Schema } = require("mongoose");
const fs = require('fs')

const saltRounds = 10;

const jwtKey = "my_secret_key";
// const jwtExpirySeconds = 6000;

// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'taiger.leoc@gmail.com',
//     pass: ''
//   }
// });

// var mailOptions = {
//   from: 'taiger.leoc@gmail.com',
//   to: 'taiger.leoc@gmail.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });

exports.signIn = async (req, res) => {

	console.log(req.body);
	const { emailaddress, password } = req.body;
	// console.log("here is ");
	// Found existing users
	const students_exists = await Student.findOne({ emailaddress_: req.body.emailaddress });
	// console.log(students_exists);
	try {

		if (students_exists != null) {
			// Compare password with hashed one in db
			const password2 = students_exists.password_;
			await bcrypt.compare(password, password2, (err, data) => {
				//if error than throw error
				if (err) {
					console.log(err);
					throw err;
				}
				// console.log(data);
				//if both match than you can do anything
				if (data) {
					console.log('Passwords match !');
					const token = jwt.sign({ emailaddress }, jwtKey, {
						algorithm: "HS256",
						expiresIn: jwtExpirySeconds,
					})
					console.log('Send token !');
					// set the cookie as the token string, with a similar max age as the token
					// return res.cookie("token", token, { httpOnly: true, maxAge: jwtExpirySeconds * 1000 }).sendStatus(200)

					return res.send({ token: token })
				} else {
					console.log('wrong password !');
					return res.status(401).end();
					// return res.status(401).json({ msg: "Invalid credencial" });
				}
			})
		}
		else {
			//Error
			console.log('User not existed !');
			return res.status(401).end();
		}
	} catch (err) {
		console.log('error at signIn!')
		console.log(err)
		return res.status(401).end();
	}
}

exports.Charts = async (req, res) => {
	var token = req.cookies.token
	//Extract user email info by token
	var emailaddress = jwt_decode(token);
	//Get user email
	emailaddress = emailaddress['emailaddress'];
	const students_exists = await Student.findOne({ emailaddress_: emailaddress });
	// Renew token again, entend expire time
	return res.status(401).end();
}

exports.passwordPost = async (req, res) => {
	res.send.status(404).end();
}

exports.settings = async (req, res) => {
	var token = req.cookies.token
	//Extract user email info by token
	var emailaddress = jwt_decode(token);
	//Get user email
	emailaddress = emailaddress['emailaddress'];
	const students_exists = await Student.findOne({ emailaddress_: emailaddress });
	// Renew token again, entend expire time
	token = jwt.sign({ emailaddress }, jwtKey, {
		algorithm: "HS256",
		expiresIn: jwtExpirySeconds,
	})
	console.log(students_exists);
	res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 });
}

exports.settingsPost = async (req, res) => {
	res.send.status(404).end();
}

exports.programlist = async (req, res) => {

	try {
		const bearer = req.headers.authorization.split(' ');
		const token = bearer[1]
		// //Extract user email info by token
		var emailaddress = jwt_decode(token);
		// var emailaddress = 'jwt_decode(token)';
		// //Get user email
		emailaddress = emailaddress['emailaddress'];
		console.log(emailaddress);
		const students_exists = await Student.findOne({ emailaddress_: emailaddress });
		// Access all programs
		if (students_exists.role_ === 'Agent') {

			const program_all = await Program.find();
			res.send({
				data: program_all
			})
		} else {
			//TODO: show student's own program list
			res.send({
				data: [students_exists]
			})
		}
	} catch (err) {
		if (e instanceof jwt.JsonWebTokenError) {
			// if the error thrown is because the JWT is unauthorized, return a 401 error
			console.log(e)
			console.log('error by programlist')
			return res.status(401).end();
		}
		console.log(err)
	}
}

exports.addprogram = async (req, res) => {
	console.log(req.body)
	const date_now = Date();
	try {
		console.log('New program ')
		const New_Program = new Program();
		New_Program.University_ = req.body.University_;
		New_Program.Program_ = req.body.Program_;
		New_Program.TOEFL_ = req.body.TOEFL_;
		New_Program.IELTS_ = req.body.IELTS_;
		New_Program.Degree_ = req.body.Degree_;
		New_Program.Application_end_date_ = req.body.Application_end_date_;
		New_Program.LastUpdate_ = date_now;
		New_Program.applicationDocu_ = {
			CV_: {
				needToBeUpload_: req.body.CV_
			},
			ML_: {
				needToBeUpload_: req.body.ML_
			},
			RL_: {
				needToBeUpload_: req.body.RL_
			},
			bachelorCertificate_: {
				needToBeUpload_: req.body.bachelorCertificate_
			},
			bachelorTranscript_: {
				needToBeUpload_: req.body.bachelorTranscript_
			},
			highSchoolDiploma_: {
				needToBeUpload_: req.body.highSchoolDiploma_
			},
			highSchoolTranscript_: {
				needToBeUpload_: req.body.highSchoolTranscript_
			},
			GSAT_: {
				needToBeUpload_: req.body.GSAT_
			},
			EnglischCertificate_: {
				needToBeUpload_: req.body.EnglischCertificate_
			},
			GermanCertificate_: {
				needToBeUpload_: req.body.GermanCertificate_
			},
			Essay_: {
				needToBeUpload_: req.body.Essay_
			},
			ECTS_coversion_: {
				needToBeUpload_: req.body.ECTS_coversion_
			},
			courseDescription_: {
				needToBeUpload_: req.body.courseDescription_
			}
		};

		await New_Program.save();
		return res.send({
			data: New_Program
		})

	} catch (err) {
		console.log('error by adding programlist')
		console.log(err)
		return res.status(500).end();  // 500 Internal Server Error
	}
}

exports.editprogram = async (req, res) => {
	try {
		console.log('edit req.params.id = ' + req.params.id)
		const program_id = req.params.id
		let program = await Program.findById(program_id)
		console.log('program: ' + program)
		console.log('req.body: ' + req.body)
		const date_now = Date();

		const bearer = req.headers.authorization.split(' ');
		const token = bearer[1]
		// update the program
		program.University_ = req.body.University_
		program.Program_ = req.body.Program_
		program.TOEFL_ = req.body.TOEFL_
		program.IELTS_ = req.body.IELTS_
		program.Degree_ = req.body.Degree_
		program.Application_end_date_ = req.body.Application_end_date_
		// TestDaF_ : req.body.testdaf,
		// GMAT_ : req.body.gmat,
		// GRE_ : req.body.gre,
		// applicationStart_ : req.body.applicationStart_,
		// applicationDeadline_ : req.body.applicationDeadline_,
		// weblink_ : req.body.weblink_,
		// FPSOlink_ : req.body.FPSOlink_,
		program.LastUpdate_ = date_now
		await program.save();
		return res.send({
			data: program
		})
	} catch (err) {
		console.log('error by edit programlist')
		console.log(err)
		return res.status(500).end();  // 500 Internal Server Error
	}
}

exports.deleteprogram = async (req, res) => {
	try {
		// console.log('req.body.program_id = ' + req.body.program_id)
		console.log('delete ' + req.body.program_id)
		const program_id = req.body.program_id
		await Program.findByIdAndDelete(program_id)
		res.send({
			data: 'success'
		})
	} catch (err) {
		console.log('error by delete program')
		console.log(err)
		return res.status(500).end(); // 500 Internal Server Error
	}
}

exports.assignprogramtostudent = async (req, res) => {
	try {
		console.log('edit req.body = ' + req.body)
		console.log('edit req.body.program_id = ' + req.body.program_id)
		const program_id = req.body.program_id
		let program = await Program.findById(program_id)
		console.log('edit req.body.student_id = ' + req.body.student_id)
		const student_id = req.body.student_id
		var student1 = await Student.findById(student_id);
		const exist_program = await student1.applying_program_.id(program_id)
		// TO remove subdocument/subarray
		// const exist_program = await student1.applying_program_.id(program_id).remove()
		if (exist_program === null) {
			student1.applying_program_.push(program);
			student1.save();
			console.log('success: ' + program)
			res.send({
				data: 'success'
			})
		} else {
			res.send({
				data: 'failed'
			})
		}
	} catch (err) {
		console.log('error by assigning program')
		console.log(err)
		return res.status(500).end();  // 500 Internal Server Error
	}
}

exports.studentlist = async (req, res) => {

	try {
		const bearer = req.headers.authorization.split(' ');
		const token = bearer[1]
		// console.log(token);
		// //Extract user email info by token
		var emailaddress = jwt_decode(token);
		// //Get user email
		emailaddress = emailaddress['emailaddress'];
		console.log(emailaddress);
		const students_exists = await Student.findOne({ emailaddress_: emailaddress });//get email by token
		// console.log(students_exists);
		//// Renew token again, entend expire time
		// token = jwt.sign({ emailaddress }, jwtKey, {
		// 	algorithm: "HS256",
		// 	expiresIn: jwtExpirySeconds,
		// })
		// Access all programs
		// console.log("programlist");
		if (students_exists.role_ === 'Agent') {
			const student_all = await Student.find({ role_: "Student", agent_: emailaddress });
			// console.log(student_all);
			res.send({
				data: student_all
			})
		}
		else if (students_exists.role_ === 'Admin') {
			const student_all = await Student.find({ role_: "Student" });
			// console.log(student_all);
			res.send({
				data: student_all
			})
		} else {
			// const student_all = await Student.find({ role_: "Student", agent_: "david@gmail.com" });
			// console.log(student_all);
			res.send({
				data: [students_exists]
			})
		}

	} catch (err) {
		if (e instanceof jwt.JsonWebTokenError) {
			// if the error thrown is because the JWT is unauthorized, return a 401 error
			console.log(e)
			console.log('error by programlist')
			return res.status(500).end(); // 500 Internal Server Error
		}
		console.log(err)
		return res.status(500).end(); // 500 Internal Server Error
	}
}

exports.editagent = async (req, res, next) => {
	console.log("editagent success!")
	res.status(404).end()
}

exports.editstudentprogram = async (req, res, next) => {
	console.log("editstudentprogram success!")
	res.status(404).end()
}

exports.UploadPost = async (req, res) => {
	try {
		console.log("cors: load success!")
		// console.log("whie file? " + req.body)
		console.log(req.file)
		// res.status(201).end()
		const bearer = req.headers.authorization.split(' ');
		const token = bearer[1]
		// Extract user email info by token
		var emailaddress = jwt_decode(token);
		// Get user email
		emailaddress = emailaddress['emailaddress'];
		const students_exists = await Student.findOne({ emailaddress_: emailaddress });
		// const students_exists = await Student.findOne({ emailaddress_: emailaddress });//get email by token
		const url = req.protocol + '://' + req.get('host')
		const FolderName = students_exists.firstname_ + '_' + students_exists.lastname_ + '_' + students_exists._id;
		const directoryPath = __basedir + "\\public\\" + FolderName + '\\';

		//TODO: update the filePath_ and uploadStatus_ accordingly by files.
		const date_now = Date();

		const categoryPath = directoryPath + req.params.category + '\\'
		console.log(req.file.filename)
		if (req.params.category === 'bachelorCertificate_') {
			await Student.findOneAndUpdate({ emailaddress_: emailaddress }, {
				"$set": {
					"uploadedDocs_.bachelorCertificate_.uploadStatus_": "uploaded",
					"uploadedDocs_.bachelorCertificate_.filePath_": categoryPath + req.file.filename,
					"uploadedDocs_.bachelorCertificate_.LastUploadDate_": date_now
				}
			});

			// students_exists.uploadedDocs_ = {
			// 	bachelorCertificate_: {
			// 		uploadStatus_: "uploaded",
			// 		filePath_: categoryPath + req.file.filename,
			// 		LastUploadDate_: date_now
			// 	}
			// }

		} else if (req.params.category === 'bachelorTranscript_') {
			await Student.findOneAndUpdate({ emailaddress_: emailaddress }, {
				"$set": {
					"uploadedDocs_.bachelorTranscript_.uploadStatus_": "uploaded",
					"uploadedDocs_.bachelorTranscript_.filePath_": categoryPath + req.file.filename,
					"uploadedDocs_.bachelorTranscript_.LastUploadDate_": date_now
				}
			});
		} else if (req.params.category === 'EnglischCertificate_') {
			await Student.findOneAndUpdate({ emailaddress_: emailaddress }, {
				"$set": {
					"uploadedDocs_.EnglischCertificate_.uploadStatus_": "uploaded",
					"uploadedDocs_.EnglischCertificate_.filePath_": categoryPath + req.file.filename,
					"uploadedDocs_.EnglischCertificate_.LastUploadDate_": date_now
				}
			});
		} else if (req.params.category === 'GermanCertificate_') {
			await Student.findOneAndUpdate({ emailaddress_: emailaddress }, {
				"$set": {
					"uploadedDocs_.GermanCertificate_.uploadStatus_": "uploaded",
					"uploadedDocs_.GermanCertificate_.filePath_": categoryPath + req.file.filename,
					"uploadedDocs_.GermanCertificate_.LastUploadDate_": date_now
				}
			});
		} else if (req.params.category === 'highschoolDiploma_') {
			await Student.findOneAndUpdate({ emailaddress_: emailaddress }, {
				"$set": {
					"uploadedDocs_.highSchoolDiploma_.uploadStatus_": "uploaded",
					"uploadedDocs_.highSchoolDiploma_.filePath_": categoryPath + req.file.filename,
					"uploadedDocs_.highSchoolDiploma_.LastUploadDate_": date_now
				}
			});
		} else if (req.params.category === 'highschoolTranscript_') {
			await Student.findOneAndUpdate({ emailaddress_: emailaddress }, {
				"$set": {
					"uploadedDocs_.highSchoolTranscript_.uploadStatus_": "uploaded",
					"uploadedDocs_.highSchoolTranscript_.filePath_": categoryPath + req.file.filename,
					"uploadedDocs_.highSchoolTranscript_.LastUploadDate_": date_now
				}
			});
		} else if (req.params.category === 'universityEntranceExamination_') {
			await Student.findOneAndUpdate({ emailaddress_: emailaddress }, {
				"$set": {
					"uploadedDocs_.GSAT_.uploadStatus_": "uploaded",
					"uploadedDocs_.GSAT_.filePath_": categoryPath + req.file.filename,
					"uploadedDocs_.GSAT_.LastUploadDate_": date_now
				}
			});
		} else if (req.params.category === 'ML_') {
			await Student.findOneAndUpdate({ emailaddress_: emailaddress }, {
				"$set": {
					"uploadedDocs_.ML_.uploadStatus_": "uploaded",
					"uploadedDocs_.ML_.filePath_": categoryPath + req.file.filename,
					"uploadedDocs_.ML_.LastUploadDate_": date_now
				}
			});

		} else if (req.params.category === 'CV_') {
			await Student.findOneAndUpdate({ emailaddress_: emailaddress }, {
				"$set": {
					"uploadedDocs_.CV_.uploadStatus_": "uploaded",
					"uploadedDocs_.CV_.filePath_": categoryPath + req.file.filename,
					"uploadedDocs_.CV_.LastUploadDate_": date_now
				}
			});

		} else if (req.params.category === 'RL_') {
			await Student.findOneAndUpdate({ emailaddress_: emailaddress }, {
				"$set": {
					"uploadedDocs_.RL_.uploadStatus_": "uploaded",
					"uploadedDocs_.RL_.filePath_": categoryPath + req.file.filename,
					"uploadedDocs_.RL_.LastUploadDate_": date_now
				}
			});

		} else if (req.params.category === 'ECTS_conversion_') {
			await Student.findOneAndUpdate({ emailaddress_: emailaddress }, {
				"$set": {
					"uploadedDocs_.ECTS_conversion_.uploadStatus_": "uploaded",
					"uploadedDocs_.ECTS_conversion_.filePath_": categoryPath + req.file.filename,
					"uploadedDocs_.ECTS_conversion_.LastUploadDate_": date_now
				}
			});
		} else if (req.params.category === 'CourseDescription_') {
			await Student.findOneAndUpdate({ emailaddress_: emailaddress }, {
				"$set": {
					"uploadedDocs_.courseDescription_.uploadStatus_": "uploaded",
					"uploadedDocs_.courseDescription_.filePath_": categoryPath + req.file.filename,
					"uploadedDocs_.courseDescription_.LastUploadDate_": date_now
				}
			});
		} else if (req.params.category === 'Essay_') {
			await Student.findOneAndUpdate({ emailaddress_: emailaddress }, {
				"$set": {
					"uploadedDocs_.Essay_.uploadStatus_": "uploaded",
					"uploadedDocs_.Essay_.filePath_": categoryPath + req.file.filename,
					"uploadedDocs_.Essay_.LastUploadDate_": date_now
				}
			});
		}
		await students_exists.save();
		console.log("save success!")
		return res.send({ message: "NOOK!" }).end();
	} catch (err) {
		console.log('error UploadPost: ' + err)
		return res.status(500).end(); // 500 Internal Server Error
	}
}

exports.filedownload = async (req, res, next) => {
	try {
		// console.log('filedownload req.params.filename = ' + req.params.category)
		const categoryName = req.params.category;
		// const fileName = req.params.filename;
		const bearer = req.headers.authorization.split(' ');
		const token = bearer[1]
		// Extract user email info by token
		var emailaddress = jwt_decode(token);
		emailaddress = emailaddress['emailaddress'];
		const students_exists = await Student.findOne({ emailaddress_: emailaddress });
		const FolderName = students_exists.firstname_ + '_' + students_exists.lastname_ + '_' + students_exists._id;
		const directoryPath = __basedir + "/public/" + FolderName + '/' + categoryName + '/';
		var downloadPath = ''
		//TODO: what if students_exists.uploadedDocs_.bachelorCertificate_ undefined?
		if (req.params.category === 'bachelorCertificate_') {
			downloadPath = students_exists.uploadedDocs_.bachelorCertificate_.filePath_
		} else if (req.params.category === 'bachelorTranscript_') {
			downloadPath = students_exists.uploadedDocs_.bachelorTranscript_.filePath_
		} else if (req.params.category === 'EnglischCertificate_') {
			downloadPath = students_exists.uploadedDocs_.EnglischCertificate_.filePath_
		} else if (req.params.category === 'GermanCertificate_') {
			downloadPath = students_exists.uploadedDocs_.GermanCertificate_.filePath_
		} else if (req.params.category === 'highschoolDiploma_') {
			downloadPath = students_exists.uploadedDocs_.highSchoolDiploma_.filePath_
		} else if (req.params.category === 'highschoolTranscript_') {
			downloadPath = students_exists.uploadedDocs_.highSchoolTranscript_.filePath_
		} else if (req.params.category === 'universityEntranceExamination_') {
			downloadPath = students_exists.uploadedDocs_.GSAT_.filePath_
		} else if (req.params.category === 'ML_') {
			downloadPath = students_exists.uploadedDocs_.ML_.filePath_
		} else if (req.params.category === 'CV_') {
			downloadPath = students_exists.uploadedDocs_.CV_.filePath_
		} else if (req.params.category === 'RL_') {
			downloadPath = students_exists.uploadedDocs_.RL_.filePath_
		} else if (req.params.category === 'ECTS_conversion_') {
			downloadPath = students_exists.uploadedDocs_.ECTS_conversion_.filePath_
		} else if (req.params.category === 'CourseDescription_') {
			downloadPath = students_exists.uploadedDocs_.courseDescription_.filePath_
		} else if (req.params.category === 'Essay_') {
			downloadPath = students_exists.uploadedDocs_.Essay_.filePath_
		}
		var filename = downloadPath.split('\\');
		console.log("filename: " + filename)
		filename = filename.pop()  // Get the last element (file name)
		console.log("filename: " + filename)
		if (fs.existsSync(downloadPath)) {
			console.log("file existed!")
			res.download(downloadPath, filename, (err) => {
				if (err) {
					res.status(500).send({
						message: "Could not download the file. " + err,
					});  // 500 Internal Server Error
				}
				else {
					console.log("filedownload success!")
					res.status(200).end(); // 200 success
				}
			});
		}
		else {
			console.log("file not existed!")
			res.status(500).send({
				message: "Could not download the file. ",
			});  // 500 Internal Server Error
		}
	} catch (err) {
		console.log('error download file: ' + err)
		return res.status(500).end(); // 500 Internal Server Error
	}
}


exports.filedownloadfromstudent = async (req, res, next) => {
	try {
		// console.log('filedownload req.params.filename = ' + req.params.category)
		const categoryName = req.params.category;
		const student_id = req.params.student_id;
		console.log('student id: ' + student_id)
		// const fileName = req.params.filename;
		const bearer = req.headers.authorization.split(' ');
		const token = bearer[1]
		// Extract user email info by token
		var emailaddress = jwt_decode(token);
		emailaddress = emailaddress['emailaddress'];
		const students_exists = await Student.findById(student_id);
		const FolderName = students_exists.firstname_ + '_' + students_exists.lastname_ + '_' + students_exists._id;
		const directoryPath = __basedir + "/public/" + FolderName + '/' + categoryName + '/';
		var downloadPath = ''
		//TODO: what if students_exists.uploadedDocs_.bachelorCertificate_ undefined?
		if (req.params.category === 'bachelorCertificate_') {
			downloadPath = students_exists.uploadedDocs_.bachelorCertificate_.filePath_
		} else if (req.params.category === 'bachelorTranscript_') {
			downloadPath = students_exists.uploadedDocs_.bachelorTranscript_.filePath_
		} else if (req.params.category === 'EnglischCertificate_') {
			downloadPath = students_exists.uploadedDocs_.EnglischCertificate_.filePath_
		} else if (req.params.category === 'GermanCertificate_') {
			downloadPath = students_exists.uploadedDocs_.GermanCertificate_.filePath_
		} else if (req.params.category === 'highschoolDiploma_') {
			downloadPath = students_exists.uploadedDocs_.highSchoolDiploma_.filePath_
		} else if (req.params.category === 'highschoolTranscript_') {
			downloadPath = students_exists.uploadedDocs_.highSchoolTranscript_.filePath_
		} else if (req.params.category === 'universityEntranceExamination_') {
			downloadPath = students_exists.uploadedDocs_.GSAT_.filePath_
		} else if (req.params.category === 'ML_') {
			downloadPath = students_exists.uploadedDocs_.ML_.filePath_
		} else if (req.params.category === 'CV_') {
			downloadPath = students_exists.uploadedDocs_.CV_.filePath_
		} else if (req.params.category === 'RL_') {
			downloadPath = students_exists.uploadedDocs_.RL_.filePath_
		} else if (req.params.category === 'ECTS_conversion_') {
			downloadPath = students_exists.uploadedDocs_.ECTS_conversion_.filePath_
		} else if (req.params.category === 'CourseDescription_') {
			downloadPath = students_exists.uploadedDocs_.courseDescription_.filePath_
		} else if (req.params.category === 'Essay_') {
			downloadPath = students_exists.uploadedDocs_.Essay_.filePath_
		}
		var filename = downloadPath.split('\\');
		console.log("filename: " + filename)
		filename = filename.pop()  // Get the last element (file name)
		console.log("filename: " + filename)
		if (fs.existsSync(downloadPath)) {
			console.log("file existed!")
			res.download(downloadPath, filename, (err) => {
				if (err) {
					res.status(500).send({
						message: "Could not download the file. " + err,
					});  // 500 Internal Server Error
				}
				else {
					console.log("filedownload success!")
					res.status(200).end(); // 200 success
				}
			});
		}
		else {
			console.log("file not existed!")
			res.status(500).send({
				message: "Could not download the file. ",
			});  // 500 Internal Server Error
		}



		// const fileName = "dd-ddd.png";
		// const directoryPath = __basedir + "/public/"+ categoryName + "/";
		//TODO: can access only the student's document, not others
		// if (fs.existsSync(directoryPath + fileName)) {
		// 	console.log("file existed!")
		// 	res.download(directoryPath + fileName, fileName, (err) => {
		// 		if (err) {
		// 			res.status(500).send({
		// 				message: "Could not download the file. " + err,
		// 			});  // 500 Internal Server Error
		// 		}
		// 	}).end();
		// }
		// else {
		// 	console.log("file not existed!")
		// 	res.status(500).send({
		// 		message: "Could not download the file. ",
		// 	});  // 500 Internal Server Error
		// }
	} catch (err) {
		console.log('error download file: ' + err)
		return res.status(500).end(); // 500 Internal Server Error
	}
}





exports.deletefile = async (req, res, next) => {
	try {
		// console.log('filedownload req.params.filename = ' + req.params.category)
		const categoryName = req.params.category;
		const student_id = req.params.student_id;
		console.log('student id: ' + student_id)
		// const fileName = req.params.filename;
		const bearer = req.headers.authorization.split(' ');
		const token = bearer[1]
		// Extract user email info by token
		var emailaddress = jwt_decode(token);
		emailaddress = emailaddress['emailaddress'];
		let students_exists = await Student.findById(student_id);
		const date_now = Date()
		if (req.params.category === 'bachelorCertificate_') {
			if (fs.existsSync(students_exists.uploadedDocs_.bachelorCertificate_.filePath_)) {
				// TODO:To delete file here: Path not correct
				fs.unlinkSync(students_exists.uploadedDocs_.bachelorCertificate_.filePath_) // delete file on old path, no moving
				console.log("delete bachelorCertificate_ success")
			} else {
				console.log("delete bachelorCertificate_ failed")
			}
			await Student.findByIdAndUpdate(student_id, {
				"$set": {
					"uploadedDocs_.bachelorCertificate_.uploadStatus_": '',
					"uploadedDocs_.bachelorCertificate_.filePath_": '',
					"uploadedDocs_.bachelorCertificate_.LastUploadDate_": date_now
				}
			});

		} else if (req.params.category === 'bachelorTranscript_') {
			if (fs.existsSync(students_exists.uploadedDocs_.bachelorTranscript_.filePath_)) {
				// TODO:To delete file here: Path not correct
				fs.unlinkSync(students_exists.uploadedDocs_.bachelorTranscript_.filePath_) // delete file on old path, no moving
				console.log("delete bachelorTranscript_ success")
			} else {
				console.log("delete bachelorTranscript_ failed")
			}
			await Student.findByIdAndUpdate(student_id, {

				"$set": {
					"uploadedDocs_.bachelorTranscript_.uploadStatus_": '',
					"uploadedDocs_.bachelorTranscript_.filePath_": '',
					"uploadedDocs_.bachelorTranscript_.LastUploadDate_": date_now
				}
			});
		} else if (req.params.category === 'EnglischCertificate_') {
			if (fs.existsSync(students_exists.uploadedDocs_.EnglischCertificate_.filePath_)) {
				// TODO:To delete file here: Path not correct
				fs.unlinkSync(students_exists.uploadedDocs_.EnglischCertificate_.filePath_) // delete file on old path, no moving
				console.log("delete EnglischCertificate_ success")
			} else {
				console.log("delete EnglischCertificate_ failed")
			}
			await Student.findByIdAndUpdate(student_id, {

				"$set": {
					"uploadedDocs_.EnglischCertificate_.uploadStatus_": '',
					"uploadedDocs_.EnglischCertificate_.filePath_": '',
					"uploadedDocs_.EnglischCertificate_.LastUploadDate_": date_now
				}
			});
		} else if (req.params.category === 'GermanCertificate_') {
			if (fs.existsSync(students_exists.uploadedDocs_.GermanCertificate_.filePath_)) {
				// TODO:To delete file here: Path not correct
				fs.unlinkSync(students_exists.uploadedDocs_.GermanCertificate_.filePath_) // delete file on old path, no moving
				console.log("delete GermanCertificate_ success")
			} else {
				console.log("delete GermanCertificate_ failed")
			}
			await Student.findByIdAndUpdate(student_id, {

				"$set": {
					"uploadedDocs_.GermanCertificate_.uploadStatus_": '',
					"uploadedDocs_.GermanCertificate_.filePath_": '',
					"uploadedDocs_.GermanCertificate_.LastUploadDate_": date_now
				}
			});
		} else if (req.params.category === 'highschoolDiploma_') {
			if (fs.existsSync(students_exists.uploadedDocs_.highSchoolDiploma_.filePath_)) {
				// TODO:To delete file here: Path not correct
				fs.unlinkSync(students_exists.uploadedDocs_.highSchoolDiploma_.filePath_) // delete file on old path, no moving
				console.log("delete highSchoolDiploma_ success")
			} else {
				console.log("delete highSchoolDiploma_ failed")
			}
			await Student.findByIdAndUpdate(student_id, {

				"$set": {
					"uploadedDocs_.highSchoolDiploma_.uploadStatus_": '',
					"uploadedDocs_.highSchoolDiploma_.filePath_": '',
					"uploadedDocs_.highSchoolDiploma_.LastUploadDate_": date_now
				}
			});
		} else if (req.params.category === 'highschoolTranscript_') {
			if (fs.existsSync(students_exists.uploadedDocs_.highSchoolTranscript_.filePath_)) {
				// TODO:To delete file here: Path not correct
				fs.unlinkSync(students_exists.uploadedDocs_.highSchoolTranscript_.filePath_) // delete file on old path, no moving
				console.log("delete highSchoolTranscript_ success")
			} else {
				console.log("delete highSchoolTranscript_ failed")
			}
			await Student.findByIdAndUpdate(student_id, {

				"$set": {
					"uploadedDocs_.highSchoolTranscript_.uploadStatus_": '',
					"uploadedDocs_.highSchoolTranscript_.filePath_": '',
					"uploadedDocs_.highSchoolTranscript_.LastUploadDate_": date_now
				}
			});
		} else if (req.params.category === 'universityEntranceExamination_') {
			if (fs.existsSync(students_exists.uploadedDocs_.GSAT_.filePath_)) {
				// TODO:To delete file here: Path not correct
				fs.unlinkSync(students_exists.uploadedDocs_.GSAT_.filePath_) // delete file on old path, no moving
				console.log("delete GSAT_ success")
			} else {
				console.log("delete GSAT_ failed")
			}
			await Student.findByIdAndUpdate(student_id, {

				"$set": {
					"uploadedDocs_.GSAT_.uploadStatus_": '',
					"uploadedDocs_.GSAT_.filePath_": '',
					"uploadedDocs_.GSAT_.LastUploadDate_": date_now
				}
			});
		} else if (req.params.category === 'ML_') {
			if (fs.existsSync(students_exists.uploadedDocs_.ML_.filePath_)) {
				// TODO:To delete file here: Path not correct
				fs.unlinkSync(students_exists.uploadedDocs_.ML_.filePath_) // delete file on old path, no moving
				console.log("delete ML_ success")
			} else {
				console.log("delete ML_ failed")
			}
			await Student.findByIdAndUpdate(student_id, {

				"$set": {
					"uploadedDocs_.ML_.uploadStatus_": '',
					"uploadedDocs_.ML_.filePath_": '',
					"uploadedDocs_.ML_.LastUploadDate_": date_now
				}
			});

		} else if (req.params.category === 'CV_') {
			if (fs.existsSync(students_exists.uploadedDocs_.CV_.filePath_)) {
				// TODO:To delete file here: Path not correct
				fs.unlinkSync(students_exists.uploadedDocs_.CV_.filePath_) // delete file on old path, no moving
				console.log("delete CV_ success")
			} else {
				console.log("delete CV_ failed")
			}
			await Student.findByIdAndUpdate(student_id, {

				"$set": {
					"uploadedDocs_.CV_.uploadStatus_": '',
					"uploadedDocs_.CV_.filePath_": '',
					"uploadedDocs_.CV_.LastUploadDate_": date_now
				}
			});

		} else if (req.params.category === 'RL_') {
			if (fs.existsSync(students_exists.uploadedDocs_.RL_.filePath_)) {
				// TODO:To delete file here: Path not correct
				fs.unlinkSync(students_exists.uploadedDocs_.RL_.filePath_) // delete file on old path, no moving
				console.log("delete RL_ success")
			} else {
				console.log("delete RL_ failed")
			}
			await Student.findByIdAndUpdate(student_id, {
				"$set": {
					"uploadedDocs_.RL_.uploadStatus_": '',
					"uploadedDocs_.RL_.filePath_": '',
					"uploadedDocs_.RL_.LastUploadDate_": date_now
				}
			});

		} else if (req.params.category === 'ECTS_conversion_') {
			if (fs.existsSync(students_exists.uploadedDocs_.ECTS_conversion_.filePath_)) {
				// TODO:To delete file here: Path not correct
				fs.unlinkSync(students_exists.uploadedDocs_.ECTS_conversion_.filePath_) // delete file on old path, no moving
				console.log("delete ECTS_conversion_ success")
			} else {
				console.log("delete ECTS_conversion_ failed")
			}
			await Student.findByIdAndUpdate(student_id, {
				"$set": {
					"uploadedDocs_.ECTS_conversion_.uploadStatus_": '',
					"uploadedDocs_.ECTS_conversion_.filePath_": '',
					"uploadedDocs_.ECTS_conversion_.LastUploadDate_": date_now
				}
			});
		} else if (req.params.category === 'CourseDescription_') {
			if (fs.existsSync(students_exists.uploadedDocs_.CourseDescription_.filePath_)) {
				// TODO:To delete file here: Path not correct
				fs.unlinkSync(students_exists.uploadedDocs_.CourseDescription_.filePath_) // delete file on old path, no moving
				console.log("delete CourseDescription_ success")
			} else {
				console.log("delete CourseDescription_ failed")
			}
			await Student.findByIdAndUpdate(student_id, {
				"$set": {
					"uploadedDocs_.CourseDescription_.uploadStatus_": '',
					"uploadedDocs_.CourseDescription_.filePath_": '',
					"uploadedDocs_.CourseDescription_.LastUploadDate_": date_now
				}
			});
		} else if (req.params.category === 'Essay_') {
			if (fs.existsSync(students_exists.uploadedDocs_.Essay_.filePath_)) {
				// TODO:To delete file here: Path not correct
				fs.unlinkSync(students_exists.uploadedDocs_.Essay_.filePath_) // delete file on old path, no moving
				console.log("delete Essay_ success")
			} else {
				console.log("delete Essay_ failed")
			}
			await Student.findByIdAndUpdate(student_id, {
				"$set": {
					"uploadedDocs_.Essay_.uploadStatus_": '',
					"uploadedDocs_.Essay_.filePath_": '',
					"uploadedDocs_.Essay_.LastUploadDate_": date_now
				}
			});
		}
		await students_exists.save();
		return res.status(200).end(); // 200 success
	} catch (err) {
		console.log('error delete file: ' + err)
		return res.status(500).end(); // 500 Internal Server Error
	}
}

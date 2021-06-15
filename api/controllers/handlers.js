const Student = require("../models/Students");
const Program = require("../models/Programs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
// const path = require("path");
const bcrypt = require("bcrypt");
// var nodemailer = require('nodemailer');
const { Schema } = require("mongoose");


const saltRounds = 10;

const jwtKey = "my_secret_key";
const jwtExpirySeconds = 6000;

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
				console.log(data);
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
				needToBeUpload_: req.body.CV_
			},
			RL_: {
				needToBeUpload_: req.body.CV_
			}
		};

		await New_Program.save();
		return res.send({
			data: New_Program
		})

	} catch (err) {
		console.log('error by programlist')
		console.log(err)
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
		program.LastUpdate_ = date_now,

			// });
			await program.save();
		return res.send({
			data: program
		})
	} catch (err) {
		console.log('error by programlist')
		console.log(err)
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
			return res.status(401).end();
		}
		console.log(err)
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

exports.Upload = async (req, res) => {
	//TODO: response the uploaded files.
	// response the status of each document
	res.status(404).end()
}

exports.UploadPost = async (req, res, next) => {
	console.log("cors: load success!")
	res.json({ file: req.file })
	// res.status(201).end()
	// const url = req.protocol + '://' + req.get('host')
	// const user = new User({
	// 	name: req.body.name,
	// 	profileImg: url + '/public/' + "file_name.pdf"
	// });
	// user.save().then(result => {
	// 	res.status(201).json({
	// 		message: "User registered successfully!",
	// 		userCreated: {
	// 			_id: result._id,
	// 			profileImg: result.profileImg
	// 		}
	// 	})
	// 	console.log("save success!")
	// }).catch(err => {
	// 	console.log(err),
	// 		res.status(500).json({
	// 			error: err
	// 		});
	// })
}


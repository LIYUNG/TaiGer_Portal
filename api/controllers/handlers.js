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
		// console.log(token);
		// console.log(req.headers.authorization);
		// var token = req.cookies.token
		// //Extract user email info by token
		var emailaddress = jwt_decode(token);
		// var emailaddress = 'jwt_decode(token)';
		// //Get user email
		emailaddress = emailaddress['emailaddress'];
		console.log(emailaddress);
		const students_exists = await Student.findOne({ emailaddress_: emailaddress });
		// console.log(students_exists);
		// Renew token again, entend expire time
		// token = jwt.sign({ emailaddress }, jwtKey, {
		// 	algorithm: "HS256",
		// 	expiresIn: jwtExpirySeconds,
		// })
		// Access all programs
		// console.log("programlist");
		if (students_exists.role_ === 'Agent') {

			const program_all = await Program.find();
			// console.log(program_all);
			res.send({
				data: program_all
			})
		} else {
			res.send({
				data: [students_exists]
			})
		}
	} catch (err) {
		if (e instanceof jwt.JsonWebTokenError) {
			// 	// if the error thrown is because the JWT is unauthorized, return a 401 error
			console.log(e)
			console.log('error by programlist')
			return res.status(401).end();
		}
		console.log(err)
	}
}


exports.getprogram = async (req, res) => {

	try {
		console.log('req.params.id' + req.params.id)
		const program_id = req.params.id
		let program = await Program.findById(program_id)
		console.log('program: ' + program)

		const bearer = req.headers.authorization.split(' ');
		const token = bearer[1]
		// var token = req.cookies.token
		// //Extract user email info by token
		// var emailaddress = jwt_decode(token);
		// emailaddress = emailaddress['emailaddress'];
		// console.log(emailaddress);
		// const students_exists = await Student.findOne({ emailaddress_: emailaddress });

		// Renew token again, entend expire time
		// token = jwt.sign({ emailaddress }, jwtKey, {
		// 	algorithm: "HS256",
		// 	expiresIn: jwtExpirySeconds,
		// })
		// Access all programs
		// console.log("programlist");
		res.send({
			data: program_id
		})
		// if (students_exists.role_ === 'Agent') {

		// 	const program_all = await Program.find();
		// 	// console.log(program_all);
		// 	res.send({
		// 		data: program_all
		// 	})
		// } else {
		// 	res.send({
		// 		data: [students_exists]
		// 	})
		// }
	} catch (e) {
		if (e instanceof jwt.JsonWebTokenError) {
			// 	// if the error thrown is because the JWT is unauthorized, return a 401 error
			console.log(e)
			console.log('error by programlist')
			return res.status(401).end();
		}
		console.log(e)
	}
}


exports.addprogram = async (req, res) => {
	console.log(req.body)
	try {
		const New_Program = new Program({
			University : req.body.university,
			Program : req.body.program,
			// degreeTitle_ : req.body.degreeTitle,
			// TOEFL_ : req.body.toefl,
			// IELTS_ : req.body.ielts,
			// TestDaF_ : req.body.testdaf,
			// GMAT_ : req.body.gmat,
			// GRE_ : req.body.gre,
			// applicationStart_ : req.body.applicationStart_,
			// applicationDeadline_ : req.body.applicationDeadline_,
			// weblink_ : req.body.weblink_,
			// FPSOlink_ : req.body.FPSOlink_,
			// lastUpdate : req.body.lastUpdate,
		});

		await New_Program.save();
		return res.send({
			data: New_Program
		})

	} catch (err) {
		console.log('error by programlist')
		console.log(err)
	}
}

exports.deleteprogram = async (req, res) => {

	try {
		console.log('req.body.program_id = ' + req.body.program_id)
		const program_id = req.body.program_id
		await Program.findByIdAndDelete(program_id)
				// console.log(program_all);
		res.send({
			data: 'success'
		})

	} catch (err) {
		console.log('error by delete program')
		console.log(err)
	}
}

exports.studentlist = async (req, res) => {

	try {
		const bearer = req.headers.authorization.split(' ');
		const token = bearer[1]
		console.log(token);
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
		else {
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

exports.Upload = async (req, res) => {
	//TODO: response the uploaded files.
	// response the status of each document
	res.status(404).end()
}

exports.UploadPost = async (req, res, next) => {
	console.log("cors: load success!")
	const url = req.protocol + '://' + req.get('host')
	const user = new User({
		name: req.body.name,
		profileImg: url + '/public/' + "file_name.pdf"
	});
	user.save().then(result => {
		res.status(201).json({
			message: "User registered successfully!",
			userCreated: {
				_id: result._id,
				profileImg: result.profileImg
			}
		})
		console.log("save success!")
	}).catch(err => {
		console.log(err),
			res.status(500).json({
				error: err
			});
	})
}


const Student = require("../models/Students");
const Program = require("../models/Programs");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const path = require("path");
const bcrypt = require("bcrypt");
var nodemailer = require('nodemailer');
const { Schema } = require("mongoose");



const saltRounds = 10;

const jwtKey = "my_secret_key";
const jwtExpirySeconds = 60;

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

function userInfo(stud) {
	const viewModel = {
		user:
		{
			firstname: stud.firstname_,
			lastname: stud.lastname_
		}
	}
	return viewModel;
}

exports.logOut = async (req, res) => {
	res.cookie("token", "abc", { maxAge: 100 }); //send random token, milliseconds
	res.redirect("/login");
}

exports.logIn = async (req, res) => {
	const token_init = req.cookies.token
	// if the cookie is not set, return an unauthorized error
	if (!token_init) {
		return res.render("index_login"); // index refers to index.ejs
	}
	else {
		var payload
		try {
			// Check token
			payload = jwt.verify(token_init, jwtKey)
		} catch (e) {
			if (e instanceof jwt.JsonWebTokenError) {
				// if the error thrown is because the JWT is unauthorized, return a 401 error
				console.log("no valid token at login page")
				res.render("index_login"); // index refers to index.ejs
			}
			// otherwise, return a bad request error
			return res.status(400).end();
		}

		// Finally, return the welcome message to the user, along with their
		return res.redirect("/welcome");
	}
}

exports.signIn = async (req, res) => {

	console.log(req.body);
	const { emailaddress, password } = req.body;
	console.log("here is ");
	// Found existing users
	const students_exists = await Student.findOne({ emailaddress_: req.body.emailaddress });
	console.log(students_exists);
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
					// console.log(token);

					return res.send({ token: token })
					// return res.redirect("/welcome");
				} else {
					console.log('wrong password !');
					return res.redirect("/login");
					// return res.status(401).json({ msg: "Invalid credencial" });
				}
			})
		}
		else {
			//Error
			console.log('User not existed !');
			return res.redirect("/login");
		}
	} catch (err) {
		console.log('error!')
		console.log(err)
		return res.redirect("/login");
	}

	// res.redirect("/welcome")
}


exports.welcome = async (req, res) => {
	// We can obtain the session token from the requests cookies, which come with every request

	var token = req.cookies.token
	var emailaddress = jwt_decode(token);
	emailaddress = emailaddress['emailaddress'];

	token = jwt.sign({ emailaddress }, jwtKey, {
		algorithm: "HS256",
		expiresIn: jwtExpirySeconds,
	})

	const students_exists = await Student.findOne({ emailaddress_: emailaddress });
	console.log(students_exists);
	res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 })
	res.render('startbootstrap-sb-admin-master/dist/index', { data: userInfo(students_exists) }); // index refers to index.ejs
}

exports.Charts = async (req, res) => {
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
	res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 })
	res.render('startbootstrap-sb-admin-master/dist/charts', { data: userInfo(students_exists) }); // index refers to index.ejs	
}

exports.layout_static = async (req, res) => {
	var token = req.cookies.token

	//Extract user email info by token
	var emailaddress = jwt_decode(token);
	//Get user email
	emailaddress = emailaddress['emailaddress'];
	console.log(emailaddress);
	const students_exists = await Student.findOne({ emailaddress_: emailaddress });
	console.log(students_exists);
	// Renew token again, entend expire time
	token = jwt.sign({ emailaddress }, jwtKey, {
		algorithm: "HS256",
		expiresIn: jwtExpirySeconds,
	})
	// temporary store user's name to render in html
	const viewModel = {
		user:
		{
			firstname: students_exists.firstname_,
			lastname: students_exists.lastname_
		}
	}
	res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 });
	res.render('startbootstrap-sb-admin-master/dist/layout-static'); // index refers to index.ejs	
}


exports.password = async (req, res) => {
	res.render('startbootstrap-sb-admin-master/dist/password'); // index refers to index.ejs	
}

exports.passwordPost = async (req, res) => {
	res.redirect("/login");
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
	res.render('startbootstrap-sb-admin-master/dist/settings', { data: userInfo(students_exists) }); // index refers to index.ejs	
}

exports.settingsPost = async (req, res) => {
	res.redirect("/settings");
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
			// 	// return res.status(401).end();
		}
		console.log(err)
		// return res.redirect("/login");
	}
}

exports.addprogramlist = async (req, res) => {
	const userProgram = req.body;
	const newProgram = new Program()
	try {
		const program_all = await Program.find();
		// console.log(program_all);
		// res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 }) // Update token
		// res.render('startbootstrap-sb-admin-master/dist/programlist', {data: userInfo(students_exists)}); // index refers to index.ejs	
		res.send({
			data: program_all
		})

	} catch (err) {
		console.log('error by programlist')
		console.log(err)
		// return res.redirect("/login");
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
		// Renew token again, entend expire time
		// token = jwt.sign({ emailaddress }, jwtKey, {
		// 	algorithm: "HS256",
		// 	expiresIn: jwtExpirySeconds,
		// })
		// Access all programs
		// console.log("programlist");
		if (students_exists.role_ === 'Agent') {
			const student_all = await Student.find({ role_: "Student", agent_: "david@gmail.com" });
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
			// 	// if the error thrown is because the JWT is unauthorized, return a 401 error
			console.log(e)
			console.log('error by programlist')
			// 	// return res.status(401).end();
		} 
		console.log(err)
		// return res.redirect("/login");
	}
}

exports.Upload = async (req, res) => {
	var token = req.cookies.token
	var emailaddress = jwt_decode(token);
	//Get user email
	emailaddress = emailaddress['emailaddress'];
	console.log(emailaddress);
	const students_exists = await Student.findOne({ emailaddress_: emailaddress });
	// console.log(students_exists);
	// Renew token again, entend expire time
	token = jwt.sign({ emailaddress }, jwtKey, {
		algorithm: "HS256",
		expiresIn: jwtExpirySeconds,
	})

	console.log(students_exists.firstname_);
	res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 })
	res.render('startbootstrap-sb-admin-master/dist/upload', { data: userInfo(students_exists) }); // index refers to index.ejs	
}

exports.UploadPost = async (req, res) => {
	res.redirect("/upload");
}

exports.e401 = async (req, res) => {
	res.render('startbootstrap-sb-admin-master/dist/e401'); // index refers to index.ejs	
}

exports.e404 = async (req, res) => {
	res.render('startbootstrap-sb-admin-master/dist/e404'); // index refers to index.ejs	
}

exports.e500 = async (req, res) => {
	res.render('startbootstrap-sb-admin-master/dist/e500'); // index refers to index.ejs	
}
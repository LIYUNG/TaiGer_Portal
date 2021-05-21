const Student = require("../models/Students");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const path = require("path");

const jwtKey = "my_secret_key";
const jwtExpirySeconds = 60;

exports.RegisterPost = async (req, res) => {

	console.log(req.body);
	const students_exists = await Student.findOne({ emailaddress_: req.body.emailaddress });
	try {
		const { emailaddress, password } = req.body;
		console.log(emailaddress);
		const token = jwt.sign({ emailaddress }, jwtKey, {
			algorithm: "HS256",
			expiresIn: jwtExpirySeconds,
		})
		// res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 })
		// Hashing password
		console.log("token: " + token);

		const salt = await bcrypt.genSalt(saltRounds);
		// const hashedpassword = await bcrypt.hash(password1, salt);
		const hashedpassword = await bcrypt.hash(password, salt);
		const student = new Student({
			firstname_: req.body.firstname,
			lastname_: req.body.lastname,
			emailaddress_: req.body.emailaddress,
			password_: hashedpassword,
			role_: "Student",
			agent_: ["liyung.chen.leo@gmail.com", "taiger.davidl@gmail.com"]
		});
		console.log(student);
		await student.save();

		return res.send({ token: token })

	} catch (e) {
		console.log('Error in RegisterPost! \n' + e)
		return res.status(401).end();
	}

}
const Student = require("../models/Students");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const path = require("path");

const jwtKey = "my_secret_key";
const jwtExpirySeconds = 600;

exports.Register = async (req, res) => {
	res.render('startbootstrap-sb-admin-master/dist/register'); // index refers to index.ejs	
}

exports.RegisterPost = async (req, res) => {

	console.log(req.body);
	const students_exists = await Student.findOne({emailaddress_: req.body.emailaddress});
	try {
		//Comparing existing users
		if(students_exists != null)
		{
			// not match the password in our records
			//TODO: warning window or Red sentence, repeated user!
			console.log(students_exists);
			console.log('Duplicate user!')
			return res.redirect("/register");
		}
		// Compare password match
		const {password1, password2} = req.body;
		if(password1 === password2)
		{
			const {emailaddress} = req.body;
			console.log(emailaddress);
			const token = jwt.sign({ emailaddress }, jwtKey, {
				algorithm: "HS256",
				expiresIn: jwtExpirySeconds,
			})
			res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 })
			// Hashing password
			const salt = await bcrypt.genSalt(saltRounds);
			const hashedpassword = await bcrypt.hash(password1, salt);
			const student = new Student({firstname_: req.body.firstname, lastname_: req.body.lastname, emailaddress_: req.body.emailaddress, password_: hashedpassword});
			console.log(student);
			await student.save();
			
			return res.redirect("/welcome");
		}
		else
		{
			//TODO: Error no
			console.log('Passwords do not match');
			return res.redirect("/register");
		}
	} catch(e){
		console.log('Error in RegisterPost! \n' + e)
		return res.redirect("/register");
	}

}
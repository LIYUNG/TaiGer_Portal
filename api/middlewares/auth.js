const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Student = require("../models/Students");

const saltRounds = 10;

const jwtKey = "my_secret_key";
// Athuentication
function auth(req, res, next) {

	const bearer = req.headers.authorization.split(' ');
	const token = bearer[1]
	// var token = req.cookies.token
	var payload
	try {
		if (!token) {
			console.log('no token')
			// return res.redirect("/logout"); //give a fake token.
		}
		// Parse the JWT string and store the result in `payload`.
		// Note that we are passing the key in this method as well. This method will throw an error
		// if the token is invalid (if it has expired according to the expiry time we set on sign in),
		// or if the signature does not match
		payload = jwt.verify(token, jwtKey)
		console.log("authentication success")
		next()
	} catch (e) {
		// if (e instanceof jwt.JsonWebTokenError) {
		// // 	// if the error thrown is because the JWT is unauthorized, return a 401 error
		// 	console.log(e)
		// 	console.log('error by auth')
		// // 	// return res.status(401).end();
		// }
		// otherwise, return a bad request error
		console.log(e)
		console.log('error by auth')
		return res.status(401).end();
		// res.send("invalid token");
	}
}


module.exports = { auth };
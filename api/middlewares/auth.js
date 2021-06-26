const jwt = require("jsonwebtoken");

const jwtKey = "my_secret_key";
// Athuentication
async function auth(req, res, next) {
	try {
		const bearer = req.headers.authorization.split(' ');
		const token = bearer[1]
		// var token = req.cookies.token
		var payload
		if (!token) {
			console.log('no token')
		}
		// Parse the JWT string and store the result in `payload`.
		// Note that we are passing the key in this method as well. This method will throw an error
		// if the token is invalid (if it has expired according to the expiry time we set on sign in),
		// or if the signature does not match
		payload = jwt.verify(token, jwtKey)
		console.log("authentication success")
		next()
	} catch (e) {
		if (e instanceof jwt.JsonWebTokenError) {
			// // if the error thrown is because the JWT is unauthorized, return a 401 error
			// 	console.log(e)
			console.log('JsonWebTokenError')
			return res.status(401).end();
		}
		if (e instanceof jwt.TokenExpiredError) {
			console.log('jwt expired')
			return res.status(401).end();
		}
		console.log('Error by auth')
		return res.status(401).end();  // 401 Unauthorized response
	}
}


module.exports = { auth };
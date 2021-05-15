var express = require("express");
var http = require('http');
var https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cookieParser = require("cookie-parser")
const handlers = require("./controllers/handlers");
const { auth } = require("./middlewares/auth");

const studentController = require("./controllers/students");

mongoose.connect('mongodb://localhost:27017/TaiGer', {
	useNewUrlParser: true
})
	.then(() => {
		const app = express();
		app.use(cors());

		app.use(morgan('dev'));
		app.use(bodyParser.urlencoded({
			extended: true //can read req.body
		}));
		app.use(bodyParser.json());
		app.use(express.json());
		app.use(express.static(__dirname + '/views')); //So that it can read css files to render login page
		app.set("view engine", "ejs");
		app.use(cookieParser());

		app.get("/", handlers.logIn);
		app.post("/", handlers.signIn);
		app.get("/login", handlers.logIn);
		app.post("/login", handlers.signIn);
		app.get("/logout", handlers.logOut);
		app.get("/welcome", auth, handlers.welcome);
		app.get("/register", studentController.Register);
		app.post("/register", studentController.RegisterPost);
		app.get("/charts", auth, handlers.Charts);
		app.get("/password", handlers.password);
		app.post("/password", handlers.passwordPost);
		app.get("/programlist", auth, handlers.programlist);
		app.get("/upload", auth, handlers.Upload);
		app.post("/upload", auth, handlers.UploadPost);
		app.get("/settings", auth, handlers.settings);
		app.post("/settings", auth, handlers.settingsPost);
		app.use((req, res, next) => {
			res.render('startbootstrap-sb-admin-master/dist/e404'); // index refers to index.ejs	
		})
		// error handler
		app.use(function (err, req, res, next) {
			// set locals, only providing error in development
			res.locals.message = err.message;
			res.locals.error = req.app.get('env') === 'development' ? err : {};

			// render the error page
			res.status(err.status || 500);
			res.render('error');
		});


		const httpServer = http.createServer(app);
		const httpsServer = https.createServer({
			key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
			cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
		}, app);
		httpServer.listen(80, () => {
			console.log('HTTP Server running on port 80');
		});
		httpsServer.listen(443, () => {
			console.log('HTTPS Server running on port 443');
		});

	}).catch((err) => {
		console.log('Error in index.js\n' + err)
		console.log('Database connection failed!');
	})


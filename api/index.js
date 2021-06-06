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
const multer = require("multer");
const crypto = require("crypto");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");


const DIR = './public/';

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, DIR);
	},
	filename: (req, file, cb) => {
		const fileName = file.originalname.toLowerCase().split(' ').join('-');
		cb(null, fileName)
	}
});

var upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
			cb(null, true);
		} else {
			cb(null, false);
			return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
		}
	}
});



const connection = mongoose.connect('mongodb://localhost:27017/TaiGer', {
	useNewUrlParser: true
})
// const connection = mongoose.createConnection('mongodb://localhost:27017/TaiGer')
// let gfs;
// connection.once('open', () => {
// 	// Init stream
// 	gfs = Grid(connection.db, mongoose.mongo);
// 	gfs.collection('uploads')
// })
// const storage2 = new GridFsStorage({ db: connection });

const storage2 = new GridFsStorage({
	// db: connection,
	url: 'mongodb://localhost:27017/TaiGer',
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if (err) {
					console.log("reject: ")
					return reject(err);
				}
				const filename = buf.toString('hex') + path.extname(file.originalname);
				const fileInfo = {
					filename: filename,
					bucketName: 'uploads'
				};
				console.log("filename: " + filename)
				resolve(fileInfo);
			});
		});
	}
});
const upload2 = multer({ storage2 });

try {
	const app = express();
	app.use(cors());

	app.use(morgan('dev'));
	app.use(bodyParser.urlencoded({
		extended: true //can read req.body
	}));
	app.use(methodOverride('_method')); //in order to make delete request
	app.use(bodyParser.json());
	app.use(express.json());
	app.use(express.static(__dirname + '/views')); //So that it can read css files to render login page
	app.set("view engine", "ejs");
	app.use(cookieParser());

	app.post("/login", handlers.signIn);
	app.post("/register", studentController.RegisterPost);
	app.get("/charts", auth, handlers.Charts);
	app.post("/password", handlers.passwordPost);
	app.get("/programlist", auth, handlers.programlist);
	app.post("/addprogram", auth, handlers.addprogram);
	app.post("/editprogram/:id", auth, handlers.editprogram);
	app.delete("/deleteprogram", auth, handlers.deleteprogram);
	app.post("/assignprogramtostudent/:id", auth, handlers.assignprogramtostudent);
	app.get("/studentlist", auth, handlers.studentlist);
	app.post("/editagent", auth, handlers.editagent);
	app.post("/editstudentprogram", auth, handlers.editstudentprogram);
	app.delete("/deleteprogram", auth, handlers.deleteprogram);
	// app.get("/upload", auth, handlers.Upload);
	// app.post("/upload", auth, upload2.single('file'), handlers.UploadPost);
	app.post("/upload", auth, upload2.single('file'), (req, res) => {
		res.json({ file: req.file })
	});
	app.get("/settings", auth, handlers.settings);
	// error handler
	app.use(function (err, req, res, next) {
		// set locals, only providing error in development
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};
		console.log(err)
		// render the error page
		res.status(err.status || 500);
		res.send('render the error page error');
	});


	const httpServer = http.createServer(app);
	const httpsServer = https.createServer({
		key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
		cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
	}, app);
	httpServer.listen(2000, () => {
		console.log('HTTP Server running on port 2000');
	});
	httpsServer.listen(443, () => {
		console.log('HTTPS Server running on port 443');
	});

} catch (err) {
	console.log('Error in index.js\n' + err)
	console.log('Database connection failed!');
}



// mongoose.connect('mongodb://localhost:27017/TaiGer', {
// 	useNewUrlParser: true
// })
// 	.then(() => {
// 		const app = express();
// 		app.use(cors());

// 		app.use(morgan('dev'));
// 		app.use(bodyParser.urlencoded({
// 			extended: true //can read req.body
// 		}));
// 		app.use(methodOverride('_method')); //in order to make delete request
// 		app.use(bodyParser.json());
// 		app.use(express.json());
// 		app.use(express.static(__dirname + '/views')); //So that it can read css files to render login page
// 		app.set("view engine", "ejs");
// 		app.use(cookieParser());

// 		app.post("/login", handlers.signIn);
// 		app.post("/register", studentController.RegisterPost);
// 		app.get("/charts", auth, handlers.Charts);
// 		app.post("/password", handlers.passwordPost);
// 		app.get("/programlist", auth, handlers.programlist);
// 		app.post("/addprogram", auth, handlers.addprogram);
// 		app.post("/editprogram/:id", auth, handlers.editprogram);
// 		app.delete("/deleteprogram", auth, handlers.deleteprogram);
// 		app.get("/studentlist", auth, handlers.studentlist);
// 		// app.get("/upload", auth, handlers.Upload);
// 		app.post("/upload", auth, upload.single('profileImg'), handlers.UploadPost);
// 		app.get("/settings", auth, handlers.settings);
// 		// error handler
// 		app.use(function (err, req, res, next) {
// 			// set locals, only providing error in development
// 			res.locals.message = err.message;
// 			res.locals.error = req.app.get('env') === 'development' ? err : {};
// 			console.log(err)
// 			// render the error page
// 			res.status(err.status || 500);
// 			res.send('render the error page error');
// 		});


// 		const httpServer = http.createServer(app);
// 		const httpsServer = https.createServer({
// 			key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
// 			cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
// 		}, app);
// 		httpServer.listen(2000, () => {
// 			console.log('HTTP Server running on port 2000');
// 		});
// 		httpsServer.listen(443, () => {
// 			console.log('HTTPS Server running on port 443');
// 		});

// 	}).catch((err) => {
// 		console.log('Error in index.js\n' + err)
// 		console.log('Database connection failed!');
// 	})


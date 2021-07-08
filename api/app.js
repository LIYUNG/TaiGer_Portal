// FIXME: remove global variable
global.__basedir = __dirname;
global.jwtExpirySeconds = 6000;
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const methodOverride = require("method-override");

const { auth } = require("./middlewares/auth");
const { movefile } = require("./middlewares/movefile");
const { checkuserfolder } = require("./middlewares/checkuserfolder");

const handlers = require("./controllers/handlers");
const studentController = require("./controllers/students");

const DIR = "./public/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName =
      Date.now() + file.originalname.toLowerCase().split(" ").join("-");
    cb(null, fileName);
  },
});
//TODO: upload pdf/docx/image
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Maximum file size: 5 MB
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "application/pdf" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      console.log("multer middleware: " + req.params.category);
      cb(null, true);
    } else {
      // cb(null, false);
      return cb(new Error("Only .pdf .png, .jpg and .jpeg format allowed!"));
    }
  },
});

const app = express();
app.use(cors({ exposedHeaders: ["Content-Disposition"] }));

app.use(morgan("dev"));
app.use(methodOverride("_method")); //in order to make delete request
app.use(express.json());
app.use(express.static(__dirname + "/views")); //So that it can read css files to render login page
app.use(cookieParser());

app.post("/login", handlers.signIn);
app.post("/register", studentController.RegisterPost);
app.get("/charts", auth, handlers.Charts);
app.post("/password", handlers.passwordPost);
app.get("/programlist", auth, handlers.programlist);
app.post("/addprogram", auth, handlers.addprogram);
app.post("/editprogram/:id", auth, handlers.editprogram);
app.delete("/deleteprogram", auth, handlers.deleteprogram);
app.post("/assignprogramtostudent", auth, handlers.assignprogramtostudent);
app.get("/studentlist", auth, handlers.studentlist);
app.get("/editagent", auth, handlers.editagent);
app.get("/editeditor", auth, handlers.editeditor);
app.post("/editstudentprogram", auth, handlers.editstudentprogram);
app.delete("/deleteprogram", auth, handlers.deleteprogram);
app.post(
  "/upload/:category",
  auth,
  upload.single("file"),
  checkuserfolder,
  movefile,
  handlers.UploadPost
);
// app.post("/upload", auth, upload.single('file'), handlers.UploadPost);
app.get("/upload/:category", auth, handlers.filedownload);
app.get(
  "/download/:category/:student_id",
  auth,
  handlers.filedownloadfromstudent
);
app.delete("/deletefile/:category/:student_id", auth, handlers.deletefile);
app.get("/settings", auth, handlers.settings);
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.send("render the error page error");
});

module.exports = { app };

const multer = require("multer");

const studentController = require("../controllers/students");

const authRouter = require("./auth");
const usersRouter = require("./users");
const agentsRouter = require("./agents")
const editorsRouter = require("./editors")
const studentsRouter = require("./students");
const documentationsRouter = require("./documentations");
const programsRouter = require("./programs");
const filesRouter = require('./files')

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
    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpg",
      "image/jpeg",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      console.log("multer middleware: " + req.params.category);
      cb(null, true);
    } else {
      // cb(null, false);
      return cb(
        new Error("Only .pdf .png, .jpg and .jpeg .docx format allowed!")
      );
    }
  },
});

const router = (app) => {
  app.use("/auth", authRouter);

  app.use("/users", usersRouter);
  app.use("/students", studentsRouter)
  app.use("/agents", agentsRouter)
  app.use("/editors", editorsRouter)

  app.use("/docs", documentationsRouter);
  app.use("/programs", programsRouter);
  app.use('/files', filesRouter)

  // TODO: organize below routes
  app.post("/login", studentController.signIn);
  app.post("/register", studentController.signUp);
  app.post("/password", studentController.passwordPost);
  app.get("/settings", studentController.settings); // auth middleware
};

module.exports = router;

const multer = require("multer");

const authRouter = require("./auth");
const { auth } = require("../middlewares/auth");
const { movefile } = require("../middlewares/movefile");
const { checkuserfolder } = require("../middlewares/checkuserfolder");

const handlers = require("../controllers/handlers");
const file_handler = require("../controllers/file_handler");
const studentController = require("../controllers/students");
const documentation_handler = require("../controllers/documentation_handler");

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
      file.mimetype == "image/jpeg" ||
      file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype ==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      console.log("multer middleware: ");
      console.log("multer middleware: " + req.params.category);
      cb(null, true);
    } else {
      // cb(null, false);
      return cb(new Error("Only .pdf .png, .jpg and .jpeg .docx format allowed!"));
    }
  },
});

const router = (app) => {
  app.use("/auth", authRouter);

  // TODO: organize below routes
  app.post("/login", handlers.signIn);
  app.post("/register", studentController.RegisterPost);
  app.post("/password", handlers.passwordPost);

  app.get("/charts", auth, handlers.Charts);
  app.get("/programlist", auth, handlers.programlist);
  app.get("/userslist", auth, handlers.userslist);
  app.post("/addprogram", auth, handlers.addprogram);
  app.post("/editprogram/:id", auth, handlers.editprogram);
  app.post("/edituser/:id", auth, handlers.edituser);
  app.delete("/deleteprogram/:program_id", auth, handlers.deleteprogram);
  app.delete("/deleteuser/:user_id", auth, handlers.deleteuser);
  app.post("/changeuserrole", auth, handlers.changeuserrole);
  app.post("/assignprogramtostudent", auth, handlers.assignprogramtostudent);
  app.get("/studentlist", auth, handlers.studentlist);
  app.get("/editagent", auth, handlers.editagent);
  app.post("/updateagent/:student_id", auth, handlers.updateagent);
  app.get("/editeditor", auth, handlers.editeditor);
  app.post("/updateeditor/:student_id", auth, handlers.updateeditor);
  app.post("/editstudentprogram", auth, handlers.editstudentprogram);
  app.delete("/deleteprogram", auth, handlers.deleteprogram);
  app.get("/upload", auth, file_handler.UploadPage);
  app.post(
    "/upload/:category",
    auth,
    upload.single("file"),
    checkuserfolder,
    movefile,
    file_handler.UploadPost
  );
  app.get("/download/:category", auth, file_handler.templatefiledownload);
  app.get(
    "/download/:category/:student_id",
    auth,
    file_handler.filedownloadfromstudent
  );
  app.post("/rejectdoc/:category/:student_id", auth, file_handler.rejectdoc);
  app.post("/acceptdoc/:category/:student_id", auth, file_handler.acceptdoc);
  app.delete(
    "/deletefile/:category/:student_id",
    auth,
    file_handler.deletefile
  );
  app.delete(
    "/deleteprogramfromstudent/:program_id/:student_id",
    auth,
    handlers.deleteprogramfromstudent
  );
  app.get("/docs/:article_category", auth, documentation_handler.ReadDocumentation);
  app.post("/docs", auth, documentation_handler.AddNewDocumentation);
  app.post("/docs/:article_id", auth, documentation_handler.UpdateDocumentation);
  app.delete("/docs/:article_id", auth, documentation_handler.DeleteDocumentation);
  app.get("/settings", auth, handlers.settings);
  app.post(
    "/transcriptanalyzer/:category/:programgroup",
    auth,
    upload.single("file"),
    checkuserfolder,
    movefile,
    file_handler.Upload_Transcript_XLSX
  );
  app.get(
    "/generatedfiledownload/:category/:filename",
    auth,
    file_handler.generated_XLSX_download
  );
  
};

module.exports = router;

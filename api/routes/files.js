const { Router } = require("express");

const { auth } = require("../middlewares/auth");
const { movefile } = require("../middlewares/movefile");
const { movefileforstudent } = require("../middlewares/movefileforstudent");
const { checkuserfolder } = require("../middlewares/checkuserfolder");

const {
  getFiles,
  uploadPost,
  uploadForStudentPost,
  templateFileDownload,
  fileDownloadFromStudent,
  rejectDoc,
  acceptDoc,
  deleteFile,
  uploadTranscriptXLSX,
  generatedXLSXDownload,
} = require("../controllers/files");

const router = Router();

router.use(auth);

router.route("/").get(getFiles)


// app.post(
//   "/upload/:category",
//   auth,
//   upload.single("file"),
//   checkuserfolder,
//   movefile,
//   file_handler.UploadPost
// );
// app.post(
//   "/upload/:student_id/:category",
//   auth,
//   upload.single("file"),
//   checkuserfolder,
//   movefileforstudent,
//   file_handler.UploadForStudentPost
// );
// app.get("/download/:category", auth, file_handler.templatefiledownload);
// app.get(
//   "/download/:category/:student_id",
//   auth,
//   file_handler.filedownloadfromstudent
// );
// app.post("/rejectdoc/:category/:student_id", auth, file_handler.rejectdoc);
// app.post("/acceptdoc/:category/:student_id", auth, file_handler.acceptdoc);
// app.delete(
//   "/deletefile/:category/:student_id",
//   auth,
//   file_handler.deletefile
// );
// app.post(
//   "/transcriptanalyzer/:category/:programgroup",
//   auth,
//   upload.single("file"),
//   checkuserfolder,
//   movefile,
//   file_handler.Upload_Transcript_XLSX
// );
// app.get(
//   "/generatedfiledownload/:category/:filename",
//   auth,
//   file_handler.generated_XLSX_download
// );

module.exports = router;

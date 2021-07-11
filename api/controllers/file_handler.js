const Student = require("../models/Students");
const Program = require("../models/Programs");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const bcrypt = require("bcrypt");
const fs = require("fs");

const jwtKey = "my_secret_key";

exports.UploadPost = async (req, res) => {
  try {
    console.log("UploadPost: Which file? " + req.file);
    const bearer = req.headers.authorization.split(" ");
    const token = bearer[1];
    // Extract user email info by token
    var emailaddress = jwt_decode(token);
    // Get user email
    emailaddress = emailaddress["emailaddress"];
    const students_exists = await Student.findOne({
      emailaddress_: emailaddress,
    });
    const FolderName =
      students_exists.firstname_ +
      "_" +
      students_exists.lastname_ +
      "_" +
      students_exists._id;
    const directoryPath = __basedir + "\\public\\" + FolderName + "\\";
    const date_now = Date();
    // Dont worry the category path not exist, because it is generated from the middleware movefile.js
    const categoryPath = directoryPath + req.params.category + "\\";
    console.log(req.file.filename);
    const category_name = req.params.category;

    var uploadStatus_ = "";
    var filePath_ = "";
    var LastUploadDate_ = "";
    uploadStatus_ = "uploadedDocs_." + category_name + ".uploadStatus_";
    filePath_ = "uploadedDocs_." + category_name + ".filePath_";
    LastUploadDate_ = "uploadedDocs_." + category_name + ".LastUploadDate_";
    var obj = {};
    obj[uploadStatus_] = "uploaded";
    obj[filePath_] = categoryPath + req.file.filename;
    obj[LastUploadDate_] = date_now;
    await Student.findOneAndUpdate(
      { emailaddress_: emailaddress },
      {
        $set: obj,
      }
    );

    await students_exists.save();
    console.log("save success!");
    return res.status(200).end();
  } catch (err) {
    console.log("error UploadPost: " + err);
    return res.status(500).end(); // 500 Internal Server Error
  }
};

exports.filedownload = async (req, res, next) => {
  try {
    // console.log('filedownload req.params.filename = ' + req.params.category)
    const category_name = req.params.category;
    // const fileName = req.params.filename;
    const bearer = req.headers.authorization.split(" ");
    const token = bearer[1];
    // Extract user email info by token
    var emailaddress = jwt_decode(token);
    emailaddress = emailaddress["emailaddress"];
    const students_exists = await Student.findOne({
      emailaddress_: emailaddress,
    });
    var downloadPath = "";
    //TODO: what if students_exists.uploadedDocs_.bachelorCertificate_ undefined?
    downloadPath = students_exists.uploadedDocs_[category_name].filePath_;

    var filename = downloadPath.split("\\");
    console.log("filename: " + filename);
    filename = filename.pop(); // Get the last element (file name)
    console.log("filename: " + filename);
    if (fs.existsSync(downloadPath)) {
      console.log("file existed!");
      res.download(downloadPath, filename, (err) => {
        if (err) {
          res.status(500).send({
            message: "Could not download the file. " + err,
          }); // 500 Internal Server Error
        } else {
          console.log("filedownload success!");
          res.status(200).end(); // 200 success
        }
      });
    } else {
      console.log("file not existed!");
      res.status(500).send({
        message: "Could not download the file. ",
      }); // 500 Internal Server Error
    }
  } catch (err) {
    console.log("error download file: " + err);
    return res.status(500).end(); // 500 Internal Server Error
  }
};

exports.filedownloadfromstudent = async (req, res, next) => {
  try {
    // console.log('filedownload req.params.filename = ' + req.params.category)
    const category_name = req.params.category;
    const student_id = req.params.student_id;
    console.log("student id: " + student_id);
    // const fileName = req.params.filename;
    const students_exists = await Student.findById(student_id);
    var downloadPath = "";
    //TODO: what if students_exists.uploadedDocs_.bachelorCertificate_ undefined?
    downloadPath = students_exists.uploadedDocs_[category_name].filePath_;

    var filename = downloadPath.split("\\");
    filename = filename.pop(); // Get the last element (file name)
    console.log("filename: " + filename);
    if (fs.existsSync(downloadPath)) {
      console.log("file existed!");
      res.download(downloadPath, filename, (err) => {
        if (err) {
          res.status(500).send({
            message: "Could not download the file. " + err,
          }); // 500 Internal Server Error
        } else {
          console.log("filedownload success!");
          res.status(200).end(); // 200 success
        }
      });
    } else {
      console.log("file not existed!");
      res.status(500).send({
        message: "Could not download the file. ",
      }); // 500 Internal Server Error
    }
  } catch (err) {
    console.log("error download file: " + err);
    return res.status(500).end(); // 500 Internal Server Error
  }
};

exports.rejectdoc = async (req, res, next) => {
  try {
    // console.log('filedownload req.params.filename = ' + req.params.category)
    const category_name = req.params.category;
    const student_id = req.params.student_id;
    console.log("student id: " + student_id);
    // const students_exists = await Student.findById(student_id);
    const date_now = Date();
    var uploadStatus_ = "";
    var LastUploadDate_ = "";
    uploadStatus_ = "uploadedDocs_." + category_name + ".uploadStatus_";
    LastUploadDate_ = "uploadedDocs_." + category_name + ".LastUploadDate_";
    var obj = {};
    obj[uploadStatus_] = "unaccepted";
    obj[LastUploadDate_] = date_now;
    await Student.findByIdAndUpdate(student_id, {
      $set: obj,
    });
    console.log("reject file success!");
    res.status(200).end(); // 200 success
  } catch (err) {
    console.log("error download file: " + err);
    return res.status(500).end(); // 500 Internal Server Error
  }
};

exports.acceptdoc = async (req, res, next) => {
  try {
    // console.log('filedownload req.params.filename = ' + req.params.category)
    const category_name = req.params.category;
    const student_id = req.params.student_id;
    console.log("student id: " + student_id);
    const date_now = Date();
    var uploadStatus_ = "";
    var LastUploadDate_ = "";
    uploadStatus_ = "uploadedDocs_." + category_name + ".uploadStatus_";
    LastUploadDate_ = "uploadedDocs_." + category_name + ".LastUploadDate_";
    var obj = {};
    obj[uploadStatus_] = "checked";
    obj[LastUploadDate_] = date_now;
    await Student.findByIdAndUpdate(student_id, {
      $set: obj,
    });
    console.log("accept file success!");
    res.status(200).end(); // 200 success
  } catch (err) {
    console.log("error download file: " + err);
    return res.status(500).end(); // 500 Internal Server Error
  }
};

exports.deletefile = async (req, res, next) => {
  try {
    // console.log('filedownload req.params.filename = ' + req.params.category)
    const category_name = req.params.category;
    const student_id = req.params.student_id;
    console.log("student id: " + student_id);
    // const fileName = req.params.filename;
    let students_exists = await Student.findById(student_id);
    const date_now = Date();

    // delete file
    if (fs.existsSync(students_exists.uploadedDocs_[category_name].filePath_)) {
      // TODO:To delete file here: Path not correct
      fs.unlinkSync(students_exists.uploadedDocs_[category_name].filePath_);
      console.log("delete " + category_name + " success");
    } else {
      console.log("delete " + category_name + " failed");
    }
    // update info in DB
    var uploadStatus_ = "";
    var filePath_ = "";
    var LastUploadDate_ = "";
    uploadStatus_ = "uploadedDocs_." + category_name + ".uploadStatus_";
    filePath_ = "uploadedDocs_." + category_name + ".filePath_";
    LastUploadDate_ = "uploadedDocs_." + category_name + ".LastUploadDate_";
    var obj = {};
    obj[uploadStatus_] = "";
    obj[filePath_] = "";
    obj[LastUploadDate_] = date_now;
    await Student.findByIdAndUpdate(student_id, {
      $set: obj,
    });

    return res.status(200).end(); // 200 success
  } catch (err) {
    console.log("error delete file: " + err);
    return res.status(500).end(); // 500 Internal Server Error
  }
};

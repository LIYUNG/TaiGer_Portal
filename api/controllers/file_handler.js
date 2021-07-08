const Student = require("../models/Students");
const Program = require("../models/Programs");
const User = require("../models/User");
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

    const categoryPath = directoryPath + req.params.category + "\\";
    console.log(req.file.filename);
    if (req.params.category === "bachelorCertificate_") {
      await Student.findOneAndUpdate(
        { emailaddress_: emailaddress },
        {
          $set: {
            "uploadedDocs_.bachelorCertificate_.uploadStatus_": "uploaded",
            "uploadedDocs_.bachelorCertificate_.filePath_":
              categoryPath + req.file.filename,
            "uploadedDocs_.bachelorCertificate_.LastUploadDate_": date_now,
          },
        }
      );
    } else if (req.params.category === "bachelorTranscript_") {
      await Student.findOneAndUpdate(
        { emailaddress_: emailaddress },
        {
          $set: {
            "uploadedDocs_.bachelorTranscript_.uploadStatus_": "uploaded",
            "uploadedDocs_.bachelorTranscript_.filePath_":
              categoryPath + req.file.filename,
            "uploadedDocs_.bachelorTranscript_.LastUploadDate_": date_now,
          },
        }
      );
    } else if (req.params.category === "EnglischCertificate_") {
      await Student.findOneAndUpdate(
        { emailaddress_: emailaddress },
        {
          $set: {
            "uploadedDocs_.EnglischCertificate_.uploadStatus_": "uploaded",
            "uploadedDocs_.EnglischCertificate_.filePath_":
              categoryPath + req.file.filename,
            "uploadedDocs_.EnglischCertificate_.LastUploadDate_": date_now,
          },
        }
      );
    } else if (req.params.category === "GermanCertificate_") {
      await Student.findOneAndUpdate(
        { emailaddress_: emailaddress },
        {
          $set: {
            "uploadedDocs_.GermanCertificate_.uploadStatus_": "uploaded",
            "uploadedDocs_.GermanCertificate_.filePath_":
              categoryPath + req.file.filename,
            "uploadedDocs_.GermanCertificate_.LastUploadDate_": date_now,
          },
        }
      );
    } else if (req.params.category === "highSchoolDiploma_") {
      await Student.findOneAndUpdate(
        { emailaddress_: emailaddress },
        {
          $set: {
            "uploadedDocs_.highSchoolDiploma_.uploadStatus_": "uploaded",
            "uploadedDocs_.highSchoolDiploma_.filePath_":
              categoryPath + req.file.filename,
            "uploadedDocs_.highSchoolDiploma_.LastUploadDate_": date_now,
          },
        }
      );
    } else if (req.params.category === "highSchoolTranscript_") {
      await Student.findOneAndUpdate(
        { emailaddress_: emailaddress },
        {
          $set: {
            "uploadedDocs_.highSchoolTranscript_.uploadStatus_": "uploaded",
            "uploadedDocs_.highSchoolTranscript_.filePath_":
              categoryPath + req.file.filename,
            "uploadedDocs_.highSchoolTranscript_.LastUploadDate_": date_now,
          },
        }
      );
    } else if (req.params.category === "universityEntranceExamination_") {
      await Student.findOneAndUpdate(
        { emailaddress_: emailaddress },
        {
          $set: {
            "uploadedDocs_.universityEntranceExamination_.uploadStatus_": "uploaded",
            "uploadedDocs_.universityEntranceExamination_.filePath_": categoryPath + req.file.filename,
            "uploadedDocs_.universityEntranceExamination_.LastUploadDate_": date_now,
          },
        }
      );
    } else if (req.params.category === "ML_") {
      await Student.findOneAndUpdate(
        { emailaddress_: emailaddress },
        {
          $set: {
            "uploadedDocs_.ML_.uploadStatus_": "uploaded",
            "uploadedDocs_.ML_.filePath_": categoryPath + req.file.filename,
            "uploadedDocs_.ML_.LastUploadDate_": date_now,
          },
        }
      );
    } else if (req.params.category === "CV_") {
      await Student.findOneAndUpdate(
        { emailaddress_: emailaddress },
        {
          $set: {
            "uploadedDocs_.CV_.uploadStatus_": "uploaded",
            "uploadedDocs_.CV_.filePath_": categoryPath + req.file.filename,
            "uploadedDocs_.CV_.LastUploadDate_": date_now,
          },
        }
      );
    } else if (req.params.category === "RL_") {
      await Student.findOneAndUpdate(
        { emailaddress_: emailaddress },
        {
          $set: {
            "uploadedDocs_.RL_.uploadStatus_": "uploaded",
            "uploadedDocs_.RL_.filePath_": categoryPath + req.file.filename,
            "uploadedDocs_.RL_.LastUploadDate_": date_now,
          },
        }
      );
    } else if (req.params.category === "ECTS_conversion_") {
      await Student.findOneAndUpdate(
        { emailaddress_: emailaddress },
        {
          $set: {
            "uploadedDocs_.ECTS_conversion_.uploadStatus_": "uploaded",
            "uploadedDocs_.ECTS_conversion_.filePath_":
              categoryPath + req.file.filename,
            "uploadedDocs_.ECTS_conversion_.LastUploadDate_": date_now,
          },
        }
      );
    } else if (req.params.category === "CourseDescription_") {
      await Student.findOneAndUpdate(
        { emailaddress_: emailaddress },
        {
          $set: {
            "uploadedDocs_.courseDescription_.uploadStatus_": "uploaded",
            "uploadedDocs_.courseDescription_.filePath_":
              categoryPath + req.file.filename,
            "uploadedDocs_.courseDescription_.LastUploadDate_": date_now,
          },
        }
      );
    } else if (req.params.category === "Essay_") {
      await Student.findOneAndUpdate(
        { emailaddress_: emailaddress },
        {
          $set: {
            "uploadedDocs_.Essay_.uploadStatus_": "uploaded",
            "uploadedDocs_.Essay_.filePath_": categoryPath + req.file.filename,
            "uploadedDocs_.Essay_.LastUploadDate_": date_now,
          },
        }
      );
    }
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
    if (category_name === "bachelorCertificate_") {
      downloadPath =
        students_exists.uploadedDocs_.bachelorCertificate_.filePath_;
    } else if (category_name === "bachelorTranscript_") {
      downloadPath =
        students_exists.uploadedDocs_.bachelorTranscript_.filePath_;
    } else if (category_name === "EnglischCertificate_") {
      downloadPath =
        students_exists.uploadedDocs_.EnglischCertificate_.filePath_;
    } else if (category_name === "GermanCertificate_") {
      downloadPath = students_exists.uploadedDocs_.GermanCertificate_.filePath_;
    } else if (category_name === "highSchoolDiploma_") {
      downloadPath = students_exists.uploadedDocs_.highSchoolDiploma_.filePath_;
    } else if (category_name === "highSchoolTranscript_") {
      downloadPath =
        students_exists.uploadedDocs_.highSchoolTranscript_.filePath_;
    } else if (category_name === "universityEntranceExamination_") {
      downloadPath = students_exists.uploadedDocs_.universityEntranceExamination_.filePath_;
    } else if (category_name === "ML_") {
      downloadPath = students_exists.uploadedDocs_.ML_.filePath_;
    } else if (category_name === "CV_") {
      downloadPath = students_exists.uploadedDocs_.CV_.filePath_;
    } else if (category_name === "RL_") {
      downloadPath = students_exists.uploadedDocs_.RL_.filePath_;
    } else if (category_name === "ECTS_conversion_") {
      downloadPath = students_exists.uploadedDocs_.ECTS_conversion_.filePath_;
    } else if (category_name === "CourseDescription_") {
      downloadPath = students_exists.uploadedDocs_.courseDescription_.filePath_;
    } else if (category_name === "Essay_") {
      downloadPath = students_exists.uploadedDocs_.Essay_.filePath_;
    }
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
    if (category_name === "bachelorCertificate_") {
      downloadPath =
        students_exists.uploadedDocs_.bachelorCertificate_.filePath_;
    } else if (category_name === "bachelorTranscript_") {
      downloadPath =
        students_exists.uploadedDocs_.bachelorTranscript_.filePath_;
    } else if (category_name === "EnglischCertificate_") {
      downloadPath =
        students_exists.uploadedDocs_.EnglischCertificate_.filePath_;
    } else if (category_name === "GermanCertificate_") {
      downloadPath = students_exists.uploadedDocs_.GermanCertificate_.filePath_;
    } else if (category_name === "highSchoolDiploma_") {
      downloadPath = students_exists.uploadedDocs_.highSchoolDiploma_.filePath_;
    } else if (category_name === "highSchoolTranscript_") {
      downloadPath =
        students_exists.uploadedDocs_.highSchoolTranscript_.filePath_;
    } else if (category_name === "universityEntranceExamination_") {
      downloadPath = students_exists.uploadedDocs_.universityEntranceExamination_.filePath_;
    } else if (category_name === "ML_") {
      downloadPath = students_exists.uploadedDocs_.ML_.filePath_;
    } else if (category_name === "CV_") {
      downloadPath = students_exists.uploadedDocs_.CV_.filePath_;
    } else if (category_name === "RL_") {
      downloadPath = students_exists.uploadedDocs_.RL_.filePath_;
    } else if (category_name === "ECTS_conversion_") {
      downloadPath = students_exists.uploadedDocs_.ECTS_conversion_.filePath_;
    } else if (category_name === "CourseDescription_") {
      downloadPath = students_exists.uploadedDocs_.courseDescription_.filePath_;
    } else if (category_name === "Essay_") {
      downloadPath = students_exists.uploadedDocs_.Essay_.filePath_;
    }
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

    //TODO: what if students_exists.uploadedDocs_.bachelorCertificate_ undefined?
    if (category_name === "bachelorCertificate_") {
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.bachelorCertificate_.uploadStatus_": "unaccepted",
          "uploadedDocs_.bachelorCertificate_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "bachelorTranscript_") {
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.bachelorTranscript_.uploadStatus_": "unaccepted",
          "uploadedDocs_.bachelorTranscript_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "EnglischCertificate_") {
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.EnglischCertificate_.uploadStatus_": "unaccepted",
          "uploadedDocs_.EnglischCertificate_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "GermanCertificate_") {
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.GermanCertificate_.uploadStatus_": "unaccepted",
          "uploadedDocs_.GermanCertificate_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "highSchoolDiploma_") {
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.highSchoolDiploma_.uploadStatus_": "unaccepted",
          "uploadedDocs_.highSchoolDiploma_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "highSchoolTranscript_") {
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.highSchoolTranscript_.uploadStatus_": "unaccepted",
          "uploadedDocs_.highSchoolTranscript_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "universityEntranceExamination_") {
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.universityEntranceExamination_.uploadStatus_": "unaccepted",
          "uploadedDocs_.universityEntranceExamination_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "ML_") {
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.ML_.uploadStatus_": "unaccepted",
          "uploadedDocs_.ML_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "CV_") {
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.CV_.uploadStatus_": "unaccepted",
          "uploadedDocs_.CV_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "RL_") {
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.RL_.uploadStatus_": "unaccepted",
          "uploadedDocs_.RL_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "ECTS_conversion_") {
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.ECTS_conversion_.uploadStatus_": "unaccepted",
          "uploadedDocs_.ECTS_conversion_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "CourseDescription_") {
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.courseDescription_.uploadStatus_": "unaccepted",
          "uploadedDocs_.courseDescription_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "Essay_") {
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.Essay_.uploadStatus_": "unaccepted",
          "uploadedDocs_.Essay_.LastUploadDate_": date_now,
        },
      });
    }
    // await students_exists.save();
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

    //TODO: what if students_exists.uploadedDocs_.bachelorCertificate_ undefined?
    if (category_name === "bachelorCertificate_") {
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.bachelorCertificate_.uploadStatus_": "checked",
          "uploadedDocs_.bachelorCertificate_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "bachelorTranscript_") {
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.bachelorTranscript_.uploadStatus_": "checked",
          "uploadedDocs_.bachelorTranscript_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "EnglischCertificate_") {
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.EnglischCertificate_.uploadStatus_": "checked",
          "uploadedDocs_.EnglischCertificate_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "GermanCertificate_") {
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.GermanCertificate_.uploadStatus_": "checked",
          "uploadedDocs_.GermanCertificate_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "highSchoolDiploma_") {
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.highSchoolDiploma_.uploadStatus_": "checked",
          "uploadedDocs_.highSchoolDiploma_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "highSchoolTranscript_") {
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.highSchoolTranscript_.uploadStatus_": "checked",
          "uploadedDocs_.highSchoolTranscript_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "universityEntranceExamination_") {
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.universityEntranceExamination_.uploadStatus_": "checked",
          "uploadedDocs_.universityEntranceExamination_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "ML_") {
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.ML_.uploadStatus_": "checked",
          "uploadedDocs_.ML_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "CV_") {
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.CV_.uploadStatus_": "checked",
          "uploadedDocs_.CV_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "RL_") {
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.RL_.uploadStatus_": "checked",
          "uploadedDocs_.RL_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "ECTS_conversion_") {
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.ECTS_conversion_.uploadStatus_": "checked",
          "uploadedDocs_.ECTS_conversion_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "CourseDescription_") {
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.courseDescription_.uploadStatus_": "checked",
          "uploadedDocs_.courseDescription_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "Essay_") {
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.Essay_.uploadStatus_": "checked",
          "uploadedDocs_.Essay_.LastUploadDate_": date_now,
        },
      });
    }
    // await students_exists.save();
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
    if (category_name === "bachelorCertificate_") {
      if (
        fs.existsSync(
          students_exists.uploadedDocs_.bachelorCertificate_.filePath_
        )
      ) {
        // TODO:To delete file here: Path not correct
        fs.unlinkSync(
          students_exists.uploadedDocs_.bachelorCertificate_.filePath_
        ); // delete file on old path, no moving
        console.log("delete bachelorCertificate_ success");
      } else {
        console.log("delete bachelorCertificate_ failed");
      }
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.bachelorCertificate_.uploadStatus_": "",
          "uploadedDocs_.bachelorCertificate_.filePath_": "",
          "uploadedDocs_.bachelorCertificate_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "bachelorTranscript_") {
      if (
        fs.existsSync(
          students_exists.uploadedDocs_.bachelorTranscript_.filePath_
        )
      ) {
        // TODO:To delete file here: Path not correct
        fs.unlinkSync(
          students_exists.uploadedDocs_.bachelorTranscript_.filePath_
        ); // delete file on old path, no moving
        console.log("delete bachelorTranscript_ success");
      } else {
        console.log("delete bachelorTranscript_ failed");
      }
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.bachelorTranscript_.uploadStatus_": "",
          "uploadedDocs_.bachelorTranscript_.filePath_": "",
          "uploadedDocs_.bachelorTranscript_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "EnglischCertificate_") {
      if (
        fs.existsSync(
          students_exists.uploadedDocs_.EnglischCertificate_.filePath_
        )
      ) {
        // TODO:To delete file here: Path not correct
        fs.unlinkSync(
          students_exists.uploadedDocs_.EnglischCertificate_.filePath_
        ); // delete file on old path, no moving
        console.log("delete EnglischCertificate_ success");
      } else {
        console.log("delete EnglischCertificate_ failed");
      }
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.EnglischCertificate_.uploadStatus_": "",
          "uploadedDocs_.EnglischCertificate_.filePath_": "",
          "uploadedDocs_.EnglischCertificate_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "GermanCertificate_") {
      if (
        fs.existsSync(
          students_exists.uploadedDocs_.GermanCertificate_.filePath_
        )
      ) {
        // TODO:To delete file here: Path not correct
        fs.unlinkSync(
          students_exists.uploadedDocs_.GermanCertificate_.filePath_
        ); // delete file on old path, no moving
        console.log("delete GermanCertificate_ success");
      } else {
        console.log("delete GermanCertificate_ failed");
      }
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.GermanCertificate_.uploadStatus_": "",
          "uploadedDocs_.GermanCertificate_.filePath_": "",
          "uploadedDocs_.GermanCertificate_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "highSchoolDiploma_") {
      if (
        fs.existsSync(
          students_exists.uploadedDocs_.highSchoolDiploma_.filePath_
        )
      ) {
        // TODO:To delete file here: Path not correct
        fs.unlinkSync(
          students_exists.uploadedDocs_.highSchoolDiploma_.filePath_
        ); // delete file on old path, no moving
        // await students_exists.save();
        console.log("delete highSchoolDiploma_ success");
      } else {
        console.log("delete highSchoolDiploma_ failed");
      }
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.highSchoolDiploma_.uploadStatus_": "",
          "uploadedDocs_.highSchoolDiploma_.filePath_": "",
          "uploadedDocs_.highSchoolDiploma_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "highSchoolTranscript_") {
      if (
        fs.existsSync(
          students_exists.uploadedDocs_.highSchoolTranscript_.filePath_
        )
      ) {
        // TODO:To delete file here: Path not correct
        fs.unlinkSync(
          students_exists.uploadedDocs_.highSchoolTranscript_.filePath_
        ); // delete file on old path, no moving
        // await students_exists.save();
        console.log("delete highSchoolTranscript_ success");
      } else {
        console.log("delete highSchoolTranscript_ failed");
      }
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.highSchoolTranscript_.uploadStatus_": "",
          "uploadedDocs_.highSchoolTranscript_.filePath_": "",
          "uploadedDocs_.highSchoolTranscript_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "universityEntranceExamination_") {
      if (fs.existsSync(students_exists.uploadedDocs_.universityEntranceExamination_.filePath_)) {
        // TODO:To delete file here: Path not correct
        fs.unlinkSync(students_exists.uploadedDocs_.universityEntranceExamination_.filePath_); // delete file on old path, no moving
        // await students_exists.save();
        console.log("delete universityEntranceExamination_ success");
      } else {
        console.log("delete universityEntranceExamination_ failed");
      }
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.universityEntranceExamination_.uploadStatus_": "",
          "uploadedDocs_.universityEntranceExamination_.filePath_": "",
          "uploadedDocs_.universityEntranceExamination_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "ML_") {
      if (fs.existsSync(students_exists.uploadedDocs_.ML_.filePath_)) {
        // TODO:To delete file here: Path not correct
        fs.unlinkSync(students_exists.uploadedDocs_.ML_.filePath_); // delete file on old path, no moving
        // await students_exists.save();
        console.log("delete ML_ success");
      } else {
        console.log("delete ML_ failed");
      }
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.ML_.uploadStatus_": "",
          "uploadedDocs_.ML_.filePath_": "",
          "uploadedDocs_.ML_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "CV_") {
      if (fs.existsSync(students_exists.uploadedDocs_.CV_.filePath_)) {
        // TODO:To delete file here: Path not correct
        fs.unlinkSync(students_exists.uploadedDocs_.CV_.filePath_); // delete file on old path, no moving
        // await students_exists.save();
        console.log("delete CV_ success");
      } else {
        console.log("delete CV_ failed");
      }
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.CV_.uploadStatus_": "",
          "uploadedDocs_.CV_.filePath_": "",
          "uploadedDocs_.CV_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "RL_") {
      if (fs.existsSync(students_exists.uploadedDocs_.RL_.filePath_)) {
        // TODO:To delete file here: Path not correct
        fs.unlinkSync(students_exists.uploadedDocs_.RL_.filePath_); // delete file on old path, no moving
        // await students_exists.save();
        console.log("delete RL_ success");
      } else {
        console.log("delete RL_ failed");
      }
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.RL_.uploadStatus_": "",
          "uploadedDocs_.RL_.filePath_": "",
          "uploadedDocs_.RL_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "ECTS_conversion_") {
      if (
        fs.existsSync(students_exists.uploadedDocs_.ECTS_conversion_.filePath_)
      ) {
        // TODO:To delete file here: Path not correct
        fs.unlinkSync(students_exists.uploadedDocs_.ECTS_conversion_.filePath_); // delete file on old path, no moving
        // await students_exists.save();
        console.log("delete ECTS_conversion_ success");
      } else {
        console.log("delete ECTS_conversion_ failed");
      }
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.ECTS_conversion_.uploadStatus_": "",
          "uploadedDocs_.ECTS_conversion_.filePath_": "",
          "uploadedDocs_.ECTS_conversion_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "CourseDescription_") {
      if (
        fs.existsSync(
          students_exists.uploadedDocs_.CourseDescription_.filePath_
        )
      ) {
        // TODO:To delete file here: Path not correct
        fs.unlinkSync(
          students_exists.uploadedDocs_.CourseDescription_.filePath_
        ); // delete file on old path, no moving
        // await students_exists.save();
        console.log("delete CourseDescription_ success");
      } else {
        console.log("delete CourseDescription_ failed");
      }
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.CourseDescription_.uploadStatus_": "",
          "uploadedDocs_.CourseDescription_.filePath_": "",
          "uploadedDocs_.CourseDescription_.LastUploadDate_": date_now,
        },
      });
    } else if (category_name === "Essay_") {
      if (fs.existsSync(students_exists.uploadedDocs_.Essay_.filePath_)) {
        // TODO:To delete file here: Path not correct
        fs.unlinkSync(students_exists.uploadedDocs_.Essay_.filePath_); // delete file on old path, no moving
        // await students_exists.save();
        console.log("delete Essay_ success");
      } else {
        console.log("delete Essay_ failed");
      }
      await Student.findByIdAndUpdate(student_id, {
        $set: {
          "uploadedDocs_.Essay_.uploadStatus_": "",
          "uploadedDocs_.Essay_.filePath_": "",
          "uploadedDocs_.Essay_.LastUploadDate_": date_now,
        },
      });
    }
    return res.status(200).end(); // 200 success
  } catch (err) {
    console.log("error delete file: " + err);
    return res.status(500).end(); // 500 Internal Server Error
  }
};

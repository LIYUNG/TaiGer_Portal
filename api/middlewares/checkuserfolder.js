const Student = require("../models/Students");
const jwt_decode = require("jwt-decode");
const fs = require("fs");

async function checkuserfolder(req, res, next) {
  try {
    const bearer = req.headers.authorization.split(" ");
    const token = bearer[1];
    // Extract user email info by token
    var emailaddress = jwt_decode(token);
    // console.log("emailaddress: " + emailaddress)
    emailaddress = emailaddress["emailaddress"];
    //get email by token
    const students_exists = await Student.findOne({
      emailaddress_: emailaddress,
    });
    const FolderName =
      students_exists.firstname_ +
      "_" +
      students_exists.lastname_ +
      "_" +
      students_exists._id;
    if (!fs.existsSync(process.env.BASE_PATH + process.env.PATH_DELIMITER)) {
      fs.mkdirSync(process.env.BASE_PATH + process.env.PATH_DELIMITER, {
        recursive: true,
      });
      console.log("create public folder");
      next();
    }
    const directoryPath =
      process.env.BASE_PATH + process.env.PATH_DELIMITER + FolderName;

    console.log("directoryPath: " + directoryPath);
    if (fs.existsSync(directoryPath)) {
      // The check succeeded
      console.log("checkuserfolder success");
      next();
    } else {
      console.log("checkuserfolder : create folder");
      fs.mkdirSync(directoryPath, {
        recursive: true,
      });
      next();
      // The check failed
    }
  } catch (e) {
    console.log("checkuserfolder error: " + e);
    return res.status(500).end(); // 500 Internal Server Error
  }
}

module.exports = { checkuserfolder };

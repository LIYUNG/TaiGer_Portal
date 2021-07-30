const Student = require("../models/Students");
const jwt_decode = require("jwt-decode");
const fs = require("fs");

const { BASE_PATH, PATH_DELIMITER } = require("../config");

// try {
//     await fs.access(path)
//     return true
//   } catch {
//     return false
//   }
async function movefile(req, res, next) {
  try {
    console.log("req.file.filename: " + req.file.filename);
    const bearer = req.headers.authorization.split(" ");
    const token = bearer[1];
    // Extract user email info by token
    var emailaddress = jwt_decode(token);
    emailaddress = emailaddress["emailaddress"];
    const students_exists = await Student.findOne({
      emailaddress_: emailaddress,
    });
    const { firstname_, lastname_, _id } = students_exists
    const FolderName = `${firstname_}-${lastname_}-${_id}`;
    const directoryPath =
      BASE_PATH + PATH_DELIMITER + FolderName + PATH_DELIMITER;
    console.log("directoryPath : " + directoryPath);
    const filePath = BASE_PATH + PATH_DELIMITER + req.file.filename;

    console.log("\n> Checking if the old path file exists");
    if (fs.existsSync(filePath)) {
      // The check succeeded
      const categoryPath = directoryPath + req.params.category;
      if (!fs.existsSync(categoryPath)) {
        fs.mkdirSync(categoryPath, { recursive: true });
      }
      const newfilePath = categoryPath + PATH_DELIMITER + req.file.filename;
      if (fs.existsSync(newfilePath)) {
        //TODO: store multiple file?
        fs.unlinkSync(filePath); // delete file on old path, no moving
        console.log("The file already uploaded! Delete the uploaded file.");
        next();
      } else {
        fs.renameSync(filePath, newfilePath);
        console.log("Successfully moved the file!");
        next();
        // The check failed
      }
    } else {
      console.error("file does not exist");
      next();
    }

    // fs.access(filePath, fs.constants.F_OK, (err) => {
    //     console.log('\n> Checking if the old path file exists');
    //     const newfilePath = directoryPath + req.file.filename
    //     if (err) {
    //         console.error('file does not exist');
    //         next()
    //     }
    //     else {
    //         fs.access(newfilePath, fs.constants.F_OK, (err) => {
    //             if (err) {
    //                 fs.renameSync(filePath, newfilePath)
    //                 console.log("Successfully moved the file!")
    //                 next()
    //             }
    //             else {
    //                 //TODO: store multiple file?
    //                 fs.unlinkSync(filePath) // delete file on old path, no moving
    //                 console.log("The file already uploaded! Delete the uploaded file.")
    //                 next()
    //             }
    //         });
    //     }
    // });
  } catch (err) {
    console.log("moving file error: " + err);
    return res.status(500).end(); // 500 Internal Server Error
  }
}

module.exports = { movefile };

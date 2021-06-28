const Student = require("../models/Students");
const jwt_decode = require("jwt-decode");
const fs = require('fs');

async function deletefile(req, res, next) {
    try {
        const bearer = req.headers.authorization.split(' ');
        const token = bearer[1]
        // Extract user email info by token
        var emailaddress = jwt_decode(token);
        // console.log("emailaddress: " + emailaddress)
        emailaddress = emailaddress['emailaddress'];
        //get email by token
        const students_exists = await Student.findOne({ emailaddress_: emailaddress });
        const FolderName = students_exists.firstname_ + '_' + students_exists.lastname_ + '_' + students_exists._id;
        const directoryPath = __basedir + "\\public\\" + FolderName;

        console.log("directoryPath: " + directoryPath)
        if (fs.existsSync(directoryPath)) {
            // TODO:To delete file here: Path not correct
            fs.unlinkSync(directoryPath) // delete file on old path, no moving
            console.log("delete file success")
            next()
        } else {
            console.log("deletefile failed")
            next()
            // The check failed
        }

    } catch (e) {
        console.log('deletefile error: ' + e)
        return res.status(500).end(); // 500 Internal Server Error
    }
}


module.exports = { deletefile };
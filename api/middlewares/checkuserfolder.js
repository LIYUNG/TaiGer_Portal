const Student = require("../models/Students");
const jwt_decode = require("jwt-decode");
const fs = require('fs');

async function checkuserfolder(req, res, next) {
    try {
        const bearer = req.headers.authorization.split(' ');
        const token = bearer[1]
        // Extract user email info by token
        var emailaddress = jwt_decode(token);
        console.log("emailaddress: " + emailaddress)
        emailaddress = emailaddress['emailaddress'];

        //get email by token
        const students_exists = await Student.findOne({ emailaddress_: emailaddress });
        const FolderName = students_exists.firstname_ + '_' + students_exists.lastname_ + '_' + students_exists._id;
        const directoryPath = __basedir + "/public/" + FolderName;

        console.log("directoryPath: " + directoryPath)
        if (fs.existsSync(directoryPath)) {
            // The check succeeded
            console.log("checkuserfolder success")
            next()
        } else {
            console.log("checkuserfolder : create folder")
            fs.mkdirSync(directoryPath);
            next()
            // The check failed
        }
    } catch (e) {
        console.log('checkuserfolder error: ' + e)
        return res.status(401).end();
    }
}


module.exports = { checkuserfolder };
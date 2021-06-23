const Student = require("../models/Students");
const jwt_decode = require("jwt-decode");
const fs = require('fs');
async function movefile(req, res, next) {
    try {
        console.log("req.file.filename: " + req.file.filename)
        const bearer = req.headers.authorization.split(' ');
        const token = bearer[1]
        // Extract user email info by token
        var emailaddress = jwt_decode(token);
        emailaddress = emailaddress['emailaddress'];

        const students_exists = await Student.findOne({ emailaddress_: emailaddress });
        const FolderName = students_exists.firstname_ + '_' + students_exists.lastname_ + '_' + students_exists._id;
        const directoryPath = __basedir + "/public/" + FolderName + '/';
        console.log('directoryPath : ' + directoryPath)
        const filePath = __basedir + "/public/" + req.file.filename;
        if (fs.existsSync(filePath)) {
            //TODO: Moving the file just uploaded in /public to user own folder
            fs.renameSync(filePath, directoryPath + req.file.filename)

            console.log("Successfully moved the file!")
            next()
        }
        
    } catch (err) {
        console.log('moving file error: ' + err)
        return res.status(401).end();
    }
}


module.exports = { movefile };
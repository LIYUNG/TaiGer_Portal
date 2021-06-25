const Student = require("../models/Students");
const jwt_decode = require("jwt-decode");
const fs = require('fs');

// try {
//     await fs.access(path)
//     return true
//   } catch {
//     return false
//   }
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

        fs.access(filePath, fs.constants.F_OK, (err) => {
            console.log('\n> Checking if the old path file exists');
            const newfilePath = directoryPath + req.file.filename
            if (err) {
                console.error('file does not exist');
                next()
            }
            else {
                fs.access(newfilePath, fs.constants.F_OK, (err) => {
                    if (err) {
                        fs.renameSync(filePath, newfilePath)
                        console.log("Successfully moved the file!")
                        next()
                    }
                    else {
                        console.log("The file already uploaded!")
                        next()
                    }
                });
            }
        });


        // if (fs.existsSync(filePath)) {
        //     //TODO: Moving the file just uploaded in /public to user own folder
        //     const newfilePath = directoryPath + req.file.filename
        //     if (fs.existsSync(newfilePath)) {
        //         console.log("The file already uploaded!")
        //         return res.status(401).end();
        //     }
        //     else {
        //         fs.renameSync(filePath, newfilePath)
        //         console.log("Successfully moved the file!")
        //         next()
        //     }
        // }
        // else {
        //     console.log("Faild moved the file!")
        //     return res.status(401).end();
        // }
    } catch (err) {
        console.log('moving file error: ' + err)
        return res.status(401).end();
    }



}


module.exports = { movefile };
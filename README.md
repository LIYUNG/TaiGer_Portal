# Backend Setup
- copy `.env.sample` to `.env.production`, `.env.development`, `.env.test` and fill in the values

# Notes
- the `UPLOAD_PATH` in `.env.test` will be deleted whenever the test is run, be careful not to share the value with other `.env` files

# Todos
- [x] fill missing fields in `api/.env.sample`
- [ ] Verify routes still working
  - [x] POST   /login
  - [x] POST   /register
  - [x] GET    /users                                      (userslist)
  - [x] DELETE /users/:id                                  (deleteuser)
  - [xx] POST   /users/:id                                  (edituser, changeuserrole)
  - [x] GET    /agents                                     (editagent)
  - [x] GET    /editors                                    (editeditor)
  - [x] GET    /students                                   (studentlist)
  - [x] POST   /students/:id/agents                        (updateagent) 
  - [x] POST   /students/:id/editors                       (updateeditor)
  - [x] POST   /students/:id/programs                      (assignprogramtostudent) 
  - [x] DELETE /students/:studentId/programs/:programId    (deleteprogramfromstudent)
  - [x] GET    /students/:studentId/files/:category        (filedownloadfromstudent) 
  - [x] POST   /students/:studentId/files/:category        (UploadForStudentPost)  
  - [x] DELETE /students/:studentId/files/:category        (deletefile)
  - [x] POST   /students/:studentId/files/:category/status (rejectdoc, acceptdoc)
  - [xx] GET    /account/files 
  - [xx] GET    /account/files/:category                    (templatefiledownload) check later
  - [x] POST   /account/files/:category                    (UploadPost) 
  - [x] POST   /account/transcript/:category/:group        (Upload_Transcript_XLSX) 
  - [x] GET    /account/download/:category/:filename       (generated_XLSX_download) after fixing upload, check later
  - [x] GET    /programs                                   (programlist)
  - [x] POST   /programs                                   (addprogram)
  - [x] POST   /programs/:id                               (editprogram)
  - [x] DELETE /programs/:id                               (deleteprogram)
  - [ ] DELETE /docs/:id    check later (currently integrating rich text editor)
  - [ ] POST   /docs/:id    check later (currently integrating rich text editor)
  - [ ] POST   /docs        check later (currently integrating rich text editor)
  - [ ] GET    /docs/:type  check later (currently integrating rich text editor)

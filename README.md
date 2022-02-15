# TaiGer Portal
The project of TaiGer portal will increase the efficieny of files exchange and communication between editor, agent and students. With a great overview, agent and editor can follow up the application process of each student. Furthermore, it open a bunch of opportunities to extend the service to students like transcript-analysis. 

## Technology
TaiGer portal is implemented by JavaScript framework ExpressJS as backend to serve API requsts and ReactJS as frontend. MongoDB stores all user data. Special service like Transcript-Analysis is implemented in Python. 

## Design Demo Screenshots
## Individual Student Data View
- Download/Delete/Giving Feedback of Student's uploaded files
- For students, they can upload their pdf in this page.

![](/screenshot/demo1.png)
## Agent's Overview of Students' Uploaded Documents And Their Status
- Filtering the files and present them by their status
- Agent only need to review the latest uploaded file and gives it feedback.

![](/screenshot/missingfile.png)
## Editor's Documents Overview
- Overview of Editor's files status. (delivered, under student's review, no input and processing)
- Input missing, under editor's review, under student's review, finished.

![](/screenshot/editorprogress.png)
## FIles and Information Exchange
- Editor's files/information exchange
- Files naming convention is implemented, i.e. < user_name >_< file_name >_< version >.pdf

![](/screenshot/editor.png)

## Student's Survey
- Student's background survey and German GPA conversion is implemented here. Stduents do not need to calculate themselves as they can just enter their highest possible grade, passing grade and achieved grade.
- Collecting Student Survey for further data visualization.

![](/screenshot/Survey.png)

## Student's Background and Program Conflict Overview
- The same programs that different students want to apply are listed.
- Students' background as well as their English/German Certificate is presented. Each student should maintain their current status. 

![](/screenshot/background_conflict.png)

# How to use?
TaiGer Portal is running on Node.js. Make sure you already have Node environment and do not forget the package manager npm.\
In order to run TaiGer Portal on the localhost, one terminal should run backend server (make sure MongoDB is available as it will connect MongoDB and open the port) while another run frontend server.
## Run Frontend
### Installation
```
cd client
npm install
```
### Run the following commands to run
```
cd client
npm start
```
## Run Backend Server
### Installation all packages needed for backend server:
```
cd api
npm install
```
### Backend setup 
- copy `.env.sample` to `.env.production`, `.env.development`, `.env.test` and fill in the values

Before running backend server, make sure you have install MongoDB as database in your machine. 

### Run the following commands to run Development code:
```
cd api
npm run-script dev
```
or the following for Production code:
```
cd api
npm run-script start
```
# API Documentation
Run the following commands to get the all response type documentation of each API:
```
cd api/doc
npm start
```

# Notes
- the `UPLOAD_PATH` in `.env.test` will be deleted whenever the test is run, be careful not to share the value with other `.env` files

# Note:
- [x] fill missing fields in `api/.env.sample`

# TaiGer Portal
The project of TaiGer portal will increase the efficieny of files exchange and communication between editor, agent and students. With a great overview, agent and editor can follow up the application process of each student. Furthermore, it open a bunch of opportunities to extend the service to students like transcript-analysis. 

## Technology Overview
TaiGer portal is implemented by JavaScript framework ExpressJS as backend to serve API requsts and ReactJS as frontend. MongoDB stores all user data. Special service like Transcript-Analysis is implemented in Python. 

### Backend
- Rate Limiter
- JWT cookie authentication
- AWS S3 Bucket for file, image, docs, pdf, xlsx storage
- MongoDB as database for program list, user information, transcript table data.
- Keywords-based transcript analyser implemented in Python

### Frontend
- React JS
- Mostly React Bootstrap Components and fews MUI Components

## Design Demo Screenshots
## Individual Student Data View
- Download/Delete/Giving Feedback of Student's uploaded files
- Uni Assist document tracking.
- For students, they can upload their pdf in this page.
- Course analyse implemented

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
- Each document modification discussion thread status overview
- Files naming convention is implemented, i.e. < user_name >_< file_name >_< version >.pdf

![](/screenshot/editor.png)

## Student's Survey
- Student's background survey and German GPA conversion is implemented here. Stduents do not need to calculate themselves as they can just enter their highest possible grade, passing grade and achieved grade.
- Collecting Student Survey for further data visualization.

![](/screenshot/Survey.png)

## Student's Progress, Background and Program Conflict Overview Dashboard
- The same programs that different students want to apply are listed.
- Students' background as well as their English/German Certificate is presented. Each student should maintain their current status. 
- Overview of each task for each student.
  
![](/screenshot/admin_agent_dashboard.png)


# How to use?
TaiGer Portal is running on Node.js. Make sure you already have Node environment and do not forget the package manager npm.\
In order to run TaiGer Portal on the localhost, one terminal should run backend server (make sure MongoDB is available as it will connect MongoDB and open the port) while another run frontend server.

## Important Librariby version
* Nodejs v18
* MongoDB v5.9

## Run Frontend
### Installation (One-time setup)

Check your node -v 
```
node -v #make sure the output is 18.18.0
```
If your node -v is not v.18.18.0, do the following (The reason is in package.json, the node-sass v4.12.0 only compatible with node version v18.18.0, for compatibility check this [table](https://www.npmjs.com/package/node-sass))
```
sudo npm install -g n
n 18.18.0
```

```
cd client
npm install
```
This will install all the dependencies inside the package.json file. [Youtube - Everything you need to know about the package.json](https://www.youtube.com/watch?v=-SaZiADGLHs)
* package.json is the source of truth of all **information** and **dependencies** of a project
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

**Enviornment setup**
- copy `.env.sample` to `.env.production`, `.env.development`, `.env.test` and fill in the values

**Install Mongo DB**
Before running backend server, make sure you have install MongoDB as database in your machine. 

MacOS: [Youtube-Install a local MongoDB Database on macOS](https://www.youtube.com/watch?v=BwVOIRX3VXk)
```
brew tap mongodb/brew
brew install mongodb-community@4.4 # version 4.4
```
```
brew service start monodb-community@4.4 # start the mongodb as a service
```
**Create Key and Pem file**

MacOs: [Youtube - Create Your Own SSL Certificate](https://www.youtube.com/watch?v=sR4_YISXNZE)

The following code will generate the key and 
```
cd api/cert
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout cert.key -out cert.pem -config req.cnf -sha256
```
After this step, you should have 
* cert.key
* cert.pem 

within the cert folder. Do not worry, in the .gitignore it will not commit your certifications into github :)

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


# Debug
## MacOS
* Change your client/package.json

Instead of set, change to **export**  [How to specify a port to run a react-app](https://stackoverflow.com/questions/40714583/how-to-specify-a-port-to-run-a-create-react-app-based-project)
```
 "scripts": {
    "start": "export PORT=3006 && react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
```
## Backend 
If you open backend first time at Chrome, you need to go to https://localhost:3000/ and set it as safe manually.
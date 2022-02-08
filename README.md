# Design Demo
## Individual Student Data View
- Download/Delete/Giving Feedback of Student's uploaded files

![](/screenshot/demo1.png)
## Agent's Overview of Students' Uploaded Documents And Their Status
- Filtering the files and present them by their status

![](/screenshot/missingfile.png)
## Editor's Documents Overview
- Overview of Editor's files status. (delivered, under student's review, no input and processing)

![](/screenshot/editorprogress.png)
## FIles and Information Exchange
- Editor's files/information exchange

![](/screenshot/editor.png)

## Student's Survey
- Collecting Student Survey for further data visualization.

![](/screenshot/Survey.png)

# How to use?
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
## Run Backend
### Installation
```
cd api
npm install
```
### Backend setup
- copy `.env.sample` to `.env.production`, `.env.development`, `.env.test` and fill in the values
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

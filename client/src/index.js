import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "./App/index";
import * as serviceWorker from "./serviceWorker";
import reducer from "./store/reducer";
import config from "./config";
import "./style.css"

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

window.documentlist = [
  {
    name: "CV",
    prop: "CV_",
  },
  {
    name: "ML",
    prop: "ML_",
  },
  {
    name: "RL",
    prop: "RL_",
  },
  {
    name: "Bachelor Certificate",
    prop: "bachelorCertificate_",
  },
  {
    name: "Bachelor Transcript",
    prop: "bachelorTranscript_",
  },
  {
    name: "High School Diploma",
    prop: "highSchoolDiploma_",
  },
  {
    name: "High School Transcript",
    prop: "highSchoolTranscript_",
  },
  {
    name: "University Entrance Exam",
    prop: "universityEntranceExamination_",
  },
  {
    name: "English Certificate",
    prop: "EnglischCertificate_",
  },
  {
    name: "German Certififcate",
    prop: "GermanCertificate_",
  },
  {
    name: "Essay",
    prop: "Essay_",
  },
  {
    name: "ECTS Conversion",
    prop: "ECTS_conversion_",
  },
  {
    name: "Course Description",
    prop: "CourseDescription_",
  },
  {
    name: "Passport",
    prop: "Passport_",
  },
];

window.ProgramlistHeader = [
  {
    name: "University",
    prop: "University_",
  },
  {
    name: "Program",
    prop: "Program_",
  },
  {
    name: "TOEFL",
    prop: "TOEFL_",
  },
  {
    name: "IELTS",
    prop: "IELTS_",
  },
  {
    name: "Degree",
    prop: "Degree_",
  },
  {
    name: "GRE/GMAT",
    prop: "GREGMAT_",
  },
  {
    name: "Application Deadline",
    prop: "Application_end_date_",
  },
  {
    name: "Last Update",
    prop: "LastUpdate_",
  },
];

window.NewProgramHeader = [
  {
    name: "University",
    prop: "University_",
  },
  {
    name: "Program",
    prop: "Program_",
  },
  {
    name: "TOEFL",
    prop: "TOEFL_",
  },
  {
    name: "IELTS",
    prop: "IELTS_",
  },
  {
    name: "Degree",
    prop: "Degree_",
  },
  {
    name: "GRE/GMAT",
    prop: "GREGMAT_",
  },
  {
    name: "Application Deadline",
    prop: "Application_end_date_",
  },
  {
    name: "CV Deadline",
    prop: "CV_",
  },
  {
    name: "ML",
    prop: "ML_",
  },
  {
    name: "RL",
    prop: "RL_",
  },
  {
    name: "Bachelor Certificate",
    prop: "bachelorCertificate_",
  },
  {
    name: "Bachelor Transcript",
    prop: "bachelorTranscript_",
  },
  {
    name: "High School Diploma",
    prop: "highSchoolDiploma_",
  },
  {
    name: "High School Transcript",
    prop: "highSchoolTranscript_",
  },
  {
    name: "GSAT(基測)",
    prop: "universityEntranceExamination_",
  },
  {
    name: "English Certificate",
    prop: "EnglischCertificate_",
  },
  {
    name: "German Certificate",
    prop: "GermanCertificate_",
  },
  {
    name: "Essay",
    prop: "Essay_",
  },
  {
    name: "ECTS Conversion",
    prop: "ECTS_coversion_",
  },
  {
    name: "Course Description",
    prop: "CourseDescription_",
  },
  {
    name: "Passport",
    prop: "Passport_",
  },
];

window.UserlistHeader = [
  {
    name: "First Name",
    prop: "firstname_",
  },
  {
    name: "Last Name",
    prop: "lastname_",
  },
  {
    name: "Email Address",
    prop: "emailaddress_",
  },
  {
    name: "User Type",
    prop: "role_",
  },
];

const app = (
  <Provider store={store}>
    <BrowserRouter basename={config.basename}>
      {/* basename="/datta-able" */}
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

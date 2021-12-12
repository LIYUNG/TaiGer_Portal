import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "./App/index";
import * as serviceWorker from "./serviceWorker";
import reducer from "./store/reducer";
import config from "./config";
import "./style.css";

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

window.agenttodolist = [
  {
    name: "Course Analysis",
    prop: "courseanalysis",
  },
  {
    name: "Send Portal Instruction",
    prop: "sendportalinstruction",
  },
  {
    name: "Provide ML template",
    prop: "providemltemp",
  },
  {
    name: "Provide RL template",
    prop: "providerltemp",
  },
  {
    name: "Assign Editor",
    prop: "assigneditor",
  },
];

window.documentsprogresslist = [
  {
    name: "Received Template",
    prop: "receive_template",
  },
  {
    name: "Preparing",
    prop: "preparing",
  },
  {
    name: "Editing",
    prop: "editing",
  },
  {
    name: "Closed",
    prop: "closed",
  },
];

window.programstatuslist = [
  {
    name: "Decided",
    prop: "decided",
  },
  {
    name: "Preparing",
    prop: "preparing",
  },
  {
    name: "Submitted",
    prop: "Submitted",
  },
  {
    name: "Offer",
    prop: "offer",
  },
];
window.documentlist2 = {
  bachelorCertificate_: "B.Sc Cert",
  bachelorTranscript_: "B.Sc. Trans",
  highSchoolDiploma_: "H. Sch. Dipl.",
  highSchoolTranscript_: "H. Sch. Trans",
  universityEntranceExamination_: "GSAT/SAT",
  EnglischCertificate_: "TOEFL/IELTS",
  GermanCertificate_: "TestDaF/B2/C1",
  ECTS_conversion_: "ECTS Conv.",
  CourseDescription_: "Course Descr.",
  Passport_: "Passport",
};

window.documentlist = [
  // {
  //   name: "CV",
  //   prop: "CV_",
  // },
  // {
  //   name: "ML",
  //   prop: "ML_",
  // },
  // {
  //   name: "RL",
  //   prop: "RL_",
  // },
  {
    name: "B.Sc Cert",
    prop: "bachelorCertificate_",
  },
  {
    name: "B.Sc. Trans",
    prop: "bachelorTranscript_",
  },
  {
    name: "H. Sch. Dipl.",
    prop: "highSchoolDiploma_",
  },
  {
    name: "H. Sch. Trans",
    prop: "highSchoolTranscript_",
  },
  {
    name: "GSAT/SAT",
    prop: "universityEntranceExamination_",
  },
  {
    name: "TOEFL/IELTS",
    prop: "EnglischCertificate_",
  },
  {
    name: "TestDaF/B2/C1",
    prop: "GermanCertificate_",
  },
  // {
  //   name: "Essay",
  //   prop: "Essay_",
  // },
  {
    name: "ECTS Conv.",
    prop: "ECTS_conversion_",
  },
  {
    name: "Course Descr/",
    prop: "CourseDescription_",
  },
  {
    name: "Passport",
    prop: "Passport_",
  },
];

window.documenheader = {
  CV_: "CV",
  ML_: "ML",
  RL_: "RL",
  bachelorCertificate_: "B.Sc Cert",
  bachelorTranscript_: "B.Sc. Trans",
  highSchoolDiploma_: "H. Sch. Dipl.",
  highSchoolTranscript_: "H. Sch. Trans",
  universityEntranceExamination_: "GSAT/SAT",
  EnglischCertificate_: "TOEFL/IELTS",
  GermanCertificate_: "TestDaF/B2/C1",
  Essay_: "Essay",
  ECTS_conversion_: "ECTS Conv.",
  CourseDescription_: "Course Descr.",
  Passport_: "Passport",
};

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
    prop: "email",
  },
  {
    name: "User Type",
    prop: "role",
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

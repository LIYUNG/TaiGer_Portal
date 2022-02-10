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
import "./index.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

window.editortodolist = [
  {
    name: "Waiting ML_Template",
    prop: "waitingrltemplate",
  },
  {
    name: "Waiting ML Response",
    prop: "waitingmltemplate",
  },
  {
    name: "Provide ML Status",
    prop: "providemltemp",
  },
];

window.agenttodolist = [
  {
    name: "Course Analysis",
    prop: "courseanalysis",
  },
  {
    name: "Instruction working with Editor",
    prop: "instructionworkingwitheditor",
  },
  {
    name: "Uni-Assist Instruction",
    prop: "uniassistinstruction",
  },
  {
    name: "Visa Instruction",
    prop: "visainstruction",
  },
  {
    name: "Assign Editor",
    prop: "assigneditor",
  },
];

window.documentsprogresslist = [
  {
    name: "Template filled?",
    prop: "receive_template",
  },
  {
    name: "Preparing",
    prop: "preparing",
  },
  {
    name: "Last Update",
    prop: "lastupdate",
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
  Bachelor_Certificate: "B.Sc Cert",
  Bachelor_Transcript: "B.Sc. Trans",
  High_School_Diploma: "H. Sch. Dipl.",
  High_School_Transcript: "H. Sch. Trans",
  University_Entrance_Examination_GSAT: "GSAT/SAT",
  Englisch_Certificate: "TOEFL/IELTS",
  German_Certificate: "TestDaF/B2/C1",
  ECTS_Conversion: "ECTS Conv.",
  Course_Description: "Course Descr.",
  Passport: "Passport",
};

window.templatelist = [
  {
    name: "CV",
    prop: "00_Example_CV_english.pdf",
  },
  {
    name: "ML",
    prop: "ML_survey_lock_1.xlsx",
  },
  {
    name: "RL",
    prop: "RL_academic_survey_lock.xlsx",
  },
  {
    name: "Internship Certificate",
    prop: "internship_Example.png",
  },
  {
    name: "Employment Certificate",
    prop: "employment_template.png",
  },
  {
    name: "Module Description",
    prop: "Module Catalog.docx",
  },
  {
    name: "ECTS Conv.",
    prop: "NTU_ECTS_Conv_example.pdf",
  },
  // {
  //   name: "Essay",
  //   prop: "Essay_",
  // },
];

window.documentlist = [
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

window.ProgramlistHeader = [
  {
    name: "University",
    prop: "school",
  },
  {
    name: "Program",
    prop: "program",
  },
  {
    name: "TOEFL",
    prop: "toefl",
  },
  {
    name: "IELTS",
    prop: "ielts",
  },
  {
    name: "Degree",
    prop: "degree",
  },
  {
    name: "GRE/GMAT",
    prop: "gre",
  },
  {
    name: "Application Deadline",
    prop: "application_deadline",
  },
  {
    name: "Last Update",
    prop: "updatedAt",
  },
];

window.NewProgramHeader = [
  {
    name: "University",
    prop: "school",
  },
  {
    name: "Program",
    prop: "program",
  },
  {
    name: "Degree",
    prop: "degree",
  },
  {
    name: "Semester",
    prop: "semester",
  },
  {
    name: "Language",
    prop: "language",
  },
  {
    name: "Application Start",
    prop: "application_start",
  },
  {
    name: "Application Deadline",
    prop: "application_deadline",
  },
  {
    name: "Uni Assist",
    prop: "uni_assist",
  },
  {
    name: "TOEFL",
    prop: "toefl",
  },
  {
    name: "IELTS",
    prop: "ielts",
  },
  {
    name: "TestDaF",
    prop: "testdaf",
  },
  {
    name: "GRE",
    prop: "gre",
  },
  {
    name: "GMAT",
    prop: "gmat",
  },
  {
    name: "ML Needed?",
    prop: "ml_required",
  },
  {
    name: "ML Requirements",
    prop: "ml_requirements",
  },
  {
    name: "RL Needed?",
    prop: "rl_required",
  },
  {
    name: "RL Requirements",
    prop: "rl_requirements",
  },
  {
    name: "Essay Required",
    prop: "essay_required",
  },
  {
    name: "Essay Requirements",
    prop: "essay_requirements",
  },
  {
    name: "Special Notes",
    prop: "special_notes",
  },
  {
    name: "Comments",
    prop: "comments",
  },
  {
    name: "Application Portal A",
    prop: "application_portal_a",
  },
  {
    name: "Application Portal B",
    prop: "application_portal_b",
  },
  {
    name: "Website",
    prop: "website",
  },
  {
    name: "FPSO",
    prop: "fpso",
  },
  {
    name: "Last Update",
    prop: "updatedAt",
  },
  {
    name: "Modified by",
    prop: "whoupdated",
  },
  {
    name: "Group",
    prop: "study_group_flag",
  },
];

window.UserlistHeader = [
  {
    name: "First Name",
    prop: "firstname",
  },
  {
    name: "Last Name",
    prop: "lastname",
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

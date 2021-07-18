import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "./App/index";
import * as serviceWorker from "./serviceWorker";
import reducer from "./store/reducer";
import config from "./config";

const store = createStore(reducer);
const is_Dev = true;
if (is_Dev) {
  window.Student_API = "http://localhost:3000/studentlist";
  window.del_prog_std_API = "http://localhost:3000/deleteprogramfromstudent";
  window.edit_agent_API = "http://localhost:3000/editagent";
  window.update_agent_API = "http://localhost:3000/updateagent";
  window.edit_editor_API = "http://localhost:3000/editeditor";
  window.update_editor_API = "http://localhost:3000/updateeditor";
  window.accept_document_API = "http://localhost:3000/acceptdoc";
  window.reject_document_API = "http://localhost:3000/rejectdoc";
  window.login = "http://localhost:3000/login";
  window.register = "http://localhost:3000/register";
  window.program_list_API = "http://localhost:3000/programlist";
  window.delete_program_API = "http://localhost:3000/deleteprogram";
  window.add_program_API = "http://localhost:3000/addprogram";
  window.edit_program_API = "http://localhost:3000/editprogram";
  window.assign_program_API = "http://localhost:3000/assignprogramtostudent";
  window.upload = "http://localhost:3000/upload";
  window.delete = "http://localhost:3000/deletefile";
  window.download = "http://localhost:3000/download";
} else {
  window.Student_API = "http://54.214.118.145:3000/studentlist";
  window.del_prog_std_API = "http://54.214.118.145:3000/deleteprogramfromstudent";
  window.edit_agent_API = "http://54.214.118.145:3000/editagent";
  window.update_agent_API = "http://54.214.118.145:3000/updateagent";
  window.edit_editor_API = "http://54.214.118.145:3000/editeditor";
  window.update_editor_API = "http://54.214.118.145:3000/updateeditor";
  window.accept_document_API = "http://54.214.118.145:3000/acceptdoc";
  window.reject_document_API = "http://54.214.118.145:3000/rejectdoc";
  window.login = "http://54.214.118.145:3000/login";
  window.register = "http://54.214.118.145:3000/register";
  window.program_list_API = "http://54.214.118.145:3000/programlist";
  window.delete_program_API = "http://54.214.118.145:3000/deleteprogram";
  window.add_program_API = "http://54.214.118.145:3000/addprogram";
  window.edit_program_API = "http://54.214.118.145:3000/editprogram";
  window.assign_program_API = "http://54.214.118.145:3000/assignprogramtostudent";
  window.upload = "http://54.214.118.145:3000/upload";
  window.delete = "http://54.214.118.145:3000/deletefile";
  window.download = "http://54.214.118.145:3000/download";
}

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

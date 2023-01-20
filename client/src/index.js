import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './App/index';
import * as serviceWorker from './serviceWorker';
import reducer from './store/reducer';
import config from './config';
// import "./style.css";
import './index.css';
// import "mdb-react-ui-kit/dist/css/mdb.min.css";

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

window.documentlist = {
  'base-documents': 'Base Documents',
  'cv-ml-rl': 'CV/ML/RL',
  application: 'Application Instruction',
  'portal-instruction': 'Portal Instruction',
  certification: 'Certification Instruction',
  uniassist: 'Uni-Assist Instruction',
  visa: 'Visa Instruction'
};

window.internaldocumentlist = {
  agents: 'Agents',
  editors: 'Editors',
  admin: 'Admin',
  'base-documents-internal': 'Base Documents Internal',
  'uniassist-internal': 'Uni-Assist Internal'
};

window.agenttodolist = [
  {
    name: 'Course Analysis',
    prop: 'courseanalysis'
  },
  {
    name: 'Instruction working with Editor',
    prop: 'instructionworkingwitheditor'
  },
  {
    name: 'Uni-Assist Instruction',
    prop: 'uniassistinstruction'
  },
  {
    name: 'Visa Instruction',
    prop: 'visainstruction'
  },
  {
    name: 'Assign Editor',
    prop: 'assigneditor'
  }
];

window.documentsprogresslist = [
  {
    name: 'Template filled?',
    prop: 'receive_template'
  },
  {
    name: 'Preparing',
    prop: 'preparing'
  },
  {
    name: 'Last Update',
    prop: 'lastupdate'
  },
  {
    name: 'Closed',
    prop: 'closed'
  }
];

window.cvmlrllist = [
  {
    name: 'Status',
    prop: 'status'
  },
  {
    name: 'Documents',
    prop: 'documents'
  },
  {
    name: 'Last Update',
    prop: 'last_update'
  },
  {
    name: 'Aged Days',
    prop: 'aged_days'
  },
  {
    name: 'Deadline',
    prop: 'deadline'
  },
  {
    name: 'Days left',
    prop: 'days_left'
  }
];

window.cvmlrlclosedlist = [
  {
    name: 'Status',
    prop: 'status'
  },
  {
    name: 'Documents',
    prop: 'documents'
  },
  {
    name: 'Last Update',
    prop: 'last_update'
  },
  {
    name: 'Deadline',
    prop: 'deadline'
  },
  {
    name: 'Application',
    prop: 'application'
  }
];

window.programstatuslist = [
  {
    name: 'University',
    prop: 'university'
  },
  {
    name: 'Degree',
    prop: 'degree'
  },
  {
    name: 'Programs',
    prop: 'programs'
  },
  {
    name: 'Semester',
    prop: 'semester'
  },
  {
    name: 'TOEFL',
    prop: 'toefl'
  },
  {
    name: 'IELTS',
    prop: 'ielts'
  },
  {
    name: 'Deadline',
    prop: 'deadline'
  },
  {
    name: 'Decided',
    prop: 'decided'
  },
  {
    name: 'Submitted',
    prop: 'Submitted'
  },
  {
    name: 'Offer',
    prop: 'offer'
  },
  {
    name: 'Days left',
    prop: 'days_left'
  }
];

window.programs_files_checklist = [
  {
    name: 'Base Docs',
    prop: 'base_documents'
  },
  {
    name: 'Uni-Assist',
    prop: 'uni_assist'
  },
  {
    name: 'CV',
    prop: 'cv'
  },
  {
    name: 'ML/RL',
    prop: 'ml_rl'
  },

  {
    name: 'Ready',
    prop: 'readiness'
  }
];

window.profile_wtih_doc_link_list = {
  High_School_Diploma: { name: 'High School Diploma', link: '' },
  High_School_Transcript: { name: 'High School Transcript', link: '' },
  University_Entrance_Examination_GSAT: { name: 'GSAT/SAT (學測)', link: '' },
  Bachelor_Certificate: { name: 'Bachelor Certificate', link: '' },
  Bachelor_Transcript: { name: 'Bachelor Transcript', link: '' },
  Englisch_Certificate: { name: 'TOEFL or IELTS', link: '' },
  German_Certificate: { name: 'TestDaF or Goethe B2/C1', link: '' },
  GREGMAT: { name: 'GRE or GMAT', link: '' },
  ECTS_Conversion: { name: 'ECTS Conversion', link: '' },
  Course_Description: { name: 'Course Description', link: '' },
  Internship: { name: 'Internship Certificate', link: '' },
  Employment_Certificate: { name: 'Employment Certificate', link: '' },
  Passport_Photo: { name: 'Passport Photo', link: '' },
  Passport: { name: 'Passport Copy', link: '' },
  Others: { name: 'Others', link: '' }
};

window.profile_list = {
  High_School_Diploma: 'High School Diploma',
  High_School_Transcript: 'High School Transcript',
  University_Entrance_Examination_GSAT: 'GSAT/SAT (學測)',
  Bachelor_Certificate: 'Bachelor Certificate',
  Bachelor_Transcript: 'Bachelor Transcript',
  Englisch_Certificate: 'TOEFL or IELTS',
  German_Certificate: 'TestDaF or Goethe-B2/C1',
  GREGMAT: 'GRE or GMAT',
  ECTS_Conversion: 'ECTS Conversion',
  Course_Description: 'Course Description',
  Internship: 'Internship Certificate',
  Employment_Certificate: 'Employment Certificate',
  Passport_Photo: 'Passport Photo',
  Passport: 'Passport Copy',
  Others: 'Others'
};

window.academic_background_header = {
  School: 'School / Program',
  Application_Fields: 'Target',
  English_German: 'English/German',
  Score: 'Score',
  Next_Test_Date: 'Next Test Date'
};

window.templatelist = [
  {
    name: 'CV Survey Template',
    prop: 'Example_CV_english'
  },
  {
    name: 'ML (Motivation Letter) Survey Template',
    prop: 'ML_Survey'
  },
  {
    name: 'RL (Recommendation Letter) Survey Template',
    prop: 'RL_academic_survey_lock'
  },
  {
    name: 'Internship Certificate',
    prop: 'Internship_Certificate_Example'
  },
  {
    name: 'Employment Certificate',
    prop: 'Employment_Template'
  },
  {
    name: 'Module Description',
    prop: 'Module_Catalog'
  },
  {
    name: 'ECTS Conv.',
    prop: 'ECTS_Conv_example'
  }
  // {
  //   name: "Essay",
  //   prop: "Essay_",
  // },
];

window.ProgramlistHeader = [
  {
    name: 'University',
    prop: 'school'
  },
  {
    name: 'Program',
    prop: 'program_name'
  },
  {
    name: 'TOEFL',
    prop: 'toefl'
  },
  {
    name: 'IELTS',
    prop: 'ielts'
  },
  {
    name: 'Degree',
    prop: 'degree'
  },
  {
    name: 'GRE/GMAT',
    prop: 'gre'
  },
  {
    name: 'Application Deadline',
    prop: 'application_deadline'
  },
  {
    name: 'Last Update',
    prop: 'updatedAt'
  }
];

window.ProgramlistHeader22 = [
  {
    Header: 'University',
    accessor: 'school'
  },
  {
    Header: 'Program',
    accessor: 'program_name'
  },
  {
    Header: 'TOEFL',
    accessor: 'toefl'
  },
  {
    Header: 'IELTS',
    accessor: 'ielts'
  },
  {
    Header: 'Degree',
    accessor: 'degree'
  },
  {
    Header: 'GRE/GMAT',
    accessor: 'gre'
  },
  {
    Header: 'Application Deadline',
    accessor: 'application_deadline'
  },
  {
    Header: 'Last Update',
    accessor: 'updatedAt'
  }
];

window.NewProgramHeader = [
  {
    name: 'University',
    prop: 'school'
  },
  {
    name: 'Program',
    prop: 'program'
  },
  {
    name: 'Degree',
    prop: 'degree'
  },
  {
    name: 'Semester',
    prop: 'semester'
  },
  {
    name: 'Language',
    prop: 'language'
  },
  {
    name: 'Application Start',
    prop: 'application_start'
  },
  {
    name: 'Application Deadline',
    prop: 'application_deadline'
  },
  {
    name: 'Uni Assist',
    prop: 'uni_assist'
  },
  {
    name: 'TOEFL',
    prop: 'toefl'
  },
  {
    name: 'IELTS',
    prop: 'ielts'
  },
  {
    name: 'TestDaF',
    prop: 'testdaf'
  },
  {
    name: 'GRE',
    prop: 'gre'
  },
  {
    name: 'GMAT',
    prop: 'gmat'
  },
  {
    name: 'ML Needed?',
    prop: 'ml_required'
  },
  {
    name: 'ML Requirements',
    prop: 'ml_requirements'
  },
  {
    name: 'RL Needed?',
    prop: 'rl_required'
  },
  {
    name: 'RL Requirements',
    prop: 'rl_requirements'
  },
  {
    name: 'Essay Required',
    prop: 'essay_required'
  },
  {
    name: 'Essay Requirements',
    prop: 'essay_requirements'
  },
  {
    name: 'Special Notes',
    prop: 'special_notes'
  },
  {
    name: 'Comments',
    prop: 'comments'
  },
  {
    name: 'Application Portal A',
    prop: 'application_portal_a'
  },
  {
    name: 'Application Portal B',
    prop: 'application_portal_b'
  },
  {
    name: 'Website',
    prop: 'website'
  },
  {
    name: 'FPSO',
    prop: 'fpso'
  },
  {
    name: 'Last Update',
    prop: 'updatedAt'
  },
  {
    name: 'Modified by',
    prop: 'whoupdated'
  },
  {
    name: 'Group',
    prop: 'study_group_flag'
  }
];

window.UserlistHeader = [
  {
    name: 'First Name',
    prop: 'firstname'
  },
  {
    name: 'Last Name',
    prop: 'lastname'
  },
  {
    name: 'Birthday',
    prop: 'birthday'
  },
  {
    name: 'Email Address',
    prop: 'email'
  },
  {
    name: 'Activated',
    prop: 'isAccountActivated'
  },
  {
    name: 'User Type',
    prop: 'role'
  }
];

const app = (
  <Provider store={store}>
    <BrowserRouter basename={config.basename}>
      {/* basename="/datta-able" */}
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

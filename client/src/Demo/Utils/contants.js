import React from 'react';
import {
  AiFillCloseCircle,
  AiFillQuestionCircle,
  AiOutlineFieldTime
} from 'react-icons/ai';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { BsDash } from 'react-icons/bs';
import { BiCommentDots } from 'react-icons/bi';
let FILE_OK_SYMBOL = (
  <IoCheckmarkCircle size={18} color="limegreen" title="Valid Document" />
);
let FILE_NOT_OK_SYMBOL = (
  <AiFillCloseCircle size={18} color="red" title="Invalid Document" />
);
let FILE_UPLOADED_SYMBOL = (
  <AiOutlineFieldTime size={18} color="orange" title="Uploaded successfully" />
);
let FILE_MISSING_SYMBOL = (
  <AiFillQuestionCircle
    size={18}
    color="lightgray"
    title="No Document uploaded"
  />
);
let FILE_DONT_CARE_SYMBOL = (
  <BsDash size={18} color="lightgray" title="Not needed" />
);
export const SYMBOL_EXPLANATION = (
  <>
    <p className="text-muted"> </p>
    <p className="text-info">
      {FILE_OK_SYMBOL}: The document is valid and can be used in the
      application.
    </p>
    <p className="text-info">
      {FILE_NOT_OK_SYMBOL}: The document is invalid and cannot be used in the
      application. Please properly scan a new one.
    </p>
    <p className="text-info">
      {FILE_UPLOADED_SYMBOL}: The document is uploaded. Your agent will check it
      as soon as possible.
    </p>
    <p className="text-info">
      {FILE_MISSING_SYMBOL}: Please upload the copy of the document.
    </p>
    <p className="text-info">
      {FILE_DONT_CARE_SYMBOL}: This document is not needed.
    </p>{' '}
  </>
);

export const study_group = [
  { key: 'boe', value: 'Biomedical Engineering' },
  { key: 'ee', value: 'Eletrical/Electronics Engineering' },
  { key: 'cs', value: 'Computer Science' },
  { key: 'mgm', value: 'Business/Management' },
  { key: 'dsbi', value: 'Data Science/Business Intelligence' },
  { key: 'psy', value: 'Psychology' },
  { key: 'me', value: 'Mechanical Engineering' },
  { key: 'mtl', value: 'Materials Science' }
];

export const valid_categories = [
  { key: 'howtostart', value: 'How to Start' },
  { key: 'application', value: 'Application' },
  { key: 'base-documents', value: 'Base-documents' },
  { key: 'cv-ml-rl', value: 'CV/ML/RL' },
  { key: 'portal-instruction', value: 'Portal-Instruction' },
  { key: 'certification', value: 'Certification' },
  { key: 'uniassist', value: 'Uni-Assist' },
  { key: 'visa', value: 'Visa' }
];

export const profile_name_list = {
  High_School_Diploma: 'High_School_Diploma',
  High_School_Transcript: 'High_School_Transcript',
  University_Entrance_Examination_GSAT: 'University_Entrance_Examination_GSAT',
  Bachelor_Certificate: 'Bachelor_Certificate',
  Bachelor_Transcript: 'Bachelor_Transcript',
  Englisch_Certificate: 'Englisch_Certificate',
  German_Certificate: 'German_Certificate',
  GREGMAT: 'GREGMAT',
  ECTS_Conversion: 'ECTS_Conversion',
  Course_Description: 'Course_Description',
  Internship: 'Internship',
  Employment_Certificate: 'Employment_Certificate',
  Passport: 'Passport',
  Others: 'Others',
  Grading_System: 'Grading_System'
};

export const spinner_style = {
  position: 'fixed',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
};

export const spinner_style2 = {
  transform: 'rotate(360deg)',
  textAlign: 'left',
  verticalAlign: 'left',
  overflowWrap: 'break-word'
};

export const valid_internal_categories = [
  { key: 'agents', value: 'Agents' },
  { key: 'editors', value: 'Editors' },
  { key: 'admin', value: 'Admin' },
  { key: 'base-documents-internal', value: 'Base Documents Internal' },
  { key: 'uniassist-internal', value: 'Uni-Assist Internal' }
];

export const convertDate = (date) => {
  let date_str = '';
  let dat = new Date(date).toLocaleDateString('zh-Hans-CN');
  let time = new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  return dat + ', ' + time;
};

export const split_header = (header_name) => {
  var rest = header_name.substring(0, header_name.lastIndexOf(' ') + 1);
  var last = header_name.substring(
    header_name.lastIndexOf(' ') + 1,
    header_name.length
  );
  return (
    <>
      {rest}
      <br />
      {last}
    </>
  );
};

export const stringToColor = (str) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
};
export const stringAvatar = (name) => {
  return {
    sx: {
      bgcolor: stringToColor(name)
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
  };
};

export const getNumberOfDays = (start, end) => {
  const date1 = new Date(start);
  const date2 = new Date(end);

  // One day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;

  // Calculating the time difference between two dates
  const diffInTime = date2.getTime() - date1.getTime();

  // Calculating the no. of days between two dates
  const diffInDays = Math.round(diffInTime / oneDay);

  return diffInDays.toString();
};

const create_years = (start_year, end_year) => {
  const num = end_year - start_year;
  const year_array = Array.from({ length: num }, (_, i) => i + start_year);
  return year_array;
};

export const ENGLISH_CERTIFICATE_OPTIONS = () => {
  return (
    <>
      <option value="">Please Select</option>
      <option value="TOEFL">TOEFL</option>
      <option value="IELTS">IELTS</option>
      <option value="Duolingo">Duolingo</option>
      <option value="Native">Native</option>
    </>
  );
};

export const APPLICATION_YEARS_FUTURE = () => {
  return (
    <>
      {create_years(1950, 2050).map((year, idx) => (
        <option key={idx} value={year}>
          {year}
        </option>
      ))}
    </>
  );
};

export const EXPECTATION_APPLICATION_YEARS = () => {
  return (
    <>
      {create_years(2018, 2050).map((year, idx) => (
        <option key={idx} value={year}>
          {year}
        </option>
      ))}
    </>
  );
};

export const compare = (a, b) => {
  if (a.last_nom < b.last_nom) {
    return -1;
  }
  if (a.last_nom > b.last_nom) {
    return 1;
  }
  return 0;
};

export const return_thread_status2 = (user, thread) => {
  if (thread.isFinalVersion) {
    return <IoCheckmarkCircle size={24} color="limegreen" title="Complete" />;
  }
  if (
    thread.latest_message_left_by_id === undefined ||
    thread.latest_message_left_by_id === ''
  ) {
    if (user.role !== 'Student') {
      return (
        <AiFillQuestionCircle
          size={24}
          color="lightgray"
          title="Waiting feedback"
        />
      );
    }
  }
  if (user._id.toString() === thread.latest_message_left_by_id) {
    return (
      <AiFillQuestionCircle
        size={24}
        color="lightgray"
        title="Waiting feedback"
      />
    );
  } else {
    return <BiCommentDots size={24} color="red" title="New Message" />;
  }
};

export const return_thread_status = (user, thread) => {
  if (thread.isFinalVersion) {
    return (
      <td className="my-0 text-info">
        <IoCheckmarkCircle size={24} color="limegreen" title="Complete" />
      </td>
    );
  }
  if (
    thread.latest_message_left_by_id === undefined ||
    thread.latest_message_left_by_id === ''
  ) {
    if (user.role !== 'Student') {
      return (
        <td className="my-0 text-info">
          <AiFillQuestionCircle
            size={24}
            color="lightgray"
            title="Waiting feedback"
          />
        </td>
      );
    }
  }
  if (user._id.toString() === thread.latest_message_left_by_id) {
    return (
      <td className="my-0 text-info">
        <AiFillQuestionCircle
          size={24}
          color="lightgray"
          title="Waiting feedback"
        />
      </td>
    );
  } else {
    return (
      <td className="my-0 text-info">
        <BiCommentDots size={24} color="red" title="New Message" />
      </td>
    );
  }
};

export const is_not_started_tasks_status = (user, thread) => {
  if (thread.isFinalVersion) {
    return false;
  }
  if (
    thread.latest_message_left_by_id === undefined ||
    thread.latest_message_left_by_id === ''
  ) {
    return true;
  }
};
export const is_started_tasks_status = (user, thread) => {
  return !is_not_started_tasks_status(user, thread);
};
export const is_new_message_status = (user, thread) => {
  if (thread.isFinalVersion) {
    return false;
  }
  if (
    thread.latest_message_left_by_id === undefined ||
    thread.latest_message_left_by_id === ''
  ) {
    if (user.role !== 'Student') {
      return false;
    }
  }
  if (user._id.toString() === thread.latest_message_left_by_id) {
    return false;
  } else {
    return true;
  }
};

export const DELETE_STYLE = 'danger';
export const REJECT_STYLE = 'secondary';
export const ACCEPT_STYLE = 'success';

export const is_pending_status = (user, thread) => {
  return !is_new_message_status(user, thread);
};

export const documentation_categories = {
  howtostart: 'How to Start TaiGer Portal',
  'base-documents': 'Base Documents',
  'cv-ml-rl': 'CV/ML/RL',
  application: 'Application Instruction',
  'portal-instruction': 'Portal Instruction',
  certification: 'Certification Instruction',
  uniassist: 'Uni-Assist Instruction',
  visa: 'Visa Instruction'
};

export const internal_documentation_categories = {
  agents: 'Agents',
  editors: 'Editors',
  admin: 'Admin',
  'base-documents-internal': 'Base Documents Internal',
  'uniassist-internal': 'Uni-Assist Internal'
};

export const cvmlrl_overview_closed_header = [
  {
    Header: 'First-, Last Name',
    accessor: 'firstname_lastname',
    filter: 'fuzzyText'
  },
  {
    Header: 'Action',
    accessor: 'action',
    filter: 'fuzzyText'
  },
  {
    Header: 'Status',
    accessor: 'status',
    filter: 'fuzzyText'
  },
  {
    Header: 'Deadline',
    accessor: 'deadline'
  },
  {
    Header: 'Last Update',
    accessor: 'updatedAt'
  },
  {
    Header: 'Documents',
    accessor: 'document_name',
    filter: 'fuzzyText'
  }
];

export const cvmlrl_overview_header = [
  {
    Header: 'First-, Last Name',
    accessor: 'firstname_lastname',
    filter: 'fuzzyText'
  },
  {
    Header: 'Action',
    accessor: 'action',
    filter: 'fuzzyText'
  },
  {
    Header: 'Status',
    accessor: 'status',
    filter: 'fuzzyText'
  },
  {
    Header: 'Deadline',
    accessor: 'deadline'
  },
  {
    Header: 'Days left',
    accessor: 'days_left'
  },
  {
    Header: 'Documents',
    accessor: 'document_name',
    filter: 'fuzzyText'
  },
  {
    Header: 'Ages Days',
    accessor: 'aged_days'
  },
  {
    Header: 'Last Update',
    accessor: 'updatedAt'
  }
];

export const cvmlrlclosedlist = [
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

export const programstatuslist = [
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

export const profile_wtih_doc_link_list = {
  High_School_Diploma: { name: 'High School Diploma', link: '' },
  High_School_Transcript: { name: 'High School Transcript', link: '' },
  University_Entrance_Examination_GSAT: {
    name: 'GSAT/SAT/TVE Test (學測/統測)',
    link: ''
  },
  Bachelor_Certificate: { name: 'Bachelor Certificate/Enrolment', link: '' },
  Bachelor_Transcript: { name: 'Bachelor Transcript', link: '' },
  Englisch_Certificate: { name: 'TOEFL or IELTS', link: '' },
  German_Certificate: { name: 'TestDaF or Goethe B2/C1', link: '' },
  GREGMAT: { name: 'GRE or GMAT', link: '' },
  ECTS_Conversion: { name: 'ECTS Conversion', link: '' },
  Course_Description: { name: 'Course Description', link: '' },
  Internship: { name: 'Internship Certificate', link: '' },
  Employment_Certificate: { name: 'Employment Certificate', link: '' },
  Exchange_Student_Certificate: {
    name: 'Exchange Student Certificate',
    link: ''
  },
  Passport_Photo: { name: 'Passport Photo', link: '' },
  Passport: { name: 'Passport Copy', link: '' },
  Others: { name: 'Others', link: '' }
};

export const profile_list = {
  High_School_Diploma: 'High School Diploma',
  High_School_Transcript: 'High School Transcript',
  University_Entrance_Examination_GSAT: 'GSAT/SAT/TVE Test (學測/統測)',
  Bachelor_Certificate: 'Bachelor Certificate/Enrolment',
  Bachelor_Transcript: 'Bachelor Transcript',
  Englisch_Certificate: 'TOEFL or IELTS',
  German_Certificate: 'TestDaF or Goethe-A1-C1',
  GREGMAT: 'GRE or GMAT',
  ECTS_Conversion: 'ECTS Conversion',
  Course_Description: 'Course Description',
  Internship: 'Internship Certificate',
  Employment_Certificate: 'Employment Certificate',
  Exchange_Student_Certificate: 'Exchange Student Certificate',
  Passport_Photo: 'Passport Photo',
  Passport: 'Passport Copy',
  Others: 'Others'
};

export const base_documents_checklist = {
  High_School_Diploma: ['English version ?', 'School Stamp or signature'],
  High_School_Transcript: ['English version ?', 'Grading system existed ?'],
  University_Entrance_Examination_GSAT: ['English version ?'],
  Bachelor_Certificate: ['English version ?'],
  Bachelor_Transcript: [
    'Grading system existed ?',
    'GPA (1.7-4.3 system) and not 100-60 system ?',
    'Date of referral ? (if graduated)'
  ],
  Englisch_Certificate: ['Not expired ?'],
  German_Certificate: ['Not expired ?'],
  GREGMAT: ['Not expired ?'],
  ECTS_Conversion: [],
  Course_Description: [],
  Internship: [
    'Name and Birthday ?',
    'Start date and end date ?',
    'Working hours per week ?',
    'Stamp ?'
  ],
  Employment_Certificate: ['Start date and end date ?'],
  Exchange_Student_Certificate: ['With transcript ?'],
  Passport_Photo: ['Formal'],
  Passport: ['Signature ?', 'Not expired ?'],
  Others: []
};

export const academic_background_header = {
  School: 'School / Program',
  Application_Fields: 'Target',
  English_German: 'English/German',
  Score: 'Score',
  Next_Test_Date: 'Next Test Date'
};

export const templatelist = [
  {
    name: 'CV Survey Template (履歷模板)',
    prop: 'Example_CV_english',
    alias: 'CV'
  },
  {
    name: 'ML (Motivation Letter) Survey Template (動機信模板)',
    prop: 'ML_Survey',
    alias: 'ML'
  },
  {
    name: 'RL (Recommendation Letter) Survey Template (Academic) (教授推薦信模板(學術))',
    prop: 'RL_academic_survey_lock',
    alias: 'Recommendation'
  },
  {
    name: 'RL (Recommendation Letter) Survey Template (Employer) (主管推薦信模板(工作))',
    prop: 'RL_employer_survey_lock',
    alias: 'Recommendation'
  },
  {
    name: 'Internship Certificate (實習證明)',
    prop: 'Internship_Certificate_Example',
    alias: 'Internship'
  },
  {
    name: 'Employment Certificate (工作證明)',
    prop: 'Employment_Template',
    alias: 'Employment'
  },
  {
    name: 'Module Description (課程描述)',
    prop: 'Module_Catalog',
    alias: 'Module'
  },
  {
    name: 'ECTS Conversion (台灣Credits轉換歐洲ECTS學分證明)',
    prop: 'ECTS_Conv_example',
    alias: 'ECTS'
  }
];

export const UserlistHeader = [
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
    name: 'Archived',
    prop: 'archiv'
  },
  {
    name: 'User Type',
    prop: 'role'
  }
];

export const taskTashboardHeader = [
  {
    Header: 'First-, Last Name',
    accessor: 'firstname_lastname',
    filter: 'fuzzyText'
  },
  {
    Header: 'Editor',
    accessor: 'editors',
    filter: 'fuzzyText'
  },
  {
    Header: 'Deadline',
    accessor: 'deadline'
  },
  {
    Header: 'Days left',
    accessor: 'days_left'
  },
  {
    Header: 'Documents',
    accessor: 'document_name',
    filter: 'fuzzyText'
  },
  {
    Header: 'Ages Days',
    accessor: 'aged_days'
  },
  {
    Header: 'Last Update',
    accessor: 'updatedAt'
  }
];

export const applicationOverviewHeader = [
  {
    Header: 'First-, Last Name',
    accessor: 'firstname_lastname',
    filter: 'fuzzyText'
  },
  {
    Header: 'University',
    accessor: 'school',
    filter: 'fuzzyText'
  },
  {
    Header: 'Degree',
    accessor: 'degree'
  },
  {
    Header: 'Program',
    accessor: 'program_name'
  },
  {
    Header: 'Semester',
    accessor: 'semester',
    filter: 'fuzzyText'
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
    Header: 'Deadline',
    accessor: 'application_deadline'
  },
  {
    Header: 'Decided',
    accessor: 'decided'
  },
  {
    Header: 'Submitted',
    accessor: 'closed'
  },
  {
    Header: 'Offer',
    accessor: 'admission'
  },
  {
    Header: 'Days left',
    accessor: 'days_left'
  }
];

export const applicationFileOverviewHeader = [
  {
    Header: 'First-, Last Name',
    accessor: 'firstname_lastname',
    filter: 'fuzzyText'
  },
  {
    Header: 'University',
    accessor: 'school',
    filter: 'fuzzyText'
  },
  {
    Header: 'Degree',
    accessor: 'degree'
  },
  {
    Header: 'Program',
    accessor: 'program_name'
  },
  {
    Header: 'Deadline',
    accessor: 'deadline'
  },
  {
    Header: 'Base Docs',
    accessor: 'base_docs'
  },
  {
    Header: 'Uni-Assist',
    accessor: 'uniassist'
  },
  {
    Header: 'CV',
    accessor: 'cv'
  },
  {
    Header: 'ML/RL',
    accessor: 'ml_rl'
  },
  {
    Header: 'Ready',
    accessor: 'ready'
  }
];

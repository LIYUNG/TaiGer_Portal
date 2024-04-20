import React from 'react';
import { DateTime, IANAZone } from 'luxon';
import moment from 'moment-timezone';
import { styled, alpha } from '@mui/material/styles';
import { InputBase, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import BugReportIcon from '@mui/icons-material/BugReport';
import WarningIcon from '@mui/icons-material/Warning';
import HelpIcon from '@mui/icons-material/Help';
import RemoveIcon from '@mui/icons-material/Remove';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import { green, red, grey, orange } from '@mui/material/colors';
import { Link, Tooltip, Chip } from '@mui/material';
import { Link as LinkDom } from 'react-router-dom';
import { appConfig } from '../../config';
import DEMO from '../../store/constant';

export const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto'
  }
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch'
    }
  }
}));

export const menuWidth = 350;
export const EmbeddedChatListWidth = 290;

export const CVMLRL_DOC_PRECHECK_STATUS_E = {
  OK_SYMBOL: (
    <CheckCircleIcon size={18} style={{ color: green[500] }} title="Decided" />
  ),
  NOT_OK_SYMBOL: (
    <CancelIcon size={18} style={{ color: red[700] }} title="Decided No" />
  ),
  RISK_SYMBOL: (
    <BugReportIcon size={18} style={{ color: grey[400] }} title="Risk" />
  ),
  WARNING_SYMBOK: (
    <WarningIcon size={18} style={{ color: red[700] }} title="Warning" />
  )
};

export const DECISION_STATUS_E = {
  OK_SYMBOL: (
    <CheckCircleIcon size={18} style={{ color: green[500] }} title="Decided" />
  ),
  NOT_OK_SYMBOL: (
    <CancelIcon size={18} style={{ color: red[700] }} title="Decided No" />
  ),
  UNKNOWN_SYMBOL: (
    <HelpIcon size={18} style={{ color: grey[400] }} title="Not sure" />
  )
};
export const SUBMISSION_STATUS_E = {
  OK_SYMBOL: (
    <CheckCircleIcon
      size={18}
      style={{ color: green[500] }}
      title="Submitted"
    />
  ),
  NOT_OK_SYMBOL: (
    <CancelIcon size={18} style={{ color: red[700] }} title="Withdraw" />
  ),
  UNKNOWN_SYMBOL: (
    <HelpIcon size={18} style={{ color: grey[400] }} title="In Progress" />
  )
};
export const ADMISSION_STATUS_E = {
  OK_SYMBOL: (
    <CheckCircleIcon size={18} style={{ color: green[500] }} title="Admitted" />
  ),
  NOT_OK_SYMBOL: (
    <CancelIcon size={18} style={{ color: red[700] }} title="Rejected" />
  ),
  UNKNOWN_SYMBOL: (
    <HelpIcon size={18} style={{ color: grey[400] }} title="Pending" />
  )
};

export const FILE_OK_SYMBOL = (
  <CheckCircleIcon
    size={18}
    style={{ color: green[500] }}
    title="Valid Document"
  />
);
export const FILE_NOT_OK_SYMBOL = (
  <CancelIcon size={18} style={{ color: red[700] }} title="Invalid Document" />
);
export const FILE_UPLOADED_SYMBOL = (
  <QueryBuilderIcon
    size={18}
    style={{ color: orange[400] }}
    title="Uploaded successfully"
  />
);
export const FILE_MISSING_SYMBOL = (
  <HelpIcon
    size={18}
    style={{ color: grey[400] }}
    title="No Document uploaded"
  />
);
export const FILE_DONT_CARE_SYMBOL = (
  <RemoveIcon size={18} style={{ color: grey[400] }} title="Not needed" />
);

export const questionType = {
  word: 'word',
  sentence: 'sentence',
  paragraph: 'paragraph',
  essay: 'essay'
};

export const prepQuestions = (thread, isSpecific) => {
  let questions = [];
  if (
    thread?.file_type?.includes('RL') ||
    thread?.file_type?.includes('Recommendation')
  ) {
    questions = RLQuestions(thread);
  } else {
    switch (thread?.file_type) {
      case 'ML':
        questions = MLQuestions(thread, isSpecific);
        break;
      case 'CV':
        questions = CVQuestions();
        break;
      default:
        questions = [];
    }
  }
  return questions;
};

export const CVQuestions = () => {
  return [
    {
      questionId: 'q1',
      question: `1. Survey not ready`,
      type: questionType.word,
      answer: ''
    },
    {
      questionId: 'q2',
      question: `2. Survey not ready`,
      placeholder: '',
      type: questionType.sentence,
      answer: ''
    },
    {
      questionId: 'q3',
      question: `3. Survey not ready`,
      placeholder: '',
      type: questionType.paragraph,
      answer: ''
    },
    {
      questionId: 'q4',
      question: `4. Survey not ready`,
      placeholder: '',
      type: questionType.essay,
      answer: ''
    }
  ];
};

export const RLQuestions = () => {
  return [
    {
      questionId: 'q1',
      question: `1. Referrer's position`,
      placeholder: 'Professor',
      type: questionType.word,
      answer: ''
    },
    {
      questionId: 'q2',
      question: `2. Referrer's firstname`,
      placeholder: 'Hao',
      type: questionType.word,
      answer: ''
    },
    {
      questionId: 'q3',
      question: `3. Referrer's lastname`,
      placeholder: 'Chen',
      type: questionType.word,
      answer: ''
    },
    {
      questionId: 'q4',
      question: `4. Referrer's institute's phone number`,
      placeholder: '+886-9123-456-789',
      type: questionType.sentence,
      answer: ''
    },
    {
      questionId: 'q5',
      question: `5. Referrer's institute email`,
      placeholder: 'chao@ntu.edu.tw',
      type: questionType.sentence,
      answer: ''
    },
    {
      questionId: 'q6',
      question: `6. Institute name`,
      placeholder: 'National Taiwan University',
      type: questionType.sentence,
      answer: ''
    },
    {
      questionId: 'q7',
      question: `7. Institute location`,
      placeholder: 'Taipei',
      type: questionType.word,
      answer: ''
    },
    {
      questionId: 'q8',
      question: `8. Institute address`,
      placeholder: 'No. 1, Sec. 4, Roosevelt Rd., Taipei 10617, Taiwan',
      type: questionType.sentence,
      answer: ''
    },
    {
      questionId: 'q9',
      question: `9. Institute phone number`,
      placeholder: ' +886-2-3366-3366 ',
      type: questionType.sentence,
      answer: ''
    },
    {
      questionId: 'q10',
      question: `10. Professor Met Student in which course or Lab`,
      placeholder:
        'Introduction to Image Processing, Computer Vision and Deep learning',
      type: questionType.sentence,
      answer: ''
    },
    {
      questionId: 'q11',
      question: `11. Student's academic/extracurricular activity performance 1`,
      placeholder:
        'Mr. Xiao-Ming Wang impressed me deeply with his inquisitiveness in classes to scrutinize which has been taught. I remembered that he started to ask me course-relevant questions in my course. It was rare and commendable because many of the students began to review and prepare for the course materials before exams. He was able to catch up with the main ideas and to integrate them into a whole and to initiate questions for further clarification and present critical remarks for deeper thinking. All his remarkable diligence and intelligence reflected on his excellent performance in homework and exams. Actually, he got 96 out of 100 (A+) as a final grade in my course, which was one of the highest scores among my class.',
      type: questionType.paragraph,
      answer: ''
    },
    {
      questionId: 'q12',
      question: `12. Student's academic/extracurricular activity performance 2`,
      placeholder:
        'Even though Mr. Xiao-Ming Wang’s main major was mechanical Engineering, he demonstrated his enthusiasm for computer vision and machine learning. He was able to connect these different subjects and apply learned knowledge in different fields.',
      type: questionType.paragraph,
      answer: ''
    },
    {
      questionId: 'q13',
      question: `13. Student's academic/extracurricular activity performance 2`,
      type: questionType.paragraph,
      answer: ''
    },
    {
      questionId: 'q14',
      question: `14. Student's academic/extracurricular activity performance 3`,
      type: questionType.paragraph,
      answer: ''
    },
    {
      questionId: 'q15',
      question: `15. Student's outstanding characteristic 1`,
      placeholder:
        'Mr. Xiao-Ming Wang was also good at hands-on engineering. I saw him finished his work soon and then helped his classmates many times. He endowed with great teamwork spirit and was very willing to help others in need',
      type: questionType.paragraph,
      answer: ''
    },
    {
      questionId: 'q16',
      question: `16. Student's outstanding characteristic 2`,
      placeholder:
        'Mr. Xiao-Ming Wang  is a diligent student and willing to learn and try new challenges, I could notice these characteristics based on his performance and attitude in the course',
      type: questionType.paragraph,
      answer: ''
    },
    {
      questionId: 'q17',
      question: `17. Student's outstanding characteristic 3`,
      type: questionType.paragraph,
      answer: ''
    },
    {
      questionId: 'q18',
      question: `18. Student's Interpersonal skills 1`,
      placeholder:
        'Mr. Xiao-Ming Wang was very friendly and helpful toward Classmate.',
      type: questionType.paragraph,
      answer: ''
    },
    {
      questionId: 'q19',
      question: `19. Student's Interpersonal skills 2`,
      type: questionType.paragraph,
      answer: ''
    }
  ];
};

export const MLQuestions = (thread, isSpecific) => {
  if (isSpecific) {
    return [
      {
        questionId: 'q6',
        question: `6. Why do you want to study in ${
          COUNTRIES_MAPPING[thread?.program_id?.country] || 'this country'
        } and not in your home country or any other country?`,
        type: questionType.paragraph,
        answer: ''
      },
      {
        questionId: 'q7',
        question: `7. Why should the ${thread?.program_id?.school} select you as their student? What can you contribute to the universities?`,
        type: questionType.paragraph,
        answer: ''
      },
      {
        questionId: 'q8',
        question: `8. Why do you want to study exactly at the ${
          thread?.program_id
            ? `${thread.program_id?.school} - ${thread.program_id?.program_name}`
            : ``
        } ? What is special about them?`,
        type: questionType.paragraph,
        answer: ''
      },
      {
        questionId: 'q9',
        question:
          '9. Any missing requirements or anything else you want to tell us?',
        type: questionType.paragraph,
        answer: ''
      }
    ];
  }

  return [
    {
      questionId: 'q1',
      question:
        '1. What is your dream job you want to do after you have graduated? What do you want to become professionally?',
      type: questionType.paragraph,
      answer: ''
    },
    {
      questionId: 'q2',
      question:
        '2. Why do you think your field of interest (= area of the programs you want to apply for) is important now and in the future?',
      type: questionType.paragraph,
      answer: ''
    },
    {
      questionId: 'q3',
      question:
        '3. How did your previous education/academic experience (學術界的相關經驗) prepare you for your future studies? What did you learn so far? (e.g. courses, projects, achievements, …)',
      type: questionType.paragraph,
      answer: ''
    },
    {
      questionId: 'q4',
      question:
        '5. How did your previous practical experience (實習、工作的相關經驗) prepare you for your future studies? What did you learn? (e.g. experiences during internship/jobs/…)',
      type: questionType.paragraph,
      answer: ''
    },
    {
      questionId: 'q5',
      question:
        '5. What are your 3 biggest strengths? (abilities, personal characteristics, …)',
      type: questionType.paragraph,
      answer: ''
    }
  ];
};
export const SYMBOL_EXPLANATION = (
  <>
    <Typography>
      {FILE_OK_SYMBOL}: The document is valid and can be used in the
      application.
    </Typography>
    <Typography>
      {FILE_NOT_OK_SYMBOL}: The document is invalid and cannot be used in the
      application. Please properly scan a new one.
    </Typography>
    <Typography>
      {FILE_UPLOADED_SYMBOL}: The document is uploaded. Your agent will check it
      as soon as possible.
    </Typography>
    <Typography>
      {FILE_MISSING_SYMBOL}: Please upload the copy of the document.
    </Typography>
    <Typography>
      {FILE_DONT_CARE_SYMBOL}: This document is not needed.
    </Typography>
  </>
);
export const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export const bufferDays = 2;

export const getTodayAsWeekday = (timezone) => {
  const now = DateTime.fromObject({}, { zone: timezone });
  return now.weekday - 1 + bufferDays;
};

export const getReorderWeekday = (index) => {
  let delayed_index = index;
  delayed_index = delayed_index % 7;
  if (delayed_index >= 0 && delayed_index <= 6) {
    const weekdayOrder = daysOfWeek
      .slice(delayed_index)
      .concat(daysOfWeek.slice(0, delayed_index));
    return weekdayOrder;
  } else {
    return 'Invalid index';
  }
};
export const NoonNightLabel = (start) => {
  const start_temp = new Date(start);
  return start_temp.getHours() === 12 && start_temp.getMinutes() === 0
    ? '(Noon)'
    : start_temp.getHours() === 0 && start_temp.getMinutes() === 0
    ? '(Night)'
    : '';
};

export const transformObjectToArray = (inputObject) => {
  return Object.entries(inputObject).map(([date, apiCallCount]) => ({
    date,
    apiCallCount: apiCallCount.TOTAL,
    get: apiCallCount.GET,
    post: apiCallCount.POST,
    put: apiCallCount.PUT,
    delete: apiCallCount.DELETE
  }));
};
export const getLast180DaysSet = () => {
  const today = new Date();
  const last180DaysSet = new Set();

  for (let i = 179; i >= 0; i--) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() - i);

    const formattedDate = currentDate.toISOString().split('T')[0]; // Get YYYY-MM-DD format

    last180DaysSet.add({ date: formattedDate });
  }

  return last180DaysSet;
};

export const getLast180DaysObject = () => {
  const today = new Date();
  const last180DaysObject = {};

  for (let i = 0; i < 180; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() - i);

    const formattedDate = currentDate.toISOString().split('T')[0];
    last180DaysObject[formattedDate] = {
      TOTAL: 0,
      GET: 0,
      PUT: 0,
      POST: 0,
      DELETE: 0
    };
  }

  return last180DaysObject;
};

const convertISOToCustomFormat = (isoString) => {
  const date = new Date(isoString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000+00:00`;
};

export const getUTCWithDST = (year, month, day, timezone, timeslot) => {
  // Create a Moment object for the current date and time in the specified timezone
  const localTime = moment.tz(timezone);
  const [hours, minutes] = timeslot.split(':').map(Number);

  // Set the time to the specified timeslot
  localTime.set({
    year,
    month: month - 1,
    day,
    hour: hours,
    minute: minutes,
    second: 0,
    millisecond: 0
  });

  // Ensure that the localTime is aware of DST
  localTime.tz(timezone);

  // Get the UTC time while considering DST
  // const utcTime = localTime.toISOString();
  const a = moment.tz(
    `${year}-${month < 10 ? `0${month}` : month}-${
      day < 10 ? `0${day}` : `${day}`
    } ${timeslot}`,
    timezone
  );
  return convertISOToCustomFormat(a.utc().format());
};

export const getLocalTime = (utc_time, timezone) => {
  const utcMoment = moment.utc(`${utc_time.toISOString()}`).tz(timezone);
  const localTime = utcMoment.tz(timezone);
  return localTime.format();
};
export const getUTCTimezoneOffset = (utc_time, timezone) => {
  const utcMoment = moment.utc(`${utc_time.toISOString()}`);
  const localTime = utcMoment.clone().tz(timezone);
  const timeZoneOffsetMinutes = localTime.utcOffset();
  return timeZoneOffsetMinutes;
};
export const getTimezoneOffset = (timezone) => {
  const zone = IANAZone.create(
    timezone ? timezone : Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const now = Date.now();
  const offset = zone.offset(new Date(now));
  const offsetHours = offset / 60;
  return offsetHours;
};

export const shiftDateByOffset = (originalDate, offsetHours) => {
  const shiftedDate = new Date(originalDate);
  const hours = Math.floor(offsetHours); // Get the whole number of hours
  const minutes = (offsetHours - hours) * 60; // Convert decimal to minutes

  shiftedDate.setHours(shiftedDate.getHours() + hours);
  shiftedDate.setMinutes(shiftedDate.getMinutes() + minutes);
  return shiftedDate;
};

export const getNextDayDate = (reorder_weekday, dayOfWeek, timezone, nextN) => {
  const now = DateTime.fromObject({}, { zone: timezone });
  const targetDayIndex = reorder_weekday.indexOf(dayOfWeek); // dayOfWeek is explicitly predefined. (Monday....) 0-6

  let daysToAdd = targetDayIndex % 7;

  // Calculate the date of the next Nth occurrence
  const nextOccurrence = now.plus({ days: daysToAdd + nextN * 7 + bufferDays });

  // const options = {
  //   weekday: 'long',
  //   year: 'numeric',
  //   month: 'numeric',
  //   day: 'numeric'
  // };
  return {
    weekdayLong: nextOccurrence.weekdayLong,
    year: nextOccurrence.year,
    month: nextOccurrence.month,
    day: nextOccurrence.day
  };
};

export const time_slots = [
  { value: '04:00', label: '04:00 AM' },
  { value: '04:30', label: '04:30 AM' },
  { value: '05:00', label: '05:00 AM' },
  { value: '05:30', label: '05:30 AM' },
  { value: '06:00', label: '06:00 AM' },
  { value: '06:30', label: '06:30 AM' },
  { value: '07:00', label: '07:00 AM' },
  { value: '07:30', label: '07:30 AM' },
  { value: '08:00', label: '08:00 AM' },
  { value: '08:30', label: '08:30 AM' },
  { value: '09:00', label: '09:00 AM' },
  { value: '09:30', label: '09:30 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '10:30', label: '10:30 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '11:30', label: '11:30 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '12:30', label: '12:30 PM' },
  { value: '13:00', label: '01:00 PM' },
  { value: '13:30', label: '01:30 PM' },
  { value: '14:00', label: '02:00 PM' },
  { value: '14:30', label: '02:30 PM' },
  { value: '15:00', label: '03:00 PM' },
  { value: '15:30', label: '03:30 PM' },
  { value: '16:00', label: '04:00 PM' },
  { value: '16:30', label: '04:30 PM' },
  { value: '17:00', label: '05:00 PM' },
  { value: '17:30', label: '05:30 PM' },
  { value: '18:00', label: '06:00 PM' },
  { value: '18:30', label: '06:30 PM' },
  { value: '19:00', label: '07:00 PM' },
  { value: '19:30', label: '07:30 PM' },
  { value: '20:00', label: '08:00 PM' },
  { value: '20:30', label: '08:30 PM' },
  { value: '21:00', label: '09:00 PM' },
  { value: '21:30', label: '09:30 PM' },
  { value: '22:00', label: '10:00 PM' },
  { value: '22:30', label: '10:30 PM' },
  { value: '23:00', label: '11:00 PM' },
  { value: '23:30', label: '11:30 PM' },
  { value: '00:00', label: '12:00 AM' }
];
export const study_group = [
  { key: 'boe', value: 'Biomedical Engineering' },
  { key: 'cmy', value: 'Chemistry' },
  { key: 'cs', value: 'Computer Science' },
  { key: 'dsbi', value: 'Data Science/Business Intelligence' },
  { key: 'ee', value: 'Eletrical/Electronics Engineering' },
  { key: 'mgm', value: 'Business/Management' },
  { key: 'phy', value: 'Physics' },
  { key: 'psy', value: 'Psychology' },
  { key: 'me', value: 'Mechanical Engineering' },
  { key: 'mtl', value: 'Materials Science' }
];

export const valid_categories = appConfig.vpdEnable
  ? [
      { key: 'howtostart', value: 'How to Start' },
      { key: 'application', value: 'Application' },
      { key: 'base-documents', value: 'Base-documents' },
      { key: 'cv-ml-rl', value: 'CV/ML/RL' },
      { key: 'portal-instruction', value: 'Portal-Instruction' },
      { key: 'certification', value: 'Certification' },
      { key: 'uniassist', value: 'Uni-Assist' },
      { key: 'visa', value: 'Visa' },
      { key: 'enrolment', value: 'Enrolment' }
    ]
  : [
      { key: 'howtostart', value: 'How to Start' },
      { key: 'application', value: 'Application' },
      { key: 'base-documents', value: 'Base-documents' },
      { key: 'cv-ml-rl', value: 'CV/ML/RL' },
      { key: 'portal-instruction', value: 'Portal-Instruction' },
      { key: 'certification', value: 'Certification' },
      { key: 'visa', value: 'Visa' },
      { key: 'enrolment', value: 'Enrolment' }
    ];

export const profile_name_list = {
  High_School_Diploma: 'High_School_Diploma',
  High_School_Transcript: 'High_School_Transcript',
  University_Entrance_Examination_GSAT: 'University_Entrance_Examination_GSAT',
  Bachelor_Certificate: 'Bachelor_Certificate',
  Bachelor_Transcript: 'Bachelor_Transcript',
  Englisch_Certificate: 'Englisch_Certificate',
  German_Certificate: 'German_Certificate',
  GRE: 'GRE',
  GMAT: 'GMAT',
  ECTS_Conversion: 'ECTS_Conversion',
  Course_Description: 'Course_Description',
  Internship: 'Internship',
  Employment_Certificate: 'Employment_Certificate',
  Passport: 'Passport',
  Others: 'Others',
  Grading_System: 'Grading_System'
};

export const SINGLE_STUDENT_TABS = {
  applications: 0,
  profile: 1,
  cvmlrl: 2,
  portal: 3,
  uniassist: 4,
  survey: 5,
  courses: 6,
  notes: 7
};

export const SINGLE_STUDENT_REVERSED_TABS = {
  0: 'applications',
  1: 'profile',
  2: 'cvmlrl',
  3: 'portal',
  4: 'uniassist',
  5: 'survey',
  6: 'courses',
  7: 'notes'
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
  { key: 'uniassist-internal', value: 'Uni-Assist Internal' },
  { key: 'others', value: 'Others' }
];

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

export const isInTheFuture = (end) => {
  const now = new Date();
  const date = new Date(end);

  return now < date;
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

export const getDate = (date) => {
  // const userLocale = navigator.language;
  let dat = new Date(date).toLocaleDateString('zh-Hans-CN');

  const currentDate = new Date();
  const input_date_point = new Date(date);
  const today = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const input_date = new Date(
    input_date_point.getFullYear(),
    input_date_point.getMonth(),
    input_date_point.getDate()
  );
  const isToday = today.getTime() === input_date.getTime();
  if (isToday) {
    return `Today`;
  } else {
    return dat;
  }
};

export const getTime = (date) => {
  // const userLocale = navigator.language;
  let time = new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  return `${time}`;
};

export const convertDate = (date) => {
  // const userLocale = navigator.language;
  let dat = new Date(date).toLocaleDateString('zh-Hans-CN');
  let time = new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  const currentDate = new Date();
  const input_date_point = new Date(date);
  const today = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const input_date = new Date(
    input_date_point.getFullYear(),
    input_date_point.getMonth(),
    input_date_point.getDate()
  );
  const isToday = today.getTime() === input_date.getTime();
  if (isToday) {
    return `Today ${time}`;
  } else {
    return dat + ', ' + time;
  }
};
export const program_fields_overview = [
  { name: 'School', prop: 'school' },
  { name: 'Program', prop: 'program_name' },
  { name: 'Degree', prop: 'degree' },
  { name: 'Semester', prop: 'semester' },
  { name: 'Teaching Language', prop: 'lang' },
  { name: 'Website', prop: 'website' }
];

export const program_fields_application_dates = [
  { name: 'Application Start (MM-DD)', prop: 'application_start' },
  { name: 'Application Deadline (MM-DD)', prop: 'application_deadline' }
];

export const program_fields_english_languages_test = [
  { name: 'TOEFL Requirement', prop: 'toefl' },
  { name: 'IELTS Requirement', prop: 'ielts' }
];

export const program_fields_other_test = [
  { name: 'GPA Requirement (German system)', prop: 'gpa_requirement' },
  { name: 'TestDaF Requirement', prop: 'testdaf' },
  { name: 'GRE Requirement', prop: 'gre' },
  { name: 'GMAT Requirement', prop: 'gmat' }
];

export const program_fields_special_documents = [
  { name: 'ML Required?', prop: 'ml_required' },
  { name: 'ML Requirements', prop: 'ml_requirements' },
  { name: 'RL Required?', prop: 'rl_required' },
  { name: 'RL Program specific?', prop: 'is_rl_specific' },
  { name: 'RL Requirements', prop: 'rl_requirements' },
  { name: 'Essay Required?', prop: 'essay_required' },
  { name: 'Essay Requirements', prop: 'essay_requirements' },
  { name: 'Portfolio Required?', prop: 'portfolio_required' },
  { name: 'Portfolio Requirements', prop: 'portfolio_requirements' },
  { name: 'Supplementary Form Required?', prop: 'supplementary_form_required' },
  {
    name: 'Supplementary Form Requirements',
    prop: 'supplementary_form_requirements'
  },
  {
    name: 'Curriculum Analysis Required?',
    prop: 'curriculum_analysis_required'
  },
  {
    name: 'Curriculum Analysis Requirements',
    prop: 'curriculum_analysis_requirements'
  },
  {
    name: 'Scholarship Form / ML Required?',
    prop: 'scholarship_form_required'
  },
  {
    name: 'Scholarship Form / ML Requirements',
    prop: 'scholarship_form_requirements'
  }
];

export const program_fields_special_notes = [
  {
    name: 'ECTS Requirements',
    prop: 'ects_requirements'
  },
  { name: 'Need Uni-Assist?', prop: 'uni_assist' },
  { name: 'Special Notes', prop: 'special_notes' },
  { name: 'Comments', prop: 'comments' }
];

export const program_fields_others = [
  { name: 'Tuition Fees', prop: 'tuition_fees' },
  { name: 'FPSO', prop: 'fpso' }
];

export const ATTRIBUTES = [
  {
    value: 1,
    name: 'Demanding',
    definition:
      'Reply within 3 days, but not necessary providing pdf output. Need extra care only. Expecting quick response.'
  },
  { value: 2, name: 'Parents Pushing', definition: '' },
  {
    value: 3,
    name: 'Urgent',
    definition:
      'In addition to deadline, due to student personal reason, professor required, competitive offer, rolling process or even parents pushing and want to closed asap.'
  },
  { value: 4, name: 'Slow Response', definition: '' },
  { value: 5, name: 'Disappear', definition: '' },
  { value: 6, name: 'Low-IQ', definition: '' },
  { value: 7, name: 'Refunded', definition: '' },
  { value: 8, name: 'Done', definition: '' },
  { value: 9, name: 'Refund-Risk', definition: '' },
  {
    value: 10,
    name: 'English-Risk',
    definition:
      'English not passed yet. Please double check if English is passed and if tasks need to be processed.'
  }
];

export const COLORS = [
  'primary',
  'secondary',
  'secondary',
  'info',
  'error',
  'primary',
  'primary',
  'success',
  'primary'
];

export const program_fields = [
  ...program_fields_overview,
  ...program_fields_application_dates,
  ...program_fields_english_languages_test,
  ...program_fields_other_test,
  ...program_fields_special_documents,
  ...program_fields_special_notes,
  ...program_fields_others
];

export const convertDate_ux_friendly = (date) => {
  let dat = new Date(date).toLocaleDateString('zh-Hans-CN');

  const currentDate = new Date();
  const input_date_point = new Date(date);
  // Calculate the time difference in milliseconds
  const timeDiff = Math.abs(currentDate - input_date_point);

  // Convert milliseconds to minutes, hours, days, and weeks
  const minutes = Math.floor(timeDiff / (1000 * 60));
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);

  let timeDisplay;
  if (minutes < 60) {
    timeDisplay = `${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else if (hours < 24) {
    timeDisplay = `${hours} hour${hours > 1 ? 's' : ''}`;
  } else if (days < 7) {
    timeDisplay = `${days} day${days > 1 ? 's' : ''}`;
  } else if (weeks < 4) {
    timeDisplay = `${weeks} week${weeks > 1 ? 's' : ''}`;
  } else {
    timeDisplay = `${dat}`;
  }
  return timeDisplay;
};

const create_years = (start_year, end_year) => {
  const num = end_year - start_year;
  const year_array = Array.from({ length: num }, (_, i) => i + start_year);
  return year_array;
};

export const isProgramValid = (program) => {
  const pattern = /^(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
  if (
    !program.application_deadline?.toLowerCase()?.includes('rolling') &&
    !pattern.test(program.application_deadline)
  ) {
    return false;
  }
  if (
    program.school &&
    program.program_name &&
    program.degree &&
    program.lang &&
    program.semester &&
    program.country
  ) {
    return true;
  } else {
    return false;
  }
};

export const showFieldAlert = (program) => {
  if (!program.school) {
    alert('Please fill School name completely');
    return;
  }
  if (!program.program_name) {
    alert('Please fill Program name completely');
    return;
  }
  if (!program.degree) {
    alert('Please fill Degree completely');
    return;
  }
  if (!program.lang) {
    alert('Please fill Teaching Language completely');
    return;
  }
  if (!program.semester) {
    alert('Please fill Semester completely');
    return;
  }
  if (!program.country) {
    alert('Please fill Country completely');
    return;
  }
  const pattern = /^(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
  if (
    !program.application_deadline?.toLowerCase()?.includes('rolling') &&
    !pattern.test(program.application_deadline)
  ) {
    alert(
      'Please fill the application deadline correctly: Format: MM-DD or Rolling'
    );
    return;
  }
};

export const YES_NO_BOOLEAN_OPTIONS = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' }
];

export const DEGREE_CATOGARY_ARRAY_OPTIONS = [
  { value: '', label: 'Please Select' },
  { value: 'Bachelor', label: 'Bachelor' },
  { value: 'B. A.', label: 'Bachelor of Art' },
  { value: 'B. Eng.', label: 'Bachelor of Engineering' },
  { value: 'B. Sc.', label: 'Bachelor of Science' },
  { value: 'Master', label: 'Master' },
  { value: 'M. A.', label: 'Master of Art' },
  { value: 'M. Eng.', label: 'Master of Engineering' },
  { value: 'M. Sc.', label: 'Master of Science' },
  { value: 'M. Res.', label: 'Master of Reserach' },
  { value: 'MBA', label: 'MBA' }
];

export const LANGUAGES_ARRAY_OPTIONS = [
  { value: '-', label: '-' },
  { value: 'English', label: 'English' },
  { value: 'German', label: 'German' },
  { value: 'German-and-English', label: 'German-AND-English' },
  { value: 'German-or-English', label: 'German-OR-English' }
];

export const UNI_ASSIST_ARRAY_OPTIONS = [
  { value: 'No', label: 'No' },
  { value: 'Yes-VPD', label: 'Yes-VPD' },
  { value: 'Yes-FULL', label: 'Yes-Full' }
];

export const DEGREE_OPTIONS = () => {
  return (
    <>
      <option value="">Please Select</option>
      <option value="B. A.">Bachelor of Art</option>
      <option value="B. Eng.">Bachelor of Engineering</option>
      <option value="B. Sc.">Bachelor of Science</option>
      <option value="M. A.">Master of Art</option>
      <option value="M. Eng.">Master of Engineering</option>
      <option value="M. Sc.">Master of Science</option>
      <option value="M. Res.">Master of Reserach</option>
      <option value="MBA">MBA</option>
    </>
  );
};

export const LANGUAGES_OPTIONS = () => {
  return (
    <>
      <option value="-">-</option>
      <option value="English">English</option>
      <option value="German">German</option>
      <option value="German-and-English">German-AND-English</option>
      <option value="German-or-English">German-OR-English</option>
    </>
  );
};

export const COUNTRIES_MAPPING = {
  at: 'Austria',
  au: 'Australia',
  be: 'Belgium',
  ca: 'Canada',
  cz: 'Czech',
  dk: 'Danmark',
  fi: 'Finland',
  fr: 'France',
  de: 'Germany',
  gr: 'Greece',
  hk: 'Hong Kong',
  hu: 'Hungary',
  ie: 'Ireland',
  it: 'Italy',
  jp: 'Japan',
  kr: 'South Korea',
  lv: 'Latvia',
  lt: 'Lithuania',
  lu: 'Luxembourg',
  nl: 'Netherlands',
  nz: 'New Zealand',
  no: 'Norway',
  pl: 'Poland',
  pt: 'Portugal',
  ru: 'Russia',
  sg: 'Singapore',
  es: 'Spain',
  se: 'Sweden',
  ch: 'Switzerland',
  uk: 'United Kingdom',
  us: 'United States'
};

export const COUNTRIES_ARRAY_OPTIONS = [
  { value: '-', label: '-' },
  { value: 'at', label: 'Austria' },
  { value: 'au', label: 'Australia' },
  { value: 'be', label: 'Belgium' },
  { value: 'ca', label: 'Canada' },
  { value: 'cz', label: 'Czech' },
  { value: 'dk', label: 'Danmark' },
  { value: 'fi', label: 'Finland' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'eu', label: 'EU (Various Locations)' },
  { value: 'gr', label: 'Greece' },
  { value: 'hk', label: 'Hong Kong' },
  { value: 'hu', label: 'Hungary' },
  { value: 'ie', label: 'Ireland' },
  { value: 'it', label: 'Italy' },
  { value: 'jp', label: 'Japan' },
  { value: 'kr', label: 'South Korea' },
  { value: 'lv', label: 'Latvia' },
  { value: 'lt', label: 'Lithuania' },
  { value: 'lu', label: 'Luxembourg' },
  { value: 'nl', label: 'Netherlands' },
  { value: 'nz', label: 'New Zealand' },
  { value: 'no', label: 'Norway' },
  { value: 'pl', label: 'Poland' },
  { value: 'pt', label: 'Portugal' },
  { value: 'ru', label: 'Russia' },
  { value: 'sg', label: 'Singapore' },
  { value: 'es', label: 'Spain' },
  { value: 'se', label: 'Sweden' },
  { value: 'ch', label: 'Switzerland' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'us', label: 'United States' }
];

() => {
  return (
    <>
      <option value="-">-</option>
      <option value="at">Austria</option>
      <option value="au">Australia</option>
      <option value="be">Belgium</option>
      <option value="ca">Canada</option>
      <option value="cz">Czech</option>
      <option value="dk">Danmark</option>
      <option value="fi">Finland</option>
      <option value="fr">France</option>
      <option value="de">Germany</option>
      <option value="gr">Greece</option>
      <option value="hk">Hong Kong</option>
      <option value="hu">Hungary</option>
      <option value="ie">Ireland</option>
      <option value="it">Italy</option>
      <option value="jp">Japan</option>
      <option value="kr">South Korea</option>
      <option value="lv">Latvia</option>
      <option value="lt">Lithuania</option>
      <option value="lu">Luxembourg</option>
      <option value="nl">Netherlands</option>
      <option value="nz">New Zealand</option>
      <option value="no">Norway</option>
      <option value="pl">Poland</option>
      <option value="pt">Portugal</option>
      <option value="ru">Russia</option>
      <option value="sg">Singapore</option>
      <option value="es">Spain</option>
      <option value="se">Sweden</option>
      <option value="ch">Switzerland</option>
      <option value="uk">United Kingdom</option>
      <option value="us">United States</option>
    </>
  );
};

export const COUNTRIES_OPTIONS = () => {
  return (
    <>
      <option value="-">-</option>
      <option value="at">Austria</option>
      <option value="au">Australia</option>
      <option value="be">Belgium</option>
      <option value="ca">Canada</option>
      <option value="cz">Czech</option>
      <option value="dk">Danmark</option>
      <option value="fi">Finland</option>
      <option value="fr">France</option>
      <option value="de">Germany</option>
      <option value="gr">Greece</option>
      <option value="hk">Hong Kong</option>
      <option value="hu">Hungary</option>
      <option value="ie">Ireland</option>
      <option value="it">Italy</option>
      <option value="jp">Japan</option>
      <option value="kr">South Korea</option>
      <option value="lv">Latvia</option>
      <option value="lt">Lithuania</option>
      <option value="lu">Luxembourg</option>
      <option value="nl">Netherlands</option>
      <option value="nz">New Zealand</option>
      <option value="no">Norway</option>
      <option value="pl">Poland</option>
      <option value="pt">Portugal</option>
      <option value="ru">Russia</option>
      <option value="sg">Singapore</option>
      <option value="es">Spain</option>
      <option value="se">Sweden</option>
      <option value="ch">Switzerland</option>
      <option value="uk">United Kingdom</option>
      <option value="us">United States</option>
    </>
  );
};

export const SEMESTER_OPTIONS = () => {
  return (
    <>
      <option value="">Please Select</option>
      <option value="WS">Winter Semester</option>
      <option value="SS">Summer Semester</option>
    </>
  );
};

export const BINARY_STATE_OPTIONS = () => {
  return (
    <>
      <option value="no">no</option>
      <option value="yes">yes</option>
    </>
  );
};

export const BINARY_STATE_ARRAY_OPTIONS = [
  { value: 'no', label: 'no' },
  { value: 'yes', label: 'yes' }
];

export const BACHELOR_GRADUATE_STATUS_OPTIONS = [
  { value: '-', label: '-' },
  { value: 'Yes', label: 'Yes 已畢業' },
  { value: 'No', label: 'No 未開始就讀' },
  { value: 'pending', label: 'Not finished yet 就讀中，尚未畢業' }
];

export const DUAL_STATE_OPTIONS = [
  { value: '-', label: '-' },
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' }
];

export const HIG_SCHOOL_TRI_STATE_OPTIONS = [
  { value: '-', label: '-' },
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
  { value: 'pending', label: 'In progress' }
];

export const TRI_STATE_OPTIONS = [
  { value: '-', label: '-' },
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
  { value: 'NotSure', label: 'Not Sure' }
];

export const IS_SUBMITTED_STATE_OPTIONS = [
  { value: '-', label: '-' },
  { value: 'O', label: 'Yes' },
  { value: 'X', label: 'No ' }
];

export const IS_OFFERED_STATE_OPTIONS = [
  { value: '-', label: '-' },
  { value: 'O', label: 'Yes' },
  { value: 'X', label: 'No ' }
];

export const IS_PASSED_OPTIONS = [
  { value: '-', label: '-' },
  { value: 'O', label: 'Yes (Provide Test Score)' },
  { value: 'X', label: 'No (Provide Test Date)' },
  { value: '--', label: 'Not Needed' }
];

export const ENGLISH_CERTIFICATE_ARRAY_OPTIONS = [
  { value: '', label: 'Please Select' },
  { value: 'TOEFL', label: 'TOEFL iBT (現場考)' },
  { value: 'IELTS', label: 'IELTS Academy (現場考)' },
  { value: 'Duolingo', label: 'Duolingo (極少數承認)' },
  { value: 'Native', label: 'English Native 母語' },
  { value: 'Others', label: '其餘考試不適用' }
];

export const ENGLISH_CERTIFICATE_OPTIONS = () => {
  return (
    <>
      <option value="">Please Select</option>
      <option value="TOEFL">TOEFL iBT (現場考)</option>
      <option value="IELTS">IELTS Academy (現場考)</option>
      <option value="Duolingo">Duolingo (極少數承認)</option>
      <option value="Native">English Native 母語</option>
      <option value="Others" disabled>
        其餘考試不適用
      </option>
    </>
  );
};

export const GERMAN_CERTIFICATE_ARRAY_OPTIONS = [
  { value: 'No', label: 'No' },
  { value: 'Goethe Zertifikat A2', label: 'Goethe Zertifikat A2' },
  { value: 'Goethe Zertifikat B1', label: 'Goethe Zertifikat B1' },
  { value: 'Goethe Zertifikat B2', label: 'Goethe Zertifikat B2' },
  { value: 'Goethe Zertifikat C1', label: 'Goethe Zertifikat C1' },
  { value: 'TestDaF', label: 'TestDaF' },
  { value: 'Telc', label: 'Telc' },
  { value: 'DSH', label: 'DSH' },
  { value: 'Native', label: 'Native' },
  {
    value: 'OTHERS',
    label: '其餘德語不適用。報名考試前請和顧問諮詢',
    disabled: true
  }
];

export const GERMAN_CERTIFICATE_OPTIONS = () => {
  return (
    <>
      <option value="No">No</option>
      <option value="Goethe Zertifikat A2">Goethe Zertifikat A2</option>
      <option value="Goethe Zertifikat B1">Goethe Zertifikat B1</option>
      <option value="Goethe Zertifikat B2">Goethe Zertifikat B2</option>
      <option value="Goethe Zertifikat C1">Goethe Zertifikat C1</option>
      <option value="TestDaF">TestDaF</option>
      <option value="Telc">Telc</option>
      <option value="DSH">DSH</option>
      <option value="Native">German Native 母語</option>
      <option value="OTHERS" disabled>
        其餘德語不適用。報名考試前請和顧問諮詢
      </option>
    </>
  );
};

export const GRE_CERTIFICATE_ARRAY_OPTIONS = [
  { value: '', label: 'Please Select' },
  { value: 'GRE_GENERAL', label: 'GRE General Test' },
  { value: 'GRE_SUBJECT', label: 'GRE Subject Test' },
  { value: 'GRE_OTHERS', label: 'GRE Other Test', disabled: true }
];

export const GRE_CERTIFICATE_OPTIONS = () => {
  return (
    <>
      <option value="">Please Select</option>
      <option value="GRE_GENERAL">GRE General Test</option>
      <option value="GRE_SUBJECT">GRE Subject Test</option>
      <option value="GRE_OTHERS" disabled>
        GRE Online 不再適用。報名考試前請和顧問諮詢
      </option>
    </>
  );
};

export const GMAT_CERTIFICATE_OPTIONS = [
  { value: '', label: 'Please Select' },
  { value: 'GMAT_GENERAL', label: 'GMAT Physical Test' },
  { value: 'GMAT_FOCUS', label: 'GMAT Focus Test' },
  {
    value: 'GMAT_SUBJECT',
    label: 'GMAT Online 不再適用。報名考試前請和顧問諮詢',
    disabled: true
  }
];

export const APPLICATION_YEARS_FUTURE = () => {
  return create_years(1990, 2050).map((year) => ({
    value: year,
    label: year
  }));
};

export const EXPECTATION_APPLICATION_YEARS = () => {
  return create_years(2018, 2050).map((year) => ({
    value: year,
    label: year
  }));
};

export const SEMESTER_ARRAY_OPTIONS = [
  { value: '', label: 'Please Select' },
  { value: 'WS', label: 'Winter Semester (Semester begins on October)' },
  { value: 'SS', label: 'Summer Semester (Semester begins on April)' }
];

export const DEGREE_ARRAY_OPTIONS = [
  { value: '', label: 'Please Select' },
  { value: 'Bachelor', label: 'Bachelor' },
  { value: 'Master', label: 'Master' },
  { value: 'BachelorMaster', label: 'BachelorMaster' }
];

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

export const is_my_fav_message_status = (user, thread) => {
  return thread.flag_by_user_id?.includes(user._id.toString());
};

export const DELETE_STYLE = 'danger';
export const REJECT_STYLE = 'secondary';
export const ACCEPT_STYLE = 'success';

export const is_pending_status = (user, thread) => {
  return !is_new_message_status(user, thread);
};

export const documentation_categories = appConfig.vpdEnable
  ? {
      howtostart: `How to Start ${appConfig.companyName} Portal`,
      'base-documents': 'Base Documents',
      'cv-ml-rl': 'CV/ML/RL',
      application: 'Application Instruction',
      'portal-instruction': 'Portal Instruction',
      certification: 'Certification Instruction',
      uniassist: 'Uni-Assist Instruction',
      visa: 'Visa Instruction',
      enrolment: 'Enrolment Instruction'
    }
  : {
      howtostart: `How to Start ${appConfig.companyName} Portal`,
      'base-documents': 'Base Documents',
      'cv-ml-rl': 'CV/ML/RL',
      application: 'Application Instruction',
      'portal-instruction': 'Portal Instruction',
      certification: 'Certification Instruction',
      visa: 'Visa Instruction',
      enrolment: 'Enrolment Instruction'
    };

export const Role = {
  Admin: 'Admin',
  Manager: 'Manager',
  Guest: 'Guest',
  Agent: 'Agent',
  Editor: 'Editor',
  Student: 'Student'
};

export const internal_documentation_categories = {
  agents: 'Agents',
  editors: 'Editors',
  admin: 'Admin',
  'base-documents-internal': 'Base Documents Internal',
  'uniassist-internal': 'Uni-Assist Internal',
  others: 'Others'
};

export const statuses = {
  uploaded: 'uploaded',
  accepted: 'accepted',
  rejected: 'rejected',
  missing: 'missing',
  notneeded: 'notneeded'
};

export const studentOverviewTableHeader = [
  'Target Year',
  'First-/Lastname,Birthday',
  'Agent',
  'Editor',
  'Graduated',
  'Program Selection',
  'Applications',
  'Next Program to apply',
  'Next Program deadline',
  'Days left',
  'Next Program status',
  'Survey',
  'Base Documents',
  'Language',
  'Course Analysis',
  'CV',
  'ML',
  'RL',
  'Essay',
  'Portals',
  'Uni-Assist',
  'open/offer/reject'
];

export const c1 = [
  {
    field: 'firstname_lastname',
    headerName: 'First-, Last Name',
    align: 'left',
    headerAlign: 'left',
    width: 150,
    renderCell: (params) => {
      const linkUrl = `${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
        params.row.student_id,
        DEMO.PROFILE_HASH
      )}`;
      return (
        <Link
          underline="hover"
          to={linkUrl}
          component={LinkDom}
          target="_blank"
          title={params.value}
        >
          {params.value}
        </Link>
      );
    }
  },
  {
    field: 'editors',
    headerName: 'Editors / Writer',
    align: 'left',
    headerAlign: 'left',
    minWidth: 150,
    renderCell: (params) => {
      return params.row.file_type === 'Essay'
        ? params.row.outsourced_user_id?.map((outsourcer) => (
            <Link
              underline="hover"
              to={DEMO.TEAM_EDITOR_LINK(outsourcer._id.toString())}
              component={LinkDom}
              target="_blank"
              title={outsourcer.firstname}
              key={`${outsourcer._id.toString()}`}
            >
              {`${outsourcer.firstname} `}
            </Link>
          )) || []
        : params.value?.map((editor) => (
            <Link
              underline="hover"
              to={DEMO.TEAM_EDITOR_LINK(editor._id.toString())}
              component={LinkDom}
              target="_blank"
              title={editor.firstname}
              key={`${editor._id.toString()}`}
            >
              {`${editor.firstname} `}
            </Link>
          ));
    }
  },
  {
    field: 'deadline',
    headerName: 'Deadline',
    minWidth: 100
  },
  {
    field: 'days_left',
    headerName: 'Days left',
    minWidth: 80
  },
  {
    field: 'document_name',
    headerName: 'Document name',
    minWidth: 380,
    renderCell: (params) => {
      const linkUrl = `${DEMO.DOCUMENT_MODIFICATION_LINK(
        params.row.thread_id
      )}`;
      return (
        <>
          {params.row?.attributes?.map(
            (attribute) =>
              [1, 3, 9, 10].includes(attribute.value) && (
                <Tooltip
                  title={`${attribute.name}: ${
                    ATTRIBUTES[attribute.value - 1].definition
                  }`}
                  key={attribute._id}
                >
                  <Chip
                    size="small"
                    label={attribute.name[0]}
                    color={COLORS[attribute.value]}
                  />
                </Tooltip>
              )
          )}
          <Link
            underline="hover"
            to={linkUrl}
            component={LinkDom}
            target="_blank"
            title={params.value}
          >
            {params.value}
          </Link>
        </>
      );
    }
  },
  {
    field: 'aged_days',
    headerName: 'Aged days',
    minWidth: 80
  },
  {
    field: 'number_input_from_editors',
    headerName: 'Editor Feedback (#Messages/#Files)',
    minWidth: 80
  },
  {
    field: 'number_input_from_student',
    headerName: 'Student Feedback (#Messages/#Files)',
    minWidth: 80
  },
  {
    field: 'latest_reply',
    headerName: 'Latest Reply',
    minWidth: 100
  },
  {
    field: 'updatedAt',
    headerName: 'Last Update',
    minWidth: 100
  }
];

export const essay_dashboard_table_column = [
  {
    field: 'firstname_lastname',
    headerName: 'First-, Last Name',
    align: 'left',
    headerAlign: 'left',
    width: 150,
    renderCell: (params) => {
      const linkUrl = `${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
        params.row.student_id,
        DEMO.PROFILE_HASH
      )}`;
      return (
        <Link
          underline="hover"
          to={linkUrl}
          component={LinkDom}
          target="_blank"
          title={params.value}
        >
          {params.value}
        </Link>
      );
    }
  },
  {
    field: 'outsourced_user_id',
    headerName: 'Essay Writer',
    align: 'left',
    headerAlign: 'left',
    minWidth: 120,
    renderCell: (params) => {
      return (
        params.row.outsourced_user_id?.map((outsourcer) => (
          <Link
            underline="hover"
            to={DEMO.TEAM_EDITOR_LINK(outsourcer._id.toString())}
            component={LinkDom}
            target="_blank"
            title={outsourcer.firstname}
            key={`${outsourcer._id.toString()}`}
          >
            {`${outsourcer.firstname} `}
          </Link>
        )) || []
      );
    }
  },
  {
    field: 'editors',
    headerName: 'Editors',
    align: 'left',
    headerAlign: 'left',
    minWidth: 120,
    renderCell: (params) => {
      return params.row.editors?.map((editor) => (
        <Link
          underline="hover"
          to={DEMO.TEAM_EDITOR_LINK(editor._id.toString())}
          component={LinkDom}
          target="_blank"
          title={editor.firstname}
          key={`${editor._id.toString()}`}
        >
          {`${editor.firstname} `}
        </Link>
      ));
    }
  },
  {
    field: 'deadline',
    headerName: 'Deadline',
    minWidth: 100
  },
  {
    field: 'days_left',
    headerName: 'Days left',
    minWidth: 80
  },
  {
    field: 'document_name',
    headerName: 'Document name',
    minWidth: 380,
    renderCell: (params) => {
      const linkUrl = `${DEMO.DOCUMENT_MODIFICATION_LINK(
        params.row.thread_id
      )}`;
      return (
        <>
          {params.row?.attributes?.map(
            (attribute) =>
              [1, 3, 9, 10].includes(attribute.value) && (
                <Tooltip
                  title={`${attribute.name}: ${
                    ATTRIBUTES[attribute.value - 1].definition
                  }`}
                  key={attribute._id}
                >
                  <Chip
                    size="small"
                    label={attribute.name[0]}
                    color={COLORS[attribute.value]}
                  />
                </Tooltip>
              )
          )}
          <Link
            underline="hover"
            to={linkUrl}
            component={LinkDom}
            target="_blank"
            title={params.value}
          >
            {params.value}
          </Link>
        </>
      );
    }
  },
  {
    field: 'aged_days',
    headerName: 'Aged days',
    minWidth: 80
  },
  {
    field: 'number_input_from_editors',
    headerName: 'Editor Feedback (#Messages/#Files)',
    minWidth: 80
  },
  {
    field: 'number_input_from_student',
    headerName: 'Student Feedback (#Messages/#Files)',
    minWidth: 80
  },
  {
    field: 'latest_reply',
    headerName: 'Latest Reply',
    minWidth: 100
  },
  {
    field: 'updatedAt',
    headerName: 'Last Update',
    minWidth: 100
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
  GRE: { name: 'GRE', link: '' },
  GMAT: { name: 'GMAT', link: '' },
  ECTS_Conversion: { name: 'ECTS Conversion', link: '' },
  Course_Description: { name: 'Course Description', link: '' },
  Internship: { name: 'Internship Certificate', link: '' },
  Employment_Certificate: { name: 'Employment Certificate', link: '' },
  Exchange_Student_Certificate: {
    name: 'Exchange Student Certificate',
    link: ''
  },
  Passport_Photo: { name: 'Formal Profile Photo', link: '' },
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
  GRE: 'GRE',
  GMAT: 'GMAT',
  ECTS_Conversion: 'ECTS Conversion',
  Course_Description: 'Course Description',
  Internship: 'Internship Certificate',
  Employment_Certificate: 'Employment Certificate',
  Exchange_Student_Certificate: 'Exchange Student Certificate',
  Passport_Photo: 'Formal Profile Photo',
  Passport: 'Passport Copy',
  Others: 'Others'
};

export const base_documents_checklist = {
  High_School_Diploma: ['English version ?', 'School Stamp or signature'],
  High_School_Transcript: ['English version ?', 'Grading system existed ?'],
  University_Entrance_Examination_GSAT: ['English version ?'],
  Bachelor_Certificate: [
    'English version ?',
    '若尚未最終版(畢業證書)，請標記註冊證明為 Reject，並提醒每學期更新'
  ],
  Bachelor_Transcript: [
    'Grading system existed ?',
    'GPA (1.7-4.3 system) and not 100-60 system ?',
    'Date of referral ? (if graduated)',
    '若尚未最終版(with Date of referral)，請標記此成績單為 Reject，並提醒每學期更新',
    'For Bachelor application: 34 credits must be achieved (if applicable)'
  ],
  Englisch_Certificate: ['Not expired ?'],
  German_Certificate: ['Not expired ?'],
  GRE: ['Not expired ?'],
  GMAT: ['Not expired ?'],
  ECTS_Conversion: [],
  Course_Description: [
    'Degree correctness (Ex: Engineering with B.Sc. not B.A.)?',
    'All in English?'
  ],
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
  Others: ['All certificates in English ?']
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
    name: 'Internship Certificate Example (實習證明模板)',
    prop: 'Internship_Certificate_Example',
    alias: 'Internship'
  },
  {
    name: 'Employment Certificate Example (工作證明範本)',
    prop: 'Employment_Template',
    alias: 'Employment'
  },
  {
    name: 'Module Description Example (課程描述範本)',
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

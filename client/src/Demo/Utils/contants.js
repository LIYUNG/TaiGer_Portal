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
  { key: 'ee', value: 'Eletrical/Electronics Engineering' },
  { key: 'cs', value: 'Computer Science' },
  { key: 'mgm', value: 'Business/Management' },
  { key: 'dsbi', value: 'Data Science/Business Intelligence' },
  { key: 'me', value: 'Mechanical Engineering' },
  { key: 'mtl', value: 'Materials Science' }
  // { key: 'visa', value: 'Visa' }
];

export const valid_categories = [
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
  let dat = new Date(date).toLocaleDateString();
  let time = new Date(date).toLocaleTimeString();
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
      {create_years(2022, 2050).map((year, idx) => (
        <option key={idx} value={year}>
          {year}
        </option>
      ))}
    </>
  );
};

export const return_thread_status = (user, thread) => {
  if (thread.isFinalVersion) {
    return (
      <td className="mb-1 text-info">
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
        <td className="mb-1 text-info">
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
      <td className="mb-1 text-info">
        <AiFillQuestionCircle
          size={24}
          color="lightgray"
          title="Waiting feedback"
        />
      </td>
    );
  } else {
    return (
      <td className="mb-1 text-info">
        <BiCommentDots size={24} color="red" title="New Message" />
      </td>
    );
  }
};

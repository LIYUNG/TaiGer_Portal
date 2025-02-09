import React from 'react';
import { DateTime, IANAZone } from 'luxon';
import moment from 'moment-timezone';
import { styled, alpha } from '@mui/material/styles';
import { Box, InputBase, Typography, Link, Tooltip, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import BugReportIcon from '@mui/icons-material/BugReport';
import WarningIcon from '@mui/icons-material/Warning';
import HelpIcon from '@mui/icons-material/Help';
import RemoveIcon from '@mui/icons-material/Remove';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import { PROGRAM_SUBJECTS, SCHOOL_TAGS } from '@taiger-common/core';
import {
    green,
    red,
    grey,
    orange,
    indigo,
    teal,
    blueGrey,
    cyan
} from '@mui/material/colors';
import { Link as LinkDom } from 'react-router-dom';
import { appConfig } from '../config';
import DEMO from '../store/constant';
import { is_TaiGer_Student } from '@taiger-common/core';
import i18next from 'i18next';

export const IS_DEV =
    !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

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

export const menuWidth = 340;
export const EmbeddedChatListWidth = 290;

export const CVMLRL_DOC_PRECHECK_STATUS_E = {
    OK_SYMBOL: (
        <CheckCircleIcon
            size={18}
            style={{ color: green[500] }}
            title="Decided"
        />
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
        <CheckCircleIcon
            size={18}
            style={{ color: green[500] }}
            title="Decided"
        />
    ),
    NOT_OK_SYMBOL: (
        <CancelIcon size={18} style={{ color: red[700] }} title="Decided No" />
    ),
    UNKNOWN_SYMBOL: (
        <HelpIcon size={18} style={{ color: grey[400] }} title="Not sure" />
    )
};

export const INTERVIEW_STATUS_E = {
    SCHEDULED_SYMBOL: (
        <CheckCircleIcon
            size={18}
            style={{ color: green[500] }}
            title="Scheduled"
        />
    ),
    DELETED_SUCCESS_SYMBOL: (
        <CheckCircleIcon
            size={18}
            style={{ color: green[500] }}
            title="Success"
        />
    ),
    UNSCHEDULED_SYMBOL: (
        <HelpIcon size={18} style={{ color: grey[400] }} title="Unscheduled" />
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
        <CheckCircleIcon
            size={18}
            style={{ color: green[500] }}
            title="Admitted"
        />
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
        fontSize="small"
        style={{ color: green[500] }}
        title="Valid Document"
    />
);
export const FILE_NOT_OK_SYMBOL = (
    <CancelIcon
        fontSize="small"
        style={{ color: red[700] }}
        title="Invalid Document"
    />
);
export const FILE_UPLOADED_SYMBOL = (
    <QueryBuilderIcon
        fontSize="small"
        style={{ color: orange[400] }}
        title="Uploaded successfully"
    />
);
export const FILE_MISSING_SYMBOL = (
    <HelpIcon
        fontSize="small"
        style={{ color: grey[400] }}
        title="No Document uploaded"
    />
);
export const FILE_DONT_CARE_SYMBOL = (
    <RemoveIcon
        fontSize="small"
        style={{ color: grey[400] }}
        title="Not needed"
    />
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
                    COUNTRIES_MAPPING[thread?.program_id?.country] ||
                    'this country'
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
            {FILE_NOT_OK_SYMBOL}: The document is invalid and cannot be used in
            the application. Please properly scan a new one.
        </Typography>
        <Typography>
            {FILE_UPLOADED_SYMBOL}: The document is uploaded. Your agent will
            check it as soon as possible.
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

export const showTimezoneOffset = () => {
    return getTimezoneOffset(
        Intl.DateTimeFormat().resolvedOptions().timeZone
    ) >= 0
        ? `+${getTimezoneOffset(Intl.DateTimeFormat().resolvedOptions().timeZone)}`
        : getTimezoneOffset(Intl.DateTimeFormat().resolvedOptions().timeZone);
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
    const nextOccurrence = now.plus({
        days: daysToAdd + nextN * 7 + bufferDays
    });

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

const commonCategories = [
    { key: 'howtostart', value: 'How to Start' },
    { key: 'application', value: 'Application' },
    { key: 'base-documents', value: 'Base-documents' },
    { key: 'cv-ml-rl', value: 'CV/ML/RL' },
    { key: 'portal-instruction', value: 'Portal-Instruction' },
    { key: 'certification', value: 'Certification' },
    { key: 'visa', value: 'Visa' },
    { key: 'enrolment', value: 'Enrolment' },
    { key: 'scholarship', value: 'Scholarship' }
];

const vpdCategory = { key: 'uniassist', value: 'Uni-Assist' };

export const valid_categories = appConfig.vpdEnable
    ? [...commonCategories, vpdCategory]
    : commonCategories;

export const INTERNAL_DASHBOARD_TABS = {
    overview: 0,
    agents: 1,
    kpi: 2,
    programList: 3,
    responseTime: 4
};

export const INTERNAL_DASHBOARD_REVERSED_TABS = {
    0: 'overview',
    1: 'agents',
    2: 'kpi',
    3: 'programList',
    4: 'responseTime'
};

export const THREADS_TABLE_TABS = {
    ['to-do']: 0,
    favorite: 1,
    ['follow-up']: 2,
    ['no-action']: 3,
    closed: 4
};

export const THREADS_TABLE_REVERSED_TABS = {
    0: 'to-do',
    1: 'favorite',
    2: 'follow-up',
    3: 'no-action',
    4: 'closed'
};

export const THREAD_TABS = {
    communication: 0,
    audit: 1
};

export const THREAD_REVERSED_TABS = {
    0: 'communication',
    1: 'audit'
};

export const SINGLE_STUDENT_TABS = {
    applications: 0,
    profile: 1,
    cvmlrl: 2,
    portal: 3,
    uniassist: 4,
    survey: 5,
    courses: 6,
    notes: 7,
    audit: 8
};

export const SINGLE_STUDENT_REVERSED_TABS = {
    0: 'applications',
    1: 'profile',
    2: 'cvmlrl',
    3: 'portal',
    4: 'uniassist',
    5: 'survey',
    6: 'courses',
    7: 'notes',
    8: 'audit'
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

const getBrightness = (hexColor) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    // Brightness formula
    return (r * 299 + g * 587 + b * 114) / 1000;
};

export const stringAvatar = (name) => {
    const backgroundColor = stringToColor(name);

    const textColor =
        getBrightness(backgroundColor) < 128 ? '#FFFFFF' : '#000000'; // Determine contrasting text color

    return {
        sx: {
            bgcolor: backgroundColor,
            color: textColor
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
    };
};

export const isInTheFuture = (end) => {
    const now = new Date();
    const date = new Date(end);

    return now < date;
};

export const twoYearsInDays = 730; // days

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
    { name: 'Website', prop: 'website' },
    {
        name: 'Only for graduated applicant',
        prop: 'allowOnlyGraduatedApplicant'
    },
    { name: 'Program Subject tags', prop: 'programSubjects' },
    { name: 'Tags', prop: 'tags' }
];

export const english_test_hand_after = [
    { name: 'English Test Can Submit Later', prop: 'englishTestHandLater' }
];

export const german_test_hand_after = [
    { name: 'German Test Can Submit Later', prop: 'germanTestHandLater' }
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
    { name: 'TestDaF Requirement', prop: 'testdaf' },
    { name: 'GRE Requirement', prop: 'gre' },
    { name: 'GMAT Requirement', prop: 'gmat' },
    { name: 'GPA Requirement (German system)', prop: 'gpa_requirement' }
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
    {
        name: 'Supplementary Form Required?',
        prop: 'supplementary_form_required'
    },
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
    { value: 7, name: 'Refunding', definition: '' },
    { value: 8, name: 'Done', definition: '' },
    { value: 9, name: 'Refund-Risk', definition: '' },
    {
        value: 10,
        name: 'English-Risk',
        definition:
            'English not passed yet. Please double check if English is passed and if tasks need to be processed.'
    },
    {
        value: 11,
        name: 'German-Risk',
        definition:
            'German not passed yet. Please double check if German is passed and if tasks need to be processed.'
    }
];

export const PROGRAM_ANALYSIS_ATTRIBUTES = [
    {
        value: 'ee',
        name: 'Electrical Engineering'
    },
    { value: 'cs', name: 'Computer Science' },

    {
        value: 'mgm',
        name: 'Management'
    },
    {
        value: 'phy',
        name: 'Physics'
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
    ...english_test_hand_after,
    ...program_fields_english_languages_test,
    ...german_test_hand_after,
    ...program_fields_other_test,
    ...program_fields_special_documents,
    ...program_fields_special_notes,
    ...program_fields_others
];

export const programField2Label = program_fields.reduce((acc, field) => {
    acc[field.prop] = field.name;
    return acc;
}, {});

export const programFieldOrder = program_fields.map((field) => field.prop);

export const sortProgramFields = (a, b) => {
    const indexA = programFieldOrder.indexOf(a);
    const indexB = programFieldOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return 0; // Both are not in `order` = equal
    if (indexA === -1) return 1; // `a` is not in `order`, place it later
    if (indexB === -1) return -1; // `b` is not in `order`, place it later
    return indexA - indexB;
};

export const convertDateUXFriendly = (date) => {
    // let dat = new Date(date).toLocaleDateString('zh-Hans-CN');

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
    if (!date) {
        return '-';
    }
    if (minutes < 60) {
        timeDisplay = i18next.t('timeMinutes', { ns: 'common', minutes });
    } else if (hours < 24) {
        timeDisplay = i18next.t('timeHours', { ns: 'common', hours });
    } else if (days < 7) {
        timeDisplay = i18next.t('timeDays', { ns: 'common', days });
    } else {
        timeDisplay = i18next.t('timeWeeks', { ns: 'common', weeks });
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
    { value: '-', label: 'Please Select' },
    { value: 'Bachelor', label: 'Bachelor' },
    { value: 'B. A.', label: 'Bachelor of Art' },
    { value: 'B. Eng.', label: 'Bachelor of Engineering' },
    { value: 'B. Sc.', label: 'Bachelor of Science' },
    { value: 'Master', label: 'Master' },
    { value: 'M. A.', label: 'Master of Art' },
    { value: 'M. Eng.', label: 'Master of Engineering' },
    { value: 'M. Sc.', label: 'Master of Science' },
    { value: 'M. Res.', label: 'Master of Reserach' },
    { value: 'MPhil.', label: 'Master of Philosophy' },
    { value: 'MBA', label: 'MBA' },
    { value: 'PhD', label: 'PhD' }
];

export const LANGUAGES_ARRAY_OPTIONS = [
    { value: '-', label: 'Please Select' },
    { value: 'English', label: 'English' },
    { value: 'German', label: 'German' },
    { value: 'German-and-English', label: 'German-AND-English' },
    { value: 'German-or-English', label: 'German-OR-English' }
];

export const LANGUAGES_PREFERENCE_ARRAY_OPTIONS = [
    { value: '', label: 'Please Select' },
    { value: 'English', label: 'Only English' },
    { value: 'German', label: 'Only German' },
    { value: 'German-and-English', label: 'German and English' },
    { value: 'Others', label: 'Others' }
];

export const UNI_ASSIST_ARRAY_OPTIONS = [
    { value: 'No', label: 'No' },
    { value: 'Yes-VPD', label: 'Yes-VPD' },
    { value: 'Yes-FULL', label: 'Yes-Full' }
];

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
    { value: 'pending', label: 'In Progress' }
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
    { value: 'X', label: 'No' }
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

export const GRE_CERTIFICATE_ARRAY_OPTIONS = [
    { value: '', label: 'Please Select' },
    { value: 'GRE_GENERAL', label: 'GRE General Test' },
    { value: 'GRE_SUBJECT', label: 'GRE Subject Test' },
    { value: 'GRE_OTHERS', label: 'GRE Other Test', disabled: true }
];

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
    { value: '-', label: 'Please Select' },
    { value: 'WS', label: 'Winter Semester (Semester begins on October)' },
    { value: 'SS', label: 'Summer Semester (Semester begins on April)' }
];

export const DEGREE_ARRAY_OPTIONS = [
    { value: '', label: 'Please Select' },
    { value: 'Bachelor', label: 'Bachelor' },
    { value: 'Master', label: 'Master' },
    { value: 'BachelorMaster', label: 'BachelorMaster' }
];

export const is_new_message_status = (user, thread) => {
    if (thread.isFinalVersion) {
        return false;
    }
    if (
        thread.latest_message_left_by_id === undefined ||
        thread.latest_message_left_by_id === ''
    ) {
        if (!is_TaiGer_Student(user)) {
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
          enrolment: 'Enrolment Instruction',
          scholarship: 'Scholarship List'
      }
    : {
          howtostart: `How to Start ${appConfig.companyName} Portal`,
          'base-documents': 'Base Documents',
          'cv-ml-rl': 'CV/ML/RL',
          application: 'Application Instruction',
          'portal-instruction': 'Portal Instruction',
          certification: 'Certification Instruction',
          visa: 'Visa Instruction',
          enrolment: 'Enrolment Instruction',
          scholarship: 'Scholarship List'
      };

export const internal_documentation_categories = {
    agents: 'Agents',
    editors: 'Editors',
    admin: 'Admin',
    'base-documents-internal': 'Base Documents Internal',
    'uniassist-internal': 'Uni-Assist Internal',
    others: 'Others'
};

export const col_keywords = [
    {
        accessorKey: 'categoryName', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
        filterVariant: 'autocomplete',
        filterFn: 'contains',
        header: 'Category'
    },
    {
        accessorKey: 'keywords_zh',
        header: 'Keyword-ZH',
        Cell: (params) => {
            const { row } = params;
            return (
                <Box
                    sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}
                >
                    {row.original?.keywords_zh}
                </Box>
            );
        }
    },
    {
        accessorKey: 'antiKeywords_zh',
        header: 'Anti Keywords-ZH',
        Cell: (params) => {
            const { row } = params;
            return (
                <Box
                    sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}
                >
                    {row.original?.antiKeywords_zh}
                </Box>
            );
        }
    },
    {
        accessorKey: 'keywords_en',
        header: 'Keyword-EN',
        Cell: (params) => {
            const { row } = params;
            return (
                <Box
                    sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}
                >
                    {row.original?.keywords_en}
                </Box>
            );
        }
    },
    {
        accessorKey: 'antiKeywords_en',
        header: 'Anti Keywords-EN',
        Cell: (params) => {
            const { row } = params;
            return (
                <Box
                    sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}
                >
                    {row.original?.antiKeywords_en}
                </Box>
            );
        }
    },
    {
        accessorKey: 'updatedAt',
        header: 'Last Update'
    }
];

export const c1_mrt = [
    {
        accessorKey: 'firstname_lastname', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
        filterVariant: 'autocomplete',
        filterFn: 'contains',
        header: 'First-, Last Name',
        size: 150,
        Cell: (params) => {
            const { row } = params;
            const linkUrl = `${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                row.original.student_id,
                DEMO.PROFILE_HASH
            )}`;
            return (
                <Box
                    sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                        // textOverflow: 'ellipsis'
                    }}
                >
                    <Link
                        component={LinkDom}
                        target="_blank"
                        title={row.original.firstname_lastname}
                        to={linkUrl}
                        underline="hover"
                    >
                        {row.original.firstname_lastname}
                    </Link>
                </Box>
            );
        }
    },
    {
        accessorKey: 'editors_joined',
        header: 'Editors / Writer',
        size: 120,
        Cell: (params) => {
            return params.row.original.file_type === 'Essay'
                ? params.row.original.outsourced_user_id?.map((outsourcer) => (
                      <Box
                          key={`${outsourcer._id.toString()}`}
                          sx={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden'
                              // textOverflow: 'ellipsis'
                          }}
                      >
                          <Link
                              component={LinkDom}
                              target="_blank"
                              title={outsourcer.firstname}
                              to={DEMO.TEAM_EDITOR_LINK(
                                  outsourcer._id.toString()
                              )}
                              underline="hover"
                          >
                              {`${outsourcer.firstname} `}
                          </Link>
                      </Box>
                  )) || []
                : params.row.original.editors?.map((editor) => (
                      <Link
                          component={LinkDom}
                          key={`${editor._id.toString()}`}
                          target="_blank"
                          title={editor.firstname}
                          to={DEMO.TEAM_EDITOR_LINK(editor._id.toString())}
                          underline="hover"
                      >
                          {`${editor.firstname} `}
                      </Link>
                  ));
        }
    },
    {
        accessorKey: 'deadline',
        header: 'Deadline',
        size: 120,
        Cell: (params) => {
            const { row } = params;
            return (
                <Box
                    sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}
                >
                    {row.original?.deadline}
                </Box>
            );
        }
    },
    {
        accessorKey: 'days_left',
        header: 'Days left',
        size: 80,
        Cell: (params) => {
            const { row } = params;
            return (
                <Box
                    sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}
                >
                    {row.original?.days_left}
                </Box>
            );
        }
    },
    {
        accessorKey: 'lang',
        header: 'Program Language',
        size: 80,
        Cell: (params) => {
            const { row } = params;
            return (
                <Box
                    sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}
                >
                    {row.original?.lang}
                </Box>
            );
        }
    },
    {
        accessorKey: 'document_name',
        header: 'Document name',
        filterFn: 'contains',
        size: 450,
        Cell: (params) => {
            const { row } = params;
            const linkUrl = `${DEMO.DOCUMENT_MODIFICATION_LINK(
                row.original.thread_id
            )}`;
            return (
                <Box
                    sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                        // textOverflow: 'ellipsis'
                    }}
                >
                    {row.original?.attributes?.map(
                        (attribute) =>
                            [1, 3, 9, 10, 11].includes(attribute.value) && (
                                <Tooltip
                                    key={attribute._id}
                                    title={`${attribute.name}: ${
                                        ATTRIBUTES[attribute.value - 1]
                                            .definition
                                    }`}
                                >
                                    <Chip
                                        color={COLORS[attribute.value]}
                                        data-testid={`chip-${attribute.name}`}
                                        label={attribute.name[0]}
                                        size="small"
                                    />
                                </Tooltip>
                            )
                    )}
                    <Link
                        component={LinkDom}
                        target="_blank"
                        title={row.original.document_name}
                        to={linkUrl}
                        underline="hover"
                    >
                        {row.original.document_name}
                    </Link>
                </Box>
            );
        }
    },
    {
        accessorKey: 'aged_days',
        header: 'Aged days',
        size: 100
    },
    {
        accessorKey: 'number_input_from_editors',
        header: 'Editor Feedback (#Messages/#Files)',
        Header: ({ column }) => (
            <Box
                sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                }}
            >
                {column.columnDef.header}
            </Box> //re-use the header we already defined
        ), //arrow function
        size: 100
    },
    {
        accessorKey: 'number_input_from_student',
        header: 'Student Feedback (#Messages/#Files)',
        Header: ({ column }) => (
            <Box
                sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                }}
            >
                {column.columnDef.header}
            </Box> //re-use the header we already defined
        ), //arrow function
        size: 100
    },
    {
        accessorKey: 'latest_reply',
        header: 'Latest Reply',
        size: 150,
        Cell: (params) => {
            const { row } = params;
            return (
                <Box
                    sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}
                >
                    {row.original?.latest_reply}
                </Box>
            );
        }
    },
    {
        accessorKey: 'updatedAt',
        header: 'Last Update',
        size: 150
    }
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
                    component={LinkDom}
                    target="_blank"
                    title={params.value}
                    to={linkUrl}
                    underline="hover"
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
                          component={LinkDom}
                          key={`${outsourcer._id.toString()}`}
                          target="_blank"
                          title={outsourcer.firstname}
                          to={DEMO.TEAM_EDITOR_LINK(outsourcer._id.toString())}
                          underline="hover"
                      >
                          {`${outsourcer.firstname} `}
                      </Link>
                  )) || []
                : params.value?.map((editor) => (
                      <Link
                          component={LinkDom}
                          key={`${editor._id.toString()}`}
                          target="_blank"
                          title={editor.firstname}
                          to={DEMO.TEAM_EDITOR_LINK(editor._id.toString())}
                          underline="hover"
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
                            [1, 3, 9, 10, 11].includes(attribute.value) && (
                                <Tooltip
                                    key={attribute._id}
                                    title={`${attribute.name}: ${
                                        ATTRIBUTES[attribute.value - 1]
                                            .definition
                                    }`}
                                >
                                    <Chip
                                        color={COLORS[attribute.value]}
                                        label={attribute.name[0]}
                                        size="small"
                                    />
                                </Tooltip>
                            )
                    )}
                    <Link
                        component={LinkDom}
                        target="_blank"
                        title={params.value}
                        to={linkUrl}
                        underline="hover"
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
        name: 'Final Decision',
        prop: 'finalEnrolment'
    },
    {
        name: 'Days left',
        prop: 'days_left'
    }
];

export const base_documents_checklist = {
    High_School_Diploma: ['English version ?', 'School Stamp or signature'],
    High_School_Transcript: [
        'English version ?',
        'Grading system existed ?',
        'Date of referral ?'
    ],
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
    Second_Degree_Certificate: [
        'English version ?',
        '若尚未最終版(畢業證書)，請標記註冊證明為 Reject，並提醒每學期更新'
    ],
    Second_Degree_Transcript: [
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
        'Course description?',
        'Course outline and content?',
        'Credits?',
        'Self Study hours?',
        'Course hours?',
        'Total workload hours?',
        'Prerequisite field?',
        'Weekly hours per semester?',
        'Assessment?',
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
    'First-, Last Name': 'First-, Last Name',
    Agents: 'Agents',
    Editors: 'Editors',
    Year: 'Year',
    Semester: 'Semester',
    Degree: 'Degree',
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

export const PROGRAM_SUBJECT_CATEGORIES = {
    SSM: {
        categoryName: 'Social Sciences & Management',
        color: indigo[300]
    },
    NS: {
        categoryName: 'Natural Sciences',
        color: teal[500]
    },
    LSM: {
        categoryName: 'Life Sciences & Medicine',
        color: red[400]
    },
    ET: {
        categoryName: 'Engineering and Technology',
        color: blueGrey[500]
    },
    AH: {
        categoryName: 'Arts & Humanities',
        color: cyan[500]
    }
};

export const PROGRAM_SUBJECT_KEYS = Object.keys(PROGRAM_SUBJECTS);
export const PROGRAM_SUBJECTS_DETAILED = Object.fromEntries(
    Object.entries(PROGRAM_SUBJECTS).map(([key, value]) => [
        key,
        {
            ...value,
            color:
                PROGRAM_SUBJECT_CATEGORIES?.[value?.category]?.color ??
                'primary',
            categoryName:
                PROGRAM_SUBJECT_CATEGORIES?.[value?.category]?.categoryName ??
                'N/A'
        }
    ])
);

export const SCHOOL_TAG_KEYS = Object.keys(SCHOOL_TAGS);
export const SCHOOL_TAGS_DETAILED = Object.fromEntries(
    Object.entries(SCHOOL_TAGS).map(([key, value]) => [
        key,
        {
            ...value
        }
    ])
);

export const GENERAL_SCORES_COURSE = {
    name: 'coursesScore',
    label: 'Course Score',
    description: 'Course score (if applicable)'
};

export const GENERAL_SCORES_GPA_BOUNDARY = {
    name: 'gpaScoreBoundaryGPA',
    label: 'GPA Boundary minimum (3.0 or 2.3 in DE system)',
    description: 'GPA boundary (if applicable)'
};

export const GENERAL_SCORES_GPA = {
    name: 'gpaScore',
    label: 'GPA Score',
    description: 'GPA score (if applicable)'
};

export const GENERAL_SCORES_MIN_GPA = {
    name: 'gpaMinScore',
    label: 'GPA Min. Score',
    description: 'GPA min. score (if applicable)'
};

export const GENERAL_SCORES_CV = {
    name: 'cvScore',
    label: 'CV Score',
    description: 'CV score (if applicable)'
};

export const GENERAL_SCORES_ML = {
    name: 'mlScore',
    label: 'ML Score',
    description: 'ML score (if applicable)'
};

export const GENERAL_SCORES_RL = {
    name: 'rlScore',
    label: 'RL Score',
    description: 'RL score (if applicable)'
};

export const GENERAL_SCORES_ESSAY = {
    name: 'essayScore',
    label: 'Essay Score',
    description: 'Essay score (if applicable)'
};

export const GENERAL_SCORES_INTERVIEW = {
    name: 'interviewScore',
    label: 'Interview Score',
    description: 'Interview score (if applicable)'
};

export const GENERAL_SCORES_GMAT = {
    name: 'gmatScore',
    label: 'GMAT Score',
    description: 'GMAT score (if applicable)'
};

export const GENERAL_SCORES_GRE = {
    name: 'greScore',
    label: 'GRE Score',
    description: 'GRE score (if applicable)'
};

export const GENERAL_SCORES_TEST = {
    name: 'testScore',
    label: 'Test Score',
    description: 'Academic test score (if applicable)'
};

export const DIRECT_ADMISSION_SCORE = {
    name: 'directAdmissionScore',
    label: 'Direct Admission Score',
    description: 'Direct Admission score (if applicable)'
};

export const DIRECT_REJECTION_SCORE = {
    name: 'directRejectionScore',
    label: 'Direct Rejection Score',
    description: 'Direct Rejection score (if applicable)'
};

export const DIRECT_ADMISSION_SECOND_SCORE = {
    name: 'directAdmissionSecondScore',
    label: 'Admission Score in 2. Stage',
    description: 'Admission score in 2. Stage (if applicable)'
};

export const DIRECT_REJECTION_SECOND_SCORE = {
    name: 'directRejectionSecondScore',
    label: 'Rejection Score in 2. Stage',
    description: 'Rejection score in 2. Stage (if applicable)'
};

export const FPSO = {
    name: 'fpso',
    label: 'FPSO link or website',
    description: 'FPSO link or website (if applicable)'
};

export const ADMISSION_DESCRIPTION = {
    name: 'admissionDescription',
    label: 'Description',
    description: 'Admission Description (if applicable)'
};

export const GENERAL_SCORES = [
    GENERAL_SCORES_GPA,
    GENERAL_SCORES_MIN_GPA,
    GENERAL_SCORES_CV,
    GENERAL_SCORES_ML,
    GENERAL_SCORES_RL,
    GENERAL_SCORES_ESSAY,
    GENERAL_SCORES_INTERVIEW,
    GENERAL_SCORES_GMAT,
    GENERAL_SCORES_GRE,
    GENERAL_SCORES_TEST
];

export const SCORES_TYPE = [
    GENERAL_SCORES_GPA_BOUNDARY,
    ...GENERAL_SCORES,
    DIRECT_REJECTION_SCORE,
    DIRECT_ADMISSION_SCORE,
    DIRECT_REJECTION_SECOND_SCORE,
    DIRECT_ADMISSION_SECOND_SCORE
];

export const SCORES_TYPE_OBJ = Object.fromEntries(
    SCORES_TYPE.map(({ name, label, description }) => [
        name,
        { label, description }
    ])
);

export const CONSIDRED_SCORES_DETAILED = Object.fromEntries(
    [GENERAL_SCORES_COURSE, ...GENERAL_SCORES].map((score) => [
        score.name,
        {
            ...score,
            color: 'primary',
            categoryName: 'N/A'
        }
    ])
);

export const TENFOLD_AI_DOMAIN =
    'https://d30kj1nf43udf4.cloudfront.net/recommendation';

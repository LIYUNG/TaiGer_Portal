import React from 'react';
import Linkify from 'react-linkify';
import { Link, Typography } from '@mui/material';
import { Link as LinkDom } from 'react-router-dom';
import JSZip from 'jszip';
import * as XLSX from 'xlsx';
import { differenceInDays } from 'date-fns';

import { convertDate, twoYearsInDays } from '../../utils/contants';
import { pdfjs } from 'react-pdf';
import {
    DocumentStatusType,
    is_TaiGer_Agent,
    is_TaiGer_Editor,
    isProgramAdmitted,
    isProgramDecided,
    isProgramSubmitted,
    isProgramWithdraw,
    ProfileNameType
} from '@taiger-common/core';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const is_User_Archived = (user) => user?.archiv === true;

// Tested
export const calculateDisplayLength = (text) => {
    let length = 0;
    for (let i = 0; i < text.length; i++) {
        // Check if the character is a Chinese character
        const isChinese = text.codePointAt(i) > 255; // Adjust the threshold if needed
        length += isChinese ? 2 : 1;
    }
    return length;
};

export const truncateText = (text, maxLength) => {
    let currentLength = 0;
    let truncatedText = '';

    for (let i = 0; i < text.length; i++) {
        const isChinese = text.codePointAt(i) > 255; // Adjust the threshold if needed
        currentLength += isChinese ? 2 : 1;

        if (currentLength <= maxLength) {
            truncatedText += text[i];
        } else {
            break;
        }
    }

    if (currentLength > maxLength) {
        truncatedText += '...';
    }
    return truncatedText;
};

export const file_category_const = {
    rl_required: 'RL',
    ml_required: 'ML',
    essay_required: 'Essay',
    portfolio_required: 'Portfolio',
    supplementary_form_required: 'Supplementary_Form',
    scholarship_form_required: 'Scholarship_Form',
    curriculum_analysis_required: 'Curriculum_Analysis'
};

export const FILE_TYPE_E = {
    ...file_category_const,
    others: 'Others'
};

export const AGENT_SUPPORT_DOCUMENTS_A = [
    FILE_TYPE_E.curriculum_analysis_required,
    FILE_TYPE_E.supplementary_form_required,
    FILE_TYPE_E.others
];

// TODO test
export const LinkableNewlineText = ({ text }) => {
    const textStyle = {
        wordBreak: 'break-all',
        whiteSpace: 'pre-line' // Preserve newlines and wrap text
    };
    return (
        <div style={textStyle}>
            <Linkify
                componentDecorator={(decoratedHref, decoratedText, key) => (
                    <Link
                        component={LinkDom}
                        key={key}
                        target="_blank"
                        to={decoratedHref}
                        underline="hover"
                    >
                        {decoratedText}
                    </Link>
                )}
            >
                {text}
            </Linkify>
        </div>
    );
};

// Tested
export const getRequirement = (thread) => {
    if (!thread) return false;

    const { file_type: fileType, program_id: program } = thread;
    if (!fileType || !program) return false;

    const requirementsMapping = [
        {
            type: 'Essay',
            requiredKey: 'essay_required',
            requirementsKey: 'essay_requirements'
        },
        {
            type: 'ML',
            requiredKey: 'ml_required',
            requirementsKey: 'ml_requirements'
        },
        {
            type: 'Portfolio',
            requiredKey: 'portfolio_required',
            requirementsKey: 'portfolio_requirements'
        },
        {
            type: 'Supplementary_Form',
            requiredKey: 'supplementary_form_required',
            requirementsKey: 'supplementary_form_requirements'
        },
        {
            type: 'Curriculum_Analysis',
            requiredKey: 'curriculum_analysis_required',
            requirementsKey: 'curriculum_analysis_requirements'
        },
        {
            type: 'Scholarship_Form',
            requiredKey: 'scholarship_form_required',
            requirementsKey: 'scholarship_form_requirements'
        },
        {
            type: 'RL',
            requiredKey: 'rl_required',
            requirementsKey: 'rl_requirements',
            validValues: ['1', '2', '3']
        }
    ];

    for (const {
        type,
        requiredKey,
        requirementsKey,
        validValues
    } of requirementsMapping) {
        if (
            fileType.includes(type) &&
            (validValues
                ? validValues.includes(program[requiredKey])
                : program[requiredKey] === 'yes')
        ) {
            return program[requirementsKey] || 'No';
        }
    }

    return 'No';
};

// Tested
export const isLanguageInfoComplete = (academic_background) => {
    const language = academic_background?.language;
    return language
        ? !(
              language.english_isPassed === '-' &&
              language.german_isPassed === '-'
          )
        : false;
};

// Tested
export const isEnglishLanguageInfoComplete = (academic_background) => {
    if (!academic_background || !academic_background.language) {
        return false;
    }
    if (academic_background.language.english_isPassed === '-') {
        return false;
    }

    return true;
};

// Tested
export const check_if_there_is_german_language_info = (academic_background) => {
    if (!academic_background || !academic_background.language) {
        return false;
    }
    if (academic_background.language.german_isPassed === '-') {
        return false;
    }

    return true;
};

export const calculateDuration = (start, end) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const duration = (endTime - startTime) / 86400000; // Duration in days
    return duration;
};

//Testd
export const check_english_language_passed = (academic_background) => {
    if (academic_background?.language?.english_isPassed === 'O') {
        return true;
    }
    return false;
};

//Testd
export const check_english_language_Notneeded = (academic_background) => {
    if (academic_background?.language?.english_isPassed === '--') {
        return true;
    }
    return false;
};

//Testd
export const check_german_language_passed = (academic_background) => {
    if (academic_background?.language?.german_isPassed === 'O') {
        return true;
    }
    return false;
};

//Testd
export const check_german_language_Notneeded = (academic_background) => {
    if (academic_background?.language?.german_isPassed === '--') {
        return true;
    }
    return false;
};

//Testd
export const based_documents_init = (student) => {
    const documentlist2_keys = Object.keys(ProfileNameType);

    let object_init = documentlist2_keys.reduce((acc, key) => {
        acc[key] = DocumentStatusType.Missing;
        return acc;
    }, {});

    student.profile.forEach((doc) => {
        switch (doc.status) {
            case DocumentStatusType.Uploaded:
            case DocumentStatusType.Accepted:
            case DocumentStatusType.Rejected:
            case DocumentStatusType.Missing:
            case DocumentStatusType.NotNeeded:
                object_init[doc.name] = doc.status;
                break;
            default:
                break;
        }
    });

    return { object_init };
};

export const are_base_documents_missing = (student) => {
    if (student.profile?.length > 0) {
        const documentlist2_keys = Object.keys(ProfileNameType);
        const { object_init } = based_documents_init(student);

        for (let i = 0; i < documentlist2_keys.length; i++) {
            if (
                object_init[documentlist2_keys[i]] !==
                    DocumentStatusType.Accepted &&
                object_init[documentlist2_keys[i]] !==
                    DocumentStatusType.NotNeeded
            ) {
                return true;
            }
        }
    }
    return false;
};

// Tested
export const is_any_base_documents_uploaded = (students) => {
    if (!students?.length) return false;

    // Create a map of initial document statuses
    const initialDocumentStatus = Object.fromEntries(
        Object.keys(ProfileNameType).map((key) => [
            key,
            DocumentStatusType.Missing
        ])
    );

    return students.some((student) => {
        if (!student.profile?.length) return false;

        // Create a new status object for each student
        const documentStatus = { ...initialDocumentStatus };

        // Update status for each profile document
        student.profile.forEach((profile) => {
            documentStatus[profile.name] = profile.status;
        });

        // Check if any document is uploaded
        return Object.keys(ProfileNameType).some(
            (key) => documentStatus[key] === DocumentStatusType.Uploaded
        );
    });
};

export const needUpdateCourseSelection = (student) => {
    // necessary if never updated course and is studying
    if (!student.courses) {
        return 'No Input';
    }
    // necessary if never analyzed and is studying
    if (!student.courses.analysis?.updatedAt) {
        return 'No Anaylsis';
    }

    // not necessary if have studied or not yet begin
    if (
        student.academic_background?.university?.isGraduated === 'Yes' ||
        student.academic_background?.university?.isGraduated === 'No'
    ) {
        return 'Graduated';
    }

    // necessary if courses or analysis expired 39 daays and is studying
    const course_aged_days = differenceInDays(
        new Date(),
        student.courses.updatedAt
    );
    const analyse_aged_days = differenceInDays(
        new Date(),
        student.courses.analysis?.updatedAt
    );
    // TODO: only check when june, july, november, december,
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // January is 0, December is 11
    if (
        currentMonth === 5 ||
        currentMonth === 6 || // July
        currentMonth === 10 ||
        currentMonth === 11 // December
    ) {
        const trigger_days = 62;
        if (
            course_aged_days > trigger_days ||
            analyse_aged_days > trigger_days
        ) {
            return 'Expired';
        }
    }

    return 'OK';
};

export const to_register_application_portals = (student) => {
    for (const application of student.applications) {
        if (isProgramDecided(application) && application.closed === '-') {
            if (
                !application.credential_a_filled ||
                !application.credential_b_filled
            ) {
                return true;
            }
        }
    }
    return false;
};

export const isBaseDocumentsRejected = (student) => {
    if (student.profile === undefined) {
        return false;
    }
    if (student.profile.length === 0) {
        return false;
    }
    const { object_init } = based_documents_init(student);
    const documentlist2_keys = Object.keys(ProfileNameType);

    for (let i = 0; i < documentlist2_keys.length; i++) {
        if (
            object_init[documentlist2_keys[i]] === DocumentStatusType.Rejected
        ) {
            return true;
        }
    }
    return false;
};

// Tested
export const check_languages_filled = (academic_background) => {
    if (!academic_background || !academic_background.language) {
        return false;
    }
    if (
        !academic_background.language ||
        !academic_background.language.english_isPassed ||
        academic_background.language.english_isPassed === '-' ||
        !academic_background.language.german_isPassed ||
        academic_background.language.german_isPassed === '-' ||
        !academic_background.language.gre_isPassed ||
        academic_background.language.gre_isPassed === '-' ||
        !academic_background.language.gmat_isPassed ||
        academic_background.language.gmat_isPassed === '-'
    ) {
        return false;
    }
    // if test date expired:
    const today = new Date();
    if (
        (academic_background.language.english_isPassed === 'X' &&
            differenceInDays(
                today,
                academic_background.language.english_test_date
            ) > 1) ||
        (academic_background.language.english_isPassed === 'X' &&
            academic_background.language.english_test_date === '') ||
        (academic_background.language.german_isPassed === 'X' &&
            differenceInDays(
                today,
                academic_background.language.german_test_date
            ) > 1) ||
        (academic_background.language.german_isPassed === 'X' &&
            academic_background.language.german_test_date === '') ||
        (academic_background.language.gre_isPassed === 'X' &&
            parseInt(
                differenceInDays(
                    today,
                    academic_background.language.gre_test_date
                )
            ) > 1) ||
        (academic_background.language.gre_isPassed === 'X' &&
            academic_background.language.gre_test_date === '') ||
        (academic_background.language.gmat_isPassed === 'X' &&
            differenceInDays(
                today,
                academic_background.language.gmat_test_date
            ) > 1) ||
        (academic_background.language.gmat_isPassed === 'X' &&
            academic_background.language.gmat_test_date === '')
    ) {
        return false;
    }

    return true;
};

// Tested
export const check_academic_background_filled = (academic_background) => {
    if (!academic_background || !academic_background.university) {
        return false;
    }
    // TODO: can add more mandatory field
    if (
        !academic_background.university?.attended_high_school ||
        !academic_background.university?.high_school_isGraduated ||
        academic_background.university?.high_school_isGraduated === '-' ||
        !academic_background.university?.Has_Exchange_Experience ||
        academic_background.university?.Has_Exchange_Experience === '-' ||
        !academic_background.university?.Has_Internship_Experience ||
        academic_background.university?.Has_Internship_Experience === '-' ||
        !academic_background.university?.Has_Working_Experience ||
        academic_background.university?.Has_Working_Experience === '-' ||
        !academic_background.university?.attended_university ||
        !academic_background.university?.attended_university_program
        // ||
        // !academic_background.university.isGraduated
    ) {
        return false;
    }

    return true;
};

export const MissingSurveyFieldsListArray = ({
    academic_background,
    application_preference
}) => {
    const missingFields = [];
    // Check academic background fields
    if (academic_background?.university) {
        const uni = academic_background.university;

        if (!uni.attended_high_school) {
            missingFields.push('High School Name');
        }

        if (
            !uni.high_school_isGraduated ||
            uni.high_school_isGraduated === '-'
        ) {
            missingFields.push('High School graduate status');
        }

        if (
            !academic_background.university.isGraduated ||
            academic_background.university.isGraduated === '-'
        ) {
            missingFields.push('Bachelor Degree graduate status');
        }

        if (
            !uni.isGraduated ||
            uni.isGraduated === '-' ||
            ['Yes', 'pending'].includes(uni.isGraduated)
        ) {
            if (uni.attended_university === '') {
                missingFields.push('University Name (Bachelor degree)');
            }
            if (uni.attended_university_program === '') {
                missingFields.push('Program Name / Not study yet');
            }
            if (
                !uni.Has_Exchange_Experience ||
                uni.Has_Exchange_Experience === '-'
            ) {
                missingFields.push('Exchange Student Experience ?');
            }
            if (
                !uni.Has_Internship_Experience ||
                uni.Has_Internship_Experience === '-'
            ) {
                missingFields.push('Internship Experience ?');
            }
            if (
                !uni.Has_Working_Experience ||
                uni.Has_Working_Experience === '-'
            ) {
                missingFields.push('Full-Time Job Experience ?');
            }
            if (['Yes', 'pending'].includes(uni.isGraduated)) {
                if (!uni.Highest_GPA_Uni || uni.Highest_GPA_Uni === '-') {
                    missingFields.push(
                        'Highest Score GPA of your university program'
                    );
                }
                if (!uni.Passing_GPA_Uni || uni.Passing_GPA_Uni === '-') {
                    missingFields.push(
                        'Passing Score GPA of your university program'
                    );
                }
                if (!uni.My_GPA_Uni || uni.My_GPA_Uni === '-') {
                    missingFields.push('My GPA');
                }
            }
        }
    }

    // Check application preference fields
    if (application_preference) {
        const fieldMappings = [
            {
                key: 'expected_application_date',
                label: 'Expected Application Year'
            },
            {
                key: 'expected_application_semester',
                label: 'Expected Application Semester'
            },
            {
                key: 'target_program_language',
                label: 'Target Program Language'
            },
            { key: 'target_degree', label: 'Target Degree Programs' },
            {
                key: 'targetApplicationSubjects',
                label: 'Target Application Subjects',
                check: (value) => !value || value.length === 0
            },
            {
                key: 'considered_privat_universities',
                label: 'Considering private universities? (Tuition Fee: ~15000 EURO/year)',
                check: (value) => value === '-'
            },
            {
                key: 'application_outside_germany',
                label: 'Considering universities outside Germany?',
                check: (value) => value === '-'
            }
        ];

        fieldMappings.forEach(({ key, label, check }) => {
            if (
                check
                    ? check(application_preference[key])
                    : !application_preference[key]
            ) {
                missingFields.push(label);
            }
        });
    }

    return missingFields;
};

export const progressBarCounter = (student, application) => {
    const programId = application?.programId || {};

    const all_points = [
        student?.generaldocs_threads?.length || 0,
        programId?.ielts || programId?.toefl ? 1 : 0,
        programId?.testdaf ? (programId?.testdaf === '-' ? 0 : 1) : 0,
        programId?.gre ? (application?.programId?.gre === '-' ? 0 : 1) : 0,
        programId?.gmat ? (programId?.gmat === '-' ? 0 : 1) : 0,
        programId?.application_portal_a || programId?.application_portal_b
            ? 1
            : 0,
        application?.doc_modification_thread?.length || 0,
        programId?.uni_assist?.includes('VPD') ? 1 : 0,
        1
    ];
    const finished_pointes = [
        student?.generaldocs_threads?.filter(
            (thread) => thread.isFinalVersion === true
        ).length,

        (programId?.ielts || programId?.toefl) &&
        student?.academic_background?.language?.english_isPassed === 'O' &&
        isEnglishOK(programId, student)
            ? 1
            : 0,
        programId?.testdaf &&
        programId?.testdaf !== '-' &&
        student?.academic_background?.language?.german_isPassed === 'O'
            ? 1
            : 0,
        programId?.gre &&
        programId?.gre !== '-' &&
        student?.academic_background?.language?.gre_isPassed === 'O'
            ? 1
            : 0,
        programId?.gmat &&
        programId?.gmat !== '-' &&
        student?.academic_background?.language?.gmat_isPassed === 'O'
            ? 1
            : 0,
        (programId?.application_portal_a || programId?.application_portal_b) &&
        ((programId?.application_portal_a &&
            !application.credential_a_filled) ||
            (programId?.application_portal_b &&
                !application.credential_b_filled))
            ? 0
            : 1,
        application?.doc_modification_thread?.filter(
            (thread) => thread.isFinalVersion === true
        ).length,
        programId?.uni_assist?.includes('VPD')
            ? application?.uni_assist?.status === DocumentStatusType.NotNeeded
                ? 0
                : 1
            : 0,
        isProgramSubmitted(application) ? 1 : 0
    ];

    const completedPoints = finished_pointes.reduce(
        (sum, value) => sum + value,
        0
    );
    const totalPoints = all_points.reduce((sum, value) => sum + value, 0);

    const percentage = (completedPoints / totalPoints) * 100;
    return Math.floor(percentage);
};

export const isEnglishOK = (program, student) => {
    const lang = student?.academic_background?.language || {};
    const {
        english_certificate,
        english_score,
        english_score_reading,
        english_score_listening,
        english_score_writing,
        english_score_speaking
    } = lang;
    // in case not number string
    if (
        ![
            english_score,
            english_score_reading,
            english_score_listening,
            english_score_writing,
            english_score_speaking
        ].every((score) => parseFloat(score))
    ) {
        return false;
    }

    if (english_certificate === 'TOEFL') {
        if (
            program.toefl > parseFloat(english_score) ||
            program.toefl_reading > parseFloat(english_score_reading) ||
            program.toefl_listening > parseFloat(english_score_listening) ||
            program.toefl_writing > parseFloat(english_score_writing) ||
            program.toefl_speaking > parseFloat(english_score_speaking)
        ) {
            return false;
        }
    }
    if (english_certificate === 'IELTS') {
        if (
            program.ielts > parseFloat(english_score) ||
            program.ielts_reading > parseFloat(english_score_reading) ||
            program.ielts_listening > parseFloat(english_score_listening) ||
            program.ielts_writing > parseFloat(english_score_writing) ||
            program.ielts_speaking > parseFloat(english_score_speaking)
        ) {
            return false;
        }
    }

    return true;
};

export const getApplicationYear = (student) => {
    return student.application_preference?.expected_application_date
        ? parseInt(student.application_preference.expected_application_date)
        : '<TBD>';
};

export const adjustYearForSemester = (year, month, semester) => {
    if (!semester) return 'Err';
    if ((semester === 'WS' && month > 9) || (semester === 'SS' && month > 3)) {
        return year - 1;
    }
    return year;
};

export const formatApplicationDate = (year, date) => {
    if (!date) return `${year}-<TBD>`;
    if (date.toLowerCase().includes('rolling')) return `${year}-Rolling`;

    const [month, day] = date.split('-');
    return `${year}/${month}/${day}`;
};

export const application_date_calculator = (student, application) => {
    if (isProgramSubmitted(application)) {
        return 'CLOSE';
    }
    if (isProgramWithdraw(application)) {
        return 'WITHDRAW';
    }
    const { application_start, semester } = application.programId;

    if (!application_start) {
        return 'No Data';
    }
    let application_year = getApplicationYear(student);
    if (!application_start) {
        return `${application_year}-<TBD>`;
    }
    if (application_start?.toLowerCase()?.includes('rolling')) {
        // include Rolling
        return `${application_year}-Rolling`;
    }
    let deadline_month = parseInt(
        application.programId.application_start.split('-')[0]
    );

    application_year = adjustYearForSemester(
        application_year,
        deadline_month,
        semester
    );

    return formatApplicationDate(application_year, application_start);
};

export const application_deadline_calculator = (student, application) => {
    if (isProgramWithdraw(application)) {
        return 'WITHDRAW';
    }
    const { application_deadline, semester } = application?.programId || {};

    if (!application_deadline) {
        return 'No Data';
    }
    let application_year = getApplicationYear(student);
    if (!application_deadline) {
        return `${application_year}-<TBD>`;
    }
    if (application_deadline?.toLowerCase()?.includes('rolling')) {
        // include Rolling
        return `${application_year}-Rolling`;
    }
    let deadline_month = parseInt(
        application.programId.application_deadline.split('-')[0]
    );

    application_year = adjustYearForSemester(
        application_year,
        deadline_month,
        semester
    );

    return formatApplicationDate(application_year, application_deadline);
};

export const GetCVDeadline = (student) => {
    var today = new Date();
    let daysLeftMin = 3000;
    let CVDeadline = '';
    let daysLeftRollingMin = 0;
    let CVDeadlineRolling = '';
    let hasRolling = false;
    student.applications.forEach((application) => {
        if (isProgramDecided(application) && application.closed === '-') {
            const applicationDeadline = application_deadline_calculator(
                student,
                application
            );
            if (applicationDeadline?.toLowerCase()?.includes('rolling')) {
                hasRolling = true;
                daysLeftRollingMin = '-';
                CVDeadlineRolling = applicationDeadline;
            }
            const daysLeft = differenceInDays(applicationDeadline, today);
            if (daysLeft < daysLeftMin) {
                daysLeftMin = daysLeft;
                CVDeadline = applicationDeadline;
            }
        }
    });
    return daysLeftMin === 3000
        ? hasRolling
            ? {
                  daysLeftMin: daysLeftRollingMin,
                  CVDeadline: CVDeadlineRolling
              }
            : { daysLeftMin: '-', CVDeadline: '-' }
        : { daysLeftMin, CVDeadline };
};

export const check_application_preference_filled = (application_preference) => {
    if (!application_preference) {
        return false;
    }
    const {
        expected_application_date,
        expected_application_semester,
        target_program_language,
        target_degree,
        considered_privat_universities,
        application_outside_germany,
        targetApplicationSubjects
    } = application_preference;

    return (
        expected_application_date &&
        expected_application_semester &&
        target_program_language &&
        target_degree &&
        considered_privat_universities !== '-' &&
        application_outside_germany !== '-' &&
        targetApplicationSubjects?.length !== 0
    );
};

export const does_student_have_agents = (students) => {
    return students.every(
        (student) => student.agents !== undefined && student.agents.length > 0
    );
};

export const does_student_have_editors = (students) => {
    return students.every(
        (student) => student.editors !== undefined && student.editors.length > 0
    );
};

export const check_applications_to_decided = (student) => {
    if (!student.applications || student.applications.length === 0) {
        return true;
    }
    return student.applications.every(
        (app) => app.decided && app.decided !== '-'
    );
};

export const has_admissions = (student) => {
    if (!student.applications || student.applications.length === 0) {
        return false;
    }

    return student.applications.some(
        (app) => isProgramSubmitted(app) && isProgramAdmitted(app)
    );
};

export const all_applications_results_updated = (student) => {
    if (!student.applications || student.applications.length === 0) {
        return true;
    }

    return student.applications.every(
        (app) => !isProgramSubmitted(app) || app.admission !== '-'
    );
};

export const hasApplications = (student) => {
    return student.applications && student.applications.length > 0;
};

export const has_agent_program_specific_tasks = (student) => {
    if (!student.applications) {
        return false;
    }
    if (student.applications.length === 0) {
        return false;
    }
    for (const application of student.applications) {
        if (isProgramDecided(application)) {
            for (const thread of application.doc_modification_thread) {
                if (
                    ['Supplementary_Form', 'Curriculum_Analysis'].includes(
                        thread.doc_thread_id?.file_type
                    )
                ) {
                    return true;
                }
            }
        }
    }
    return false;
};

export const anyStudentWithoutApplicationSelection = (students) => {
    return students.some((student) => !hasApplications(student));
};

export const is_num_Program_Not_specified = (student) => {
    return !student.applying_program_count;
};

export const isProgramNotSelectedEnough = (students) => {
    return students.some(
        (student) =>
            student.applications.length < student.applying_program_count
    );
};

export const numApplicationsDecided = (student) => {
    if (student.applications === undefined) {
        return 0;
    }
    const num_apps_decided = student.applications.filter((app) =>
        isProgramDecided(app)
    ).length;
    return num_apps_decided;
};

export const numApplicationsSubmitted = (student) => {
    if (student.applications === undefined) {
        return 0;
    }
    const num_apps_closed = student.applications.filter((app) =>
        isProgramSubmitted(app)
    ).length;
    return num_apps_closed;
};

export const areProgramsDecidedMoreThanContract = (student) => {
    if (
        !student.applications ||
        student.applying_program_count === 0 ||
        student.applications.length === 0
    ) {
        return false;
    }
    const num_decided =
        student?.applications?.filter((application) =>
            isProgramDecided(application)
        ).length | 0;

    return num_decided >= student.applying_program_count;
};

export const check_all_applications_decided = (student) => {
    if (
        !student.applications ||
        student.applying_program_count === 0 ||
        student.applications.length === 0
    ) {
        return false;
    }

    if (student.applications.length < student.applying_program_count) {
        return false;
    }

    for (let j = 0; j < student.applications.length; j += 1)
        if (
            !student.applications[j].decided ||
            (student.applications[j].decided !== undefined &&
                student.applications[j].decided !== 'O')
        ) {
            return false;
        }

    return true;
};

export const check_all_decided_applications_submitted = (student) => {
    if (!student.applications || student.applications.length === 0) {
        return false;
    }

    return student.applications
        .filter((app) => isProgramDecided(app))
        .every((app) => isProgramSubmitted(app) && isProgramDecided(app));
};

export const check_program_uni_assist_needed = (application) => {
    if (application.programId?.uni_assist?.includes('Yes')) {
        return true;
    }

    return false;
};

// Tested
export const isUniAssistVPDNeeded = (application) => {
    if (
        isProgramDecided(application) &&
        application.programId.uni_assist &&
        application.programId.uni_assist.includes('VPD')
    ) {
        if (!application.uni_assist) {
            return true;
        }
        if (
            application.uni_assist &&
            application.uni_assist.status === DocumentStatusType.NotNeeded
        ) {
            return false;
        }

        if (
            application.uni_assist &&
            (application.uni_assist.status !== DocumentStatusType.Uploaded ||
                application.uni_assist.vpd_file_path === '')
        ) {
            return true;
        }
    }

    return false;
};

// Tested
export const is_uni_assist_paid_and_docs_uploaded = (application) => {
    if (application.uni_assist && application.uni_assist.isPaid) {
        return true;
    }
    return false;
};

// Tested
export const check_student_needs_uni_assist = (student) => {
    if (!student.applications) {
        return false;
    }
    //  Array.some() method to check if there's an application that matches the conditions.
    return student.applications.some((app) => {
        return (
            isProgramDecided(app) &&
            app.programId.uni_assist &&
            (app.programId.uni_assist.includes('VPD') ||
                app.programId.uni_assist.includes('FULL'))
        );
    });
};

// Tested
export const num_uni_assist_vpd_uploaded = (student) => {
    let counter = 0;
    if (!student.applications) {
        return counter;
    }
    for (const application of student.applications) {
        if (
            isProgramDecided(application) &&
            application.programId.uni_assist &&
            application.programId.uni_assist.includes('VPD') &&
            application.uni_assist &&
            application.uni_assist.status !== DocumentStatusType.NotNeeded &&
            (application.uni_assist.status === DocumentStatusType.Uploaded ||
                application.uni_assist.vpd_file_path)
        ) {
            counter += 1;
        }
    }
    return counter;
};

// Tested
export const num_uni_assist_vpd_needed = (student) => {
    let counter = 0;
    if (!student.applications) {
        return counter;
    }
    for (let j = 0; j < student.applications.length; j += 1) {
        if (
            isProgramDecided(student.applications[j]) &&
            student.applications[j].programId.uni_assist &&
            student.applications[j].programId.uni_assist.includes('VPD')
        ) {
            if (!student.applications[j].uni_assist) {
                continue;
            }
            if (
                student.applications[j].uni_assist &&
                student.applications[j].uni_assist.status ===
                    DocumentStatusType.NotNeeded
            ) {
                continue;
            }
            counter += 1;
        }
    }
    return counter;
};

// Tested
export const is_program_ml_rl_essay_finished = (application) => {
    // check ML, RL, Essay
    return (
        application.doc_modification_thread?.length === 0 ||
        application.doc_modification_thread?.every(
            (thread) => thread.isFinalVersion
        )
    );
};

// Tested
export const is_cv_assigned = (student) => {
    // check CV
    return (
        student.generaldocs_threads.findIndex(
            (thread) => thread.doc_thread_id.file_type === 'CV'
        ) >= 0
    );
};

// Tested
export const isCVFinished = (student) => {
    const cv_thread = student?.generaldocs_threads?.find(
        (thread) => thread.doc_thread_id.file_type === 'CV'
    );
    return !!(cv_thread && cv_thread.isFinalVersion);
};

export const isAnyCVNotAssigned = (students) => {
    let flag = false;
    for (let i = 0; i < students.length; i += 1) {
        flag =
            flag ||
            (!isCVFinished(students[i]) && !is_cv_assigned(students[i]));
        if (flag) {
            return flag;
        }
    }
    return false;
};

export const is_program_ml_rl_essay_ready = (application) => {
    // check ML, RL, Essay
    for (let i = 0; i < application.doc_modification_thread.length; i += 1) {
        if (!application.doc_modification_thread[i].isFinalVersion) {
            return false;
        }
    }
    return true;
};

export const isApplicationOpen = (application) => {
    return !isProgramSubmitted(application) && !isProgramWithdraw(application);
};

export const is_program_closed = (application) => {
    if (isProgramSubmitted(application) || isProgramWithdraw(application)) {
        return true;
    }
    return false;
};

export const is_any_programs_ready_to_submit = (students) => {
    if (students) {
        for (let i = 0; i < students.length; i += 1) {
            if (students[i].applications) {
                for (let j = 0; j < students[i].applications.length; j += 1) {
                    if (
                        isProgramDecided(students[i].applications[j]) &&
                        isCVFinished(students[i]) &&
                        is_program_ml_rl_essay_ready(
                            students[i].applications[j]
                        ) &&
                        is_the_uni_assist_vpd_uploaded(
                            students[i].applications[j]
                        ) &&
                        !is_program_closed(students[i].applications[j])
                    ) {
                        return true;
                    }
                }
            }
        }
    }

    return false;
};

export const is_vpd_missing = (application) => {
    if (!application.uni_assist) {
        return true;
    }
    if (
        application.uni_assist &&
        (application.uni_assist.status !== DocumentStatusType.Uploaded ||
            application.uni_assist.vpd_file_path === '')
    ) {
        return true;
    }

    return false;
};

export const is_any_vpd_missing = (students) => {
    if (students) {
        for (let i = 0; i < students.length; i += 1) {
            if (students[i].applications) {
                for (let j = 0; j < students[i].applications.length; j += 1) {
                    if (
                        isProgramDecided(students[i].applications[j]) &&
                        students[i].applications[j].programId.uni_assist &&
                        students[i].applications[
                            j
                        ].programId.uni_assist.includes('VPD')
                    ) {
                        if (!students[i].applications[j].uni_assist) {
                            return true;
                        }
                        if (
                            students[i].applications[j].uni_assist &&
                            students[i].applications[j].uni_assist.status ===
                                DocumentStatusType.NotNeeded
                        ) {
                            continue;
                        }
                        if (
                            students[i].applications[j].uni_assist &&
                            (students[i].applications[j].uni_assist.status !==
                                DocumentStatusType.Uploaded ||
                                students[i].applications[j].uni_assist
                                    .vpd_file_path === '')
                        ) {
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
};

export const is_the_uni_assist_vpd_uploaded = (application) => {
    if (application === undefined) {
        return false;
    }
    if (
        isProgramDecided(application) &&
        application.programId.uni_assist &&
        application.programId.uni_assist.includes('FULL')
    ) {
        return true;
    }
    if (
        isProgramDecided(application) &&
        application.programId.uni_assist &&
        application.programId.uni_assist.includes('VPD')
    ) {
        if (!application.uni_assist) {
            return false;
        }
        if (
            application.uni_assist.status === DocumentStatusType.Uploaded ||
            application.uni_assist.status === DocumentStatusType.NotNeeded
        ) {
            return true;
        }
        if (application.uni_assist.vpd_file_path === '') {
            if (
                application.uni_assist?.vpd_paid_confirmation_file_path &&
                application.uni_assist?.vpd_paid_confirmation_file_path !== ''
            ) {
                return true;
            } else {
                return false;
            }
        }
    }

    return true;
};

export const requiredFields = [
    'birthday',
    'firstname',
    'firstname_chinese',
    'lastname',
    'lastname_chinese',
    'linkedIn'
];

export const is_personal_data_filled = (student) => {
    return requiredFields.every(
        (field) => student[field] !== undefined && student[field] !== ''
    );
};

export const needGraduatedApplicantsButStudentNotGraduated = (student) => {
    if (student.applications === undefined) {
        return false;
    }
    for (let j = 0; j < student.applications.length; j += 1) {
        if (
            isProgramDecided(student.applications[j]) &&
            student.applications[j].programId.allowOnlyGraduatedApplicant &&
            student.academic_background.university.isGraduated !== 'Yes'
        ) {
            return true;
        }
    }
    return false;
};

export const needGraduatedApplicantsPrograms = (applications) => {
    return applications?.filter(
        (app) =>
            isProgramDecided(app) && app.programId.allowOnlyGraduatedApplicant
    );
};

export const isLanguageNotMatchedInAnyProgram = (student) => {
    const { applications, academic_background } = student;

    if (!applications) {
        return false;
    }
    const decidedApplications = applications.filter((app) =>
        isProgramDecided(app)
    );
    for (let app of decidedApplications) {
        const programLang = app.programId.lang?.toLowerCase();
        if (
            check_german_language_Notneeded(academic_background) &&
            check_english_language_Notneeded(academic_background) &&
            (programLang.includes('german') || programLang.includes('english'))
        ) {
            return true;
        }
        if (programLang?.includes('german-and') || programLang === 'german') {
            if (check_german_language_Notneeded(academic_background)) {
                return true;
            }
        }
        if (programLang?.includes('and-english') || programLang === 'english') {
            if (check_english_language_Notneeded(academic_background)) {
                return true;
            }
        }
    }

    return false;
};

export const isEnglishProgram = (application) => {
    return application?.programId?.lang?.toLowerCase().includes('english');
};

export const isEnglishCertificateExpiredBeforeDeadline = (student) => {
    const { applications, academic_background } = student;

    if (!applications) {
        return false;
    }

    for (let app of applications) {
        if (!isProgramDecided(app)) {
            continue;
        }

        if (isProgramSubmitted(app)) {
            continue;
        }
        if (!isEnglishProgram(app)) {
            continue;
        }

        if (
            differenceInDays(
                application_deadline_calculator(student, app),
                academic_background.language.english_test_date
            ) > twoYearsInDays
        ) {
            return true;
        }
    }

    return false;
};

export const languageNotMatchedPrograms = (student) => {
    const decidedApplications = student.applications?.filter((app) =>
        isProgramDecided(app)
    );

    return decidedApplications?.filter(
        (app) =>
            (check_german_language_Notneeded(student.academic_background) &&
                check_english_language_Notneeded(student.academic_background) &&
                (app.programId.lang?.toLowerCase().includes('german') ||
                    app.programId.lang?.toLowerCase().includes('english'))) ||
            ((app.programId.lang?.toLowerCase().includes('and-english') ||
                app.programId.lang?.toLowerCase() === 'english') &&
                check_english_language_Notneeded(
                    student.academic_background
                )) ||
            ((app.programId.lang?.toLowerCase().includes('german-and') ||
                app.programId.lang?.toLowerCase() === 'german') &&
                check_german_language_Notneeded(student.academic_background))
    );
};

export const englishCertificatedExpiredBeforeTheseProgramDeadlines = (
    student
) => {
    return student.applications?.filter(
        (app) =>
            isProgramDecided(app) &&
            isEnglishProgram(app) &&
            differenceInDays(
                application_deadline_calculator(student, app),
                student.academic_background.language.english_test_date
            ) > twoYearsInDays
    );
};

export const is_all_uni_assist_vpd_uploaded = (student) => {
    if (student.applications === undefined) {
        return false;
    }
    for (let j = 0; j < student.applications.length; j += 1) {
        if (
            isProgramDecided(student.applications[j]) &&
            student.applications[j].programId.uni_assist &&
            student.applications[j].programId.uni_assist.includes('VPD')
        ) {
            if (!student.applications[j].uni_assist) {
                return false;
            }
            if (
                student.applications[j].uni_assist &&
                student.applications[j].uni_assist.status ===
                    DocumentStatusType.NotNeeded
            ) {
                continue;
            }
            if (
                student.applications[j].uni_assist &&
                (student.applications[j].uni_assist.status !==
                    DocumentStatusType.Uploaded ||
                    student.applications[j].uni_assist.vpd_file_path === '')
            ) {
                return false;
            }
        }
    }
    return true;
};

export const check_generaldocs = (student) => {
    if (!student.generaldocs_threads) {
        return false;
    }
    if (
        student.generaldocs_threads.findIndex(
            (thread) => thread.doc_thread_id.file_type === 'CV'
        ) === -1
    ) {
        return true;
    } else {
        return false;
    }
};

export const getNumberOfFilesByStudent = (messages, student_id) => {
    if (!messages) {
        return 0;
    }
    let file_count = 0;
    let message_count = 0;
    for (const message of messages) {
        if (message.user_id?._id?.toString() === student_id) {
            file_count += message.file?.length || 0;
            message_count += 1;
        }
    }
    return `${message_count}/${file_count}`;
};

export const getNumberOfFilesByEditor = (messages, student_id) => {
    if (!messages) {
        return 0;
    }
    let file_count = 0;
    let message_count = 0;
    for (const message of messages) {
        if (message.user_id?._id.toString() !== student_id) {
            file_count += message.file?.length || 0;
            message_count += 1;
        }
    }
    return `${message_count}/${file_count}`;
};

export const latestReplyInfo = (thread) => {
    const messages = thread?.messages;
    if (!messages || messages?.length <= 0) {
        return '- None - ';
    }
    const latestMessageUser = messages[messages?.length - 1]?.user_id;
    return (
        latestMessageUser &&
        `${latestMessageUser?.firstname} ${latestMessageUser?.lastname}`
    );
};

export const prepTaskStudent = (student) => {
    return {
        firstname_lastname: `${student.firstname}, ${student.lastname}`,
        student_id: student._id.toString(),
        attributes: student.attributes,
        agents: student.agents,
        agents_joined: student.agents
            ?.map((agent) => agent.firstname)
            .join(' '),
        editors: student.editors,
        editors_joined: student.editors
            ?.map((editor) => editor.firstname)
            .join(' ')
    };
};

// the messages[0] is already the latest message handled by backend query.
const latestReplyUserId = (thread) => {
    return thread.messages?.length > 0
        ? thread.messages[0].user_id?._id.toString()
        : '';
};
const prepEssayTaskThread = (student, thread) => {
    return {
        ...prepTaskStudent(student),
        id: thread._id?.toString(),
        latest_message_left_by_id: latestReplyUserId(thread),
        isFinalVersion: thread.isFinalVersion,
        outsourced_user_id: thread?.outsourced_user_id,
        flag_by_user_id: thread?.flag_by_user_id,
        file_type: thread.file_type,
        aged_days: differenceInDays(new Date(), thread.updatedAt),
        latest_reply: latestReplyInfo(thread),
        updatedAt: convertDate(thread.updatedAt),
        number_input_from_student: getNumberOfFilesByStudent(
            thread.messages,
            student._id.toString()
        ),
        number_input_from_editors: getNumberOfFilesByEditor(
            thread.messages,
            student._id.toString()
        )
    };
};

const prepTask = (student, thread) => {
    return {
        ...prepTaskStudent(student),
        id: thread.doc_thread_id?._id.toString(),
        latest_message_left_by_id: thread.latest_message_left_by_id,
        flag_by_user_id: thread.doc_thread_id?.flag_by_user_id,
        isFinalVersion: thread.isFinalVersion,
        outsourced_user_id: thread.doc_thread_id?.outsourced_user_id,
        file_type: thread.doc_thread_id?.file_type,
        aged_days: differenceInDays(
            new Date(),
            thread.doc_thread_id?.updatedAt
        ),
        latest_reply: latestReplyInfo(thread.doc_thread_id),
        updatedAt: convertDate(thread.doc_thread_id?.updatedAt),
        number_input_from_student: getNumberOfFilesByStudent(
            thread.doc_thread_id?.messages,
            student._id.toString()
        ),
        number_input_from_editors: getNumberOfFilesByEditor(
            thread.doc_thread_id?.messages,
            student._id.toString()
        )
    };
};

// student.generaldocs_threads
const prepGeneralTask = (student, thread) => {
    const { CVDeadline, daysLeftMin } = GetCVDeadline(student);
    return {
        ...prepTask(student, thread),
        thread_id: thread.doc_thread_id?._id.toString(),
        deadline: CVDeadline,
        lang: '',
        show: true,
        document_name: `${thread.doc_thread_id?.file_type}`,
        days_left: daysLeftMin
    };
};

const prepEssayTask = (essay, user) => {
    return {
        ...prepEssayTaskThread(essay.student_id, essay),
        thread_id: essay._id.toString(),
        program_id: essay.program_id._id.toString(),
        lang: essay.program_id?.lang,
        deadline: application_deadline_calculator(essay.student_id, {
            programId: essay.program_id
        }),
        show:
            AGENT_SUPPORT_DOCUMENTS_A.includes(essay.file_type) &&
            is_TaiGer_Editor(user)
                ? essay.outsourced_user_id?.some(
                      (outsourcer) =>
                          outsourcer._id.toString() === user._id.toString()
                  ) || false
                : is_TaiGer_Agent(user)
                  ? essay.student_id?.agents.some(
                        (agent) => agent._id.toString() === user._id.toString()
                    ) || false
                  : true,
        document_name: `${essay.file_type} - ${essay.program_id.school} - ${essay.program_id.degree} -${essay.program_id.program_name}`,
        days_left:
            differenceInDays(
                application_deadline_calculator(essay.student_id, {
                    programId: essay.program_id
                }),
                new Date()
            ) || '-'
    };
};

// student.applications -> application.doc_modification_thread
const prepApplicationTask = (student, application, thread) => {
    return {
        ...prepTask(student, thread),
        thread_id: thread.doc_thread_id?._id.toString(),
        program_id: application.programId?._id.toString(),
        deadline: application_deadline_calculator(student, application),
        show: isProgramDecided(application) ? true : false,
        document_name: `${thread?.doc_thread_id?.file_type} - ${application?.programId?.school} - ${application?.programId?.degree} -${application?.programId?.program_name}`,
        lang: `${application?.programId?.lang}`,
        days_left:
            differenceInDays(
                application_deadline_calculator(student, application),
                new Date()
            ) || '-'
    };
};

export const open_tasks = (students) => {
    const tasks = [];
    for (const student of students) {
        if (student.archiv !== true) {
            for (const thread of student.generaldocs_threads) {
                tasks.push(prepGeneralTask(student, thread));
            }
            for (const application of student.applications) {
                for (const thread of application.doc_modification_thread) {
                    tasks.push(
                        prepApplicationTask(student, application, thread)
                    );
                }
            }
        }
    }
    return tasks;
};

export const open_essays_tasks = (essays, user) => {
    const tasks = [];
    if (!essays) {
        return [];
    }
    for (const essay of essays) {
        tasks.push(prepEssayTask(essay, user));
    }
    return tasks;
};

export const open_tasks_with_editors = (students) => {
    const tasks = [];
    for (const student of students) {
        if (student.archiv !== true) {
            for (const thread of student.generaldocs_threads) {
                tasks.push({
                    ...prepGeneralTask(student, thread),
                    isPotentials: false,
                    editors: student.editors,
                    editors_joined: student.editors
                        ?.map((editor) => editor.firstname)
                        .join(' '),
                    agents: student.agents,
                    agents_joined: student.agents
                        ?.map((agent) => agent.firstname)
                        .join(' ')
                });
            }
            for (const application of student.applications) {
                for (const thread of application.doc_modification_thread) {
                    tasks.push({
                        ...prepApplicationTask(student, application, thread),
                        isPotentials:
                            application.decided === '-' ? true : false,
                        editors: student.editors,
                        editors_joined: student.editors
                            ?.map((editor) => editor.firstname)
                            .join(' '),
                        agents: student.agents,
                        agents_joined: student.agents
                            ?.map((agent) => agent.firstname)
                            .join(' ')
                    });
                }
            }
        }
    }
    return tasks;
};

export const programs_refactor = (students) => {
    const applications = students.reduce((acc, student) => {
        let isMissingBaseDocs = false;

        const object_init = Object.fromEntries(
            Object.keys(ProfileNameType).map((key) => [
                key,
                DocumentStatusType.Missing
            ])
        );

        if (student.profile) {
            student.profile.forEach((doc) => {
                object_init[doc.name] = doc.status;
            });
        }

        isMissingBaseDocs = Object.keys(object_init).some(
            (key) =>
                object_init[key] !== DocumentStatusType.Accepted &&
                object_init[key] !== DocumentStatusType.NotNeeded
        );

        const is_cv_done = isCVFinished(student);

        if (!student.applications || student.applications.length === 0) {
            acc.push({
                id: `${student._id.toString()}-`,
                target_year: `${
                    student.application_preference?.expected_application_date ||
                    '-'
                } ${
                    student.application_preference
                        ?.expected_application_semester || '-'
                }`,
                school: 'No University',
                application: {},
                student: student,
                firstname_lastname: `${student.firstname}, ${student.lastname}`,
                program_name: 'No Program',
                program: 'No Program',
                editors: student.editors
                    ?.map((editor) => editor.firstname)
                    .join(', '),
                agents: student.agents
                    ?.map((agent) => agent.firstname)
                    .join(', '),
                semester: '-',
                degree: '-',
                toefl: '-',
                ielts: '-',
                testdaf: '-',
                program_id: '-',
                application_deadline: '-',
                decided: '-',
                closed: '-',
                admission: '-',
                student_id: student._id.toString(),
                deadline: '-',
                days_left: '-',
                base_docs: '-',
                uniassist: '-',
                cv: '-',
                ml_rl: '-',
                ready: '-',
                show: false,
                isPotentials: true,
                status: '-'
            });
        } else {
            student.applications.forEach((application) => {
                const is_program_submitted = isProgramSubmitted(application);
                const is_program_decided = isProgramDecided(application);
                const deadline = application_deadline_calculator(
                    student,
                    application
                );
                const days_left = differenceInDays(deadline, new Date()) || '-';
                const base_docs = isProgramSubmitted(application)
                    ? '-'
                    : isMissingBaseDocs
                      ? 'X'
                      : 'O';
                const uniassist = is_program_submitted
                    ? '-'
                    : check_program_uni_assist_needed(application)
                      ? application.uni_assist &&
                        application.uni_assist.status ===
                            DocumentStatusType.Uploaded
                          ? 'O'
                          : 'X'
                      : 'Not Needed';
                const cv = is_program_submitted ? '-' : is_cv_done ? 'O' : 'X';
                const ml_rl = is_program_decided
                    ? is_program_submitted
                        ? '-'
                        : is_program_ml_rl_essay_finished(application)
                          ? 'O'
                          : 'X'
                    : 'X';
                const ready = is_program_decided
                    ? is_program_submitted
                        ? '-'
                        : !isMissingBaseDocs &&
                            (!check_program_uni_assist_needed(application) ||
                                (check_program_uni_assist_needed(application) &&
                                    application.uni_assist &&
                                    application.uni_assist.status ===
                                        DocumentStatusType.Uploaded)) &&
                            is_cv_done &&
                            is_program_ml_rl_essay_finished(application)
                          ? 'Ready!'
                          : 'No'
                    : 'Undecided';

                acc.push({
                    id: `${student._id.toString()}-${application.programId._id.toString()}`,
                    target_year: `${
                        student.application_preference
                            ?.expected_application_date || '-'
                    } ${
                        student.application_preference
                            ?.expected_application_semester || '-'
                    }`,
                    school: application.programId.school,
                    application,
                    student: student,
                    firstname_lastname: `${student.firstname}, ${student.lastname}`,
                    program_name: application.programId.program_name,
                    program: `${application.programId.school} - ${application.programId.program_name} (${application.programId.degree})`,
                    editors: student.editors
                        ?.map((editor) => editor.firstname)
                        .join(', '),
                    agents: student.agents
                        ?.map((agent) => agent.firstname)
                        .join(', '),
                    semester: application.programId.semester,
                    degree: application.programId.degree,
                    toefl: application.programId.toefl,
                    ielts: application.programId.ielts,
                    testdaf: application.programId.testdaf,
                    whoupdated: application.programId.whoupdated,
                    updatedAt: application.programId.updatedAt,
                    program_id: application.programId._id.toString(),
                    application_deadline: deadline,
                    isPotentials: application.decided === '-',
                    decided: application.decided,
                    closed: application.closed,
                    admission: application.admission,
                    student_id: student._id.toString(),
                    deadline,
                    days_left,
                    base_docs,
                    uniassist,
                    cv,
                    ml_rl,
                    ready,
                    show: isProgramDecided(application) ? true : false,
                    status:
                        deadline === 'CLOSE'
                            ? 100
                            : progressBarCounter(student, application)
                });
            });
        }

        return acc;
    }, []);

    return applications;
};

export const highlightText = (text, highlight) => {
    if (!highlight) return text;

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
            <Typography component="span" key={i} sx={{ fontWeight: 'bold' }}>
                {part}
            </Typography>
        ) : (
            part
        )
    );
};

export const toogleItemInArray = (arr, item) => {
    return arr?.includes(item)
        ? arr?.filter((userId) => userId !== item)
        : arr?.length > 0
          ? [...arr, item]
          : [item];
};

const getNextProgram = (student) => {
    const nextProgram = programs_refactor([student])
        .filter(
            (application) =>
                isProgramDecided(application) && application.closed === '-'
        )
        .sort((a, b) =>
            a.application_deadline > b.application_deadline ? 1 : -1
        );
    return nextProgram;
};

export const getNextProgramName = (student) => {
    const nextProgram = getNextProgram(student);
    return nextProgram.length !== 0 ? nextProgram[0].program : '-';
};

export const getNextProgramDeadline = (student) => {
    const nextProgram = getNextProgram(student);
    return nextProgram.length !== 0 ? nextProgram[0].application_deadline : '-';
};

export const getNextProgramDayleft = (student) => {
    const nextProgram = getNextProgram(student);
    return nextProgram.length !== 0 ? nextProgram[0].days_left : '-';
};

export const getNextProgramStatus = (student) => {
    const nextProgram = getNextProgram(student);
    return nextProgram.length !== 0
        ? `${progressBarCounter(student, nextProgram[0].application)} %`
        : '-';
};

export const numStudentYearDistribution = (students) => {
    const map = {};
    for (let i = 0; i < students.length; i++) {
        if (students[i].application_preference.expected_application_date) {
            map[students[i].application_preference.expected_application_date] =
                map[
                    students[i].application_preference.expected_application_date
                ]
                    ? map[
                          students[i].application_preference
                              .expected_application_date
                      ] + 1
                    : 1;
        } else {
            map['TBD'] = map['TBD'] ? map['TBD'] + 1 : 1;
        }
    }
    return map;
};

export const frequencyDistribution = (tasks) => {
    const map = {};
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].closed === 'O' || tasks[i].closed === 'X') {
            continue;
        }
        map[tasks[i].deadline] = map[tasks[i].deadline]
            ? tasks[i].show
                ? {
                      show: map[tasks[i].deadline].show + 1,
                      potentials: map[tasks[i].deadline].potentials
                  }
                : tasks[i].isPotentials
                  ? {
                        show: map[tasks[i].deadline].show,
                        potentials: map[tasks[i].deadline].potentials + 1
                    }
                  : {
                        show: map[tasks[i].deadline].show,
                        potentials: map[tasks[i].deadline].potentials
                    }
            : tasks[i].show
              ? { show: 1, potentials: 0 }
              : tasks[i].isPotentials
                ? { show: 0, potentials: 1 }
                : { show: 0, potentials: 0 };
    }
    const filteredMap = Object.fromEntries(
        Object.entries(map).filter(
            ([key, value]) =>
                ((value.show !== 0 || value.potentials !== 0) &&
                    differenceInDays(key, new Date()) < 365) ||
                key.includes('Rolling')
        )
    );
    return filteredMap;
};

export const checkIsRLspecific = (program) => {
    const isRLSpecific = program?.is_rl_specific;
    const NoRLSpecificFlag =
        isRLSpecific === undefined || isRLSpecific === null;
    return isRLSpecific || (NoRLSpecificFlag && program?.rl_requirements);
};

// Tested
export const getMissingDocs = (application) => {
    if (!application) {
        return [];
    }

    let missingDocs = [];
    for (let docName of Object.keys(file_category_const)) {
        if (
            application?.programId[docName] === 'yes' &&
            !application?.doc_modification_thread?.some(
                (thread) =>
                    thread.doc_thread_id?.file_type ===
                    file_category_const[docName]
            )
        )
            missingDocs.push(file_category_const[docName]);
    }

    const nrRLNeeded = parseInt(application.programId.rl_required);
    const nrSpecificRL = application?.doc_modification_thread.filter((thread) =>
        thread.doc_thread_id?.file_type?.startsWith('RL_')
    ).length;
    if (
        nrRLNeeded > 0 &&
        checkIsRLspecific(application?.programId) &&
        nrRLNeeded > nrSpecificRL
    ) {
        missingDocs.push(
            `RL - ${nrRLNeeded} needed, ${nrSpecificRL} provided (${
                nrRLNeeded - nrSpecificRL
            } must be added)`
        );
    }

    return missingDocs;
};

export const getExtraDocs = (application) => {
    if (!application) {
        return [];
    }

    let extraDocs = [];
    for (let docName of Object.keys(file_category_const)) {
        if (
            application?.programId[docName] !== 'yes' &&
            application?.doc_modification_thread?.some(
                (thread) =>
                    thread.doc_thread_id?.file_type ===
                    file_category_const[docName]
            )
        )
            extraDocs.push(file_category_const[docName]);
    }

    const nrRLNeeded = parseInt(application.programId.rl_required);
    const nrSpecificRL = application?.doc_modification_thread.filter((thread) =>
        thread.doc_thread_id?.file_type?.startsWith('RL_')
    ).length;
    const nrSpecRLNeeded = !checkIsRLspecific(application?.programId)
        ? 0
        : nrRLNeeded;
    if (nrSpecRLNeeded < nrSpecificRL) {
        extraDocs.push(
            `RL - ${nrSpecRLNeeded} needed, ${nrSpecificRL} provided (${
                nrSpecificRL - nrSpecRLNeeded
            } can be removed)`
        );
    }
    return extraDocs;
};

export const isDocumentsMissingAssign = (application) => {
    if (!application) {
        return false;
    }
    return getMissingDocs(application).length > 0;
};

// Tested
export const does_essay_have_writers = (essayDocumentThreads) => {
    for (let i = 0; i < essayDocumentThreads.length; i += 1) {
        if (
            essayDocumentThreads[i].outsourced_user_id === undefined ||
            essayDocumentThreads[i].outsourced_user_id.length === 0
        ) {
            return false;
        }
    }
    return true;
};

export const extractTextFromDocx = async (arrayBuffer) => {
    const zip = await JSZip.loadAsync(arrayBuffer);
    const documentXml = await zip.file('word/document.xml')?.async('string');
    // Extract text from the XML content
    let textContent = documentXml?.replace(/<[^>]+>/g, ''); // Strip HTML tags
    // Extract header text if present
    let headerText = '';
    const headerXml = await zip
        .file('word/header1.xml')
        ?.async('string')
        .catch(() => ''); // Assuming there's only one header
    if (headerXml) {
        headerText = headerXml?.replace(/<[^>]+>/g, ''); // Strip XML tags
    }

    // Extract footer text if present
    let footerText = '';
    const footerXml = await zip
        .file('word/footer1.xml')
        ?.async('string')
        .catch(() => ''); // Assuming there's only one footer
    if (footerXml) {
        footerText = footerXml?.replace(/<[^>]+>/g, ''); // Strip XML tags
    }
    return { headerText, textContent, footerText };
};

export const readPDF = async (file, studentName) => {
    const checkPoints = {
        correctFirstname: {
            value: false,
            text: 'NOT Detected student first name in the document'
        }
    };
    const reader = new FileReader();
    const result = await new Promise((resolve, reject) => {
        reader.onload = async (event) => {
            try {
                const content = event.target.result;
                const typedarray = new Uint8Array(content);
                const pdf = await pdfjs.getDocument(typedarray).promise;
                let text = '';
                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    const pageTextContent = await page.getTextContent();
                    pageTextContent.items.forEach((item) => {
                        text += item.str + ' ';
                    });
                }
                if (text.toLowerCase().includes(studentName.toLowerCase())) {
                    checkPoints.correctFirstname.value = true;
                    checkPoints.correctFirstname.text =
                        checkPoints.correctFirstname.text.replace('NOT ', '');
                }
                resolve(checkPoints);
            } catch (error) {
                checkPoints.error = { value: true, text: error.message };
                reject(checkPoints);
            }
        };
        reader.readAsArrayBuffer(file);
    });
    return result;
};

export const readDOCX = async (file, studentName) => {
    const checkPoints = {
        correctFirstname: {
            value: false,
            text: 'NOT Detected student first name in the document'
        }
    };
    const reader = new FileReader();
    const result = await new Promise((resolve) => {
        reader.onload = async (event) => {
            const content = event.target.result;
            const { headerText, textContent, footerText } =
                await extractTextFromDocx(content);
            const combinedText =
                `${headerText}${textContent}${footerText}`.toLowerCase();
            if (combinedText.includes(studentName.toLowerCase())) {
                checkPoints.correctFirstname.value = true;
                checkPoints.correctFirstname.text =
                    checkPoints.correctFirstname.text.replace('NOT ', '');
            }
            if (headerText || footerText) {
                checkPoints.metadata = {
                    hasMetadata: true,
                    metaData: `Potential Risky Metadata, please double check if this is safe: Header: ${headerText} Footer: ${footerText}.`
                };
            }
            resolve(checkPoints);
        };
        reader.readAsArrayBuffer(file);
    });
    return result;
};

export const readXLSX = async (file, studentName) => {
    const checkPoints = {
        correctFirstname: {
            value: false,
            text: 'NOT Detected student first name in the document'
        }
    };
    const reader = new FileReader();
    const result = await new Promise((resolve) => {
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            let text = '';
            workbook.SheetNames.forEach((sheetName) => {
                const sheet = workbook.Sheets[sheetName];
                text += XLSX.utils.sheet_to_csv(sheet);
            });
            if (text.toLowerCase().includes(studentName.toLowerCase())) {
                checkPoints.correctFirstname.value = true;
                checkPoints.correctFirstname.text =
                    checkPoints.correctFirstname.text.replace('NOT ', '');
            }
            resolve(checkPoints);
        };
        reader.readAsArrayBuffer(file);
    });
    return result;
};

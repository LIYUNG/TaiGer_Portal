export const mockSingleData = {
    success: true,
    notification: {},
    data: [
        {
            _id: 'g1',
            agents: [
                {
                    _id: '639baebf8b84944b872cf648',
                    firstname: 'Leo',
                    lastname: 'TaiGer',
                    email: 'agent@gmail.com',
                    role: 'Agent'
                }
            ],
            editors: [
                {
                    _id: '64479a4d10496d3fe022834f',
                    firstname: 'Editor',
                    lastname: 'TaiGer',
                    email: 'editor@gmail.com',
                    role: 'Editor'
                }
            ],
            applying_program_count: 5,
            firstname: 'Testing-Student',
            lastname: 'Wang',
            email: 'wang.student@gmail.com',
            archiv: false,
            birthday: '2002-01-30',
            isAccountActivated: true,
            taigerai: {
                input: {
                    name: '',
                    status: 'missing',
                    file_category: 'Others',
                    path: ''
                },
                output: {
                    name: '',
                    status: 'missing',
                    file_category: 'Others',
                    path: ''
                },
                feedback: {
                    message: ''
                }
            },
            application_preference: {
                expected_application_date: '2024',
                expected_application_semester: 'WS',
                target_application_field: 'Management and technology ',
                considered_privat_universities: 'No',
                application_outside_germany: 'Yes',
                updatedAt: '2023-06-10T10:13:37.956Z',
                special_wished: '',
                target_degree: ''
            },
            academic_background: {
                university: {
                    high_school_isGraduated: 'Yes',
                    attended_high_school: 'Song Shan senior high school',
                    high_school_graduated_year: '2020',
                    attended_university:
                        'National Taichung University of Science and Technology',
                    attended_university_program: 'International Management',
                    isGraduated: 'pending',
                    expected_grad_date: '2024',
                    Has_Exchange_Experience: 'Yes',
                    Highest_GPA_Uni: 4,
                    Passing_GPA_Uni: 2,
                    My_GPA_Uni: 3.98,
                    updatedAt: '2023-06-10T10:12:55.837Z',
                    Has_Internship_Experience: '-',
                    Has_Working_Experience: '-'
                },
                language: {
                    english_isPassed: 'O',
                    english_certificate: 'TOEFL',
                    english_score: 'TOEFL 91 ( Still trying to get 100)',
                    english_test_date: '',
                    german_isPassed: '--',
                    german_certificate: '',
                    german_score: '',
                    german_test_date: '',
                    updatedAt: '2023-06-10T10:14:31.791Z',
                    english_score_listening: '',
                    english_score_reading: '',
                    english_score_speaking: '',
                    english_score_writing: '',
                    gmat_certificate: '',
                    gmat_isPassed: '-',
                    gmat_score: '',
                    gmat_test_date: '',
                    gre_certificate: '',
                    gre_isPassed: '-',
                    gre_score: '',
                    gre_test_date: ''
                }
            },
            role: 'Student',
            applications: [
                {
                    programId: {
                        _id: '2532fde46751651537974168',
                        school: 'Humboldt-Universität zu Berlin',
                        program_name: 'Horticultural Sciences',
                        degree: 'M. Sc.',
                        semester: 'WS',
                        lang: 'English',
                        uni_assist: 'Yes-FULL',
                        toefl: '87',
                        ielts: '6',
                        testdaf: '-',
                        ml_required: 'yes',
                        rl_required: '2',
                        essay_required: 'no',
                        special_notes:
                            'only 1 application for non-EU applicants',
                        country: 'de',
                        deprecated: 'no',
                        application_deadline: '05-31',
                        program_duration: '4 semesters',
                        tuition_fees: 'none',
                        daad_link:
                            '/deutschland/studienangebote/international-programmes/en/detail/8327/',
                        application_portal_a: 'https://my.uni-assist.de/login',
                        application_portal_a_instructions:
                            'https://taigerconsultancy-portal.com/docs/uniassist'
                    },
                    uni_assist: {
                        status: 'notstarted',
                        vpd_file_path: '',
                        vpd_paid_confirmation_file_path: '',
                        vpd_paid_confirmation_file_status: '',
                        isPaid: false
                    },
                    reject_reason: '',
                    finalEnrolment: false,
                    decided: '-',
                    closed: '-',
                    admission: '-',
                    _id: '659749e398c0cfc70acb7141',
                    doc_modification_thread: [
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: {
                                _id: '659749e398c0cfc70acb7142',
                                student_id: '64844b8687c9c3e882379d44',
                                outsourced_user_id: [],
                                file_type: 'ML',
                                program_id: '2532fde46751651537974168',
                                isFinalVersion: false,
                                student_input: {
                                    input_content: '',
                                    input_status: ''
                                },
                                updatedAt: '2024-01-05T00:14:27.893Z',
                                __v: 0
                            },
                            updatedAt: '2024-01-05T00:14:27.893Z',
                            createdAt: '2024-01-05T00:14:27.893Z',
                            _id: '659749e398c0cfc70acb7143'
                        },
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: {
                                _id: '659749e398c0cfc70acb7145',
                                student_id: '64844b8687c9c3e882379d44',
                                outsourced_user_id: [],
                                file_type: 'RL_A',
                                program_id: '2532fde46751651537974168',
                                isFinalVersion: false,
                                student_input: {
                                    input_content: '',
                                    input_status: ''
                                },
                                updatedAt: '2024-01-05T00:14:27.930Z',
                                __v: 0
                            },
                            updatedAt: '2024-01-05T00:14:27.930Z',
                            createdAt: '2024-01-05T00:14:27.930Z',
                            _id: '659749e398c0cfc70acb7146'
                        },
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: {
                                _id: '659749e398c0cfc70acb7148',
                                student_id: '64844b8687c9c3e882379d44',
                                outsourced_user_id: [],
                                file_type: 'RL_B',
                                program_id: '2532fde46751651537974168',
                                isFinalVersion: false,
                                student_input: {
                                    input_content: '',
                                    input_status: ''
                                },
                                updatedAt: '2024-01-05T00:14:27.967Z',
                                __v: 0
                            },
                            updatedAt: '2024-01-05T00:14:27.967Z',
                            createdAt: '2024-01-05T00:14:27.967Z',
                            _id: '659749e398c0cfc70acb7149'
                        }
                    ],
                    credential_a_filled: true,
                    credential_b_filled: true
                },
                {
                    programId: {
                        _id: '2532fde46751651538161525',
                        school: 'Weihenstephan-Triesdorf University of Applied Sciences',
                        program_name: 'Farm Management (MFM)',
                        degree: 'M. Sc.',
                        semester: 'WS',
                        lang: 'English',
                        uni_assist: 'Yes-VPD',
                        toefl: 'B1',
                        ielts: 'B1',
                        testdaf: '-',
                        ml_required: 'yes',
                        rl_required: '2',
                        country: 'de',
                        deprecated: 'no',
                        application_deadline: '06-15',
                        program_duration: '4 semesters',
                        tuition_fees: 'none',
                        daad_link:
                            '/deutschland/studienangebote/international-programmes/en/detail/8424/',
                        application_portal_a:
                            'https://wbmoodle.hswt.de/login/signup.php?lang=en'
                    },
                    uni_assist: {
                        status: 'notstarted',
                        vpd_file_path: '',
                        vpd_paid_confirmation_file_path: '',
                        vpd_paid_confirmation_file_status: '',
                        isPaid: false
                    },
                    reject_reason: '',
                    finalEnrolment: false,
                    decided: '-',
                    closed: '-',
                    admission: '-',
                    _id: '659749e398c0cfc70acb714b',
                    doc_modification_thread: [
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: {
                                _id: '659749e398c0cfc70acb714c',
                                student_id: '64844b8687c9c3e882379d44',
                                outsourced_user_id: [],
                                file_type: 'ML',
                                program_id: '2532fde46751651538161525',
                                isFinalVersion: false,
                                student_input: {
                                    input_content: '',
                                    input_status: ''
                                },
                                updatedAt: '2024-01-05T00:14:27.993Z',
                                __v: 0
                            },
                            updatedAt: '2024-01-05T00:14:27.993Z',
                            createdAt: '2024-01-05T00:14:27.993Z',
                            _id: '659749e398c0cfc70acb714d'
                        },
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: {
                                _id: '659749e498c0cfc70acb714f',
                                student_id: '64844b8687c9c3e882379d44',
                                outsourced_user_id: [],
                                file_type: 'RL_A',
                                program_id: '2532fde46751651538161525',
                                isFinalVersion: false,
                                student_input: {
                                    input_content: '',
                                    input_status: ''
                                },
                                updatedAt: '2024-01-05T00:14:28.023Z',
                                __v: 0
                            },
                            updatedAt: '2024-01-05T00:14:28.023Z',
                            createdAt: '2024-01-05T00:14:28.023Z',
                            _id: '659749e498c0cfc70acb7150'
                        },
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: {
                                _id: '659749e498c0cfc70acb7152',
                                student_id: '64844b8687c9c3e882379d44',
                                outsourced_user_id: [],
                                file_type: 'RL_B',
                                program_id: '2532fde46751651538161525',
                                isFinalVersion: false,
                                student_input: {
                                    input_content: '',
                                    input_status: ''
                                },
                                updatedAt: '2024-01-05T00:14:28.062Z',
                                __v: 0
                            },
                            updatedAt: '2024-01-05T00:14:28.062Z',
                            createdAt: '2024-01-05T00:14:28.062Z',
                            _id: '659749e498c0cfc70acb7153'
                        }
                    ],
                    credential_a_filled: true,
                    credential_b_filled: true
                },
                {
                    programId: {
                        _id: '2532fde46751651538083416',
                        school: 'Technische Universität München (TUM)',
                        program_name: 'Agricultural Biosciences',
                        degree: 'M. Sc.',
                        semester: 'WS',
                        lang: 'English',
                        uni_assist: 'Yes-VPD',
                        toefl: '88',
                        ielts: '6.5',
                        testdaf: '-',
                        gre: '-',
                        ml_required: 'yes',
                        rl_required: '0',
                        essay_required: 'no',
                        programSubjects: ['BIO-SCI'],
                        country: 'de',
                        deprecated: 'no',
                        application_deadline: '05-31',
                        program_duration: '4 semesters',
                        tuition_fees: 'none',
                        daad_link:
                            '/deutschland/studienangebote/international-programmes/en/detail/6527/',
                        application_start: '01-01',
                        application_portal_a:
                            'https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/#/login?$ctx=lang=en',
                        application_portal_a_instructions:
                            'https://taigerconsultancy-portal.com/docs/search/638535bddd0590bba4fe9775',
                        application_portal_b: 'https://my.uni-assist.de/login',
                        gmat: '-',
                        application_portal_b_instructions:
                            'https://taigerconsultancy-portal.com/docs/uniassist'
                    },
                    uni_assist: {
                        status: 'notstarted',
                        vpd_file_path: '',
                        vpd_paid_confirmation_file_path: '',
                        vpd_paid_confirmation_file_status: '',
                        isPaid: false
                    },
                    reject_reason: '',
                    finalEnrolment: false,
                    decided: 'O',
                    closed: '-',
                    admission: '-',
                    _id: '659749e498c0cfc70acb7155',
                    doc_modification_thread: [
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: {
                                _id: '659749e498c0cfc70acb7156',
                                student_id: '64844b8687c9c3e882379d44',
                                outsourced_user_id: [],
                                file_type: 'ML',
                                program_id: '2532fde46751651538083416',
                                isFinalVersion: false,
                                student_input: {
                                    input_content: '',
                                    input_status: ''
                                },
                                updatedAt: '2024-01-05T00:14:28.092Z',
                                __v: 0
                            },
                            updatedAt: '2024-01-05T00:14:28.092Z',
                            createdAt: '2024-01-05T00:14:28.092Z',
                            _id: '659749e498c0cfc70acb7157'
                        }
                    ],
                    credential_a_filled: true,
                    credential_b_filled: true
                }
            ],
            profile: [
                {
                    name: 'Bachelor_Certificate',
                    status: 'missing',
                    path: '',
                    feedback: '',
                    _id: '64844ca787c9c3e882379df4',
                    required: true,
                    updatedAt: '2023-06-10T10:12:55.987Z'
                },
                {
                    name: 'Bachelor_Transcript',
                    status: 'missing',
                    path: '',
                    feedback: '',
                    _id: '64844ca787c9c3e882379df5',
                    required: true,
                    updatedAt: '2023-06-10T10:12:55.988Z'
                },
                {
                    name: 'Course_Description',
                    status: 'missing',
                    path: '',
                    feedback: '',
                    _id: '64844ca787c9c3e882379df6',
                    required: true,
                    updatedAt: '2023-06-10T10:12:55.988Z'
                },
                {
                    name: 'Employment_Certificate',
                    status: 'missing',
                    path: '',
                    feedback: '',
                    _id: '64844ca787c9c3e882379df7',
                    required: true,
                    updatedAt: '2023-06-10T10:12:55.988Z'
                },
                {
                    name: 'ECTS_Conversion',
                    status: 'missing',
                    path: '',
                    feedback: '',
                    _id: '64844ca787c9c3e882379df8',
                    required: true,
                    updatedAt: '2023-06-10T10:12:55.988Z'
                },
                {
                    name: 'Exchange_Student_Certificate',
                    status: 'missing',
                    path: '',
                    feedback: '',
                    _id: '64844ca787c9c3e882379df9',
                    required: true,
                    updatedAt: '2023-06-10T10:12:55.988Z'
                },
                {
                    name: 'German_Certificate',
                    status: 'notneeded',
                    path: '',
                    feedback: '',
                    _id: '64844d0787c9c3e882379e3d',
                    required: true,
                    updatedAt: '2023-06-10T10:14:31.940Z'
                },
                {
                    name: 'Englisch_Certificate',
                    status: 'missing',
                    path: '',
                    feedback: '',
                    _id: '64844d0787c9c3e882379e3e',
                    required: true,
                    updatedAt: '2023-06-10T10:14:31.940Z'
                }
            ],
            generaldocs_threads: [],
            createdAt: '2023-06-10T10:08:06.638Z',
            updatedAt: '2024-01-14T20:27:45.597Z',
            __v: 7,
            lastLoginAt: '2023-06-10T10:17:57.856Z',
            linkedIn: '',
            needEditor: false
        }
    ]
};

export const mockTwoData = {
    success: true,
    notification: {},
    data: [
        {
            _id: '64844b8687c9c3e882379d44',
            agents: [
                {
                    _id: '639baebf8b84944b872cf648',
                    firstname: 'Agent',
                    lastname: 'firstnameAgent',
                    email: 'agent@gmail.com',
                    role: 'Agent'
                }
            ],
            editors: [
                {
                    _id: '64479a4d10496d3fe022834f',
                    firstname: 'editor',
                    lastname: 'firstnameEditor',
                    email: 'editor@gmail.com',
                    role: 'Editor'
                }
            ],
            applying_program_count: 5,
            firstname: 'TestStudent1',
            lastname: 'Lee',
            email: 'lee.teststudent1@gmail.com',
            archiv: false,
            birthday: '2002-01-30',
            isAccountActivated: true,
            taigerai: {
                input: {
                    name: '',
                    status: 'missing',
                    file_category: 'Others',
                    path: ''
                },
                output: {
                    name: '',
                    status: 'missing',
                    file_category: 'Others',
                    path: ''
                },
                feedback: {
                    message: ''
                }
            },
            application_preference: {
                expected_application_date: '2024',
                expected_application_semester: 'WS',
                target_application_field: 'Management and technology ',
                considered_privat_universities: 'No',
                application_outside_germany: 'Yes',
                updatedAt: '2023-06-10T10:13:37.956Z',
                special_wished: '',
                target_degree: ''
            },
            academic_background: {
                university: {
                    high_school_isGraduated: 'Yes',
                    attended_high_school: 'Song Shan senior high school ',
                    high_school_graduated_year: '2020',
                    attended_university:
                        'National Taiwan University of Science and Technology ',
                    attended_university_program: 'International Management ',
                    isGraduated: 'pending',
                    expected_grad_date: '2024',
                    Has_Exchange_Experience: 'Yes',
                    Highest_GPA_Uni: 4,
                    Passing_GPA_Uni: 2,
                    My_GPA_Uni: 3.98,
                    updatedAt: '2023-06-10T10:12:55.837Z',
                    Has_Internship_Experience: '-',
                    Has_Working_Experience: '-'
                },
                language: {
                    english_isPassed: 'O',
                    english_certificate: 'TOEFL',
                    english_score: 'TOEFL 91 ( Still trying to get 100)',
                    english_test_date: '',
                    german_isPassed: '--',
                    german_certificate: '',
                    german_score: '',
                    german_test_date: '',
                    updatedAt: '2023-06-10T10:14:31.791Z',
                    english_score_listening: '',
                    english_score_reading: '',
                    english_score_speaking: '',
                    english_score_writing: '',
                    gmat_certificate: '',
                    gmat_isPassed: '-',
                    gmat_score: '',
                    gmat_test_date: '',
                    gre_certificate: '',
                    gre_isPassed: '-',
                    gre_score: '',
                    gre_test_date: ''
                }
            },
            role: 'Student',
            applications: [
                {
                    programId: {
                        _id: '2532fde46751651537974168',
                        school: 'Humboldt-Universität zu Berlin',
                        program_name: 'Horticultural Sciences',
                        degree: 'M. Sc.',
                        semester: 'WS',
                        lang: 'English',
                        uni_assist: 'Yes-FULL',
                        toefl: '87',
                        ielts: '6',
                        testdaf: '-',
                        ml_required: 'yes',
                        rl_required: '2',
                        essay_required: 'no',
                        special_notes:
                            'only 1 application for non-EU applicants',
                        country: 'de',
                        deprecated: 'no',
                        application_deadline: '05-31',
                        program_duration: '4 semesters',
                        tuition_fees: 'none',
                        daad_link:
                            '/deutschland/studienangebote/international-programmes/en/detail/8327/',
                        application_portal_a: 'https://my.uni-assist.de/login',
                        application_portal_a_instructions:
                            'https://taigerconsultancy-portal.com/docs/uniassist'
                    },
                    uni_assist: {
                        status: 'notstarted',
                        vpd_file_path: '',
                        vpd_paid_confirmation_file_path: '',
                        vpd_paid_confirmation_file_status: '',
                        isPaid: false
                    },
                    reject_reason: '',
                    finalEnrolment: false,
                    decided: '-',
                    closed: '-',
                    admission: '-',
                    _id: '659749e398c0cfc70acb7141',
                    doc_modification_thread: [
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: {
                                _id: '659749e398c0cfc70acb7142',
                                student_id: '64844b8687c9c3e882379d44',
                                outsourced_user_id: [],
                                file_type: 'ML',
                                program_id: '2532fde46751651537974168',
                                isFinalVersion: false,
                                student_input: {
                                    input_content: '',
                                    input_status: ''
                                },
                                updatedAt: '2024-01-05T00:14:27.893Z',
                                __v: 0
                            },
                            updatedAt: '2024-01-05T00:14:27.893Z',
                            createdAt: '2024-01-05T00:14:27.893Z',
                            _id: '659749e398c0cfc70acb7143'
                        },
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: {
                                _id: '659749e398c0cfc70acb7145',
                                student_id: '64844b8687c9c3e882379d44',
                                outsourced_user_id: [],
                                file_type: 'RL_A',
                                program_id: '2532fde46751651537974168',
                                isFinalVersion: false,
                                student_input: {
                                    input_content: '',
                                    input_status: ''
                                },
                                updatedAt: '2024-01-05T00:14:27.930Z',
                                __v: 0
                            },
                            updatedAt: '2024-01-05T00:14:27.930Z',
                            createdAt: '2024-01-05T00:14:27.930Z',
                            _id: '659749e398c0cfc70acb7146'
                        },
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: {
                                _id: '659749e398c0cfc70acb7148',
                                student_id: '64844b8687c9c3e882379d44',
                                outsourced_user_id: [],
                                file_type: 'RL_B',
                                program_id: '2532fde46751651537974168',
                                isFinalVersion: false,
                                student_input: {
                                    input_content: '',
                                    input_status: ''
                                },
                                updatedAt: '2024-01-05T00:14:27.967Z',
                                __v: 0
                            },
                            updatedAt: '2024-01-05T00:14:27.967Z',
                            createdAt: '2024-01-05T00:14:27.967Z',
                            _id: '659749e398c0cfc70acb7149'
                        }
                    ],
                    credential_a_filled: true,
                    credential_b_filled: true
                },
                {
                    programId: {
                        _id: '2532fde46751651538161525',
                        school: 'Weihenstephan-Triesdorf University of Applied Sciences',
                        program_name: 'Farm Management (MFM)',
                        degree: 'M. Sc.',
                        semester: 'WS',
                        lang: 'English',
                        uni_assist: 'Yes-VPD',
                        toefl: 'B1',
                        ielts: 'B1',
                        testdaf: '-',
                        ml_required: 'yes',
                        rl_required: '2',
                        country: 'de',
                        deprecated: 'no',
                        application_deadline: '06-15',
                        program_duration: '4 semesters',
                        tuition_fees: 'none',
                        daad_link:
                            '/deutschland/studienangebote/international-programmes/en/detail/8424/',
                        application_portal_a:
                            'https://wbmoodle.hswt.de/login/signup.php?lang=en'
                    },
                    uni_assist: {
                        status: 'notstarted',
                        vpd_file_path: '',
                        vpd_paid_confirmation_file_path: '',
                        vpd_paid_confirmation_file_status: '',
                        isPaid: false
                    },
                    reject_reason: '',
                    finalEnrolment: false,
                    decided: '-',
                    closed: '-',
                    admission: '-',
                    _id: '659749e398c0cfc70acb714b',
                    doc_modification_thread: [
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: {
                                _id: '659749e398c0cfc70acb714c',
                                student_id: '64844b8687c9c3e882379d44',
                                outsourced_user_id: [],
                                file_type: 'ML',
                                program_id: '2532fde46751651538161525',
                                isFinalVersion: false,
                                student_input: {
                                    input_content: '',
                                    input_status: ''
                                },
                                updatedAt: '2024-01-05T00:14:27.993Z',
                                __v: 0
                            },
                            updatedAt: '2024-01-05T00:14:27.993Z',
                            createdAt: '2024-01-05T00:14:27.993Z',
                            _id: '659749e398c0cfc70acb714d'
                        },
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: {
                                _id: '659749e498c0cfc70acb714f',
                                student_id: '64844b8687c9c3e882379d44',
                                outsourced_user_id: [],
                                file_type: 'RL_A',
                                program_id: '2532fde46751651538161525',
                                isFinalVersion: false,
                                student_input: {
                                    input_content: '',
                                    input_status: ''
                                },
                                updatedAt: '2024-01-05T00:14:28.023Z',
                                __v: 0
                            },
                            updatedAt: '2024-01-05T00:14:28.023Z',
                            createdAt: '2024-01-05T00:14:28.023Z',
                            _id: '659749e498c0cfc70acb7150'
                        },
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: {
                                _id: '659749e498c0cfc70acb7152',
                                student_id: '64844b8687c9c3e882379d44',
                                outsourced_user_id: [],
                                file_type: 'RL_B',
                                program_id: '2532fde46751651538161525',
                                isFinalVersion: false,
                                student_input: {
                                    input_content: '',
                                    input_status: ''
                                },
                                updatedAt: '2024-01-05T00:14:28.062Z',
                                __v: 0
                            },
                            updatedAt: '2024-01-05T00:14:28.062Z',
                            createdAt: '2024-01-05T00:14:28.062Z',
                            _id: '659749e498c0cfc70acb7153'
                        }
                    ],
                    credential_a_filled: true,
                    credential_b_filled: true
                },
                {
                    programId: {
                        _id: '2532fde46751651538083416',
                        school: 'Technische Universität München (TUM)',
                        program_name: 'Agricultural Biosciences',
                        degree: 'M. Sc.',
                        semester: 'WS',
                        lang: 'English',
                        uni_assist: 'Yes-VPD',
                        toefl: '88',
                        ielts: '6.5',
                        testdaf: '-',
                        gre: '-',
                        ml_required: 'yes',
                        rl_required: '0',
                        essay_required: 'no',
                        programSubjects: ['BIO-SCI'],
                        country: 'de',
                        deprecated: 'no',
                        application_deadline: '05-31',
                        program_duration: '4 semesters',
                        tuition_fees: 'none',
                        daad_link:
                            '/deutschland/studienangebote/international-programmes/en/detail/6527/',
                        application_start: '01-01',
                        application_portal_a:
                            'https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/#/login?$ctx=lang=en',
                        application_portal_a_instructions:
                            'https://taigerconsultancy-portal.com/docs/search/638535bddd0590bba4fe9775',
                        application_portal_b: 'https://my.uni-assist.de/login',
                        gmat: '-',
                        application_portal_b_instructions:
                            'https://taigerconsultancy-portal.com/docs/uniassist'
                    },
                    uni_assist: {
                        status: 'notstarted',
                        vpd_file_path: '',
                        vpd_paid_confirmation_file_path: '',
                        vpd_paid_confirmation_file_status: '',
                        isPaid: false
                    },
                    reject_reason: '',
                    finalEnrolment: false,
                    decided: '-',
                    closed: '-',
                    admission: '-',
                    _id: '659749e498c0cfc70acb7155',
                    doc_modification_thread: [
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: {
                                _id: '659749e498c0cfc70acb7156',
                                student_id: '64844b8687c9c3e882379d44',
                                outsourced_user_id: [],
                                file_type: 'ML',
                                program_id: '2532fde46751651538083416',
                                isFinalVersion: false,
                                student_input: {
                                    input_content: '',
                                    input_status: ''
                                },
                                updatedAt: '2024-01-05T00:14:28.092Z',
                                __v: 0
                            },
                            updatedAt: '2024-01-05T00:14:28.092Z',
                            createdAt: '2024-01-05T00:14:28.092Z',
                            _id: '659749e498c0cfc70acb7157'
                        }
                    ],
                    credential_a_filled: true,
                    credential_b_filled: true
                }
            ],
            profile: [
                {
                    name: 'Bachelor_Certificate',
                    status: 'missing',
                    path: '',
                    feedback: '',
                    _id: '64844ca787c9c3e882379df4',
                    required: true,
                    updatedAt: '2023-06-10T10:12:55.987Z'
                },
                {
                    name: 'Bachelor_Transcript',
                    status: 'missing',
                    path: '',
                    feedback: '',
                    _id: '64844ca787c9c3e882379df5',
                    required: true,
                    updatedAt: '2023-06-10T10:12:55.988Z'
                },
                {
                    name: 'Course_Description',
                    status: 'missing',
                    path: '',
                    feedback: '',
                    _id: '64844ca787c9c3e882379df6',
                    required: true,
                    updatedAt: '2023-06-10T10:12:55.988Z'
                },
                {
                    name: 'Employment_Certificate',
                    status: 'missing',
                    path: '',
                    feedback: '',
                    _id: '64844ca787c9c3e882379df7',
                    required: true,
                    updatedAt: '2023-06-10T10:12:55.988Z'
                },
                {
                    name: 'ECTS_Conversion',
                    status: 'missing',
                    path: '',
                    feedback: '',
                    _id: '64844ca787c9c3e882379df8',
                    required: true,
                    updatedAt: '2023-06-10T10:12:55.988Z'
                },
                {
                    name: 'Exchange_Student_Certificate',
                    status: 'missing',
                    path: '',
                    feedback: '',
                    _id: '64844ca787c9c3e882379df9',
                    required: true,
                    updatedAt: '2023-06-10T10:12:55.988Z'
                },
                {
                    name: 'German_Certificate',
                    status: 'notneeded',
                    path: '',
                    feedback: '',
                    _id: '64844d0787c9c3e882379e3d',
                    required: true,
                    updatedAt: '2023-06-10T10:14:31.940Z'
                },
                {
                    name: 'Englisch_Certificate',
                    status: 'missing',
                    path: '',
                    feedback: '',
                    _id: '64844d0787c9c3e882379e3e',
                    required: true,
                    updatedAt: '2023-06-10T10:14:31.940Z'
                }
            ],
            generaldocs_threads: [],
            createdAt: '2023-06-10T10:08:06.638Z',
            updatedAt: '2024-01-14T20:27:45.597Z',
            __v: 7,
            lastLoginAt: '2023-06-10T10:17:57.856Z',
            linkedIn: '',
            needEditor: false
        },
        {
            _id: '2',
            agents: [
                {
                    _id: '639baebf8b84944b872cf648',
                    firstname: 'Leo',
                    lastname: 'firstnameAgent',
                    email: 'taiger.leoc@gmail.com',
                    role: 'Agent'
                }
            ],
            editors: [
                {
                    _id: '64479a4d10496d3fe022834f',
                    firstname: 'editor',
                    lastname: 'firstnameEditor',
                    email: 'taiger.sols@gmail.com',
                    role: 'Editor'
                }
            ],
            applying_program_count: 5,
            firstname: 'TestStudent2',
            lastname: 'Chen',
            email: 'chen.teststudent2@gmail.com',
            archiv: false,
            birthday: '2002-01-30',
            isAccountActivated: true,
            taigerai: {
                input: {
                    name: '',
                    status: 'missing',
                    file_category: 'Others',
                    path: ''
                },
                output: {
                    name: '',
                    status: 'missing',
                    file_category: 'Others',
                    path: ''
                },
                feedback: {
                    message: ''
                }
            },
            application_preference: {
                expected_application_date: '2024',
                expected_application_semester: 'WS',
                target_application_field: 'Management and technology ',
                considered_privat_universities: 'No',
                application_outside_germany: 'Yes',
                updatedAt: '2023-06-10T10:13:37.956Z',
                special_wished: '',
                target_degree: ''
            },
            academic_background: {
                university: {
                    high_school_isGraduated: 'Yes',
                    attended_high_school: 'Song Shan senior high school ',
                    high_school_graduated_year: '2020',
                    attended_university: 'National Taipei University',
                    attended_university_program: 'International Management ',
                    isGraduated: 'pending',
                    expected_grad_date: '2024',
                    Has_Exchange_Experience: 'Yes',
                    Highest_GPA_Uni: 4,
                    Passing_GPA_Uni: 2,
                    My_GPA_Uni: 3.98,
                    updatedAt: '2023-06-10T10:12:55.837Z',
                    Has_Internship_Experience: '-',
                    Has_Working_Experience: '-'
                },
                language: {
                    english_isPassed: 'O',
                    english_certificate: 'TOEFL',
                    english_score: 'TOEFL 91 ( Still trying to get 100)',
                    english_test_date: '',
                    german_isPassed: '--',
                    german_certificate: '',
                    german_score: '',
                    german_test_date: '',
                    updatedAt: '2023-06-10T10:14:31.791Z',
                    english_score_listening: '',
                    english_score_reading: '',
                    english_score_speaking: '',
                    english_score_writing: '',
                    gmat_certificate: '',
                    gmat_isPassed: '-',
                    gmat_score: '',
                    gmat_test_date: '',
                    gre_certificate: '',
                    gre_isPassed: '-',
                    gre_score: '',
                    gre_test_date: ''
                }
            },
            role: 'Student',
            applications: [
                {
                    programId: {
                        _id: '2532fde46751651537974168',
                        school: 'Humboldt-Universität zu Berlin',
                        program_name: 'Horticultural Sciences',
                        degree: 'M. Sc.',
                        semester: 'WS',
                        lang: 'English',
                        uni_assist: 'Yes-FULL',
                        toefl: '87',
                        ielts: '6',
                        testdaf: '-',
                        ml_required: 'yes',
                        rl_required: '2',
                        essay_required: 'no',
                        special_notes:
                            'only 1 application for non-EU applicants',
                        country: 'de',
                        deprecated: 'no',
                        application_deadline: '05-31',
                        program_duration: '4 semesters',
                        tuition_fees: 'none',
                        daad_link:
                            '/deutschland/studienangebote/international-programmes/en/detail/8327/',
                        application_portal_a: 'https://my.uni-assist.de/login',
                        application_portal_a_instructions:
                            'https://taigerconsultancy-portal.com/docs/uniassist'
                    },
                    uni_assist: {
                        status: 'notstarted',
                        vpd_file_path: '',
                        vpd_paid_confirmation_file_path: '',
                        vpd_paid_confirmation_file_status: '',
                        isPaid: false
                    },
                    reject_reason: '',
                    finalEnrolment: false,
                    decided: '-',
                    closed: '-',
                    admission: '-',
                    _id: '659749e398c0cfc70acb7141',
                    doc_modification_thread: [
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: {
                                _id: '659749e398c0cfc70acb7142',
                                student_id: '64844b8687c9c3e882379d44',
                                outsourced_user_id: [],
                                file_type: 'ML',
                                program_id: '2532fde46751651537974168',
                                isFinalVersion: false,
                                student_input: {
                                    input_content: '',
                                    input_status: ''
                                },
                                updatedAt: '2024-01-05T00:14:27.893Z',
                                __v: 0
                            },
                            updatedAt: '2024-01-05T00:14:27.893Z',
                            createdAt: '2024-01-05T00:14:27.893Z',
                            _id: '659749e398c0cfc70acb7143'
                        },
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: {
                                _id: '659749e398c0cfc70acb7145',
                                student_id: '64844b8687c9c3e882379d44',
                                outsourced_user_id: [],
                                file_type: 'RL_A',
                                program_id: '2532fde46751651537974168',
                                isFinalVersion: false,
                                student_input: {
                                    input_content: '',
                                    input_status: ''
                                },
                                updatedAt: '2024-01-05T00:14:27.930Z',
                                __v: 0
                            },
                            updatedAt: '2024-01-05T00:14:27.930Z',
                            createdAt: '2024-01-05T00:14:27.930Z',
                            _id: '659749e398c0cfc70acb7146'
                        },
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: {
                                _id: '659749e398c0cfc70acb7148',
                                student_id: '64844b8687c9c3e882379d44',
                                outsourced_user_id: [],
                                file_type: 'RL_B',
                                program_id: '2532fde46751651537974168',
                                isFinalVersion: false,
                                student_input: {
                                    input_content: '',
                                    input_status: ''
                                },
                                updatedAt: '2024-01-05T00:14:27.967Z',
                                __v: 0
                            },
                            updatedAt: '2024-01-05T00:14:27.967Z',
                            createdAt: '2024-01-05T00:14:27.967Z',
                            _id: '659749e398c0cfc70acb7149'
                        }
                    ],
                    credential_a_filled: true,
                    credential_b_filled: true
                },
                {
                    programId: {
                        _id: '2532fde46751651538161525',
                        school: 'Weihenstephan-Triesdorf University of Applied Sciences',
                        program_name: 'Farm Management (MFM)',
                        degree: 'M. Sc.',
                        semester: 'WS',
                        lang: 'English',
                        uni_assist: 'Yes-VPD',
                        toefl: 'B1',
                        ielts: 'B1',
                        testdaf: '-',
                        ml_required: 'yes',
                        rl_required: '2',
                        country: 'de',
                        deprecated: 'no',
                        application_deadline: '06-15',
                        program_duration: '4 semesters',
                        tuition_fees: 'none',
                        daad_link:
                            '/deutschland/studienangebote/international-programmes/en/detail/8424/',
                        application_portal_a:
                            'https://wbmoodle.hswt.de/login/signup.php?lang=en'
                    },
                    uni_assist: {
                        status: 'notstarted',
                        vpd_file_path: '',
                        vpd_paid_confirmation_file_path: '',
                        vpd_paid_confirmation_file_status: '',
                        isPaid: false
                    },
                    reject_reason: '',
                    finalEnrolment: false,
                    decided: '-',
                    closed: '-',
                    admission: '-',
                    _id: '659749e398c0cfc70acb714b',
                    doc_modification_thread: [
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: {
                                _id: '659749e398c0cfc70acb714c',
                                student_id: '64844b8687c9c3e882379d44',
                                outsourced_user_id: [],
                                file_type: 'ML',
                                program_id: '2532fde46751651538161525',
                                isFinalVersion: false,
                                student_input: {
                                    input_content: '',
                                    input_status: ''
                                },
                                updatedAt: '2024-01-05T00:14:27.993Z',
                                __v: 0
                            },
                            updatedAt: '2024-01-05T00:14:27.993Z',
                            createdAt: '2024-01-05T00:14:27.993Z',
                            _id: '659749e398c0cfc70acb714d'
                        },
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: {
                                _id: '659749e498c0cfc70acb714f',
                                student_id: '64844b8687c9c3e882379d44',
                                outsourced_user_id: [],
                                file_type: 'RL_A',
                                program_id: '2532fde46751651538161525',
                                isFinalVersion: false,
                                student_input: {
                                    input_content: '',
                                    input_status: ''
                                },
                                updatedAt: '2024-01-05T00:14:28.023Z',
                                __v: 0
                            },
                            updatedAt: '2024-01-05T00:14:28.023Z',
                            createdAt: '2024-01-05T00:14:28.023Z',
                            _id: '659749e498c0cfc70acb7150'
                        },
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: {
                                _id: '659749e498c0cfc70acb7152',
                                student_id: '64844b8687c9c3e882379d44',
                                outsourced_user_id: [],
                                file_type: 'RL_B',
                                program_id: '2532fde46751651538161525',
                                isFinalVersion: false,
                                student_input: {
                                    input_content: '',
                                    input_status: ''
                                },
                                updatedAt: '2024-01-05T00:14:28.062Z',
                                __v: 0
                            },
                            updatedAt: '2024-01-05T00:14:28.062Z',
                            createdAt: '2024-01-05T00:14:28.062Z',
                            _id: '659749e498c0cfc70acb7153'
                        }
                    ],
                    credential_a_filled: true,
                    credential_b_filled: true
                },
                {
                    programId: {
                        _id: '2532fde46751651538083416',
                        school: 'Technische Universität München (TUM)',
                        program_name: 'Agricultural Biosciences',
                        degree: 'M. Sc.',
                        semester: 'WS',
                        lang: 'English',
                        uni_assist: 'Yes-VPD',
                        toefl: '88',
                        ielts: '6.5',
                        testdaf: '-',
                        gre: '-',
                        ml_required: 'yes',
                        rl_required: '0',
                        essay_required: 'no',
                        programSubjects: ['BIO-SCI'],
                        country: 'de',
                        deprecated: 'no',
                        application_deadline: '05-31',
                        program_duration: '4 semesters',
                        tuition_fees: 'none',
                        daad_link:
                            '/deutschland/studienangebote/international-programmes/en/detail/6527/',
                        application_start: '01-01',
                        application_portal_a:
                            'https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/#/login?$ctx=lang=en',
                        application_portal_a_instructions:
                            'https://taigerconsultancy-portal.com/docs/search/638535bddd0590bba4fe9775',
                        application_portal_b: 'https://my.uni-assist.de/login',
                        gmat: '-',
                        application_portal_b_instructions:
                            'https://taigerconsultancy-portal.com/docs/uniassist'
                    },
                    uni_assist: {
                        status: 'notstarted',
                        vpd_file_path: '',
                        vpd_paid_confirmation_file_path: '',
                        vpd_paid_confirmation_file_status: '',
                        isPaid: false
                    },
                    reject_reason: '',
                    finalEnrolment: false,
                    decided: '-',
                    closed: '-',
                    admission: '-',
                    _id: '659749e498c0cfc70acb7155',
                    doc_modification_thread: [
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: {
                                _id: '659749e498c0cfc70acb7156',
                                student_id: '64844b8687c9c3e882379d44',
                                outsourced_user_id: [],
                                file_type: 'ML',
                                program_id: '2532fde46751651538083416',
                                isFinalVersion: false,
                                student_input: {
                                    input_content: '',
                                    input_status: ''
                                },
                                updatedAt: '2024-01-05T00:14:28.092Z',
                                __v: 0
                            },
                            updatedAt: '2024-01-05T00:14:28.092Z',
                            createdAt: '2024-01-05T00:14:28.092Z',
                            _id: '659749e498c0cfc70acb7157'
                        }
                    ],
                    credential_a_filled: true,
                    credential_b_filled: true
                }
            ],
            profile: [
                {
                    name: 'Bachelor_Certificate',
                    status: 'missing',
                    path: '',
                    feedback: '',
                    _id: '64844ca787c9c3e882379df4',
                    required: true,
                    updatedAt: '2023-06-10T10:12:55.987Z'
                },
                {
                    name: 'Bachelor_Transcript',
                    status: 'missing',
                    path: '',
                    feedback: '',
                    _id: '64844ca787c9c3e882379df5',
                    required: true,
                    updatedAt: '2023-06-10T10:12:55.988Z'
                },
                {
                    name: 'Course_Description',
                    status: 'missing',
                    path: '',
                    feedback: '',
                    _id: '64844ca787c9c3e882379df6',
                    required: true,
                    updatedAt: '2023-06-10T10:12:55.988Z'
                },
                {
                    name: 'Employment_Certificate',
                    status: 'missing',
                    path: '',
                    feedback: '',
                    _id: '64844ca787c9c3e882379df7',
                    required: true,
                    updatedAt: '2023-06-10T10:12:55.988Z'
                },
                {
                    name: 'ECTS_Conversion',
                    status: 'missing',
                    path: '',
                    feedback: '',
                    _id: '64844ca787c9c3e882379df8',
                    required: true,
                    updatedAt: '2023-06-10T10:12:55.988Z'
                },
                {
                    name: 'Exchange_Student_Certificate',
                    status: 'missing',
                    path: '',
                    feedback: '',
                    _id: '64844ca787c9c3e882379df9',
                    required: true,
                    updatedAt: '2023-06-10T10:12:55.988Z'
                },
                {
                    name: 'German_Certificate',
                    status: 'notneeded',
                    path: '',
                    feedback: '',
                    _id: '64844d0787c9c3e882379e3d',
                    required: true,
                    updatedAt: '2023-06-10T10:14:31.940Z'
                },
                {
                    name: 'Englisch_Certificate',
                    status: 'missing',
                    path: '',
                    feedback: '',
                    _id: '64844d0787c9c3e882379e3e',
                    required: true,
                    updatedAt: '2023-06-10T10:14:31.940Z'
                }
            ],
            generaldocs_threads: [],
            createdAt: '2023-06-10T10:08:06.638Z',
            updatedAt: '2024-01-14T20:27:45.597Z',
            __v: 7,
            lastLoginAt: '2023-06-10T10:17:57.856Z',
            linkedIn: '',
            needEditor: false
        }
    ]
};

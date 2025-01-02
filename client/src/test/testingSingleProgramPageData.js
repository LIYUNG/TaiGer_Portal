export const mockSingleProgramNoStudentsData = {
    success: true,
    data: {
        _id: '2532fde46751651538084485',
        school: 'Technische Universität München (TUM)',
        program_name: 'Management & Technology (MMT)',
        degree: 'M. Sc.',
        semester: 'WS',
        lang: 'English',
        uni_assist: 'Yes-VPD',
        toefl: '88',
        ielts: '6.5',
        testdaf: '-',
        ml_required: 'no',
        rl_required: '0',
        essay_required: 'yes',
        website: 'https://www.wi.tum.de/programs/master-mt/application/',
        programSubjects: ['DS-AI'],
        country: 'eu',
        deprecated: 'no',
        application_deadline: '05-31',
        program_duration: '4 semesters',
        tuition_fees: 'none',
        daad_link:
            '/deutschland/studienangebote/international-programmes/en/detail/4837/',
        application_start: '04-01',
        application_portal_a:
            'https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/#/login?$ctx=lang=en',
        application_portal_a_instructions:
            'https://taigerconsultancy-portal.com/docs/search/638535bddd0590bba4fe9775',
        application_portal_b: 'https://my.uni-assist.de/login',
        gmat: '700',
        updatedAt: '2024-03-05T10:41:46.232Z',
        whoupdated: 'Leo TaiGer',
        essay_requirements:
            'Please go to TUM MMT website and find the topics. The topics change in every semester.',
        supplementary_form_required: 'yes',
        supplementary_form_requirements: 'https://ca.mgt.tum.de/',
        application_portal_b_instructions:
            'https://taigerconsultancy-portal.com/docs/uniassist',
        optionalDocuments: [],
        requiredDocuments: []
    }
};

export const mockSingleProgramWithStudentsData = {
    success: true,
    data: {
        _id: '2532fde46751651538084485',
        school: 'Technische Universität München (TUM)',
        program_name: 'Management & Technology (MMT)',
        degree: 'M. Sc.',
        semester: 'WS',
        lang: 'English',
        uni_assist: 'Yes-VPD',
        toefl: '88',
        ielts: '6.5',
        testdaf: '-',
        ml_required: 'no',
        rl_required: '0',
        essay_required: 'yes',
        website: 'https://www.wi.tum.de/programs/master-mt/application/',
        programSubjects: ['DS-AI'],
        country: 'eu',
        deprecated: 'no',
        application_deadline: '05-31',
        program_duration: '4 semesters',
        tuition_fees: 'none',
        daad_link:
            '/deutschland/studienangebote/international-programmes/en/detail/4837/',
        application_start: '04-01',
        application_portal_a:
            'https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/#/login?$ctx=lang=en',
        application_portal_a_instructions:
            'https://taigerconsultancy-portal.com/docs/search/638535bddd0590bba4fe9775',
        application_portal_b: 'https://my.uni-assist.de/login',
        gmat: '700',
        updatedAt: '2024-03-05T10:41:46.232Z',
        whoupdated: 'Leo TaiGer',
        essay_requirements:
            'Please go to TUM MMT website and find the topics. The topics change in every semester.',
        supplementary_form_required: 'yes',
        supplementary_form_requirements: 'https://ca.mgt.tum.de/',
        application_portal_b_instructions:
            'https://taigerconsultancy-portal.com/docs/uniassist',
        optionalDocuments: [],
        requiredDocuments: []
    },
    students: [
        {
            application_preference: {
                expected_application_date: '2023'
            },
            _id: '63b95e26cd18b9adc03bb5f0',
            agents: [
                {
                    _id: '63b95dafcd18b9adc03bb5e6',
                    firstname: 'AgentFirstname',
                    role: 'Agent'
                }
            ],
            editors: [
                {
                    _id: '63d0340a28377228562d33ed',
                    firstname: 'EditorFirstname',
                    role: 'Editor'
                }
            ],
            firstname: 'Student1-Closed1',
            lastname: 'Wo',
            role: 'Student',
            applications: [
                {
                    uni_assist: {
                        vpd_paid_confirmation_file_path: '',
                        vpd_paid_confirmation_file_status: '',
                        isPaid: false,
                        status: 'uploaded',
                        vpd_file_path:
                            '63b95e26cd18b9adc03bb5f0/Wo_Kay-King_Technische_Universität_München_(TUM)_Management_&_Technology_(MMT)_VPD.pdf',
                        updatedAt: '2023-04-04T08:56:14.659Z'
                    },
                    finalEnrolment: false,
                    programId: '2532fde46751651538084485',
                    reject_reason: '',
                    decided: 'O',
                    closed: 'O',
                    admission: '-',
                    _id: '63c554db2f294a90f28a829f',
                    doc_modification_thread: [
                        {
                            isFinalVersion: true,
                            latest_message_left_by_id:
                                '63d0340a28377228562d33ed',
                            doc_thread_id: '63c554db2f294a90f28a82a9',
                            updatedAt: '2023-05-31T12:36:45.465Z',
                            createdAt: '2023-01-16T13:44:59.974Z',
                            _id: '63c554db2f294a90f28a82aa'
                        }
                    ]
                },
                {
                    uni_assist: {
                        vpd_paid_confirmation_file_path: '',
                        vpd_paid_confirmation_file_status: '',
                        isPaid: false,
                        status: 'notstarted',
                        vpd_file_path: ''
                    },
                    finalEnrolment: false,
                    programId: '2532fde46751651538140553',
                    reject_reason: '',
                    decided: 'O',
                    closed: 'O',
                    admission: '-',
                    _id: '63c555a72f294a90f28a82d5',
                    doc_modification_thread: []
                }
            ]
        },
        {
            application_preference: {
                expected_application_date: '2023'
            },
            _id: '63b9a785f7b3a4a141267dbf',
            agents: [
                {
                    _id: '639baebf8b84944b872cf648',
                    firstname: 'AgentFirstname',
                    role: 'Agent'
                }
            ],
            editors: [
                {
                    _id: '64479a4d10496d3fe022834f',
                    firstname: 'EditorFirstname',
                    role: 'Editor'
                }
            ],
            firstname: 'StudentInProgress-Sian',
            lastname: 'Liu',
            role: 'Student',
            applications: [
                {
                    uni_assist: {
                        vpd_paid_confirmation_file_path: '',
                        vpd_paid_confirmation_file_status: '',
                        status: 'notstarted',
                        vpd_file_path: '',
                        isPaid: false
                    },
                    finalEnrolment: false,
                    programId: '2532fde46751651538084485',
                    reject_reason: '',
                    decided: 'O',
                    closed: '-',
                    admission: '-',
                    _id: '64fb8f13c625e7033f967e95',
                    doc_modification_thread: [
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: '64fb8f13c625e7033f967e96',
                            updatedAt: '2023-09-08T21:16:03.376Z',
                            createdAt: '2023-09-08T21:16:03.376Z',
                            _id: '64fb8f13c625e7033f967e97'
                        },
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: '64fb8f13c625e7033f967e99',
                            updatedAt: '2023-09-08T21:16:03.418Z',
                            createdAt: '2023-09-08T21:16:03.418Z',
                            _id: '64fb8f13c625e7033f967e9a'
                        }
                    ]
                }
            ]
        },
        {
            application_preference: {
                expected_application_date: '2023'
            },
            _id: '63be7aff8d4ce70477309776',
            agents: [
                {
                    _id: '63b95dafcd18b9adc03bb5e6',
                    firstname: 'AgentFirstname',
                    role: 'Agent'
                }
            ],
            editors: [
                {
                    _id: '63d0340a28377228562d33ed',
                    firstname: 'EditorFirstname',
                    role: 'Editor'
                }
            ],
            firstname: 'Student-Closed2',
            lastname: 'Pan',
            role: 'Student',
            applications: [
                {
                    uni_assist: {
                        vpd_paid_confirmation_file_path: '',
                        vpd_paid_confirmation_file_status: '',
                        isPaid: false,
                        status: 'uploaded',
                        vpd_file_path:
                            '63be7aff8d4ce70477309776/Pan_Kuan-Yu_Technische_Universität_München_(TUM)_Management_&_Technology_(MMT)_VPD.pdf',
                        updatedAt: '2023-01-20T04:03:55.892Z'
                    },
                    finalEnrolment: false,
                    programId: '2532fde46751651538084485',
                    reject_reason: '',
                    decided: 'O',
                    closed: 'O',
                    admission: '-',
                    _id: '63c554c12f294a90f28a828c',
                    doc_modification_thread: [
                        {
                            isFinalVersion: true,
                            latest_message_left_by_id:
                                '63d0340a28377228562d33ed',
                            doc_thread_id: '63c554c12f294a90f28a8296',
                            updatedAt: '2023-05-31T12:41:22.283Z',
                            createdAt: '2023-01-16T13:44:33.590Z',
                            _id: '63c554c12f294a90f28a8297'
                        }
                    ]
                },
                {
                    uni_assist: {
                        vpd_paid_confirmation_file_path: '',
                        vpd_paid_confirmation_file_status: '',
                        isPaid: false,
                        status: 'notstarted',
                        vpd_file_path: ''
                    },
                    finalEnrolment: false,
                    programId: '2532fde46751651538140553',
                    reject_reason: '',
                    decided: 'O',
                    closed: 'O',
                    admission: '-',
                    _id: '63c555012f294a90f28a82b2',
                    doc_modification_thread: []
                },
                {
                    uni_assist: {
                        vpd_paid_confirmation_file_path: '',
                        vpd_paid_confirmation_file_status: '',
                        isPaid: false,
                        status: 'uploaded',
                        vpd_file_path:
                            '63be7aff8d4ce70477309776/Pan_Kuan-Yu_Technische_Universität_München_(TUM)_Sustainable_Management_and_Technology_VPD.pdf',
                        updatedAt: '2023-05-04T08:35:10.503Z'
                    },
                    finalEnrolment: false,
                    programId: '2532fde46751651538087678',
                    reject_reason: '',
                    decided: 'O',
                    closed: 'O',
                    admission: '-',
                    _id: '64516cb7ad0e5387da47f8e5',
                    doc_modification_thread: [
                        {
                            isFinalVersion: true,
                            latest_message_left_by_id:
                                '63d0340a28377228562d33ed',
                            doc_thread_id: '64516cb7ad0e5387da47f8ef',
                            updatedAt: '2023-05-31T12:41:22.582Z',
                            createdAt: '2023-05-02T20:04:07.928Z',
                            _id: '64516cb7ad0e5387da47f8f0'
                        }
                    ]
                }
            ]
        }
    ]
};

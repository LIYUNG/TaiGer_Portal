export const mockSingleArchivStudentData = {
    success: true,
    notification: {},
    data: [
        {
            _id: '647d1c026f4c8c637dd1c915',
            agents: [
                {
                    _id: '639baebf8b84944b872cf648',
                    firstname: 'Leo-Test',
                    lastname: 'TaiGer',
                    role: 'Agent'
                }
            ],
            editors: [
                {
                    _id: '63d4ee3cf71c3646765339bb',
                    firstname: 'Editor',
                    lastname: 'TaiGer',
                    role: 'Editor'
                }
            ],
            applying_program_count: 0,
            firstname: 'Testing-Student',
            lastname: 'Wang',
            email: 'wang.student@gmail.com',
            archiv: true,
            birthday: '',
            isAccountActivated: false,
            notification: {
                isRead_survey_not_complete: false,
                isRead_uni_assist_task_assigned: false,
                isRead_new_agent_assigned: false,
                isRead_new_editor_assigned: false,
                isRead_new_cvmlrl_tasks_created: true,
                isRead_new_cvmlrl_messsage: true,
                isRead_base_documents_missing: false,
                isRead_base_documents_rejected: false,
                isRead_new_programs_assigned: false
            },
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
                expected_application_date: '',
                expected_application_semester: '',
                target_application_field: '',
                considered_privat_universities: '-',
                application_outside_germany: '-'
            },
            academic_background: {
                university: {
                    high_school_isGraduated: '',
                    attended_high_school: '',
                    high_school_graduated_year: '',
                    attended_university: '',
                    attended_university_program: '',
                    isGraduated: '-',
                    expected_grad_date: '',
                    Has_Exchange_Experience: '-'
                },
                language: {
                    english_isPassed: '-',
                    english_certificate: '',
                    english_score: '',
                    english_test_date: '',
                    german_isPassed: '-',
                    german_certificate: '',
                    german_score: '',
                    german_test_date: ''
                }
            },
            role: 'Student',
            applications: [
                {
                    programId: {
                        _id: '2532fde46751651537933722',
                        school: 'FAU Erlangen-Nürnberg',
                        program_name: 'Molecular Science',
                        degree: 'M. Sc.',
                        semester: 'WS',
                        lang: 'English',
                        uni_assist: 'No',
                        testdaf: '-',
                        ml_required: 'yes',
                        rl_required: '0',
                        essay_required: 'no',
                        country: 'de',
                        deprecated: 'no',
                        application_deadline: '07-15',
                        program_duration: '4 semesters',
                        tuition_fees: 'none',
                        daad_link:
                            '/deutschland/studienangebote/international-programmes/en/detail/4404/',
                        application_portal_a:
                            'https://www.campo.fau.eu/qisserver/pages/cs/sys/portal/hisinoneStartPage.faces?chco=y',
                        comments:
                            'https://www.fau.eu/files/2015/05/FAU_supporting_documents_for_applications_for_masters_degree_programmes.pdf'
                    },
                    uni_assist: {
                        status: 'notstarted',
                        vpd_file_path: ''
                    },
                    reject_reason: '',
                    decided: '-',
                    closed: '-',
                    admission: '-',
                    _id: '647fb138d27bf67283a34ff4',
                    doc_modification_thread: [
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: '647fb138d27bf67283a34ff5',
                            updatedAt: '2023-06-06T22:20:40.533Z',
                            createdAt: '2023-06-06T22:20:40.533Z',
                            _id: '647fb138d27bf67283a34ff6'
                        }
                    ]
                },
                {
                    programId: {
                        _id: '2532fde46751651538133919',
                        school: 'Friedrich Schiller University Jena',
                        program_name: 'Chemistry of Materials',
                        degree: 'M. Sc.',
                        semester: 'WS',
                        lang: 'English',
                        uni_assist: 'No',
                        toefl: 'B2',
                        ielts: 'B2',
                        testdaf: '-',
                        ml_required: 'yes',
                        rl_required: '2',
                        essay_required: 'no',
                        special_notes: '* working experience',
                        website:
                            'https://www.uni-jena.de/en/msc-chemistry-materials',
                        programSubjects: ['CHEM', 'MAT-SCI'],
                        country: 'de',
                        deprecated: 'no',
                        application_deadline: '07-15',
                        program_duration: '4 semesters',
                        tuition_fees: 'none',
                        daad_link:
                            '/deutschland/studienangebote/international-programmes/en/detail/5303/',
                        application_start: '04-01',
                        application_portal_a:
                            'https://apply.master.uni-jena.de/login?0'
                    },
                    uni_assist: {
                        status: 'notstarted',
                        vpd_file_path: ''
                    },
                    reject_reason: '',
                    decided: '-',
                    closed: '-',
                    admission: '-',
                    _id: '647fb138d27bf67283a34ff8',
                    doc_modification_thread: [
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: '647fb138d27bf67283a34ff9',
                            updatedAt: '2023-06-06T22:20:40.569Z',
                            createdAt: '2023-06-06T22:20:40.569Z',
                            _id: '647fb138d27bf67283a34ffa'
                        },
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: '647fb138d27bf67283a34ffc',
                            updatedAt: '2023-06-06T22:20:40.596Z',
                            createdAt: '2023-06-06T22:20:40.596Z',
                            _id: '647fb138d27bf67283a34ffd'
                        },
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: '647fb138d27bf67283a34fff',
                            updatedAt: '2023-06-06T22:20:40.628Z',
                            createdAt: '2023-06-06T22:20:40.628Z',
                            _id: '647fb138d27bf67283a35000'
                        }
                    ]
                },
                {
                    programId: {
                        _id: '2532fde46751651537990004',
                        school: 'Karlsruhe Institute of Technology (KIT)',
                        program_name: 'Material Science and Engineering',
                        degree: 'M. Sc.',
                        semester: 'WS',
                        lang: 'English',
                        uni_assist: 'No',
                        toefl: '88',
                        ielts: '6.5',
                        testdaf: '-',
                        ml_required: 'yes',
                        rl_required: '0',
                        essay_required: 'no',
                        website: 'Intro',
                        programSubjects: ['CHEM', 'MAT-SCI'],
                        country: 'de',
                        deprecated: 'no',
                        application_deadline: '09-30',
                        program_duration: '4 semesters',
                        tuition_fees:
                            '* BW: 1500 Euro/Semester\\n* English or Germn\\n* IELTS with a total result of at least 6.5 and no section being below 5.5',
                        daad_link:
                            '/deutschland/studienangebote/international-programmes/en/detail/6908/',
                        application_portal_a:
                            'https://bewerbung.studium.kit.edu/prod/campus/Portal/Start?%7C=en',
                        application_portal_a_instructions:
                            'https://taigerconsultancy-portal.com/docs/search/640cfc196aad4aed38baa289'
                    },
                    uni_assist: {
                        status: 'notstarted',
                        vpd_file_path: ''
                    },
                    reject_reason: '',
                    decided: '-',
                    closed: '-',
                    admission: '-',
                    _id: '647fb138d27bf67283a35002',
                    doc_modification_thread: [
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: '647fb138d27bf67283a35003',
                            updatedAt: '2023-06-06T22:20:40.653Z',
                            createdAt: '2023-06-06T22:20:40.653Z',
                            _id: '647fb138d27bf67283a35004'
                        }
                    ]
                },
                {
                    programId: {
                        _id: '2532fde46751651537996014',
                        school: 'KTH',
                        program_name: 'Polymer Technology',
                        degree: 'M. Sc.',
                        semester: 'WS',
                        lang: 'English',
                        uni_assist: 'No',
                        toefl: '90',
                        ielts: '6.5',
                        testdaf: '-',
                        gre: '-',
                        ml_required: 'yes',
                        rl_required: '0',
                        essay_required: 'no',
                        special_notes:
                            '* The tuition fee (for the year spent at KTH) for non-EU/EEA/Swiss citizens studying this programme is SEK 155,000. Tuition fees for partner institutions differ.\\n* TOEFL: written 20\\n* IELTS: no less than 5.5\\n* Chemistry or a closely related subject corresponding to at least 50 ECTS credits.\\n* Mathematics, numerical analysis and computer science corresponding to at least 20 ECTS credits.',
                        website:
                            'https://www.kth.se/en/studies/master/polymer-technology/entry-requirements-polymer-technology-1.422912',
                        programSubjects: ['CHEM', 'MAT-SCI'],
                        country: 'se',
                        application_deadline: '01-15',
                        application_portal_a:
                            'https://www.universityadmissions.se/intl/login',
                        application_portal_a_instructions:
                            'https://taigerconsultancy-portal.com/docs/search/63da659d12dfc6d2959cb61f',
                        ml_requirements:
                            'The letter of motivation explains why you have chosen this programme at KTH, what you hope to gain from it and how your interests and skills will help you succeed in your studies. Include an autobiography with the development and relevance of your academic and professional pursuits, extra-curricular activities and related experiences. KTH does not require a standard template, but it must be in English and less than 500 words. If you apply to multiple programmes that require a letter of motivation, you should submit one for each and state which programme each letter applies to at the top of the page.',
                        supplementary_form_required: 'yes',
                        supplementary_form_requirements:
                            'https://www.kth.se/form/summary-sheet-for-the-master-s-programme-in-polymer-technology-2023'
                    },
                    uni_assist: {
                        status: 'notstarted',
                        vpd_file_path: ''
                    },
                    reject_reason: '',
                    decided: '-',
                    closed: '-',
                    admission: '-',
                    _id: '647fb138d27bf67283a35006',
                    doc_modification_thread: [
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: '647fb138d27bf67283a35007',
                            updatedAt: '2023-06-06T22:20:40.679Z',
                            createdAt: '2023-06-06T22:20:40.679Z',
                            _id: '647fb138d27bf67283a35008'
                        },
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: '647fb138d27bf67283a3500a',
                            updatedAt: '2023-06-06T22:20:40.708Z',
                            createdAt: '2023-06-06T22:20:40.708Z',
                            _id: '647fb138d27bf67283a3500b'
                        }
                    ]
                },
                {
                    programId: {
                        _id: '2532fde46751651538009478',
                        school: 'Martin Luther University Halle-Wittenberg',
                        program_name: 'Polymer Materials Science',
                        degree: 'M. Sc.',
                        semester: 'WS',
                        lang: 'English',
                        testdaf: '-',
                        ml_required: 'yes',
                        rl_required: '0',
                        essay_required: 'no',
                        country: 'de',
                        deprecated: 'no',
                        application_deadline: '06-15',
                        program_duration: '4 semesters',
                        tuition_fees: 'none',
                        daad_link:
                            '/deutschland/studienangebote/international-programmes/en/detail/3605/'
                    },
                    uni_assist: {
                        status: 'notstarted',
                        vpd_file_path: ''
                    },
                    reject_reason: '',
                    decided: '-',
                    closed: '-',
                    admission: '-',
                    _id: '647fb138d27bf67283a3500d',
                    doc_modification_thread: [
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: '647fb138d27bf67283a3500e',
                            updatedAt: '2023-06-06T22:20:40.736Z',
                            createdAt: '2023-06-06T22:20:40.736Z',
                            _id: '647fb138d27bf67283a3500f'
                        }
                    ]
                },
                {
                    programId: {
                        _id: '2532fde46751651538059019',
                        school: 'Technical University of Darmstadt',
                        program_name: 'Materials Science',
                        degree: 'M. Sc.',
                        semester: 'WS',
                        lang: 'English',
                        uni_assist: 'No',
                        toefl: '95',
                        ielts: '7',
                        testdaf: '-',
                        ml_required: 'yes',
                        rl_required: '0',
                        essay_required: 'no',
                        special_notes:
                            '* Erforderlich ist ein mindestens sechswöchiges anerkanntes Industriepraktikum, das bis spätestens zum Beginn der Master-Thesis abgeschlossen sein muss.',
                        website:
                            'https://www.tu-darmstadt.de/studieren/studieninteressierte/studienangebot_studiengaenge/studiengang_183552.de.jsp',
                        programSubjects: ['CHEM', 'MAT-SCI'],
                        country: 'de',
                        deprecated: 'no',
                        application_deadline: '07-15',
                        program_duration: '4 semesters',
                        tuition_fees: 'none',
                        daad_link:
                            '/deutschland/studienangebote/international-programmes/en/detail/4808/',
                        application_start: '06-01',
                        application_portal_a:
                            'https://www.tucan.tu-darmstadt.de/scripts/mgrqispi.dll?APPNAME=CampusNet&PRGNAME=EXTERNALPAGES&ARGUMENTS=-N000000000000002,-N000428,-Aetucan%5Faccount%2Ehtml',
                        updatedAt: '2023-05-28T00:19:32.814Z',
                        whoupdated: 'Leo TaiGer'
                    },
                    uni_assist: {
                        status: 'notstarted',
                        vpd_file_path: ''
                    },
                    reject_reason: '',
                    decided: '-',
                    closed: '-',
                    admission: '-',
                    _id: '647fb138d27bf67283a35011',
                    doc_modification_thread: [
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: '647fb138d27bf67283a35012',
                            updatedAt: '2023-06-06T22:20:40.761Z',
                            createdAt: '2023-06-06T22:20:40.761Z',
                            _id: '647fb138d27bf67283a35013'
                        }
                    ]
                },
                {
                    programId: {
                        _id: '2532fde46751651538125466',
                        school: 'University of Freiburg',
                        program_name:
                            'Sustainable Materials- Crystalline Materials',
                        degree: 'M. Sc.',
                        semester: 'WS',
                        lang: 'English',
                        uni_assist: 'No',
                        ielts: '6.5',
                        testdaf: '-',
                        ml_required: 'yes',
                        rl_required: '2',
                        special_notes:
                            'MSc. Crystalline Materials 併到 Sustainable Materials底下\\nShould be taught in English',
                        website:
                            'https://www.studium.uni-freiburg.de/de/studienangebot/studienfaecher/info/403',
                        programSubjects: ['CHEM', 'MAT-SCI'],
                        country: 'de',
                        deprecated: 'no',
                        application_deadline: '07-15',
                        tuition_fees: '1.500,00',
                        application_start: '03-18',
                        application_portal_a:
                            'https://campus.uni-freiburg.de/qisserver/pages/cs/sys/portal/subMenu.faces?navigationPosition=hisinoneapp_studi_no_login'
                    },
                    uni_assist: {
                        status: 'notstarted',
                        vpd_file_path: ''
                    },
                    reject_reason: '',
                    decided: '-',
                    closed: '-',
                    admission: '-',
                    _id: '647fb138d27bf67283a35015',
                    doc_modification_thread: [
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: '647fb138d27bf67283a35016',
                            updatedAt: '2023-06-06T22:20:40.785Z',
                            createdAt: '2023-06-06T22:20:40.785Z',
                            _id: '647fb138d27bf67283a35017'
                        },
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: '647fb138d27bf67283a35019',
                            updatedAt: '2023-06-06T22:20:40.812Z',
                            createdAt: '2023-06-06T22:20:40.812Z',
                            _id: '647fb138d27bf67283a3501a'
                        },
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: '647fb138d27bf67283a3501c',
                            updatedAt: '2023-06-06T22:20:40.844Z',
                            createdAt: '2023-06-06T22:20:40.844Z',
                            _id: '647fb138d27bf67283a3501d'
                        }
                    ]
                },
                {
                    programId: {
                        _id: '2532fde46751651538154142',
                        school: 'University of Stuttgart',
                        program_name: 'Materials Science',
                        degree: 'M. Sc.',
                        semester: 'WS',
                        lang: 'English',
                        uni_assist: 'No',
                        toefl: '90',
                        ielts: '6.5',
                        testdaf: '-',
                        ml_required: 'yes',
                        rl_required: '2',
                        programSubjects: ['CHEM', 'MAT-SCI'],
                        country: 'de',
                        deprecated: 'no',
                        application_deadline: '07-15',
                        program_duration: '4 semesters',
                        tuition_fees: '1.500,00',
                        daad_link:
                            '/deutschland/studienangebote/international-programmes/en/detail/6103/',
                        application_portal_a:
                            'https://campus.uni-stuttgart.de/cusonline/pl/ui/$ctx/webnav.ini',
                        application_portal_a_instructions:
                            'https://taigerconsultancy-portal.com/docs/search/63e7ccd6474c98855b217aa9',
                        supplementary_form_required: 'yes'
                    },
                    uni_assist: {
                        status: 'notstarted',
                        vpd_file_path: ''
                    },
                    reject_reason: '',
                    decided: '-',
                    closed: '-',
                    admission: '-',
                    _id: '647fb138d27bf67283a3501f',
                    doc_modification_thread: [
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: '647fb138d27bf67283a35020',
                            updatedAt: '2023-06-06T22:20:40.872Z',
                            createdAt: '2023-06-06T22:20:40.872Z',
                            _id: '647fb138d27bf67283a35021'
                        },
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: '647fb138d27bf67283a35023',
                            updatedAt: '2023-06-06T22:20:40.900Z',
                            createdAt: '2023-06-06T22:20:40.900Z',
                            _id: '647fb138d27bf67283a35024'
                        },
                        {
                            isFinalVersion: false,
                            latest_message_left_by_id: '',
                            doc_thread_id: '647fb138d27bf67283a35026',
                            updatedAt: '2023-06-06T22:20:40.928Z',
                            createdAt: '2023-06-06T22:20:40.928Z',
                            _id: '647fb138d27bf67283a35027'
                        }
                    ]
                }
            ],
            profile: [],
            generaldocs_threads: [],
            createdAt: '2023-06-04T23:19:30.719Z',
            updatedAt: '2023-06-06T22:20:52.235Z',
            __v: 3
        }
    ]
};

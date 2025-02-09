import { DocumentStatusType, ProfileNameType } from '@taiger-common/core';

import {
    is_cv_assigned,
    isCVFinished,
    calculateDisplayLength,
    truncateText,
    getRequirement,
    isLanguageInfoComplete,
    isEnglishLanguageInfoComplete,
    check_if_there_is_german_language_info,
    check_german_language_Notneeded,
    check_german_language_passed,
    check_english_language_Notneeded,
    check_english_language_passed,
    based_documents_init,
    is_any_base_documents_uploaded,
    check_languages_filled,
    check_academic_background_filled,
    getMissingDocs,
    does_essay_have_writers,
    is_program_ml_rl_essay_finished,
    num_uni_assist_vpd_needed,
    num_uni_assist_vpd_uploaded,
    check_student_needs_uni_assist,
    is_uni_assist_paid_and_docs_uploaded,
    isUniAssistVPDNeeded,
    is_all_uni_assist_vpd_uploaded
} from './checking-functions';

describe('Role checking', () => {
    test('is_cv_assigned', () => {
        const studentHasCVTask = {
            role: 'Student',
            generaldocs_threads: [{ doc_thread_id: { file_type: 'CV' } }]
        };
        const studentHasNoCVTask = {
            role: 'Student',
            generaldocs_threads: [{ doc_thread_id: { file_type: 'RL_A' } }]
        };
        expect(is_cv_assigned(studentHasCVTask)).toEqual(true);
        expect(is_cv_assigned(studentHasNoCVTask)).toEqual(false);
    });

    test('calculateDisplayLength', () => {
        const text_1 = '中文';
        const text_2 = '中文 abc';
        const text_3 = 'abc def';
        expect(calculateDisplayLength(text_1)).toEqual(4);
        expect(calculateDisplayLength(text_2)).toEqual(8);
        expect(calculateDisplayLength(text_3)).toEqual(7);
    });

    test('truncateText', () => {
        const text_1 = '中文 abc';
        const text_2 = '中文 abcabcabcabcabcabc';
        expect(truncateText(text_1, 5)).toEqual('中文 ...');
        expect(truncateText(text_2, 100)).toEqual('中文 abcabcabcabcabcabc');
    });

    test('isCVFinished', () => {
        const studentIsCVFinished = {
            role: 'Student',
            generaldocs_threads: [
                { doc_thread_id: { file_type: 'CV' }, isFinalVersion: true }
            ]
        };
        const studentIsCVNotFinished = {
            role: 'Student',
            generaldocs_threads: [{ doc_thread_id: { file_type: 'CV' } }]
        };
        expect(isCVFinished(studentIsCVFinished)).toEqual(true);
        expect(isCVFinished(studentIsCVNotFinished)).toEqual(false);
    });
});

describe('getRequirement', () => {
    it('should return false if thread is not provided', () => {
        expect(getRequirement(null)).toBe(false);
        expect(getRequirement(undefined)).toBe(false);
    });

    it('should return false if fileType or program is not provided', () => {
        expect(getRequirement({})).toBe(false);
        expect(getRequirement({ file_type: 'Essay' })).toBe(false);
        expect(getRequirement({ program_id: { essay_required: 'yes' } })).toBe(
            false
        );
    });

    it('should return the correct essay requirement', () => {
        const thread = {
            file_type: 'Essay',
            program_id: {
                essay_required: 'yes',
                essay_requirements: '500 words'
            }
        };
        expect(getRequirement(thread)).toBe('500 words');
    });

    it('should return "No" if essay requirement is not specified', () => {
        const thread = {
            file_type: 'Essay',
            program_id: { essay_required: 'yes' }
        };
        expect(getRequirement(thread)).toBe('No');
    });

    it('should return the correct ML requirement', () => {
        const thread = {
            file_type: 'ML',
            program_id: {
                ml_required: 'yes',
                ml_requirements: 'ML requirement text'
            }
        };
        expect(getRequirement(thread)).toBe('ML requirement text');
    });

    it('should return the correct portfolio requirement', () => {
        const thread = {
            file_type: 'Portfolio',
            program_id: {
                portfolio_required: 'yes',
                portfolio_requirements: 'Portfolio requirement text'
            }
        };
        expect(getRequirement(thread)).toBe('Portfolio requirement text');
    });

    it('should return the correct supplementary form requirement', () => {
        const thread = {
            file_type: 'Supplementary_Form',
            program_id: {
                supplementary_form_required: 'yes',
                supplementary_form_requirements: 'Supplementary form text'
            }
        };
        expect(getRequirement(thread)).toBe('Supplementary form text');
    });

    it('should return the correct curriculum analysis requirement', () => {
        const thread = {
            file_type: 'Curriculum_Analysis',
            program_id: {
                curriculum_analysis_required: 'yes',
                curriculum_analysis_requirements: 'Curriculum analysis text'
            }
        };
        expect(getRequirement(thread)).toBe('Curriculum analysis text');
    });

    it('should return the correct scholarship form requirement', () => {
        const thread = {
            file_type: 'Scholarship_Form',
            program_id: {
                scholarship_form_required: 'yes',
                scholarship_form_requirements: 'Scholarship form text'
            }
        };
        expect(getRequirement(thread)).toBe('Scholarship form text');
    });

    it('should return the correct RL requirement', () => {
        const thread = {
            file_type: 'RL',
            program_id: {
                rl_required: '2',
                rl_requirements: 'RL requirement text'
            }
        };
        expect(getRequirement(thread)).toBe('RL requirement text');
    });

    it('should return "No" if RL requirement is not specified', () => {
        const thread = {
            file_type: 'RL',
            program_id: { rl_required: '2' }
        };
        expect(getRequirement(thread)).toBe('No');
    });

    it('should return "No" if file type does not match any condition', () => {
        const thread = {
            file_type: 'Unknown_Type',
            program_id: {
                unknown_required: 'yes',
                unknown_requirements: 'Unknown requirement text'
            }
        };
        expect(getRequirement(thread)).toBe('No');
    });
});

describe('isLanguageInfoComplete', () => {
    it('should return false if academic_background is not provided', () => {
        expect(isLanguageInfoComplete(null)).toBe(false);
        expect(isLanguageInfoComplete(undefined)).toBe(false);
    });

    it('should return false if academic_background.language is not provided', () => {
        const academic_background = {};
        expect(isLanguageInfoComplete(academic_background)).toBe(false);
    });

    it('should return false if both english_isPassed and german_isPassed are "-"', () => {
        const academic_background = {
            language: {
                english_isPassed: '-',
                german_isPassed: '-'
            }
        };
        expect(isLanguageInfoComplete(academic_background)).toBe(false);
    });

    it('should return true if english_isPassed is not "-"', () => {
        const academic_background = {
            language: {
                english_isPassed: 'yes',
                german_isPassed: '-'
            }
        };
        expect(isLanguageInfoComplete(academic_background)).toBe(true);
    });

    it('should return true if german_isPassed is not "-"', () => {
        const academic_background = {
            language: {
                english_isPassed: '-',
                german_isPassed: 'yes'
            }
        };
        expect(isLanguageInfoComplete(academic_background)).toBe(true);
    });

    it('should return true if both english_isPassed and german_isPassed are not "-"', () => {
        const academic_background = {
            language: {
                english_isPassed: 'yes',
                german_isPassed: 'yes'
            }
        };
        expect(isLanguageInfoComplete(academic_background)).toBe(true);
    });
});

describe('isEnglishLanguageInfoComplete', () => {
    it('should return false if academic_background is not provided', () => {
        expect(isEnglishLanguageInfoComplete(null)).toBe(false);
        expect(isEnglishLanguageInfoComplete(undefined)).toBe(false);
    });

    it('should return false if academic_background.language is not provided', () => {
        const academic_background = {};
        expect(isEnglishLanguageInfoComplete(academic_background)).toBe(false);
    });

    it('should return false if english_isPassed is "-"', () => {
        const academic_background = {
            language: {
                english_isPassed: '-'
            }
        };
        expect(isEnglishLanguageInfoComplete(academic_background)).toBe(false);
    });

    it('should return true if english_isPassed is not "-"', () => {
        const academic_background = {
            language: {
                english_isPassed: 'yes'
            }
        };
        expect(isEnglishLanguageInfoComplete(academic_background)).toBe(true);
    });

    it('should return true if english_isPassed is an empty string', () => {
        const academic_background = {
            language: {
                english_isPassed: ''
            }
        };
        expect(isEnglishLanguageInfoComplete(academic_background)).toBe(true);
    });

    it('should return true if english_isPassed is a value other than "-"', () => {
        const academic_background = {
            language: {
                english_isPassed: 'no'
            }
        };
        expect(isEnglishLanguageInfoComplete(academic_background)).toBe(true);
    });
});

describe('check_if_there_is_german_language_info', () => {
    it('should return false if academic_background is not provided', () => {
        expect(check_if_there_is_german_language_info(null)).toBe(false);
        expect(check_if_there_is_german_language_info(undefined)).toBe(false);
    });

    it('should return false if academic_background.language is not provided', () => {
        const academic_background = {};
        expect(
            check_if_there_is_german_language_info(academic_background)
        ).toBe(false);
    });

    it('should return false if german_isPassed is "-"', () => {
        const academic_background = {
            language: {
                german_isPassed: '-'
            }
        };
        expect(
            check_if_there_is_german_language_info(academic_background)
        ).toBe(false);
    });

    it('should return true if german_isPassed is not "-"', () => {
        const academic_background = {
            language: {
                german_isPassed: 'yes'
            }
        };
        expect(
            check_if_there_is_german_language_info(academic_background)
        ).toBe(true);
    });

    it('should return true if german_isPassed is an empty string', () => {
        const academic_background = {
            language: {
                german_isPassed: ''
            }
        };
        expect(
            check_if_there_is_german_language_info(academic_background)
        ).toBe(true);
    });

    it('should return true if german_isPassed is a value other than "-"', () => {
        const academic_background = {
            language: {
                german_isPassed: 'no'
            }
        };
        expect(
            check_if_there_is_german_language_info(academic_background)
        ).toBe(true);
    });
});

describe('Language Check Functions', () => {
    describe('check_english_language_passed', () => {
        it('should return true if english_isPassed is "O"', () => {
            const academic_background = { language: { english_isPassed: 'O' } };
            expect(check_english_language_passed(academic_background)).toBe(
                true
            );
        });

        it('should return false if english_isPassed is not "O"', () => {
            const academic_background = { language: { english_isPassed: 'X' } };
            expect(check_english_language_passed(academic_background)).toBe(
                false
            );
        });

        it('should return false if academic_background or language is not provided', () => {
            expect(check_english_language_passed(null)).toBe(false);
            expect(check_english_language_passed(undefined)).toBe(false);
            expect(check_english_language_passed({})).toBe(false);
        });
    });

    describe('check_english_language_Notneeded', () => {
        it('should return true if english_isPassed is "--"', () => {
            const academic_background = {
                language: { english_isPassed: '--' }
            };
            expect(check_english_language_Notneeded(academic_background)).toBe(
                true
            );
        });

        it('should return false if english_isPassed is not "--"', () => {
            const academic_background = { language: { english_isPassed: 'X' } };
            expect(check_english_language_Notneeded(academic_background)).toBe(
                false
            );
        });

        it('should return false if academic_background or language is not provided', () => {
            expect(check_english_language_Notneeded(null)).toBe(false);
            expect(check_english_language_Notneeded(undefined)).toBe(false);
            expect(check_english_language_Notneeded({})).toBe(false);
        });
    });

    describe('check_german_language_passed', () => {
        it('should return true if german_isPassed is "O"', () => {
            const academic_background = { language: { german_isPassed: 'O' } };
            expect(check_german_language_passed(academic_background)).toBe(
                true
            );
        });

        it('should return false if german_isPassed is not "O"', () => {
            const academic_background = { language: { german_isPassed: 'X' } };
            expect(check_german_language_passed(academic_background)).toBe(
                false
            );
        });

        it('should return false if academic_background or language is not provided', () => {
            expect(check_german_language_passed(null)).toBe(false);
            expect(check_german_language_passed(undefined)).toBe(false);
            expect(check_german_language_passed({})).toBe(false);
        });
    });

    describe('check_german_language_Notneeded', () => {
        it('should return true if german_isPassed is "--"', () => {
            const academic_background = { language: { german_isPassed: '--' } };
            expect(check_german_language_Notneeded(academic_background)).toBe(
                true
            );
        });

        it('should return false if german_isPassed is not "--"', () => {
            const academic_background = { language: { german_isPassed: 'X' } };
            expect(check_german_language_Notneeded(academic_background)).toBe(
                false
            );
        });

        it('should return false if academic_background or language is not provided', () => {
            expect(check_german_language_Notneeded(null)).toBe(false);
            expect(check_german_language_Notneeded(undefined)).toBe(false);
            expect(check_german_language_Notneeded({})).toBe(false);
        });
    });
});

describe('based_documents_init', () => {
    it('should initialize all document statuses to Missing', () => {
        const student = { profile: [] };
        const { object_init } = based_documents_init(student);
        const documentlist2_keys = Object.keys(ProfileNameType);

        for (const key of documentlist2_keys) {
            expect(object_init[key]).toBe(DocumentStatusType.Missing);
        }
    });

    it('should update document statuses based on student profile', () => {
        const student = {
            profile: [
                {
                    name: 'High_School_Diploma',
                    status: DocumentStatusType.Uploaded
                },
                {
                    name: 'Course_Description',
                    status: DocumentStatusType.Accepted
                },
                {
                    name: 'Bachelor_Transcript',
                    status: DocumentStatusType.Rejected
                }
            ]
        };
        const { object_init } = based_documents_init(student);

        expect(object_init.High_School_Diploma).toBe(
            DocumentStatusType.Uploaded
        );
        expect(object_init.Course_Description).toBe(
            DocumentStatusType.Accepted
        );
        expect(object_init.Bachelor_Transcript).toBe(
            DocumentStatusType.Rejected
        );
    });

    it('should handle documents with status Missing', () => {
        const student = {
            profile: [
                {
                    name: 'High_School_Diploma',
                    status: DocumentStatusType.Missing
                }
            ]
        };
        const { object_init } = based_documents_init(student);

        expect(object_init.High_School_Diploma).toBe(
            DocumentStatusType.Missing
        );
    });

    it('should handle documents with status NotNeeded', () => {
        const student = {
            profile: [
                {
                    name: 'High_School_Diploma',
                    status: DocumentStatusType.NotNeeded
                }
            ]
        };
        const { object_init } = based_documents_init(student);

        expect(object_init.High_School_Diploma).toBe(
            DocumentStatusType.NotNeeded
        );
    });

    it('should not change the status of documents not in the student profile', () => {
        const student = {
            profile: [
                {
                    name: 'High_School_Diploma',
                    status: DocumentStatusType.Uploaded
                }
            ]
        };
        const { object_init } = based_documents_init(student);

        expect(object_init.High_School_Diploma).toBe(
            DocumentStatusType.Uploaded
        );
        expect(object_init.High_School_Transcript).toBe(
            DocumentStatusType.Missing
        );
        expect(object_init.University_Entrance_Examination_GSAT).toBe(
            DocumentStatusType.Missing
        );
    });
});

describe('is_any_base_documents_uploaded', () => {
    const studentWithUploadedDocument = {
        profile: [
            {
                name: 'Bachelor_Transcript',
                status: DocumentStatusType.Uploaded
            },
            {
                name: 'Englisch_Certificate',
                status: DocumentStatusType.Accepted
            },
            { name: 'High_School_Diploma', status: DocumentStatusType.Missing }
        ]
    };

    const studentWithoutDocuments = {
        profile: []
    };

    const students = [studentWithUploadedDocument, studentWithoutDocuments];

    it('should return true if any base document is uploaded', () => {
        expect(is_any_base_documents_uploaded(students)).toBe(true);
    });

    it('should return false if no base document is uploaded', () => {
        const studentsNoDocs = [
            {
                profile: [
                    {
                        name: 'High_School_Diploma',
                        status: DocumentStatusType.Missing
                    }
                ]
            },
            {
                profile: [
                    {
                        name: 'Bachelor_Transcript',
                        status: DocumentStatusType.NotNeeded
                    }
                ]
            }
        ];
        expect(is_any_base_documents_uploaded(studentsNoDocs)).toBe(false);
    });

    it('should return false if students array is empty', () => {
        expect(is_any_base_documents_uploaded([])).toBe(false);
    });

    it('should return false if students array is null or undefined', () => {
        expect(is_any_base_documents_uploaded(null)).toBe(false);
        expect(is_any_base_documents_uploaded(undefined)).toBe(false);
    });
});

describe('is_all_uni_assist_vpd_uploaded', () => {
    it('should return false if student applications is undefined', () => {
        const student = { applications: undefined };
        const result = is_all_uni_assist_vpd_uploaded(student);
        expect(result).toBe(false);
    });

    it('should ignore applications without "VPD" in uni_assist', () => {
        const student = {
            applications: [
                {
                    programId: { uni_assist: 'SomeOtherDoc' },
                    decided: 'O',
                    uni_assist: {
                        status: DocumentStatusType.Uploaded,
                        vpd_file_path: 'path/to/vpd'
                    }
                }
            ]
        };
        const result = is_all_uni_assist_vpd_uploaded(student);
        expect(result).toBe(true); // Should ignore this application since 'VPD' is not in uni_assist
    });

    it('should return false if uni_assist is missing', () => {
        const student = {
            applications: [
                {
                    programId: { uni_assist: ['VPD'] },
                    decided: 'O',
                    uni_assist: undefined
                }
            ]
        };
        const result = is_all_uni_assist_vpd_uploaded(student);
        expect(result).toBe(false);
    });

    it('should continue if uni_assist status is NotNeeded', () => {
        const student = {
            applications: [
                {
                    programId: { uni_assist: ['VPD'] },
                    decided: 'O',
                    uni_assist: { status: DocumentStatusType.NotNeeded }
                },
                {
                    programId: { uni_assist: ['VPD'] },
                    decided: 'O',
                    uni_assist: {
                        status: DocumentStatusType.Uploaded,
                        vpd_file_path: 'path/to/vpd'
                    }
                }
            ]
        };
        const result = is_all_uni_assist_vpd_uploaded(student);
        expect(result).toBe(true); // Should skip the first application due to status NotNeeded
    });

    it('should return false if uni_assist status is not Uploaded or vpd_file_path is empty', () => {
        const student = {
            applications: [
                {
                    programId: { uni_assist: ['VPD'] },
                    decided: 'O',
                    uni_assist: {
                        status: DocumentStatusType.Missing,
                        vpd_file_path: ''
                    }
                }
            ]
        };
        const result = is_all_uni_assist_vpd_uploaded(student);
        expect(result).toBe(false); // Should return false since status is not 'Uploaded' and file path is empty
    });

    it('should return true if all VPD documents are uploaded', () => {
        const student = {
            applications: [
                {
                    programId: { uni_assist: ['VPD'] },
                    decided: 'O',
                    uni_assist: {
                        status: DocumentStatusType.Uploaded,
                        vpd_file_path: 'path/to/vpd'
                    }
                },
                {
                    programId: { uni_assist: ['VPD'] },
                    decided: 'O',
                    uni_assist: {
                        status: DocumentStatusType.Uploaded,
                        vpd_file_path: 'another/path/to/vpd'
                    }
                }
            ]
        };
        const result = is_all_uni_assist_vpd_uploaded(student);
        expect(result).toBe(true); // All conditions for uploading are satisfied
    });
});

describe('check_languages_filled', () => {
    it('should return false if academic_background or language is not provided', () => {
        expect(check_languages_filled(null)).toBe(false);
        expect(check_languages_filled(undefined)).toBe(false);
        expect(check_languages_filled({})).toBe(false);
    });

    it('should return false if any language test is missing or marked as "-"', () => {
        const academic_background = {
            language: {
                english_isPassed: '-',
                german_isPassed: 'X',
                gre_isPassed: 'O',
                gmat_isPassed: '-'
            }
        };
        expect(check_languages_filled(academic_background)).toBe(false);
    });

    it('should return false if any language test date is expired', () => {
        const academic_background = {
            language: {
                english_isPassed: 'X',
                english_test_date: '2023-06-01', // Assume this date is expired
                german_isPassed: 'X',
                german_test_date: '2023-05-01', // Assume this date is expired
                gre_isPassed: 'O',
                gre_test_date: '2023-06-01', // Assume this date is expired
                gmat_isPassed: 'O',
                gmat_test_date: '2023-05-01' // Assume this date is expired
            }
        };
        expect(check_languages_filled(academic_background)).toBe(false);
    });

    it('should return true if all language tests are filled and not expired', () => {
        const academic_background = {
            language: {
                english_isPassed: 'O',
                english_test_date: '2023-06-01',
                german_isPassed: 'O',
                german_test_date: '2023-07-01',
                gre_isPassed: 'O',
                gre_test_date: '2023-08-01',
                gmat_isPassed: 'O',
                gmat_test_date: '2023-09-01'
            }
        };
        expect(check_languages_filled(academic_background)).toBe(true);
    });

    it('should handle edge cases where test dates are empty strings', () => {
        const academic_background = {
            language: {
                english_isPassed: 'X',
                english_test_date: '',
                german_isPassed: 'O',
                german_test_date: '',
                gre_isPassed: 'X',
                gre_test_date: '',
                gmat_isPassed: 'O',
                gmat_test_date: ''
            }
        };
        expect(check_languages_filled(academic_background)).toBe(false); // Assuming empty test dates are considered expired
    });

    // Add more test cases as needed to cover other scenarios
});

describe('check_academic_background_filled', () => {
    it('should return false if academic_background or university is not provided', () => {
        expect(check_academic_background_filled(null)).toBe(false);
        expect(check_academic_background_filled(undefined)).toBe(false);
        expect(check_academic_background_filled({})).toBe(false);
        expect(check_academic_background_filled({ university: null })).toBe(
            false
        );
    });

    it('should return false if any mandatory field is missing or marked as "-"', () => {
        const academic_background = {
            university: {
                attended_high_school: true,
                high_school_isGraduated: '-',
                Has_Exchange_Experience: '-',
                Has_Internship_Experience: 'yes',
                Has_Working_Experience: '-',
                attended_university: true,
                attended_university_program: 'Computer Science'
            }
        };
        expect(check_academic_background_filled(academic_background)).toBe(
            false
        );
    });

    it('should return true if all mandatory fields are filled', () => {
        const academic_background = {
            university: {
                attended_high_school: true,
                high_school_isGraduated: 'yes',
                Has_Exchange_Experience: 'yes',
                Has_Internship_Experience: 'no',
                Has_Working_Experience: 'yes',
                attended_university: true,
                attended_university_program: 'Computer Science'
            }
        };
        expect(check_academic_background_filled(academic_background)).toBe(
            true
        );
    });

    it('should handle edge cases where fields are missing or optional fields are not required', () => {
        const academic_background = {
            university: {
                attended_high_school: true,
                high_school_isGraduated: 'yes',
                // Missing Has_Exchange_Experience, Has_Internship_Experience, Has_Working_Experience
                attended_university: false,
                attended_university_program: ''
            }
        };
        expect(check_academic_background_filled(academic_background)).toBe(
            false
        );
    });

    // Add more test cases as needed to cover other scenarios
});

describe('getMissingDocs', () => {
    // Test case 1: No application provided
    it('returns an empty array when no application is provided', () => {
        const result = getMissingDocs(null);
        expect(result).toEqual([]);
    });

    // Test case 2: Missing some documents
    it('returns an array of missing documents', () => {
        const application = {
            programId: {
                essay_required: 'yes',
                ml_required: 'yes'
            },
            doc_modification_thread: [{ doc_thread_id: { file_type: 'Essay' } }]
        };

        const result = getMissingDocs(application);
        expect(result).toEqual(['ML']);
    });

    // Test case 3: Insufficient RL documents
    it('returns a message for missing RL documents', () => {
        const application = {
            programId: {
                is_rl_specific: true,
                rl_required: '3'
            },
            doc_modification_thread: [{ doc_thread_id: { file_type: 'RL_A' } }]
        };

        const result = getMissingDocs(application);
        expect(result).toEqual(['RL - 3 needed, 1 provided (2 must be added)']);
    });

    // Test case 4: Sufficient RL documents
    it('does not return RL message when sufficient RL documents are provided', () => {
        const application = {
            programId: {
                rl_required: '2'
            },
            doc_modification_thread: [
                { doc_thread_id: { file_type: 'RL_Transcript_1' } },
                { doc_thread_id: { file_type: 'RL_Transcript_2' } }
            ]
        };

        const result = getMissingDocs(application);
        expect(result).not.toContain('RL -');
    });
});

describe('num_uni_assist_vpd_uploaded', () => {
    // Test case 1: No applications
    it('returns 0 when no applications are provided', () => {
        const student = {
            applications: []
        };
        const result = num_uni_assist_vpd_uploaded(student);
        expect(result).toBe(0);
    });

    // Test case 2: Applications with no VPD needed
    it('returns 0 when no applications need uni assist for VPD', () => {
        const student = {
            applications: [
                {
                    programId: { uni_assist: 'No' },
                    decided: 'O'
                }
            ]
        };
        const result = num_uni_assist_vpd_uploaded(student);
        expect(result).toBe(0);
    });

    // Test case 3: Applications needing VPD but none uploaded
    it('returns 0 when no VPD documents are uploaded', () => {
        const student = {
            applications: [
                {
                    programId: { uni_assist: 'Yes_VPD' },
                    uni_assist: { status: 'notneeded' },
                    decided: 'O'
                },
                {
                    programId: { uni_assist: 'Yes_VPD' },
                    uni_assist: { status: 'notneeded' },
                    decided: 'O'
                }
            ]
        };
        const result = num_uni_assist_vpd_uploaded(student);
        expect(result).toBe(0);
    });

    // Test case 4: Applications needing VPD and some uploaded
    it('returns the number of applications with uploaded VPD documents', () => {
        const student = {
            applications: [
                {
                    programId: { uni_assist: 'Yes_VPD' },
                    uni_assist: {
                        status: 'uploaded',
                        vpd_file_path: '/path/to/file.pdf'
                    },
                    decided: 'O'
                },
                {
                    programId: { uni_assist: 'Yes_VPD' },
                    uni_assist: {},
                    decided: 'O'
                },
                {
                    programId: { uni_assist: 'Yes_VPD' },
                    uni_assist: {
                        status: 'uploaded',
                        vpd_file_path: '/path/to/file.pdf'
                    },
                    decided: 'O'
                },
                {
                    programId: { uni_assist: 'no' },
                    decided: 'O'
                }
            ]
        };
        const result = num_uni_assist_vpd_uploaded(student);
        expect(result).toBe(2); // Three applications have uploaded VPD documents
    });
});

describe('does_essay_have_writers', () => {
    // Test case 1: Empty array
    it('returns true for an empty array', () => {
        const essayDocumentThreads = [];
        const result = does_essay_have_writers(essayDocumentThreads);
        expect(result).toBe(true);
    });

    // Test case 2: Threads missing writers
    it('returns false if at least one thread is missing writers', () => {
        const essayDocumentThreads = [
            { outsourced_user_id: 'user1' },
            { outsourced_user_id: [] },
            { outsourced_user_id: 'user3' }
        ];
        const result = does_essay_have_writers(essayDocumentThreads);
        expect(result).toBe(false);
    });

    // Test case 3: All threads have writers
    it('returns true if all threads have writers', () => {
        const essayDocumentThreads = [
            { outsourced_user_id: ['user1'] },
            { outsourced_user_id: ['user2'] },
            { outsourced_user_id: ['user3'] }
        ];
        const result = does_essay_have_writers(essayDocumentThreads);
        expect(result).toBe(true);
    });
});

describe('num_uni_assist_vpd_needed', () => {
    // Test case 1: No applications
    it('returns 0 when no applications are provided', () => {
        const student = {
            applications: []
        };
        const result = num_uni_assist_vpd_needed(student);
        expect(result).toBe(0);
    });

    // Test case 2: Applications with no VPD needed
    it('returns 0 when no applications need uni assist VPD', () => {
        const student = {
            applications: [
                {
                    programId: { uni_assist: 'No' }
                },
                {
                    programId: { uni_assist: 'Yes_FULL' }
                },
                {
                    programId: { uni_assist: 'Yes_FULL' }
                }
            ]
        };
        const result = num_uni_assist_vpd_needed(student);
        expect(result).toBe(0);
    });

    // Test case 3: Applications needing VPD
    it('returns the number of applications needing uni assist for VPD', () => {
        const student = {
            applications: [
                {
                    programId: { uni_assist: 'Yes_VPD' },
                    uni_assist: {},
                    decided: 'O'
                },
                {
                    programId: { uni_assist: 'No' },
                    uni_assist: {},
                    decided: 'O'
                },
                {
                    programId: { uni_assist: 'Yes_VPD' },
                    uni_assist: { status: 'notneeded' },
                    decided: 'O'
                },
                {
                    programId: { uni_assist: 'Yes_VPD' },
                    uni_assist: {},
                    decided: 'O'
                }
            ]
        };
        const result = num_uni_assist_vpd_needed(student);
        expect(result).toBe(2); // Three applications require uni assist for VPD
    });
});

describe('is_program_ml_rl_essay_finished', () => {
    // Test case 1: No threads provided
    it('returns true when no document modification threads are provided', () => {
        const application = {
            doc_modification_thread: []
        };
        const result = is_program_ml_rl_essay_finished(application);
        expect(result).toBe(true);
    });

    // Test case 2: Some threads are not finished
    it('returns false when some document modification threads are not finished', () => {
        const application = {
            doc_modification_thread: [
                { isFinalVersion: true },
                { isFinalVersion: false },
                { isFinalVersion: true }
            ]
        };
        const result = is_program_ml_rl_essay_finished(application);
        expect(result).toBe(false);
    });

    // Test case 3: All threads are finished
    it('returns true when all document modification threads are finished', () => {
        const application = {
            doc_modification_thread: [
                { isFinalVersion: true },
                { isFinalVersion: true },
                { isFinalVersion: true }
            ]
        };
        const result = is_program_ml_rl_essay_finished(application);
        expect(result).toBe(true);
    });
});

describe('isUniAssistVPDNeeded', () => {
    it('returns false when the program is not decided', () => {
        const application = {};
        const result = isUniAssistVPDNeeded(application);
        expect(result).toBe(false);
    });

    it('returns false when programId does not have uni_assist', () => {
        const application = { programId: {} };
        const result = isUniAssistVPDNeeded(application);
        expect(result).toBe(false);
    });

    it('returns false when uni_assist does not include VPD', () => {
        const application = { programId: { uni_assist: 'Yes-FULL' } };
        const result = isUniAssistVPDNeeded(application);
        expect(result).toBe(false);
    });

    it('returns true when uni_assist includes VPD but no uni_assist property', () => {
        const application = {
            programId: { uni_assist: 'Yes-VPD' },
            uni_assist: {},
            decided: 'O'
        };
        const result = isUniAssistVPDNeeded(application);
        expect(result).toBe(true);
    });

    it('returns false when uni_assist includes VPD and status is NotNeeded', () => {
        const application = {
            programId: { uni_assist: 'Yes-VPD' },
            uni_assist: { status: DocumentStatusType.NotNeeded },
            decided: 'O'
        };
        const result = isUniAssistVPDNeeded(application);
        expect(result).toBe(false);
    });

    it('returns true when uni_assist includes VPD, status is not Uploaded, and vpd_file_path is empty', () => {
        const application = {
            programId: { uni_assist: 'Yes-VPD' },
            uni_assist: {
                status: DocumentStatusType.Pending,
                vpd_file_path: ''
            },
            decided: 'O'
        };
        const result = isUniAssistVPDNeeded(application);
        expect(result).toBe(true);
    });

    it('returns false when uni_assist includes VPD, status is Uploaded, and vpd_file_path is not empty', () => {
        const application = {
            programId: { uni_assist: 'Yes-VPD' },
            uni_assist: {
                status: DocumentStatusType.Uploaded,
                vpd_file_path: 'path/to/file'
            },
            decided: 'O'
        };
        const result = isUniAssistVPDNeeded(application);
        expect(result).toBe(false);
    });
});

describe('is_uni_assist_paid_and_docs_uploaded', () => {
    // Test case 1: No uni assist
    it('returns false when uni assist is not provided', () => {
        const application = {};
        const result = is_uni_assist_paid_and_docs_uploaded(application);
        expect(result).toBe(false);
    });

    // Test case 2: Uni assist not paid
    it('returns false when uni assist is not paid', () => {
        const application = {
            uni_assist: {
                isPaid: false
            }
        };
        const result = is_uni_assist_paid_and_docs_uploaded(application);
        expect(result).toBe(false);
    });

    // Test case 3: Uni assist paid
    it('returns true when uni assist is paid', () => {
        const application = {
            uni_assist: {
                isPaid: true
            }
        };
        const result = is_uni_assist_paid_and_docs_uploaded(application);
        expect(result).toBe(true);
    });
});

describe('check_student_needs_uni_assist', () => {
    // Test case 1: No applications
    it('returns false when no applications are provided', () => {
        const student = { applications: [] };
        const result = check_student_needs_uni_assist(student);
        expect(result).toBe(false);
    });

    // Test case 2: Applications with no uni assist needed
    it('returns false when no applications need uni assist', () => {
        const student = {
            applications: [{ programId: { uni_assist: 'No' }, decided: 'O' }]
        };
        const result = check_student_needs_uni_assist(student);
        expect(result).toBe(false);
    });

    // Test case 3: Applications needing VPD
    it('returns true when at least one application needs uni assist for VPD', () => {
        const student = {
            applications: [
                { programId: { uni_assist: 'Yes_VPD' }, decided: 'O' },
                { programId: { uni_assist: 'No' }, decided: 'O' }
            ]
        };
        const result = check_student_needs_uni_assist(student);
        expect(result).toBe(true);
    });

    // Test case 4: Applications needing FULL
    it('returns true when at least one application needs uni assist for FULL', () => {
        const student = {
            applications: [
                { programId: { uni_assist: 'Yes_FULL' }, decided: 'O' },
                { programId: { uni_assist: 'No' }, decided: 'O' }
            ]
        };
        const result = check_student_needs_uni_assist(student);
        expect(result).toBe(true);
    });

    // Test case 6: No decided programs
    it('returns false when no programs are decided', () => {
        const student = {
            applications: [
                { programId: { uni_assist: 'Yes_FULL' }, decided: 'X' },
                { programId: { uni_assist: 'Yes_VPD' }, decided: '-' }
            ]
        };
        const result = check_student_needs_uni_assist(student);
        expect(result).toBe(false);
    });
});

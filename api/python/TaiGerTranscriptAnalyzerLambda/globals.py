
# Global variable:
column_len_array = []

programs_mock = [
    {
        "program_name": "TUM_EI",
        "program_category": [
            {
                'Program_Category': 'Mathematics',
                'Required_ECTS': 28,
                "Keywords_Group": ['CALCULUS', 'ME_MATH', 'MATH_PROB', 'MATH_LINEAR_ALGEBRA', 'DIFF_EQUATION', 'MATH_DISCRETE', 'MATH_NUM_METHOD']},
            {
                'Program_Category': 'Physics',
                'Required_ECTS': 10,
                "Keywords_Group": ['GENERAL_PHYSICS', 'EE_ADVANCED_PHYSICS', 'PHYSICS_EXP']},
            {
                'Program_Category': 'Programming and Computer science',
                'Required_ECTS': 12,
                "Keywords_Group": ['FUNDAMENTAL_COMPUTER_SCIENCE', 'EE_INTRO_COMPUTER_SCIENCE', 'PROGRAMMING_LANGUAGE', 'SOFTWARE_ENGINEERING']},
            {
                'Program_Category': 'System_Theory',
                'Required_ECTS': 8,
                "Keywords_Group": ['CONTROL_THEORY']},
            {
                'Program_Category': 'Electronics and Circuits Module',
                'Required_ECTS': 34,
                "Keywords_Group": ['FUNDAMENTAL_ELECTRICAL_ENGINEERING', 'ELECTRONICS', 'ELECTRONICS_EXPERIMENT', 'ELECTRO_CIRCUIT', 'SIGNAL_SYSTEM', 'ELECTRO_MAGNET', 'ELECTRO_CIRCUIT_DESIGN']},
            {
                'Program_Category': 'Theoretical_Module_EECS',
                'Required_ECTS': 8,
                "Keywords_Group": ['EE_HF_RF_THEO_INFO']},
            {
                'Program_Category': 'Application_Module_EECS',
                'Required_ECTS': 20,
                "Keywords_Group": ['POWER_ELECTRONICS', 'COMMUNICATION_ENGINEERING', 'EE_ADVANCED_ELECTRO', 'EE_APPLICATION_ORIENTED']}
        ]
    }, {
        "program_name": "RWTH_EI",
        "program_category": [
            {
                'Program_Category': 'Mathematics',
                'Required_ECTS': 28,
                "Keywords_Group": ['CALCULUS', 'ME_MATH', 'MATH_PROB', 'MATH_LINEAR_ALGEBRA', 'DIFF_EQUATION', 'MATH_DISCRETE', 'MATH_NUM_METHOD']},
            {
                'Program_Category': 'Physics',
                'Required_ECTS': 10,
                "Keywords_Group": ['GENERAL_PHYSICS', 'EE_ADVANCED_PHYSICS', 'PHYSICS_EXP']},
            {
                'Program_Category': 'Programming and Computer science',
                'Required_ECTS': 12,
                "Keywords_Group": ['FUNDAMENTAL_COMPUTER_SCIENCE', 'EE_INTRO_COMPUTER_SCIENCE', 'PROGRAMMING_LANGUAGE', 'SOFTWARE_ENGINEERING']},
            {
                'Program_Category': 'System_Theory',
                'Required_ECTS': 8,
                "Keywords_Group": ['CONTROL_THEORY']},
            {
                'Program_Category': 'Electronics and Circuits Module',
                'Required_ECTS': 34,
                "Keywords_Group": ['FUNDAMENTAL_ELECTRICAL_ENGINEERING', 'ELECTRONICS', 'ELECTRONICS_EXPERIMENT', 'ELECTRO_CIRCUIT', 'SIGNAL_SYSTEM', 'ELECTRO_MAGNET', 'ELECTRO_CIRCUIT_DESIGN']},
            {
                'Program_Category': 'Theoretical_Module_EECS',
                'Required_ECTS': 8,
                "Keywords_Group": ['EE_HF_RF_THEO_INFO']},
            {
                'Program_Category': 'Application_Module_EECS',
                'Required_ECTS': 20,
                "Keywords_Group": ['POWER_ELECTRONICS', 'COMMUNICATION_ENGINEERING', 'EE_ADVANCED_ELECTRO', 'EE_APPLICATION_ORIENTED']}
        ]
    }, {
        "program_name": "STUTTGART_EI",
        "program_category": [
            {
                'Program_Category': 'Mathematics',
                'Required_ECTS': 24,
                "Keywords_Group": ['CALCULUS', 'ME_MATH', 'MATH_PROB', 'MATH_LINEAR_ALGEBRA', 'DIFF_EQUATION', 'MATH_DISCRETE', 'MATH_NUM_METHOD']},
            {
                'Program_Category': 'Physics Experiment',
                'Required_ECTS': 6,
                "Keywords_Group": ['GENERAL_PHYSICS', 'PHYSICS_EXP']},
            {
                'Program_Category': 'Microelectronics',
                'Required_ECTS': 9,
                "Keywords_Group": ['FUNDAMENTAL_ELECTRICAL_ENGINEERING', 'ELECTRONICS']},
            {
                'Program_Category': 'Intro. Electrical Engineering and project',
                'Required_ECTS': 9,
                "Keywords_Group": ['ELECTRONICS_EXPERIMENT']},
            {
                'Program_Category': 'Intro. Programming and project',
                'Required_ECTS': 6,
                "Keywords_Group": ['PROGRAMMING_LANGUAGE']},
            {
                'Program_Category': 'Intro. Software System',
                'Required_ECTS': 3,
                "Keywords_Group": ['SOFTWARE_ENGINEERING']},
            {
                'Program_Category': 'Energy Technique',
                'Required_ECTS': 9,
                "Keywords_Group": ['POWER_ELECTRONICS']},
            {
                'Program_Category': 'Circuits Technology',
                'Required_ECTS': 9,
                "Keywords_Group": ['ELECTRO_CIRCUIT', 'ELECTRO_CIRCUIT_DESIGN']},
            {
                'Program_Category': 'Electromagnetics',
                'Required_ECTS': 9,
                "Keywords_Group": ['ELECTRO_MAGNET', 'EE_HF_RF_THEO_INFO']},
            {
                'Program_Category': 'Communication Engineering',
                'Required_ECTS': 9,
                "Keywords_Group": ['COMMUNICATION_ENGINEERING']},
            {
                'Program_Category': 'Intro. Information processing',
                'Required_ECTS': 6,
                "Keywords_Group": ['EE_INTRO_COMPUTER_SCIENCE']},
            {
                'Program_Category': 'Signals and Systems',
                'Required_ECTS': 6,
                "Keywords_Group": ['SIGNAL_SYSTEM']},
            {
                'Program_Category': 'Advanced Modules',
                'Required_ECTS': 6,
                "Keywords_Group": ['CONTROL_THEORY', 'SEMICONDUCTOR', 'EE_ADVANCED_ELECTRO', 'EE_APPLICATION_ORIENTED']}
        ]
    }, {
        "program_name": "TUM_MSCE",
        "program_category": [
            {
                'Program_Category': 'Higher Mathematics',
                'Required_ECTS': 30,
                "Keywords_Group": ['CALCULUS', 'ME_MATH', 'MATH_PROB', 'MATH_LINEAR_ALGEBRA', 'DIFF_EQUATION', 'MATH_DISCRETE', 'MATH_NUM_METHOD']},
            {
                'Program_Category': 'Fundamental Electrical Engineering',
                'Required_ECTS': 66,
                "Keywords_Group": ['FUNDAMENTAL_ELECTRICAL_ENGINEERING', 'EE_INTRO_COMPUTER_SCIENCE', 'PROGRAMMING_LANGUAGE', 'ELECTRONICS', 'ELECTRONICS_EXPERIMENT', 'ELECTRO_CIRCUIT', 'SIGNAL_SYSTEM', 'ELECTRO_MAGNET', 'POWER_ELECTRONICS', 'SEMICONDUCTOR', 'ELECTRO_CIRCUIT_DESIGN']},
            {
                'Program_Category': 'Fundamental Communication',
                'Required_ECTS': 30,
                "Keywords_Group": ['COMMUNICATION_ENGINEERING', 'EE_HF_RF_THEO_INFO', 'EE_ADVANCED_ELECTRO', 'COMPUTER_NETWORK']}
        ]
    }, {
        "program_name": "TUM_MSPE",
        "program_category": [
            {
                'Program_Category': 'Higher Mathematics',
                'Required_ECTS': 30,
                "Keywords_Group": ['CALCULUS', 'ME_MATH', 'MATH_PROB', 'MATH_LINEAR_ALGEBRA', 'DIFF_EQUATION', 'MATH_DISCRETE', 'MATH_NUM_METHOD']},
            {
                'Program_Category': 'Fundamental Electrical Engineering',
                'Required_ECTS': 45,
                "Keywords_Group": ['FUNDAMENTAL_ELECTRICAL_ENGINEERING', 'EE_INTRO_COMPUTER_SCIENCE', 'PROGRAMMING_LANGUAGE', 'ELECTRONICS', 'ELECTRONICS_EXPERIMENT', 'ELECTRO_CIRCUIT', 'SIGNAL_SYSTEM', 'ELECTRO_MAGNET', 'POWER_ELECTRONICS', 'SEMICONDUCTOR', 'ELECTRO_CIRCUIT_DESIGN']},
            {
                'Program_Category': 'Fundamental Mechanics',
                'Required_ECTS': 45,
                "Keywords_Group": ['EE_MACHINE']}
        ]
    }, {
        "program_name": "TUM_MSNE",
        "program_category": [
            {
                'Program_Category': 'Higher Mathematics',
                'Required_ECTS': 32,
                "Keywords_Group": ['CALCULUS', 'ME_MATH', 'MATH_PROB', 'MATH_LINEAR_ALGEBRA', 'DIFF_EQUATION', 'MATH_DISCRETE', 'MATH_NUM_METHOD']},
            {
                'Program_Category': 'Natural Science (Physics, Biochem., neuroscience',
                'Required_ECTS': 45,
                "Keywords_Group": ['GENERAL_PHYSICS', 'EE_ADVANCED_PHYSICS', 'PHYSICS_EXP']},
            {
                'Program_Category': 'Bio and medical engineering',
                'Required_ECTS': 40,
                "Keywords_Group": []}
        ]
    }, {
        "program_name": "TUHH_MICROELECTRONICS",
        "program_category": [
            {
                'Program_Category': 'Mathematics',
                'Required_ECTS': 30,
                "Keywords_Group": ['CALCULUS', 'ME_MATH', 'MATH_PROB', 'MATH_LINEAR_ALGEBRA', 'DIFF_EQUATION', 'MATH_DISCRETE', 'MATH_NUM_METHOD']},
            {
                'Program_Category': 'Computer Science',
                'Required_ECTS': 18,
                "Keywords_Group": ['FUNDAMENTAL_COMPUTER_SCIENCE', 'EE_INTRO_COMPUTER_SCIENCE', 'PROGRAMMING_LANGUAGE', 'SOFTWARE_ENGINEERING']},
            {
                'Program_Category': 'Control Theory',
                'Required_ECTS': 6,
                "Keywords_Group": ['CONTROL_THEORY']},
            {
                'Program_Category': 'Physics',
                'Required_ECTS': 6,
                "Keywords_Group": ['GENERAL_PHYSICS', 'EE_ADVANCED_PHYSICS', 'PHYSICS_EXP']},
            {
                'Program_Category': 'Fundamental Electrical Engineering',
                'Required_ECTS': 12,
                "Keywords_Group": ['FUNDAMENTAL_ELECTRICAL_ENGINEERING', 'EE_INTRO_COMPUTER_SCIENCE', 'PROGRAMMING_LANGUAGE', 'ELECTRONICS', 'ELECTRONICS_EXPERIMENT', 'POWER_ELECTRONICS', 'SEMICONDUCTOR']},
            {
                'Program_Category': 'Materials in Electrical Engineering',
                'Required_ECTS': 3,
                "Keywords_Group": ['ELECTRICAL_MATERIALS']},
            {
                'Program_Category': 'Measurements: Methods and data processing',
                'Required_ECTS': 3,
                "Keywords_Group": ['ELECTRONICS_EXPERIMENT']},
            {
                'Program_Category': 'Circuit theory',
                'Required_ECTS': 6,
                "Keywords_Group": ['ELECTRO_CIRCUIT', 'ELECTRO_CIRCUIT_DESIGN']},
            {
                'Program_Category': 'Transmission Line',
                'Required_ECTS': 6,
                "Keywords_Group": ['EE_ADVANCED_ELECTRO']},
            {
                'Program_Category': 'Signals and systems',
                'Required_ECTS': 6,
                "Keywords_Group": ['SIGNAL_SYSTEM']},
            {
                'Program_Category': 'Theoretical Electrical Engineering',
                'Required_ECTS': 12,
                "Keywords_Group": ['ELECTRO_MAGNET']},
            {
                'Program_Category': 'Semiconductor and electronics devices',
                'Required_ECTS': 6,
                "Keywords_Group": ['SEMICONDUCTOR']},
        ]
    }, {
        "program_name": "FAU_INFO_COMM_TECH",
        "program_category": [
            {
                'Program_Category': 'Higher Mathematics',
                'Required_ECTS': 30,
                "Keywords_Group": ['CALCULUS', 'ME_MATH', 'MATH_PROB', 'MATH_LINEAR_ALGEBRA', 'DIFF_EQUATION', 'MATH_DISCRETE', 'MATH_NUM_METHOD']},
            {
                'Program_Category': 'Computer Science',
                'Required_ECTS': 30,
                "Keywords_Group": ['FUNDAMENTAL_COMPUTER_SCIENCE', 'EE_INTRO_COMPUTER_SCIENCE', 'PROGRAMMING_LANGUAGE', 'SOFTWARE_ENGINEERING']},
            {
                'Program_Category': 'Communications Engineering',
                'Required_ECTS': 30,
                "Keywords_Group": ['COMMUNICATION_ENGINEERING', 'SIGNAL_SYSTEM', 'EE_HF_RF_THEO_INFO', 'EE_ADVANCED_ELECTRO']},
            {
                'Program_Category': 'Electrical Engineering',
                'Required_ECTS': 30,
                "Keywords_Group": ['FUNDAMENTAL_ELECTRICAL_ENGINEERING', 'EE_INTRO_COMPUTER_SCIENCE', 'PROGRAMMING_LANGUAGE', 'ELECTRONICS', 'ELECTRONICS_EXPERIMENT', 'ELECTRO_CIRCUIT', 'ELECTRO_MAGNET', 'POWER_ELECTRONICS', 'SEMICONDUCTOR', 'ELECTRO_CIRCUIT_DESIGN']},
        ]
    }, {
        "program_name": "TUM_ASIA_IC_DESIGN",
        "program_category": [
            {
                'Program_Category': 'Higher Mathematics',
                'Required_ECTS': 24,
                "Keywords_Group": ['CALCULUS', 'ME_MATH', 'MATH_PROB', 'MATH_LINEAR_ALGEBRA', 'DIFF_EQUATION', 'MATH_DISCRETE', 'MATH_NUM_METHOD']},
            {
                'Program_Category': 'Fundamental Electrical Engineering',
                'Required_ECTS': 66,
                "Keywords_Group": ['FUNDAMENTAL_ELECTRICAL_ENGINEERING', 'EE_INTRO_COMPUTER_SCIENCE', 'PROGRAMMING_LANGUAGE', 'ELECTRONICS', 'ELECTRONICS_EXPERIMENT', 'SIGNAL_SYSTEM', 'ELECTRO_MAGNET', 'POWER_ELECTRONICS', 'SEMICONDUCTOR']},
            {
                'Program_Category': 'Communications Engineering',
                'Required_ECTS': 30,
                "Keywords_Group": ['ELECTRO_CIRCUIT', 'ELECTRO_CIRCUIT_DESIGN', 'COMPUTER_NETWORK']},
        ]
    }, {
        "program_name": "KIT_EI",
        "program_category": [
            {
                'Program_Category': 'Higher Mathematics',
                'Required_ECTS': 42,
                "Keywords_Group": ['CALCULUS', 'ME_MATH', 'MATH_PROB', 'MATH_LINEAR_ALGEBRA', 'DIFF_EQUATION', 'MATH_DISCRETE', 'MATH_NUM_METHOD']},
            {
                'Program_Category': 'Fundamental Electrical Engineering',
                'Required_ECTS': 28,
                "Keywords_Group": ['FUNDAMENTAL_ELECTRICAL_ENGINEERING', 'ELECTRONICS', 'ELECTRONICS_EXPERIMENT', 'ELECTRO_MAGNET', 'POWER_ELECTRONICS', 'SEMICONDUCTOR']},
            {
                'Program_Category': 'System Engineering',
                'Required_ECTS': 14,
                "Keywords_Group": ['CONTROL_THEORY', 'SIGNAL_SYSTEM']},
            {
                'Program_Category': 'Information technology',
                'Required_ECTS': 19,
                "Keywords_Group": ['EE_INTRO_COMPUTER_SCIENCE', 'PROGRAMMING_LANGUAGE', 'COMMUNICATION_ENGINEERING'],
                "fpso": "https://www.etit.kit.edu/rd_download/MHB/MHB_BSc23_ETIT_WS23-82-048-H-2023_v1_2023-10-20_de.pdf"},

        ]
    }]

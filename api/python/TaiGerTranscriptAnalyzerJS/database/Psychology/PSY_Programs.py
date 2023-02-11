import xlsxwriter
from CourseSuggestionAlgorithms import *
from util import *
from database.Psychology.PSY_KEYWORDS import *
from cell_formatter import red_out_failed_subject, red_out_insufficient_credit
import pandas as pd
import sys

# Global variable:
column_len_array = []

# FPSO: http://www.en.mcls.uni-muenchen.de/study_programs/master/documents/index.html
# http://www.en.mcls.uni-muenchen.de/study_programs/master/documents1/faq_application.pdf


def LMU_PSYCHOLOGY_LEARNING_SCIENCE(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'LMU_PSYCHOLOGY_LEARNING_SCIENCE'
    print("Create " + program_name + " sheet")
    df_transcript_array_temp = []
    df_category_courses_sugesstion_data_temp = []
    for idx, df in enumerate(df_transcript_array):
        df_transcript_array_temp.append(df.copy())
    for idx, df in enumerate(df_category_courses_sugesstion_data):
        df_category_courses_sugesstion_data_temp.append(df.copy())
    #####################################################################
    ############## Program Specific Parameters ##########################
    #####################################################################

    # Create transcript_sorted_group to program_category mapping
    # - Theoretical background, methods, and empirical findings concerning different aspects of learning and teaching in different
    # educational contexts. These aspects encompass e.g. cognition, emotion, development, instruction, training, excellence,
    # achievement, transfer, counseling, education, didactics, neuro-cognitive and clinical perspectives.
    PROG_SPEC_LEARNING_SCIENCE_PARAM = {
        'Program_Category': 'Learning Sciences Module', 'Required_ECTS': 30}
    # - Scientific Research Methods and Statistics: You should be familiar with elements, key terms and
    #   processes of research designs and strategies as well as statistics (descriptive and inferential) and preferably
    #   statistical software (e.g. SPSS). Concepts which refer to Descriptive Statistics include Measures of Central Tendency
    #   and Dispersion, Frequency Distribution, Z-Scores among others. Key Terms which refer to inferential statistics are Hypotheses-testing,
    #   One- and Two-Tailed Tests, Bivariate Correlation and Regression, Method of Ordinary Least Squares (OLS), One-Way Independent ANOVA and
    #   Factorial ANOVA, t-test and t-distribution and Chi-Square Tests among others.
    PROG_SPEC_SCIENTIFIC_METHODE_STATISTICS_PARAM = {
        'Program_Category': 'Scientific Research Methods and Statistics', 'Required_ECTS': 30}
    # Academic skills refer to the skills necessary to find, process, understand, interpret, evaluate, discuss and present research.
    PROG_SPEC_ACADEMIC_SKILLS_PARAM = {
        'Program_Category': 'Academic Skills', 'Required_ECTS': 20}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_LEARNING_SCIENCE_PARAM,  # learning science
        PROG_SPEC_SCIENTIFIC_METHODE_STATISTICS_PARAM,

        # 專題 paper essay 研究  responsibilities in your classes/internship
        PROG_SPEC_ACADEMIC_SKILLS_PARAM,
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_OTHERS,  # 微積分
        PROG_SPEC_OTHERS,  # 線性代數
        PROG_SPEC_OTHERS,  # 機率
        PROG_SPEC_OTHERS,  # 數學
        PROG_SPEC_OTHERS,  # 經濟
        PROG_SPEC_OTHERS,  # 計量經濟
        PROG_SPEC_OTHERS,  # 企業
        PROG_SPEC_OTHERS,  # 管理
        PROG_SPEC_SCIENTIFIC_METHODE_STATISTICS_PARAM,  # 統計
        PROG_SPEC_OTHERS,  # 金融
        PROG_SPEC_OTHERS,  # 行銷
        PROG_SPEC_ACADEMIC_SKILLS_PARAM,  # 作業研究
        PROG_SPEC_LEARNING_SCIENCE_PARAM,  # 觀察研究
        PROG_SPEC_OTHERS,  # 程式
        PROG_SPEC_SCIENTIFIC_METHODE_STATISTICS_PARAM,  # 資料科學
        PROG_SPEC_ACADEMIC_SKILLS_PARAM,  # 論文
        PROG_SPEC_LEARNING_SCIENCE_PARAM,  # 心理學
        PROG_SPEC_LEARNING_SCIENCE_PARAM,  # 心理學實驗
        PROG_SPEC_LEARNING_SCIENCE_PARAM,  # 認知
        PROG_SPEC_OTHERS,  # 行為
        PROG_SPEC_OTHERS,  # 神經科學
        PROG_SPEC_OTHERS  # 其他
    ]

    # Development check
    if len(program_category_map) != len(df_transcript_array):
        print("program_category_map size: " + str(len(program_category_map)))
        print("df_transcript_array size:  " + str(len(df_transcript_array)))
        print("Please check the number of program_category_map again!")
        sys.exit()

    #####################################################################
    ####################### End #########################################
    #####################################################################

    WriteToExcel(writer, program_name, program_category, program_category_map,
                 transcript_sorted_group_map, df_transcript_array_temp, df_category_courses_sugesstion_data_temp, column_len_array)


def TU_BERLIN_COMP_NEUROSCIENCE(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'TU_BERLIN_COMP_NEUROSCIENCE'
    print("Create " + program_name + " sheet")
    df_transcript_array_temp = []
    df_category_courses_sugesstion_data_temp = []
    for idx, df in enumerate(df_transcript_array):
        df_transcript_array_temp.append(df.copy())
    for idx, df in enumerate(df_category_courses_sugesstion_data):
        df_category_courses_sugesstion_data_temp.append(df.copy())
    #####################################################################
    ############## Program Specific Parameters ##########################
    #####################################################################

    # Create transcript_sorted_group to program_category mapping
    PROG_SPEC_MATH_PARAM = {
        'Program_Category': 'Mathematics', 'Required_ECTS': 12}
    PROG_SPEC_LINEAR_ALG_PARAM = {
        'Program_Category': 'Linear Algebra', 'Required_ECTS': 6}
    PROG_SPEC_PROB_STAT_PARAM = {
        'Program_Category': 'Probability and Statistics', 'Required_ECTS': 6}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_MATH_PARAM,  # 企業管理
        PROG_SPEC_LINEAR_ALG_PARAM,  # 線性代數
        PROG_SPEC_PROB_STAT_PARAM,  # 機率與統計
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_MATH_PARAM,  # 微積分
        PROG_SPEC_LINEAR_ALG_PARAM,  # 線性代數
        PROG_SPEC_PROB_STAT_PARAM,  # 機率
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_OTHERS,  # 經濟
        PROG_SPEC_OTHERS,  # 計量經濟
        PROG_SPEC_OTHERS,  # 企業
        PROG_SPEC_OTHERS,  # 管理
        PROG_SPEC_PROB_STAT_PARAM,  # 統計
        PROG_SPEC_OTHERS,  # 金融
        PROG_SPEC_OTHERS,  # 行銷
        PROG_SPEC_OTHERS,  # 作業研究
        PROG_SPEC_OTHERS,  # 觀察研究
        PROG_SPEC_OTHERS,  # 程式
        PROG_SPEC_OTHERS,  # 資料科學
        PROG_SPEC_OTHERS,  # 論文
        PROG_SPEC_OTHERS,  # 心理學
        PROG_SPEC_OTHERS,  # 心理學實驗
        PROG_SPEC_OTHERS,  # 認知
        PROG_SPEC_OTHERS,  # 行為
        PROG_SPEC_OTHERS,  # 神經科學
        PROG_SPEC_OTHERS  # 其他
    ]

    # Development check
    if len(program_category_map) != len(df_transcript_array):
        print("program_category_map size: " + str(len(program_category_map)))
        print("df_transcript_array size:  " + str(len(df_transcript_array)))
        print("Please check the number of program_category_map again!")
        sys.exit()

    #####################################################################
    ####################### End #########################################
    #####################################################################

    WriteToExcel(writer, program_name, program_category, program_category_map,
                 transcript_sorted_group_map, df_transcript_array_temp, df_category_courses_sugesstion_data_temp, column_len_array)

# https://www.ovgu.de/unimagdeburg/en/Study/Study+Programmes/Master/Financial+Economics-p-55738.html
# https://www.isp.ovgu.de/manec_media/FINECRelevanceDocu.pdf


def UNI_BREMEN_NEUROSCIENCES(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'UNI_BREMEN_NEUROSCIENCES'
    print("Create " + program_name + " sheet")
    df_transcript_array_temp = []
    df_category_courses_sugesstion_data_temp = []
    for idx, df in enumerate(df_transcript_array):
        df_transcript_array_temp.append(df.copy())
    for idx, df in enumerate(df_category_courses_sugesstion_data):
        df_category_courses_sugesstion_data_temp.append(df.copy())
    #####################################################################
    ############## Program Specific Parameters ##########################
    #####################################################################

    # Create transcript_sorted_group to program_category mapping

    PROG_SPEC_COGNITIVE_SCIENCE_MODULE_PARAM = {
        'Program_Category': 'Cognitive Science', 'Required_ECTS': 60}  #
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        # statistics, math, decision analysis, econometrics)
        PROG_SPEC_COGNITIVE_SCIENCE_MODULE_PARAM,
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_OTHERS,  # 微積分
        PROG_SPEC_OTHERS,  # 線性代數
        PROG_SPEC_OTHERS,  # 機率
        PROG_SPEC_OTHERS,  # 數學
        PROG_SPEC_OTHERS,  # 經濟
        PROG_SPEC_OTHERS,  # 計量經濟
        PROG_SPEC_OTHERS,  # 企業
        PROG_SPEC_OTHERS,  # 管理
        PROG_SPEC_COGNITIVE_SCIENCE_MODULE_PARAM,  # 統計
        PROG_SPEC_OTHERS,  # 金融
        PROG_SPEC_OTHERS,  # 行銷
        PROG_SPEC_COGNITIVE_SCIENCE_MODULE_PARAM,  # 作業研究
        PROG_SPEC_COGNITIVE_SCIENCE_MODULE_PARAM,  # 觀察研究
        PROG_SPEC_COGNITIVE_SCIENCE_MODULE_PARAM,  # 程式
        PROG_SPEC_COGNITIVE_SCIENCE_MODULE_PARAM,  # 資料科學
        PROG_SPEC_OTHERS,  # 論文
        PROG_SPEC_COGNITIVE_SCIENCE_MODULE_PARAM,  # 心理學
        PROG_SPEC_COGNITIVE_SCIENCE_MODULE_PARAM,  # 心理學實驗
        PROG_SPEC_COGNITIVE_SCIENCE_MODULE_PARAM,  # 認知
        PROG_SPEC_COGNITIVE_SCIENCE_MODULE_PARAM,  # 行為
        PROG_SPEC_OTHERS,  # 神經科學
        PROG_SPEC_OTHERS  # 其他
    ]

    # Development check
    if len(program_category_map) != len(df_transcript_array):
        print("program_category_map size: " + str(len(program_category_map)))
        print("df_transcript_array size:  " + str(len(df_transcript_array)))
        print("Please check the number of program_category_map again!")
        sys.exit()

    #####################################################################
    ####################### End #########################################
    #####################################################################

    WriteToExcel(writer, program_name, program_category, program_category_map,
                 transcript_sorted_group_map, df_transcript_array_temp, df_category_courses_sugesstion_data_temp, column_len_array)

# https://tu-dresden.de/bu/verkehr/studium/studienangebot/transportation-economics-master/eignungsfeststellung


def UNI_OLDENBURG_NEUROSCIENCES(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'UNI_OLDENBURG_NEUROSCIENCES'
    print("Create " + program_name + " sheet")
    df_transcript_array_temp = []
    df_category_courses_sugesstion_data_temp = []
    for idx, df in enumerate(df_transcript_array):
        df_transcript_array_temp.append(df.copy())
    for idx, df in enumerate(df_category_courses_sugesstion_data):
        df_category_courses_sugesstion_data_temp.append(df.copy())
    #####################################################################
    ############## Program Specific Parameters ##########################
    #####################################################################

    # Create transcript_sorted_group to program_category mapping

    PROG_SPEC_NEURO_SCIENCE_PARAM = {
        'Program_Category': 'Neuroscience', 'Required_ECTS': 12}
    # math
    PROG_SPEC_MATH_STAT_PROGRAMMING_PARAM = {
        'Program_Category': 'Mathematics, Statistics / Programming', 'Required_ECTS': 12}

    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_NEURO_SCIENCE_PARAM,  # 神經科學
        PROG_SPEC_MATH_STAT_PROGRAMMING_PARAM,  # Mathematics, Statistics / Programming
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_MATH_STAT_PROGRAMMING_PARAM,  # 微積分
        PROG_SPEC_MATH_STAT_PROGRAMMING_PARAM,  # 線性代數
        PROG_SPEC_MATH_STAT_PROGRAMMING_PARAM,  # 機率
        PROG_SPEC_MATH_STAT_PROGRAMMING_PARAM,  # 數學
        PROG_SPEC_OTHERS,  # 經濟
        PROG_SPEC_OTHERS,  # 計量經濟
        PROG_SPEC_OTHERS,  # 企業
        PROG_SPEC_OTHERS,  # 管理
        PROG_SPEC_MATH_STAT_PROGRAMMING_PARAM,  # 統計
        PROG_SPEC_OTHERS,  # 金融
        PROG_SPEC_OTHERS,  # 行銷
        PROG_SPEC_OTHERS,  # 作業研究
        PROG_SPEC_OTHERS,  # 觀察研究
        PROG_SPEC_OTHERS,  # 程式
        PROG_SPEC_OTHERS,  # 資料科學
        PROG_SPEC_OTHERS,  # 論文
        PROG_SPEC_OTHERS,  # 心理學
        PROG_SPEC_OTHERS,  # 心理學實驗
        PROG_SPEC_NEURO_SCIENCE_PARAM,  # 認知
        PROG_SPEC_OTHERS,  # 行為
        PROG_SPEC_NEURO_SCIENCE_PARAM,  # 神經科學
        PROG_SPEC_OTHERS  # 其他
    ]

    # Development check
    if len(program_category_map) != len(df_transcript_array):
        print("program_category_map size: " + str(len(program_category_map)))
        print("df_transcript_array size:  " + str(len(df_transcript_array)))
        print("Please check the number of program_category_map again!")
        sys.exit()

    #####################################################################
    ####################### End #########################################
    #####################################################################

    WriteToExcel(writer, program_name, program_category, program_category_map,
                 transcript_sorted_group_map, df_transcript_array_temp, df_category_courses_sugesstion_data_temp, column_len_array)


def UNI_OLDENBURG_NEUROCOGN_PSY(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'UNI_OLDENBURG_NEUROCOGN_PSY'
    print("Create " + program_name + " sheet")
    df_transcript_array_temp = []
    df_category_courses_sugesstion_data_temp = []
    for idx, df in enumerate(df_transcript_array):
        df_transcript_array_temp.append(df.copy())
    for idx, df in enumerate(df_category_courses_sugesstion_data):
        df_category_courses_sugesstion_data_temp.append(df.copy())
    #####################################################################
    ############## Program Specific Parameters ##########################
    #####################################################################

    # Create transcript_sorted_group to program_category mapping
    # Statistics
    PROG_SPEC_STAT_PARAM = {
        'Program_Category': 'Statistics', 'Required_ECTS': 5}
    PROG_SPEC_PSY_EXP_PARAM = {
        'Program_Category': 'Experimental work', 'Required_ECTS': 5}
    PROG_SPEC_PSY_PARAM = {
        'Program_Category': 'General / Cognitive Psychology', 'Required_ECTS': 6}
    PROG_SPEC_BIO_PSY_NEUROSCIENCE_PARAM = {
        'Program_Category': 'Biological Psychology / Neuroscience', 'Required_ECTS': 5}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_STAT_PARAM,  # 統計
        PROG_SPEC_PSY_EXP_PARAM,  # 實驗 (心理實驗 神經科學 實習 小論文 學術著作)
        PROG_SPEC_PSY_PARAM,  # Psycholgoy
        PROG_SPEC_BIO_PSY_NEUROSCIENCE_PARAM,  # 生物心理 神經科學
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_OTHERS,  # 微積分
        PROG_SPEC_OTHERS,  # 線性代數
        PROG_SPEC_OTHERS,  # 機率
        PROG_SPEC_OTHERS,  # 數學
        PROG_SPEC_OTHERS,  # 經濟
        PROG_SPEC_OTHERS,  # 計量經濟
        PROG_SPEC_OTHERS,  # 企業
        PROG_SPEC_OTHERS,  # 管理
        PROG_SPEC_STAT_PARAM,  # 統計
        PROG_SPEC_OTHERS,  # 金融
        PROG_SPEC_OTHERS,  # 行銷
        PROG_SPEC_OTHERS,  # 作業研究
        PROG_SPEC_OTHERS,  # 觀察研究
        PROG_SPEC_OTHERS,  # 程式
        PROG_SPEC_OTHERS,  # 資料科學
        PROG_SPEC_PSY_EXP_PARAM,  # 論文
        PROG_SPEC_PSY_PARAM,  # 心理學
        PROG_SPEC_PSY_EXP_PARAM,  # 心理學實驗
        PROG_SPEC_PSY_PARAM,  # 認知
        PROG_SPEC_OTHERS,  # 行為
        PROG_SPEC_BIO_PSY_NEUROSCIENCE_PARAM,  # 神經科學
        PROG_SPEC_OTHERS  # 其他
    ]

    # Development check
    if len(program_category_map) != len(df_transcript_array):
        print("program_category_map size: " + str(len(program_category_map)))
        print("df_transcript_array size:  " + str(len(df_transcript_array)))
        print("Please check the number of program_category_map again!")
        sys.exit()

    #####################################################################
    ####################### End #########################################
    #####################################################################

    WriteToExcel(writer, program_name, program_category, program_category_map,
                 transcript_sorted_group_map, df_transcript_array_temp, df_category_courses_sugesstion_data_temp, column_len_array)


def TU_DARMSTADT_COGNITIVE_SCIENCE(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'TU_DARMSTADT_COGNITIVE_SCIENCE'
    print("Create " + program_name + " sheet")
    df_transcript_array_temp = []
    df_category_courses_sugesstion_data_temp = []
    for idx, df in enumerate(df_transcript_array):
        df_transcript_array_temp.append(df.copy())
    for idx, df in enumerate(df_category_courses_sugesstion_data):
        df_category_courses_sugesstion_data_temp.append(df.copy())
    #####################################################################
    ############## Program Specific Parameters ##########################
    #####################################################################

    # Create transcript_sorted_group to program_category mapping
    # CS
    PROG_SPEC_CS_PARAM = {
        'Program_Category': 'Basic Computer Science', 'Required_ECTS': 30}
    # foundations of cognitive science (psychology, movement science, cognitive science, neuroscience, or related disciplines)
    PROG_SPEC_COGNITIVE_SCIENCE_PARAM = {
        'Program_Category': 'Cognitive Science', 'Required_ECTS': 30}
    # advanced courses in cognitive science: linguistics, philosophy, sports science, psychology
    PROG_SPEC_ADVANCED_COGNITIVE_SCIENCE_PARAM = {
        'Program_Category': 'Advanced Cognitive Science', 'Required_ECTS': 20}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_CS_PARAM,  # CS
        PROG_SPEC_COGNITIVE_SCIENCE_PARAM,  # 基礎認知科學
        PROG_SPEC_ADVANCED_COGNITIVE_SCIENCE_PARAM,  # 進階認知科學
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_OTHERS,  # 微積分
        PROG_SPEC_OTHERS,  # 線性代數
        PROG_SPEC_OTHERS,  # 機率
        PROG_SPEC_OTHERS,  # 數學
        PROG_SPEC_OTHERS,  # 經濟
        PROG_SPEC_OTHERS,  # 計量經濟
        PROG_SPEC_OTHERS,  # 企業
        PROG_SPEC_OTHERS,  # 管理
        PROG_SPEC_OTHERS,  # 統計
        PROG_SPEC_OTHERS,  # 金融
        PROG_SPEC_OTHERS,  # 行銷
        PROG_SPEC_OTHERS,  # 作業研究
        PROG_SPEC_OTHERS,  # 觀察研究
        PROG_SPEC_CS_PARAM,  # 程式
        PROG_SPEC_CS_PARAM,  # 資料科學
        PROG_SPEC_OTHERS,  # 論文
        PROG_SPEC_COGNITIVE_SCIENCE_PARAM,  # 心理學
        PROG_SPEC_COGNITIVE_SCIENCE_PARAM,  # 心理學實驗
        PROG_SPEC_COGNITIVE_SCIENCE_PARAM,  # 認知
        PROG_SPEC_COGNITIVE_SCIENCE_PARAM,  # 行為
        PROG_SPEC_OTHERS,  # 神經科學
        PROG_SPEC_OTHERS  # 其他
    ]

    # Development check
    if len(program_category_map) != len(df_transcript_array):
        print("program_category_map size: " + str(len(program_category_map)))
        print("df_transcript_array size:  " + str(len(df_transcript_array)))
        print("Please check the number of program_category_map again!")
        sys.exit()

    #####################################################################
    ####################### End #########################################
    #####################################################################

    WriteToExcel(writer, program_name, program_category, program_category_map,
                 transcript_sorted_group_map, df_transcript_array_temp, df_category_courses_sugesstion_data_temp, column_len_array)


program_sort_function = [LMU_PSYCHOLOGY_LEARNING_SCIENCE,
                         TU_BERLIN_COMP_NEUROSCIENCE, UNI_BREMEN_NEUROSCIENCES, UNI_OLDENBURG_NEUROSCIENCES, UNI_OLDENBURG_NEUROCOGN_PSY, TU_DARMSTADT_COGNITIVE_SCIENCE]

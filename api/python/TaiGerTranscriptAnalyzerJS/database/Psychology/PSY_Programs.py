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
        PROG_SPEC_ACADEMIC_SKILLS_PARAM,  # 作業研究
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_OTHERS,  # 微積分
        PROG_SPEC_OTHERS,  # 數學
        PROG_SPEC_OTHERS,  # 經濟
        PROG_SPEC_OTHERS,  # 計量經濟
        PROG_SPEC_OTHERS,  # 企業
        PROG_SPEC_OTHERS,  # 管理
        PROG_SPEC_OTHERS,  # 會計
        PROG_SPEC_SCIENTIFIC_METHODE_STATISTICS_PARAM,  # 統計
        PROG_SPEC_OTHERS,  # 金融
        PROG_SPEC_OTHERS,  # 行銷
        PROG_SPEC_ACADEMIC_SKILLS_PARAM,  # 作業研究
        PROG_SPEC_ACADEMIC_SKILLS_PARAM,  # 觀察研究
        PROG_SPEC_OTHERS,  # 程式
        PROG_SPEC_SCIENTIFIC_METHODE_STATISTICS_PARAM,  # 資料科學
        PROG_SPEC_OTHERS,  # 論文
        PROG_SPEC_OTHERS,  # 心理學
        PROG_SPEC_OTHERS,  # 認知
        PROG_SPEC_OTHERS,  # 行為
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


def LMU_NEURO_COGN_PSYCHOLOGY(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'LMU_NEURO_COGN_PSYCHOLOGY'
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
    # Statistik, Empirische Forschungsmethoden, Quantitative Methoden, Mathematik
    PROG_SPEC_EMPIRIAL_METHODE_PARAM = {
        'Program_Category': 'BWL, Quantitative Method, Mathematik', 'Required_ECTS': 15}  # 15 PUnkto
    #  Bachelorarbeit, eines Projekts, eines wissenschaftlichen Aufsatzes
    PROG_SPEC_BACHELORARBEIT_PARAM = {
        'Program_Category': 'Bachelor Thesis', 'Required_ECTS': 5}                # 5 Punkte
    # quantitativen Entscheidungsunterstützung mit Methoden des Operations Research
    PROG_SPEC_BWL_PARAM = {
        'Program_Category': 'BWL', 'Required_ECTS': 6}                           # 6 Punkte
    # VWL mind. 5 Credits oder Module aus dem Bereich Consumer Behavior mind. 5 Credits
    PROG_SPEC_VWL_PARAM = {
        'Program_Category': 'Volkswirtschaftliche Module', 'Required_ECTS': 10}   # 10 Punkte
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_EMPIRIAL_METHODE_PARAM,  # 觀察研究, 研究方法, 量化分析, 數學
        PROG_SPEC_BACHELORARBEIT_PARAM,  # 論文
        PROG_SPEC_BWL_PARAM,  # 企業管理
        PROG_SPEC_VWL_PARAM,  # 經濟
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_OTHERS,  # 微積分
        PROG_SPEC_EMPIRIAL_METHODE_PARAM,  # 數學
        PROG_SPEC_VWL_PARAM,  # 企業
        PROG_SPEC_VWL_PARAM,  # 經濟
        PROG_SPEC_EMPIRIAL_METHODE_PARAM,  # 計量經濟
        PROG_SPEC_BWL_PARAM,  # 管理
        PROG_SPEC_OTHERS,  # 會計
        PROG_SPEC_EMPIRIAL_METHODE_PARAM,  # 統計
        PROG_SPEC_OTHERS,  # 金融
        PROG_SPEC_OTHERS,  # 行銷
        PROG_SPEC_OTHERS,  # 作業研究
        PROG_SPEC_EMPIRIAL_METHODE_PARAM,  # 觀察研究
        PROG_SPEC_OTHERS,  # 程式
        PROG_SPEC_OTHERS,  # 資料科學
        PROG_SPEC_BACHELORARBEIT_PARAM,  # 論文
        PROG_SPEC_OTHERS,  # 心理學
        PROG_SPEC_OTHERS,  # 認知
        PROG_SPEC_OTHERS,  # 行為
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


def FU_BERLIN_COGN_NEUROSCIENCE(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'FU_BERLIN_COGN_NEUROSCIENCE'
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
    PROG_SPEC_VWL_PARAM = {
        'Program_Category': 'Economics', 'Required_ECTS': 18}   # 18 Punkte
    # Statistik, Empirische Forschungsmethoden, Quantitative Methoden, Mathematik
    PROG_SPEC_STATISTIK_MATH_PARAM = {
        'Program_Category': 'Statistics and Math', 'Required_ECTS': 15}  # 15 PUnkto
    # quantitativen Entscheidungsunterstützung mit Methoden des Operations Research
    PROG_SPEC_BWL_PARAM = {
        'Program_Category': 'Business Administration', 'Required_ECTS': 48}  # 48 Punkte
    # VWL mind. 5 Credits oder Module aus dem Bereich Consumer Behavior mind. 5 Credits

    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_VWL_PARAM,  # 經濟
        PROG_SPEC_STATISTIK_MATH_PARAM,  # 數學 統計
        PROG_SPEC_BWL_PARAM,  # 企業管理
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_STATISTIK_MATH_PARAM,  # 微積分
        PROG_SPEC_STATISTIK_MATH_PARAM,  # 數學
        PROG_SPEC_VWL_PARAM,  # 經濟
        PROG_SPEC_VWL_PARAM,  # 計量經濟
        PROG_SPEC_BWL_PARAM,  # 企業
        PROG_SPEC_BWL_PARAM,  # 管理
        PROG_SPEC_BWL_PARAM,  # 會計
        PROG_SPEC_STATISTIK_MATH_PARAM,  # 統計
        PROG_SPEC_BWL_PARAM,  # 金融
        PROG_SPEC_OTHERS,  # 行銷
        PROG_SPEC_OTHERS,  # 作業研究
        PROG_SPEC_OTHERS,  # 觀察研究
        PROG_SPEC_OTHERS,  # 程式
        PROG_SPEC_OTHERS,  # 資料科學
        PROG_SPEC_OTHERS,  # 論文
        PROG_SPEC_OTHERS,  # 心理學
        PROG_SPEC_OTHERS,  # 認知
        PROG_SPEC_OTHERS,  # 行為
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

# https://www.uni-mannheim.de/studium/studienangebot/mannheim-master-in-management/#c35913


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
    PROG_SPEC_BWL_PARAM = {
        'Program_Category': 'Business Administration', 'Required_ECTS': 36}  # 36 Punkte
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_BWL_PARAM,  # 企業管理
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_OTHERS,  # 微積分
        PROG_SPEC_OTHERS,  # 數學
        PROG_SPEC_OTHERS,  # 經濟
        PROG_SPEC_OTHERS,  # 計量經濟
        PROG_SPEC_BWL_PARAM,  # 企業
        PROG_SPEC_BWL_PARAM,  # 管理
        PROG_SPEC_BWL_PARAM,  # 會計
        PROG_SPEC_OTHERS,  # 統計
        PROG_SPEC_BWL_PARAM,  # 金融
        PROG_SPEC_OTHERS,  # 行銷
        PROG_SPEC_OTHERS,  # 作業研究
        PROG_SPEC_OTHERS,  # 觀察研究
        PROG_SPEC_OTHERS,  # 程式
        PROG_SPEC_OTHERS,  # 資料科學
        PROG_SPEC_OTHERS,  # 論文
        PROG_SPEC_OTHERS,  # 心理學
        PROG_SPEC_OTHERS,  # 認知
        PROG_SPEC_OTHERS,  # 行為
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
    # statistics, math, decision analysis, econometrics)
    PROG_SPEC_QUAN_MODULE_PARAM = {
        'Program_Category': 'Quantitative Modules', 'Required_ECTS': 18}  # 18 PUnkte
    PROG_SPEC_ECO_BWL_PARAM = {
        'Program_Category': 'Economics / Business Modules', 'Required_ECTS': 60}  # 60 Punkte
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_QUAN_MODULE_PARAM,  # statistics, math, decision analysis, econometrics)
        PROG_SPEC_ECO_BWL_PARAM,  # 經濟 企業管理
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_QUAN_MODULE_PARAM,  # 微積分
        PROG_SPEC_QUAN_MODULE_PARAM,  # 數學
        PROG_SPEC_ECO_BWL_PARAM,  # 經濟
        PROG_SPEC_QUAN_MODULE_PARAM,  # 計量經濟
        PROG_SPEC_ECO_BWL_PARAM,  # 企業
        PROG_SPEC_ECO_BWL_PARAM,  # 管理
        PROG_SPEC_ECO_BWL_PARAM,  # 會計
        PROG_SPEC_QUAN_MODULE_PARAM,  # 統計
        PROG_SPEC_ECO_BWL_PARAM,  # 金融
        PROG_SPEC_OTHERS,  # 行銷
        PROG_SPEC_OTHERS,  # 作業研究
        PROG_SPEC_OTHERS,  # 觀察研究
        PROG_SPEC_OTHERS,  # 程式
        PROG_SPEC_OTHERS,  # 資料科學
        PROG_SPEC_OTHERS,  # 論文
        PROG_SPEC_OTHERS,  # 心理學
        PROG_SPEC_OTHERS,  # 認知
        PROG_SPEC_OTHERS,  # 行為
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
    # economics
    PROG_SPEC_VWL_PARAM = {
        'Program_Category': 'Economics', 'Required_ECTS': 20}   # 18 Punkte
    # BA
    PROG_SPEC_BWL_PARAM = {
        'Program_Category': 'Business Administration', 'Required_ECTS': 20}  # 48 Punkte
    # mathematics, statistics, econometrics, operations research, programming, data analytics
    PROG_SPEC_QUAN_METHOD_PARAM = {
        'Program_Category': 'Statistics and Math', 'Required_ECTS': 20}  # 15 PUnkto
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_VWL_PARAM,  # 經濟
        PROG_SPEC_BWL_PARAM,  # 企業管理
        PROG_SPEC_QUAN_METHOD_PARAM,  # 數學 統計 量化經濟
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_QUAN_METHOD_PARAM,  # 微積分
        PROG_SPEC_QUAN_METHOD_PARAM,  # 數學
        PROG_SPEC_VWL_PARAM,  # 經濟
        PROG_SPEC_QUAN_METHOD_PARAM,  # 計量經濟
        PROG_SPEC_BWL_PARAM,  # 企業
        PROG_SPEC_BWL_PARAM,  # 管理
        PROG_SPEC_BWL_PARAM,  # 會計
        PROG_SPEC_QUAN_METHOD_PARAM,  # 統計
        PROG_SPEC_BWL_PARAM,  # 金融
        PROG_SPEC_OTHERS,  # 行銷
        PROG_SPEC_QUAN_METHOD_PARAM,  # 作業研究
        PROG_SPEC_OTHERS,  # 觀察研究
        PROG_SPEC_QUAN_METHOD_PARAM,  # 程式
        PROG_SPEC_QUAN_METHOD_PARAM,  # 資料科學
        PROG_SPEC_OTHERS,  # 論文
        PROG_SPEC_OTHERS,  # 心理學
        PROG_SPEC_OTHERS,  # 認知
        PROG_SPEC_OTHERS,  # 行為
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
    # economics
    PROG_SPEC_VWL_PARAM = {
        'Program_Category': 'Economics', 'Required_ECTS': 20}   # 18 Punkte
    # BA
    PROG_SPEC_BWL_PARAM = {
        'Program_Category': 'Business Administration', 'Required_ECTS': 20}  # 48 Punkte
    # mathematics, statistics, econometrics, operations research, programming, data analytics
    PROG_SPEC_QUAN_METHOD_PARAM = {
        'Program_Category': 'Statistics and Math', 'Required_ECTS': 20}  # 15 PUnkto
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_VWL_PARAM,  # 經濟
        PROG_SPEC_BWL_PARAM,  # 企業管理
        PROG_SPEC_QUAN_METHOD_PARAM,  # 數學 統計 量化經濟
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_QUAN_METHOD_PARAM,  # 微積分
        PROG_SPEC_QUAN_METHOD_PARAM,  # 數學
        PROG_SPEC_VWL_PARAM,  # 經濟
        PROG_SPEC_QUAN_METHOD_PARAM,  # 計量經濟
        PROG_SPEC_BWL_PARAM,  # 企業
        PROG_SPEC_BWL_PARAM,  # 管理
        PROG_SPEC_BWL_PARAM,  # 會計
        PROG_SPEC_QUAN_METHOD_PARAM,  # 統計
        PROG_SPEC_BWL_PARAM,  # 金融
        PROG_SPEC_OTHERS,  # 行銷
        PROG_SPEC_QUAN_METHOD_PARAM,  # 作業研究
        PROG_SPEC_OTHERS,  # 觀察研究
        PROG_SPEC_QUAN_METHOD_PARAM,  # 程式
        PROG_SPEC_QUAN_METHOD_PARAM,  # 資料科學
        PROG_SPEC_OTHERS,  # 論文
        PROG_SPEC_OTHERS,  # 心理學
        PROG_SPEC_OTHERS,  # 認知
        PROG_SPEC_OTHERS,  # 行為
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


program_sort_function = [LMU_PSYCHOLOGY_LEARNING_SCIENCE, LMU_NEURO_COGN_PSYCHOLOGY,
                         FU_BERLIN_COGN_NEUROSCIENCE, TU_BERLIN_COMP_NEUROSCIENCE, UNI_BREMEN_NEUROSCIENCES, UNI_OLDENBURG_NEUROSCIENCES, UNI_OLDENBURG_NEUROCOGN_PSY]

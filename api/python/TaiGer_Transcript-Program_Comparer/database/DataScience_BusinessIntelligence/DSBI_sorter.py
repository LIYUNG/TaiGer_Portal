import xlsxwriter
from CourseSuggestionAlgorithms import *
from util import *
from database.DataScience_BusinessIntelligence.DSBI_KEYWORDS import *
from cell_formatter import red_out_failed_subject, red_out_insufficient_credit
import pandas as pd
import sys
import os
env_file_path = os.path.realpath(__file__)
env_file_path = os.path.dirname(env_file_path)

# Global variable:
column_len_array = []

# Requirement: https://www.uni-mannheim.de/en/academics/programs/mannheim-master-in-data-science/#c35962


def MANNHEIM_DATA_SCIENCE(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'MANNHEIM_DATA_SCIENCE'
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

    PROG_SPEC_EMPIRIAL_METHODE_PARAM = {
        'Program_Category': 'Informatics, Math, Statistics, Empirical Research', 'Required_ECTS': 48}            # 10 Punkte
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_EMPIRIAL_METHODE_PARAM,
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_EMPIRIAL_METHODE_PARAM,  # 微積分
        PROG_SPEC_EMPIRIAL_METHODE_PARAM,  # 數學
        PROG_SPEC_OTHERS,  # 經濟
        PROG_SPEC_OTHERS,  # 企業
        PROG_SPEC_OTHERS,  # 管理
        PROG_SPEC_OTHERS,  # 會計
        PROG_SPEC_EMPIRIAL_METHODE_PARAM,  # 統計
        PROG_SPEC_OTHERS,  # 金融
        PROG_SPEC_OTHERS,  # 行銷
        PROG_SPEC_OTHERS,  # 作業研究
        PROG_SPEC_EMPIRIAL_METHODE_PARAM,  # 觀察研究
        PROG_SPEC_EMPIRIAL_METHODE_PARAM,  # 資工
        PROG_SPEC_EMPIRIAL_METHODE_PARAM,  # 程式
        PROG_SPEC_EMPIRIAL_METHODE_PARAM,  # 資料科學
        PROG_SPEC_OTHERS,  # 論文
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

# Requirement: https://www.uni-mannheim.de/en/academics/programs/masters-program-in-business-informatics/#c36326
def MANNHEIM_BUSINESS_INFORMATICS(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'MANNHEIM_BUSINESS_INFORMATICS'
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
    PROG_SPEC_INFOMATICS_PARAM = {
        'Program_Category': 'Computer Science', 'Required_ECTS': 30}  # 8 Punkte
    #  Bachelorarbeit, eines Projekts, eines wissenschaftlichen Aufsatzes
    PROG_SPEC_VWL_BA_BI_PARAM = {
        'Program_Category': 'Economics/Business Administration or Business Informatics', 'Required_ECTS': 30}   # 30 Punkte
    # quantitativen Entscheidungsunterstützung mit Methoden des Operations Research
    PROG_SPEC_MATH_PARAM = {
        'Program_Category': 'Mathematics and Statistics', 'Required_ECTS': 18}              # 18 Punkte
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_INFOMATICS_PARAM,  # 基礎資工
        PROG_SPEC_VWL_BA_BI_PARAM,  # 經濟 管理 資料分析
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_MATH_PARAM,  # 微積分
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_VWL_BA_BI_PARAM,  # 經濟
        PROG_SPEC_VWL_BA_BI_PARAM,  # 企業
        PROG_SPEC_VWL_BA_BI_PARAM,  # 管理
        PROG_SPEC_VWL_BA_BI_PARAM,  # 會計
        PROG_SPEC_MATH_PARAM,  # 統計
        PROG_SPEC_OTHERS,  # 金融
        PROG_SPEC_OTHERS,  # 行銷
        PROG_SPEC_OTHERS,  # 作業研究
        PROG_SPEC_VWL_BA_BI_PARAM,  # 觀察研究
        PROG_SPEC_INFOMATICS_PARAM,  # 資工
        PROG_SPEC_INFOMATICS_PARAM,  # 程式
        PROG_SPEC_VWL_BA_BI_PARAM,  # 資料科學
        PROG_SPEC_OTHERS,  # 論文
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


program_sort_function = [MANNHEIM_DATA_SCIENCE, MANNHEIM_BUSINESS_INFORMATICS]


def DSBI_sorter(program_idx, file_path, abbrev):

    basic_classification_en = {
        '微積分': [DSBI_CALCULUS_KEY_WORDS_EN, DSBI_CALCULUS_ANTI_KEY_WORDS_EN],
        '數學': [DSBI_MATH_KEY_WORDS_EN, DSBI_MATH_ANTI_KEY_WORDS_EN],
        '經濟': [DSBI_ECONOMICS_KEY_WORDS_EN, DSBI_ECONOMICS_ANTI_KEY_WORDS_EN],
        '企業': [DSBI_BUSINESS_KEY_WORDS_EN, DSBI_BUSINESS_ANTI_KEY_WORDS_EN],
        '管理': [DSBI_MANAGEMENT_KEY_WORDS_EN, DSBI_MANAGEMENT_ANTI_KEY_WORDS_EN],
        '會計': [DSBI_ACCOUNTING_KEY_WORDS_EN, DSBI_ACCOUNTING_ANTI_KEY_WORDS_EN],
        '統計': [DSBI_STATISTICS_KEY_WORDS_EN, DSBI_STATISTICS_ANTI_KEY_WORDS_EN],
        '金融': [DSBI_FINANCE_KEY_WORDS_EN, DSBI_FINANCE_ANTI_KEY_WORDS_EN],
        '行銷': [DSBI_MARKETING_KEY_WORDS_EN, DSBI_MARKETING_ANTI_KEY_WORDS_EN],
        '作業研究': [DSBI_OP_RESEARCH_KEY_WORDS_EN, DSBI_OP_RESEARCH_ANTI_KEY_WORDS_EN],
        '觀察研究': [DSBI_EP_RESEARCH_KEY_WORDS_EN, DSBI_EP_RESEARCH_ANTI_KEY_WORDS_EN],
        '資工': [DSBI_BASIC_CS_KEY_WORDS_EN, DSBI_BASIC_CS_ANTI_KEY_WORDS_EN],
        '程式': [DSBI_PROGRAMMING_KEY_WORDS_EN, DSBI_PROGRAMMING_ANTI_KEY_WORDS_EN],
        '資料科學': [DSBI_DATA_SCIENCE_KEY_WORDS_EN, DSBI_DATA_SCIENCE_ANTI_KEY_WORDS_EN],
        '論文': [DSBI_BACHELOR_THESIS_KEY_WORDS_EN, DSBI_BACHELOR_THESIS_ANTI_KEY_WORDS_EN],
        '其他': [USELESS_COURSES_KEY_WORDS_EN, USELESS_COURSES_ANTI_KEY_WORDS_EN], }

    basic_classification_zh = {
        '微積分': [DSBI_CALCULUS_KEY_WORDS, DSBI_CALCULUS_ANTI_KEY_WORDS],
        '數學': [DSBI_MATH_KEY_WORDS, DSBI_MATH_ANTI_KEY_WORDS],
        '經濟': [DSBI_ECONOMICS_KEY_WORDS, DSBI_ECONOMICS_ANTI_KEY_WORDS],
        '企業': [DSBI_BUSINESS_KEY_WORDS, DSBI_BUSINESS_ANTI_KEY_WORDS],
        '管理': [DSBI_MANAGEMENT_KEY_WORDS, DSBI_MANAGEMENT_ANTI_KEY_WORDS],
        '會計': [DSBI_ACCOUNTING_KEY_WORDS, DSBI_ACCOUNTING_ANTI_KEY_WORDS],
        '統計': [DSBI_STATISTICS_KEY_WORDS, DSBI_STATISTICS_ANTI_KEY_WORDS],
        '金融': [DSBI_FINANCE_KEY_WORDS, DSBI_FINANCE_ANTI_KEY_WORDS],
        '行銷': [DSBI_MARKETING_KEY_WORDS, DSBI_MARKETING_ANTI_KEY_WORDS],
        '作業研究': [DSBI_OP_RESEARCH_KEY_WORDS, DSBI_OP_RESEARCH_ANTI_KEY_WORDS],
        '觀察研究': [DSBI_EP_RESEARCH_KEY_WORDS, DSBI_EP_RESEARCH_ANTI_KEY_WORDS],
        '資工': [DSBI_BASIC_CS_KEY_WORDS, DSBI_BASIC_CS_ANTI_KEY_WORDS],
        '程式': [DSBI_PROGRAMMING_KEY_WORDS, DSBI_PROGRAMMING_ANTI_KEY_WORDS],
        '資料科學': [DSBI_DATA_SCIENCE_KEY_WORDS, DSBI_DATA_SCIENCE_ANTI_KEY_WORDS],
        '論文': [DSBI_BACHELOR_THESIS_KEY_WORDS, DSBI_BACHELOR_THESIS_ANTI_KEY_WORDS],
        '其他': [USELESS_COURSES_KEY_WORDS, USELESS_COURSES_ANTI_KEY_WORDS], }

    Classifier(program_idx, file_path, abbrev, env_file_path,
               basic_classification_en, basic_classification_zh, column_len_array, program_sort_function)

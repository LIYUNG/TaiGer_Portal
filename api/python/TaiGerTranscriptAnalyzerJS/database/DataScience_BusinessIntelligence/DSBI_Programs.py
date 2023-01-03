import xlsxwriter
from CourseSuggestionAlgorithms import *
from util import *
from database.DataScience_BusinessIntelligence.DSBI_KEYWORDS import *
from cell_formatter import red_out_failed_subject, red_out_insufficient_credit
import pandas as pd
import sys

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


# Requirement: https://www.tum.de/fileadmin/user_upload_87/gi32rab/FPSO/Informations_Syst_Wirtschaftsinf_MA_LB_3._AES_7.9.21.pdf
def TUM_BI(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'TUM_BI'
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
    PROG_SPEC_BUSINESS_INFOMATICS_PARAM = {  # TODO: not classified correctly and the recommended courses
        'Program_Category': 'Business Informatics', 'Required_ECTS': 16}  # 30 Punkte
    #  Bachelorarbeit, eines Projekts, eines wissenschaftlichen Aufsatzes
    PROG_SPEC_INFORMATICS_PARAM = {
        'Program_Category': 'Fundamental CS', 'Required_ECTS': 36}   # 36 Punkte
    # quantitativen Entscheidungsunterstützung mit Methoden des Operations Research
    PROG_SPEC_WIRTSCHAFTSWISSENSCHAFTEN_PARAM = {
        'Program_Category': 'Business Science', 'Required_ECTS': 18}    # (Buchfuehrung und Rechnungswesen, Kostenrechnung, Investitions-und Finanzmanagement) 18 Punkte
    PROG_SPEC_MATH = {
        'Program_Category': 'Mathematics and Statistics', 'Required_ECTS': 30}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_BUSINESS_INFOMATICS_PARAM,  #
        PROG_SPEC_INFORMATICS_PARAM,  # 基礎資工 經濟 管理 資料分析
        PROG_SPEC_WIRTSCHAFTSWISSENSCHAFTEN_PARAM,  # 會計 財務 審計 投資學
        PROG_SPEC_MATH,  # 數學
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_MATH,  # 微積分
        PROG_SPEC_MATH,  # 數學
        PROG_SPEC_WIRTSCHAFTSWISSENSCHAFTEN_PARAM,  # 經濟
        PROG_SPEC_WIRTSCHAFTSWISSENSCHAFTEN_PARAM,  # 企業
        PROG_SPEC_WIRTSCHAFTSWISSENSCHAFTEN_PARAM,  # 管理
        PROG_SPEC_WIRTSCHAFTSWISSENSCHAFTEN_PARAM,  # 會計
        PROG_SPEC_MATH,  # 統計
        PROG_SPEC_WIRTSCHAFTSWISSENSCHAFTEN_PARAM,  # 金融
        PROG_SPEC_OTHERS,  # 行銷
        PROG_SPEC_BUSINESS_INFOMATICS_PARAM,  # 作業研究
        PROG_SPEC_BUSINESS_INFOMATICS_PARAM,  # 觀察研究
        PROG_SPEC_INFORMATICS_PARAM,  # 資工
        PROG_SPEC_INFORMATICS_PARAM,  # 程式
        PROG_SPEC_BUSINESS_INFOMATICS_PARAM,  # 資料科學
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

# https://uni-tuebingen.de/securedl/sdl-eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDk3MDk1NTAsImV4cCI6MTY0OTc5OTU0NywidXNlciI6MCwiZ3JvdXBzIjpbMCwtMV0sImZpbGUiOiJmaWxlYWRtaW5cL1VuaV9UdWViaW5nZW5cL0Zha3VsdGFldGVuXC9NYXROYXRcL1N0dWRpdW1fTWF1dGUtTWljaGllbHNcL1NQT1wvUE9fZW5nbGlzY2hlX1VlYmVyc2V0enVuZ2VuXC9QT19NYWNoaW5lX0xlYXJuaW5nX01TY19CVF8yMDIxLTEwX2VuZy1VUy5wZGYiLCJwYWdlIjoxNTY5MzN9.SWTzanCr4QbYxI-g9WsOP-IJulrkpYckV2UXyug04xs/PO_Machine_Learning_MSc_BT_2021-10_eng-US.pdf?fbclid=IwAR1Yk4wMEen4V-jtRWXkOBYyLvvESNPHpxqnQKAM-BxMqvKJO34DtWKdytY


def Tuebingen_ML(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'Tuebingen_ML'
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
    PROG_SPEC_BUSINESS_INFOMATICS_PARAM = {  # TODO: Find the requirements
        'Program_Category': 'Business Informatics', 'Required_ECTS': 16}  # 30 Punkte
    #  Bachelorarbeit, eines Projekts, eines wissenschaftlichen Aufsatzes
    PROG_SPEC_INFORMATICS_PARAM = {
        'Program_Category': 'Fundamental CS', 'Required_ECTS': 36}   # 36 Punkte
    # quantitativen Entscheidungsunterstützung mit Methoden des Operations Research
    PROG_SPEC_WIRTSCHAFTSWISSENSCHAFTEN_PARAM = {
        'Program_Category': 'Business Science', 'Required_ECTS': 18}    # (Buchfuehrung und Rechnungswesen, Kostenrechnung, Investitions-und Finanzmanagement) 18 Punkte
    PROG_SPEC_MATH = {
        'Program_Category': 'Mathematics and Statistics', 'Required_ECTS': 30}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_BUSINESS_INFOMATICS_PARAM,  #
        PROG_SPEC_INFORMATICS_PARAM,  # 基礎資工 經濟 管理 資料分析
        PROG_SPEC_WIRTSCHAFTSWISSENSCHAFTEN_PARAM,  # 會計 財務 審計 投資學
        PROG_SPEC_MATH,  # 數學
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_MATH,  # 微積分
        PROG_SPEC_MATH,  # 數學
        PROG_SPEC_WIRTSCHAFTSWISSENSCHAFTEN_PARAM,  # 經濟
        PROG_SPEC_WIRTSCHAFTSWISSENSCHAFTEN_PARAM,  # 企業
        PROG_SPEC_WIRTSCHAFTSWISSENSCHAFTEN_PARAM,  # 管理
        PROG_SPEC_WIRTSCHAFTSWISSENSCHAFTEN_PARAM,  # 會計
        PROG_SPEC_MATH,  # 統計
        PROG_SPEC_WIRTSCHAFTSWISSENSCHAFTEN_PARAM,  # 金融
        PROG_SPEC_OTHERS,  # 行銷
        PROG_SPEC_BUSINESS_INFOMATICS_PARAM,  # 作業研究
        PROG_SPEC_BUSINESS_INFOMATICS_PARAM,  # 觀察研究
        PROG_SPEC_INFORMATICS_PARAM,  # 資工
        PROG_SPEC_INFORMATICS_PARAM,  # 程式
        PROG_SPEC_BUSINESS_INFOMATICS_PARAM,  # 資料科學
        PROG_SPEC_OTHERS,  # 論文
        PROG_SPEC_OTHERS  # 其他
    ]

    # Development check
    if len(program_category_map) != len(df_transcript_array):
        print("program_category_map size: " + str(len(program_category_map)))
        print("df_transcript_array size:  " + str(len(df_transcript_array)))
        print("Please check the number of program_category_map again!")
        sys.exit()


program_sort_function = [MANNHEIM_DATA_SCIENCE,
                         MANNHEIM_BUSINESS_INFORMATICS, TUM_BI, Tuebingen_ML]

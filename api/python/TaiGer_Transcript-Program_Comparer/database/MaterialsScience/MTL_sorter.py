import xlsxwriter
from CourseSuggestionAlgorithms import *
from util import *
from database.MaterialsScience.MTL_KEYWORDS import *
from cell_formatter import red_out_failed_subject, red_out_insufficient_credit
import pandas as pd
import sys
import os
env_file_path = os.path.realpath(__file__)
env_file_path = os.path.dirname(env_file_path)

# Global variable:
column_len_array = []


def STUTTGART_MTL(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'STUTTGART_MTL'
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
    
    PROG_SPEC_MECHANIK_PARAM = {
        'Program_Category': 'Mechanik', 'Required_ECTS': 18}
    PROG_SPEC_THERMODYNAMIK_PARAM = {
        'Program_Category': 'Thermodynamik', 'Required_ECTS': 7}
    PROG_SPEC_WARMSTOFFUBERTRAGUNG_PARAM = {
        'Program_Category': 'Wärm_und_Stoffübertragung', 'Required_ECTS': 6}
    PROG_SPEC_WERKSTOFFKUNDE_PARAM = {
        'Program_Category': 'Werkstoffkunde', 'Required_ECTS': 8}
    PROG_SPEC_CONTROL_TECHNIQUE_PARAM = {
        'Program_Category': 'Regelungstechnik', 'Required_ECTS': 6}
    PROG_SPEC_STROEMUNGSMECHANIK_PARAM = {
        'Program_Category': 'Strömungsmechanik I', 'Required_ECTS': 6}
    PROG_SPEC_MATH_PARAM = {
        'Program_Category': 'Höhere Mathematik', 'Required_ECTS': 17}
    PROG_SPEC_FAHRZEUGTECHNIK_PARAM = {
        'Program_Category': 'Fahrzeugtechnik', 'Required_ECTS': 22}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_MECHANIK_PARAM,  # 力學
        PROG_SPEC_THERMODYNAMIK_PARAM,  # 熱力學
        PROG_SPEC_WARMSTOFFUBERTRAGUNG_PARAM,  # 熱 物質傳導
        PROG_SPEC_WERKSTOFFKUNDE_PARAM,  # 材料
        PROG_SPEC_CONTROL_TECHNIQUE_PARAM,  # 控制工程
        PROG_SPEC_STROEMUNGSMECHANIK_PARAM,  # 流體
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_FAHRZEUGTECHNIK_PARAM, # 汽車
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_MATH_PARAM,  # 微積分
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_OTHERS,  # 物理
        PROG_SPEC_OTHERS,  # 物理實驗
        PROG_SPEC_OTHERS,  # 化學
        PROG_SPEC_OTHERS,  # 化學實驗
        PROG_SPEC_WERKSTOFFKUNDE_PARAM,  # 材料
        PROG_SPEC_CONTROL_TECHNIQUE_PARAM,  # 控制
        PROG_SPEC_OTHERS,  # 力學
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

# http://www.icams.de/content/master-course-mss/application-and-admission/
def BOCHUM_MTL_SIM(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'BOCHUM_MTL_SIM'
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

    PROG_SPEC_MECHANIK_PARAM = {
        'Program_Category': 'Mechanik', 'Required_ECTS': 18}
    PROG_SPEC_THERMODYNAMIK_PARAM = {
        'Program_Category': 'Thermodynamik', 'Required_ECTS': 7}
    PROG_SPEC_WARMSTOFFUBERTRAGUNG_PARAM = {
        'Program_Category': 'Wärm_und_Stoffübertragung', 'Required_ECTS': 6}
    PROG_SPEC_WERKSTOFFKUNDE_PARAM = {
        'Program_Category': 'Werkstoffkunde', 'Required_ECTS': 8}
    PROG_SPEC_CONTROL_TECHNIQUE_PARAM = {
        'Program_Category': 'Regelungstechnik', 'Required_ECTS': 6}
    PROG_SPEC_MATH_PARAM = {
        'Program_Category': 'Höhere Mathematik', 'Required_ECTS': 17}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_MECHANIK_PARAM,  # 力學
        PROG_SPEC_THERMODYNAMIK_PARAM,  # 熱力學
        PROG_SPEC_WARMSTOFFUBERTRAGUNG_PARAM,  # 熱 物質傳導
        PROG_SPEC_WERKSTOFFKUNDE_PARAM,  # 材料
        PROG_SPEC_CONTROL_TECHNIQUE_PARAM,  # 控制工程
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_MATH_PARAM,  # 微積分
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_OTHERS,  # 物理
        PROG_SPEC_OTHERS,  # 物理實驗
        PROG_SPEC_OTHERS,  # 化學
        PROG_SPEC_OTHERS,  # 化學實驗
        PROG_SPEC_OTHERS,  # 材料
        PROG_SPEC_OTHERS,  # 控制
        PROG_SPEC_OTHERS,  # 力學
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


def FAU(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'FAU'
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

    PROG_SPEC_MECHANIK_PARAM = {
        'Program_Category': 'Mechanik', 'Required_ECTS': 18}
    PROG_SPEC_THERMODYNAMIK_PARAM = {
        'Program_Category': 'Thermodynamik', 'Required_ECTS': 7}
    PROG_SPEC_WARMSTOFFUBERTRAGUNG_PARAM = {
        'Program_Category': 'Wärm_und_Stoffübertragung', 'Required_ECTS': 6}
    PROG_SPEC_WERKSTOFFKUNDE_PARAM = {
        'Program_Category': 'Werkstoffkunde', 'Required_ECTS': 8}
    PROG_SPEC_CONTROL_TECHNIQUE_PARAM = {
        'Program_Category': 'Regelungstechnik', 'Required_ECTS': 6}
    PROG_SPEC_MATH_PARAM = {
        'Program_Category': 'Höhere Mathematik', 'Required_ECTS': 17}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_MECHANIK_PARAM,  # 力學
        PROG_SPEC_THERMODYNAMIK_PARAM,  # 熱力學
        PROG_SPEC_WARMSTOFFUBERTRAGUNG_PARAM,  # 熱 物質傳導
        PROG_SPEC_WERKSTOFFKUNDE_PARAM,  # 材料
        PROG_SPEC_CONTROL_TECHNIQUE_PARAM,  # 控制工程
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_MATH_PARAM,  # 微積分
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_OTHERS,  # 物理
        PROG_SPEC_OTHERS,  # 物理實驗
        PROG_SPEC_OTHERS,  # 化學
        PROG_SPEC_OTHERS,  # 化學實驗
        PROG_SPEC_OTHERS,  # 材料
        PROG_SPEC_OTHERS,  # 控制
        PROG_SPEC_OTHERS,  # 力學
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


program_sort_function = [STUTTGART_MTL, BOCHUM_MTL_SIM, FAU]


def MTL_sorter(program_idx, file_path, abbrev):

    basic_classification_en = {
        '微積分': [MTL_CALCULUS_KEY_WORDS_EN, MTL_CALCULUS_ANTI_KEY_WORDS_EN, ['一', '二']],
        '數學': [MTL_MATH_KEY_WORDS_EN, MTL_MATH_ANTI_KEY_WORDS_EN],
        '物理': [MTL_PHYSICS_KEY_WORDS_EN, MTL_PHYSICS_ANTI_KEY_WORDS_EN, ['一', '二']],
        '物理實驗': [MTL_PHYSICS_EXP_KEY_WORDS_EN, MTL_PHYSICS_EXP_ANTI_KEY_WORDS_EN, ['一', '二']],
        '化學': [MTL_CHEMISTRY_KEY_WORDS_EN, MTL_CHEMISTRY_ANTI_KEY_WORDS_EN, ['一', '二']],
        '化學實驗': [MTL_CHEMISTRY_EXP_KEY_WORDS_EN, MTL_CHEMISTRY_EXP_ANTI_KEY_WORDS_EN, ['一', '二']],
        '材料': [MTL_WERKSTOFFKUNDE_KEY_WORDS_EN, MTL_WERKSTOFFKUNDE_ANTI_KEY_WORDS_EN, ['一', '二']],
        '控制': [MTL_CONTROL_THEORY_KEY_WORDS_EN, MTL_CONTROL_THEORY_ANTI_KEY_WORDS_EN, ['一', '二']],
        '力學': [MTL_MECHANIK_KEY_WORDS_EN, MTL_MECHANIK_ANTI_KEY_WORDS_EN, ['一', '二']],
        '其他': [USELESS_COURSES_KEY_WORDS_EN, USELESS_COURSES_ANTI_KEY_WORDS_EN], }

    basic_classification_zh = {
        '微積分': [MTL_CALCULUS_KEY_WORDS, MTL_CALCULUS_ANTI_KEY_WORDS, ['一', '二']],
        '數學': [MTL_MATH_KEY_WORDS, MTL_MATH_ANTI_KEY_WORDS],
        '物理': [MTL_PHYSICS_KEY_WORDS, MTL_PHYSICS_ANTI_KEY_WORDS, ['一', '二']],
        '物理實驗': [MTL_PHYSICS_EXP_KEY_WORDS, MTL_PHYSICS_EXP_ANTI_KEY_WORDS, ['一', '二']],
        '化學': [MTL_CHEMISTRY_KEY_WORDS, MTL_CHEMISTRY_ANTI_KEY_WORDS, ['一', '二']],
        '化學實驗': [MTL_CHEMISTRY_EXP_KEY_WORDS, MTL_CHEMISTRY_EXP_ANTI_KEY_WORDS, ['一', '二']],
        '材料': [MTL_WERKSTOFFKUNDE_KEY_WORDS, MTL_WERKSTOFFKUNDE_ANTI_KEY_WORDS, ['一', '二']],
        '控制': [MTL_CONTROL_THEORY_KEY_WORDS, MTL_CONTROL_THEORY_ANTI_KEY_WORDS, ['一', '二']],
        '力學': [MTL_MECHANIK_KEY_WORDS, MTL_MECHANIK_ANTI_KEY_WORDS, ['一', '二']],
        '其他': [USELESS_COURSES_KEY_WORDS, USELESS_COURSES_ANTI_KEY_WORDS], }

    Classifier(program_idx, file_path, abbrev, env_file_path,
               basic_classification_en, basic_classification_zh, column_len_array, program_sort_function)

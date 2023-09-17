import xlsxwriter
from CourseSuggestionAlgorithms import *
from util import *
from cell_formatter import red_out_failed_subject, red_out_insufficient_credit
import pandas as pd
import sys

# Global variable:
column_len_array = []


def TUM_MTL(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'TUM_MTL'
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
        'Program_Category': 'Mechanik I,II,III', 'Required_ECTS': 18}
    PROG_SPEC_THERMODYNAMIK_PARAM = {
        'Program_Category': 'Thermodynamik I, II', 'Required_ECTS': 10}
    PROG_SPEC_FLUIDDYNAMIK_PARAM = {
        'Program_Category': 'Fluiddynamik I, II', 'Required_ECTS': 10}
    PROG_SPEC_WERKSTOFFKUNDE_PARAM = {
        'Program_Category': 'Materials Science', 'Required_ECTS': 10}
    PROG_SPEC_WARMSTOFFUBERTRAGUNG_PARAM = {
        'Program_Category': 'Heat Transfer', 'Required_ECTS': 9}
    PROG_SPEC_SCHALTUNGSTECHNIK_PARAM = {
        'Program_Category': 'Electrical Circuit', 'Required_ECTS': 12}
    PROG_SPEC_PHYSIK_PARAM = {
        'Program_Category': 'Physics', 'Required_ECTS': 9}
    PROG_SPEC_CHEMISTRY_PARAM = {
        'Program_Category': 'Chemistry', 'Required_ECTS': 7}
    PROG_SPEC_CONTROL_TECHNIQUE_PARAM = {
        'Program_Category': 'Regelungstechnik', 'Required_ECTS': 6}
    PROG_SPEC_NUMERICAL_PARAM = {
        'Program_Category': 'Numerical method', 'Required_ECTS': 5}
    PROG_SPEC_MATH_PARAM = {
        'Program_Category': 'Höhere Mathematik', 'Required_ECTS': 16}
    PROG_SPEC_LINEAR_ALG_PARAM = {
        'Program_Category': 'Linear Algebra', 'Required_ECTS': 16}
    PROG_SPEC_CALCULUS_PARAM = {
        'Program_Category': 'Calculus', 'Required_ECTS': 20}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_MECHANIK_PARAM,               # 力學
        PROG_SPEC_THERMODYNAMIK_PARAM,          # 熱力學
        PROG_SPEC_FLUIDDYNAMIK_PARAM,           # 流體熱學
        PROG_SPEC_WERKSTOFFKUNDE_PARAM,         # 材料
        PROG_SPEC_WARMSTOFFUBERTRAGUNG_PARAM,   # 熱 物質傳導
        PROG_SPEC_SCHALTUNGSTECHNIK_PARAM,      # 電路學
        PROG_SPEC_PHYSIK_PARAM,                 # 物理
        PROG_SPEC_CHEMISTRY_PARAM,              # 化學
        PROG_SPEC_CONTROL_TECHNIQUE_PARAM,      # 控制工程
        PROG_SPEC_NUMERICAL_PARAM,              # 數值分析
        PROG_SPEC_MATH_PARAM,                   # 數學
        PROG_SPEC_LINEAR_ALG_PARAM,             # 線性代數
        PROG_SPEC_CALCULUS_PARAM,               # 微積分
        PROG_SPEC_OTHERS                        # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_MATH_PARAM,  # 離散
        PROG_SPEC_LINEAR_ALG_PARAM,  # 線性代數
        PROG_SPEC_NUMERICAL_PARAM,  # 數值分析
        PROG_SPEC_CALCULUS_PARAM,  # 微積分
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_PHYSIK_PARAM,  # 物理
        PROG_SPEC_PHYSIK_PARAM,  # 物理實驗
        PROG_SPEC_CHEMISTRY_PARAM,  # 化學
        PROG_SPEC_CHEMISTRY_PARAM,  # 化學實驗
        PROG_SPEC_OTHERS,  # 無機化學
        PROG_SPEC_OTHERS,  # 物理化學
        PROG_SPEC_WERKSTOFFKUNDE_PARAM,  # 材料
        PROG_SPEC_CONTROL_TECHNIQUE_PARAM,  # 控制
        PROG_SPEC_MECHANIK_PARAM,  # 力學
        PROG_SPEC_THERMODYNAMIK_PARAM,  # 熱力學
        PROG_SPEC_FLUIDDYNAMIK_PARAM,  # 流體力學
        PROG_SPEC_OTHERS,  # 電子學
        PROG_SPEC_SCHALTUNGSTECHNIK_PARAM,  # 電路學
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


def RWTH_MTL_ENGINEERING(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'RWTH_MTL_ENGINEERING'
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
    PROG_SPEC_MATH_PHY_ANORGCHEMIE_PHYCHEMIE_PARAM = {
        'Program_Category': 'Math, Physics, Anorg. Chemistry, Phy. Chemistry', 'Required_ECTS': 30}
    PROG_SPEC_NATRUAL_SCIENCE_ENGINEERING_PARAM = {
        'Program_Category': 'Natural Science, Engineering', 'Required_ECTS': 17}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_MATH_PHY_ANORGCHEMIE_PHYCHEMIE_PARAM,  # 數學 物理 無機化學 物理化學 
        PROG_SPEC_MECHANIK_PARAM,  # 力學 機構 電機
        PROG_SPEC_NATRUAL_SCIENCE_ENGINEERING_PARAM,  # 自然科學 工程科學
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_MATH_PHY_ANORGCHEMIE_PHYCHEMIE_PARAM,  # 離散
        PROG_SPEC_MATH_PHY_ANORGCHEMIE_PHYCHEMIE_PARAM,  # 線性代數
        PROG_SPEC_MATH_PHY_ANORGCHEMIE_PHYCHEMIE_PARAM,  # 數值分析
        PROG_SPEC_MATH_PHY_ANORGCHEMIE_PHYCHEMIE_PARAM,  # 微積分
        PROG_SPEC_MATH_PHY_ANORGCHEMIE_PHYCHEMIE_PARAM,  # 數學
        PROG_SPEC_MATH_PHY_ANORGCHEMIE_PHYCHEMIE_PARAM,  # 物理
        PROG_SPEC_MATH_PHY_ANORGCHEMIE_PHYCHEMIE_PARAM,  # 物理實驗
        PROG_SPEC_MATH_PHY_ANORGCHEMIE_PHYCHEMIE_PARAM,  # 化學
        PROG_SPEC_MATH_PHY_ANORGCHEMIE_PHYCHEMIE_PARAM,  # 化學實驗
        PROG_SPEC_MATH_PHY_ANORGCHEMIE_PHYCHEMIE_PARAM,  # 無機化學
        PROG_SPEC_MATH_PHY_ANORGCHEMIE_PHYCHEMIE_PARAM,  # 物理化學
        PROG_SPEC_NATRUAL_SCIENCE_ENGINEERING_PARAM,  # 材料
        PROG_SPEC_NATRUAL_SCIENCE_ENGINEERING_PARAM,  # 控制
        PROG_SPEC_MECHANIK_PARAM,  # 力學
        PROG_SPEC_MECHANIK_PARAM,  # 熱力學
        PROG_SPEC_MECHANIK_PARAM,  # 流體力學
        PROG_SPEC_NATRUAL_SCIENCE_ENGINEERING_PARAM,  # 電子學
        PROG_SPEC_NATRUAL_SCIENCE_ENGINEERING_PARAM,  # 電路學
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
    PROG_SPEC_PHYSIK_PARAM = {
    'Program_Category': 'Physics', 'Required_ECTS': 12}
    PROG_SPEC_CHEMIE_PARAM = {
        'Program_Category': 'Chemistry', 'Required_ECTS': 12}
    PROG_SPEC_PHY_CHEMIE_PARAM = {
        'Program_Category': 'Physical Chemistry', 'Required_ECTS': 9}
    PROG_SPEC_THERMODYNAMIK_PARAM = {
        'Program_Category': 'Thermodynamics', 'Required_ECTS': 6}
    PROG_SPEC_WERKSTOFFKUNDE_PARAM = {
        'Program_Category': 'Werkstoffkunde', 'Required_ECTS': 30}
    PROG_SPEC_MATH_PARAM = {
        'Program_Category': 'Mathematik', 'Required_ECTS': 27}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_PHYSIK_PARAM,          # 物理
        PROG_SPEC_CHEMIE_PARAM,          # 化學
        PROG_SPEC_PHY_CHEMIE_PARAM,      # 物理化學
        PROG_SPEC_THERMODYNAMIK_PARAM,   # 熱力學
        PROG_SPEC_WERKSTOFFKUNDE_PARAM,  # 材料
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_MATH_PARAM,  # 離散
        PROG_SPEC_MATH_PARAM,  # 線性代數
        PROG_SPEC_MATH_PARAM,  # 數值分析
        PROG_SPEC_MATH_PARAM,  # 微積分
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_PHYSIK_PARAM,  # 物理
        PROG_SPEC_PHYSIK_PARAM,  # 物理實驗
        PROG_SPEC_CHEMIE_PARAM,  # 化學
        PROG_SPEC_CHEMIE_PARAM,  # 化學實驗
        PROG_SPEC_OTHERS,  # 無機化學
        PROG_SPEC_PHY_CHEMIE_PARAM,  # 物理化學
        PROG_SPEC_WERKSTOFFKUNDE_PARAM,  # 材料
        PROG_SPEC_OTHERS,  # 控制
        PROG_SPEC_OTHERS,  # 力學
        PROG_SPEC_THERMODYNAMIK_PARAM,  # 熱力學
        PROG_SPEC_OTHERS,  # 流體力學
        PROG_SPEC_OTHERS,  # 電子學
        PROG_SPEC_OTHERS,  # 電路學
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
        PROG_SPEC_MATH_PARAM,  # 離散
        PROG_SPEC_MATH_PARAM,  # 線性代數
        PROG_SPEC_MATH_PARAM,  # 數值分析
        PROG_SPEC_MATH_PARAM,  # 微積分
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_OTHERS,  # 物理
        PROG_SPEC_OTHERS,  # 物理實驗
        PROG_SPEC_OTHERS,  # 化學
        PROG_SPEC_OTHERS,  # 化學實驗
        PROG_SPEC_OTHERS,  # 無機化學
        PROG_SPEC_OTHERS,  # 物理化學
        PROG_SPEC_WERKSTOFFKUNDE_PARAM,  # 材料
        PROG_SPEC_OTHERS,  # 控制
        PROG_SPEC_MECHANIK_PARAM,  # 力學
        PROG_SPEC_THERMODYNAMIK_PARAM,  # 熱力學
        PROG_SPEC_OTHERS,  # 流體力學
        PROG_SPEC_OTHERS,  # 電子學
        PROG_SPEC_OTHERS,  # 電路學
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
        PROG_SPEC_MATH_PARAM,  # 離散
        PROG_SPEC_MATH_PARAM,  # 線性代數
        PROG_SPEC_MATH_PARAM,  # 數值分析
        PROG_SPEC_MATH_PARAM,  # 微積分
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_OTHERS,  # 物理
        PROG_SPEC_OTHERS,  # 物理實驗
        PROG_SPEC_OTHERS,  # 化學
        PROG_SPEC_OTHERS,  # 化學實驗
        PROG_SPEC_OTHERS,  # 無機化學
        PROG_SPEC_OTHERS,  # 物理化學
        PROG_SPEC_WERKSTOFFKUNDE_PARAM,  # 材料
        PROG_SPEC_OTHERS,  # 控制
        PROG_SPEC_MECHANIK_PARAM,  # 力學
        PROG_SPEC_THERMODYNAMIK_PARAM,  # 熱力學
        PROG_SPEC_OTHERS,  # 流體力學
        PROG_SPEC_OTHERS,  # 電子學
        PROG_SPEC_OTHERS,  # 電路學
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


program_sort_function = [TUM_MTL, RWTH_MTL_ENGINEERING, STUTTGART_MTL, BOCHUM_MTL_SIM, FAU]

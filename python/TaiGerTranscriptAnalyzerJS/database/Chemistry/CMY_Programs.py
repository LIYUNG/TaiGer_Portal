import xlsxwriter
from CourseSuggestionAlgorithms import *
from util import *
from cell_formatter import red_out_failed_subject, red_out_insufficient_credit
import pandas as pd
import sys

# Global variable:
column_len_array = []


def TUM_BIOCHEMISTRY(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'TUM_BIOCHEMISTRY'
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

    PROG_SPEC_CHEMISTRY_PARAM = {
        'Program_Category': 'Chemistry', 'Required_ECTS': 48}
    PROG_SPEC_MATH_PHYSICS_STATISTICSPARAM = {
        'Program_Category': 'Math, Physics, Statistics', 'Required_ECTS': 12}
    PROG_SPEC_BIOCHEMISTRY_PARAM = {
        'Program_Category': 'Biochemistry', 'Required_ECTS': 50}
    PROG_SPEC_MOLECULAR_BIOLOGY_PARAM = {
        'Program_Category': 'General molecular Biology', 'Required_ECTS': 30}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_CHEMISTRY_PARAM,
        PROG_SPEC_MATH_PHYSICS_STATISTICSPARAM,
        PROG_SPEC_BIOCHEMISTRY_PARAM,
        PROG_SPEC_MOLECULAR_BIOLOGY_PARAM,
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_MATH_PHYSICS_STATISTICSPARAM,  # 微積分
        PROG_SPEC_MATH_PHYSICS_STATISTICSPARAM,  # 線性代數
        PROG_SPEC_MATH_PHYSICS_STATISTICSPARAM,  # 離散
        PROG_SPEC_MATH_PHYSICS_STATISTICSPARAM,  # 數值分析
        PROG_SPEC_MATH_PHYSICS_STATISTICSPARAM,  # 機率與統計
        PROG_SPEC_MATH_PHYSICS_STATISTICSPARAM,  # 數學
        PROG_SPEC_OTHERS,  # 基礎資工
        PROG_SPEC_MATH_PHYSICS_STATISTICSPARAM,  # 普通物理
        PROG_SPEC_MATH_PHYSICS_STATISTICSPARAM,  # 物理實驗
        PROG_SPEC_OTHERS,  # 力學
        PROG_SPEC_CHEMISTRY_PARAM,  # 普通化學
        PROG_SPEC_CHEMISTRY_PARAM,  # 有機化學
        PROG_SPEC_OTHERS,  # 進階化學
        PROG_SPEC_CHEMISTRY_PARAM,  # 無機化學
        PROG_SPEC_BIOCHEMISTRY_PARAM,  # 生物化學一
        PROG_SPEC_BIOCHEMISTRY_PARAM,  # 生物化學二
        PROG_SPEC_CHEMISTRY_PARAM,  # 生物物理化學
        PROG_SPEC_CHEMISTRY_PARAM,  # 物理化學
        PROG_SPEC_CHEMISTRY_PARAM,  # 光譜學
        PROG_SPEC_MOLECULAR_BIOLOGY_PARAM,  # 生物學
        PROG_SPEC_MOLECULAR_BIOLOGY_PARAM,  # 基因遺傳學
        PROG_SPEC_MOLECULAR_BIOLOGY_PARAM,  # 分子生物學
        PROG_SPEC_OTHERS,  # 生物工程
        PROG_SPEC_OTHERS,  # 化學工程
        PROG_SPEC_CHEMISTRY_PARAM,  # 熱力學
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


def TUM_CHEMICAL_BIOTECHNOLOGY(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'TUM_CHEMICAL_BIOTECHNOLOGY'
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

    PROG_SPEC_MATH_PHYSICS_STATISTICS_PROGRAMMINGPARAM = {
        'Program_Category': 'Math, Physics, Statistics, Programming', 'Required_ECTS': 20}
    PROG_SPEC_CHEMISTRY_PARAM = {
        'Program_Category': 'Chemistry', 'Required_ECTS': 38}
    PROG_SPEC_MOLECULAR_BIOLOGY_PARAM = {
        'Program_Category': 'General molecular Biology', 'Required_ECTS': 38}
    PROG_SPEC_PROCESSING_ENGINEERING_PARAM = {
        'Program_Category': 'Processing Engineering', 'Required_ECTS': 33}

    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_MATH_PHYSICS_STATISTICS_PROGRAMMINGPARAM,
        PROG_SPEC_CHEMISTRY_PARAM,
        PROG_SPEC_MOLECULAR_BIOLOGY_PARAM,
        PROG_SPEC_PROCESSING_ENGINEERING_PARAM,
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_MATH_PHYSICS_STATISTICS_PROGRAMMINGPARAM,  # 微積分
        PROG_SPEC_MATH_PHYSICS_STATISTICS_PROGRAMMINGPARAM,  # 線性代數
        PROG_SPEC_MATH_PHYSICS_STATISTICS_PROGRAMMINGPARAM,  # 離散
        PROG_SPEC_MATH_PHYSICS_STATISTICS_PROGRAMMINGPARAM,  # 數值分析
        PROG_SPEC_MATH_PHYSICS_STATISTICS_PROGRAMMINGPARAM,  # 機率與統計
        PROG_SPEC_MATH_PHYSICS_STATISTICS_PROGRAMMINGPARAM,  # 數學
        PROG_SPEC_MATH_PHYSICS_STATISTICS_PROGRAMMINGPARAM,  # 基礎資工
        PROG_SPEC_MATH_PHYSICS_STATISTICS_PROGRAMMINGPARAM,  # 普通物理
        PROG_SPEC_MATH_PHYSICS_STATISTICS_PROGRAMMINGPARAM,  # 物理實驗
        PROG_SPEC_OTHERS,  # 力學
        PROG_SPEC_CHEMISTRY_PARAM,  # 普通化學
        PROG_SPEC_CHEMISTRY_PARAM,  # 有機化學
        PROG_SPEC_OTHERS,  # 進階化學
        PROG_SPEC_CHEMISTRY_PARAM,  # 無機化學
        PROG_SPEC_MOLECULAR_BIOLOGY_PARAM,  # 生物化學一
        PROG_SPEC_OTHERS,  # 生物化學二
        PROG_SPEC_CHEMISTRY_PARAM,  # 生物物理化學
        PROG_SPEC_CHEMISTRY_PARAM,  # 物理化學
        PROG_SPEC_CHEMISTRY_PARAM,  # 光譜學
        PROG_SPEC_OTHERS,  # 生物學
        PROG_SPEC_MOLECULAR_BIOLOGY_PARAM,  # 基因遺傳學
        PROG_SPEC_MOLECULAR_BIOLOGY_PARAM,  # 分子生物學
        PROG_SPEC_MOLECULAR_BIOLOGY_PARAM,  # 生物工程
        PROG_SPEC_PROCESSING_ENGINEERING_PARAM,  # 化學工程
        PROG_SPEC_PROCESSING_ENGINEERING_PARAM,  # 熱力學
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


program_sort_function = [TUM_BIOCHEMISTRY, TUM_CHEMICAL_BIOTECHNOLOGY]

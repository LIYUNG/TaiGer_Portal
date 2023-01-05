import xlsxwriter
from CourseSuggestionAlgorithms import *
from util import *
from database.BiomedicalEngineering.BOE_KEYWORDS import *
from cell_formatter import red_out_failed_subject, red_out_insufficient_credit
import pandas as pd
import sys

# Global variable:
column_len_array = []

def RWTH_BIO_ENGINEERING(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'RWTH_BIO_ENGINEERING'
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
        'Program_Category': 'Mathematics', 'Required_ECTS': 20}
    PROG_SPEC_CHEMISTRY_PARAM = {
        'Program_Category': 'Chemistry', 'Required_ECTS': 20}
    PROG_SPEC_BIOLOGY_PARAM = {
        'Program_Category': 'Biology', 'Required_ECTS': 20}
    PROG_SPEC_ENGINEERING_PHYSICS_PARAM = {
        'Program_Category': 'Engineering Technology and Physics', 'Required_ECTS': 20}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_CHEMISTRY_PARAM, # 化學
        PROG_SPEC_BIOLOGY_PARAM,  # 生物
        PROG_SPEC_ENGINEERING_PHYSICS_PARAM,  # 工程 物理
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_MATH_PARAM,  # 線性代數
        PROG_SPEC_MATH_PARAM,  # 數值分析
        PROG_SPEC_MATH_PARAM,  # 微積分
        PROG_SPEC_CHEMISTRY_PARAM,  # 普通化學
        PROG_SPEC_CHEMISTRY_PARAM,  # 有機化學
        PROG_SPEC_OTHERS,  # 計算機概論
        PROG_SPEC_ENGINEERING_PHYSICS_PARAM,  # 普通物理
        PROG_SPEC_ENGINEERING_PHYSICS_PARAM,  # 材料科學
        PROG_SPEC_ENGINEERING_PHYSICS_PARAM,  # 通訊與信號處理
        PROG_SPEC_ENGINEERING_PHYSICS_PARAM,  # 機械
        PROG_SPEC_BIOLOGY_PARAM,  # 生物學
        PROG_SPEC_OTHERS,  # 生醫
        PROG_SPEC_ENGINEERING_PHYSICS_PARAM,  # 機率與統計
        PROG_SPEC_CHEMISTRY_PARAM,  # 進階化學
        PROG_SPEC_CHEMISTRY_PARAM,  # 無機化學
        PROG_SPEC_ENGINEERING_PHYSICS_PARAM,  # 進階物理
        PROG_SPEC_ENGINEERING_PHYSICS_PARAM,  # 量子物理
        PROG_SPEC_OTHERS,  # 天文物理
        PROG_SPEC_CHEMISTRY_PARAM,  # 生物化學
        PROG_SPEC_CHEMISTRY_PARAM,  # 物理化學
        PROG_SPEC_ENGINEERING_PHYSICS_PARAM,  # 電磁
        PROG_SPEC_ENGINEERING_PHYSICS_PARAM,  # 熱力學
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


def TUM_BIO_ENGINEERING(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'TUM_BIO_ENGINEERING'
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

    PROG_SPEC_INTRO_EXP_PHYSIK_PARAM = {
        'Program_Category': 'Grundlagen der Experimentalphysik', 'Required_ECTS': 10}
    PROG_SPEC_ADV_EXP_PHYSIK_PARAM = {
        'Program_Category': 'Fortgeschrittene Experimentalphysik', 'Required_ECTS': 10}
    PROG_SPEC_THEORETISCH_PHYSIK_PARAM = {
        'Program_Category': 'Grundlagen der Theoretischen Physik', 'Required_ECTS': 10}
    PROG_SPEC_MATH_PARAM = {
        'Program_Category': 'Grundkurs Mathematik', 'Required_ECTS': 10}
    PROG_SPEC_CHEMIE_BIOLOGY_PARAM = {
        'Program_Category': 'Grundkurs Chemie und Grundkurs Biologie', 'Required_ECTS': 10}
    PROG_SPEC_LABOR_PRAKTIKA_PARAM = {
        'Program_Category': 'Absolvierte (Labor-)Praktika', 'Required_ECTS': 10}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_INTRO_EXP_PHYSIK_PARAM,  # 基礎實驗物理
        PROG_SPEC_ADV_EXP_PHYSIK_PARAM,  # 進階實驗物理
        PROG_SPEC_THEORETISCH_PHYSIK_PARAM,  # 理論物理
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_CHEMIE_BIOLOGY_PARAM,  # 化學 生物
        PROG_SPEC_LABOR_PRAKTIKA_PARAM,  # 實驗
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_MATH_PARAM,  # 線性代數
        PROG_SPEC_MATH_PARAM,  # 數值分析
        PROG_SPEC_MATH_PARAM,  # 微積分
        PROG_SPEC_CHEMIE_BIOLOGY_PARAM,  # 普通化學
        PROG_SPEC_CHEMIE_BIOLOGY_PARAM,  # 有機化學
        PROG_SPEC_OTHERS,  # 計算機概論
        PROG_SPEC_INTRO_EXP_PHYSIK_PARAM,  # 普通物理
        PROG_SPEC_OTHERS,  # 材料科學
        PROG_SPEC_OTHERS,  # 通訊與信號處理
        PROG_SPEC_THEORETISCH_PHYSIK_PARAM,  # 機械
        PROG_SPEC_CHEMIE_BIOLOGY_PARAM,  # 生物學
        PROG_SPEC_OTHERS,  # 生醫
        PROG_SPEC_THEORETISCH_PHYSIK_PARAM,  # 機率與統計
        PROG_SPEC_OTHERS,  # 進階化學
        PROG_SPEC_CHEMIE_BIOLOGY_PARAM,  # 無機化學
        PROG_SPEC_INTRO_EXP_PHYSIK_PARAM,  # 進階物理
        PROG_SPEC_THEORETISCH_PHYSIK_PARAM,  # 量子物理
        PROG_SPEC_ADV_EXP_PHYSIK_PARAM,  # 天文物理
        PROG_SPEC_CHEMIE_BIOLOGY_PARAM,  # 生物化學
        PROG_SPEC_CHEMIE_BIOLOGY_PARAM,  # 物理化學
        PROG_SPEC_THEORETISCH_PHYSIK_PARAM,  # 電磁
        PROG_SPEC_INTRO_EXP_PHYSIK_PARAM,  # 熱力學
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


def TUM_NEURO_SCIENCE(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'TUM_NEURO_SCIENCE'
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
        'Program_Category': 'Mathematik', 'Required_ECTS': 10}
    PROG_SPEC_PHYSIK_PARAM = {
        'Program_Category': 'Physik', 'Required_ECTS': 10}
    PROG_SPEC_STATISTIK_PARAM = {
        'Program_Category': 'Statistik', 'Required_ECTS': 10}
    PROG_SPEC_INORG_CHEMISTRY_PARAM = {
        'Program_Category': 'Anorganische Chemie', 'Required_ECTS': 10}
    PROG_SPEC_PHY_CHEMISTRY_PARAM = {
        'Program_Category': 'Physikalische Chemie', 'Required_ECTS': 10}
    PROG_SPEC_ORG_CHEMISTRY_PARAM = {
        'Program_Category': 'Organische Chemie', 'Required_ECTS': 10}
    PROG_SPEC_BIO_CHEMISTRY_PARAM = {
        'Program_Category': 'Biochemie', 'Required_ECTS': 10}
    PROG_SPEC_MOLECULAR_PHYSIOLOGIE_IMMUNOLOGIE_PARAM = {
        'Program_Category': 'Molekularbiologie, Physiologie, Immunologie', 'Required_ECTS': 10}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_PHYSIK_PARAM,  # 物理
        PROG_SPEC_STATISTIK_PARAM,  # 統計
        PROG_SPEC_INORG_CHEMISTRY_PARAM,  # 無機化學
        PROG_SPEC_PHY_CHEMISTRY_PARAM,  # 物理化學
        PROG_SPEC_ORG_CHEMISTRY_PARAM,  # 有機化學
        PROG_SPEC_BIO_CHEMISTRY_PARAM,  # 生物化學
        PROG_SPEC_MOLECULAR_PHYSIOLOGIE_IMMUNOLOGIE_PARAM,  # 分子生物 生理學 免疫學
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_MATH_PARAM,  # 線性代數
        PROG_SPEC_MATH_PARAM,  # 數值分析
        PROG_SPEC_MATH_PARAM,  # 微積分
        PROG_SPEC_OTHERS,  # 普通化學
        PROG_SPEC_ORG_CHEMISTRY_PARAM,  # 有機化學
        PROG_SPEC_OTHERS,  # 計算機概論
        PROG_SPEC_PHYSIK_PARAM,  # 普通物理
        PROG_SPEC_OTHERS,  # 材料科學
        PROG_SPEC_OTHERS,  # 通訊與信號處理
        PROG_SPEC_OTHERS,  # 機械
        PROG_SPEC_MOLECULAR_PHYSIOLOGIE_IMMUNOLOGIE_PARAM,  # 生物學
        PROG_SPEC_OTHERS,  # 生醫
        PROG_SPEC_STATISTIK_PARAM,  # 機率與統計
        PROG_SPEC_OTHERS,  # 進階化學
        PROG_SPEC_INORG_CHEMISTRY_PARAM,  # 無機化學
        PROG_SPEC_PHYSIK_PARAM,  # 進階物理
        PROG_SPEC_OTHERS,  # 量子物理
        PROG_SPEC_OTHERS,  # 天文物理
        PROG_SPEC_BIO_CHEMISTRY_PARAM,  # 生物化學
        PROG_SPEC_PHY_CHEMISTRY_PARAM,  # 物理化學
        PROG_SPEC_OTHERS,  # 電磁
        PROG_SPEC_PHY_CHEMISTRY_PARAM,  # 熱力學
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


program_sort_function = [RWTH_BIO_ENGINEERING,
                         TUM_BIO_ENGINEERING, TUM_NEURO_SCIENCE]

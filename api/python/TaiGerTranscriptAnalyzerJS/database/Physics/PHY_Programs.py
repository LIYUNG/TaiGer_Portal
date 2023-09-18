import xlsxwriter
from CourseSuggestionAlgorithms import *
from util import *
from cell_formatter import red_out_failed_subject, red_out_insufficient_credit
import pandas as pd
import sys

# Global variable:
column_len_array = []


def TUM_LMU_QUANTUM_SCIENCE_TECH(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'TUM_QUANTUM_SCIENCE_TECH'
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

    PROG_SPEC_EXPERIMENT_PHYSICS_METHODE_PARAM = {
        'Program_Category': 'Experimental Physics', 'Required_ECTS': 20}
    PROG_SPEC_LINEAR_ALGEBRA_METHODE_PARAM = {
        'Program_Category': 'Linear Algebra', 'Required_ECTS': 10}
    PROG_SPEC_CALCULUS_METHODE_PARAM = {
        'Program_Category': 'Calculus and Analysis', 'Required_ECTS': 30}
    PROG_SPEC_THEORETICAL_PHYSICS_MECHANICS_METHODE_PARAM = {
        'Program_Category': 'Mechanics', 'Required_ECTS': 10}
    PROG_SPEC_THEORETICAL_PHYSICS_ELECTRODYNAMICS_METHODE_PARAM = {
        'Program_Category': 'Electrodynamics', 'Required_ECTS': 10}
    PROG_SPEC_THEORETICAL_PHYSICS_THERMODYNAMICS_METHODE_PARAM = {
        'Program_Category': 'Thermodynamics and Statistics', 'Required_ECTS': 10}
    PROG_SPEC_MATH_NUMERICAL_METHODE_METHODE_PARAM = {
        'Program_Category': 'Numerical Methode', 'Required_ECTS': 10}
    PROG_SPEC_MATH_DISCRETE_MATH_METHODE_PARAM = {
        'Program_Category': 'Discrete Mathematics', 'Required_ECTS': 10}
    PROG_SPEC_KONDENSE_PHYSICS_METHODE_PARAM = {
        'Program_Category': 'Condensed matter physics', 'Required_ECTS': 10}
    PROG_SPEC_NUCLEAR_PHYSICS_METHODE_PARAM = {
        'Program_Category': 'Nuclear physics', 'Required_ECTS': 10}
    PROG_SPEC_ATOM_PHYSICS_METHODE_PARAM = {
        'Program_Category': 'Atomic physics', 'Required_ECTS': 10}
    PROG_SPEC_ORGANIC_CHEMISTRY_METHODE_PARAM = {
        'Program_Category': 'Organic chemistry', 'Required_ECTS': 10}
    PROG_SPEC_INORGANIC_CHEMISTRY_METHODE_PARAM = {
        'Program_Category': 'Inorganic chemistry', 'Required_ECTS': 10}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_EXPERIMENT_PHYSICS_METHODE_PARAM,
        PROG_SPEC_LINEAR_ALGEBRA_METHODE_PARAM,
        PROG_SPEC_CALCULUS_METHODE_PARAM,
        PROG_SPEC_THEORETICAL_PHYSICS_MECHANICS_METHODE_PARAM,
        PROG_SPEC_THEORETICAL_PHYSICS_ELECTRODYNAMICS_METHODE_PARAM,
        PROG_SPEC_THEORETICAL_PHYSICS_THERMODYNAMICS_METHODE_PARAM,
        PROG_SPEC_MATH_NUMERICAL_METHODE_METHODE_PARAM,
        PROG_SPEC_MATH_DISCRETE_MATH_METHODE_PARAM,
        PROG_SPEC_KONDENSE_PHYSICS_METHODE_PARAM,
        PROG_SPEC_NUCLEAR_PHYSICS_METHODE_PARAM,
        PROG_SPEC_ATOM_PHYSICS_METHODE_PARAM,
        PROG_SPEC_ORGANIC_CHEMISTRY_METHODE_PARAM,
        PROG_SPEC_INORGANIC_CHEMISTRY_METHODE_PARAM,
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_CALCULUS_METHODE_PARAM,  # 微積分
        PROG_SPEC_LINEAR_ALGEBRA_METHODE_PARAM,  # 線性代數
        PROG_SPEC_MATH_DISCRETE_MATH_METHODE_PARAM,  # 離散
        PROG_SPEC_MATH_NUMERICAL_METHODE_METHODE_PARAM,  # 數值分析
        PROG_SPEC_THEORETICAL_PHYSICS_THERMODYNAMICS_METHODE_PARAM,  # 機率與統計
        PROG_SPEC_OTHERS,  # 數學
        PROG_SPEC_EXPERIMENT_PHYSICS_METHODE_PARAM,  # 普通物理
        PROG_SPEC_EXPERIMENT_PHYSICS_METHODE_PARAM,  # 物理實驗
        PROG_SPEC_THEORETICAL_PHYSICS_MECHANICS_METHODE_PARAM,  # 力學
        PROG_SPEC_OTHERS,  # 進階物理
        PROG_SPEC_ATOM_PHYSICS_METHODE_PARAM,  # 分子物理
        PROG_SPEC_OTHERS,  # 量子物理
        PROG_SPEC_KONDENSE_PHYSICS_METHODE_PARAM,  # 凝態物理
        PROG_SPEC_NUCLEAR_PHYSICS_METHODE_PARAM,  # 核物理
        PROG_SPEC_OTHERS,  # 天文物理
        PROG_SPEC_OTHERS,  # 普通化學
        PROG_SPEC_ORGANIC_CHEMISTRY_METHODE_PARAM,  # 有機化學
        PROG_SPEC_OTHERS,  # 進階化學
        PROG_SPEC_INORGANIC_CHEMISTRY_METHODE_PARAM,  # 無機化學
        PROG_SPEC_OTHERS,  # 生物化學
        PROG_SPEC_OTHERS,  # 物理化學
        PROG_SPEC_THEORETICAL_PHYSICS_ELECTRODYNAMICS_METHODE_PARAM,  # 電磁學
        PROG_SPEC_THEORETICAL_PHYSICS_THERMODYNAMICS_METHODE_PARAM,  # 熱力學
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


def TUM_PHYSICS_NUCLEAR(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'TUM_PHYSICS_NUCLEAR'
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

    PROG_SPEC_EXPERIMENT_PHYSICS_METHODE_PARAM = {
        'Program_Category': 'Mechanics, Electrodynamics, Optics, Thermodynamics, Atomic physics', 'Required_ECTS': 34}
    PROG_SPEC_ADVANCED_PHYSICS_METHODE_PARAM = {
        'Program_Category': 'Advanced physics: Nuclear, astrophysics condensed matter', 'Required_ECTS': 10}
    PROG_SPEC_THEORETICAL_PHYSICS_METHODE_PARAM = {
        'Program_Category': 'Theoretical physics: quantum, thermodynamics, electrodynamics, mechanics', 'Required_ECTS': 34}
    PROG_SPEC_MATH_METHODE_PARAM = {
        'Program_Category': 'Mathematics', 'Required_ECTS': 32}
    PROG_SPEC_LABOR_PRAKTIKA_METHODE_PARAM = {
        'Program_Category': 'Labor practice', 'Required_ECTS': 21}
    PROG_SPEC_BACHELOR_THESIS_METHODE_PARAM = {
        'Program_Category': 'Bachelor Thesis', 'Required_ECTS': 12}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_EXPERIMENT_PHYSICS_METHODE_PARAM,
        PROG_SPEC_ADVANCED_PHYSICS_METHODE_PARAM,
        PROG_SPEC_THEORETICAL_PHYSICS_METHODE_PARAM,
        PROG_SPEC_MATH_METHODE_PARAM,
        PROG_SPEC_LABOR_PRAKTIKA_METHODE_PARAM,
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_MATH_METHODE_PARAM,  # 微積分
        PROG_SPEC_MATH_METHODE_PARAM,  # 線性代數
        PROG_SPEC_MATH_METHODE_PARAM,  # 離散
        PROG_SPEC_MATH_METHODE_PARAM,  # 數值分析
        PROG_SPEC_MATH_METHODE_PARAM,  # 機率與統計
        PROG_SPEC_MATH_METHODE_PARAM,  # 數學
        PROG_SPEC_EXPERIMENT_PHYSICS_METHODE_PARAM,  # 普通物理
        PROG_SPEC_LABOR_PRAKTIKA_METHODE_PARAM,  # 物理實驗
        PROG_SPEC_THEORETICAL_PHYSICS_METHODE_PARAM,  # 力學
        PROG_SPEC_EXPERIMENT_PHYSICS_METHODE_PARAM,  # 進階物理
        PROG_SPEC_EXPERIMENT_PHYSICS_METHODE_PARAM,  # 分子物理
        PROG_SPEC_THEORETICAL_PHYSICS_METHODE_PARAM,  # 量子物理
        PROG_SPEC_ADVANCED_PHYSICS_METHODE_PARAM,  # 凝態物理
        PROG_SPEC_ADVANCED_PHYSICS_METHODE_PARAM,  # 核物理
        PROG_SPEC_ADVANCED_PHYSICS_METHODE_PARAM,  # 天文物理
        PROG_SPEC_OTHERS,  # 普通化學
        PROG_SPEC_OTHERS,  # 有機化學
        PROG_SPEC_OTHERS,  # 進階化學
        PROG_SPEC_OTHERS,  # 無機化學
        PROG_SPEC_OTHERS,  # 生物化學
        PROG_SPEC_OTHERS,  # 物理化學
        PROG_SPEC_THEORETICAL_PHYSICS_METHODE_PARAM,  # 電磁學
        PROG_SPEC_THEORETICAL_PHYSICS_METHODE_PARAM,  # 熱力學
        PROG_SPEC_BACHELOR_THESIS_METHODE_PARAM,  # 論文
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


program_sort_function = [TUM_LMU_QUANTUM_SCIENCE_TECH, TUM_PHYSICS_NUCLEAR]

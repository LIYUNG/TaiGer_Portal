import xlsxwriter
from CourseSuggestionAlgorithms import *
from util import *
from database.ComputerScience.CS_KEYWORDS import *
from cell_formatter import red_out_failed_subject, red_out_insufficient_credit
import pandas as pd
import sys
import os
env_file_path = os.path.realpath(__file__)
env_file_path = os.path.dirname(env_file_path)


# Global variable:
column_len_array = []


def TUM_CS(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'TUM_CS'
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
    # https://campus.tum.de/tumonline/wbLv.wbShowLVDetail?pStpSpNr=950159179&pSpracheNr=2
    PROG_SPEC_INTRO_INFO_PARAM = {
        'Program_Category': 'Introduction_to_Informatics', 'Required_ECTS': 12}
    PROG_SPEC_COMP_ARCH_PARAM = {
        'Program_Category': 'Computer Architecture', 'Required_ECTS': 16}  # Computer Architecture: Organization and Technology
    PROG_SPEC_SWE_PARAM = {
        'Program_Category': 'Software_Engineering', 'Required_ECTS': 6}
    PROG_SPEC_DB_PARAM = {
        'Program_Category': 'Databases', 'Required_ECTS': 6}
    PROG_SPEC_OS_PARAM = {
        'Program_Category': 'Operating_Systems', 'Required_ECTS': 6}  # Operating Systems and System Software
    PROG_SPEC_COMP_NETW_MODULE_PARAM = {
        'Program_Category': 'Computer Network', 'Required_ECTS': 6}   # Computer Networks, Distributed Systems
    PROG_SPEC_FUNC_PROG_MODULE_PARAM = {
        'Program_Category': 'Functional_Programming', 'Required_ECTS': 5}
    PROG_SPEC_ALGOR_DATA_STRUC_MODULE_PARAM = {
        'Program_Category': 'Algorithms_Data_Structures', 'Required_ECTS': 6}
    PROG_SPEC_THEORY_COMP_MODULE_PARAM = {
        'Program_Category': 'Theory_of_Computation', 'Required_ECTS': 8}
    PROG_SPEC_DISCRETE_STRUCTURE_MODULE_PARAM = {
        'Program_Category': 'Discrete_Structures', 'Required_ECTS': 8}
    PROG_SPEC_LINEAR_ALGEBRA_MODULE_PARAM = {
        'Program_Category': 'Linear_Algebra', 'Required_ECTS': 8}
    PROG_SPEC_CALCULUS_MODULE_PARAM = {
        'Program_Category': 'Analysis_Calculus', 'Required_ECTS': 8}
    PROG_SPEC_DISCRETE_PROB_MODULE_PARAM = {
        'Program_Category': 'Discrete_Probability_Theory', 'Required_ECTS': 6}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_INTRO_INFO_PARAM,  # 計算機概論
        PROG_SPEC_COMP_ARCH_PARAM,  # computer architecture
        PROG_SPEC_SWE_PARAM,  # software engineering
        PROG_SPEC_DB_PARAM,  # database
        PROG_SPEC_OS_PARAM,  # OS
        PROG_SPEC_COMP_NETW_MODULE_PARAM,  # 電腦網路
        PROG_SPEC_FUNC_PROG_MODULE_PARAM,  # 函數程式
        PROG_SPEC_ALGOR_DATA_STRUC_MODULE_PARAM,  # 演算法 資料結構
        PROG_SPEC_THEORY_COMP_MODULE_PARAM,  # 運算
        PROG_SPEC_DISCRETE_STRUCTURE_MODULE_PARAM,  # 離散
        PROG_SPEC_LINEAR_ALGEBRA_MODULE_PARAM,  # 線性代數
        PROG_SPEC_CALCULUS_MODULE_PARAM,  # 微積分 分析
        PROG_SPEC_DISCRETE_PROB_MODULE_PARAM,  # 機率
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    # TODO: modify the original sorting list for IT
    program_category_map = [
        PROG_SPEC_INTRO_INFO_PARAM,  # 計算機概論
        PROG_SPEC_OTHERS,  # 基礎電機電子
        PROG_SPEC_INTRO_INFO_PARAM,  # 程式設計
        PROG_SPEC_COMP_ARCH_PARAM,  # computer architecture
        PROG_SPEC_SWE_PARAM,  # software engineering
        PROG_SPEC_DB_PARAM,  # 資料庫
        PROG_SPEC_OS_PARAM,  # 作業系統
        PROG_SPEC_COMP_NETW_MODULE_PARAM,  # 電腦網路
        PROG_SPEC_OTHERS,  # 數理邏輯
        PROG_SPEC_FUNC_PROG_MODULE_PARAM,  # 正規方法
        PROG_SPEC_FUNC_PROG_MODULE_PARAM,  # 函數程式
        PROG_SPEC_ALGOR_DATA_STRUC_MODULE_PARAM,  # 演算法 資料結構
        PROG_SPEC_THEORY_COMP_MODULE_PARAM,  # 可運算度 複雜度
        PROG_SPEC_DISCRETE_STRUCTURE_MODULE_PARAM,  # 離散
        PROG_SPEC_LINEAR_ALGEBRA_MODULE_PARAM,  # 線性代數
        PROG_SPEC_LINEAR_ALGEBRA_MODULE_PARAM,  # 數值分析
        PROG_SPEC_CALCULUS_MODULE_PARAM,  # 微積分 分析
        PROG_SPEC_DISCRETE_PROB_MODULE_PARAM,  # 機率
        PROG_SPEC_OTHERS,  # 進階資工
        PROG_SPEC_OTHERS,  # 物理化學資工工程
        PROG_SPEC_OTHERS,  # 商管經
        PROG_SPEC_OTHERS,  # 其他
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


# https://www.rwth-aachen.de/global/show_document.asp?id=aaaaaaaaaqqnusm
# Same as Data Science RWTH Aachen
def RWTH_DATA_SCIENCE_CS_BG(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    # TODO: modify the course name
    program_name = 'RWTH_DATA_SCIENCE(CS_BG)'
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
    PROG_SPEC_PROGRAMMING_PARAM = {
        'Program_Category': 'Programming', 'Required_ECTS': 8}
    PROG_SPEC_ALGOR_DATA_STRUC_MODULE_PARAM = {
        'Program_Category': 'Algorithms_Data_Structures', 'Required_ECTS': 8}
    PROG_SPEC_DB_PARAM = {
        'Program_Category': 'Databases and Info-system', 'Required_ECTS': 6}
    PROG_SPEC_SWE_PARAM = {
        'Program_Category': 'Software_Engineering', 'Required_ECTS': 6}

    # https://embedded.rwth-aachen.de/doku.php?id=lehre:wise0910:technische_informatik
    PROG_SPEC_INTRO_INFO_PARAM = {
        'Program_Category': 'Introduction_to_Technical_Informatics', 'Required_ECTS': 6}  # 邏輯設計，基礎電機電子!!
    PROG_SPEC_OS_PARAM = {
        'Program_Category': 'Operating_Systems', 'Required_ECTS': 6}  # Operating Systems and System Software
    PROG_SPEC_COMP_NETW_MODULE_PARAM = {
        'Program_Category': 'Computer Network', 'Required_ECTS': 6}   # Computer Networks, Distributed Systems

    PROG_SPEC_FORMAL_AUTOMATEN_PARAM = {
        'Program_Category': 'Formal System, Abstract machine and Process', 'Required_ECTS': 6}
    PROG_SPEC_COMPU_COMPLEXITY_PARAM = {
        'Program_Category': 'Computability and Complexity', 'Required_ECTS': 6}
    PROG_SPEC_MATH_LOGIC_PARAM = {
        'Program_Category': 'Mathematical Logic', 'Required_ECTS': 6}

    PROG_SPEC_DISCRETE_STRUCTURE_MODULE_PARAM = {
        'Program_Category': 'Discrete_Structures', 'Required_ECTS': 6}
    PROG_SPEC_ANALYSIS_INFORMATIKER_PARAM = {
        'Program_Category': 'Analysis for Informatiker', 'Required_ECTS': 8}  # calculus
    PROG_SPEC_LINEAR_ALGEBRA_MODULE_PARAM = {
        'Program_Category': 'Linear_Algebra', 'Required_ECTS': 6}
    PROG_SPEC_STOCHASTIK_PARAM = {
        'Program_Category': 'Stochastics', 'Required_ECTS': 6}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_PROGRAMMING_PARAM,  # Programming
        PROG_SPEC_ALGOR_DATA_STRUC_MODULE_PARAM,  # 演算法 資料結構
        PROG_SPEC_DB_PARAM,  # database
        PROG_SPEC_SWE_PARAM,  # software engineering
        PROG_SPEC_INTRO_INFO_PARAM,  # 計算機概論
        PROG_SPEC_OS_PARAM,  # OS
        PROG_SPEC_COMP_NETW_MODULE_PARAM,  # 電腦網路
        PROG_SPEC_FORMAL_AUTOMATEN_PARAM,  # 正規系統 抽象機器
        PROG_SPEC_COMPU_COMPLEXITY_PARAM,   # 複雜度 可計算度
        PROG_SPEC_MATH_LOGIC_PARAM,         # 數理邏輯
        PROG_SPEC_DISCRETE_STRUCTURE_MODULE_PARAM,  # 離散
        PROG_SPEC_ANALYSIS_INFORMATIKER_PARAM,      # 微積分
        PROG_SPEC_LINEAR_ALGEBRA_MODULE_PARAM,  # 線性代數
        PROG_SPEC_STOCHASTIK_PARAM,  # 機率
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    # TODO: modify the original sorting list for IT
    program_category_map = [
        PROG_SPEC_INTRO_INFO_PARAM,  # 計算機概論
        PROG_SPEC_INTRO_INFO_PARAM,  # 基礎電機電子
        PROG_SPEC_PROGRAMMING_PARAM,  # 程式設計
        PROG_SPEC_OTHERS,  # computer architecture
        PROG_SPEC_SWE_PARAM,  # software engineering
        PROG_SPEC_DB_PARAM,  # 資料庫
        PROG_SPEC_OS_PARAM,  # 作業系統
        PROG_SPEC_COMP_NETW_MODULE_PARAM,  # 電腦網路
        PROG_SPEC_MATH_LOGIC_PARAM,  # 數理邏輯
        PROG_SPEC_FORMAL_AUTOMATEN_PARAM,  # 正規方法
        PROG_SPEC_FORMAL_AUTOMATEN_PARAM,  # 函數程式
        PROG_SPEC_ALGOR_DATA_STRUC_MODULE_PARAM,  # 演算法 資料結構
        PROG_SPEC_COMPU_COMPLEXITY_PARAM,  # 可運算度 複雜度
        PROG_SPEC_DISCRETE_STRUCTURE_MODULE_PARAM,  # 離散
        PROG_SPEC_LINEAR_ALGEBRA_MODULE_PARAM,  # 線性代數
        PROG_SPEC_LINEAR_ALGEBRA_MODULE_PARAM,  # 數值分析
        PROG_SPEC_ANALYSIS_INFORMATIKER_PARAM,  # 微積分 分析
        PROG_SPEC_STOCHASTIK_PARAM,  # 機率
        PROG_SPEC_OTHERS,  # 進階資工
        PROG_SPEC_OTHERS,  # 物理化學資工工程
        PROG_SPEC_OTHERS,  # 商管經
        PROG_SPEC_OTHERS,  # 其他
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

# https://www.rwth-aachen.de/global/show_document.asp?id=aaaaaaaaaqqnusm
def RWTH_DATA_SCIENCE_MATH_BG(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    # TODO: modify the course name
    program_name = 'RWTH_DATA_SCIENCE(MATH_BG)'
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

    PROG_SPEC_ANALYSIS_PARAM = {
        'Program_Category': 'Analysis, Calculus', 'Required_ECTS': 24}
    PROG_SPEC_LINEAR_ALGEBRA_PARAM = {
        'Program_Category': 'Linear Algebra', 'Required_ECTS': 15}
    PROG_SPEC_NUMERICAL_METHOD_PARAM = {
        'Program_Category': 'Numerical Analysis', 'Required_ECTS': 9}
    PROG_SPEC_STOCHASTIK_PARAM = {
        'Program_Category': 'Stochastics', 'Required_ECTS': 9}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_ANALYSIS_PARAM,  # 微積分
        PROG_SPEC_LINEAR_ALGEBRA_PARAM,  # 線性代數
        PROG_SPEC_NUMERICAL_METHOD_PARAM,      # 數值
        PROG_SPEC_STOCHASTIK_PARAM,  # 機率
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    # TODO: modify the original sorting list for IT
    program_category_map = [
        PROG_SPEC_OTHERS,  # 計算機概論
        PROG_SPEC_OTHERS,  # 基礎電機電子
        PROG_SPEC_OTHERS,  # 程式設計
        PROG_SPEC_OTHERS,  # computer architecture
        PROG_SPEC_OTHERS,  # software engineering
        PROG_SPEC_OTHERS,  # 資料庫
        PROG_SPEC_OTHERS,  # 作業系統
        PROG_SPEC_OTHERS,  # 電腦網路
        PROG_SPEC_OTHERS,  # 數理邏輯
        PROG_SPEC_OTHERS,  # 正規方法
        PROG_SPEC_OTHERS,  # 函數程式
        PROG_SPEC_OTHERS,  # 演算法 資料結構
        PROG_SPEC_OTHERS,  # 可運算度 複雜度
        PROG_SPEC_OTHERS,  # 離散
        PROG_SPEC_LINEAR_ALGEBRA_PARAM,  # 線性代數
        PROG_SPEC_NUMERICAL_METHOD_PARAM,  # 數值分析
        PROG_SPEC_ANALYSIS_PARAM,  # 微積分 分析
        PROG_SPEC_STOCHASTIK_PARAM,  # 機率
        PROG_SPEC_OTHERS,  # 進階資工
        PROG_SPEC_OTHERS,  # 物理化學資工工程
        PROG_SPEC_OTHERS,  # 商管經
        PROG_SPEC_OTHERS,  # 其他
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


# https://www.rwth-aachen.de/global/show_document.asp?id=aaaaaaaaajwhguv
def RWTH_SOFTWARE_SYS_ENG(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    # TODO: modify the course name
    program_name = 'RWTH_SOFTWARE_SYS_ENG'
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
    PROG_SPEC_PROGRAMMING_PARAM = {
        'Program_Category': 'Programming', 'Required_ECTS': 8}
    PROG_SPEC_ALGOR_DATA_STRUC_MODULE_PARAM = {
        'Program_Category': 'Algorithms_Data_Structures', 'Required_ECTS': 8}
    PROG_SPEC_DB_PARAM = {
        'Program_Category': 'Databases and Info-system', 'Required_ECTS': 6}
    PROG_SPEC_SWE_PARAM = {
        'Program_Category': 'Software_Engineering', 'Required_ECTS': 6}

    # https://embedded.rwth-aachen.de/doku.php?id=lehre:wise0910:technische_informatik
    PROG_SPEC_INTRO_INFO_PARAM = {
        'Program_Category': 'Introduction_to_Technical_Informatics', 'Required_ECTS': 6}  # 邏輯設計，基礎電機電子!!
    PROG_SPEC_OS_PARAM = {
        'Program_Category': 'Operating_Systems', 'Required_ECTS': 6}  # Operating Systems and System Software
    PROG_SPEC_COMP_NETW_MODULE_PARAM = {
        'Program_Category': 'Computer Network', 'Required_ECTS': 6}   # Computer Networks, Distributed Systems

    PROG_SPEC_FORMAL_AUTOMATEN_PARAM = {
        'Program_Category': 'Formal System, Abstract machine and Process', 'Required_ECTS': 6}
    PROG_SPEC_COMPU_COMPLEXITY_PARAM = {
        'Program_Category': 'Computability and Complexity', 'Required_ECTS': 6}
    PROG_SPEC_MATH_LOGIC_PARAM = {
        'Program_Category': 'Mathematical Logic', 'Required_ECTS': 6}

    PROG_SPEC_DISCRETE_STRUCTURE_MODULE_PARAM = {
        'Program_Category': 'Discrete_Structures', 'Required_ECTS': 6}
    PROG_SPEC_ANALYSIS_INFORMATIKER_PARAM = {
        'Program_Category': 'Analysis for Informatiker', 'Required_ECTS': 8}  # calculus
    PROG_SPEC_LINEAR_ALGEBRA_MODULE_PARAM = {
        'Program_Category': 'Linear_Algebra', 'Required_ECTS': 6}
    PROG_SPEC_STOCHASTIK_PARAM = {
        'Program_Category': 'Stochastics', 'Required_ECTS': 6}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_PROGRAMMING_PARAM,  # Programming
        PROG_SPEC_ALGOR_DATA_STRUC_MODULE_PARAM,  # 演算法 資料結構
        PROG_SPEC_DB_PARAM,  # database
        PROG_SPEC_SWE_PARAM,  # software engineering
        PROG_SPEC_INTRO_INFO_PARAM,  # 計算機概論
        PROG_SPEC_OS_PARAM,  # OS
        PROG_SPEC_COMP_NETW_MODULE_PARAM,  # 電腦網路
        PROG_SPEC_FORMAL_AUTOMATEN_PARAM,  # 正規系統 抽象機器
        PROG_SPEC_COMPU_COMPLEXITY_PARAM,   # 複雜度 可計算度
        PROG_SPEC_MATH_LOGIC_PARAM,         # 數理邏輯
        PROG_SPEC_DISCRETE_STRUCTURE_MODULE_PARAM,  # 離散
        PROG_SPEC_ANALYSIS_INFORMATIKER_PARAM,      # 微積分
        PROG_SPEC_LINEAR_ALGEBRA_MODULE_PARAM,  # 線性代數
        PROG_SPEC_STOCHASTIK_PARAM,  # 機率
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    # TODO: modify the original sorting list for IT
    program_category_map = [
        PROG_SPEC_INTRO_INFO_PARAM,  # 計算機概論
        PROG_SPEC_INTRO_INFO_PARAM,  # 基礎電機電子
        PROG_SPEC_PROGRAMMING_PARAM,  # 程式設計
        PROG_SPEC_OTHERS,  # computer architecture
        PROG_SPEC_SWE_PARAM,  # software engineering
        PROG_SPEC_DB_PARAM,  # 資料庫
        PROG_SPEC_OS_PARAM,  # 作業系統
        PROG_SPEC_COMP_NETW_MODULE_PARAM,  # 電腦網路
        PROG_SPEC_MATH_LOGIC_PARAM,  # 數理邏輯
        PROG_SPEC_FORMAL_AUTOMATEN_PARAM,  # 正規方法
        PROG_SPEC_FORMAL_AUTOMATEN_PARAM,  # 函數程式
        PROG_SPEC_ALGOR_DATA_STRUC_MODULE_PARAM,  # 演算法 資料結構
        PROG_SPEC_COMPU_COMPLEXITY_PARAM,  # 可運算度 複雜度
        PROG_SPEC_DISCRETE_STRUCTURE_MODULE_PARAM,  # 離散
        PROG_SPEC_LINEAR_ALGEBRA_MODULE_PARAM,  # 線性代數
        PROG_SPEC_LINEAR_ALGEBRA_MODULE_PARAM,  # 數值分析
        PROG_SPEC_ANALYSIS_INFORMATIKER_PARAM,  # 微積分 分析
        PROG_SPEC_STOCHASTIK_PARAM,  # 機率
        PROG_SPEC_OTHERS,  # 進階資工
        PROG_SPEC_OTHERS,  # 物理化學資工工程
        PROG_SPEC_OTHERS,  # 商管經
        PROG_SPEC_OTHERS,  # 其他
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


# https://www.rwth-aachen.de/global/show_document.asp?id=aaaaaaaaaxuhfyf
def RWTH_MEDIA_INFO(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    # TODO: modify the course name
    program_name = 'RWTH_MEDIA_INFO'
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
    PROG_SPEC_PROGRAMMING_PARAM = {
        'Program_Category': 'Programming', 'Required_ECTS': 8}
    PROG_SPEC_ALGOR_DATA_STRUC_MODULE_PARAM = {
        'Program_Category': 'Algorithms_Data_Structures', 'Required_ECTS': 8}
    PROG_SPEC_DB_PARAM = {
        'Program_Category': 'Databases and Info-system', 'Required_ECTS': 6}
    PROG_SPEC_SWE_PARAM = {
        'Program_Category': 'Software_Engineering', 'Required_ECTS': 6}

    # https://embedded.rwth-aachen.de/doku.php?id=lehre:wise0910:technische_informatik
    PROG_SPEC_INTRO_INFO_PARAM = {
        'Program_Category': 'Introduction_to_Technical_Informatics', 'Required_ECTS': 6}  # 邏輯設計，基礎電機電子!!
    PROG_SPEC_OS_PARAM = {
        'Program_Category': 'Operating_Systems', 'Required_ECTS': 6}  # Operating Systems and System Software
    PROG_SPEC_COMP_NETW_MODULE_PARAM = {
        'Program_Category': 'Computer Network', 'Required_ECTS': 6}   # Computer Networks, Distributed Systems

    PROG_SPEC_FORMAL_AUTOMATEN_PARAM = {
        'Program_Category': 'Formal System, Abstract machine and Process', 'Required_ECTS': 6}
    PROG_SPEC_COMPU_COMPLEXITY_PARAM = {
        'Program_Category': 'Computability and Complexity', 'Required_ECTS': 6}
    PROG_SPEC_MATH_LOGIC_PARAM = {
        'Program_Category': 'Mathematical Logic', 'Required_ECTS': 6}

    PROG_SPEC_DISCRETE_STRUCTURE_MODULE_PARAM = {
        'Program_Category': 'Discrete_Structures', 'Required_ECTS': 6}
    PROG_SPEC_ANALYSIS_INFORMATIKER_PARAM = {
        'Program_Category': 'Analysis for Informatiker', 'Required_ECTS': 8}  # calculus
    PROG_SPEC_LINEAR_ALGEBRA_MODULE_PARAM = {
        'Program_Category': 'Linear_Algebra', 'Required_ECTS': 6}
    PROG_SPEC_STOCHASTIK_PARAM = {
        'Program_Category': 'Stochastics', 'Required_ECTS': 6}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_PROGRAMMING_PARAM,  # Programming
        PROG_SPEC_ALGOR_DATA_STRUC_MODULE_PARAM,  # 演算法 資料結構
        PROG_SPEC_DB_PARAM,  # database
        PROG_SPEC_SWE_PARAM,  # software engineering
        PROG_SPEC_INTRO_INFO_PARAM,  # 計算機概論
        PROG_SPEC_OS_PARAM,  # OS
        PROG_SPEC_COMP_NETW_MODULE_PARAM,  # 電腦網路
        PROG_SPEC_FORMAL_AUTOMATEN_PARAM,  # 正規系統 抽象機器
        PROG_SPEC_COMPU_COMPLEXITY_PARAM,   # 複雜度 可計算度
        PROG_SPEC_MATH_LOGIC_PARAM,         # 數理邏輯
        PROG_SPEC_DISCRETE_STRUCTURE_MODULE_PARAM,  # 離散
        PROG_SPEC_ANALYSIS_INFORMATIKER_PARAM,      # 微積分
        PROG_SPEC_LINEAR_ALGEBRA_MODULE_PARAM,  # 線性代數
        PROG_SPEC_STOCHASTIK_PARAM,  # 機率
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    # TODO: modify the original sorting list for IT
    program_category_map = [
        PROG_SPEC_INTRO_INFO_PARAM,  # 計算機概論
        PROG_SPEC_INTRO_INFO_PARAM,  # 基礎電機電子
        PROG_SPEC_PROGRAMMING_PARAM,  # 程式設計
        PROG_SPEC_OTHERS,  # computer architecture
        PROG_SPEC_SWE_PARAM,  # software engineering
        PROG_SPEC_DB_PARAM,  # 資料庫
        PROG_SPEC_OS_PARAM,  # 作業系統
        PROG_SPEC_COMP_NETW_MODULE_PARAM,  # 電腦網路
        PROG_SPEC_MATH_LOGIC_PARAM,  # 數理邏輯
        PROG_SPEC_FORMAL_AUTOMATEN_PARAM,  # 正規方法
        PROG_SPEC_FORMAL_AUTOMATEN_PARAM,  # 函數程式
        PROG_SPEC_ALGOR_DATA_STRUC_MODULE_PARAM,  # 演算法 資料結構
        PROG_SPEC_COMPU_COMPLEXITY_PARAM,  # 可運算度 複雜度
        PROG_SPEC_DISCRETE_STRUCTURE_MODULE_PARAM,  # 離散
        PROG_SPEC_LINEAR_ALGEBRA_MODULE_PARAM,  # 線性代數
        PROG_SPEC_LINEAR_ALGEBRA_MODULE_PARAM,  # 數值分析
        PROG_SPEC_ANALYSIS_INFORMATIKER_PARAM,  # 微積分 分析
        PROG_SPEC_STOCHASTIK_PARAM,  # 機率
        PROG_SPEC_OTHERS,  # 進階資工
        PROG_SPEC_OTHERS,  # 物理化學資工工程
        PROG_SPEC_OTHERS,  # 商管經
        PROG_SPEC_OTHERS,  # 其他
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


# FPSO: https://www.fu-berlin.de/service/zuvdocs/amtsblatt/2020/ab342020.pdf
def FU_BERLIN_DATA_SCIENCE(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'FU_BERLIN_DATA_SCIENCE'
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
    PROG_SPEC_PROGRAMMING_PARAM = {
        'Program_Category': 'Programming', 'Required_ECTS': 5}
    PROG_SPEC_DS_ALGO_PARAM = {
        'Program_Category': 'Data Structure and Algorithm', 'Required_ECTS': 5}
    PROG_SPEC_DISCRETE_STRUCTURE_MODULE_PARAM = {
        'Program_Category': 'Discrete_Structures', 'Required_ECTS': 5}  # 離散
    PROG_SPEC_ANALYSIS_INFORMATIKER_PARAM = {
        'Program_Category': 'Analysis for Informatiker', 'Required_ECTS': 5}  # calculus
    PROG_SPEC_LINEAR_ALGEBRA_MODULE_PARAM = {
        'Program_Category': 'Linear_Algebra', 'Required_ECTS': 5}
    PROG_SPEC_PROBABILITY_PARAM = {
        'Program_Category': 'Probability and Statistics', 'Required_ECTS': 5}
    PROG_SPEC_CS_MODULE_PARAM = {
        'Program_Category': 'Computer Science Module', 'Required_ECTS': 10}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_PROGRAMMING_PARAM,  # Programming
        PROG_SPEC_DS_ALGO_PARAM,  # 演算法 資料結構
        PROG_SPEC_DISCRETE_STRUCTURE_MODULE_PARAM,  # 離散
        PROG_SPEC_ANALYSIS_INFORMATIKER_PARAM,      # 微積分
        PROG_SPEC_LINEAR_ALGEBRA_MODULE_PARAM,  # 線性代數
        PROG_SPEC_PROBABILITY_PARAM,  # 機率 統計
        PROG_SPEC_CS_MODULE_PARAM,  # 基礎計算機概論
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    # TODO: modify the original sorting list for IT
    program_category_map = [
        PROG_SPEC_CS_MODULE_PARAM,  # 計算機概論
        PROG_SPEC_OTHERS,  # 基礎電機電子
        PROG_SPEC_PROGRAMMING_PARAM,  # 程式設計
        PROG_SPEC_CS_MODULE_PARAM,  # computer architecture
        PROG_SPEC_CS_MODULE_PARAM,  # software engineering
        PROG_SPEC_CS_MODULE_PARAM,  # 資料庫
        PROG_SPEC_CS_MODULE_PARAM,  # 作業系統
        PROG_SPEC_CS_MODULE_PARAM,  # 電腦網路
        PROG_SPEC_CS_MODULE_PARAM,  # 數理邏輯
        PROG_SPEC_CS_MODULE_PARAM,  # 正規方法
        PROG_SPEC_CS_MODULE_PARAM,  # 函數程式
        PROG_SPEC_DS_ALGO_PARAM,  # 演算法 資料結構
        PROG_SPEC_CS_MODULE_PARAM,  # 可運算度 複雜度
        PROG_SPEC_DISCRETE_STRUCTURE_MODULE_PARAM,  # 離散
        PROG_SPEC_LINEAR_ALGEBRA_MODULE_PARAM,  # 線性代數
        PROG_SPEC_LINEAR_ALGEBRA_MODULE_PARAM,  # 數值分析
        PROG_SPEC_ANALYSIS_INFORMATIKER_PARAM,  # 微積分 分析
        PROG_SPEC_PROBABILITY_PARAM,  # 機率
        PROG_SPEC_CS_MODULE_PARAM,  # 進階資工
        PROG_SPEC_OTHERS,  # 物理化學資工工程
        PROG_SPEC_OTHERS,  # 商管經
        PROG_SPEC_OTHERS,  # 其他
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


# FPSO: https://www.static.tu.berlin/fileadmin/www/10000000/Studiengaenge/StuPOs/Fakultaet_IV/ComputerScience_M.Sc._2015.pdf
# Modulhandbuch: https://www.eecs.tu-berlin.de/fileadmin/f4/fkIVdokumente/Module/bachelor/BScInformatik.pdf
def TU_BERLIN_COMPUTER_SCIENCE(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'TU_BERLIN_COMPUTER_SCIENCE'
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
    PROG_SPEC_THEORETICAL_INFO_PARAM = {
        'Program_Category': 'Theoretical Informatics', 'Required_ECTS': 12}  #
    PROG_SPEC_TECHNICAL_INFO_PARAM = {
        'Program_Category': 'Technical Informatics', 'Required_ECTS': 12}
    PROG_SPEC_METHO_PRACTICAL_INFO_PARAM = {
        'Program_Category': 'Methodological-practical Informatics', 'Required_ECTS': 12}
    PROG_SPEC_MATH_PARAM = {
        'Program_Category': 'Mathematics', 'Required_ECTS': 18}  # 數學
    PROG_SPEC_ADVANCED_INFO_PARAM = {
        'Program_Category': 'Advanced course of Informatics', 'Required_ECTS': 30}  #
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_THEORETICAL_INFO_PARAM,  # 計算機理論
        PROG_SPEC_TECHNICAL_INFO_PARAM,  # 計算機組織 結構
        PROG_SPEC_METHO_PRACTICAL_INFO_PARAM,   # 計概 資結 演算法
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_ADVANCED_INFO_PARAM,  # 資工進階課
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    # TODO: modify the original sorting list for IT
    program_category_map = [
        PROG_SPEC_METHO_PRACTICAL_INFO_PARAM,  # 計算機概論
        PROG_SPEC_OTHERS,  # 基礎電機電子
        PROG_SPEC_METHO_PRACTICAL_INFO_PARAM,  # 程式設計
        PROG_SPEC_TECHNICAL_INFO_PARAM,  # computer architecture
        PROG_SPEC_METHO_PRACTICAL_INFO_PARAM,  # software engineering
        PROG_SPEC_METHO_PRACTICAL_INFO_PARAM,  # 資料庫
        PROG_SPEC_TECHNICAL_INFO_PARAM,  # 作業系統
        PROG_SPEC_TECHNICAL_INFO_PARAM,  # 電腦網路
        PROG_SPEC_THEORETICAL_INFO_PARAM,  # 數理邏輯
        PROG_SPEC_THEORETICAL_INFO_PARAM,  # 正規方法
        PROG_SPEC_THEORETICAL_INFO_PARAM,  # 函數程式
        PROG_SPEC_METHO_PRACTICAL_INFO_PARAM,  # 演算法 資料結構
        PROG_SPEC_THEORETICAL_INFO_PARAM,  # 可運算度 複雜度
        PROG_SPEC_MATH_PARAM,  # 離散
        PROG_SPEC_MATH_PARAM,  # 線性代數
        PROG_SPEC_MATH_PARAM,  # 數值分析
        PROG_SPEC_MATH_PARAM,  # 微積分 分析
        PROG_SPEC_MATH_PARAM,  # 機率
        PROG_SPEC_ADVANCED_INFO_PARAM,  # 進階資工
        PROG_SPEC_OTHERS,  # 物理化學資工工程
        PROG_SPEC_OTHERS,  # 商管經
        PROG_SPEC_OTHERS,  # 其他
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


# https://www.tum.de/fileadmin/w00bfo/www/Studium/Studienangebot/Lesbare_Fassung/Master/lesb._F._FPSO_MA_DataEngineeringAnalysis_mit_AES_vom_11.10.2019.pdf
# details formular: https://www.in.tum.de/fuer-studieninteressierte/bewerbung/masterstudiengaenge/data-engineering-and-analytics/
def TUM_DATA_ENGINEERING_ANALYTICS(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'TUM_DATA_ENGINEERING_ANALYTICS'
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
    PROG_SPEC_INTRO_INFO_PARAM = {
        'Program_Category': 'Introduction_to_Informatics', 'Required_ECTS': 12}
    PROG_SPEC_DB_PARAM = {
        'Program_Category': 'Databases', 'Required_ECTS': 6}
    PROG_SPEC_COMP_ARCH_PARAM = {
        'Program_Category': 'Computer Architecture', 'Required_ECTS': 8}  # Computer Architecture: Organization and Technology
    PROG_SPEC_SWE_PARAM = {
        'Program_Category': 'Software_Engineering', 'Required_ECTS': 6}
    PROG_SPEC_OS_PARAM = {
        'Program_Category': 'Operating_Systems', 'Required_ECTS': 6}  # Operating Systems and System Software
    PROG_SPEC_COMP_NETW_MODULE_PARAM = {
        'Program_Category': 'Computer Network', 'Required_ECTS': 6}   # Computer Networks, Distributed Systems
    PROG_SPEC_ALGOR_DATA_STRUC_MODULE_PARAM = {
        'Program_Category': 'Algorithms_Data_Structures', 'Required_ECTS': 6}
    PROG_SPEC_THEORY_COMP_MODULE_PARAM = {
        'Program_Category': 'Theory_of_Computation', 'Required_ECTS': 8}
    PROG_SPEC_DISCRETE_STRUCTURE_MODULE_PARAM = {
        'Program_Category': 'Discrete_Structures', 'Required_ECTS': 8}
    PROG_SPEC_LINEAR_ALGEBRA_MODULE_PARAM = {
        'Program_Category': 'Linear_Algebra', 'Required_ECTS': 8}
    PROG_SPEC_CALCULUS_MODULE_PARAM = {
        'Program_Category': 'Analysis_Calculus', 'Required_ECTS': 8}
    PROG_SPEC_DISCRETE_PROB_MODULE_PARAM = {
        'Program_Category': 'Discrete_Probability_Theory', 'Required_ECTS': 6}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_INTRO_INFO_PARAM,  # 計算機概論
        PROG_SPEC_COMP_ARCH_PARAM,  # computer architecture
        PROG_SPEC_SWE_PARAM,  # software engineering
        PROG_SPEC_DB_PARAM,  # database
        PROG_SPEC_OS_PARAM,  # OS
        PROG_SPEC_COMP_NETW_MODULE_PARAM,  # 電腦網路
        PROG_SPEC_ALGOR_DATA_STRUC_MODULE_PARAM,  # 演算法 資料結構
        PROG_SPEC_THEORY_COMP_MODULE_PARAM,  # 運算
        PROG_SPEC_DISCRETE_STRUCTURE_MODULE_PARAM,  # 離散
        PROG_SPEC_LINEAR_ALGEBRA_MODULE_PARAM,  # 線性代數
        PROG_SPEC_CALCULUS_MODULE_PARAM,  # 微積分 分析
        PROG_SPEC_DISCRETE_PROB_MODULE_PARAM,  # 機率
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    # TODO: modify the original sorting list for IT
    program_category_map = [
        PROG_SPEC_INTRO_INFO_PARAM,  # 計算機概論
        PROG_SPEC_OTHERS,  # 基礎電機電子
        PROG_SPEC_INTRO_INFO_PARAM,  # 程式設計
        PROG_SPEC_COMP_ARCH_PARAM,  # computer architecture
        PROG_SPEC_SWE_PARAM,  # software engineering
        PROG_SPEC_DB_PARAM,  # 資料庫
        PROG_SPEC_OS_PARAM,  # 作業系統
        PROG_SPEC_COMP_NETW_MODULE_PARAM,  # 電腦網路
        PROG_SPEC_OTHERS,  # 數理邏輯
        PROG_SPEC_OTHERS,  # 正規方法
        PROG_SPEC_OTHERS,  # 函數程式
        PROG_SPEC_ALGOR_DATA_STRUC_MODULE_PARAM,  # 演算法 資料結構
        PROG_SPEC_THEORY_COMP_MODULE_PARAM,  # 可運算度 複雜度
        PROG_SPEC_DISCRETE_STRUCTURE_MODULE_PARAM,  # 離散
        PROG_SPEC_LINEAR_ALGEBRA_MODULE_PARAM,  # 線性代數
        PROG_SPEC_LINEAR_ALGEBRA_MODULE_PARAM,  # 數值分析
        PROG_SPEC_CALCULUS_MODULE_PARAM,  # 微積分 分析
        PROG_SPEC_DISCRETE_PROB_MODULE_PARAM,  # 機率
        PROG_SPEC_OTHERS,  # 進階資工
        PROG_SPEC_OTHERS,  # 物理化學資工工程
        PROG_SPEC_OTHERS,  # 商管經
        PROG_SPEC_OTHERS,  # 其他
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


# Requirement: https://www.tudelft.nl/onderwijs/opleidingen/masters/cs/msc-computer-science/admission-and-application
def TU_Delft_CS(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'TU_Delft_CS'
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
    PROG_SPEC_MATH_MODEL_PARAM = {
        'Program_Category': 'Mathematics and Modelling', 'Required_ECTS': 15}  # Calculus, Linear Algebra, Probability Theory and Statistics
    PROG_SPEC_SW_BASIC_PARAM = {
        # Object Oriented Programming, Software Quality and Testing, Software Engineering Methods, Concepts of Programming Languages, Object Oriented Programming Project, Software Project
        'Program_Category': 'Software Development Fundamentals', 'Required_ECTS': 30}
    PROG_SPEC_COMP_SYS_PARAM = {
        'Program_Category': 'Computer Systems', 'Required_ECTS': 10}  # Computer Organisation, Computer Networks
    PROG_SPEC_FUNDAMENTAL_CS_PARAM = {
        'Program_Category': 'Fundamental Computer Science', 'Required_ECTS': 15}  # Logic, Algorithms and Data Structures, Algorithm Design, Computability
    PROG_SPEC_DATA_INFO_SYS_PARAM = {
        'Program_Category': 'Data and Information Systems', 'Required_ECTS': 15}  # Machine Learning, Data Management, Web- & Database Technology
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_MATH_MODEL_PARAM,  # 數學
        PROG_SPEC_SW_BASIC_PARAM,  # software engineering
        PROG_SPEC_COMP_SYS_PARAM,  # computer architecture, 電腦網路
        PROG_SPEC_FUNDAMENTAL_CS_PARAM,  # 演算法 資料結構 運算理論
        PROG_SPEC_DATA_INFO_SYS_PARAM,  # ML, DB
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    # TODO: modify the original sorting list for IT
    program_category_map = [
        PROG_SPEC_SW_BASIC_PARAM,  # 計算機概論
        PROG_SPEC_OTHERS,  # 基礎電機電子
        PROG_SPEC_SW_BASIC_PARAM,  # 程式設計
        PROG_SPEC_COMP_SYS_PARAM,  # computer architecture
        PROG_SPEC_SW_BASIC_PARAM,  # software engineering
        PROG_SPEC_DATA_INFO_SYS_PARAM,  # 資料庫
        PROG_SPEC_OTHERS,  # 作業系統
        PROG_SPEC_COMP_SYS_PARAM,  # 電腦網路
        PROG_SPEC_OTHERS,  # 數理邏輯
        PROG_SPEC_OTHERS,  # 正規方法
        PROG_SPEC_OTHERS,  # 函數程式
        PROG_SPEC_FUNDAMENTAL_CS_PARAM,  # 演算法 資料結構
        PROG_SPEC_FUNDAMENTAL_CS_PARAM,  # 可運算度 複雜度
        PROG_SPEC_MATH_MODEL_PARAM,  # 離散
        PROG_SPEC_MATH_MODEL_PARAM,  # 線性代數
        PROG_SPEC_MATH_MODEL_PARAM,  # 數值分析
        PROG_SPEC_MATH_MODEL_PARAM,  # 微積分 分析
        PROG_SPEC_MATH_MODEL_PARAM,  # 機率
        PROG_SPEC_DATA_INFO_SYS_PARAM,  # 進階資工
        PROG_SPEC_OTHERS,  # 物理化學資工工程
        PROG_SPEC_OTHERS,  # 商管經
        PROG_SPEC_OTHERS,  # 其他
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


# Requirement:
def RWTH_DDS(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'RWTH_DDS'
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
        'Program_Category': 'Mathematics and Statistics', 'Required_ECTS': 15}  # Calculus, Linear Algebra, Probability Theory and Statistics
    PROG_SPEC_NS_INFO_ENG_PARAM = {
        # natural science, Informatik, Engineering
        'Program_Category': 'Natural Science, CS, Engineering', 'Required_ECTS': 125}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_NS_INFO_ENG_PARAM,  # Natural Science, Informatik, Engineering
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_NS_INFO_ENG_PARAM,  # 計算機概論
        PROG_SPEC_NS_INFO_ENG_PARAM,  # 基礎電機電子
        PROG_SPEC_NS_INFO_ENG_PARAM,  # 程式設計
        PROG_SPEC_NS_INFO_ENG_PARAM,  # computer architecture
        PROG_SPEC_NS_INFO_ENG_PARAM,  # software engineering
        PROG_SPEC_NS_INFO_ENG_PARAM,  # 資料庫
        PROG_SPEC_NS_INFO_ENG_PARAM,  # 作業系統
        PROG_SPEC_NS_INFO_ENG_PARAM,  # 電腦網路
        PROG_SPEC_NS_INFO_ENG_PARAM,  # 數理邏輯
        PROG_SPEC_NS_INFO_ENG_PARAM,  # 正規方法
        PROG_SPEC_NS_INFO_ENG_PARAM,  # 函數程式
        PROG_SPEC_NS_INFO_ENG_PARAM,  # 演算法 資料結構
        PROG_SPEC_NS_INFO_ENG_PARAM,  # 可運算度 複雜度
        PROG_SPEC_MATH_PARAM,  # 離散
        PROG_SPEC_MATH_PARAM,  # 線性代數
        PROG_SPEC_MATH_PARAM,  # 數值分析
        PROG_SPEC_MATH_PARAM,  # 微積分 分析
        PROG_SPEC_MATH_PARAM,  # 機率
        PROG_SPEC_NS_INFO_ENG_PARAM,  # 進階資工
        PROG_SPEC_NS_INFO_ENG_PARAM,  # 物理化學工程
        PROG_SPEC_OTHERS,  # 商管經
        PROG_SPEC_OTHERS,  # 其他
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


# Requirement:
def RWTH_TIME(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'RWTH_TIME'
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
        'Program_Category': 'Mathematics and Statistics', 'Required_ECTS': 16}  # Calculus, Linear Algebra, Probability Theory and Statistics
    PROG_SPEC_NS_INFO_ENG_PARAM = {
        # natural science, Informatik, Engineering
        'Program_Category': 'Natural Science, CS, Engineering', 'Required_ECTS': 125}
    PROG_SPEC_BA_BI_PARAM = {
        # BA, BI
        'Program_Category': 'BI BA', 'Required_ECTS': 10}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_NS_INFO_ENG_PARAM,  # natural science Informatik, Engineering
        PROG_SPEC_BA_BI_PARAM,  # BA, BI,
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_NS_INFO_ENG_PARAM,  # 計算機概論
        PROG_SPEC_NS_INFO_ENG_PARAM,  # 基礎電機電子
        PROG_SPEC_NS_INFO_ENG_PARAM,  # 程式設計
        PROG_SPEC_NS_INFO_ENG_PARAM,  # computer architecture
        PROG_SPEC_NS_INFO_ENG_PARAM,  # software engineering
        PROG_SPEC_NS_INFO_ENG_PARAM,  # 資料庫
        PROG_SPEC_NS_INFO_ENG_PARAM,  # 作業系統
        PROG_SPEC_NS_INFO_ENG_PARAM,  # 電腦網路
        PROG_SPEC_NS_INFO_ENG_PARAM,  # 數理邏輯
        PROG_SPEC_NS_INFO_ENG_PARAM,  # 正規方法
        PROG_SPEC_NS_INFO_ENG_PARAM,  # 函數程式
        PROG_SPEC_NS_INFO_ENG_PARAM,  # 演算法 資料結構
        PROG_SPEC_NS_INFO_ENG_PARAM,  # 可運算度 複雜度
        PROG_SPEC_MATH_PARAM,  # 離散
        PROG_SPEC_MATH_PARAM,  # 線性代數
        PROG_SPEC_MATH_PARAM,  # 數值分析
        PROG_SPEC_MATH_PARAM,  # 微積分 分析
        PROG_SPEC_MATH_PARAM,  # 機率
        PROG_SPEC_NS_INFO_ENG_PARAM,  # 進階資工
        PROG_SPEC_NS_INFO_ENG_PARAM,  # 物理化學工程
        PROG_SPEC_BA_BI_PARAM,  # 商管經
        PROG_SPEC_OTHERS,  # 其他
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


# Requirement:
def UNI_GOETTINGEN_APPLIED_CS(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'UNI_GOETTINGEN_APPLIED_CS'
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
    PROG_SPEC_INFO_PARAM = {
        'Program_Category': 'Fundamental CS', 'Required_ECTS': 16}  # Calculus, Linear Algebra, Probability Theory and Statistics
    PROG_SPEC_MATH_NS_ENG_PARAM = {
        # natural science, Engineering
        'Program_Category': 'Mathematics, Natural Science or Engineering', 'Required_ECTS': 15}
    PROG_SPEC_ADV_CS_MATH_PARAM = {
        # BA, BI
        'Program_Category': 'Advanced CS and Math(can also be fundamental)', 'Required_ECTS': 15}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_INFO_PARAM,  # 數學
        PROG_SPEC_MATH_NS_ENG_PARAM,  # natural science Informatik, Engineering
        PROG_SPEC_ADV_CS_MATH_PARAM,  # BA, BI,
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_INFO_PARAM,  # 計算機概論
        PROG_SPEC_MATH_NS_ENG_PARAM,  # 基礎電機電子
        PROG_SPEC_INFO_PARAM,  # 程式設計
        PROG_SPEC_INFO_PARAM,  # computer architecture
        PROG_SPEC_INFO_PARAM,  # software engineering
        PROG_SPEC_INFO_PARAM,  # 資料庫
        PROG_SPEC_INFO_PARAM,  # 作業系統
        PROG_SPEC_INFO_PARAM,  # 電腦網路
        PROG_SPEC_INFO_PARAM,  # 數理邏輯
        PROG_SPEC_ADV_CS_MATH_PARAM,  # 正規方法
        PROG_SPEC_ADV_CS_MATH_PARAM,  # 函數程式
        PROG_SPEC_INFO_PARAM,  # 演算法 資料結構
        PROG_SPEC_ADV_CS_MATH_PARAM,  # 可運算度 複雜度
        PROG_SPEC_MATH_NS_ENG_PARAM,  # 離散
        PROG_SPEC_MATH_NS_ENG_PARAM,  # 線性代數
        PROG_SPEC_MATH_NS_ENG_PARAM,  # 數值分析
        PROG_SPEC_MATH_NS_ENG_PARAM,  # 微積分 分析
        PROG_SPEC_MATH_NS_ENG_PARAM,  # 機率
        PROG_SPEC_ADV_CS_MATH_PARAM,  # 進階資工
        PROG_SPEC_MATH_NS_ENG_PARAM,  # 物理化學工程
        PROG_SPEC_OTHERS,  # 商管經
        PROG_SPEC_OTHERS,  # 其他
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

# FPSO: https://www.tum.de/fileadmin/user_upload_87/gi32rab/FPSO/Mathematics_Data_Science_MA_Final_27082021.pdf


def TUM_MATH_DATA_SCI_MATH_BACKGROUND(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'TUM_MATH_DATA_SCI(Math BG)'
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
        # Math
        'Program_Category': 'Mathematics', 'Required_ECTS': 55}
    PROG_SPEC_INFO_PARAM = {
        'Program_Category': 'Fundamental CS', 'Required_ECTS': 18}  # Calculus, Linear Algebra, Probability Theory and Statistics
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_INFO_PARAM,  # Basic CS
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_INFO_PARAM,  # 計算機概論
        PROG_SPEC_OTHERS,  # 基礎電機電子
        PROG_SPEC_INFO_PARAM,  # 程式設計
        PROG_SPEC_INFO_PARAM,  # computer architecture
        PROG_SPEC_INFO_PARAM,  # software engineering
        PROG_SPEC_INFO_PARAM,  # 資料庫
        PROG_SPEC_INFO_PARAM,  # 作業系統
        PROG_SPEC_INFO_PARAM,  # 電腦網路
        PROG_SPEC_MATH_PARAM,  # 數理邏輯
        PROG_SPEC_INFO_PARAM,  # 正規方法
        PROG_SPEC_INFO_PARAM,  # 函數程式
        PROG_SPEC_INFO_PARAM,  # 演算法 資料結構
        PROG_SPEC_INFO_PARAM,  # 可運算度 複雜度
        PROG_SPEC_MATH_PARAM,  # 離散
        PROG_SPEC_MATH_PARAM,  # 線性代數
        PROG_SPEC_MATH_PARAM,  # 數值分析
        PROG_SPEC_MATH_PARAM,  # 微積分 分析
        PROG_SPEC_MATH_PARAM,  # 機率
        PROG_SPEC_INFO_PARAM,  # 進階資工
        PROG_SPEC_OTHERS,  # 物理化學工程
        PROG_SPEC_OTHERS,  # 商管經
        PROG_SPEC_OTHERS,  # 其他
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


def TUM_MATH_DATA_SCI_CS_BACKGROUND(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'TUM_MATH_DATA_SCI(CS BG)'
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
        # Math
        'Program_Category': 'Mathematics', 'Required_ECTS': 35}
    PROG_SPEC_INFO_PARAM = {
        'Program_Category': 'Fundamental CS', 'Required_ECTS': 18}  # Calculus, Linear Algebra, Probability Theory and Statistics
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_INFO_PARAM,  # Basic CS
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_INFO_PARAM,  # 計算機概論
        PROG_SPEC_OTHERS,  # 基礎電機電子
        PROG_SPEC_INFO_PARAM,  # 程式設計
        PROG_SPEC_INFO_PARAM,  # computer architecture
        PROG_SPEC_INFO_PARAM,  # software engineering
        PROG_SPEC_INFO_PARAM,  # 資料庫
        PROG_SPEC_INFO_PARAM,  # 作業系統
        PROG_SPEC_INFO_PARAM,  # 電腦網路
        PROG_SPEC_MATH_PARAM,  # 數理邏輯
        PROG_SPEC_INFO_PARAM,  # 正規方法
        PROG_SPEC_INFO_PARAM,  # 函數程式
        PROG_SPEC_INFO_PARAM,  # 演算法 資料結構
        PROG_SPEC_INFO_PARAM,  # 可運算度 複雜度
        PROG_SPEC_MATH_PARAM,  # 離散
        PROG_SPEC_MATH_PARAM,  # 線性代數
        PROG_SPEC_MATH_PARAM,  # 數值分析
        PROG_SPEC_MATH_PARAM,  # 微積分 分析
        PROG_SPEC_MATH_PARAM,  # 機率
        PROG_SPEC_INFO_PARAM,  # 進階資工
        PROG_SPEC_OTHERS,  # 物理化學工程
        PROG_SPEC_OTHERS,  # 商管經
        PROG_SPEC_OTHERS,  # 其他
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


program_sort_function = [TUM_CS,
                         RWTH_DATA_SCIENCE_CS_BG,
                         RWTH_DATA_SCIENCE_MATH_BG,
                         RWTH_SOFTWARE_SYS_ENG,
                         RWTH_MEDIA_INFO,
                         FU_BERLIN_DATA_SCIENCE,
                         TU_BERLIN_COMPUTER_SCIENCE,
                         TUM_DATA_ENGINEERING_ANALYTICS,
                         TU_Delft_CS,
                         RWTH_DDS,
                         RWTH_TIME,
                         UNI_GOETTINGEN_APPLIED_CS,
                         TUM_MATH_DATA_SCI_MATH_BACKGROUND,
                         TUM_MATH_DATA_SCI_CS_BACKGROUND]


def CS_sorter(program_idx, file_path, abbrev, Generated_Version):

    basic_classification_en = {
        '基礎資工': [CS_INTRO_INFO_KEY_WORDS_EN, CS_INTRO_INFO_ANTI_KEY_WORDS_EN, ['一', '二']],
        '基礎電機電子': [CS_INTRO_ELEKTROTECHNIK_KEY_WORDS_EN, CS_INTRO_ELEKTROTECHNIK_ANTI_KEY_WORDS_EN, ['一', '二']],
        '程式設計': [CS_PROGRAMMING_KEY_WORDS_EN, CS_PROGRAMMING_ANTI_KEY_WORDS_EN, ['一', '二']],
        '電腦結構': [CS_COMP_ARCH_KEY_WORDS_EN, CS_COMP_ARCH_ANTI_KEY_WORDS_EN, ['一', '二']],
        '軟體工程': [CS_SWE_KEY_WORDS_EN, CS_SWE_ANTI_KEY_WORDS_EN],
        '資料庫': [CS_DB_KEY_WORDS_EN, CS_DB_ANTI_KEY_WORDS_EN],
        '作業系統': [CS_OS_KEY_WORDS_EN, CS_OS_ANTI_KEY_WORDS_EN],
        '電腦網絡': [CS_COMP_NETW_KEY_WORDS_EN, CS_COMP_NETW_ANTI_KEY_WORDS_EN],
        '數理邏輯': [CS_MATH_LOGIC_KEY_WORDS_EN, CS_MATH_LOGIC_PROG_ANTI_KEY_WORDS_EN],
        '正規方法': [CS_FORMAL_METHOD_KEY_WORDS_EN, CS_FORMAL_METHOD_ANTI_KEY_WORDS_EN],
        '函式程式': [CS_FUNC_PROG_KEY_WORDS_EN, CS_FUNC_PROG_ANTI_KEY_WORDS_EN],
        '資料結構演算法': [CS_ALGO_DATA_STRUCT_KEY_WORDS_EN, CS_ALGO_DATA_STRUCT_ANTI_KEY_WORDS_EN],
        '理論資工': [CS_THEORY_COMP_KEY_WORDS_EN, CS_THEORY_COMP_ANTI_KEY_WORDS_EN],
        '離散': [CS_MATH_DISCRETE_KEY_WORDS_EN, CS_MATH_DISCRETE_ANTI_KEY_WORDS_EN],
        '線性代數': [CS_MATH_LIN_ALGE_KEY_WORDS_EN, CS_MATH_LIN_ALGE_ANTI_KEY_WORDS_EN],
        '數值分析': [CS_MATH_NUM_METHOD_KEY_WORDS_EN, CS_MATH_NUM_METHOD_ANTI_KEY_WORDS_EN],
        '微積分': [CS_CALCULUS_KEY_WORDS_EN, CS_CALCULUS_ANTI_KEY_WORDS_EN, ['一', '二']],
        '機率': [CS_MATH_PROB_KEY_WORDS_EN, CS_MATH_PROB_ANTI_KEY_WORDS_EN],
        '進階資工': [CS_ADVANCED_INFO_KEY_WORDS_EN, CS_ADVANCED_INFO_ANTI_KEY_WORDS_EN],
        '物理化學工程': [CS_PHY_CHEM_NS_ENG_KEY_WORDS_EN, CS_PHY_CHEM_NS_ENG_ANTI_KEY_WORDS_EN],
        '商管經': [CS_BA_BI_ENG_KEY_WORDS_EN, CS_BA_BI_ENG_ANTI_KEY_WORDS_EN],
        '其他': [USELESS_COURSES_KEY_WORDS_EN, USELESS_COURSES_ANTI_KEY_WORDS_EN], }

    basic_classification_zh = {
        '基礎資工': [CS_INTRO_INFO_KEY_WORDS, CS_INTRO_INFO_ANTI_KEY_WORDS, ['一', '二']],
        '基礎電機電子': [CS_INTRO_ELEKTROTECHNIK_KEY_WORDS, CS_INTRO_ELEKTROTECHNIK_ANTI_KEY_WORDS, ['一', '二']],
        '程式設計': [CS_PROGRAMMING_KEY_WORDS, CS_PROGRAMMING_ANTI_KEY_WORDS, ['一', '二']],
        '電腦結構': [CS_COMP_ARCH_KEY_WORDS, CS_COMP_ARCH_ANTI_KEY_WORDS, ['一', '二']],
        '軟體工程': [CS_SWE_KEY_WORDS, CS_SWE_ANTI_KEY_WORDS],
        '資料庫': [CS_DB_KEY_WORDS, CS_DB_ANTI_KEY_WORDS],
        '作業系統': [CS_OS_KEY_WORDS, CS_OS_ANTI_KEY_WORDS],
        '電腦網絡': [CS_COMP_NETW_KEY_WORDS, CS_COMP_NETW_ANTI_KEY_WORDS],
        '數理邏輯': [CS_MATH_LOGIC_KEY_WORDS, CS_MATH_LOGIC_PROG_ANTI_KEY_WORDS],
        '正規方法': [CS_FORMAL_METHOD_KEY_WORDS, CS_FORMAL_METHOD_ANTI_KEY_WORDS],
        '函式程式': [CS_FUNC_PROG_KEY_WORDS, CS_FUNC_PROG_ANTI_KEY_WORDS],
        '資料結構演算法': [CS_ALGO_DATA_STRUCT_KEY_WORDS, CS_ALGO_DATA_STRUCT_ANTI_KEY_WORDS],
        '理論資工': [CS_THEORY_COMP_KEY_WORDS, CS_THEORY_COMP_ANTI_KEY_WORDS],
        '離散': [CS_MATH_DISCRETE_KEY_WORDS, CS_MATH_DISCRETE_ANTI_KEY_WORDS],
        '線性代數': [CS_MATH_LIN_ALGE_KEY_WORDS, CS_MATH_LIN_ALGE_ANTI_KEY_WORDS],
        '數值分析': [CS_MATH_NUM_METHOD_KEY_WORDS, CS_MATH_NUM_METHOD_ANTI_KEY_WORDS],
        '微積分': [CS_CALCULUS_KEY_WORDS, CS_CALCULUS_ANTI_KEY_WORDS, ['一', '二']],
        '機率': [CS_MATH_PROB_KEY_WORDS, CS_MATH_PROB_ANTI_KEY_WORDS],
        '進階資工': [CS_ADVANCED_INFO_KEY_WORDS, CS_ADVANCED_INFO_ANTI_KEY_WORDS],
        '物理化學工程': [CS_PHY_CHEM_NS_ENG_KEY_WORDS, CS_PHY_CHEM_NS_ENG_ANTI_KEY_WORDS],
        '商管經': [CS_BA_BI_ENG_KEY_WORDS, CS_BA_BI_ENG_ANTI_KEY_WORDS],
        '其他': [USELESS_COURSES_KEY_WORDS, USELESS_COURSES_ANTI_KEY_WORDS], }

    Classifier(program_idx, file_path, abbrev, env_file_path,
               basic_classification_en, basic_classification_zh, column_len_array, program_sort_function, Generated_Version)

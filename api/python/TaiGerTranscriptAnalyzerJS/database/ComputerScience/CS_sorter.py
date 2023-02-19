import xlsxwriter
from CourseSuggestionAlgorithms import *
from util import *
from database.ComputerScience.CS_KEYWORDS import *
from database.ComputerScience.CS_Programs import program_sort_function, column_len_array
from cell_formatter import red_out_failed_subject, red_out_insufficient_credit
import pandas as pd
import sys
import os
env_file_path = os.path.realpath(__file__)
env_file_path = os.path.dirname(env_file_path)


def CS_sorter(program_idx, file_path, abbrev, studentId, student_name, analysis_language):

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
        '圖論': [CS_MATH_GRAPH_THEORY_KEY_WORDS_EN, CS_MATH_GRAPH_THEORY_ANTI_KEY_WORDS_EN],
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
        '圖論': [CS_MATH_GRAPH_THEORY_KEY_WORDS, CS_MATH_GRAPH_THEORY_ANTI_KEY_WORDS],
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
               basic_classification_en, basic_classification_zh, column_len_array, program_sort_function, studentId, student_name, analysis_language)

import xlsxwriter
from CourseSuggestionAlgorithms import *
from util import *
from keywords import *
from database.MaterialsScience.MTL_Programs import program_sort_function, column_len_array
from cell_formatter import red_out_failed_subject, red_out_insufficient_credit
import pandas as pd
import sys
import os
env_file_path = os.path.realpath(__file__)
env_file_path = os.path.dirname(env_file_path)


def MTL_sorter(program_idx, file_path, abbrev, studentId, student_name, analysis_language):

    basic_classification_en = {
        '離散': [MTL_MATH_DISCRETE_KEY_WORDS_EN, MTL_MATH_DISCRETE_ANTI_KEY_WORDS_EN],
        '線性代數': [MATH_LINEAR_ALGEBRA_KEY_WORDS_EN, MATH_LINEAR_ALGEBRA_ANTI_KEY_WORDS_EN],
        '數值分析': [MATH_NUM_METHOD_KEY_WORDS_EN, MATH_NUM_METHOD_ANTI_KEY_WORDS_EN],
        '微積分': [CALCULUS_KEY_WORDS_EN, CALCULUS_ANTI_KEY_WORDS_EN, ['一', '二']],
        '數學': [ME_MATH_KEY_WORDS_EN, ME_MATH_ANTI_KEY_WORDS_EN],
        '物理': [GENERAL_PHYSICS_KEY_WORDS_EN, GENERAL_PHYSICS_ANTI_KEY_WORDS_EN, ['一', '二']],
        '物理實驗': [PHYSICS_EXP_KEY_WORDS_EN, PHYSICS_EXP_ANTI_KEY_WORDS_EN, ['一', '二']],
        '化學': [MTL_CHEMISTRY_KEY_WORDS_EN, MTL_CHEMISTRY_ANTI_KEY_WORDS_EN, ['一', '二']],
        '化學實驗': [MTL_CHEMISTRY_EXP_KEY_WORDS_EN, MTL_CHEMISTRY_EXP_ANTI_KEY_WORDS_EN, ['一', '二']],
        '無機化學': [INORGANIC_CHEMISTRY_KEY_WORDS_EN, INORGANIC_CHEMISTRY_ANTI_KEY_WORDS_EN, ['一', '二']],
        '物理化學': [PHYSICAL_CHEMISTRYY_KEY_WORDS_EN, PHYSICAL_CHEMISTRYY_ANTI_KEY_WORDS_EN, ['一', '二']],
        '材料': [WERKSTOFFKUNDE_KEY_WORDS_EN, WERKSTOFFKUNDE_ANTI_KEY_WORDS_EN, ['一', '二']],
        '控制': [CONTROL_THEORY_KEY_WORDS_EN, CONTROL_THEORY_ANTI_KEY_WORDS_EN, ['一', '二']],
        '力學': [MECHANIK_KEY_WORDS_EN, MECHANIK_ANTI_KEY_WORDS_EN, ['一', '二']],
        '熱力學': [THERMODYN_KEY_WORDS_EN, THERMODYN_ANTI_KEY_WORDS_EN, ['一', '二']],
        '流體力學': [FLUIDDYN_KEY_WORDS_EN, FLUIDDYN_ANTI_KEY_WORDS_EN, ['一', '二']],
        '電子': [ELECTRONICS_KEY_WORDS_EN, ELECTRONICS_ANTI_KEY_WORDS_EN, ['一', '二']],
        '電路': [ELECTRO_CIRCUIT_KEY_WORDS_EN, ELECTRO_CIRCUIT_ANTI_KEY_WORDS_EN, ['一', '二']],
        '其他': [USELESS_COURSES_KEY_WORDS_EN, USELESS_COURSES_ANTI_KEY_WORDS_EN], }

    basic_classification_zh = {
        '離散': [MTL_MATH_DISCRETE_KEY_WORDS, MTL_MATH_DISCRETE_ANTI_KEY_WORDS],
        '線性代數': [MATH_LINEAR_ALGEBRA_KEY_WORDS, MATH_LINEAR_ALGEBRA_ANTI_KEY_WORDS],
        '數值分析': [MATH_NUM_METHOD_KEY_WORDS, MATH_NUM_METHOD_ANTI_KEY_WORDS],
        '微積分': [CALCULUS_KEY_WORDS, CALCULUS_ANTI_KEY_WORDS, ['一', '二']],
        '數學': [ME_MATH_KEY_WORDS, ME_MATH_ANTI_KEY_WORDS],
        '物理': [GENERAL_PHYSICS_KEY_WORDS, GENERAL_PHYSICS_ANTI_KEY_WORDS, ['一', '二']],
        '物理實驗': [PHYSICS_EXP_KEY_WORDS, PHYSICS_EXP_ANTI_KEY_WORDS, ['一', '二']],
        '化學': [MTL_CHEMISTRY_KEY_WORDS, MTL_CHEMISTRY_ANTI_KEY_WORDS, ['一', '二']],
        '化學實驗': [MTL_CHEMISTRY_EXP_KEY_WORDS, MTL_CHEMISTRY_EXP_ANTI_KEY_WORDS, ['一', '二']],
        '無機化學': [INORGANIC_CHEMISTRY_KEY_WORDS, INORGANIC_CHEMISTRY_ANTI_KEY_WORDS, ['一', '二']],
        '物理化學': [PHYSICAL_CHEMISTRYY_KEY_WORDS, PHYSICAL_CHEMISTRYY_ANTI_KEY_WORDS, ['一', '二']],
        '材料': [WERKSTOFFKUNDE_KEY_WORDS, WERKSTOFFKUNDE_ANTI_KEY_WORDS, ['一', '二']],
        '控制': [CONTROL_THEORY_KEY_WORDS, CONTROL_THEORY_ANTI_KEY_WORDS, ['一', '二']],
        '力學': [MECHANIK_KEY_WORDS, MECHANIK_ANTI_KEY_WORDS, ['一', '二']],
        '熱力學': [THERMODYN_KEY_WORDS, THERMODYN_ANTI_KEY_WORDS, ['一', '二']],
        '流體力學': [FLUIDDYN_KEY_WORDS, FLUIDDYN_ANTI_KEY_WORDS, ['一', '二']],
        '電子': [ELECTRONICS_KEY_WORDS, ELECTRONICS_ANTI_KEY_WORDS, ['一', '二']],
        '電路': [ELECTRO_CIRCUIT_KEY_WORDS, ELECTRO_CIRCUIT_ANTI_KEY_WORDS, ['一', '二']],
        '其他': [USELESS_COURSES_KEY_WORDS, USELESS_COURSES_ANTI_KEY_WORDS], }

    Classifier(program_idx, file_path, abbrev, env_file_path,
               basic_classification_en, basic_classification_zh, column_len_array, program_sort_function, studentId, student_name, analysis_language)

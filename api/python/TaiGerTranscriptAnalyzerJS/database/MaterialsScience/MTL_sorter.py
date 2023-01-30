import xlsxwriter
from CourseSuggestionAlgorithms import *
from util import *
from database.MaterialsScience.MTL_KEYWORDS import *
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
        '線性代數': [MTL_MATH_LIN_ALGE_KEY_WORDS_EN, MTL_MATH_LIN_ALGE_ANTI_KEY_WORDS_EN],
        '數值分析': [MTL_MATH_NUM_METHOD_KEY_WORDS_EN, MTL_MATH_NUM_METHOD_ANTI_KEY_WORDS_EN],
        '微積分': [MTL_CALCULUS_KEY_WORDS_EN, MTL_CALCULUS_ANTI_KEY_WORDS_EN, ['一', '二']],
        '數學': [MTL_MATH_KEY_WORDS_EN, MTL_MATH_ANTI_KEY_WORDS_EN],
        '物理': [MTL_PHYSICS_KEY_WORDS_EN, MTL_PHYSICS_ANTI_KEY_WORDS_EN, ['一', '二']],
        '物理實驗': [MTL_PHYSICS_EXP_KEY_WORDS_EN, MTL_PHYSICS_EXP_ANTI_KEY_WORDS_EN, ['一', '二']],
        '化學': [MTL_CHEMISTRY_KEY_WORDS_EN, MTL_CHEMISTRY_ANTI_KEY_WORDS_EN, ['一', '二']],
        '化學實驗': [MTL_CHEMISTRY_EXP_KEY_WORDS_EN, MTL_CHEMISTRY_EXP_ANTI_KEY_WORDS_EN, ['一', '二']],
        '無機化學': [MTL_INORGANIC_CHEMISTRY_KEY_WORDS_EN, MTL_INORGANIC_CHEMISTRY_ANTI_KEY_WORDS_EN, ['一', '二']],
        '物理化學': [MTL_PHYSIK_CHEMISTRY_KEY_WORDS_EN, MTL_PHYSIK_CHEMISTRY_ANTI_KEY_WORDS_EN, ['一', '二']],
        '材料': [MTL_WERKSTOFFKUNDE_KEY_WORDS_EN, MTL_WERKSTOFFKUNDE_ANTI_KEY_WORDS_EN, ['一', '二']],
        '控制': [MTL_CONTROL_THEORY_KEY_WORDS_EN, MTL_CONTROL_THEORY_ANTI_KEY_WORDS_EN, ['一', '二']],
        '力學': [MTL_MECHANIK_KEY_WORDS_EN, MTL_MECHANIK_ANTI_KEY_WORDS_EN, ['一', '二']],
        '熱力學': [MTL_THERMODYN_KEY_WORDS_EN, MTL_THERMODYN_ANTI_KEY_WORDS_EN, ['一', '二']],
        '流體力學': [MTL_FLUIDDYN_KEY_WORDS_EN, MTL_FLUIDDYN_ANTI_KEY_WORDS_EN, ['一', '二']],
        '電子': [MTL_ELECTRONICS_KEY_WORDS_EN, MTL_ELECTRONICS_ANTI_KEY_WORDS_EN, ['一', '二']],
        '電路': [MTL_ELECTRO_CIRCUIT_KEY_WORDS_EN, MTL_ELECTRO_CIRCUIT_ANTI_KEY_WORDS_EN, ['一', '二']],
        '其他': [USELESS_COURSES_KEY_WORDS_EN, USELESS_COURSES_ANTI_KEY_WORDS_EN], }

    basic_classification_zh = {
        '離散': [MTL_MATH_DISCRETE_KEY_WORDS, MTL_MATH_DISCRETE_ANTI_KEY_WORDS],
        '線性代數': [MTL_MATH_LIN_ALGE_KEY_WORDS, MTL_MATH_LIN_ALGE_ANTI_KEY_WORDS],
        '數值分析': [MTL_MATH_NUM_METHOD_KEY_WORDS, MTL_MATH_NUM_METHOD_ANTI_KEY_WORDS],
        '微積分': [MTL_CALCULUS_KEY_WORDS, MTL_CALCULUS_ANTI_KEY_WORDS, ['一', '二']],
        '數學': [MTL_MATH_KEY_WORDS, MTL_MATH_ANTI_KEY_WORDS],
        '物理': [MTL_PHYSICS_KEY_WORDS, MTL_PHYSICS_ANTI_KEY_WORDS, ['一', '二']],
        '物理實驗': [MTL_PHYSICS_EXP_KEY_WORDS, MTL_PHYSICS_EXP_ANTI_KEY_WORDS, ['一', '二']],
        '化學': [MTL_CHEMISTRY_KEY_WORDS, MTL_CHEMISTRY_ANTI_KEY_WORDS, ['一', '二']],
        '化學實驗': [MTL_CHEMISTRY_EXP_KEY_WORDS, MTL_CHEMISTRY_EXP_ANTI_KEY_WORDS, ['一', '二']],
        '無機化學': [MTL_INORGANIC_CHEMISTRY_KEY_WORDS, MTL_INORGANIC_CHEMISTRY_ANTI_KEY_WORDS, ['一', '二']],
        '物理化學': [MTL_PHYSIK_CHEMISTRY_KEY_WORDS, MTL_PHYSIK_CHEMISTRY_ANTI_KEY_WORDS, ['一', '二']],
        '材料': [MTL_WERKSTOFFKUNDE_KEY_WORDS, MTL_WERKSTOFFKUNDE_ANTI_KEY_WORDS, ['一', '二']],
        '控制': [MTL_CONTROL_THEORY_KEY_WORDS, MTL_CONTROL_THEORY_ANTI_KEY_WORDS, ['一', '二']],
        '力學': [MTL_MECHANIK_KEY_WORDS, MTL_MECHANIK_ANTI_KEY_WORDS, ['一', '二']],
        '熱力學': [MTL_THERMODYN_KEY_WORDS, MTL_THERMODYN_ANTI_KEY_WORDS, ['一', '二']],
        '流體力學': [MTL_FLUIDDYN_KEY_WORDS, MTL_FLUIDDYN_ANTI_KEY_WORDS, ['一', '二']],
        '電子': [MTL_ELECTRONICS_KEY_WORDS, MTL_ELECTRONICS_ANTI_KEY_WORDS, ['一', '二']],
        '電路': [MTL_ELECTRO_CIRCUIT_KEY_WORDS, MTL_ELECTRO_CIRCUIT_ANTI_KEY_WORDS, ['一', '二']],
        '其他': [USELESS_COURSES_KEY_WORDS, USELESS_COURSES_ANTI_KEY_WORDS], }

    Classifier(program_idx, file_path, abbrev, env_file_path,
               basic_classification_en, basic_classification_zh, column_len_array, program_sort_function, studentId, student_name, analysis_language)

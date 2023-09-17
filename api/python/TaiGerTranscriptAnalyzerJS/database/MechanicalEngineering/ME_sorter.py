import xlsxwriter
from CourseSuggestionAlgorithms import *
from util import *
from keywords import *
from database.MechanicalEngineering.ME_Programs import program_sort_function, column_len_array
from cell_formatter import red_out_failed_subject, red_out_insufficient_credit
import pandas as pd
import sys
import os
env_file_path = os.path.realpath(__file__)
env_file_path = os.path.dirname(env_file_path)

def ME_sorter(program_idx, file_path, abbrev, studentId, student_name, analysis_language):

    basic_classification_en = {
            '微積分': [CALCULUS_KEY_WORDS_EN, CALCULUS_ANTI_KEY_WORDS_EN, ['一', '二']],
            '線性代數': [MATH_LINEAR_ALGEBRA_KEY_WORDS_EN, MATH_LINEAR_ALGEBRA_ANTI_KEY_WORDS_EN],
            '微分方程': [DIFF_EQUATION_KEY_WORDS_EN, DIFF_EQUATION_ANTI_KEY_WORDS_EN],
            '數學': [ME_MATH_KEY_WORDS_EN, ME_MATH_ANTI_KEY_WORDS_EN],
            '物理': [GENERAL_PHYSICS_KEY_WORDS_EN, GENERAL_PHYSICS_ANTI_KEY_WORDS_EN, ['一', '二']],
            '物理實驗': [ME_PHYSICS_EXP_KEY_WORDS_EN, ME_PHYSICS_EXP_ANTI_KEY_WORDS_EN, ['一', '二']],
            '機械設計': [MASCHINENGESTALTUNG_KEY_WORDS_EN, MASCHINENGESTALTUNG_ANTI_KEY_WORDS_EN, ['一', '二']],
            '機構': [MASCHINEN_ELEMENTE_KEY_WORDS_EN, MASCHINEN_ELEMENTE_ANTI_KEY_WORDS_EN, ['一', '二']],
            '熱力學': [ME_THERMODYN_KEY_WORDS_EN, ME_THERMODYN_ANTI_KEY_WORDS_EN, ['一', '二']],
            '熱傳導': [ME_WARMTRANSPORT_KEY_WORDS_EN, ME_WARMTRANSPORT_ANTI_KEY_WORDS_EN, ['一', '二']],
            '材料': [ME_WERKSTOFFKUNDE_KEY_WORDS_EN, ME_WERKSTOFFKUNDE_ANTI_KEY_WORDS_EN, ['一', '二']],
            '控制系統': [ME_CONTROL_THEORY_KEY_WORDS_EN, ME_CONTROL_THEORY_ANTI_KEY_WORDS_EN, ['一', '二']],
            '流體': [FLUIDDYN_KEY_WORDS_EN, FLUIDDYN_ANTI_KEY_WORDS_EN, ['一', '二']],
            '靜力學': [STATICS_KEY_WORDS_EN, STATICS_ANTI_KEY_WORDS_EN, ['一', '二']],
            '動力學': [DYNAMICS_KEY_WORDS_EN, DYNAMICS_ANTI_KEY_WORDS_EN, ['一', '二']],
            '材料力學': [MATERIALS_MECHANICS_KEY_WORDS_EN, MATERIALS_MECHANICS_ANTI_KEY_WORDS_EN, ['一', '二']],
            '基礎電機電子': [ME_ELECTRICAL_ENG_KEY_WORDS_EN, ME_ELECTRICAL_ENG_ANTI_KEY_WORDS_EN],
            '製造工程': [ME_MANUFACTURE_ENG_KEY_WORDS_EN, ME_MANUFACTURE_ENG_ANTI_KEY_WORDS_EN],
            '計算機概論': [ME_COMPUTER_SCIENCE_KEY_WORDS_EN, ME_COMPUTER_SCIENCE_ANTI_KEY_WORDS_EN],
            '機電': [ME_MECHATRONICS_KEY_WORDS_EN, ME_MECHATRONICS_ANTI_KEY_WORDS_EN],
            '測量': [ME_MEASUREMENT_KEY_WORDS_EN, ME_MEASUREMENT_ANTI_KEY_WORDS_EN],
            '車輛': [ME_VEHICLE_KEY_WORDS_EN, ME_VEHICLE_ANTI_KEY_WORDS_EN],
            '其他': [USELESS_COURSES_KEY_WORDS_EN, USELESS_COURSES_ANTI_KEY_WORDS_EN], }

    basic_classification_zh = {
            '微積分': [CALCULUS_KEY_WORDS, CALCULUS_ANTI_KEY_WORDS, ['一', '二']],
            '線性代數': [MATH_LINEAR_ALGEBRA_KEY_WORDS, MATH_LINEAR_ALGEBRA_ANTI_KEY_WORDS],
            '微分方程': [DIFF_EQUATION_KEY_WORDS, DIFF_EQUATION_ANTI_KEY_WORDS],
            '數學': [ME_MATH_KEY_WORDS, ME_MATH_ANTI_KEY_WORDS],
            '物理': [GENERAL_PHYSICS_KEY_WORDS, GENERAL_PHYSICS_ANTI_KEY_WORDS, ['一', '二']],
            '物理實驗': [ME_PHYSICS_EXP_KEY_WORDS, ME_PHYSICS_EXP_ANTI_KEY_WORDS, ['一', '二']],
            '機械設計': [MASCHINENGESTALTUNG_KEY_WORDS, MASCHINENGESTALTUNG_ANTI_KEY_WORDS, ['一', '二']],
            '機構': [MASCHINEN_ELEMENTE_KEY_WORDS, MASCHINEN_ELEMENTE_ANTI_KEY_WORDS, ['一', '二']],
            '熱力學': [ME_THERMODYN_KEY_WORDS, ME_THERMODYN_ANTI_KEY_WORDS, ['一', '二']],
            '熱傳導': [ME_WARMTRANSPORT_KEY_WORDS, ME_WARMTRANSPORT_ANTI_KEY_WORDS, ['一', '二']],
            '材料': [ME_WERKSTOFFKUNDE_KEY_WORDS, ME_WERKSTOFFKUNDE_ANTI_KEY_WORDS, ['一', '二']],
            '控制系統': [ME_CONTROL_THEORY_KEY_WORDS, ME_CONTROL_THEORY_ANTI_KEY_WORDS, ['一', '二']],
            '流體': [FLUIDDYN_KEY_WORDS, FLUIDDYN_ANTI_KEY_WORDS, ['一', '二']],
            '靜力學': [STATICS_KEY_WORDS, STATICS_ANTI_KEY_WORDS, ['一', '二']],
            '動力學': [DYNAMICS_KEY_WORDS, DYNAMICS_ANTI_KEY_WORDS, ['一', '二']],
            '材料力學': [MATERIALS_MECHANICS_KEY_WORDS, MATERIALS_MECHANICS_ANTI_KEY_WORDS, ['一', '二']],
            '基礎電機電子': [ME_ELECTRICAL_ENG_KEY_WORDS, ME_ELECTRICAL_ENG_ANTI_KEY_WORDS],
            '製造工程': [ME_MANUFACTURE_ENG_KEY_WORDS, ME_MANUFACTURE_ENG_ANTI_KEY_WORDS],
            '計算機概論': [ME_COMPUTER_SCIENCE_KEY_WORDS, ME_COMPUTER_SCIENCE_ANTI_KEY_WORDS],
            '機電': [ME_MECHATRONICS_KEY_WORDS, ME_MECHATRONICS_ANTI_KEY_WORDS],
            '測量': [ME_MEASUREMENT_KEY_WORDS, ME_MEASUREMENT_ANTI_KEY_WORDS],
            '車輛': [ME_VEHICLE_KEY_WORDS, ME_VEHICLE_ANTI_KEY_WORDS],
            '其他': [USELESS_COURSES_KEY_WORDS, USELESS_COURSES_ANTI_KEY_WORDS], }

    Classifier(program_idx, file_path, abbrev, env_file_path,
               basic_classification_en, basic_classification_zh, column_len_array, program_sort_function, studentId, student_name, analysis_language)

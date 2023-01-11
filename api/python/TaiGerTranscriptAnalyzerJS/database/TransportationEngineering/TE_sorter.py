import xlsxwriter
from CourseSuggestionAlgorithms import *
from util import *
from database.TransportationEngineering.TE_KEYWORDS import *
from database.TransportationEngineering.TE_Programs import program_sort_function, column_len_array
from cell_formatter import red_out_failed_subject, red_out_insufficient_credit
import pandas as pd
import sys
import os
env_file_path = os.path.realpath(__file__)
env_file_path = os.path.dirname(env_file_path)


def TE_sorter(program_idx, file_path, abbrev, studentId, student_name, analysis_language):

    basic_classification_en = {
        '微積分': [EE_CALCULUS_KEY_WORDS_EN, EE_CALCULUS_ANTI_KEY_WORDS_EN, ['一', '二']],
        '數學': [EE_MATH_KEY_WORDS_EN, EE_MATH_ANTI_KEY_WORDS_EN],
        '物理': [EE_PHYSICS_KEY_WORDS_EN, EE_PHYSICS_ANTI_KEY_WORDS_EN, ['一', '二']],
        '物理實驗': [EE_PHYSICS_EXP_KEY_WORDS_EN, EE_PHYSICS_EXP_ANTI_KEY_WORDS_EN, ['一', '二']],
        '資訊': [EE_INTRO_COMPUTER_SCIENCE_KEY_WORDS_EN, EE_INTRO_COMPUTER_SCIENCE_ANTI_KEY_WORDS_EN],
        '程式': [EE_PROGRAMMING_KEY_WORDS_EN, EE_PROGRAMMING_ANTI_KEY_WORDS_EN],
        '軟體工程': [EE_SOFTWARE_SYSTEM_KEY_WORDS_EN, EE_SOFTWARE_SYSTEM_ANTI_KEY_WORDS_EN],
        '控制系統': [EE_CONTROL_THEORY_KEY_WORDS_EN, EE_CONTROL_THEORY_ANTI_KEY_WORDS_EN],
        '電子': [EE_ELECTRONICS_KEY_WORDS_EN, EE_ELECTRONICS_ANTI_KEY_WORDS_EN, ['一', '二']],
        '電子實驗': [EE_ELECTRONICS_EXP_KEY_WORDS_EN, EE_ELECTRONICS_EXP_ANTI_KEY_WORDS_EN, ['一', '二']],
        '電路': [EE_ELECTRO_CIRCUIT_KEY_WORDS_EN, EE_ELECTRO_CIRCUIT_ANTI_KEY_WORDS_EN, ['一', '二']],
        '訊號系統': [EE_SIGNAL_SYSTEM_KEY_WORDS_EN, EE_SIGNAL_SYSTEM_ANTI_KEY_WORDS_EN],
        '電磁': [EE_ELECTRO_MAGNET_KEY_WORDS_EN, EE_ELECTRO_MAGNET_ANTI_KEY_WORDS_EN, ['一', '二']],
        '電力電子': [EE_POWER_ELECTRO_KEY_WORDS_EN, EE_POWER_ELECTRO_ANTI_KEY_WORDS_EN, ['一', '二']],
        '通訊': [EE_COMMUNICATION_KEY_WORDS_EN, EE_COMMUNICATION_ANTI_KEY_WORDS_EN, ['一', '二']],
        '半導體': [EE_SEMICONDUCTOR_KEY_WORDS_EN, EE_SEMICONDUCTOR_ANTI_KEY_WORDS_EN],
        '電機專業選修': [EE_ADVANCED_ELECTRO_KEY_WORDS_EN, EE_ADVANCED_ELECTRO_ANTI_KEY_WORDS_EN],
        '專業應用課程': [EE_APPLICATION_ORIENTED_KEY_WORDS_EN, EE_APPLICATION_ORIENTED_ANTI_KEY_WORDS_EN],
        '力學': [EE_MACHINE_RELATED_KEY_WORDS_EN, EE_MACHINE_RELATED_ANTI_KEY_WORDS_EN],
        '其他': [USELESS_COURSES_KEY_WORDS_EN, USELESS_COURSES_ANTI_KEY_WORDS_EN], }

    basic_classification_zh = {
        '微積分': [EE_CALCULUS_KEY_WORDS, EE_CALCULUS_ANTI_KEY_WORDS, ['一', '二']],
        '數學': [EE_MATH_KEY_WORDS, EE_MATH_ANTI_KEY_WORDS],
        '物理': [EE_PHYSICS_KEY_WORDS, EE_PHYSICS_ANTI_KEY_WORDS, ['一', '二']],
        '物理實驗': [EE_PHYSICS_EXP_KEY_WORDS, EE_PHYSICS_EXP_ANTI_KEY_WORDS, ['一', '二']],
        '資訊': [EE_INTRO_COMPUTER_SCIENCE_KEY_WORDS, EE_INTRO_COMPUTER_SCIENCE_ANTI_KEY_WORDS],
        '程式': [EE_PROGRAMMING_KEY_WORDS, EE_PROGRAMMING_ANTI_KEY_WORDS],
        '軟體工程': [EE_SOFTWARE_SYSTEM_KEY_WORDS, EE_SOFTWARE_SYSTEM_ANTI_KEY_WORDS],
        '控制系統': [EE_CONTROL_THEORY_KEY_WORDS, EE_CONTROL_THEORY_ANTI_KEY_WORDS],
        '電子': [EE_ELECTRONICS_KEY_WORDS, EE_ELECTRONICS_ANTI_KEY_WORDS, ['一', '二']],
        '電子實驗': [EE_ELECTRONICS_EXP_KEY_WORDS, EE_ELECTRONICS_EXP_ANTI_KEY_WORDS, ['一', '二']],
        '電路': [EE_ELECTRO_CIRCUIT_KEY_WORDS, EE_ELECTRO_CIRCUIT_ANTI_KEY_WORDS, ['一', '二']],
        '訊號系統': [EE_SIGNAL_SYSTEM_KEY_WORDS, EE_SIGNAL_SYSTEM_ANTI_KEY_WORDS],
        '電磁': [EE_ELECTRO_MAGNET_KEY_WORDS, EE_ELECTRO_MAGNET_ANTI_KEY_WORDS, ['一', '二']],
        '電力電子': [EE_POWER_ELECTRO_KEY_WORDS, EE_POWER_ELECTRO_ANTI_KEY_WORDS, ['一', '二']],
        '通訊': [EE_COMMUNICATION_KEY_WORDS, EE_COMMUNICATION_ANTI_KEY_WORDS, ['一', '二']],
        '半導體': [EE_SEMICONDUCTOR_KEY_WORDS, EE_SEMICONDUCTOR_ANTI_KEY_WORDS],
        '電機專業選修': [EE_ADVANCED_ELECTRO_KEY_WORDS, EE_ADVANCED_ELECTRO_ANTI_KEY_WORDS],
        '專業應用課程': [EE_APPLICATION_ORIENTED_KEY_WORDS, EE_APPLICATION_ORIENTED_ANTI_KEY_WORDS],
        '力學': [EE_MACHINE_RELATED_KEY_WORDS, EE_MACHINE_RELATED_ANTI_KEY_WORDS],
        '其他': [USELESS_COURSES_KEY_WORDS, USELESS_COURSES_ANTI_KEY_WORDS], }

    Classifier(program_idx, file_path, abbrev, env_file_path,
               basic_classification_en, basic_classification_zh, column_len_array, program_sort_function, studentId, student_name, analysis_language)

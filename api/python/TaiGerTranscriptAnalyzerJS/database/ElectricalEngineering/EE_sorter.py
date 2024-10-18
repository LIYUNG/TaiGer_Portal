import xlsxwriter
from CourseSuggestionAlgorithms import *
from util import *
from keywords import *
from database.ElectricalEngineering.EE_Programs import program_sort_function, column_len_array
from cell_formatter import red_out_failed_subject, red_out_insufficient_credit
import pandas as pd
import sys
import os
from db import get_keywords_collection, generate_classification

env_file_path = os.path.realpath(__file__)
env_file_path = os.path.dirname(env_file_path)


def EE_sorter(program_idx, file_path, abbrev, studentId, student_name, analysis_language):
    # Preprocess data to convert to desired structure
    processed_data = get_keywords_collection()

    # Mapping of Chinese and English subjects to their respective category names
    subjects = {
        '微積分': ('CALCULUS', ['一', '二']),
        '數學': ('ME_MATH', []),
        '物理': ('GENERAL_PHYSICS', ['一', '二']),
        '進階物理': ('EE_ADVANCED_PHYSICS', ['一', '二']),
        '物理實驗': ('PHYSICS_EXP', ['一', '二']),
        '資訊': ('EE_INTRO_COMPUTER_SCIENCE', []),
        '程式': ('PROGRAMMING_LANGUAGE', []),
        '軟體工程': ('SOFTWARE_ENGINEERING', []),
        '控制系統': ('CONTROL_THEORY', []),
        '電子': ('ELECTRONICS', ['一', '二']),
        '電子實驗': ('ELECTRONICS', ['一', '二']),
        '電路': ('ELECTRO_CIRCUIT', ['一', '二']),
        '訊號系統': ('SIGNAL_SYSTEM', []),
        '電磁': ('ELECTRO_MAGNET', ['一', '二']),
        '電力電子': ('POWER_ELECTRONICS', ['一', '二']),
        '通訊': ('COMMUNICATION_ENGINEERING', ['一', '二']),
        '半導體': ('SEMICONDUCTOR', []),
        '電子材料': ('ELECTRICAL_MATERIALS', []),
        '進階電磁理論': ('EE_HF_RF_THEO_INFO', []),
        '電機專業選修': ('EE_ADVANCED_ELECTRO', []),
        '專業應用課程': ('EE_APPLICATION_ORIENTED', []),
        '力學': ('EE_MACHINE_RELATED', []),
        '電路設計': ('ELECTRO_CIRCUIT_DESIGN', []),
        '其他': ('USELESS_COURSES', [])
    }

    # Generate classification dynamically
    basic_classification_en = generate_classification(
        'en', subjects, processed_data)
    basic_classification_zh = generate_classification(
        'zh', subjects, processed_data)

    Classifier(program_idx, file_path, abbrev, env_file_path,
               basic_classification_en, basic_classification_zh, column_len_array, program_sort_function, studentId, student_name, analysis_language)

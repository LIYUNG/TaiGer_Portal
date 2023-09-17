import xlsxwriter
from CourseSuggestionAlgorithms import *
from util import *
from keywords import *
from database.Management.MGM_Programs import program_sort_function, column_len_array
from cell_formatter import red_out_failed_subject, red_out_insufficient_credit
import pandas as pd
import sys
import os
env_file_path = os.path.realpath(__file__)
env_file_path = os.path.dirname(env_file_path)


def MGM_sorter(program_idx, file_path, abbrev, studentId, student_name, analysis_language):
    basic_classification_en = {
        '微積分': [CALCULUS_KEY_WORDS_EN, CALCULUS_ANTI_KEY_WORDS_EN],
        '數學': [MGM_MATH_KEY_WORDS_EN, MGM_MATH_ANTI_KEY_WORDS_EN],
        '經濟': [ECONOMICS_KEY_WORDS_EN, ECONOMICS_ANTI_KEY_WORDS_EN],
        '計量經濟': [ECONOMETRICS_KEY_WORDS_EN, ECONOMETRICS_ANTI_KEY_WORDS_EN],
        '企業': [BUSINESS_KEY_WORDS_EN, BUSINESS_ANTI_KEY_WORDS_EN],
        '管理': [MANAGEMENT_KEY_WORDS_EN, MANAGEMENT_ANTI_KEY_WORDS_EN],
        '會計': [ACCOUNTING_KEY_WORDS_EN, ACCOUNTING_ANTI_KEY_WORDS_EN],
        '統計': [STATISTICS_KEY_WORDS_EN, STATISTICS_ANTI_KEY_WORDS_EN],
        '金融': [FINANCE_KEY_WORDS_EN, FINANCE_ANTI_KEY_WORDS_EN],
        '行銷': [MGM_MARKETING_KEY_WORDS_EN, MGM_MARKETING_ANTI_KEY_WORDS_EN],
        '作業研究': [OP_RESEARCH_KEY_WORDS_EN, OP_RESEARCH_ANTI_KEY_WORDS_EN],
        '觀察研究': [EP_RESEARCH_KEY_WORDS_EN, EP_RESEARCH_ANTI_KEY_WORDS_EN],
        '基礎資工': [MGM_BASIC_CS_KEY_WORDS_EN, MGM_BASIC_CS_ANTI_KEY_WORDS_EN],
        '程式': [PROGRAMMING_LANGUAGE_KEY_WORDS_EN, PROGRAMMING_LANGUAGE_ANTI_KEY_WORDS_EN],
        '資料科學': [MGM_DATA_SCIENCE_KEY_WORDS_EN, MGM_DATA_SCIENCE_ANTI_KEY_WORDS_EN],
        '資訊系統': [BUSINESS_INFORMATIC_KEY_WORDS_EN, BUSINESS_INFORMATIC_ANTI_KEY_WORDS_EN],
        '永續': [SUSTAINABILITY_KEY_WORDS_EN, SUSTAINABILITY_ANTI_KEY_WORDS_EN],
        '論文': [BACHELOR_THESIS_KEY_WORDS_EN, BACHELOR_THESIS_ANTI_KEY_WORDS_EN],
        '其他': [USELESS_COURSES_KEY_WORDS_EN, USELESS_COURSES_ANTI_KEY_WORDS_EN], }

    basic_classification_zh = {
        '微積分': [CALCULUS_KEY_WORDS, CALCULUS_ANTI_KEY_WORDS],
        '數學': [MGM_MATH_KEY_WORDS, MGM_MATH_ANTI_KEY_WORDS],
        '經濟': [ECONOMICS_KEY_WORDS, ECONOMICS_ANTI_KEY_WORDS],
        '計量經濟': [ECONOMETRICS_KEY_WORDS, ECONOMETRICS_ANTI_KEY_WORDS],
        '企業': [BUSINESS_KEY_WORDS, BUSINESS_ANTI_KEY_WORDS],
        '管理': [MANAGEMENT_KEY_WORDS, MANAGEMENT_ANTI_KEY_WORDS],
        '會計': [ACCOUNTING_KEY_WORDS, ACCOUNTING_ANTI_KEY_WORDS],
        '統計': [STATISTICS_KEY_WORDS, STATISTICS_ANTI_KEY_WORDS],
        '金融': [FINANCE_KEY_WORDS, FINANCE_ANTI_KEY_WORDS],
        '行銷': [MGM_MARKETING_KEY_WORDS, MGM_MARKETING_ANTI_KEY_WORDS],
        '作業研究': [OP_RESEARCH_KEY_WORDS, OP_RESEARCH_ANTI_KEY_WORDS],
        '觀察研究': [EP_RESEARCH_KEY_WORDS, EP_RESEARCH_ANTI_KEY_WORDS],
        '基礎資工': [MGM_BASIC_CS_KEY_WORDS, MGM_BASIC_CS_ANTI_KEY_WORDS],
        '程式': [PROGRAMMING_LANGUAGE_KEY_WORDS, PROGRAMMING_LANGUAGE_ANTI_KEY_WORDS],
        '資料科學': [MGM_DATA_SCIENCE_KEY_WORDS, MGM_DATA_SCIENCE_ANTI_KEY_WORDS],
        '資訊系統': [BUSINESS_INFORMATIC_KEY_WORDS, BUSINESS_INFORMATIC_ANTI_KEY_WORDS],
        '永續': [SUSTAINABILITY_KEY_WORDS, SUSTAINABILITY_ANTI_KEY_WORDS],
        '論文': [BACHELOR_THESIS_KEY_WORDS, BACHELOR_THESIS_ANTI_KEY_WORDS],
        '其他': [USELESS_COURSES_KEY_WORDS, USELESS_COURSES_ANTI_KEY_WORDS], }

    Classifier(program_idx, file_path, abbrev, env_file_path,
               basic_classification_en, basic_classification_zh, column_len_array, program_sort_function, studentId, student_name, analysis_language)

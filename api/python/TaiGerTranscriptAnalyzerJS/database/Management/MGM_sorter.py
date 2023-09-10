import xlsxwriter
from CourseSuggestionAlgorithms import *
from util import *
from database.Management.MGM_KEYWORDS import *
from database.Management.MGM_Programs import program_sort_function, column_len_array
from cell_formatter import red_out_failed_subject, red_out_insufficient_credit
import pandas as pd
import sys
import os
env_file_path = os.path.realpath(__file__)
env_file_path = os.path.dirname(env_file_path)


def MGM_sorter(program_idx, file_path, abbrev, studentId, student_name, analysis_language):
    basic_classification_en = {
        '微積分': [MGM_CALCULUS_KEY_WORDS_EN, MGM_CALCULUS_ANTI_KEY_WORDS_EN],
        '數學': [MGM_MATH_KEY_WORDS_EN, MGM_MATH_ANTI_KEY_WORDS_EN],
        '經濟': [MGM_ECONOMICS_KEY_WORDS_EN, MGM_ECONOMICS_ANTI_KEY_WORDS_EN],
        '計量經濟': [MGM_ECONOMETRICS_KEY_WORDS_EN, MGM_ECONOMETRICS_ANTI_KEY_WORDS_EN],
        '企業': [MGM_BUSINESS_KEY_WORDS_EN, MGM_BUSINESS_ANTI_KEY_WORDS_EN],
        '管理': [MGM_MANAGEMENT_KEY_WORDS_EN, MGM_MANAGEMENT_ANTI_KEY_WORDS_EN],
        '會計': [MGM_ACCOUNTING_KEY_WORDS_EN, MGM_ACCOUNTING_ANTI_KEY_WORDS_EN],
        '統計': [MGM_STATISTICS_KEY_WORDS_EN, MGM_STATISTICS_ANTI_KEY_WORDS_EN],
        '金融': [MGM_FINANCE_KEY_WORDS_EN, MGM_FINANCE_ANTI_KEY_WORDS_EN],
        '行銷': [MGM_MARKETING_KEY_WORDS_EN, MGM_MARKETING_ANTI_KEY_WORDS_EN],
        '作業研究': [MGM_OP_RESEARCH_KEY_WORDS_EN, MGM_OP_RESEARCH_ANTI_KEY_WORDS_EN],
        '觀察研究': [MGM_EP_RESEARCH_KEY_WORDS_EN, MGM_EP_RESEARCH_ANTI_KEY_WORDS_EN],
        '基礎資工': [MGM_BASIC_CS_KEY_WORDS_EN, MGM_BASIC_CS_ANTI_KEY_WORDS_EN],
        '程式': [MGM_PROGRAMMING_KEY_WORDS_EN, MGM_PROGRAMMING_ANTI_KEY_WORDS_EN],
        '資料科學': [MGM_DATA_SCIENCE_KEY_WORDS_EN, MGM_DATA_SCIENCE_ANTI_KEY_WORDS_EN],
        '資訊系統': [MGM_BUSINESS_INFORMATIC_KEY_WORDS_EN, MGM_BUSINESS_INFORMATIC_ANTI_KEY_WORDS_EN],
        '永續': [MGM_SUSTAINABILITY_KEY_WORDS_EN, MGM_SUSTAINABILITY_ANTI_KEY_WORDS_EN],
        '論文': [MGM_BACHELOR_THESIS_KEY_WORDS_EN, MGM_BACHELOR_THESIS_ANTI_KEY_WORDS_EN],
        '其他': [USELESS_COURSES_KEY_WORDS_EN, USELESS_COURSES_ANTI_KEY_WORDS_EN], }

    basic_classification_zh = {
        '微積分': [MGM_CALCULUS_KEY_WORDS, MGM_CALCULUS_ANTI_KEY_WORDS],
        '數學': [MGM_MATH_KEY_WORDS, MGM_MATH_ANTI_KEY_WORDS],
        '經濟': [MGM_ECONOMICS_KEY_WORDS, MGM_ECONOMICS_ANTI_KEY_WORDS],
        '計量經濟': [MGM_ECONOMETRICS_KEY_WORDS, MGM_ECONOMETRICS_ANTI_KEY_WORDS],
        '企業': [MGM_BUSINESS_KEY_WORDS, MGM_BUSINESS_ANTI_KEY_WORDS],
        '管理': [MGM_MANAGEMENT_KEY_WORDS, MGM_MANAGEMENT_ANTI_KEY_WORDS],
        '會計': [MGM_ACCOUNTING_KEY_WORDS, MGM_ACCOUNTING_ANTI_KEY_WORDS],
        '統計': [MGM_STATISTICS_KEY_WORDS, MGM_STATISTICS_ANTI_KEY_WORDS],
        '金融': [MGM_FINANCE_KEY_WORDS, MGM_FINANCE_ANTI_KEY_WORDS],
        '行銷': [MGM_MARKETING_KEY_WORDS, MGM_MARKETING_ANTI_KEY_WORDS],
        '作業研究': [MGM_OP_RESEARCH_KEY_WORDS, MGM_OP_RESEARCH_ANTI_KEY_WORDS],
        '觀察研究': [MGM_EP_RESEARCH_KEY_WORDS, MGM_EP_RESEARCH_ANTI_KEY_WORDS],
        '基礎資工': [MGM_BASIC_CS_KEY_WORDS, MGM_BASIC_CS_ANTI_KEY_WORDS],
        '程式': [MGM_PROGRAMMING_KEY_WORDS, MGM_PROGRAMMING_ANTI_KEY_WORDS],
        '資料科學': [MGM_DATA_SCIENCE_KEY_WORDS, MGM_DATA_SCIENCE_ANTI_KEY_WORDS],
        '資訊系統': [MGM_BUSINESS_INFORMATIC_KEY_WORDS, MGM_BUSINESS_INFORMATIC_ANTI_KEY_WORDS],
        '永續': [MGM_SUSTAINABILITY_KEY_WORDS, MGM_SUSTAINABILITY_ANTI_KEY_WORDS],
        '論文': [MGM_BACHELOR_THESIS_KEY_WORDS, MGM_BACHELOR_THESIS_ANTI_KEY_WORDS],
        '其他': [USELESS_COURSES_KEY_WORDS, USELESS_COURSES_ANTI_KEY_WORDS], }

    Classifier(program_idx, file_path, abbrev, env_file_path,
               basic_classification_en, basic_classification_zh, column_len_array, program_sort_function, studentId, student_name, analysis_language)

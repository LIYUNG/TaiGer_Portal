import xlsxwriter
from CourseSuggestionAlgorithms import *
from util import *
from keywords import *
from database.Biology.BIO_Programs import program_sort_function, column_len_array
from cell_formatter import red_out_failed_subject, red_out_insufficient_credit
import pandas as pd
import sys
import os
env_file_path = os.path.realpath(__file__)
env_file_path = os.path.dirname(env_file_path)


def BIO_sorter(program_idx, file_path, abbrev, studentId, student_name, analysis_language):

    basic_classification_en = {
        '微積分': [BIO_CALCULUS_KEY_WORDS_EN, BIO_CALCULUS_ANTI_KEY_WORDS_EN],
        '線性代數': [BIO_MATH_LIN_ALGE_KEY_WORDS_EN, BIO_MATH_LIN_ALGE_ANTI_KEY_WORDS_EN],
        '數學': [BIO_MATH_KEY_WORDS_EN, BIO_MATH_ANTI_KEY_WORDS_EN],
        '經濟': [BIO_ECONOMICS_KEY_WORDS_EN, BIO_ECONOMICS_ANTI_KEY_WORDS_EN],
        '企業': [BIO_BUSINESS_KEY_WORDS_EN, BIO_BUSINESS_ANTI_KEY_WORDS_EN],
        '管理': [BIO_MANAGEMENT_KEY_WORDS_EN, BIO_MANAGEMENT_ANTI_KEY_WORDS_EN],
        '會計': [BIO_ACCOUNTING_KEY_WORDS_EN, BIO_ACCOUNTING_ANTI_KEY_WORDS_EN],
        '統計': [BIO_STATISTICS_KEY_WORDS_EN, BIO_STATISTICS_ANTI_KEY_WORDS_EN],
        '金融': [BIO_FINANCE_KEY_WORDS_EN, BIO_FINANCE_ANTI_KEY_WORDS_EN],
        '行銷': [BIO_MARKETING_KEY_WORDS_EN, BIO_MARKETING_ANTI_KEY_WORDS_EN],
        '作業研究': [BIO_OP_RESEARCH_KEY_WORDS_EN, BIO_OP_RESEARCH_ANTI_KEY_WORDS_EN],
        '觀察研究': [BIO_EP_RESEARCH_KEY_WORDS_EN, BIO_EP_RESEARCH_ANTI_KEY_WORDS_EN],
        '資工': [BIO_BASIC_CS_KEY_WORDS_EN, BIO_BASIC_CS_ANTI_KEY_WORDS_EN],
        '程式': [BIO_PROGRAMMING_KEY_WORDS_EN, BIO_PROGRAMMING_ANTI_KEY_WORDS_EN],
        '資料科學': [BIO_DATA_SCIENCE_KEY_WORDS_EN, BIO_DATA_SCIENCE_ANTI_KEY_WORDS_EN],
        '論文': [BIO_BACHELOR_THESIS_KEY_WORDS_EN, BIO_BACHELOR_THESIS_ANTI_KEY_WORDS_EN],
        '資管': [BIO_BUSINESS_INFORMATIC_KEY_WORDS_EN, BIO_BUSINESS_INFORMATIC_ANTI_KEY_WORDS_EN],
        '其他': [USELESS_COURSES_KEY_WORDS_EN, USELESS_COURSES_ANTI_KEY_WORDS_EN], }

    basic_classification_zh = {
        '微積分': [BIO_CALCULUS_KEY_WORDS, BIO_CALCULUS_ANTI_KEY_WORDS],
        '線性代數': [BIO_MATH_LIN_ALGE_KEY_WORDS, BIO_MATH_LIN_ALGE_ANTI_KEY_WORDS],
        '數學': [BIO_MATH_KEY_WORDS, BIO_MATH_ANTI_KEY_WORDS],
        '經濟': [BIO_ECONOMICS_KEY_WORDS, BIO_ECONOMICS_ANTI_KEY_WORDS],
        '企業': [BIO_BUSINESS_KEY_WORDS, BIO_BUSINESS_ANTI_KEY_WORDS],
        '管理': [BIO_MANAGEMENT_KEY_WORDS, BIO_MANAGEMENT_ANTI_KEY_WORDS],
        '會計': [BIO_ACCOUNTING_KEY_WORDS, BIO_ACCOUNTING_ANTI_KEY_WORDS],
        '統計': [BIO_STATISTICS_KEY_WORDS, BIO_STATISTICS_ANTI_KEY_WORDS],
        '金融': [BIO_FINANCE_KEY_WORDS, BIO_FINANCE_ANTI_KEY_WORDS],
        '行銷': [BIO_MARKETING_KEY_WORDS, BIO_MARKETING_ANTI_KEY_WORDS],
        '作業研究': [BIO_OP_RESEARCH_KEY_WORDS, BIO_OP_RESEARCH_ANTI_KEY_WORDS],
        '觀察研究': [BIO_EP_RESEARCH_KEY_WORDS, BIO_EP_RESEARCH_ANTI_KEY_WORDS],
        '資工': [BIO_BASIC_CS_KEY_WORDS, BIO_BASIC_CS_ANTI_KEY_WORDS],
        '程式': [BIO_PROGRAMMING_KEY_WORDS, BIO_PROGRAMMING_ANTI_KEY_WORDS],
        '資料科學': [BIO_DATA_SCIENCE_KEY_WORDS, BIO_DATA_SCIENCE_ANTI_KEY_WORDS],
        '論文': [BIO_BACHELOR_THESIS_KEY_WORDS, BIO_BACHELOR_THESIS_ANTI_KEY_WORDS],
        '資管': [BIO_BUSINESS_INFORMATIC_KEY_WORDS, BIO_BUSINESS_INFORMATIC_ANTI_KEY_WORDS],
        '其他': [USELESS_COURSES_KEY_WORDS, USELESS_COURSES_ANTI_KEY_WORDS], }

    Classifier(program_idx, file_path, abbrev, env_file_path,
               basic_classification_en, basic_classification_zh, column_len_array, program_sort_function, studentId, student_name, analysis_language)

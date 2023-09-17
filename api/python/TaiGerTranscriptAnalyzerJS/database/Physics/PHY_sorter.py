import xlsxwriter
from CourseSuggestionAlgorithms import *
from util import *
from keywords import *
from database.Physics.PHY_Programs import program_sort_function, column_len_array
from cell_formatter import red_out_failed_subject, red_out_insufficient_credit
import pandas as pd
import sys
import os
env_file_path = os.path.realpath(__file__)
env_file_path = os.path.dirname(env_file_path)


def PHY_sorter(program_idx, file_path, abbrev, studentId, student_name, analysis_language):

    basic_classification_en = {
        '微積分': [CALCULUS_KEY_WORDS_EN, CALCULUS_ANTI_KEY_WORDS_EN],
        '線性代數': [DSBI_MATH_LIN_ALGE_KEY_WORDS_EN, DSBI_MATH_LIN_ALGE_ANTI_KEY_WORDS_EN],
        '數學': [DSBI_MATH_KEY_WORDS_EN, DSBI_MATH_ANTI_KEY_WORDS_EN],
        '經濟': [ECONOMICS_KEY_WORDS_EN, ECONOMICS_ANTI_KEY_WORDS_EN],
        '企業': [BUSINESS_KEY_WORDS_EN, BUSINESS_ANTI_KEY_WORDS_EN],
        '管理': [MANAGEMENT_KEY_WORDS_EN, MANAGEMENT_ANTI_KEY_WORDS_EN],
        '會計': [ACCOUNTING_KEY_WORDS_EN, ACCOUNTING_ANTI_KEY_WORDS_EN],
        '統計': [DSBI_STATISTICS_KEY_WORDS_EN, DSBI_STATISTICS_ANTI_KEY_WORDS_EN],
        '金融': [DSBI_FINANCE_KEY_WORDS_EN, DSBI_FINANCE_ANTI_KEY_WORDS_EN],
        '行銷': [DSBI_MARKETING_KEY_WORDS_EN, DSBI_MARKETING_ANTI_KEY_WORDS_EN],
        '作業研究': [OP_RESEARCH_KEY_WORDS_EN, OP_RESEARCH_ANTI_KEY_WORDS_EN],
        '觀察研究': [DSBI_EP_RESEARCH_KEY_WORDS_EN, DSBI_EP_RESEARCH_ANTI_KEY_WORDS_EN],
        '資工': [DSBI_BASIC_CS_KEY_WORDS_EN, DSBI_BASIC_CS_ANTI_KEY_WORDS_EN],
        '程式': [DSBI_PROGRAMMING_KEY_WORDS_EN, DSBI_PROGRAMMING_ANTI_KEY_WORDS_EN],
        '資料科學': [DSBI_DATA_SCIENCE_KEY_WORDS_EN, DSBI_DATA_SCIENCE_ANTI_KEY_WORDS_EN],
        '論文': [DSBI_BACHELOR_THESIS_KEY_WORDS_EN, DSBI_BACHELOR_THESIS_ANTI_KEY_WORDS_EN],
        '資管': [DSBI_BUSINESS_INFORMATIC_KEY_WORDS_EN, DSBI_BUSINESS_INFORMATIC_ANTI_KEY_WORDS_EN],
        '其他': [USELESS_COURSES_KEY_WORDS_EN, USELESS_COURSES_ANTI_KEY_WORDS_EN], }

    basic_classification_zh = {
        '微積分': [CALCULUS_KEY_WORDS, CALCULUS_ANTI_KEY_WORDS],
        '線性代數': [DSBI_MATH_LIN_ALGE_KEY_WORDS, DSBI_MATH_LIN_ALGE_ANTI_KEY_WORDS],
        '數學': [DSBI_MATH_KEY_WORDS, DSBI_MATH_ANTI_KEY_WORDS],
        '經濟': [ECONOMICS_KEY_WORDS, ECONOMICS_ANTI_KEY_WORDS],
        '企業': [BUSINESS_KEY_WORDS, BUSINESS_ANTI_KEY_WORDS],
        '管理': [MANAGEMENT_KEY_WORDS, MANAGEMENT_ANTI_KEY_WORDS],
        '會計': [ACCOUNTING_KEY_WORDS, ACCOUNTING_ANTI_KEY_WORDS],
        '統計': [STATISTICS_KEY_WORDS, STATISTICS_ANTI_KEY_WORDS],
        '金融': [FINANCE_KEY_WORDS, FINANCE_ANTI_KEY_WORDS],
        '行銷': [MARKETING_KEY_WORDS, MARKETING_ANTI_KEY_WORDS],
        '作業研究': [OP_RESEARCH_KEY_WORDS, OP_RESEARCH_ANTI_KEY_WORDS],
        '觀察研究': [DSBI_EP_RESEARCH_KEY_WORDS, DSBI_EP_RESEARCH_ANTI_KEY_WORDS],
        '資工': [DSBI_BASIC_CS_KEY_WORDS, DSBI_BASIC_CS_ANTI_KEY_WORDS],
        '程式': [DSBI_PROGRAMMING_KEY_WORDS, DSBI_PROGRAMMING_ANTI_KEY_WORDS],
        '資料科學': [DSBI_DATA_SCIENCE_KEY_WORDS, DSBI_DATA_SCIENCE_ANTI_KEY_WORDS],
        '論文': [DSBI_BACHELOR_THESIS_KEY_WORDS, DSBI_BACHELOR_THESIS_ANTI_KEY_WORDS],
        '資管': [DSBI_BUSINESS_INFORMATIC_KEY_WORDS, DSBI_BUSINESS_INFORMATIC_ANTI_KEY_WORDS],
        '其他': [USELESS_COURSES_KEY_WORDS, USELESS_COURSES_ANTI_KEY_WORDS], }

    Classifier(program_idx, file_path, abbrev, env_file_path,
               basic_classification_en, basic_classification_zh, column_len_array, program_sort_function, studentId, student_name, analysis_language)

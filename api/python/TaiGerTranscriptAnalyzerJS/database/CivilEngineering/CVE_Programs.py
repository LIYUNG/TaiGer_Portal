import xlsxwriter
from CourseSuggestionAlgorithms import *
from util import *
from cell_formatter import red_out_failed_subject, red_out_insufficient_credit
import pandas as pd
import sys

# Global variable:
column_len_array = []


def TUM_BAUINGENIEURWESEN(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'TUM_Bauingenieurwesen'
    print("Create " + program_name + " sheet")
    df_transcript_array_temp = []
    df_category_courses_sugesstion_data_temp = []
    for idx, df in enumerate(df_transcript_array):
        df_transcript_array_temp.concat(df.copy())
    for idx, df in enumerate(df_category_courses_sugesstion_data):
        df_category_courses_sugesstion_data_temp.concat(df.copy())
    #####################################################################
    ############## Program Specific Parameters ##########################
    #####################################################################

    # Create transcript_sorted_group to program_category mapping
    PROG_SPEC_MATH_PARAM = {
        'Program_Category': 'Höhere Mathematik', 'Required_ECTS': 12}
    PROG_SPEC_MECHANIK_PARAM = {
        'Program_Category': 'Mechanik, Hydromechanik', 'Required_ECTS': 22}
    PROG_SPEC_BAU_UMWELTINFORMATIK_PARAM = {
        'Program_Category': 'Bau- und Umweltinformatik', 'Required_ECTS': 10}
    PROG_SPEC_BAUPROZESSMANAGEMENT_PARAM = {
        'Program_Category': 'Bauprozessmanagement, (Bau-) Recht', 'Required_ECTS': 12}
    PROG_SPEC_WERKSTOFFKUNDE_PARAM = {
        'Program_Category': 'Werkstoffe, Bauphysik', 'Required_ECTS': 15}
    PROG_SPEC_BAUKONSTRUKTIONE_PARAM = {
        'Program_Category': 'Baukonstruktion', 'Required_ECTS': 18}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_MECHANIK_PARAM,  # 力學
        PROG_SPEC_BAU_UMWELTINFORMATIK_PARAM,  # 建築 環境資訊
        PROG_SPEC_BAUPROZESSMANAGEMENT_PARAM,  # 營造流程管理 營造法
        PROG_SPEC_WERKSTOFFKUNDE_PARAM,  # 材料 建築物裡
        PROG_SPEC_BAUKONSTRUKTIONE_PARAM,  # 構造
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_MATH_PARAM,  # 微積分
        PROG_SPEC_MATH_PARAM,  # 線性代數
        PROG_SPEC_MATH_PARAM,  # 微分方程
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_OTHERS,  # 物理
        PROG_SPEC_OTHERS,  # 物理實驗
        PROG_SPEC_OTHERS,  # 機械設計
        PROG_SPEC_OTHERS,  # 機構
        PROG_SPEC_OTHERS,  # 熱力學
        PROG_SPEC_OTHERS,  # 熱 物質傳導
        PROG_SPEC_WERKSTOFFKUNDE_PARAM,  # 材料
        PROG_SPEC_OTHERS,  # 控制工程
        PROG_SPEC_MECHANIK_PARAM,  # 流體
        PROG_SPEC_MECHANIK_PARAM,  # 靜力學
        PROG_SPEC_MECHANIK_PARAM,  # 動力學
        PROG_SPEC_MECHANIK_PARAM,  # 材料力學,機械
        PROG_SPEC_OTHERS,  # 基礎電機電子
        PROG_SPEC_OTHERS,  # 製造
        PROG_SPEC_OTHERS,  # 計算機概論
        PROG_SPEC_OTHERS,  # 機電
        PROG_SPEC_OTHERS,  # 測量
        PROG_SPEC_OTHERS,  # 車輛
        PROG_SPEC_OTHERS  # 其他
    ]

    # Development check
    if len(program_category_map) != len(df_transcript_array):
        print("program_category_map size: " + str(len(program_category_map)))
        print("df_transcript_array size:  " + str(len(df_transcript_array)))
        print("Please check the number of program_category_map again!")
        sys.exit()

    #####################################################################
    ####################### End #########################################
    #####################################################################

    WriteToExcel(writer, program_name, program_category, program_category_map,
                 transcript_sorted_group_map, df_transcript_array_temp, df_category_courses_sugesstion_data_temp, column_len_array)


program_sort_function = [TUM_BAUINGENIEURWESEN]

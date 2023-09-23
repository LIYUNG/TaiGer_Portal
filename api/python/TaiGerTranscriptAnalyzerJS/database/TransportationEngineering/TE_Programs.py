import xlsxwriter
from CourseSuggestionAlgorithms import *
from util import *
from cell_formatter import red_out_failed_subject, red_out_insufficient_credit
import pandas as pd
import sys

# Global variable:
column_len_array = []

# FPSO: https://www.tum.de/fileadmin/user_upload_87/gi32rab/FPSO/Transportation_Systems_MA_LF_AES_190821.pdf


def TUM_TransportEngineering(transcript_sorted_group_map, df_transcript_array, writer):
    print("Create TUM EI sheet")
    # TODO: implement the mapping from the existing courses to program's requirement
    start_row = 0
    for idx, sortedcourses in enumerate(df_transcript_array):
        sortedcourses.to_excel(
            writer, sheet_name='TUM_TransportEngineering', startrow=start_row, index=False)
        start_row += len(sortedcourses.index) + 2
    print("Save to TUM_TransportEngineering")

# FPSO: https://www.rwth-aachen.de/global/show_document.asp?id=aaaaaaaabefxcaf
# § 3 (2) b, Seite 4


def RWTH_TransportationENgineering(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'RWTH_TransportationENgineering'
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
        'Program_Category': 'Mathematics', 'Required_ECTS': 14}
    PROG_SPEC_STAT_PARAM = {
        'Program_Category': 'Statistics', 'Required_ECTS': 4}
    PROG_SPEC_MECH_PARAM = {
        'Program_Category': 'Mechanics', 'Required_ECTS': 11}
    PROG_SPEC_ELEKTROTECHNIK_PARAM = {
        'Program_Category': 'Electrical Engineering', 'Required_ECTS': 5}
    PROG_SPEC_ENGINEERING_FUNDA_PARAM = {
        'Program_Category': 'Fundamental Engineering', 'Required_ECTS': 10}
    PROG_SPEC_ADAVANCED_SUBJ_VERKEHR_MODULE_PARAM = {  # Straßenwesen, Eisenbahnwesen, Flughafenwesen, Verkehrswirt-schaft
        'Program_Category': 'Advanced Major Course', 'Required_ECTS': 13}
    PROG_SPEC_ADAVANCED_SUBJ_ME_MODULE_PARAM = {  # Maschinengestaltung, Fahrzeugtechnik, Verbrennungsma-schinen, Schienenfahrzeugtechnik, Luft- und Raumfahrttechnik
        'Program_Category': 'Advanced Major Course', 'Required_ECTS': 13}
    PROG_SPEC_ADAVANCED_SUBJ_EI_MODULE_PARAM = {  # Elektrotechnik, Batteriespeichertechnik, elektrische Maschi-nen
        'Program_Category': 'Advanced Major Course', 'Required_ECTS': 13}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_STAT_PARAM,  # 統計
        PROG_SPEC_MECH_PARAM,  # 基礎力學
        PROG_SPEC_ELEKTROTECHNIK_PARAM,  # 基礎電機
        PROG_SPEC_ENGINEERING_FUNDA_PARAM,  # 基礎工程科學
        PROG_SPEC_ADAVANCED_SUBJ_VERKEHR_MODULE_PARAM,  # 應用交通
        PROG_SPEC_ADAVANCED_SUBJ_ME_MODULE_PARAM,  # 應用機械
        PROG_SPEC_ADAVANCED_SUBJ_EI_MODULE_PARAM,  # 應用電機
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_MATH_PARAM,  # 微積分
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_ENGINEERING_FUNDA_PARAM,  # 物理
        PROG_SPEC_ENGINEERING_FUNDA_PARAM,  # 物理實驗
        PROG_SPEC_OTHERS,  # 資訊
        PROG_SPEC_OTHERS,  # 程式
        PROG_SPEC_OTHERS,  # 軟體工程
        PROG_SPEC_ENGINEERING_FUNDA_PARAM,  # 控制系統
        PROG_SPEC_ELEKTROTECHNIK_PARAM,  # 電子
        PROG_SPEC_ELEKTROTECHNIK_PARAM,  # 電子實驗
        PROG_SPEC_ELEKTROTECHNIK_PARAM,  # 電路
        PROG_SPEC_OTHERS,  # 信號與系統
        PROG_SPEC_OTHERS,  # 電磁
        PROG_SPEC_ADAVANCED_SUBJ_EI_MODULE_PARAM,  # 電力電子
        PROG_SPEC_OTHERS,  # 通訊
        PROG_SPEC_OTHERS,  # 半導體
        PROG_SPEC_OTHERS,  # 電機專業選修
        PROG_SPEC_OTHERS,  # 應用科技
        PROG_SPEC_MECH_PARAM,  # 力學,機械
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


program_sort_function = [TUM_TransportEngineering,
                         RWTH_TransportationENgineering]

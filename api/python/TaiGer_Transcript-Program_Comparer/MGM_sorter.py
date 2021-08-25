import xlsxwriter
import gc
from alogrithms import *
from util import *
from ME_KEYWORDS import *
from cell_formatter import red_out_failed_subject, red_out_insufficient_credit
import pandas as pd
from numpy import nan
import sys
import os
env_file_path = os.path.realpath(__file__)
env_file_path = os.path.dirname(env_file_path)

# Global variable:
column_len_array = []

#FPSO: https://www.tum.de/fileadmin/w00bfo/www/Studium/Studienangebot/Lesbare_Fassung/Master/Managem._Techn._LB_AS_3._AS_28052021.pdf
def TUM_MMT(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'TUM_MMT'
    print("Create " + program_name + " sheet")
    df_transcript_array_temp = []
    df_category_courses_sugesstion_data_temp = []
    for idx, df in enumerate(df_transcript_array):
        df_transcript_array_temp.append(df.copy())
    for idx, df in enumerate(df_category_courses_sugesstion_data):
        df_category_courses_sugesstion_data_temp.append(df.copy())
    #####################################################################
    ############## Program Specific Parameters ##########################
    #####################################################################

    # Create transcript_sorted_group to program_category mapping
    
    PROG_SPEC_BML_PARAM = {
        'Program_Category': 'Betriebswirtschaftliche Module', 'Required_CP': 25}
    PROG_SPEC_EMPIRIAL_METHODE_PARAM = {
        'Program_Category': 'Empirische Methoden', 'Required_CP': 6}
    PROG_SPEC_OPERATION_RESEARCH_PARAM = {
        'Program_Category': 'Operations Research', 'Required_CP': 6}
    PROG_SPEC_VWL_PARAM = {
        'Program_Category': 'Volkswirtschaftliche Module', 'Required_CP': 10}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_CP': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_BML_PARAM,  # 管理
        PROG_SPEC_EMPIRIAL_METHODE_PARAM,  
        PROG_SPEC_OPERATION_RESEARCH_PARAM,  # 作業研究 
        PROG_SPEC_VWL_PARAM,  # 經濟
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_OTHERS,  # 微積分
        PROG_SPEC_OTHERS,  # 數學
        PROG_SPEC_OTHERS,  # 物理
        PROG_SPEC_OTHERS,  # 物理實驗
        PROG_SPEC_OTHERS,  # 機械設計
        PROG_SPEC_OTHERS,  # 熱力學
        PROG_SPEC_OTHERS,  # 熱 物質傳導
        PROG_SPEC_OTHERS,  # 材料
        PROG_SPEC_OTHERS,  # 控制工程
        PROG_SPEC_OTHERS,  # 流體
        PROG_SPEC_OTHERS,  # 力學,機械
        PROG_SPEC_OTHERS,  # 基礎電機電子
        PROG_SPEC_OTHERS,  # 製造
        PROG_SPEC_OTHERS,  # 計算機概論
        PROG_SPEC_OTHERS,  # 機電
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


program_sort_function = [TUM_MMT]


def ME_sorter(program_idx, file_path):

    Database_Path = env_file_path + '/database/'
    Output_Path = os.path.split(file_path)
    Output_Path = Output_Path[0]
    Output_Path = Output_Path + '/output/'
    print("output file path " + Output_Path)

    if not os.path.exists(Output_Path):
        print("create output folder")
        os.makedirs(Output_Path)

    Database_file_name = 'ME_Course_database.xlsx'
    input_file_name = os.path.split(file_path)
    input_file_name = input_file_name[1]
    print("input file name " + input_file_name)

    df_transcript = pd.read_excel(file_path,
                                  sheet_name='Transcript_Sorting')
    # Verify the format of transcript_course_list.xlsx
    if df_transcript.columns[0] != '所修科目' or df_transcript.columns[1] != '學分' or df_transcript.columns[2] != '成績':
        print("Error: Please check the student's transcript xlsx file.")
        print("Header: column_1 = 所修科目, column_2 = 學分, column_3 = 成績")
        sys.exit()

    df_database = pd.read_excel(Database_Path+Database_file_name,
                                sheet_name='All_ME_Courses')
    # Verify the format of ME_Course_database.xlsx
    if df_database.columns[0] != '所有科目':
        print("Error: Please check the ME database xlsx file.")
        sys.exit()
    df_database['所有科目'] = df_database['所有科目'].fillna('-')

    # unify course naming convention
    Naming_Convention(df_transcript)

    sorted_courses = []
    # ME
    transcript_sorted_group_map = {
        '微積分': [ME_CALCULUS_KEY_WORDS, ME_CALCULUS_ANTI_KEY_WORDS, ['一', '二']],
        '數學': [ME_MATH_KEY_WORDS, ME_MATH_ANTI_KEY_WORDS],
        '物理': [ME_PHYSICS_KEY_WORDS, ME_PHYSICS_ANTI_KEY_WORDS, ['一', '二']],
        '物理實驗': [ME_PHYSICS_EXP_KEY_WORDS, ME_PHYSICS_EXP_ANTI_KEY_WORDS, ['一', '二']],
        '機械設計': [ME_MASCHINENGESTALTUNG_KEY_WORDS, ME_MASCHINENGESTALTUNG_ANTI_KEY_WORDS, ['一', '二']],
        '熱力學': [ME_THERMODYN_KEY_WORDS, ME_THERMODYN_ANTI_KEY_WORDS, ['一', '二']],
        '熱傳導': [ME_WARMTRANSPORT_KEY_WORDS, ME_WARMTRANSPORT_ANTI_KEY_WORDS, ['一', '二']],
        '材料': [ME_WERKSTOFFKUNDE_KEY_WORDS, ME_WERKSTOFFKUNDE_ANTI_KEY_WORDS, ['一', '二']],
        '控制系統': [ME_CONTROL_THEORY_KEY_WORDS, ME_CONTROL_THEORY_ANTI_KEY_WORDS, ['一', '二']],
        '流體': [ME_FLUIDDYN_KEY_WORDS, ME_FLUIDDYN_ANTI_KEY_WORDS, ['一', '二']],
        '力學': [ME_MECHANIK_KEY_WORDS, ME_MECHANIK_ANTI_KEY_WORDS],
        '基礎電機電子': [ME_ELECTRICAL_ENG_KEY_WORDS, ME_ELECTRICAL_ENG_ANTI_KEY_WORDS],
        '製造工程': [ME_MANUFACTURE_ENG_KEY_WORDS, ME_MANUFACTURE_ENG_ANTI_KEY_WORDS],
        '計算機概論': [ME_COMPUTER_SCIENCE_KEY_WORDS, ME_COMPUTER_SCIENCE_ANTI_KEY_WORDS],
        '機電': [ME_MECHATRONICS_KEY_WORDS, ME_MECHATRONICS_ANTI_KEY_WORDS],
        '車輛': [ME_VEHICLE_KEY_WORDS, ME_VEHICLE_ANTI_KEY_WORDS],
        '其他': [USELESS_COURSES_KEY_WORDS, USELESS_COURSES_ANTI_KEY_WORDS], }

    suggestion_courses_sorted_group_map = {
        '微積分': [[], ME_CALCULUS_ANTI_KEY_WORDS],
        '數學': [[], ME_MATH_ANTI_KEY_WORDS],
        '物理': [[], ME_PHYSICS_ANTI_KEY_WORDS],
        '物理實驗': [[], ME_CONTROL_THEORY_ANTI_KEY_WORDS],
        '機械設計': [[], ME_MASCHINENGESTALTUNG_ANTI_KEY_WORDS],
        '熱力學': [[], ME_CONTROL_THEORY_ANTI_KEY_WORDS],
        '熱傳導': [[], ME_WARMTRANSPORT_ANTI_KEY_WORDS],
        '材料': [[], ME_WERKSTOFFKUNDE_ANTI_KEY_WORDS],
        '控制系統': [[], ME_CONTROL_THEORY_ANTI_KEY_WORDS],
        '流體': [[], ME_FLUIDDYN_ANTI_KEY_WORDS],
        '力學': [[], ME_MECHANIK_ANTI_KEY_WORDS],
        '基礎電機電子': [[], ME_ELECTRICAL_ENG_ANTI_KEY_WORDS],
        '製造工程': [[], ME_MANUFACTURE_ENG_ANTI_KEY_WORDS],
        '計算機概論': [[], ME_COMPUTER_SCIENCE_ANTI_KEY_WORDS],
        '機電': [[], ME_MECHATRONICS_ANTI_KEY_WORDS],
        '車輛': [[], ME_VEHICLE_ANTI_KEY_WORDS],
        '其他': [[], USELESS_COURSES_ANTI_KEY_WORDS], }

    category_data = []
    df_category_data = []
    category_courses_sugesstion_data = []
    df_category_courses_sugesstion_data = []
    for idx, cat in enumerate(transcript_sorted_group_map):
        category_data = {cat: [], '學分': [], '成績': []}
        df_category_data.append(pd.DataFrame(data=category_data))
        df_category_courses_sugesstion_data.append(
            pd.DataFrame(data=category_courses_sugesstion_data, columns=['建議修課']))

    # 基本分類課程 (與學程無關)
    df_category_data = CourseSorting(
        df_transcript, df_category_data, transcript_sorted_group_map)

    # 基本分類機械課程資料庫
    df_category_courses_sugesstion_data = DatabaseCourseSorting(
        df_database, df_category_courses_sugesstion_data, transcript_sorted_group_map)

    for idx, cat in enumerate(df_category_data):
        df_category_courses_sugesstion_data[idx]['建議修課'] = df_category_courses_sugesstion_data[idx]['建議修課'].str.replace(
            '(', '', regex=False)
        df_category_courses_sugesstion_data[idx]['建議修課'] = df_category_courses_sugesstion_data[idx]['建議修課'].str.replace(
            ')', '', regex=False)

    # 樹狀篩選 微積分:[一,二] 同時有含 微積分、一  的，就從recommendation拿掉
    # algorithm :
    df_category_courses_sugesstion_data = SuggestionCourseAlgorithm(
        df_category_data, transcript_sorted_group_map, df_category_courses_sugesstion_data)

    output_file_name = 'analyzed_' + input_file_name
    writer = pd.ExcelWriter(
        Output_Path+output_file_name, engine='xlsxwriter')

    sorted_courses = df_category_data

    start_row = 0
    for idx, sortedcourses in enumerate(sorted_courses):
        sortedcourses.to_excel(
            writer, sheet_name='General', startrow=start_row, index=False)
        start_row += len(sortedcourses.index) + 2
    workbook = writer.book
    worksheet = writer.sheets['General']
    global column_len_array

    red_out_failed_subject(workbook, worksheet, 1, start_row)

    for i, col in enumerate(df_transcript.columns):
        # find length of column i
        column_len = df_transcript[col].astype(str).str.len().max()
        # Setting the length if the column header is larger
        # than the max column value length
        column_len_array.append(max(column_len, len(col)))
        # set the column length
        worksheet.set_column(i, i, column_len_array[i] * 2)

    # Modify to column width for "Required_CP"
    column_len_array.append(6)

    for idx in program_idx:
        program_sort_function[idx](
            transcript_sorted_group_map,
            sorted_courses,
            df_category_courses_sugesstion_data,
            writer)

    writer.save()
    print("output data at: " + Output_Path + output_file_name)
    print("Students' courses analysis and courses suggestion in EE area finished! ")

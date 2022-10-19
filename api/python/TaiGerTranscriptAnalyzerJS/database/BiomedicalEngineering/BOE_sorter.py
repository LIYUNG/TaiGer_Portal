import xlsxwriter
from CourseSuggestionAlgorithms import *
from util import *
from database.BiomedicalEngineering.BOE_KEYWORDS import *
from cell_formatter import red_out_failed_subject, red_out_insufficient_credit
import pandas as pd
import sys
import os
env_file_path = os.path.realpath(__file__)
env_file_path = os.path.dirname(env_file_path)

# Global variable:
column_len_array = []

def RWTH_AUTO(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'RWTH_Aachen_AUTO'
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
    
    PROG_SPEC_MECHANIK_PARAM = {
        'Program_Category': 'Mechanik', 'Required_ECTS': 18}
    PROG_SPEC_MASCHINENGESTALTUNG_PARAM = {
        'Program_Category': 'Maschinengestaltung', 'Required_ECTS': 13}
    PROG_SPEC_THERMODYNAMIK_PARAM = {
        'Program_Category': 'Thermodynamik', 'Required_ECTS': 7}
    PROG_SPEC_WARMSTOFFUBERTRAGUNG_PARAM = {
        'Program_Category': 'Wärm_und_Stoffübertragung', 'Required_ECTS': 6}
    PROG_SPEC_WERKSTOFFKUNDE_PARAM = {
        'Program_Category': 'Werkstoffkunde', 'Required_ECTS': 8}
    PROG_SPEC_CONTROL_TECHNIQUE_PARAM = {
        'Program_Category': 'Regelungstechnik', 'Required_ECTS': 6}
    PROG_SPEC_STROEMUNGSMECHANIK_PARAM = {
        'Program_Category': 'Strömungsmechanik I', 'Required_ECTS': 6}
    PROG_SPEC_MATH_PARAM = {
        'Program_Category': 'Höhere Mathematik', 'Required_ECTS': 17}
    PROG_SPEC_FAHRZEUGTECHNIK_PARAM = {
        'Program_Category': 'Fahrzeugtechnik', 'Required_ECTS': 22}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_MECHANIK_PARAM,  # 力學
        PROG_SPEC_MASCHINENGESTALTUNG_PARAM,  # 機械繪圖
        PROG_SPEC_THERMODYNAMIK_PARAM,  # 熱力學
        PROG_SPEC_WARMSTOFFUBERTRAGUNG_PARAM,  # 熱 物質傳導
        PROG_SPEC_WERKSTOFFKUNDE_PARAM,  # 材料
        PROG_SPEC_CONTROL_TECHNIQUE_PARAM,  # 控制工程
        PROG_SPEC_STROEMUNGSMECHANIK_PARAM,  # 流體
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_FAHRZEUGTECHNIK_PARAM, # 汽車
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_MATH_PARAM,  # 微積分
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_OTHERS,  # 物理
        PROG_SPEC_OTHERS,  # 物理實驗
        PROG_SPEC_MASCHINENGESTALTUNG_PARAM,  # 機械設計
        PROG_SPEC_MASCHINENGESTALTUNG_PARAM,  # 機構
        PROG_SPEC_THERMODYNAMIK_PARAM,  # 熱力學
        PROG_SPEC_WARMSTOFFUBERTRAGUNG_PARAM,  # 熱 物質傳導
        PROG_SPEC_WERKSTOFFKUNDE_PARAM,  # 材料
        PROG_SPEC_CONTROL_TECHNIQUE_PARAM,  # 控制工程
        PROG_SPEC_STROEMUNGSMECHANIK_PARAM,  # 流體
        PROG_SPEC_MECHANIK_PARAM,  # 力學,機械
        PROG_SPEC_OTHERS,  # 基礎電機電子
        PROG_SPEC_OTHERS,  # 製造
        PROG_SPEC_OTHERS,  # 計算機概論
        PROG_SPEC_OTHERS,  # 機電
        PROG_SPEC_OTHERS,  # 測量
        PROG_SPEC_FAHRZEUGTECHNIK_PARAM,  # 車輛
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


program_sort_function = [RWTH_AUTO]


def ME_sorter(program_idx, file_path):

    Database_Path = env_file_path + '/'
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
    if '所修科目' not in df_transcript.columns or '學分' not in df_transcript.columns or '成績' not in df_transcript.columns:
        print("Error: Please check the student's transcript xlsx file.")
        print(" There must be 所修科目, 學分 and 成績 in student's course excel file.")
        sys.exit()

    df_database = pd.read_excel(Database_Path+Database_file_name,
                                sheet_name='All_BOE_Courses')
    # Verify the format of ME_Course_database.xlsx
    if df_database.columns[0] != '所有科目':
        print("Error: Please specifiy the ME database xlsx file.")
        sys.exit()
    df_database['所有科目'] = df_database['所有科目'].fillna('-')

    # unify course naming convention
    Naming_Convention(df_transcript)

    sorted_courses = []
    # TODO: classify different course group
    transcript_sorted_group_map = {
        '微積分': [BOE_CALCULUS_KEY_WORDS, BOE_CALCULUS_ANTI_KEY_WORDS, ['一', '二']],
        '數學': [BOE_MATH_KEY_WORDS, BOE_MATH_ANTI_KEY_WORDS],
        '物理': [BOE_PHYSICS_KEY_WORDS, BOE_PHYSICS_ANTI_KEY_WORDS, ['一', '二']],
        '物理實驗': [BOE_PHYSICS_EXP_KEY_WORDS, BOE_PHYSICS_EXP_ANTI_KEY_WORDS, ['一', '二']],
        '其他': [USELESS_COURSES_KEY_WORDS, USELESS_COURSES_ANTI_KEY_WORDS], }

    suggestion_courses_sorted_group_map = {
        '微積分': [[], BOE_CALCULUS_ANTI_KEY_WORDS],
        '數學': [[], BOE_MATH_ANTI_KEY_WORDS],
        '物理': [[], BOE_PHYSICS_ANTI_KEY_WORDS],
        '物理實驗': [[], BOE_PHYSICS_EXP_ANTI_KEY_WORDS],
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

    # Modify to column width for "Required_ECTS"
    column_len_array.append(6)

    for idx in program_idx:
        program_sort_function[idx](
            transcript_sorted_group_map,
            sorted_courses,
            df_category_courses_sugesstion_data,
            writer)

    writer.save()
    print("output data at: " + Output_Path + output_file_name)
    print("Students' courses analysis and courses suggestion in BOE area finished! ")

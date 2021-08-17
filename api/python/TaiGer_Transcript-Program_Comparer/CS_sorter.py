from numpy import nan
import sys
import os
env_file_path = os.path.realpath(__file__)
env_file_path = os.path.dirname(env_file_path)
import pandas as pd
from cell_formatter import red_out_failed_subject
from CS_KEYWORDS import *
from util import *
from alogrithms import *
import gc

import xlsxwriter

# Global variable:
column_len_array = []

def TUM_CS(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    # TODO: modify the course name
    program_name = 'TUM_CS'
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
    PROG_SPEC_INTRO_INFO_PARAM = {
        'Program_Category': 'Introduction_to_Informatics', 'Required_CP': 12}  # Computer Architecture: Organization and Technology
    PROG_SPEC_COMP_ARCH_PARAM = {
        'Program_Category': 'Computer Architecture', 'Required_CP': 16}  # Computer Architecture: Organization and Technology
    PROG_SPEC_SWE_PARAM = {
        'Program_Category': 'Software_Engineering', 'Required_CP': 6}
    PROG_SPEC_DB_PARAM = {
        'Program_Category': 'Databases', 'Required_CP': 6}
    PROG_SPEC_OS_PARAM = {
        'Program_Category': 'Operating_Systems', 'Required_CP': 6}  # Operating Systems and System Software
    PROG_SPEC_COMP_NETW_MODULE_PARAM = {
        'Program_Category': 'Computer Network', 'Required_CP': 6}   # Computer Networks, Distributed Systems
    PROG_SPEC_FUNC_PROG_MODULE_PARAM = {
        'Program_Category': 'Functional_Programming', 'Required_CP': 5}
    PROG_SPEC_ALGOR_DATA_STRUC_MODULE_PARAM = {
        'Program_Category': 'Algorithms_Data_Structures', 'Required_CP': 6}
    PROG_SPEC_THEORY_COMP_MODULE_PARAM = {
        'Program_Category': 'Theory_of_Computation', 'Required_CP': 8}
    PROG_SPEC_DISCRETE_STRUCTURE_MODULE_PARAM = {
        'Program_Category': 'Discrete_Structures', 'Required_CP': 8}
    PROG_SPEC_LINEAR_ALGEBRA_MODULE_PARAM = {
        'Program_Category': 'Linear_Algebra', 'Required_CP': 8}
    PROG_SPEC_CALCULUS_MODULE_PARAM = {
        'Program_Category': 'Analysis_Calculus', 'Required_CP': 8}
    PROG_SPEC_DISCRETE_PROB_MODULE_PARAM = {
        'Program_Category': 'Discrete_Probability_Theory', 'Required_CP': 6}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_CP': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_INTRO_INFO_PARAM,  # 計算機概論
        PROG_SPEC_COMP_ARCH_PARAM,  # computer architecture
        PROG_SPEC_SWE_PARAM,  # software engineering
        PROG_SPEC_DB_PARAM,  # database
        PROG_SPEC_OS_PARAM,  # OS
        PROG_SPEC_COMP_NETW_MODULE_PARAM,  # 電腦網路
        PROG_SPEC_FUNC_PROG_MODULE_PARAM,  # 函數程式
        PROG_SPEC_ALGOR_DATA_STRUC_MODULE_PARAM,  # 演算法 資料結構
        PROG_SPEC_THEORY_COMP_MODULE_PARAM,  # 運算
        PROG_SPEC_DISCRETE_STRUCTURE_MODULE_PARAM,  # 離散
        PROG_SPEC_LINEAR_ALGEBRA_MODULE_PARAM,  # 線性代數
        PROG_SPEC_CALCULUS_MODULE_PARAM,  # 微積分 分析
        PROG_SPEC_DISCRETE_PROB_MODULE_PARAM,  # 機率
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    # TODO: modify the original sorting list for IT
    program_category_map = [
        PROG_SPEC_INTRO_INFO_PARAM,  # 計算機概論
        PROG_SPEC_COMP_ARCH_PARAM,  # computer architecture
        PROG_SPEC_SWE_PARAM,  # software engineering
        PROG_SPEC_DB_PARAM,  # 資料庫
        PROG_SPEC_OS_PARAM,  # 作業系統
        PROG_SPEC_COMP_NETW_MODULE_PARAM,  #
        PROG_SPEC_FUNC_PROG_MODULE_PARAM,  #
        PROG_SPEC_ALGOR_DATA_STRUC_MODULE_PARAM,  # 演算法 資料結構
        PROG_SPEC_THEORY_COMP_MODULE_PARAM,  # 運算
        PROG_SPEC_DISCRETE_STRUCTURE_MODULE_PARAM,  # 離散
        PROG_SPEC_LINEAR_ALGEBRA_MODULE_PARAM,  # 線性代數
        PROG_SPEC_CALCULUS_MODULE_PARAM,  # 微積分 分析
        PROG_SPEC_DISCRETE_PROB_MODULE_PARAM,  # 機率
        PROG_SPEC_OTHERS,  # 其他
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

    df_PROG_SPEC_CATES, df_PROG_SPEC_CATES_COURSES_SUGGESTION = ProgramCategoryInit(
        program_category)

    transcript_sorted_group_list = list(transcript_sorted_group_map)

    # Courses: mapping the students' courses to program-specific category
    df_PROG_SPEC_CATES = CoursesToProgramCategoryMapping(
        df_PROG_SPEC_CATES, program_category_map, transcript_sorted_group_list, df_transcript_array_temp)

    # Suggestion courses: mapping the sugesstion courses to program-specific category
    df_PROG_SPEC_CATES_COURSES_SUGGESTION = CoursesToProgramCategoryMapping(
        df_PROG_SPEC_CATES_COURSES_SUGGESTION, program_category_map, transcript_sorted_group_list, df_category_courses_sugesstion_data_temp)

    # append 總學分 for each program category
    df_PROG_SPEC_CATES = AppendCreditsCount(
        df_PROG_SPEC_CATES, program_category)

    # Write to Excel
    start_row = 0
    for idx, sortedcourses in enumerate(df_PROG_SPEC_CATES):
        sortedcourses.to_excel(
            writer, sheet_name=program_name, startrow=start_row, header=True, index=False)
        df_PROG_SPEC_CATES_COURSES_SUGGESTION[idx].to_excel(
            writer, sheet_name=program_name, startrow=start_row, startcol=5, header=True, index=False)
        start_row += max(len(sortedcourses.index),
                         len(df_PROG_SPEC_CATES_COURSES_SUGGESTION[idx].index)) + 2

    # Formatting
    workbook = writer.book
    worksheet = writer.sheets[program_name]
    red_out_failed_subject(workbook, worksheet, 1, start_row)

    for df in df_PROG_SPEC_CATES:
        for i, col in enumerate(df.columns):
            # set the column length
            worksheet.set_column(i, i, column_len_array[i] * 2)
    gc.collect()  # Forced GC
    print("Save to "+program_name)


program_sort_function = [TUM_CS]


def CS_sorter(program_idx, file_path):

    Database_Path = env_file_path + '\\database\\'
    Output_Path = os.path.split(file_path)
    Output_Path = Output_Path[0]
    Output_Path = Output_Path + '\\output\\'
    print("output file path " + Output_Path)

    if not os.path.exists(Output_Path):
        print("create output folder")
        os.makedirs(Output_Path)

    Database_file_name = 'CS_Course_database.xlsx'
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
                                sheet_name='All_CS_Courses')
    # Verify the format of CS_Course_database.xlsx
    if df_database.columns[0] != '所有科目':
        print("Error: Please check the CS database xlsx file format.")
        sys.exit()
    df_database['所有科目'] = df_database['所有科目'].fillna('-')

    Naming_Convention(df_transcript)

    sorted_courses = []
    # Computer Science
    transcript_sorted_group_map = {
        '基礎資工': [CS_INTRO_INFO_KEY_WORDS, CS_INTRO_INFO_ANTI_KEY_WORDS, ['一', '二']],
        '電腦結構': [CS_COMP_ARCH_KEY_WORDS, CS_COMP_ARCH_ANTI_KEY_WORDS, ['一', '二']],
        '軟體工程': [CS_SWE_KEY_WORDS, CS_SWE_ANTI_KEY_WORDS],
        '資料庫': [CS_DB_KEY_WORDS, CS_DB_ANTI_KEY_WORDS],
        '作業系統': [CS_OS_KEY_WORDS, CS_OS_ANTI_KEY_WORDS],
        '電腦網絡': [CS_COMP_NETW_KEY_WORDS, CS_COMP_NETW_ANTI_KEY_WORDS],
        '函式程式': [CS_FUNC_PROG_KEY_WORDS, CS_FUNC_PROG_ANTI_KEY_WORDS],
        '資料結構演算法': [CS_ALGO_DATA_STRUCT_KEY_WORDS, CS_ALGO_DATA_STRUCT_ANTI_KEY_WORDS],
        '理論資工': [CS_THEORY_COMP_KEY_WORDS, CS_THEORY_COMP_ANTI_KEY_WORDS],
        '離散': [CS_MATH_DISCRETE_KEY_WORDS, CS_MATH_DISCRETE_ANTI_KEY_WORDS],
        '線性代數': [CS_MATH_LIN_ALGE_KEY_WORDS, CS_MATH_LIN_ALGE_ANTI_KEY_WORDS],
        '微積分': [CS_CALCULUS_KEY_WORDS, CS_CALCULUS_ANTI_KEY_WORDS, ['一', '二']],
        '機率': [CS_MATH_PROB_KEY_WORDS, CS_MATH_PROB_ANTI_KEY_WORDS],
        '其他': [USELESS_COURSES_KEY_WORDS, USELESS_COURSES_ANTI_KEY_WORDS], }

    suggestion_courses_sorted_group_map = {
        '基礎資工': [[], CS_INTRO_INFO_ANTI_KEY_WORDS],
        '電腦結構': [[], CS_COMP_ARCH_ANTI_KEY_WORDS, ['一', '二']],
        '軟體工程': [[], CS_SWE_ANTI_KEY_WORDS, ['一', '二']],
        '資料庫': [[], CS_DB_ANTI_KEY_WORDS],
        '作業系統': [[], CS_OS_ANTI_KEY_WORDS],
        '電腦網絡': [[], CS_COMP_NETW_ANTI_KEY_WORDS],
        '函式程式': [[], CS_FUNC_PROG_ANTI_KEY_WORDS],
        '資料結構演算法': [[], CS_ALGO_DATA_STRUCT_ANTI_KEY_WORDS],
        '理論資工': [[], CS_THEORY_COMP_ANTI_KEY_WORDS],
        '離散': [[], CS_MATH_DISCRETE_ANTI_KEY_WORDS],
        '線性代數': [[], CS_MATH_LIN_ALGE_ANTI_KEY_WORDS],
        '微積分': [[], CS_CALCULUS_ANTI_KEY_WORDS, ['一', '二']],
        '機率': [[], CS_MATH_PROB_ANTI_KEY_WORDS],
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

    df_category_data = CourseSorting(
        df_transcript, df_category_data, transcript_sorted_group_map)

    # 基本分類資工課程資料庫
    df_category_courses_sugesstion_data = DatabaseCourseSorting(
        df_database, df_category_courses_sugesstion_data, transcript_sorted_group_map)
    
    # print(df_category_courses_sugesstion_data)

    for idx, cat in enumerate(df_category_data):
        df_category_courses_sugesstion_data[idx]['建議修課'] = df_category_courses_sugesstion_data[idx]['建議修課'].str.replace(
            '(', '', regex=False)
        df_category_courses_sugesstion_data[idx]['建議修課'] = df_category_courses_sugesstion_data[idx]['建議修課'].str.replace(
            ')', '', regex=False)
    # 樹狀篩選 >> 微積分:[一,二] 同時有含 微積分、一  的，就從recommendation拿掉
    # algorithm :
    df_category_courses_sugesstion_data = SuggestionCourseAlgorithm(
        df_category_data, transcript_sorted_group_map, df_category_courses_sugesstion_data)

    output_file_name = 'generated_' + input_file_name

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
    print("Students' courses analysis and courses suggestion in CS area finished! ")

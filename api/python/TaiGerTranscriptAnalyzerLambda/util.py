import pandas as pd
from CourseSuggestionAlgorithms import *
from cell_formatter import red_out_failed_subject, red_out_insufficient_credit
from globals import column_len_array
from db import get_programs_analysis_collection_mock

import gc
import sys
import os
import io
import boto3
from dotenv import load_dotenv


KEY_WORDS = 0
ANTI_KEY_WORDS = 1
DIFFERENTIATE_KEY_WORDS = 2

# naming convention


def isfloat(value):
    try:
        if value is None:
            return False
        float(value)
        return True
    except ValueError:
        return False


def ProgramCategoryInit(program_category):
    df_PROG_SPEC_CATES = []
    df_PROG_SPEC_CATES_COURSES_SUGGESTION = []
    for idx, cat in enumerate(program_category):
        PROG_SPEC_CAT = {cat['Program_Category']: [],
                         'credits': [], 'grades': [], 'Required_ECTS': cat['Required_ECTS']}
        PROG_SPEC_CATES_COURSES_SUGGESTION = {cat['Program_Category']: [],
                                              }
        df_PROG_SPEC_CATES.append(pd.DataFrame(data=PROG_SPEC_CAT))
        df_PROG_SPEC_CATES_COURSES_SUGGESTION.append(
            pd.DataFrame(data=PROG_SPEC_CATES_COURSES_SUGGESTION))
    return df_PROG_SPEC_CATES, df_PROG_SPEC_CATES_COURSES_SUGGESTION


def CheckTemplateFormat(df_transcript, analysis_lang):
    if analysis_lang == 'zh':
        if 'course_chinese' not in df_transcript.columns or 'credits' not in df_transcript.columns or 'grades' not in df_transcript.columns:
            print("Error: Please check the student's transcript xlsx file.")
            print(
                " There must be course_chinese, credits and grades in student's course excel file.")
            sys.exit(1)
    elif analysis_lang == 'en':
        if 'course_english' not in df_transcript.columns or 'credits' not in df_transcript.columns or 'grades' not in df_transcript.columns:
            print("Error: Please check the student's transcript xlsx file.")
            print(
                " There must be course_english, credits and grades in student's course excel file.")
            sys.exit(1)


def CheckDBFormat(df_database):
    if 'all_course_chinese' not in df_database.columns:
        print("Error: Please check the database xlsx file.")
        sys.exit(1)


def isOutputEnglish(df_transcript):

    if ~df_transcript['course_english'].isnull().any():
        # output English version
        print("Output English Version")
        return True

    # print(df_transcript['course_chinese'].isnull().any())
    if ~df_transcript['course_chinese'].isnull().any():
        print("Output Chinese Version")
        return False  # output CHinese version

    print("course_english course_chinese credits 和 grades not match. Please make sure you fill the template correctly")
    sys.exit(1)


def DataPreparation(df_database, df_transcript):
    df_database['all_course_chinese'] = df_database['all_course_chinese'].fillna(
        '-')
    if 'all_course_english' in df_database.columns:
        df_database['all_course_english'] = df_database['all_course_english'].str.lower()
    # unify course naming convention
    if 'course_chinese' in df_transcript.columns:
        df_transcript = Naming_Convention_ZH(df_transcript)
    if 'course_english' in df_transcript.columns:
        df_transcript = Naming_Convention_EN(df_transcript)

    df_transcript = Credits_Preprocessing(df_transcript)
    df_transcript = Grades_Preprocessing(df_transcript)

    df_transcript['credits'] = df_transcript['credits'].astype(
        float, errors='ignore')
    df_transcript['grades'] = df_transcript['grades'].astype(
        float, errors='ignore')
    print("Prepared data successfully.")
    return df_database, df_transcript


def Credits_Preprocessing(df_course):
    # modify data in the same
    df_course['credits'] = df_course['credits'].fillna(0)
    return df_course


def Grades_Preprocessing(df_course):
    # modify data in the same
    df_course['grades'] = df_course['grades'].fillna('-')
    return df_course


def Naming_Convention_ZH(df_course):
    # modify data in the same, lowercase even for Chinese name!
    df_course['course_chinese'] = df_course['course_chinese'].fillna(
        '-').str.lower()

    # Create a mapping for replacements
    replacements = {
        '+': '＋',
        '1': '一',
        '2': '二',
        '3': '三',
        '(': '',
        '（': '',
        ')': '',
        '）': '',
        ' ': ''
    }

    # Apply replacements using a single loop
    for old, new in replacements.items():
        df_course['course_chinese'] = df_course['course_chinese'].str.replace(
            old, new, regex=False)

    return df_course


def Naming_Convention_EN(df_course):
    # Fill NaN values and convert to lowercase
    df_course['course_english'] = df_course['course_english'].fillna(
        '-').str.lower()

    # Create a mapping for replacements
    replacements = {
        '+': '＋',
        '(': '',
        '（': '',
        ')': '',
        '）': ''
    }

    # Apply replacements using a single loop
    for old, new in replacements.items():
        df_course['course_english'] = df_course['course_english'].str.replace(
            old, new, regex=False)

    return df_course


# mapping courses to target programs category
def CoursesToProgramCategoryMapping(df_PROG_SPEC_CATES, program_category_map, transcript_sorted_group_list, df_transcript_array_temp, isSuggestionCourse):
    for idx, trans_cat in enumerate(df_transcript_array_temp):
        # append sorted courses to program's category
        categ = program_category_map[idx]['Program_Category']
        trans_cat.rename(
            columns={transcript_sorted_group_list[idx]: categ}, inplace=True)
        # find the idx corresponding to program's category
        idx_temp = -1
        for idx2, cat in enumerate(df_PROG_SPEC_CATES):
            if categ == cat.columns[0]:
                idx_temp = idx2
                break
        # remove the redundant suggestion courses mapping to "Others" because those categories in Others are not advanced courses.
        if isSuggestionCourse:
            if idx != len(df_transcript_array_temp) - 1 and idx_temp == len(df_PROG_SPEC_CATES) - 1:
                continue
        df_PROG_SPEC_CATES[idx_temp] = pd.concat(
            [df_PROG_SPEC_CATES[idx_temp], trans_cat])
    return df_PROG_SPEC_CATES


# mapping courses to target programs category
def CoursesToProgramCategoryMappingNew(df_PROG_SPEC_CATES, program_category, baseCategoryToProgramMapping, transcript_sorted_group_list, df_transcript_array_temp, isSuggestionCourse):

    # ['GENERAL_PHYSICS', 'EE_ADVANCED_PHYSICS',...]
    # print(transcript_sorted_group_list)
    # [{'Program_Category': 'Mathematics', 'Required_ECTS': 28, 'Keywords_Group': ['CALCULUS', 'ME_MATH']}, {'Program_Category': 'Physics', 'Required_ECTS': 10, 'Keywords_Group': ['GENERAL_PHYSICS', 'EE_ADVANCED_PHYSICS', 'PHYSICS_EXP']}, {'Program_Category': 'Programming and Computer science', 'Required_ECTS': 12, 'Keywords_Group': ['EE_INTRO_COMPUTER_SCIENCE', 'PROGRAMMING_LANGUAGE', 'SOFTWARE_ENGINEERING']}, {'Program_Category': 'System_Theory', 'Required_ECTS': 8, 'Keywords_Group': ['CONTROL_THEORY']}, {'Program_Category': 'Electronics and Circuits Module', 'Required_ECTS': 34, 'Keywords_Group': ['ELECTRONICS', 'ELECTRONICS_EXPERIMENT', 'ELECTRO_CIRCUIT', 'SIGNAL_SYSTEM', 'ELECTRO_MAGNET']}, {'Program_Category': 'Theoretical_Module_EECS', 'Required_ECTS': 8, 'Keywords_Group': ['EE_HF_RF_THEO_INFO']}, {'Program_Category': 'Application_Module_EECS', 'Required_ECTS': 20, 'Keywords_Group': ['POWER_ELECTRONICS', 'COMMUNICATION_ENGINEERING', 'EE_ADVANCED_ELECTRO', 'EE_APPLICATION_ORIENTED']}, {'Program_Category': 'Others', 'Required_ECTS': 0, 'Keywords_Group': []}]
    # print(program_category)
    # df array, Columns: [MECHANIK, credits, grades] Index: [], Empty DataFrame,  || Columns: [建議修課] Index: [], Empty DataFrame
    # print(df_transcript_array_temp)

    for idx, trans_cat in enumerate(df_transcript_array_temp):
        # append sorted courses to program's category
        # print(transcript_sorted_group_list[idx])
        # Use .get() to avoid KeyError and provide a default value if the key is not found
        categ = baseCategoryToProgramMapping.get(
            transcript_sorted_group_list[idx], None)

        if categ is not None:
            # Continue with your logic if the category is found
            # (append courses, etc.)
            trans_cat.rename(
                columns={transcript_sorted_group_list[idx]: categ['program_category']}, inplace=True)
            # find the idx corresponding to program's category
            idx_temp = -1
            for idx2, cat in enumerate(df_PROG_SPEC_CATES):
                if categ['program_category'] == cat.columns[0]:
                    idx_temp = idx2
                    break
            # remove the redundant suggestion courses mapping to "Others" because those categories in Others are not advanced courses.
            if isSuggestionCourse:
                if idx != len(df_transcript_array_temp) - 1 and idx_temp == len(df_PROG_SPEC_CATES) - 1:
                    continue
            df_PROG_SPEC_CATES[idx_temp] = pd.concat(
                [df_PROG_SPEC_CATES[idx_temp], trans_cat])
        else:
            print(
                f"Key {transcript_sorted_group_list[idx]} not found in baseCategoryToProgramMapping")

    return df_PROG_SPEC_CATES


# course sorting
def CourseSorting(df_transcript, df_category_data, transcript_sorted_group_map, column_name_en_zh):
    df_transcript['grades'] = df_transcript['grades'].astype(
        float, errors='ignore')
    for idx, subj in enumerate(df_transcript[column_name_en_zh]):
        if subj == '-':
            continue
        for idx2, cat in enumerate(transcript_sorted_group_map):
            # Put the rest of courses to Others
            if (idx2 == len(transcript_sorted_group_map) - 1):
                temp_string = df_transcript['grades'][idx]
                temp0 = 0
                if temp_string is None:
                    temp0 = {cat: subj, 'credits': df_transcript['credits'][idx],
                             'grades': df_transcript['grades'][idx]}
                else:
                    if isfloat(temp_string):
                        temp0 = {cat: subj, 'credits': df_transcript['credits'][idx],
                                 'grades': float(df_transcript['grades'][idx])}
                    else:
                        temp0 = {cat: subj, 'credits': df_transcript['credits'][idx],
                                 'grades': df_transcript['grades'][idx]}

                df_temp0 = pd.DataFrame(data=temp0, index=[0])
                if not df_temp0.empty:
                    df_category_data[idx2] = pd.concat(
                        [df_category_data[idx2], df_temp0])
                continue

            # filter subject by keywords. and exclude subject by anti_keywords
            if any(keywords in subj for keywords in transcript_sorted_group_map[cat][KEY_WORDS] if not any(anti_keywords in subj for anti_keywords in transcript_sorted_group_map[cat][ANTI_KEY_WORDS])):
                temp_string = df_transcript['grades'][idx]
                temp = 0
                if temp_string is None:
                    temp = {cat: subj, 'credits': float(df_transcript['credits'][idx]),
                            'grades': df_transcript['grades'][idx]}
                else:
                    # failed subject not count
                    if ((isfloat(temp_string) and float(temp_string) < 60 and float(temp_string) and float(temp_string) > 4.5)
                            or "Fail" in str(temp_string) or "W" in str(temp_string) or "F" in str(temp_string) or "fail" in str(temp_string) or "退選" in str(temp_string) or "withdraw" in str(temp_string)):
                        continue
                    if isfloat(temp_string):
                        temp = {cat: subj, 'credits': float(df_transcript['credits'][idx]),
                                'grades': float(df_transcript['grades'][idx])}
                    else:
                        temp = {cat: subj, 'credits': float(df_transcript['credits'][idx]),
                                'grades': df_transcript['grades'][idx]}
                df_temp = pd.DataFrame(data=temp, index=[0])
                if not df_temp.empty:
                    df_category_data[idx2] = pd.concat(
                        [df_category_data[idx2], df_temp])
                break
    return df_category_data


def DatabaseCourseSorting(df_database, df_category_courses_sugesstion_data, transcript_sorted_group_map, column_name_en_zh):
    for idx, subj in enumerate(df_database[column_name_en_zh]):
        if subj == '-':
            continue
        for idx2, cat in enumerate(transcript_sorted_group_map):
            # Put the rest of courses to Others
            if (idx2 == len(transcript_sorted_group_map) - 1):
                temp = {'建議修課': subj}
                df_temp = pd.DataFrame(data=temp, index=[0])
                df_category_courses_sugesstion_data[idx2] = pd.concat(
                    [df_category_courses_sugesstion_data[idx2], df_temp])
                continue

            # filter database by keywords. and exclude subject by anti_keywords
            if any(keywords in subj for keywords in transcript_sorted_group_map[cat][KEY_WORDS] if not any(anti_keywords in subj for anti_keywords in transcript_sorted_group_map[cat][ANTI_KEY_WORDS])):
                temp = {'建議修課': subj}
                df_temp = pd.DataFrame(data=temp, index=[0])
                df_category_courses_sugesstion_data[idx2] = pd.concat(
                    [df_category_courses_sugesstion_data[idx2], df_temp])
                break
    return df_category_courses_sugesstion_data


def AppendCreditsCount(df_PROG_SPEC_CATES, program_category):
    for idx, trans_cat in enumerate(df_PROG_SPEC_CATES):
        df_PROG_SPEC_CATES[idx]['credits'] = df_PROG_SPEC_CATES[idx]['credits'].astype(
            float, errors='ignore')
        credit_sum = df_PROG_SPEC_CATES[idx]['credits'].sum()
        category_credits_sum = {
            trans_cat.columns[0]: "sum", 'credits': credit_sum}
        df_category_credits_sum = pd.DataFrame(
            data=category_credits_sum, index=[0])
        df_PROG_SPEC_CATES[idx] = pd.concat(
            [df_PROG_SPEC_CATES[idx], df_category_credits_sum])
        category_credits_sum = {trans_cat.columns[0]: "ECTS轉換", 'credits': 1.5 *
                                credit_sum, 'Required_ECTS': program_category[idx]['Required_ECTS']}
        df_category_credits_sum = pd.DataFrame(
            data=category_credits_sum, index=[0])
        df_PROG_SPEC_CATES[idx] = pd.concat(
            [df_PROG_SPEC_CATES[idx], df_category_credits_sum])
    return df_PROG_SPEC_CATES


def WriteToExcel(writer, program_name, program_category, baseCategoryToProgramMapping, transcript_sorted_group_map, df_transcript_array_temp, df_category_courses_sugesstion_data_temp, column_len_array):
    df_PROG_SPEC_CATES, df_PROG_SPEC_CATES_COURSES_SUGGESTION = ProgramCategoryInit(
        program_category)
    transcript_sorted_group_list = list(transcript_sorted_group_map)

    # Courses: mapping the students' courses to program-specific category
    df_PROG_SPEC_CATES = CoursesToProgramCategoryMappingNew(
        df_PROG_SPEC_CATES, program_category, baseCategoryToProgramMapping, transcript_sorted_group_list, df_transcript_array_temp, False)

    # Suggestion courses: mapping the sugesstion courses to program-specific category
    df_PROG_SPEC_CATES_COURSES_SUGGESTION = CoursesToProgramCategoryMappingNew(
        df_PROG_SPEC_CATES_COURSES_SUGGESTION, program_category, baseCategoryToProgramMapping, transcript_sorted_group_list, df_category_courses_sugesstion_data_temp, True)

    # append 總credits for each program category
    df_PROG_SPEC_CATES = AppendCreditsCount(
        df_PROG_SPEC_CATES, program_category)

    # drop the Others, 建議修課
    # for idx, trans_cat in enumerate(df_PROG_SPEC_CATES_COURSES_SUGGESTION):
    #     if(idx == len(df_PROG_SPEC_CATES_COURSES_SUGGESTION) - 1):
    #         df_PROG_SPEC_CATES_COURSES_SUGGESTION[idx].drop(
    #             columns=['Others', '建議修課'], inplace=True)

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
    # red_out_insufficient_credit(workbook, worksheet)

    for df in df_PROG_SPEC_CATES:
        for i, col in enumerate(df.columns):
            # set the column length
            worksheet.set_column(i, i, column_len_array[i] * 2)
    gc.collect()  # Forced GC
    print("Save to " + program_name)


def Classifier(courses_arr, courses_db, basic_classification_en, basic_classification_zh, column_len_array, studentId, student_name, analysis_language):
    df_transcript = pd.DataFrame.from_dict(courses_arr)
    # TODO: move the checking mechanism to util.py!
    # Verify the format of transcript_course_list.xlsx
    CheckTemplateFormat(df_transcript, analysis_language)
    print("Checked input template successfully.")

    df_database = pd.DataFrame.from_dict(courses_db)
    # # Verify the format of Course_database.xlsx
    CheckDBFormat(df_database)
    print("Checked database successfully.")

    # Englist_Version = isOutputEnglish(df_transcript)
    # TODO: data validation

    # Data preparation
    df_database, df_transcript = DataPreparation(df_database, df_transcript)

    sorted_courses = []
    transcript_sorted_group_map = {}

    if analysis_language == 'en':
        transcript_sorted_group_map = basic_classification_en
    elif analysis_language == 'zh':  # Traditional Chinese
        transcript_sorted_group_map = basic_classification_zh
    else:
        transcript_sorted_group_map = basic_classification_zh

    category_data = []
    df_category_data = []
    category_courses_sugesstion_data = []
    df_category_courses_sugesstion_data = []
    for idx, cat in enumerate(transcript_sorted_group_map):
        category_data = {cat: [], 'credits': [], 'grades': []}
        df_category_data.append(pd.DataFrame(data=category_data))
        df_category_courses_sugesstion_data.append(
            pd.DataFrame(data=category_courses_sugesstion_data, columns=['建議修課']))

    if analysis_language in ['en', None]:
        # 基本分類課程 (與申請學程無關)
        df_category_data = CourseSorting(
            df_transcript, df_category_data, transcript_sorted_group_map, "course_english")
        # 基本分類電機課程資料庫
        df_category_courses_sugesstion_data = DatabaseCourseSorting(
            df_database, df_category_courses_sugesstion_data, transcript_sorted_group_map, "all_course_english")
    else:
        # 基本分類課程 (與申請學程無關)
        df_category_data = CourseSorting(
            df_transcript, df_category_data, transcript_sorted_group_map, "course_chinese")
        # 基本分類電機課程資料庫
        df_category_courses_sugesstion_data = DatabaseCourseSorting(
            df_database, df_category_courses_sugesstion_data, transcript_sorted_group_map, "all_course_chinese")

    for idx, cat in enumerate(df_category_data):
        df_category_courses_sugesstion_data[idx]['建議修課'] = df_category_courses_sugesstion_data[idx]['建議修課'].str.replace(
            '(', '', regex=False)
        df_category_courses_sugesstion_data[idx]['建議修課'] = df_category_courses_sugesstion_data[idx]['建議修課'].str.replace(
            ')', '', regex=False)

    # 樹狀篩選 微積分:[一,二] 同時有含 微積分、一  的，就從recommendation拿掉
    # algorithm :
    df_category_courses_sugesstion_data = SuggestionCourseAlgorithm(
        df_category_data, transcript_sorted_group_map, df_category_courses_sugesstion_data)

    sorted_courses = df_category_data

    with io.BytesIO() as output:
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            start_row = 0
            for idx, sortedcourses in enumerate(sorted_courses):
                if sortedcourses.empty:
                    print(f"Skipping empty DataFrame at index {idx}")
                    continue  # Skip to the next DataFrame if empty
                sortedcourses.to_excel(
                    writer, sheet_name='General', startrow=start_row, index=False)
                start_row += len(sortedcourses.index) + 2
            workbook = writer.book
            worksheet = writer.sheets['General']

            red_out_failed_subject(workbook, worksheet, 1, start_row)

            for i, col in enumerate(df_transcript.columns):
                # find length of column i

                column_len = df_transcript[col].astype(str).str.len().max()
                # Setting the length if the column header is larger
                # than the max column value length
                if i == 1:
                    column_len_array.append(len(col))
                else:
                    column_len_array.append(max(column_len, len(col)))

                # set the column length
                worksheet.set_column(i, i, column_len_array[i] * 2)
                # Modify to column width for "Required_ECTS"
                column_len_array.append(6)

            programs = get_programs_analysis_collection_mock()
            
            for idx, program in enumerate(programs):
                createSheet(
                    transcript_sorted_group_map,
                    sorted_courses,
                    df_category_courses_sugesstion_data,
                    writer, program)

        data = output.getvalue()

    BASEDIR = os.path.abspath(os.path.dirname(__file__))
    # TODO: change in production
    full_path = os.path.join(BASEDIR, '..\..\.env.development')
    load_dotenv(full_path)

    AWS_S3_BUCKET_NAME = os.environ.get("AWS_S3_BUCKET_NAME")
    AWS_S3_ACCESS_KEY_ID = os.environ.get("AWS_S3_ACCESS_KEY_ID")
    AWS_S3_ACCESS_KEY = os.environ.get("AWS_S3_ACCESS_KEY")
    session = boto3.Session(
        aws_access_key_id=AWS_S3_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_S3_ACCESS_KEY,
    )
    s3 = session.resource('s3')
    transcript_path = studentId + '/analysed_transcript_' + student_name + '.xlsx'
    s3.Bucket(AWS_S3_BUCKET_NAME).put_object(Key=transcript_path, Body=data)
    # sys.exit(0)


def convertingKeywordsSetArrayToObject(program_category):
    # Initialize an empty dictionary to store the results
    baseCategoryToProgramMapping = {}

    # Iterate over each program category
    for program in program_category:
        category = program['Program_Category']
        ects = program['Required_ECTS']

        # Iterate over each keyword in the Keywords_Group
        for keyword in program['Keywords_Group']:
            # Add the keyword to the dictionary with its corresponding program category and ECTS
            baseCategoryToProgramMapping[keyword] = {
                'program_category': category,
                'Required_ECTS': ects
            }
    return baseCategoryToProgramMapping


def createSheet(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer, program):
    program_name = program['program_name']
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

    # This fixed to program course category.
    program_category = program['program_category']

    all_keywords = [
        keyword for program in program_category for keyword in program['Keywords_Group']]

    # Main array
    transcript_sorted_group_list = list(transcript_sorted_group_map)

    # Convert to set and use difference
    transcript_sorted_group_list_others = list(set(transcript_sorted_group_list) -
                                               set(all_keywords))

    program_category.append({
        'Program_Category': 'Others', 'Required_ECTS': 0,
        "Keywords_Group": transcript_sorted_group_list_others}  # 其他
    )

    # Iterate over each program category
    baseCategoryToProgramMapping = convertingKeywordsSetArrayToObject(
        program_category)

    #####################################################################
    ####################### End #########################################
    #####################################################################

    WriteToExcel(writer, program_name, program_category, baseCategoryToProgramMapping,
                 transcript_sorted_group_map, df_transcript_array_temp, df_category_courses_sugesstion_data_temp, column_len_array)

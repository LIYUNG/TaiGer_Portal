import pandas as pd

KEY_WORDS = 0
ANTI_KEY_WORDS = 1
DIFFERENTIATE_KEY_WORDS = 2

# naming convention


def isfloat(value):
    try:
        float(value)
        return True
    except ValueError:
        return False


def ProgramCategoryInit(program_category):
    df_PROG_SPEC_CATES = []
    df_PROG_SPEC_CATES_COURSES_SUGGESTION = []
    for idx, cat in enumerate(program_category):
        PROG_SPEC_CAT = {cat['Program_Category']: [],
                         '學分': [], '成績': [], 'Required_CP': cat['Required_CP']}
        PROG_SPEC_CATES_COURSES_SUGGESTION = {cat['Program_Category']: [],
                                              }
        df_PROG_SPEC_CATES.append(pd.DataFrame(data=PROG_SPEC_CAT))
        df_PROG_SPEC_CATES_COURSES_SUGGESTION.append(
            pd.DataFrame(data=PROG_SPEC_CATES_COURSES_SUGGESTION))
    return df_PROG_SPEC_CATES, df_PROG_SPEC_CATES_COURSES_SUGGESTION


def Naming_Convention(df_course):
    # modify data in the same
    df_course['所修科目'] = df_course['所修科目'].fillna('-')

    df_course['所修科目'] = df_course['所修科目'].str.replace(
        '1', '一', regex=False)
    df_course['所修科目'] = df_course['所修科目'].str.replace(
        '2', '二', regex=False)
    df_course['所修科目'] = df_course['所修科目'].str.replace(
        '3', '三', regex=False)
    df_course['所修科目'] = df_course['所修科目'].str.replace(
        '(', '', regex=False)
    df_course['所修科目'] = df_course['所修科目'].str.replace(
        '（', '', regex=False)
    df_course['所修科目'] = df_course['所修科目'].str.replace(
        ')', '', regex=False)
    df_course['所修科目'] = df_course['所修科目'].str.replace(
        '）', '', regex=False)
    df_course['所修科目'] = df_course['所修科目'].str.replace(
        ' ', '', regex=False)
    return df_course


# mapping courses to target programs category
def CoursesToProgramCategoryMapping(df_PROG_SPEC_CATES, program_category_map, transcript_sorted_group_list, df_transcript_array_temp):
    for idx, trans_cat in enumerate(df_transcript_array_temp):
        # append sorted courses to program's category
        categ = program_category_map[idx]['Program_Category']
        trans_cat.rename(
            columns={transcript_sorted_group_list[idx]: categ}, inplace=True)
        # find the idx corresponding to program's category
        idx_temp = -1
        for idx2, cat in enumerate(df_PROG_SPEC_CATES):
            if categ == cat.columns[0]:
                print(cat.columns[0])
                idx_temp = idx2
                break
        df_PROG_SPEC_CATES[idx_temp] = df_PROG_SPEC_CATES[idx_temp].append(
            trans_cat, ignore_index=True)
    return df_PROG_SPEC_CATES


# course sorting
def CourseSorting(df_transcript, df_category_data, transcript_sorted_group_map):
    for idx, subj in enumerate(df_transcript['所修科目']):
        if subj == '-':
            continue
        for idx2, cat in enumerate(transcript_sorted_group_map):
            # Put the rest of courses to Others
            if(idx2 == len(transcript_sorted_group_map) - 1):
                temp = {cat: subj, '學分': df_transcript['學分'][idx],
                        '成績': df_transcript['成績'][idx]}
                df_category_data[idx2] = df_category_data[idx2].append(
                    temp, ignore_index=True)
                continue
            # filter subject by keywords. and exclude subject by anti_keywords
            if any(keywords in subj for keywords in transcript_sorted_group_map[cat][KEY_WORDS] if not any(anti_keywords in subj for anti_keywords in transcript_sorted_group_map[cat][ANTI_KEY_WORDS])):
                temp_string = str(df_transcript['成績'][idx])
                if((isfloat(temp_string) and float(temp_string) < 60)):  # failed subject not count
                    continue
                temp = {cat: subj, '學分': df_transcript['學分'][idx],
                        '成績': df_transcript['成績'][idx]}
                df_category_data[idx2] = df_category_data[idx2].append(
                    temp, ignore_index=True)
                break
    return df_category_data


def DatabaseCourseSorting(df_database, df_category_courses_sugesstion_data, transcript_sorted_group_map):
    for idx, subj in enumerate(df_database['所有科目']):
        if subj == '-':
            continue
        for idx2, cat in enumerate(transcript_sorted_group_map):
            # Put the rest of courses to Others
            if(idx2 == len(transcript_sorted_group_map) - 1):
                temp = {'建議修課': subj}
                df_category_courses_sugesstion_data[idx2] = df_category_courses_sugesstion_data[idx2].append(
                    temp, ignore_index=True)
                continue

            # filter database by keywords. and exclude subject by anti_keywords
            if any(keywords in subj for keywords in transcript_sorted_group_map[cat][KEY_WORDS] if not any(anti_keywords in subj for anti_keywords in transcript_sorted_group_map[cat][ANTI_KEY_WORDS])):
                temp = {'建議修課': subj}
                df_category_courses_sugesstion_data[idx2] = df_category_courses_sugesstion_data[idx2].append(
                    temp, ignore_index=True)
                break
    return df_category_courses_sugesstion_data


def AppendCreditsCount(df_PROG_SPEC_CATES, program_category):
    for idx, trans_cat in enumerate(df_PROG_SPEC_CATES):
        category_credits_sum = {'學分': df_PROG_SPEC_CATES[idx]['學分'].sum(
        ), 'Required_CP': program_category[idx]['Required_CP']}
        df_PROG_SPEC_CATES[idx] = df_PROG_SPEC_CATES[idx].append(
            category_credits_sum, ignore_index=True)
    return df_PROG_SPEC_CATES

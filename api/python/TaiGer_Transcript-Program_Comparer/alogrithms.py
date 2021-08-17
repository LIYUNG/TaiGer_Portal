KEY_WORDS = 0
ANTI_KEY_WORDS = 1
DIFFERENTIATE_KEY_WORDS = 2


# Pseudo code for algorithm:
# for each category
# {
#   if(check if differentiation needed)
#   {
#      Find_the the keywords idx in keywords array
#      Find_the the idx in differentiation array (一 or 二) DIFFERENTIATE_KEY_WORDS
#      remove the course in recommendation course in the category based on both keyword and differentiation
#   }
#   else
#   {
#
#       remove the course in recommendation course in the category based on keyword and keywords in database towwards sutdent's courses.
#   }

def SuggestionCourseAlgorithm(df_category_data, transcript_sorted_group_map, df_category_courses_sugesstion_data):
    for idx, cat in enumerate(df_category_data):
        temp_array = cat[cat.columns[0]].tolist()
        # if 3, check 一 or 二, otherwise, not to screen  一 and 二
        if len(transcript_sorted_group_map[cat.columns[0]]) == 3:
            for course_name in temp_array:
                # Find_the the keywords idx in keywords array
                keyword = '-'
                for keywords in transcript_sorted_group_map[cat.columns[0]][KEY_WORDS]:
                    # print(keywords)
                    if keywords in course_name:
                        keyword = keywords
                        break
                # Find_the the idx in differentiation array (一 or 二) DIFFERENTIATE_KEY_WORDS
                dif = '-'
                for diff in transcript_sorted_group_map[cat.columns[0]][DIFFERENTIATE_KEY_WORDS]:
                    # print(diff)
                    if diff in course_name:
                        dif = diff
                        break

                # remove the course in recommendation course in the category based on both keyword and differentiation
                if keyword != '-' and dif != '-':
                    df_category_courses_sugesstion_data[idx] = df_category_courses_sugesstion_data[idx][
                        ~(df_category_courses_sugesstion_data[idx]['建議修課'].str.contains(keyword) & df_category_courses_sugesstion_data[idx]['建議修課'].str.contains(dif))]
                else:
                    df_category_courses_sugesstion_data[idx] = df_category_courses_sugesstion_data[idx][
                        ~(df_category_courses_sugesstion_data[idx]['建議修課'].str.contains(course_name))]  # also remove the same course name from database
        else:
            # screening the course in suggestion courses in the category based on keyword of taken courses themselves and suggestion courses as keywords in taken courses.
            for course_name in temp_array:
                df_category_courses_sugesstion_data[idx] = df_category_courses_sugesstion_data[idx][
                    ~(df_category_courses_sugesstion_data[idx]['建議修課'].str.contains(course_name))]  # also remove the same course name from database
                # also: name contains keyword from suggestion course, delete them in suggestion course
                for suggestion_course in df_category_courses_sugesstion_data[idx]['建議修課']:
                    if suggestion_course in course_name:
                        df_category_courses_sugesstion_data[idx] = df_category_courses_sugesstion_data[idx][
                            ~(df_category_courses_sugesstion_data[idx]['建議修課'].str.contains(suggestion_course))]  # also remove the same course name from database
    return df_category_courses_sugesstion_data

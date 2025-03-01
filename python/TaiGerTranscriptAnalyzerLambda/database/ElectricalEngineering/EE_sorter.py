from CourseSuggestionAlgorithms import *
from util import *
from keywords import *
from globals import column_len_array
from database.ElectricalEngineering.EE_Course_db import ee_course_db
import os
from db import get_keywords_collection, convert_courses

env_file_path = os.path.realpath(__file__)
env_file_path = os.path.dirname(env_file_path)


def EE_sorter(course_arr, studentId, student_name, analysis_language):
    # Preprocess data to convert to desired structure
    processed_data = get_keywords_collection()

    # Generate all classification dynamically
    basic_classification_en = convert_courses(processed_data, 'en')
    basic_classification_zh = convert_courses(processed_data, 'zh')

    Classifier(course_arr, ee_course_db,
               basic_classification_en, basic_classification_zh, column_len_array, studentId, student_name, analysis_language)

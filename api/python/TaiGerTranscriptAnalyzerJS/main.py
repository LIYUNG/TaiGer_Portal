# import numpy as np
import sys
import json
import os
import pandas as pd
from database.Biology.BIO_sorter import BIO_sorter
from database.BiomedicalEngineering.BOE_sorter import BOE_sorter
from database.Chemistry.CMY_sorter import CMY_sorter
from database.ElectricalEngineering.EE_sorter import EE_sorter
from database.ComputerScience.CS_sorter import CS_sorter
from database.Forest.FOR_sorter import FOR_sorter
from database.Mathematics.MATH_sorter import MATH_sorter
from database.MechanicalEngineering.ME_sorter import ME_sorter
from database.MaterialsScience.MTL_sorter import MTL_sorter
from database.Physics.PHY_sorter import PHY_sorter
from database.Psychology.PSY_sorter import PSY_sorter
from database.Management.MGM_sorter import MGM_sorter
from database.DataScience_BusinessIntelligence.DSBI_sorter import DSBI_sorter
from database.TransportationEngineering.TE_sorter import TE_sorter

file_path = os.path.realpath(__file__)
file_path = os.path.dirname(file_path)


def analyze_transcript(str_courses, category, student_id, student_name, language, str_courses_taiger_guided, requirement_ids="[]"):
    print("--------------------------")
    print("New Transcript Analyser")
    print("Python version:")
    print(sys.version)
    print("--------------------------")
    print(str_courses)
    ## print course:
    course = json.loads(str_courses)
    course_arr = json.loads(course)
    courses_taiger_guided = json.loads(str_courses_taiger_guided)
    courses_taiger_guided_arr = json.loads(courses_taiger_guided)
    requirement_ids_arr = json.loads(requirement_ids)
    print(requirement_ids)
    print("requirement_ids_arr", requirement_ids_arr)

    course_arr = course_arr + courses_taiger_guided_arr
    # print(obj_arr)
    # for obj in obj_arr:
    #     print(obj['course_chinese'])
    program_idx = []
    program_selection_path = ''
    program_group_to_file_path = {
        'bio': '/database/Biology/BIO_Programs.xlsx', # TODO
        'cs': '/database/ComputerScience/CS_Programs.xlsx',
        'boe': '/database/BiomedicalEngineering/BOE_Programs.xlsx',
        'cmy': '/database/Chemistry/CMY_Programs.xlsx', # TODO
        'dsbi': '/database/DataScience_BusinessIntelligence/DSBI_Programs.xlsx',
        'ee': '/database/ElectricalEngineering/EE_Programs.xlsx',
        'for': '/database/Forest/FOR_Programs.xlsx',
        'math': '/database/Mathematics/MATH_Programs.xlsx', # TODO
        'me': '/database/MechanicalEngineering/ME_Programs.xlsx',
        'mgm': '/database/Management/MGM_Programs.xlsx',
        'phy': '/database/Physics/PHY_Programs.xlsx', # TODO
        'psy': '/database/Psychology/PSY_Programs.xlsx',
        'mtl': '/database/MaterialsScience/MTL_Programs.xlsx',
        'cme': '/database/Materials_Science/CME_Programs.xlsx',
        'te': '/database/TransportationEngineering/TE_Programs.xlsx',
    }
    program_group = category
    if program_group in program_group_to_file_path:
        program_selection_path = file_path + \
            program_group_to_file_path[program_group]
    else:
        print("Please specify program group: cs ee me")
        sys.exit()


    df_programs_selection = pd.read_excel(
        program_selection_path)

    if df_programs_selection.columns[0] != 'Program' or df_programs_selection.columns[1] != 'Choose':
        print("Error: Please check the program selection xlsx file.")
        sys.exit()

    for idx, choose in enumerate(df_programs_selection['Choose']):
        if(choose == 'Yes'):
            program_idx.append(idx) 

    sorter_functions = {
        'bio': BIO_sorter, # TODO
        'cs': CS_sorter,
        'boe': BOE_sorter,
        'dsbi': DSBI_sorter,
        'cmy': CMY_sorter, # TODO
        'ee': EE_sorter,
        'for': FOR_sorter, # TODO
        'math': MATH_sorter, # TODO
        'me': ME_sorter,
        'mtl': MTL_sorter,
        'mgm': MGM_sorter,
        'phy': PHY_sorter,
        'psy': PSY_sorter,
        'te': TE_sorter
    }
    program_code = category
    if program_code in sorter_functions:
        sorter_functions[program_code](program_idx, course_arr, program_code.upper(), student_id, student_name, language)    
    return {str_courses, category, student_id, student_name, language, str_courses_taiger_guided}

if __name__ == "__main__":
    analyze_transcript(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6])
# import numpy as np
import sys
import json
import os
import pandas as pd
from database.BiomedicalEngineering.BOE_sorter import BOE_sorter
from database.ElectricalEngineering.EE_sorter import EE_sorter
from database.ComputerScience.CS_sorter import CS_sorter
from database.MechanicalEngineering.ME_sorter import ME_sorter
from database.MaterialsScience.MTL_sorter import MTL_sorter
from database.Psychology.PSY_sorter import PSY_sorter
from database.Management.MGM_sorter import MGM_sorter
from database.DataScience_BusinessIntelligence.DSBI_sorter import DSBI_sorter
from database.TransportationEngineering.TE_sorter import TE_sorter

file_path = os.path.realpath(__file__)
file_path = os.path.dirname(file_path)

if __name__ == "__main__":
    print("New Transcript Analyser")
    ## print course:
    obj = json.loads(sys.argv[1])
    obj_arr = json.loads(obj)
    # for obj in obj_arr:
    #     print(obj['course_chinese'])
    studentId = sys.argv[3]
    student_name = sys.argv[4]
    analysis_language = sys.argv[5]
    program_idx = []
    program_selection_path = ''
    program_group_to_file_path = {
        'cs': '/database/ComputerScience/CS_Programs.xlsx',
        'boe': '/database/BiomedicalEngineering/BOE_Programs.xlsx',
        'ee': '/database/ElectricalEngineering/EE_Programs.xlsx',
        'me': '/database/MechanicalEngineering/ME_Programs.xlsx',
        'mgm': '/database/Management/MGM_Programs.xlsx',
        'dsbi': '/database/DataScience_BusinessIntelligence/DSBI_Programs.xlsx',
        'psy': '/database/Psychology/PSY_Programs.xlsx',
        'mtl': '/database/MaterialsScience/MTL_Programs.xlsx',
        'cme': '/database/Materials_Science/CME_Programs.xlsx',
        'te': '/database/TransportationEngineering/TE_Programs.xlsx',
    }
    program_group = sys.argv[2]
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
        'cs': CS_sorter,
        'boe': BOE_sorter,
        'ee': EE_sorter,
        'me': ME_sorter,
        'mgm': MGM_sorter,
        'dsbi': DSBI_sorter,
        'psy': PSY_sorter,
        'mtl': MTL_sorter,
        'te': TE_sorter
    }
    program_code = sys.argv[2]
    if program_code in sorter_functions:
        sorter_functions[program_code](program_idx, obj_arr, program_code.upper(), studentId, student_name, analysis_language)
    # else:
        # handle the case where the program code is not recognized
        # maybe raise an exception or log an error message

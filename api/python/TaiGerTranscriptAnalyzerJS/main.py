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
    program_idx = []
    program_selection_path = ''
    if sys.argv[2] == 'cs':
        program_selection_path = file_path + '/database/ComputerScience/CS_Programs.xlsx'
    elif sys.argv[2] == 'boe':
        program_selection_path = file_path + \
            '/database/BiomedicalEngineering/BOE_Programs.xlsx'
    elif sys.argv[2] == 'ee':
        program_selection_path = file_path + \
            '/database/ElectricalEngineering/EE_Programs.xlsx'
    elif sys.argv[2] == 'me':
        program_selection_path = file_path + \
            '/database/MechanicalEngineering/ME_Programs.xlsx'
    elif sys.argv[2] == 'mgm':
        program_selection_path = file_path + '/database/Management/MGM_Programs.xlsx'
    elif sys.argv[2] == 'dsbi':
        program_selection_path = file_path + '/database/DataScience_BusinessIntelligence/DSBI_Programs.xlsx'
    elif sys.argv[2] == 'mtl': # Materials Science
        program_selection_path = file_path + '/database/MaterialsScience/MTL_Programs.xlsx'
    elif sys.argv[2] == 'cme':  # Chemical Engineering
        program_selection_path = file_path + \
            '/database/Materials_Science/CME_Programs.xlsx'
    elif sys.argv[2] == 'te':  # Chemical Engineering
        program_selection_path = file_path + \
            '/database/TransportationEngineering/TE_Programs.xlsx'
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

    # EE_sorter(program_idx, obj_arr, 'EE', studentId)
    if sys.argv[2] == 'cs':
        CS_sorter(program_idx, obj_arr, 'CS', studentId, student_name)
    elif sys.argv[2] == 'boe':
        BOE_sorter(program_idx, obj_arr, 'BOE', studentId, student_name)
    elif sys.argv[2] == 'ee':
        EE_sorter(program_idx, obj_arr, 'EE', studentId, student_name)
    elif sys.argv[2] == 'me':
        ME_sorter(program_idx, obj_arr, 'ME', studentId, student_name)
    elif sys.argv[2] == 'mgm':
        MGM_sorter(program_idx, obj_arr, 'MGM', studentId, student_name)
    elif sys.argv[2] == 'dsbi':
        DSBI_sorter(program_idx, obj_arr, 'DSBI', studentId, student_name)
    elif sys.argv[2] == 'mtl':
        MTL_sorter(program_idx, obj_arr, 'MTL', studentId, student_name)
    elif sys.argv[2] == 'te':
        TE_sorter(program_idx, obj_arr, 'TE', studentId, student_name)

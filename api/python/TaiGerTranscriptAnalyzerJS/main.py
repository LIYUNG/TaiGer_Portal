# import numpy as np
import sys
import json
import os
import pandas as pd
from database.ElectricalEngineering.EE_sorter import *

file_path = os.path.realpath(__file__)
file_path = os.path.dirname(file_path)

if __name__ == "__main__":
    print("New Transcript Analyser")
    ## print course:
    obj = json.loads(sys.argv[1])
    obj_arr = json.loads(obj)
    # for obj in obj_arr:
    #     print(obj['course_chinese'])
        
    program_idx = []
    program_selection_path = ''
    if sys.argv[2] == 'cs':
        program_selection_path = file_path + '/database/ComputerScience/CS_Programs.xlsx'
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

    EE_sorter(program_idx, obj_arr, 'EE')
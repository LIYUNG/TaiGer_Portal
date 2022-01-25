# import numpy as np
import sys
import os
import pandas as pd
from database.ElectricalEngineering.EE_sorter import *
from database.ComputerScience.CS_sorter import *
from database.MechanicalEngineering.ME_sorter import *
from database.MaterialsScience.MTL_sorter import *
from database.Management.MGM_sorter import *
from database.DataScience_BusinessIntelligence.DSBI_sorter import *
from database.TransportationEngineering.TE_sorter import *
file_path = os.path.realpath(__file__)
file_path = os.path.dirname(file_path)

if __name__ == "__main__":

    if(len(sys.argv) == 3):
        print("arg: " + sys.argv[1])  # TODO use sys.argv[1] as filename.xlsx
    else:
        print("Error: Please select the transcript excel as argument")
        print("Please type: ")
        print("python main.py <path_to_courses>.xlsx <cs/ee>")
        sys.exit()

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
    
    print(file_path)

    df_programs_selection = pd.read_excel(
        program_selection_path)

    if df_programs_selection.columns[0] != 'Program' or df_programs_selection.columns[1] != 'Choose':
        print("Error: Please check the program selection xlsx file.")
        sys.exit()

    for idx, choose in enumerate(df_programs_selection['Choose']):
        if(choose == 'Yes'):
            program_idx.append(idx)
            
    if sys.argv[2] == 'cs':
        CS_sorter(program_idx, sys.argv[1], 'CS')
    elif sys.argv[2] == 'ee':
        EE_sorter(program_idx, sys.argv[1], 'EE')
    elif sys.argv[2] == 'me':
        ME_sorter(program_idx, sys.argv[1], 'ME')
    elif sys.argv[2] == 'mgm':
        MGM_sorter(program_idx, sys.argv[1], 'MGM')
    elif sys.argv[2] == 'dsbi':
        DSBI_sorter(program_idx, sys.argv[1], 'DSBI')
    elif sys.argv[2] == 'mtl':
        MTL_sorter(program_idx, sys.argv[1], 'MTL')
    elif sys.argv[2] == 'te':
        TE_sorter(program_idx, sys.argv[1], 'TE')

import xlsxwriter
from CourseSuggestionAlgorithms import *
from util import *
from database.ElectricalEngineering.EE_KEYWORDS import *
from cell_formatter import red_out_failed_subject, red_out_insufficient_credit
import pandas as pd
import sys
import os
env_file_path = os.path.realpath(__file__)
env_file_path = os.path.dirname(env_file_path)

# Global variable:
column_len_array = []


def TUM_EI(transcript_sorted_group_map, df_transcript_array, writer):
    print("Create TUM EI sheet")
    # TODO: implement the mapping from the existing courses to program's requirement
    start_row = 0
    for idx, sortedcourses in enumerate(df_transcript_array):
        sortedcourses.to_excel(
            writer, sheet_name='TUM_EI', startrow=start_row, index=False)
        start_row += len(sortedcourses.index) + 2
    print("Save to TUM_EI")


def RWTH_EI(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'RWTH_Aachen_EI'
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
    PROG_SPEC_MATH_PARAM = {
        'Program_Category': 'Mathematics', 'Required_ECTS': 28}
    PROG_SPEC_PHYSIK_PARAM = {
        'Program_Category': 'Physics', 'Required_ECTS': 10}
    PROG_SPEC_ELEKTROTECHNIK_SCHALTUNGSTECHNIK_PARAM = {
        'Program_Category': 'Electronics and Circuits Module', 'Required_ECTS': 34}
    PROG_SPEC_PROGRAMMIERUNG_PARAM = {
        'Program_Category': 'Programming and Computer science', 'Required_ECTS': 12}
    PROG_SPEC_SYSTEM_THEORIE_PARAM = {
        'Program_Category': 'System_Theory', 'Required_ECTS': 8}
    PROG_SPEC_THEORETICAL_EECS_EI_PARAM = {
        'Program_Category': 'Theoretical_Module_EECS', 'Required_ECTS': 8}
    PROG_SPEC_ANWENDUNG_MODULE_PARAM = {
        'Program_Category': 'Application_Module_EECS', 'Required_ECTS': 20}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_PHYSIK_PARAM,  # 物理
        PROG_SPEC_PROGRAMMIERUNG_PARAM,  # 資訊
        PROG_SPEC_SYSTEM_THEORIE_PARAM,  # 控制系統
        PROG_SPEC_ELEKTROTECHNIK_SCHALTUNGSTECHNIK_PARAM,  # 電子電路電磁
        PROG_SPEC_THEORETICAL_EECS_EI_PARAM,  # 電機專業選修
        PROG_SPEC_ANWENDUNG_MODULE_PARAM,  # 應用科技
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_MATH_PARAM,  # 微積分
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_PHYSIK_PARAM,  # 物理
        PROG_SPEC_PHYSIK_PARAM,  # 物理實驗
        PROG_SPEC_PROGRAMMIERUNG_PARAM,  # 資訊
        PROG_SPEC_PROGRAMMIERUNG_PARAM,  # 程式
        PROG_SPEC_PROGRAMMIERUNG_PARAM,  # 軟體工程
        PROG_SPEC_SYSTEM_THEORIE_PARAM,  # 控制系統
        PROG_SPEC_ELEKTROTECHNIK_SCHALTUNGSTECHNIK_PARAM,  # 電子
        PROG_SPEC_ELEKTROTECHNIK_SCHALTUNGSTECHNIK_PARAM,  # 電子實驗
        PROG_SPEC_ELEKTROTECHNIK_SCHALTUNGSTECHNIK_PARAM,  # 電路
        PROG_SPEC_ELEKTROTECHNIK_SCHALTUNGSTECHNIK_PARAM,  # 信號與系統
        PROG_SPEC_ELEKTROTECHNIK_SCHALTUNGSTECHNIK_PARAM,  # 電磁
        PROG_SPEC_ANWENDUNG_MODULE_PARAM,  # 電力電子
        PROG_SPEC_ANWENDUNG_MODULE_PARAM,  # 通訊
        PROG_SPEC_OTHERS,  # 半導體
        PROG_SPEC_OTHERS,  # 電子材料
        PROG_SPEC_THEORETICAL_EECS_EI_PARAM,  # 進階電磁理論
        PROG_SPEC_ANWENDUNG_MODULE_PARAM,  # 電機專業選修
        PROG_SPEC_ANWENDUNG_MODULE_PARAM,  # 應用科技
        PROG_SPEC_OTHERS,  # 力學,機械
        PROG_SPEC_OTHERS  # 其他
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

    WriteToExcel(writer, program_name, program_category, program_category_map,
                 transcript_sorted_group_map, df_transcript_array_temp, df_category_courses_sugesstion_data_temp, column_len_array)


def STUTTGART_EI(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'STUTTGART_EI'
    print("Create " + program_name + " sheet")
    df_transcript_array_temp = []
    df_category_courses_sugesstion_data_temp = []
    for idx, df in enumerate(df_transcript_array):
        df_transcript_array_temp.append(df.copy())
    for idx, df in enumerate(df_category_courses_sugesstion_data):
        df_category_courses_sugesstion_data_temp.append(df.copy())
    # df_category_courses_sugesstion_data_temp = df_category_courses_sugesstion_data
    #####################################################################
    ############## Program Specific Parameters ##########################
    #####################################################################

    # Create transcript_sorted_group to program_category mapping
    PROG_SPEC_MATH_PARAM = {
        'Program_Category': 'Mathematics', 'Required_ECTS': 24}
    PROG_SPEC_PHY_EXP_PARAM = {
        'Program_Category': 'Physics Experiment', 'Required_ECTS': 6}
    PROG_SPEC_MICROELECTRONICS_PARAM = {
        'Program_Category': 'Microelectronics', 'Required_ECTS': 9}
    PROG_SPEC_INTRO_ELECT_ENG_PROJ_PARAM = {
        'Program_Category': 'Intro. Electrical Engineering and project', 'Required_ECTS': 9}
    PROG_SPEC_INTRO_PROGRAMMING_ENG_PARAM = {
        'Program_Category': 'Intro. Programming and project', 'Required_ECTS': 6}
    PROG_SPEC_INTRO_SOFTWARE_SYSTEM_PARAM = {
        'Program_Category': 'Intro. Software System', 'Required_ECTS': 3}
    PROG_SPEC_ENERGIETECHNIK_PARAM = {
        'Program_Category': 'Energy Technique', 'Required_ECTS': 9}
    PROG_SPEC_SCHALTUNGSTECHNIK_PARAM = {
        'Program_Category': 'Circuits Technology', 'Required_ECTS': 9}
    PROG_SPEC_ELEKTRODYNAMIK_PARAM = {
        'Program_Category': 'Electromagnetics', 'Required_ECTS': 9}
    PROG_SPEC_NACHRICHTENTECHNIK_PARAM = {
        'Program_Category': 'Communication Engineering', 'Required_ECTS': 9}
    # Grundlagen der Informationsverarbeitung
    PROG_SPEC_INTRO_INFOR_VERARBEITUNG_PARAM = {
        'Program_Category': 'Intro. Information processing', 'Required_ECTS': 6}
    PROG_SPEC_SIGNAL_SYSTEM_PARAM = {
        'Program_Category': 'Signals and Systems', 'Required_ECTS': 6}
    PROG_SPEC_SCHWERPUNKTE_PARAM = {        # 電力電子能源系統、自動化控制、通訊與訊號處理、Technische Informatik，微電子光電子、電驅動、感測器系統
        'Program_Category': 'Advanced Modules', 'Required_ECTS': 6}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_PHY_EXP_PARAM,    # 物理實驗
        PROG_SPEC_MICROELECTRONICS_PARAM,  # 微電子
        PROG_SPEC_INTRO_ELECT_ENG_PROJ_PARAM,  # 基礎電子實驗
        PROG_SPEC_INTRO_PROGRAMMING_ENG_PARAM,  # 基礎計算機概論
        # 基礎軟體系統 Objektorientierung, Design pattern 軟體工程理論, UML
        PROG_SPEC_INTRO_SOFTWARE_SYSTEM_PARAM,
        PROG_SPEC_ENERGIETECHNIK_PARAM,         # 能源工程
        PROG_SPEC_SCHALTUNGSTECHNIK_PARAM,      # 電路學
        PROG_SPEC_ELEKTRODYNAMIK_PARAM,         # 電磁學
        PROG_SPEC_NACHRICHTENTECHNIK_PARAM,     # 通訊工程
        PROG_SPEC_INTRO_INFOR_VERARBEITUNG_PARAM,   # 資料處理 資料結構 演算法 數位邏輯
        PROG_SPEC_SIGNAL_SYSTEM_PARAM,          # 訊號與系統
        PROG_SPEC_SCHWERPUNKTE_PARAM,           # 專業選修
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_MATH_PARAM,  # 微積分
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_PHY_EXP_PARAM,  # 物理
        PROG_SPEC_PHY_EXP_PARAM,  # 物理實驗
        PROG_SPEC_INTRO_INFOR_VERARBEITUNG_PARAM,  # 資訊
        PROG_SPEC_INTRO_PROGRAMMING_ENG_PARAM,  # 程式
        PROG_SPEC_INTRO_SOFTWARE_SYSTEM_PARAM,  # 軟體工程
        PROG_SPEC_SCHWERPUNKTE_PARAM,  # 控制系統
        PROG_SPEC_MICROELECTRONICS_PARAM,  # 電子
        PROG_SPEC_INTRO_ELECT_ENG_PROJ_PARAM,  # 電子實驗
        PROG_SPEC_SCHALTUNGSTECHNIK_PARAM,  # 電路
        PROG_SPEC_SIGNAL_SYSTEM_PARAM,  # 訊號系統
        PROG_SPEC_ELEKTRODYNAMIK_PARAM,  # 電磁
        PROG_SPEC_ENERGIETECHNIK_PARAM,  # 電力電子
        PROG_SPEC_NACHRICHTENTECHNIK_PARAM,  # 通訊
        PROG_SPEC_SCHWERPUNKTE_PARAM,  # 半導體
        PROG_SPEC_OTHERS,  # 電子材料
        PROG_SPEC_ELEKTRODYNAMIK_PARAM,  # 進階電磁理論
        PROG_SPEC_SCHWERPUNKTE_PARAM,  # 電機專業選修
        PROG_SPEC_SCHWERPUNKTE_PARAM,  # 應用科技
        PROG_SPEC_OTHERS,  # 力學,機械
        PROG_SPEC_OTHERS  # 其他
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

    WriteToExcel(writer, program_name, program_category, program_category_map,
                 transcript_sorted_group_map, df_transcript_array_temp, df_category_courses_sugesstion_data_temp, column_len_array)


# FPSO: https://portal.mytum.de/archiv/kompendium_rechtsangelegenheiten/fachpruefungsordnungen/2018-56-Neufassung-FPSO-MA-CE-FINAL.pdf
# https://www.ei.tum.de/fileadmin/tueifei/www/Studium_Satzungen_Modullisten_Studienfuehrer/BScEI_Stu_richt_empf.pdf
# https://www.ei.tum.de/fileadmin/tueifei/www/Studium_Satzungen_Modullisten_Studienfuehrer/Modulliste_BSEI_PO20181.pdf
def TUM_MSCE(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'TUM_MSCE'
    print("Create " + program_name + " sheet")
    df_transcript_array_temp = []
    df_category_courses_sugesstion_data_temp = []
    for idx, df in enumerate(df_transcript_array):
        df_transcript_array_temp.append(df.copy())
    for idx, df in enumerate(df_category_courses_sugesstion_data):
        df_category_courses_sugesstion_data_temp.append(df.copy())
    # df_category_courses_sugesstion_data_temp = df_category_courses_sugesstion_data
    #####################################################################
    ############## Program Specific Parameters ##########################
    #####################################################################

    # Create transcript_sorted_group to program_category mapping
    PROG_SPEC_MATH_PARAM = {
        'Program_Category': 'Höhere_Mathematik', 'Required_ECTS': 30}
    PROG_SPEC_GRUNDLAGE_ELEKTROTECHNIK_PARAM = {
        'Program_Category': 'Grundlagen_Elektrotechnik', 'Required_ECTS': 66}
    PROG_SPEC_GRUNDLAGE_KOMMUNIKATIONSTECHNIK_PARAM = {
        'Program_Category': 'Grundlagen_Kommunikationstechnik', 'Required_ECTS': 30}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_GRUNDLAGE_ELEKTROTECHNIK_PARAM,  # 基礎電機電子
        PROG_SPEC_GRUNDLAGE_KOMMUNIKATIONSTECHNIK_PARAM,  # 基礎通訊
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_MATH_PARAM,  # 微積分
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_OTHERS,  # 物理
        PROG_SPEC_OTHERS,  # 物理實驗
        PROG_SPEC_GRUNDLAGE_ELEKTROTECHNIK_PARAM,  # 資訊
        PROG_SPEC_GRUNDLAGE_ELEKTROTECHNIK_PARAM,  # 程式
        PROG_SPEC_OTHERS,  # 軟體工程
        PROG_SPEC_OTHERS,  # 控制系統
        PROG_SPEC_GRUNDLAGE_ELEKTROTECHNIK_PARAM,  # 電子
        PROG_SPEC_GRUNDLAGE_ELEKTROTECHNIK_PARAM,  # 電子實驗
        PROG_SPEC_GRUNDLAGE_ELEKTROTECHNIK_PARAM,  # 電路
        PROG_SPEC_GRUNDLAGE_ELEKTROTECHNIK_PARAM,  # 訊號系統
        PROG_SPEC_GRUNDLAGE_ELEKTROTECHNIK_PARAM,  # 電磁
        PROG_SPEC_GRUNDLAGE_ELEKTROTECHNIK_PARAM,  # 電力電子
        PROG_SPEC_GRUNDLAGE_KOMMUNIKATIONSTECHNIK_PARAM,  # 通訊
        PROG_SPEC_GRUNDLAGE_ELEKTROTECHNIK_PARAM,  # 半導體
        PROG_SPEC_OTHERS,  # 電子材料
        PROG_SPEC_GRUNDLAGE_KOMMUNIKATIONSTECHNIK_PARAM,  # 進階電磁理論
        PROG_SPEC_GRUNDLAGE_KOMMUNIKATIONSTECHNIK_PARAM,  # 電機專業選修
        PROG_SPEC_OTHERS,  # 應用科技
        PROG_SPEC_OTHERS,  # 力學,機械
        PROG_SPEC_OTHERS  # 其他
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

    WriteToExcel(writer, program_name, program_category, program_category_map,
                 transcript_sorted_group_map, df_transcript_array_temp, df_category_courses_sugesstion_data_temp, column_len_array)


def TUM_MSPE(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'TUM_MSPE'
    print("Create " + program_name + " sheet")
    df_transcript_array_temp = []
    df_category_courses_sugesstion_data_temp = []
    for idx, df in enumerate(df_transcript_array):
        df_transcript_array_temp.append(df.copy())
    for idx, df in enumerate(df_category_courses_sugesstion_data):
        df_category_courses_sugesstion_data_temp.append(df.copy())
    # df_category_courses_sugesstion_data_temp = df_category_courses_sugesstion_data
    #####################################################################
    ############## Program Specific Parameters ##########################
    #####################################################################

    # Create transcript_sorted_group to program_category mapping
    PROG_SPEC_MATH_PARAM = {
        'Program_Category': 'Höhere_Mathematik', 'Required_ECTS': 30}
    # Grundlagen der Elektrotechnik, Vertiefung Energietechnik
    # Schaltungstechnik, Elektrische Felder und Wellen,Festkörperphysik und
    # Bauelemente, Hochspannungstechnik und Energie-übertragungstechnik,
    # elektrische Maschinen, etc.
    PROG_SPEC_GRUNDLAGE_ELEKTROTECHNIK_PARAM = {
        'Program_Category': 'Grundlagen_Elektrotechnik', 'Required_ECTS': 45}
    # Grundlagen des Maschinenwesens, Vertiefung Energietechnik
    # (Technische Mechanik, Thermodynamik, Strömungsmechanik,
    # Wärme-und Stoffübertragung, Maschinendynamik, etc.)
    PROG_SPEC_GRUNDLAGE_MASCHINEN_PARAM = {
        'Program_Category': 'Grundlagen_Maschinenwesen', 'Required_ECTS': 45}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_GRUNDLAGE_ELEKTROTECHNIK_PARAM,  # 基礎電機電子
        PROG_SPEC_GRUNDLAGE_MASCHINEN_PARAM,  # 基礎機械
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_MATH_PARAM,  # 微積分
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_OTHERS,  # 物理
        PROG_SPEC_OTHERS,  # 物理實驗
        PROG_SPEC_OTHERS,  # 資訊
        PROG_SPEC_OTHERS,  # 程式
        PROG_SPEC_OTHERS,  # 軟體工程
        PROG_SPEC_OTHERS,  # 控制系統
        PROG_SPEC_GRUNDLAGE_ELEKTROTECHNIK_PARAM,  # 電子
        PROG_SPEC_GRUNDLAGE_ELEKTROTECHNIK_PARAM,  # 電子實驗
        PROG_SPEC_GRUNDLAGE_ELEKTROTECHNIK_PARAM,  # 電路
        PROG_SPEC_GRUNDLAGE_ELEKTROTECHNIK_PARAM,  # 訊號系統
        PROG_SPEC_GRUNDLAGE_ELEKTROTECHNIK_PARAM,  # 電磁
        PROG_SPEC_GRUNDLAGE_ELEKTROTECHNIK_PARAM,  # 電力電子
        PROG_SPEC_OTHERS,  # 通訊
        PROG_SPEC_GRUNDLAGE_ELEKTROTECHNIK_PARAM,  # 半導體
        PROG_SPEC_OTHERS,  # 電子材料
        PROG_SPEC_GRUNDLAGE_ELEKTROTECHNIK_PARAM,  # 進階電磁理論
        PROG_SPEC_GRUNDLAGE_ELEKTROTECHNIK_PARAM,  # 電機專業選修
        PROG_SPEC_OTHERS,  # 應用科技
        PROG_SPEC_GRUNDLAGE_MASCHINEN_PARAM,  # 力學,機械相關
        PROG_SPEC_OTHERS  # 其他
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

    WriteToExcel(writer, program_name, program_category, program_category_map,
                 transcript_sorted_group_map, df_transcript_array_temp, df_category_courses_sugesstion_data_temp, column_len_array)

# TODO: to finish it/ or move this program to biology related
# https://portal.mytum.de/archiv/kompendium_rechtsangelegenheiten/fachpruefungsordnungen/2020-98-FPSO-Ma-Neuroengineering-FINAL-22-12-2020.pdf/download


def TUM_MSNE(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'TUM_MSNE'
    print("Create " + program_name + " sheet")
    df_transcript_array_temp = []
    df_category_courses_sugesstion_data_temp = []
    for idx, df in enumerate(df_transcript_array):
        df_transcript_array_temp.append(df.copy())
    for idx, df in enumerate(df_category_courses_sugesstion_data):
        df_category_courses_sugesstion_data_temp.append(df.copy())
    # df_category_courses_sugesstion_data_temp = df_category_courses_sugesstion_data
    #####################################################################
    ############## Program Specific Parameters ##########################
    #####################################################################

    # Create transcript_sorted_group to program_category mapping
    PROG_SPEC_MATH_PARAM = {
        'Program_Category': 'Höhere_Mathematik', 'Required_ECTS': 32}
    # Naturwissenschaftliche Grundlagen (Physik, Biochemie, Neuroscience)
    PROG_SPEC_GRUNDLAGE_NATUR_PARAM = {
        'Program_Category': 'Natural Science (Physics, Biochem., neuroscience', 'Required_ECTS': 45}
    # Bio-und Medizintechnische Ingenieurgrundlagen oder Psychologie
    PROG_SPEC_GRUNDLAGE_BIO_PARAM = {
        'Program_Category': 'Bio and medical engineering', 'Required_ECTS': 40}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_GRUNDLAGE_NATUR_PARAM,  # 自然科學 數學 生物化學
        PROG_SPEC_GRUNDLAGE_BIO_PARAM,  # 生醫工程
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_MATH_PARAM,  # 微積分
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_GRUNDLAGE_NATUR_PARAM,  # 物理
        PROG_SPEC_GRUNDLAGE_NATUR_PARAM,  # 物理實驗
        PROG_SPEC_OTHERS,  # 資訊
        PROG_SPEC_OTHERS,  # 程式
        PROG_SPEC_OTHERS,  # 軟體工程
        PROG_SPEC_OTHERS,  # 控制系統
        PROG_SPEC_OTHERS,  # 電子
        PROG_SPEC_OTHERS,  # 電子實驗
        PROG_SPEC_OTHERS,  # 電路
        PROG_SPEC_OTHERS,  # 訊號與系統
        PROG_SPEC_OTHERS,  # 電磁
        PROG_SPEC_OTHERS,  # 電力電子
        PROG_SPEC_OTHERS,  # 通訊
        PROG_SPEC_OTHERS,  # 半導體
        PROG_SPEC_OTHERS,  # 電子材料
        PROG_SPEC_OTHERS,  # 進階電磁理論
        PROG_SPEC_OTHERS,  # 電機專業選修
        PROG_SPEC_OTHERS,  # 應用科技
        PROG_SPEC_OTHERS,  # 力學,機械相關
        PROG_SPEC_OTHERS  # 其他
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

    WriteToExcel(writer, program_name, program_category, program_category_map,
                 transcript_sorted_group_map, df_transcript_array_temp, df_category_courses_sugesstion_data_temp, column_len_array)


# Requirement: https://www.tuhh.de/t3resources/tuhh/download/studium/studieninteressierte/Fachspezifische_Kenntnisse_Master/Fachspezifische-Anforderung-2016-MM.pdf
# https://www.tuhh.de/alt/tuhh/education/degree-courses/international-study-programs/how-and-when-to-apply/specific-requirements.html

def TUHH_MICROELECTRONICS(transcript_sorted_group_map, df_transcript_array, df_category_courses_sugesstion_data, writer):
    program_name = 'TUHH_MICROELECTRONICS'
    print("Create " + program_name + " sheet")
    df_transcript_array_temp = []
    df_category_courses_sugesstion_data_temp = []
    for idx, df in enumerate(df_transcript_array):
        df_transcript_array_temp.append(df.copy())
    for idx, df in enumerate(df_category_courses_sugesstion_data):
        df_category_courses_sugesstion_data_temp.append(df.copy())
    # df_category_courses_sugesstion_data_temp = df_category_courses_sugesstion_data
    #####################################################################
    ############## Program Specific Parameters ##########################
    #####################################################################

    # Create transcript_sorted_group to program_category mapping
    PROG_SPEC_MATH_PARAM = {
        'Program_Category': 'Mathematics', 'Required_ECTS': 30}
    PROG_SPEC_COMPUTER_SCIENCE_ENG_PARAM = {
        'Program_Category': 'Computer Science', 'Required_ECTS': 18}
    PROG_SPEC_SYSTEM_THEORIE_PARAM = {
        'Program_Category': 'Control Theory', 'Required_ECTS': 6}
    PROG_SPEC_PHY_EXP_PARAM = {
        'Program_Category': 'Physics', 'Required_ECTS': 6}
    PROG_SPEC_ELECTRICAL_ENG_PARAM = {  # Electrical engineering(direct/alternating current, electronics)
        'Program_Category': 'Fundamental Electrical Engineering', 'Required_ECTS': 12}
    PROG_SPEC_ELECTRICAL_MTL_PARAM = {  # Materials in electrical engineering,
        'Program_Category': 'Materials in Electrical Engineering', 'Required_ECTS': 3}
    PROG_SPEC_METHOD_DATA_PROCESSING_PARAM = {
        'Program_Category': 'Measurements: Methods and data processing', 'Required_ECTS': 3}
    PROG_SPEC_CIRCUIT_THEORY_PARAM = {
        'Program_Category': 'Circuit theory', 'Required_ECTS': 6}
    PROG_SPEC_TRANS_LINE_PARAM = {  # Transmission Line
        'Program_Category': 'Transmission Line', 'Required_ECTS': 6}
    PROG_SPEC_SIGNAL_SYSTEM_PARAM = {
        'Program_Category': 'Signals and systems', 'Required_ECTS': 6}
    PROG_SPEC_THEORY_ELECTRICAL_ENG_PARAM = {
        'Program_Category': 'Theoretical Electrical Engineering', 'Required_ECTS': 12}
    PROG_SPEC_SEMICONDUCTOR_CIRCUIT_PARAM = {
        'Program_Category': 'Semiconductor and electronics devices', 'Required_ECTS': 6}
    PROG_SPEC_OTHERS = {
        'Program_Category': 'Others', 'Required_ECTS': 0}

    # This fixed to program course category.
    program_category = [
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_COMPUTER_SCIENCE_ENG_PARAM,  # 基礎資工
        PROG_SPEC_SYSTEM_THEORIE_PARAM,  # 控制理論
        PROG_SPEC_PHY_EXP_PARAM,           # 物理
        PROG_SPEC_ELECTRICAL_ENG_PARAM,  # 基礎電機電子
        PROG_SPEC_ELECTRICAL_MTL_PARAM,  # 電子材料
        PROG_SPEC_METHOD_DATA_PROCESSING_PARAM,  # 電子實驗
        PROG_SPEC_CIRCUIT_THEORY_PARAM,  # 電路學
        PROG_SPEC_TRANS_LINE_PARAM,     # 傳輸線 微波
        PROG_SPEC_SIGNAL_SYSTEM_PARAM,  # 信號系統
        PROG_SPEC_THEORY_ELECTRICAL_ENG_PARAM,  # 電磁學
        PROG_SPEC_SEMICONDUCTOR_CIRCUIT_PARAM,  # 半導體電路設計 電子元件 aka電子學
        PROG_SPEC_OTHERS  # 其他
    ]

    # Mapping table: same dimension as transcript_sorted_group/ The length depends on how fine the transcript is classified
    program_category_map = [
        PROG_SPEC_MATH_PARAM,  # 微積分
        PROG_SPEC_MATH_PARAM,  # 數學
        PROG_SPEC_PHY_EXP_PARAM,  # 物理
        PROG_SPEC_PHY_EXP_PARAM,  # 物理實驗
        PROG_SPEC_COMPUTER_SCIENCE_ENG_PARAM,  # 資訊
        PROG_SPEC_COMPUTER_SCIENCE_ENG_PARAM,  # 程式
        PROG_SPEC_COMPUTER_SCIENCE_ENG_PARAM,  # 軟體工程
        PROG_SPEC_SYSTEM_THEORIE_PARAM,  # 控制系統
        PROG_SPEC_ELECTRICAL_ENG_PARAM,  # 電子
        PROG_SPEC_METHOD_DATA_PROCESSING_PARAM,  # 電子實驗
        PROG_SPEC_CIRCUIT_THEORY_PARAM,  # 電路
        PROG_SPEC_SIGNAL_SYSTEM_PARAM,  # 訊號系統
        PROG_SPEC_THEORY_ELECTRICAL_ENG_PARAM,  # 電磁
        PROG_SPEC_ELECTRICAL_ENG_PARAM,  # 電力電子
        PROG_SPEC_ELECTRICAL_ENG_PARAM,  # 通訊
        PROG_SPEC_SEMICONDUCTOR_CIRCUIT_PARAM,  # 半導體
        PROG_SPEC_ELECTRICAL_MTL_PARAM,  # 電子材料
        PROG_SPEC_TRANS_LINE_PARAM,  # 進階電磁理論
        PROG_SPEC_OTHERS,  # 電機專業選修
        PROG_SPEC_OTHERS,  # 應用科技
        PROG_SPEC_OTHERS,  # 力學,機械
        PROG_SPEC_OTHERS  # 其他
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

    WriteToExcel(writer, program_name, program_category, program_category_map,
                 transcript_sorted_group_map, df_transcript_array_temp, df_category_courses_sugesstion_data_temp, column_len_array)


program_sort_function = [TUM_EI,
                         RWTH_EI,
                         STUTTGART_EI,
                         TUM_MSCE,
                         TUM_MSPE,
                         TUM_MSNE,
                         TUHH_MICROELECTRONICS]


def EE_sorter(program_idx, obj_arr, abbrev):

    basic_classification_en = {
        '微積分': [EE_CALCULUS_KEY_WORDS_EN, EE_CALCULUS_ANTI_KEY_WORDS_EN, ['一', '二']],
        '數學': [EE_MATH_KEY_WORDS_EN, EE_MATH_ANTI_KEY_WORDS_EN],
        '物理': [EE_PHYSICS_KEY_WORDS_EN, EE_PHYSICS_ANTI_KEY_WORDS_EN, ['一', '二']],
        '物理實驗': [EE_PHYSICS_EXP_KEY_WORDS_EN, EE_PHYSICS_EXP_ANTI_KEY_WORDS_EN, ['一', '二']],
        '資訊': [EE_INTRO_COMPUTER_SCIENCE_KEY_WORDS_EN, EE_INTRO_COMPUTER_SCIENCE_ANTI_KEY_WORDS_EN],
        '程式': [EE_PROGRAMMING_KEY_WORDS_EN, EE_PROGRAMMING_ANTI_KEY_WORDS_EN],
        '軟體工程': [EE_SOFTWARE_SYSTEM_KEY_WORDS_EN, EE_SOFTWARE_SYSTEM_ANTI_KEY_WORDS_EN],
        '控制系統': [EE_CONTROL_THEORY_KEY_WORDS_EN, EE_CONTROL_THEORY_ANTI_KEY_WORDS_EN],
        '電子': [EE_ELECTRONICS_KEY_WORDS_EN, EE_ELECTRONICS_ANTI_KEY_WORDS_EN, ['一', '二']],
        '電子實驗': [EE_ELECTRONICS_EXP_KEY_WORDS_EN, EE_ELECTRONICS_EXP_ANTI_KEY_WORDS_EN, ['一', '二']],
        '電路': [EE_ELECTRO_CIRCUIT_KEY_WORDS_EN, EE_ELECTRO_CIRCUIT_ANTI_KEY_WORDS_EN, ['一', '二']],
        '訊號系統': [EE_SIGNAL_SYSTEM_KEY_WORDS_EN, EE_SIGNAL_SYSTEM_ANTI_KEY_WORDS_EN],
        '電磁': [EE_ELECTRO_MAGNET_KEY_WORDS_EN, EE_ELECTRO_MAGNET_ANTI_KEY_WORDS_EN, ['一', '二']],
        '電力電子': [EE_POWER_ELECTRO_KEY_WORDS_EN, EE_POWER_ELECTRO_ANTI_KEY_WORDS_EN, ['一', '二']],
        '通訊': [EE_COMMUNICATION_KEY_WORDS_EN, EE_COMMUNICATION_ANTI_KEY_WORDS_EN, ['一', '二']],
        '半導體': [EE_SEMICONDUCTOR_KEY_WORDS_EN, EE_SEMICONDUCTOR_ANTI_KEY_WORDS_EN],
        '電子材料': [EE_ELEC_MATERIALS_KEY_WORDS_EN, EE_ELEC_MATERIALS_ANTI_KEY_WORDS_EN],
        '進階電磁理論': [EE_HF_RF_THEO_INFO_KEY_WORDS_EN, EE_HF_RF_THEO_INFO_ANTI_KEY_WORDS_EN],
        '電機專業選修': [EE_ADVANCED_ELECTRO_KEY_WORDS_EN, EE_ADVANCED_ELECTRO_ANTI_KEY_WORDS_EN],
        '專業應用課程': [EE_APPLICATION_ORIENTED_KEY_WORDS_EN, EE_APPLICATION_ORIENTED_ANTI_KEY_WORDS_EN],
        '力學': [EE_MACHINE_RELATED_KEY_WORDS_EN, EE_MACHINE_RELATED_ANTI_KEY_WORDS_EN],
        '其他': [USELESS_COURSES_KEY_WORDS_EN, USELESS_COURSES_ANTI_KEY_WORDS_EN], }

    basic_classification_zh = {
        '微積分': [EE_CALCULUS_KEY_WORDS, EE_CALCULUS_ANTI_KEY_WORDS, ['一', '二']],
        '數學': [EE_MATH_KEY_WORDS, EE_MATH_ANTI_KEY_WORDS],
        '物理': [EE_PHYSICS_KEY_WORDS, EE_PHYSICS_ANTI_KEY_WORDS, ['一', '二']],
        '物理實驗': [EE_PHYSICS_EXP_KEY_WORDS, EE_PHYSICS_EXP_ANTI_KEY_WORDS, ['一', '二']],
        '資訊': [EE_INTRO_COMPUTER_SCIENCE_KEY_WORDS, EE_INTRO_COMPUTER_SCIENCE_ANTI_KEY_WORDS],
        '程式': [EE_PROGRAMMING_KEY_WORDS, EE_PROGRAMMING_ANTI_KEY_WORDS],
        '軟體工程': [EE_SOFTWARE_SYSTEM_KEY_WORDS, EE_SOFTWARE_SYSTEM_ANTI_KEY_WORDS],
        '控制系統': [EE_CONTROL_THEORY_KEY_WORDS, EE_CONTROL_THEORY_ANTI_KEY_WORDS],
        '電子': [EE_ELECTRONICS_KEY_WORDS, EE_ELECTRONICS_ANTI_KEY_WORDS, ['一', '二']],
        '電子實驗': [EE_ELECTRONICS_EXP_KEY_WORDS, EE_ELECTRONICS_EXP_ANTI_KEY_WORDS, ['一', '二']],
        '電路': [EE_ELECTRO_CIRCUIT_KEY_WORDS, EE_ELECTRO_CIRCUIT_ANTI_KEY_WORDS, ['一', '二']],
        '訊號系統': [EE_SIGNAL_SYSTEM_KEY_WORDS, EE_SIGNAL_SYSTEM_ANTI_KEY_WORDS],
        '電磁': [EE_ELECTRO_MAGNET_KEY_WORDS, EE_ELECTRO_MAGNET_ANTI_KEY_WORDS, ['一', '二']],
        '電力電子': [EE_POWER_ELECTRO_KEY_WORDS, EE_POWER_ELECTRO_ANTI_KEY_WORDS, ['一', '二']],
        '通訊': [EE_COMMUNICATION_KEY_WORDS, EE_COMMUNICATION_ANTI_KEY_WORDS, ['一', '二']],
        '半導體': [EE_SEMICONDUCTOR_KEY_WORDS, EE_SEMICONDUCTOR_ANTI_KEY_WORDS],
        '電子材料': [EE_ELEC_MATERIALS_KEY_WORDS, EE_ELEC_MATERIALS_ANTI_KEY_WORDS],
        '進階電磁理論': [EE_HF_RF_THEO_INFO_KEY_WORDS, EE_HF_RF_THEO_INFO_ANTI_KEY_WORDS],
        '電機專業選修': [EE_ADVANCED_ELECTRO_KEY_WORDS, EE_ADVANCED_ELECTRO_ANTI_KEY_WORDS],
        '專業應用課程': [EE_APPLICATION_ORIENTED_KEY_WORDS, EE_APPLICATION_ORIENTED_ANTI_KEY_WORDS],
        '力學': [EE_MACHINE_RELATED_KEY_WORDS, EE_MACHINE_RELATED_ANTI_KEY_WORDS],
        '其他': [USELESS_COURSES_KEY_WORDS, USELESS_COURSES_ANTI_KEY_WORDS], }

    Classifier(program_idx, obj_arr, abbrev, env_file_path,
               basic_classification_en, basic_classification_zh, column_len_array, program_sort_function)

KEY_WORDS = 0
ANTI_KEY_WORDS = 1
DIFFERENTIATE_KEY_WORDS = 2

#################################################################################################################
########################################## Mechanical Engineering ###############################################
#################################################################################################################

# TODO: defining the keywords in proper way (iterative steps: generating, and see result, if mssing, then add keywords/anti_keywords)
ME_CALCULUS_KEY_WORDS = ['微積分']
ME_CALCULUS_ANTI_KEY_WORDS = ['asdgladfj;l']
ME_MATH_KEY_WORDS = ['數學', '代數', '微分', '函數', '機率', '離散', '複變', '數值', '向量']
ME_MATH_ANTI_KEY_WORDS = ['asdgladfj;l']
ME_PHYSICS_KEY_WORDS = ['物理']
ME_PHYSICS_ANTI_KEY_WORDS = ['半導體', '元件', '實驗', '車輛', '通識']
ME_PHYSICS_EXP_KEY_WORDS = ['物理']
ME_PHYSICS_EXP_ANTI_KEY_WORDS = ['半導體', '元件', '車輛', '通識', '生活']
ME_MASCHINENGESTALTUNG_KEY_WORDS = [
    '繪圖', '製圖','電腦輔助', '機械設計', '機械', '工程圖', 'CAD']
ME_MASCHINENGESTALTUNG_ANTI_KEY_WORDS = ['asdgladfj;l', '製造', '實習']
ME_MASCHINEN_ELEMENTE_KEY_WORDS = [
    '機構', '機械構']
ME_MASCHINEN_ELEMENTE_ANTI_KEY_WORDS = ['asdgladfj;l', '實習']
ME_THERMODYN_KEY_WORDS = ['熱力', '熱工']
ME_THERMODYN_ANTI_KEY_WORDS = ['asdgladfj;l']
ME_WARMTRANSPORT_KEY_WORDS = ['熱傳', '傳導', '熱流']
ME_WARMTRANSPORT_ANTI_KEY_WORDS = ['asdgladfj;l']
ME_WERKSTOFFKUNDE_KEY_WORDS = ['材料']
ME_WERKSTOFFKUNDE_ANTI_KEY_WORDS = ['asdgladfj;l', '力學', '應用', '世界', '們']
ME_CONTROL_THEORY_KEY_WORDS = ['控制', '線性系統', '非線性系統', '動態系統', '系統動態']
ME_CONTROL_THEORY_ANTI_KEY_WORDS = ['asdgladfj;l', '車輛', '交通', '管理', '控制器']
ME_FLUIDDYN_KEY_WORDS = ['流體', '流力']
ME_FLUIDDYN_ANTI_KEY_WORDS = ['asdgladfj;l']
ME_MECHANIK_KEY_WORDS = ['力學', '動力', '機動', '振動', '震動', '運動學', '應力']
ME_MECHANIK_ANTI_KEY_WORDS = ['熱力', '流體', '車輛', '氣動', '量子', '聲學', '廠']
ME_ELECTRICAL_ENG_KEY_WORDS = ['電力電子', '電機', '電動機', '電磁', '電子', '電路', '電工']
ME_ELECTRICAL_ENG_ANTI_KEY_WORDS = [
    'asdgladfj;l', '邏輯', '自動化', '微電子', '商務', '實習']
ME_MANUFACTURE_ENG_KEY_WORDS = ['製造']
ME_MANUFACTURE_ENG_ANTI_KEY_WORDS = ['asdgladfj;l', '邏輯', '自動化', '微電子']
ME_COMPUTER_SCIENCE_KEY_WORDS = ['計算機', '程式語言', '程式設計', '物件導向', '資料結構', '演算法']
ME_COMPUTER_SCIENCE_ANTI_KEY_WORDS = [
    'asdgladfj;l', '應用', 'Matlab', "LabVIEW", "MATLAB"]
ME_MECHATRONICS_KEY_WORDS = ['機電', '微處理', '微控制']
ME_MECHATRONICS_ANTI_KEY_WORDS = ['asdgladfj;l']
ME_MEASUREMENT_KEY_WORDS = ['測量', '量測']
ME_MEASUREMENT_ANTI_KEY_WORDS = ['asdgladfj;l']
ME_VEHICLE_KEY_WORDS = ['車輛', '煞車', '內燃機', '電驅動', '汽車', '熱機', '懸吊', '變速']
ME_VEHICLE_ANTI_KEY_WORDS = ['asdgladfj;l']
USELESS_COURSES_KEY_WORDS = ['asdgladfj;l']
USELESS_COURSES_ANTI_KEY_WORDS = ['asdgladfj;l']

#################################################################################################################
################################### Mechanical Engineering English ##############################################
#################################################################################################################


ME_CALCULUS_KEY_WORDS_EN = ['calculus']
ME_CALCULUS_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
ME_MATH_KEY_WORDS_EN = ['math', 'linear algebra', 'differential', '函數', 'finite element',
                        'probability', 'discrete', 'complex', 'numerical', 'vector analy']
ME_MATH_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
ME_PHYSICS_KEY_WORDS_EN = ['physics']
ME_PHYSICS_ANTI_KEY_WORDS_EN = [
    'semiconductor', 'device', 'experi', '車輛', '通識']
ME_PHYSICS_EXP_KEY_WORDS_EN = ['物理']
ME_PHYSICS_EXP_ANTI_KEY_WORDS_EN = ['semiconductor', 'device', '車輛']
ME_MASCHINENGESTALTUNG_KEY_WORDS_EN = [
    '繪圖', '製圖', 'computer aid', 'machine design', 'machine', '工程圖', 'cad']
ME_MASCHINENGESTALTUNG_ANTI_KEY_WORDS_EN = ['asdgladfj;l', 'manufactur']
ME_MASCHINEN_ELEMENTE_KEY_WORDS_EN = [
    '機構', '機械構']
ME_MASCHINEN_ELEMENTE_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
ME_THERMODYN_KEY_WORDS_EN = ['thermodyna']
ME_THERMODYN_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
ME_WARMTRANSPORT_KEY_WORDS_EN = [
    'heat conduction', 'heat conduction', 'heat flux']
ME_WARMTRANSPORT_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
ME_WERKSTOFFKUNDE_KEY_WORDS_EN = ['material']
ME_WERKSTOFFKUNDE_ANTI_KEY_WORDS_EN = ['asdgladfj;l', 'mechanics', '應用']
ME_CONTROL_THEORY_KEY_WORDS_EN = ['control', 'linear system', '非線性系統']
ME_CONTROL_THEORY_ANTI_KEY_WORDS_EN = ['asdgladfj;l', '車輛']
ME_FLUIDDYN_KEY_WORDS_EN = ['fluid']
ME_FLUIDDYN_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
ME_MECHANIK_KEY_WORDS_EN = ['mechanics', 'statics',
                            'dynamics', '機動', 'vibra', 'kine', '應力']
ME_MECHANIK_ANTI_KEY_WORDS_EN = [
    'thermodynam', 'fluid', 'automotive', 'quantum', 'accoustic']
ME_ELECTRICAL_ENG_KEY_WORDS_EN = [
    'power electr', 'electrical machine', 'electromagne', 'electronic', 'circuit']
ME_ELECTRICAL_ENG_ANTI_KEY_WORDS_EN = [
    'asdgladfj;l', 'logic', 'automation', 'microelectroni', 'business']
ME_MANUFACTURE_ENG_KEY_WORDS_EN = ['manufactur', 'fabrica', 'produc']
ME_MANUFACTURE_ENG_ANTI_KEY_WORDS_EN = [
    'asdgladfj;l', 'logic', 'automation', 'microelectroni']
ME_COMPUTER_SCIENCE_KEY_WORDS_EN = [
    '計算機', 'programming', 'object', 'data structure', 'algorithm']
ME_COMPUTER_SCIENCE_ANTI_KEY_WORDS_EN = [
    'asdgladfj;l', '應用', 'Matlab', "labview", "matlab"]
ME_MECHATRONICS_KEY_WORDS_EN = ['mechantro', 'microcomputer']
ME_MECHATRONICS_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
ME_MEASUREMENT_KEY_WORDS_EN = ['measure', 'sensor']
ME_MEASUREMENT_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
ME_VEHICLE_KEY_WORDS_EN = ['車輛', 'vehicle', 'cumbustion',
                           '電驅動', 'automotive', '熱機', 'suspens']
ME_VEHICLE_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
USELESS_COURSES_KEY_WORDS_EN = ['asdgladfj;l']
USELESS_COURSES_ANTI_KEY_WORDS_EN = ['asdgladfj;l']

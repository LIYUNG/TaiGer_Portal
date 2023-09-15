ALL_KEY_WORDS = 0
ALL_ANTI_KEY_WORDS = 1
ALL_DIFFERENTIATE_KEY_WORDS = 2

##############
### Physics ##
##############
# 物理
EE_PHYSICS_KEY_WORDS = ['物理']
EE_PHYSICS_ANTI_KEY_WORDS = ['固態', '半導體', '元件', '實驗', '史', '服務', '冶金', '生活', '車輛', '通識', '化學']
EE_PHYSICS_KEY_WORDS_EN = ['physics']
EE_PHYSICS_ANTI_KEY_WORDS_EN = [
    'semicondu', 'device', 'experiment', 'lab']

# 進階物理
EE_ADVANCED_PHYSICS_KEY_WORDS = ['固態物理']
EE_ADVANCED_PHYSICS_ANTI_KEY_WORDS = ['半導體', '元件', '實驗', '史', '服務', '冶金', '生活']
EE_ADVANCED_PHYSICS_KEY_WORDS_EN = ['solid state physics']
EE_ADVANCED_PHYSICS_ANTI_KEY_WORDS_EN = [
    'semicondu', 'device', 'experiment', 'lab']

# 物理實驗
EE_PHYSICS_EXP_KEY_WORDS = ['物理']
EE_PHYSICS_EXP_ANTI_KEY_WORDS = ['半導體', '元件', '史', '服務']
EE_PHYSICS_EXP_KEY_WORDS_EN = ['physics']
EE_PHYSICS_EXP_ANTI_KEY_WORDS_EN = ['semicondu', '元件']

###########
### Math ##
###########
# 微積分
CALCULUS_KEY_WORDS = ['微積分', '向量']
CALCULUS_ANTI_KEY_WORDS = ['asdgladfj;l']
CALCULUS_KEY_WORDS_EN = ['calculus', 'vector analy']
CALCULUS_ANTI_KEY_WORDS_EN = ['asdgladfj;l']

# 工程數學
MATH_GENERAL_KEY_WORDS = ['數學']
MATH_GENERAL_ANTI_KEY_WORDS = ['asdgladfj;l', '管理', '文明', '服務']
MATH_GENERAL_KEY_WORDS_EN = ['math']
MATH_GENERAL_ANTI_KEY_WORDS_EN = ['asdgladfj;l', '管理', '文明', '服務']

# 線性代數
MATH_LINEAR_ALGEBRA_KEY_WORDS = ['線性代數', '代數', '幾何']
MATH_LINEAR_ALGEBRA_ANTI_KEY_WORDS = ['asdgladfj;l', '管理', '文明', '服務']
MATH_LINEAR_ALGEBRA_KEY_WORDS_EN = ['linear algebra', 'numerical']
MATH_LINEAR_ALGEBRA_ANTI_KEY_WORDS_EN = ['asdgladfj;l']

# 微分方程
ME_DIFF_EQUATION_KEY_WORDS = ['微分', '微分方程']
ME_DIFF_EQUATION_ANTI_KEY_WORDS = ['asdgladfj;l']
ME_DIFF_EQUATION_KEY_WORDS_EN = ['differential']
ME_DIFF_EQUATION_ANTI_KEY_WORDS_EN = ['asdgladfj;l']

# 離散
MATH_DISCRETE_KEY_WORDS = ['離散']
MATH_DISCRETE_ANTI_KEY_WORDS = ['asdgladfj;l', '管理']
MATH_DISCRETE_KEY_WORDS_EN = ['discrete math', 'graph', '邏輯']
MATH_DISCRETE_ANTI_KEY_WORDS_EN = ['asdgladfj;l', '管理', '文明', '服務']

# 數值分析
MATH_NUM_METHOD_KEY_WORDS = ['數值方法', '數值分析', '數值運算']
MATH_NUM_METHOD_ANTI_KEY_WORDS = ['asdgladfj;l', '管理', '文明', '服務', '微積分', '認識']
MATH_NUM_METHOD_KEY_WORDS_EN = ['numerical']
MATH_NUM_METHOD_ANTI_KEY_WORDS_EN = ['asdgladfj;l', '管理', '文明', '服務']

# 基礎資工
FUNDAMENTAL_COMPUTER_SCIENCE_KEY_WORDS = ['計算機', '物件', '運算']
FUNDAMENTAL_COMPUTER_SCIENCE_ANTI_KEY_WORDS = ['倫理', '組織',
                                               '架構', '結構', '理論', '網路', 'MATLAB', 'Matlab']
FUNDAMENTAL_COMPUTER_SCIENCE_KEY_WORDS_EN = ['計算機', 'object', 'copmuting']
FUNDAMENTAL_COMPUTER_SCIENCE_ANTI_KEY_WORDS_EN = ['倫理', '組織',
                                                  '架構', '結構', '理論', '網路', 'matlab']

# 電腦結構
COMPUTER_ARCHITECTURE_KEY_WORDS = ['電腦結構', '計算機結構', '計算機架構', '計算機組織', '軟硬', '編譯', '數位系統',
                                   '組合語言', '微算機', '數位電路', '硬體描述', 'VHDL', 'Verilog']
COMPUTER_ARCHITECTURE_ANTI_KEY_WORDS = ['asdgladfj', '專題']
COMPUTER_ARCHITECTURE_KEY_WORDS_EN = ['computer architecture', 'computer organization', '軟硬', 'compile', 'digital system',
                                      'assembly', 'microprocessor', 'digital circuit', 'hardware description', 'VHDL', 'Verilog']
COMPUTER_ARCHITECTURE_ANTI_KEY_WORDS_EN = ['asdgladfj', '專題']

# 基礎電機電子
FUNDAMENTAL_ELECTRICAL_ENGINEERING_KEY_WORDS = ['邏輯設計', '電子學', '電路學']
FUNDAMENTAL_ELECTRICAL_ENGINEERING_ANTI_KEY_WORDS = ['倫理', '組織', ]
FUNDAMENTAL_ELECTRICAL_ENGINEERING_KEY_WORDS_EN = [
    'logic design', 'electronics', 'electrical circuit', 'electric circuit']
FUNDAMENTAL_ELECTRICAL_ENGINEERING_ANTI_KEY_WORDS_EN = ['倫理', '組織', ]

# 程式設計
PROGRAMMING_LANGUAGE_KEY_WORDS = ['程式設計', '程式語言',
                                  '物件', 'python', 'c++', 'java', 'c語言', '組合語言']
PROGRAMMING_LANGUAGE_ANTI_KEY_WORDS = ['倫理', '網頁', '視窗', '組織', '遊戲', '商管',
                                       '架構', '結構', '理論', '網路', 'MATLAB', 'Matlab']
PROGRAMMING_LANGUAGE_KEY_WORDS_EN = ['programming', 'program',
                                     'language', 'Python', 'c++', 'c language']
PROGRAMMING_LANGUAGE_ANTI_KEY_WORDS_EN = [
    'web', 'ethnic', 'Python', 'machine learning', 'vision', 'chinese', 'english', 'german']

# 軟體工程
SOFTWARE_ENGINEERING_KEY_WORDS = ['軟體', '系統設計']
SOFTWARE_ENGINEERING_ANTI_KEY_WORDS = ['asdgladfj']
SOFTWARE_ENGINEERING_KEY_WORDS_EN = ['software', 'systems design']
SOFTWARE_ENGINEERING_ANTI_KEY_WORDS_EN = ['asdgladfj']

# 資料庫
DATABASE_KEY_WORDS = ['資料庫']
DATABASE_ANTI_KEY_WORDS = ['asdgladfj']
DATABASE_KEY_WORDS_EN = ['database']
DATABASE_ANTI_KEY_WORDS_EN = ['asdgladfj']

# 作業系統
OPERATING_SYSTEM_KEY_WORDS = ['作業系統', 'UNIX', 'LINUX']
OPERATING_SYSTEM_ANTI_KEY_WORDS = ['asdgladfj;l']
OPERATING_SYSTEM_KEY_WORDS_EN = ['operating system', 'unix', 'linux']
OPERATING_SYSTEM_ANTI_KEY_WORDS_EN = ['asdgladfj;l']

# 電腦網絡
COMPUTER_NETWORK_KEY_WORDS = ['電腦網路', '網路', '密碼', '安全', '傳輸', '分散式', '通訊']
COMPUTER_NETWORK_ANTI_KEY_WORDS = ['asdgladfj', '工業',
                                   '食品', '應用', '程式', '神經', '國家', '台灣', '國際', '南海']
COMPUTER_NETWORK_KEY_WORDS_EN = ['computer network', 'internet',
                                 'cryptograph', 'securit', 'transmission', 'communication', 'distribute']
COMPUTER_NETWORK_ANTI_KEY_WORDS_EN = ['asdgladfj', 'technical']

# 數理邏輯
MATHEMATICAL_LOGIC_KEY_WORDS = ['數學邏輯', '數理邏輯', '邏輯']
MATHEMATICAL_LOGIC_PROG_ANTI_KEY_WORDS = ['asdgladfj;l', '設計']
MATHEMATICAL_LOGIC_KEY_WORDS_EN = ['logic']
MATHEMATICAL_LOGIC_PROG_ANTI_KEY_WORDS_EN = ['asdgladfj;l']

# 圖論
MATHEMATICAL_GRAPH_THEORY_KEY_WORDS = ['圖論', '圖形', '圖型']
MATHEMATICAL_GRAPH_THEORY_ANTI_KEY_WORDS = ['asdgladfj;l', '設計']
MATHEMATICAL_GRAPH_THEORY_KEY_WORDS_EN = ['graph theor']
MATHEMATICAL_GRAPH_THEORY_ANTI_KEY_WORDS_EN = ['asdgladfj;l', '設計']

# 正規方法
FORMAL_METHOD_KEY_WORDS = ['正規', '常規', '形式系統']
FORMAL_METHOD_ANTI_KEY_WORDS = ['asdgladfj']
FORMAL_METHOD_KEY_WORDS_EN = ['formal', '常規', '形式系統']
FORMAL_METHOD_ANTI_KEY_WORDS_EN = ['asdgladfj']

# 函式程式
FUNCTIONAL_PROGRAMMING_KEY_WORDS = ['功能', '驗證', '函式語言', '函式程式', '函數編程']
FUNCTIONAL_PROGRAMMING_ANTI_KEY_WORDS = ['網頁']
FUNCTIONAL_PROGRAMMING_KEY_WORDS_EN = ['functional program', '驗證',
                                       '函式語言', '函式程式']
FUNCTIONAL_PROGRAMMING_ANTI_KEY_WORDS_EN = ['網頁']

# 資料結構演算法
ALGORITHM_DATASTRUCTURE_KEY_WORDS = ['演算法', '資料結構']
ALGORITHM_DATASTRUCTURE_ANTI_KEY_WORDS = ['asdgladfj']
ALGORITHM_DATASTRUCTURE_KEY_WORDS_EN = ['algorithm', 'data struct']
ALGORITHM_DATASTRUCTURE_ANTI_KEY_WORDS_EN = ['asdgladfj']

# 理論資工
CS_THEORY_COMP_KEY_WORDS = ['計算機理論', '原理', '可計算', '計算理論']
CS_THEORY_COMP_ANTI_KEY_WORDS = ['asdgladfj', '經濟', '遊戲']
CS_THEORY_COMP_KEY_WORDS_EN = ['theoretical compu', '原理', 'computabili']
CS_THEORY_COMP_ANTI_KEY_WORDS_EN = ['asdgladfj']

# 商管經
CS_BA_BI_ENG_KEY_WORDS = ['經濟學', '經濟', '企業',
                          '管理學', '組織', '管理', '會計', '作業研究', '觀察研究']
CS_BA_BI_ENG_ANTI_KEY_WORDS = ['asdgladfj;l', '畢業', '社會', '人力']
CS_BA_BI_ENG_KEY_WORDS_EN = ['語音',  '分散式']
CS_BA_BI_ENG_ANTI_KEY_WORDS_EN = ['asdgladfj;l', '畢業', '社會', '人力']

# 機率
PROBABILITY_KEY_WORDS = ['機率', '統計', '隨機']
PROBABILITY_ANTI_KEY_WORDS = ['asdgladfj;l', '學習', '管理']
PROBABILITY_KEY_WORDS_EN = ['probability', 'statistic', 'random', 'stochasti']
PROBABILITY_ANTI_KEY_WORDS_EN = ['asdgladfj;l']

# 進階資工
ADVANCED_COMPUTER_SCIENCE_KEY_WORDS = ['語音', '推薦', '機器學習', '通訊原理', '自然語言', '高等', '網頁', '視窗',
                                       '嵌入式', '應用', '優化', '智慧', '智能', '深度學習', '區塊', '分散式']
ADVANCED_COMPUTER_SCIENCE_ANTI_KEY_WORDS = [
    'asdgladfj;l', '畢業', '社會', '人力', '化學', '物理']
ADVANCED_COMPUTER_SCIENCE_KEY_WORDS_EN = ['語音', 'recommenda', 'machine learning', '通訊原理', 'natural language', '高等', '網頁', '視窗',
                                          'project', 'embedded', '應用', 'optimization', 'intelligence', '智能', '進階', '深度學習', 'blockchain', '分散式']
ADVANCED_COMPUTER_SCIENCE_ANTI_KEY_WORDS_EN = ['asdgladfj;l', '畢業']

# 物理化學工程
CS_PHY_CHEM_NS_ENG_KEY_WORDS = ['物理', '化學', '生物', '工程']
CS_PHY_CHEM_NS_ENG_ANTI_KEY_WORDS = ['asdgladfj;l', '畢業', '社會', '人力']
CS_PHY_CHEM_NS_ENG_KEY_WORDS_EN = ['physi',  'chemi']
CS_PHY_CHEM_NS_ENG_ANTI_KEY_WORDS_EN = ['asdgladfj;l', '畢業', '社會', '人力']


#################################################################################################################
########################################## Electrical Engineering ###############################################
#################################################################################################################

# TODO: defining the keywords in proper way (iterative steps: generating, and see result, if mssing, then add keywords/anti_keywords)
EE_MATH_KEY_WORDS = ['數學', '代數', '微分', '函數', '機率', '離散', '複變', '數值', '向量']
EE_MATH_ANTI_KEY_WORDS = ['asdgladfj;l']
EE_MATH_KEY_WORDS_EN = ['mathe', 'algebra', 'differential', '函數', 'multivar',
                        'probability', 'discrete math', 'complex', 'numerical', 'vector analy']
EE_MATH_ANTI_KEY_WORDS_EN = ['asdgladfj;l', 'device']

EE_INTRO_COMPUTER_SCIENCE_KEY_WORDS = ['計算機', '演算', '資料', '運算',
                                       '資電', '作業系統', '資料結構', '編譯器']
EE_INTRO_COMPUTER_SCIENCE_ANTI_KEY_WORDS = [
    '倫理', 'Python', '機器學習', '傳輸', '素人', '思考']

EE_INTRO_COMPUTER_SCIENCE_KEY_WORDS_EN = ['computer', 'algorithm', 'object', 'computing',
                                          '資電', 'operating system', 'data structure', 'software', 'compiler']
EE_INTRO_COMPUTER_SCIENCE_ANTI_KEY_WORDS_EN = [
    '倫理', 'Python', 'machine learning', 'circuit', 'program', 'vision']

# 軟體工程
EE_SOFTWARE_SYSTEM_KEY_WORDS = ['軟體工程', ]
EE_SOFTWARE_SYSTEM_ANTI_KEY_WORDS = ['asdgladfj;l']
EE_SOFTWARE_SYSTEM_KEY_WORDS_EN = ['software engineering', ]
EE_SOFTWARE_SYSTEM_ANTI_KEY_WORDS_EN = ['asdgladfj;l']

# 控制系統
EE_CONTROL_THEORY_KEY_WORDS = ['控制', '線性系統', '非線性系統']
EE_CONTROL_THEORY_ANTI_KEY_WORDS = ['asdgladfj;l', '網路', '碼', '儀', '可程式']
EE_CONTROL_THEORY_KEY_WORDS_EN = ['control', 'linear system', '非線性系統']
EE_CONTROL_THEORY_ANTI_KEY_WORDS_EN = ['asdgladfj;l']

# 電子
EE_ELECTRONICS_KEY_WORDS = ['電子', '電子電路']
EE_ELECTRONICS_ANTI_KEY_WORDS = [
    '實驗', '專題', '電力', '固態', '自動化', '倫理', '素養', '進階', '材料', '藝術', '視覺', '近代']
EE_ELECTRONICS_KEY_WORDS_EN = ['electronic', 'electrical']
EE_ELECTRONICS_ANTI_KEY_WORDS_EN = [
    'project', 'power', 'solid', 'automation', 'ethnic', '素養', 'advanced', 'lab', 'experiment']

# 電子實驗
EE_ELECTRONICS_EXP_KEY_WORDS = ['電子實驗', '電子', '電工實驗']
EE_ELECTRONICS_EXP_ANTI_KEY_WORDS = ['專題', '電力', '固態', '自動化', '藝術', '材料', '近代']
EE_ELECTRONICS_EXP_KEY_WORDS_EN = ['lab', 'electroni']
EE_ELECTRONICS_EXP_ANTI_KEY_WORDS_EN = [
    'physic', 'chemistry', 'general', '材料', 'wave', 'digital', 'mechanic']

# 電路
EE_ELECTRO_CIRCUIT_KEY_WORDS = ['電路', '數位邏輯', '數位系統', '邏輯系統', '邏輯設計']
EE_ELECTRO_CIRCUIT_ANTI_KEY_WORDS = [
    '超大型', '專題', '倫理', '素養', '進階', '藝術', '高頻', '微波']
EE_ELECTRO_CIRCUIT_KEY_WORDS_EN = [
    'circuit', 'signal', 'fpga', 'hdl', '數位邏輯', 'logic']
EE_ELECTRO_CIRCUIT_ANTI_KEY_WORDS_EN = ['超大型', '專題']

# 訊號系統
EE_SIGNAL_SYSTEM_KEY_WORDS = ['訊號與系統', '信號與系統', '訊號', '信號']
EE_SIGNAL_SYSTEM_ANTI_KEY_WORDS = ['asdgladfj;l''超大型', '專題']
EE_SIGNAL_SYSTEM_KEY_WORDS_EN = ['signals and systems']
EE_SIGNAL_SYSTEM_ANTI_KEY_WORDS_EN = ['asdgladfj;l', '超大型', '專題']

# 電磁
EE_ELECTRO_MAGNET_KEY_WORDS = ['電磁', '電動力學']
EE_ELECTRO_MAGNET_ANTI_KEY_WORDS = ['asdgladfj;l', '專題', '進階']
EE_ELECTRO_MAGNET_KEY_WORDS_EN = ['electromagne', 'magne']
EE_ELECTRO_MAGNET_ANTI_KEY_WORDS_EN = ['asdgladfj;l', '專題', '進階']

# 電力電子
EE_POWER_ELECTRO_KEY_WORDS = ['電力', '能源', '電動機', '電機', '高壓電', '電傳輸', '配電']
EE_POWER_ELECTRO_ANTI_KEY_WORDS = ['asdgladfj;l', '專題', '進階', '政策']
EE_POWER_ELECTRO_KEY_WORDS_EN = [
    'power', 'energy', '電動機', 'electrical machine', 'high voltage', 'transmission']
EE_POWER_ELECTRO_ANTI_KEY_WORDS_EN = ['asdgladfj;l', '專題', '進階', 'policy']

# 通訊
EE_COMMUNICATION_KEY_WORDS = ['密碼學', '安全', '傳輸', '射頻', '電信',
                              '網路', '無線', '通信', '通訊', '電波', '無線網路']
EE_COMMUNICATION_ANTI_KEY_WORDS = [
    'asdgladfj;l', '專題', '進階', '金融', '神經', '微波', '日治']
EE_COMMUNICATION_KEY_WORDS_EN = ['microwave', 'crypto', 'security', 'radio frequ',
                                 'network', 'wireless', 'communication', '通訊', '電波']
EE_COMMUNICATION_ANTI_KEY_WORDS_EN = [
    'asdgladfj;l', '專題', 'advanced', 'technical']

# 半導體
EE_SEMICONDUCTOR_KEY_WORDS = ['半導體', '元件', '固態']
EE_SEMICONDUCTOR_ANTI_KEY_WORDS = ['專題', '倫理', '素養', '藝術', '電子']
EE_SEMICONDUCTOR_KEY_WORDS_EN = ['semicondu', '元件', 'solid state']
EE_SEMICONDUCTOR_ANTI_KEY_WORDS_EN = ['專題', 'ethnic', '素養']

# 電子材料
EE_ELEC_MATERIALS_KEY_WORDS = ['電子', '材料']
EE_ELEC_MATERIALS_ANTI_KEY_WORDS = ['專題', '倫理', '藝術', '素養']
EE_ELEC_MATERIALS_KEY_WORDS_EN = ['電子材料']
EE_ELEC_MATERIALS_ANTI_KEY_WORDS_EN = ['專題', 'ethnic', '素養']

# 進階電磁理論
EE_HF_RF_THEO_INFO_KEY_WORDS = [
    '微波', '高頻', '電磁波', '天線', '通道', '消息', '編碼', 'RF']
EE_HF_RF_THEO_INFO_ANTI_KEY_WORDS = ['asdgladfj;l', '專題', '進階']
EE_HF_RF_THEO_INFO_KEY_WORDS_EN = [
    'microwav', 'high frequen', 'electromagnetic wave' 'antenna', 'channel', 'information theory']
EE_HF_RF_THEO_INFO_ANTI_KEY_WORDS_EN = ['asdgladfj;l', '專題', 'advanced']

# 電機專業選修
EE_ADVANCED_ELECTRO_KEY_WORDS = ['自動化',  '藍芽', '晶片', '數位訊號', '數位信號',
                                 '微算機', '微處理', 'VLSI', '嵌入式', '人工智慧', '機器學習']
EE_ADVANCED_ELECTRO_ANTI_KEY_WORDS = ['倫理', '藝術', '素養']
EE_ADVANCED_ELECTRO_KEY_WORDS_EN = ['automation',  'bluetooth', 'chip', 'digital', 'digital signal',
                                    'microprocessor', 'microcontroller', 'embedded', 'artificial', 'machine learning']
EE_ADVANCED_ELECTRO_ANTI_KEY_WORDS_EN = ['ethnic', '素養']

# 專業應用課程
EE_APPLICATION_ORIENTED_KEY_WORDS = ['生醫', '光機電', '電腦', '微系統', '物聯網', '聲學', '微機電', '控制',
                                     '影像', '深度學習', '光電', '應用', '綠能', '雲端運算', '醫學工程', '再生能源']
EE_APPLICATION_ORIENTED_ANTI_KEY_WORDS = ['倫理', '素養', '入門', '經濟', '微波', '政策']
EE_APPLICATION_ORIENTED_KEY_WORDS_EN = ['生醫', 'neuro', '光機電', 'mems', 'iot', 'accoustics', 'solar',
                                        'image', 'deep learning', 'optoelectronics', '應用', 'green', 'cloud', 'medical', 'renewable']
EE_APPLICATION_ORIENTED_ANTI_KEY_WORDS_EN = ['ethnic', '素養']

# 力學
EE_MACHINE_RELATED_KEY_WORDS = ['力學', '流體',
                                '熱力', '傳導', '熱傳', '機械', '動力', '熱流', '機動']
EE_MACHINE_RELATED_ANTI_KEY_WORDS = ['asdgladfj;l']
EE_MACHINE_RELATED_KEY_WORDS_EN = ['mechanics', 'fluid', 'statics', 'dynamics',
                                   'thermodyna', '傳導', 'conduction', 'machine', 'heat flux', '機動']
EE_MACHINE_RELATED_ANTI_KEY_WORDS_EN = ['asdgladfj;l']

# 電路設計
EE_ELECTRO_CIRCUIT_DESIGN_KEY_WORDS = [
    '數位電路', '類比', '積體電路', 'ic design', 'vlsi', 'ulsi']
EE_ELECTRO_CIRCUIT_DESIGN_ANTI_KEY_WORDS = [
    '專題', '倫理', '素養', '進階', '藝術', '高頻', '微波']
EE_ELECTRO_CIRCUIT_DESIGN_KEY_WORDS_EN = [
    'analog', 'integrated circuit', 'vlsi', 'ulsi', 'ic design']
EE_ELECTRO_CIRCUIT_DESIGN_ANTI_KEY_WORDS_EN = [
    '超大型', '專題', '倫理', '素養', '進階', '藝術', '高頻', '微波']


#################################################################################################################
########################################## Mechanical Engineering ###############################################
#################################################################################################################


ME_MATH_KEY_WORDS = ['數學', '代數', '函數', '機率', '離散', '複變', '數值', '向量']
ME_MATH_ANTI_KEY_WORDS = ['asdgladfj;l']
ME_PHYSICS_KEY_WORDS = ['物理']
ME_PHYSICS_ANTI_KEY_WORDS = ['半導體', '元件', '實驗', '車輛', '通識']
ME_PHYSICS_EXP_KEY_WORDS = ['物理']
ME_PHYSICS_EXP_ANTI_KEY_WORDS = ['半導體', '元件', '車輛', '通識', '生活']
ME_MASCHINENGESTALTUNG_KEY_WORDS = [
    '繪圖', '製圖', '電腦輔助', '機械設計', '機械', '工程圖', 'CAD']
ME_MASCHINENGESTALTUNG_ANTI_KEY_WORDS = ['asdgladfj;l', '製造', '實習', '材料']
ME_MASCHINEN_ELEMENTE_KEY_WORDS = ['機構', '機動', '機械構']
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
ME_STATICS_KEY_WORDS = ['靜力']
ME_STATICS_ANTI_KEY_WORDS = ['asdgladfj']
ME_DYNAMICS_KEY_WORDS = ['動力', '振動', '運動學', '震動']
ME_DYNAMICS_ANTI_KEY_WORDS = ['asdgladfj']
ME_MATERIALS_MECHANIK_KEY_WORDS = ['力學', '應力', '運動學']
ME_MATERIALS_MECHANIK_ANTI_KEY_WORDS = [
    '熱力', '流體', '車輛', '氣動', '量子', '聲學', '廠']
ME_ELECTRICAL_ENG_KEY_WORDS = [
    '電力電子', '電機', '電動機', '電磁', '電子', '電路', '電工', '電力']
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

#################################################################################################################
################################### Mechanical Engineering English ##############################################
#################################################################################################################


ME_MATH_KEY_WORDS_EN = ['math', 'linear algebra', 'differential', '函數', 'finite element',
                        'probability', 'discrete', 'complex', 'numerical', 'vector analy']
ME_MATH_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
ME_PHYSICS_KEY_WORDS_EN = ['physics']
ME_PHYSICS_ANTI_KEY_WORDS_EN = [
    'semiconductor', 'device', 'experi', 'lab', '車輛', '通識']
ME_PHYSICS_EXP_KEY_WORDS_EN = ['物理']
ME_PHYSICS_EXP_ANTI_KEY_WORDS_EN = ['semiconductor', 'device', '車輛']
ME_MASCHINENGESTALTUNG_KEY_WORDS_EN = [
    'mechanical design', '製圖', 'computer aid', 'machine design', 'machine', 'graphic', 'cad']
ME_MASCHINENGESTALTUNG_ANTI_KEY_WORDS_EN = ['asdgladfj;l', 'manufactur']
ME_MASCHINEN_ELEMENTE_KEY_WORDS_EN = ['mechanism']
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
ME_STATICS_KEY_WORDS_EN = ['statics']
ME_STATICS_ANTI_KEY_WORDS_EN = ['asdgladfj']
ME_DYNAMICS_KEY_WORDS_EN = ['dynamics', '振動', '運動學', '震動']
ME_DYNAMICS_ANTI_KEY_WORDS_EN = ['asdgladfj']
ME_MATERIALS_MECHANIK_KEY_WORDS_EN = ['mechanics', 'statics',
                                      'dynamics', 'vibra', 'kine', '應力']
ME_MATERIALS_MECHANIK_ANTI_KEY_WORDS_EN = [
    'thermodynam', 'fluid', 'automotive', 'quantum', 'accoustic']
ME_ELECTRICAL_ENG_KEY_WORDS_EN = [
    'power electr', 'electrical machine', 'electromagne', 'electronic', 'circuit']
ME_ELECTRICAL_ENG_ANTI_KEY_WORDS_EN = [
    'asdgladfj;l', 'logic', 'automation', 'microelectroni', 'business']
ME_MANUFACTURE_ENG_KEY_WORDS_EN = ['manufactur', 'fabrica', 'produc']
ME_MANUFACTURE_ENG_ANTI_KEY_WORDS_EN = [
    'asdgladfj;l', 'logic', 'automation', 'microelectroni']
ME_COMPUTER_SCIENCE_KEY_WORDS_EN = [
    'computer science', 'programming', 'object', 'data structure', 'algorithm']
ME_COMPUTER_SCIENCE_ANTI_KEY_WORDS_EN = [
    'asdgladfj;l', '應用', 'Matlab', "labview", "matlab"]
ME_MECHATRONICS_KEY_WORDS_EN = ['mechantro', 'microcomputer']
ME_MECHATRONICS_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
ME_MEASUREMENT_KEY_WORDS_EN = ['measure', 'sensor']
ME_MEASUREMENT_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
ME_VEHICLE_KEY_WORDS_EN = ['車輛', 'vehicle', 'cumbustion',
                           '電驅動', 'automotive', '熱機', 'suspens']
ME_VEHICLE_ANTI_KEY_WORDS_EN = ['asdgladfj;l']


#################################################################################################################
########################################## Mechanical Engineering ###############################################
#################################################################################################################

# TODO: defining the keywords in proper way (iterative steps: generating, and see result, if mssing, then add keywords/anti_keywords)
MTL_MATH_DISCRETE_KEY_WORDS = ['離散', '圖形', '圖論', '邏輯']
MTL_MATH_DISCRETE_ANTI_KEY_WORDS = ['asdgladfj;l', '管理']

MTL_MATH_KEY_WORDS = ['數學', '微分', '函數', '機率', '複變', '向量', '幾何']
MTL_MATH_ANTI_KEY_WORDS = ['asdgladfj;l', '離散']

MTL_CHEMISTRY_KEY_WORDS = ['化學']
MTL_CHEMISTRY_ANTI_KEY_WORDS = ['半導體', '物理', '無機', '元件', '實驗', '車輛', '通識']
MTL_CHEMISTRY_EXP_KEY_WORDS = ['化學']
MTL_CHEMISTRY_EXP_ANTI_KEY_WORDS = ['半導體', '物理', '無機', '元件', '車輛']
MTL_INORGANIC_CHEMISTRY_KEY_WORDS = ['無機化學', '無機化學實驗']
MTL_INORGANIC_CHEMISTRY_ANTI_KEY_WORDS = [
    'asdgladfj;l', '管理', '文明']
MTL_PHYSIK_CHEMISTRY_KEY_WORDS = ['物理化學']
MTL_PHYSIK_CHEMISTRY_ANTI_KEY_WORDS = ['asdgladfj;l']
MTL_WERKSTOFFKUNDE_KEY_WORDS = ['材料']
MTL_WERKSTOFFKUNDE_ANTI_KEY_WORDS = ['asdgladfj;l', '力學']
MTL_CONTROL_THEORY_KEY_WORDS = ['控制', '線性系統', '非線性系統']
MTL_CONTROL_THEORY_ANTI_KEY_WORDS = ['asdgladfj;l']
MTL_FLUIDDYN_KEY_WORDS = ['流體']
MTL_FLUIDDYN_ANTI_KEY_WORDS = ['asdgladfj;l']
MTL_MECHANIK_KEY_WORDS = ['力學', '動力', '機動', '振動', '震動', '運動學', '應力']
MTL_MECHANIK_ANTI_KEY_WORDS = ['熱力', '流體', '車輛', '氣動', '量子', '聲學']
MTL_THERMODYN_KEY_WORDS = ['熱力', '熱工']
MTL_THERMODYN_ANTI_KEY_WORDS = ['asdgladfj;l']
MTL_ELECTRONICS_KEY_WORDS = ['電子', '電子電路']
MTL_ELECTRONICS_ANTI_KEY_WORDS = [
    '實驗', '專題', '電力', '固態', '自動化', '倫理', '素養', '進階', '材料', '藝術', '視覺']
MTL_ELECTRO_CIRCUIT_KEY_WORDS = ['電路', '數位邏輯', '邏輯系統', '邏輯設計']
MTL_ELECTRO_CIRCUIT_ANTI_KEY_WORDS = [
    '超大型', '專題', '倫理', '素養', '進階', '藝術', '高頻', '微波']
USELESS_COURSES_KEY_WORDS = ['asdgladfj;l']
USELESS_COURSES_ANTI_KEY_WORDS = ['asdgladfj;l']

#################################################################################################################
################################### Mechanical Engineering Englis ###############################################
#################################################################################################################
MTL_MATH_DISCRETE_KEY_WORDS_EN = ['discrete math', '圖形', 'graph', '邏輯']
MTL_MATH_DISCRETE_ANTI_KEY_WORDS_EN = ['asdgladfj;l']

MTL_MATH_KEY_WORDS_EN = ['math', 'linear algebra', 'differential', '函數',
                         'probability', 'discrete', 'complex', 'numerical', 'vector analy']
MTL_MATH_ANTI_KEY_WORDS_EN = ['asdgladfj;l']

MTL_CHEMISTRY_KEY_WORDS_EN = ['chemi']
MTL_CHEMISTRY_ANTI_KEY_WORDS_EN = [
    'semiconductor', 'device', 'experi', '車輛', '通識']
MTL_CHEMISTRY_EXP_KEY_WORDS_EN = ['chemi']
MTL_CHEMISTRY_EXP_ANTI_KEY_WORDS_EN = ['semiconductor', 'device', '車輛']
MTL_INORGANIC_CHEMISTRY_KEY_WORDS_EN = ['inorganic chemis']
MTL_INORGANIC_CHEMISTRY_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
MTL_PHYSIK_CHEMISTRY_KEY_WORDS_EN = ['physical chemis']
MTL_PHYSIK_CHEMISTRY_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
MTL_WERKSTOFFKUNDE_KEY_WORDS_EN = ['material']
MTL_WERKSTOFFKUNDE_ANTI_KEY_WORDS_EN = ['asdgladfj;l', 'mechanics']
MTL_CONTROL_THEORY_KEY_WORDS_EN = ['control', 'linear system', '非線性系統']
MTL_CONTROL_THEORY_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
MTL_FLUIDDYN_KEY_WORDS_EN = ['fluid']
MTL_FLUIDDYN_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
MTL_MECHANIK_KEY_WORDS_EN = ['mechanics', 'statics',
                             'dynamics', '機動', 'vibra', 'kine', '應力']
MTL_MECHANIK_ANTI_KEY_WORDS_EN = [
    'thermodynam', 'fluid', 'automotive', '氣動', 'quantum', 'accoustic']
MTL_THERMODYN_KEY_WORDS_EN = ['thermodyna']
MTL_THERMODYN_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
MTL_ELECTRONICS_KEY_WORDS_EN = ['electronic', 'electrical']
MTL_ELECTRONICS_ANTI_KEY_WORDS_EN = [
    'project', 'power', 'solid', 'automation', 'ethnic', '素養', 'advanced', 'lab', 'experiment']
MTL_ELECTRO_CIRCUIT_KEY_WORDS_EN = [
    'circuit', 'signal', 'fpga', 'hdl', '數位邏輯', 'logic']
MTL_ELECTRO_CIRCUIT_ANTI_KEY_WORDS_EN = ['超大型', '專題']



#################################################################################################################
###################################################### Management ###############################################
#################################################################################################################

# TODO: defining the keywords in proper way (iterative steps: generating, and see result, if mssing, then add keywords/anti_keywords)
MGM_CALCULUS_KEY_WORDS = ['微積分']
MGM_CALCULUS_ANTI_KEY_WORDS = ['asdgladfj;l']
MGM_MATH_KEY_WORDS = ['線性代數', '離散', '微分', '機率', '數學']
MGM_MATH_ANTI_KEY_WORDS = ['asdgladfj;l', '通識']
MGM_ECONOMICS_KEY_WORDS = ['經濟學', '經濟']
MGM_ECONOMICS_ANTI_KEY_WORDS = ['asdgladfj;l', '計量', '日本', '循環', '永續', '綠色']
MGM_ECONOMETRICS_KEY_WORDS = ['計量經濟', '經濟計量', '數量方法']
MGM_ECONOMETRICS_ANTI_KEY_WORDS = ['asdgladfj;l']
MGM_BUSINESS_KEY_WORDS = ['企業', '商事', '商管', '電子商務']
MGM_BUSINESS_ANTI_KEY_WORDS = ['asdgladfj;l', '資料']
MGM_MANAGEMENT_KEY_WORDS = ['管理學', '組織', '管理']
MGM_MANAGEMENT_ANTI_KEY_WORDS = ['asdgladfj;l', '資料', '數學', '實習']
MGM_ACCOUNTING_KEY_WORDS = ['會計', '審計']
MGM_ACCOUNTING_ANTI_KEY_WORDS = ['asdgladfj;l']
MGM_STATISTICS_KEY_WORDS = ['統計']
MGM_STATISTICS_ANTI_KEY_WORDS = ['asdgladfj;l']
MGM_FINANCE_KEY_WORDS = ['金融', '投資', '貨幣',
                         '資本市場', '財務', '期貨', '選擇權', '債券']
MGM_FINANCE_ANTI_KEY_WORDS = ['asdgladfj;l', '專題']
MGM_MARKETING_KEY_WORDS = ['行銷']
MGM_MARKETING_ANTI_KEY_WORDS = ['asdgladfj;l']
MGM_OP_RESEARCH_KEY_WORDS = ['作業研究']
MGM_OP_RESEARCH_ANTI_KEY_WORDS = ['asdgladfj;l']
MGM_EP_RESEARCH_KEY_WORDS = ['觀察研究', '市場分析', '市場研究', '討論']
MGM_EP_RESEARCH_ANTI_KEY_WORDS = ['asdgladfj;l']
MGM_BASIC_CS_KEY_WORDS = ['計算機', '資料庫', '資料結構', '軟體工程', '計概',
                          '演算法', '作業系統', '軟體', '電腦網路', '分散式系統', '人工智慧', '機器學習']
MGM_BASIC_CS_ANTI_KEY_WORDS = ['asdgladfj;l', '商管']
MGM_PROGRAMMING_KEY_WORDS = ['程式']
MGM_PROGRAMMING_ANTI_KEY_WORDS = ['asdgladfj;l']
MGM_DATA_SCIENCE_KEY_WORDS = ['資料']
MGM_DATA_SCIENCE_ANTI_KEY_WORDS = ['asdgladfj;l']
MGM_BUSINESS_INFORMATIC_KEY_WORDS = [
    '資訊管理', '資管', '管理資訊', '資訊系統', '資訊科技']
MGM_BUSINESS_INFORMATIC_ANTI_KEY_WORDS = ['asdgladfj;l']
MGM_SUSTAINABILITY_KEY_WORDS = [
    '環境', '綠色經濟', '永續開發', '永續發展', '永續治理', '永續經濟', '循環經濟', '生態', '地球永續']
MGM_SUSTAINABILITY_ANTI_KEY_WORDS = ['asdgladfj;l']
MGM_BACHELOR_THESIS_KEY_WORDS = ['專題', '論文']
MGM_BACHELOR_THESIS_ANTI_KEY_WORDS = ['asdgladfj;l']
USELESS_COURSES_KEY_WORDS = ['asdgladfj;l']
USELESS_COURSES_ANTI_KEY_WORDS = ['asdgladfj;l']

#################################################################################################################
########################################## Management English ###################################################
#################################################################################################################

# TODO: defining the keywords in proper way (iterative steps: generating, and see result, if mssing, then add keywords/anti_keywords)
MGM_CALCULUS_KEY_WORDS_EN = ['calculus']
MGM_CALCULUS_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
MGM_MATH_KEY_WORDS_EN = ['linear algebra', 'discrete math']
MGM_MATH_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
MGM_ECONOMICS_KEY_WORDS_EN = ['economic']
MGM_ECONOMICS_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
MGM_ECONOMETRICS_KEY_WORDS_EN = ['econometric']
MGM_ECONOMETRICS_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
MGM_BUSINESS_KEY_WORDS_EN = ['business', 'commerc']
MGM_BUSINESS_ANTI_KEY_WORDS_EN = ['asdgladfj;l', 'data']
MGM_MANAGEMENT_KEY_WORDS_EN = ['management', 'organization']
MGM_MANAGEMENT_ANTI_KEY_WORDS_EN = ['asdgladfj;l', 'data']
MGM_ACCOUNTING_KEY_WORDS_EN = ['accounting']
MGM_ACCOUNTING_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
MGM_STATISTICS_KEY_WORDS_EN = ['statistics']
MGM_STATISTICS_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
MGM_FINANCE_KEY_WORDS_EN = ['financ', 'stock', 'options', 'currenc', 'bond']
MGM_FINANCE_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
MGM_MARKETING_KEY_WORDS_EN = ['marketing']
MGM_MARKETING_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
MGM_OP_RESEARCH_KEY_WORDS_EN = ['operations research']
MGM_OP_RESEARCH_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
MGM_EP_RESEARCH_KEY_WORDS_EN = ['empirical',
                                'quantitative method', 'quantitative resear']
MGM_EP_RESEARCH_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
MGM_BASIC_CS_KEY_WORDS_EN = ['computer', 'data', 'operating system', 'program design', 'artificial intelligen',
                             'database', 'data structure', 'algorithm']
MGM_BASIC_CS_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
MGM_PROGRAMMING_KEY_WORDS_EN = ['programming']
MGM_PROGRAMMING_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
MGM_DATA_SCIENCE_KEY_WORDS_EN = ['data']
MGM_DATA_SCIENCE_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
MGM_BUSINESS_INFORMATIC_KEY_WORDS_EN = ['information system', 'software']
MGM_BUSINESS_INFORMATIC_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
MGM_SUSTAINABILITY_KEY_WORDS_EN = [
    'sustainable', 'sustainability', 'environmental', 'circular econom', 'sustainable development']
MGM_SUSTAINABILITY_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
MGM_BACHELOR_THESIS_KEY_WORDS_EN = ['project', 'thesis']
MGM_BACHELOR_THESIS_ANTI_KEY_WORDS_EN = ['asdgladfj;l']


#################################################################################################################
##################################### Data Science and Business Intelligence#####################################
#################################################################################################################

# TODO: defining the keywords in proper way (iterative steps: generating, and see result, if mssing, then add keywords/anti_keywords)
DSBI_CALCULUS_KEY_WORDS = ['微積分']
DSBI_CALCULUS_ANTI_KEY_WORDS = ['asdgladfj;l']
DSBI_MATH_LIN_ALGE_KEY_WORDS = ['線性代數', '代數', '幾何']
DSBI_MATH_LIN_ALGE_ANTI_KEY_WORDS = ['asdgladfj;l', '管理', '文明', '服務', '微積分']
DSBI_MATH_KEY_WORDS = ['離散', '微分', '機率', '數學', '數值', '複變']
DSBI_MATH_ANTI_KEY_WORDS = ['asdgladfj;l', '服務', '文明', '通識', '認識']
DSBI_ECONOMICS_KEY_WORDS = ['經濟學', '經濟']
DSBI_ECONOMICS_ANTI_KEY_WORDS = ['asdgladfj;l']
DSBI_BUSINESS_KEY_WORDS = ['企業', '商事', '商管']
DSBI_BUSINESS_ANTI_KEY_WORDS = ['asdgladfj;l', '資料']
DSBI_MANAGEMENT_KEY_WORDS = ['管理學', '組織', '管理']
DSBI_MANAGEMENT_ANTI_KEY_WORDS = ['asdgladfj;l', '資料', '數學', '實習', '資訊']
DSBI_ACCOUNTING_KEY_WORDS = ['會計']
DSBI_ACCOUNTING_ANTI_KEY_WORDS = ['asdgladfj;l']
DSBI_STATISTICS_KEY_WORDS = ['統計']
DSBI_STATISTICS_ANTI_KEY_WORDS = ['asdgladfj;l']
DSBI_FINANCE_KEY_WORDS = ['金融', '投資', '貨幣',
                          '資本市場', '財務', '期貨', '選擇權', '債券']
DSBI_FINANCE_ANTI_KEY_WORDS = ['asdgladfj;l']
DSBI_MARKETING_KEY_WORDS = ['行銷']
DSBI_MARKETING_ANTI_KEY_WORDS = ['asdgladfj;l']
DSBI_OP_RESEARCH_KEY_WORDS = ['作業研究']
DSBI_OP_RESEARCH_ANTI_KEY_WORDS = ['asdgladfj;l']
DSBI_EP_RESEARCH_KEY_WORDS = ['觀察研究', '市場分析', '市場研究', '討論']
DSBI_EP_RESEARCH_ANTI_KEY_WORDS = ['asdgladfj;l']
DSBI_BASIC_CS_KEY_WORDS = ['計算機', '資料庫', '資料結構', '軟體工程', '計概',
                           '演算法', '作業系統', '軟體', '電腦網路', '分散式系統']
DSBI_BASIC_CS_ANTI_KEY_WORDS = ['asdgladfj;l', '商管']
DSBI_PROGRAMMING_KEY_WORDS = ['程式']
DSBI_PROGRAMMING_ANTI_KEY_WORDS = ['asdgladfj;l']
DSBI_DATA_SCIENCE_KEY_WORDS = ['資料', '資料分析', '資料探勘']
DSBI_DATA_SCIENCE_ANTI_KEY_WORDS = ['asdgladfj;l', '庫', '結構']
DSBI_BACHELOR_THESIS_KEY_WORDS = ['專題', '論文']
DSBI_BACHELOR_THESIS_ANTI_KEY_WORDS = ['asdgladfj;l']
DSBI_BUSINESS_INFORMATIC_KEY_WORDS = [
    '資訊管理', '資管', '管理資訊', '資訊系統', '電子商務', '資訊科技']
DSBI_BUSINESS_INFORMATIC_ANTI_KEY_WORDS = ['asdgladfj;l']
USELESS_COURSES_KEY_WORDS = ['asdgladfj;l']
USELESS_COURSES_ANTI_KEY_WORDS = ['asdgladfj;l']

#################################################################################################################
##################################### Data Science and Business Intelligence English#############################
#################################################################################################################

# TODO: defining the keywords in proper way (iterative steps: generating, and see result, if mssing, then add keywords/anti_keywords)
DSBI_CALCULUS_KEY_WORDS_EN = ['calculus']
DSBI_CALCULUS_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
DSBI_MATH_KEY_WORDS_EN = ['mathematic', 'equation', 'probability']
DSBI_MATH_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
DSBI_MATH_LIN_ALGE_KEY_WORDS_EN = ['linear algebra']
DSBI_MATH_LIN_ALGE_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
DSBI_ECONOMICS_KEY_WORDS_EN = ['economics']
DSBI_ECONOMICS_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
DSBI_BUSINESS_KEY_WORDS_EN = ['business', 'commerce']
DSBI_BUSINESS_ANTI_KEY_WORDS_EN = ['asdgladfj;l', 'information']
DSBI_MANAGEMENT_KEY_WORDS_EN = ['management', 'organiz']
DSBI_MANAGEMENT_ANTI_KEY_WORDS_EN = ['asdgladfj;l', 'information', 'software', 'database']
DSBI_ACCOUNTING_KEY_WORDS_EN = ['accounting']
DSBI_ACCOUNTING_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
DSBI_STATISTICS_KEY_WORDS_EN = ['statistics']
DSBI_STATISTICS_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
DSBI_FINANCE_KEY_WORDS_EN = ['financ', 'invest', 'future', 'option']
DSBI_FINANCE_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
DSBI_MARKETING_KEY_WORDS_EN = ['market']
DSBI_MARKETING_ANTI_KEY_WORDS_EN = ['asdgladfj;l', 'securit']
DSBI_OP_RESEARCH_KEY_WORDS_EN = ['operational research', 'operation']
DSBI_OP_RESEARCH_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
DSBI_EP_RESEARCH_KEY_WORDS_EN = ['empirical']
DSBI_EP_RESEARCH_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
DSBI_BASIC_CS_KEY_WORDS_EN = ['computer', 'data', 'operating system', 'program design', 'artificial intelligen',
                              'database', 'data structure', 'algorithm']
DSBI_BASIC_CS_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
DSBI_PROGRAMMING_KEY_WORDS_EN = ['programming']
DSBI_PROGRAMMING_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
DSBI_DATA_SCIENCE_KEY_WORDS_EN = [
    'data science', 'information', 'mining', 'data analy']
DSBI_DATA_SCIENCE_ANTI_KEY_WORDS_EN = ['asdgladfj;l', 'system']
DSBI_BACHELOR_THESIS_KEY_WORDS_EN = ['專題', '論文']
DSBI_BACHELOR_THESIS_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
DSBI_BUSINESS_INFORMATIC_KEY_WORDS_EN = ['information system', 'software']
DSBI_BUSINESS_INFORMATIC_ANTI_KEY_WORDS_EN = ['asdgladfj;l']



# TODO: defining the keywords in proper way (iterative steps: generating, and see result, if mssing, then add keywords/anti_keywords)
BOE_MATH_LIN_ALGE_KEY_WORDS = ['線性代數', '代數']
BOE_MATH_LIN_ALGE_ANTI_KEY_WORDS = ['asdgladfj;l', '管理', '文明', '服務']

BOE_MATH_NUM_METHOD_KEY_WORDS = ['數值方法', '數值', '離散', '工程數學', 'Matlab']
BOE_MATH_NUM_METHOD_ANTI_KEY_WORDS = [
    'asdgladfj;l', '管理', '文明', '服務', '微積分', '認識']

BOE_CALCULUS_KEY_WORDS = ['微積分']
BOE_CALCULUS_ANTI_KEY_WORDS = ['asdgladfj;l']

BOE_GENERAL_CHEMISTRY_KEY_WORDS = ['普通化學', '化學原理', '化學原理實驗']
BOE_GENERAL_CHEMISTRY_ANTI_KEY_WORDS = ['asdgladfj;l', '管理', '文明', '服務', '微積分']

BOE_ORGANIC_CHEMISTRY_KEY_WORDS = ['有機化學', '有機化學實驗']
BOE_ORGANIC_CHEMISTRY_ANTI_KEY_WORDS = ['asdgladfj;l', '管理', '文明', '服務', '微積分']

BOE_PHYSICS_KEY_WORDS = ['物理']
BOE_PHYSICS_ANTI_KEY_WORDS = ['半導體', '元件', '史', '量子', '天文', '化學']

BOE_COMPUTER_SCIENCE_KEY_WORDS = ['計算機', '程式語言', '程式設計', '物件導向', '資料結構', '演算法']
BOE_COMPUTER_SCIENCE_ANTI_KEY_WORDS = [
    'asdgladfj;l', '應用', 'Matlab', "LabVIEW", "MATLAB"]

BOE_WERKSTOFFKUNDE_KEY_WORDS = ['材料']
BOE_WERKSTOFFKUNDE_ANTI_KEY_WORDS = ['asdgladfj;l', '力學']

BOE_COMMUNICATION_KEY_WORDS = ['電子', '電路', '密碼學', '傳輸', '電信', '信號', '訊號',
                               '網路', '無線', '通信', '通訊', '電波', '無線網路']
BOE_COMMUNICATION_ANTI_KEY_WORDS = [
    'asdgladfj;l', '專題', '進階', '神經', '微波', '日治']

BOE_MECHANIK_KEY_WORDS = ['力學', '機動', '應力', '靜力', '動力', '振動', '運動學', '震動']
BOE_MECHANIK_ANTI_KEY_WORDS = [
    '熱力', '流體', '車輛', '氣動', '量子', '聲學', '廠']

BOE_BIOLOGY_KEY_WORDS = ['生物學', '解剖學', '生理學', '遺傳學', '普通生物',
                         '細胞生物', '生物統計', '微生物', '分子生物', '免疫', '生物動力']
BOE_BIOLOGY_ANTI_KEY_WORDS = ['asdgladfj;l', '力學']

BOE_BIO_MEDICAL_KEY_WORDS = ['醫學工程', '臨床工程',
                             '臨床醫學', '測量', '醫學資訊', '生理訊號', '生醫工程']
BOE_BIO_MEDICAL_ANTI_KEY_WORDS = ['asdgladfj;l', 'mechanics']

BOE_MATH_PROB_KEY_WORDS = ['機率', '統計', '隨機']
BOE_MATH_PROB_ANTI_KEY_WORDS = ['asdgladfj;l', '學習', '管理']


BOE_ADVANCED_CHEMISTRY_KEY_WORDS = ['物理化學', '分析化學', '高分子']
BOE_ADVANCED_CHEMISTRY_ANTI_KEY_WORDS = [
    'asdgladfj;l']

BOE_INORGANIC_CHEMISTRY_KEY_WORDS = ['無機化學', '無機化學實驗']
BOE_INORGANIC_CHEMISTRY_ANTI_KEY_WORDS = [
    'asdgladfj;l', '管理', '文明', '服務', '微積分']

BOE_ADVANCED_PHYSICS_KEY_WORDS = ['固態物理', '近代物理']
BOE_ADVANCED_PHYSICS_ANTI_KEY_WORDS = [
    'asdgladfj;l']

BOE_QUANTUM_PHYSICS_KEY_WORDS = ['量子物理', '量子力學']
BOE_QUANTUM_PHYSICS_ANTI_KEY_WORDS = [
    'asdgladfj;l']

BOE_ASTRO_PHYSICS_KEY_WORDS = ['天文物理', '電漿']
BOE_ASTRO_PHYSICS_ANTI_KEY_WORDS = [
    'asdgladfj;l']

BOE_BIO_CHEMISTRY_KEY_WORDS = ['生物化學']
BOE_BIO_CHEMISTRY_ANTI_KEY_WORDS = ['asdgladfj;l']

BOE_PHYSIK_CHEMISTRY_KEY_WORDS = ['物理化學']
BOE_PHYSIK_CHEMISTRY_ANTI_KEY_WORDS = ['asdgladfj;l']

BOE_ELECTRO_MAGNET_KEY_WORDS = ['電磁']
BOE_ELECTRO_MAGNET_ANTI_KEY_WORDS = ['asdgladfj;l', '專題', '進階']

BOE_THERMALDYNAMICS_KEY_WORDS = ['熱力']
BOE_THERMALDYNAMICS_ANTI_KEY_WORDS = ['asdgladfj;l', '專題', '進階']

USELESS_COURSES_KEY_WORDS = ['asdgladfj;l']
USELESS_COURSES_ANTI_KEY_WORDS = ['asdgladfj;l']

#################################################################################################################
#################################################################################################################
#################################################################################################################

BOE_MATH_LIN_ALGE_KEY_WORDS_EN = ['linear algebra']
BOE_MATH_LIN_ALGE_ANTI_KEY_WORDS_EN = ['asdgladfj;l']

BOE_MATH_NUM_METHOD_KEY_WORDS_EN = ['numerical', 'discrete', 'matlab', '']
BOE_MATH_NUM_METHOD_ANTI_KEY_WORDS_EN = ['asdgladfj;l', '管理', '文明', '服務']

BOE_CALCULUS_KEY_WORDS_EN = ['calculus']
BOE_CALCULUS_ANTI_KEY_WORDS_EN = ['asdgladfj;l']

BOE_GENERAL_CHEMISTRY_KEY_WORDS_EN = ['general checmis']
BOE_GENERAL_CHEMISTRY_ANTI_KEY_WORDS_EN = ['asdgladfj;l']

BOE_ORGANIC_CHEMISTRY_KEY_WORDS_EN = ['organic chemis']
BOE_ORGANIC_CHEMISTRY_ANTI_KEY_WORDS_EN = ['asdgladfj;l']

BOE_PHYSICS_KEY_WORDS_EN = ['physics']
BOE_PHYSICS_ANTI_KEY_WORDS_EN = [
    'semicondu', 'device']

BOE_COMPUTER_SCIENCE_KEY_WORDS_EN = [
    'computer science', 'programming', 'object', 'data structure', 'algorithm']
BOE_COMPUTER_SCIENCE_ANTI_KEY_WORDS_EN = [
    'asdgladfj;l', '應用', 'Matlab', "labview", "matlab"]

BOE_WERKSTOFFKUNDE_KEY_WORDS_EN = ['material']
BOE_WERKSTOFFKUNDE_ANTI_KEY_WORDS_EN = ['asdgladfj;l', 'mechanics']

BOE_COMMUNICATION_KEY_WORDS_EN = ['electr', 'circuit', 'magneti', 'microwave', 'crypto', 'security', 'radio frequ',
                                  'network', 'wireless', 'communication']
BOE_COMMUNICATION_ANTI_KEY_WORDS_EN = [
    'asdgladfj;l', '專題', 'advanced', 'technical']

BOE_MECHANIK_KEY_WORDS_EN = ['mechanics', 'statics',
                             'dynamics', '機動', 'vibra', 'kine', '應力']
BOE_MECHANIK_ANTI_KEY_WORDS_EN = [
    'thermodynam', 'fluid', 'automotive', 'quantum', 'accoustic']

BOE_BIOLOGY_KEY_WORDS_EN = ['material']
BOE_BIOLOGY_ANTI_KEY_WORDS_EN = ['asdgladfj;l', 'mechanics']

BOE_BIO_MEDICAL_KEY_WORDS_EN = ['material']
BOE_BIO_MEDICAL_ANTI_KEY_WORDS_EN = ['asdgladfj;l', 'mechanics']

BOE_MATH_PROB_KEY_WORDS_EN = [
    'probability', 'statistic', 'random', 'stochasti']
BOE_MATH_PROB_ANTI_KEY_WORDS_EN = ['asdgladfj;l']

BOE_ADVANCED_CHEMISTRY_KEY_WORDS_EN = ['analytical chemist']
BOE_ADVANCED_CHEMISTRY_ANTI_KEY_WORDS_EN = ['asdgladfj;l']

BOE_INORGANIC_CHEMISTRY_KEY_WORDS_EN = ['inorganic chemis']
BOE_INORGANIC_CHEMISTRY_ANTI_KEY_WORDS_EN = ['asdgladfj;l']

BOE_ADVANCED_PHYSICS_KEY_WORDS_EN = [
    'solid state', 'modern phy']
BOE_ADVANCED_PHYSICS_ANTI_KEY_WORDS_EN = [
    'asdgladfj;l']

BOE_QUANTUM_PHYSICS_KEY_WORDS_EN = [
    'quantum']
BOE_QUANTUM_PHYSICS_ANTI_KEY_WORDS_EN = [
    'asdgladfj;l']

BOE_ASTRO_PHYSICS_KEY_WORDS_EN = [
    'astro', 'plasma']
BOE_ASTRO_PHYSICS_ANTI_KEY_WORDS_EN = [
    'asdgladfj;l']

BOE_BIO_CHEMISTRY_KEY_WORDS_EN = ['biochemistr']
BOE_BIO_CHEMISTRY_ANTI_KEY_WORDS_EN = ['asdgladfj;l']

BOE_PHYSIK_CHEMISTRY_KEY_WORDS_EN = ['physical chemis']
BOE_PHYSIK_CHEMISTRY_ANTI_KEY_WORDS_EN = ['asdgladfj;l']

BOE_ELECTRO_MAGNET_KEY_WORDS_EN = ['electromagne', 'magne']
BOE_ELECTRO_MAGNET_ANTI_KEY_WORDS_EN = ['asdgladfj;l', '專題', '進階']

BOE_THERMALDYNAMICS_KEY_WORDS_EN = ['thermodyna']
BOE_THERMALDYNAMICS_ANTI_KEY_WORDS_EN = ['asdgladfj;l', '進階']


#################################################################################################################
###################################################### Management ###############################################
#################################################################################################################

# TODO: defining the keywords in proper way (iterative steps: generating, and see result, if mssing, then add keywords/anti_keywords)
PSY_CALCULUS_KEY_WORDS = ['微積分']
PSY_CALCULUS_ANTI_KEY_WORDS = ['asdgladfj;l']
PSY_MATH_KEY_WORDS = ['離散', '微分', '數學']
PSY_MATH_ANTI_KEY_WORDS = ['asdgladfj;l', '通識', '過去', '未來']
PSY_MATH_PROB_KEY_WORDS = ['機率', '隨機']
PSY_MATH_PROB_ANTI_KEY_WORDS = ['asdgladfj;l', '學習', '管理']
PSY_ECONOMICS_KEY_WORDS = ['經濟學']
PSY_ECONOMICS_ANTI_KEY_WORDS = ['asdgladfj;l', '計量']
PSY_ECONOMETRICS_KEY_WORDS = ['計量經濟']
PSY_ECONOMETRICS_ANTI_KEY_WORDS = ['asdgladfj;l']
PSY_BUSINESS_KEY_WORDS = ['企業', '商事', '商管']
PSY_BUSINESS_ANTI_KEY_WORDS = ['asdgladfj;l', '資料']
PSY_MANAGEMENT_KEY_WORDS = ['管理學', '組織', '管理']
PSY_MANAGEMENT_ANTI_KEY_WORDS = ['asdgladfj;l', '資料', '數學', '實習']
PSY_STATISTICS_KEY_WORDS = ['統計']
PSY_STATISTICS_ANTI_KEY_WORDS = ['asdgladfj;l']
PSY_FINANCE_KEY_WORDS = ['金融', '投資', '貨幣',
                         '資本市場', '財務', '期貨', '選擇權', '債券']
PSY_FINANCE_ANTI_KEY_WORDS = ['asdgladfj;l']
PSY_MARKETING_KEY_WORDS = ['行銷']
PSY_MARKETING_ANTI_KEY_WORDS = ['asdgladfj;l']
PSY_OP_RESEARCH_KEY_WORDS = ['作業研究']
PSY_OP_RESEARCH_ANTI_KEY_WORDS = ['asdgladfj;l']
PSY_EP_RESEARCH_KEY_WORDS = ['觀察研究', '市場分析', '市場研究', '討論']
PSY_EP_RESEARCH_ANTI_KEY_WORDS = ['asdgladfj;l']
PSY_PROGRAMMING_KEY_WORDS = ['程式']
PSY_PROGRAMMING_ANTI_KEY_WORDS = ['asdgladfj;l']
PSY_DATA_SCIENCE_KEY_WORDS = ['資料']
PSY_DATA_SCIENCE_ANTI_KEY_WORDS = ['asdgladfj;l']
PSY_BACHELOR_THESIS_KEY_WORDS = ['專題', '論文', '研究']
PSY_BACHELOR_THESIS_ANTI_KEY_WORDS = ['asdgladfj;l', '作業', '觀察']
PSY_PSYCHOLOGY_KEY_WORDS = ['心理']
PSY_PSYCHOLOGY_ANTI_KEY_WORDS = ['asdgladfj;l', '實驗']
PSY_PSYCHOLOGY_EXP_KEY_WORDS = ['心理']
PSY_PSYCHOLOGY_EXP_ANTI_KEY_WORDS = ['asdgladfj;l']
PSY_COGNITIVE_SCIENCE_KEY_WORDS = ['認知']
PSY_COGNITIVE_SCIENCE_ANTI_KEY_WORDS = ['asdgladfj;l']
PSY_BEHAVIOR_KEY_WORDS = ['行為']
PSY_BEHAVIOR_ANTI_KEY_WORDS = ['asdgladfj;l']
PSY_NEURO_SCIENCE_KEY_WORDS = ['神經科學']
PSY_NEURO_SCIENCE_ANTI_KEY_WORDS = ['asdgladfj;l']
USELESS_COURSES_KEY_WORDS = ['asdgladfj;l']
USELESS_COURSES_ANTI_KEY_WORDS = ['asdgladfj;l']

#################################################################################################################
########################################## Management English ###################################################
#################################################################################################################

# TODO: defining the keywords in proper way (iterative steps: generating, and see result, if mssing, then add keywords/anti_keywords)
PSY_MATH_KEY_WORDS_EN = ['mathematic']
PSY_MATH_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
PSY_MATH_LIN_KEY_WORDS_EN = ['linear algebra']
PSY_MATH_LIN_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
PSY_MATH_PROB_KEY_WORDS_EN = ['probabi', '隨機']
PSY_MATH_PROB_ANTI_KEY_WORDS_EN = ['asdgladfj;l', '學習', '管理']
PSY_ECONOMICS_KEY_WORDS_EN = ['economic']
PSY_ECONOMICS_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
PSY_ECONOMETRICS_KEY_WORDS_EN = ['econometric']
PSY_ECONOMETRICS_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
PSY_BUSINESS_KEY_WORDS_EN = ['business']
PSY_BUSINESS_ANTI_KEY_WORDS_EN = ['asdgladfj;l', '資料']
PSY_MANAGEMENT_KEY_WORDS_EN = ['management', 'organiz']
PSY_MANAGEMENT_ANTI_KEY_WORDS_EN = ['asdgladfj;l', '資料']
PSY_STATISTICS_KEY_WORDS_EN = ['statisti']
PSY_STATISTICS_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
PSY_FINANCE_KEY_WORDS_EN = ['finan']
PSY_FINANCE_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
PSY_MARKETING_KEY_WORDS_EN = ['marketing']
PSY_MARKETING_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
PSY_OP_RESEARCH_KEY_WORDS_EN = ['operational resear']
PSY_OP_RESEARCH_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
PSY_EP_RESEARCH_KEY_WORDS_EN = ['empirical resear']
PSY_EP_RESEARCH_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
PSY_PROGRAMMING_KEY_WORDS_EN = ['programming']
PSY_PROGRAMMING_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
PSY_DATA_SCIENCE_KEY_WORDS_EN = ['datda']
PSY_DATA_SCIENCE_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
PSY_BACHELOR_THESIS_KEY_WORDS_EN = ['project', '論文']
PSY_BACHELOR_THESIS_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
PSY_PSYCHOLOGY_KEY_WORDS_EN = ['psycho']
PSY_PSYCHOLOGY_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
PSY_PSYCHOLOGY_EXP_KEY_WORDS_EN = ['psycho']
PSY_PSYCHOLOGY_EXP_ANTI_KEY_WORDS_EN = ['asdgladfj;l', 'lab', 'experi']
PSY_COGNITIVE_SCIENCE_KEY_WORDS_EN = ['cognit']
PSY_COGNITIVE_SCIENCE_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
PSY_BEHAVIOR_KEY_WORDS_EN = ['behavio']
PSY_BEHAVIOR_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
PSY_NEURO_SCIENCE_KEY_WORDS_EN = ['cogniti']
PSY_NEURO_SCIENCE_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
USELESS_COURSES_KEY_WORDS_EN = ['asdgladfj;l']
USELESS_COURSES_ANTI_KEY_WORDS_EN = ['asdgladfj;l']



USELESS_COURSES_KEY_WORDS = ['asdgladfj;l']
USELESS_COURSES_ANTI_KEY_WORDS = ['asdgladfj;l']
USELESS_COURSES_KEY_WORDS_EN = ['asdgladfj;l']
USELESS_COURSES_ANTI_KEY_WORDS_EN = ['asdgladfj;l']

KEY_WORDS = 0
ANTI_KEY_WORDS = 1
DIFFERENTIATE_KEY_WORDS = 2

#################################################################################################################
########################################## Electrical Engineering ###############################################
#################################################################################################################

# TODO: defining the keywords in proper way (iterative steps: generating, and see result, if mssing, then add keywords/anti_keywords)
EE_CALCULUS_KEY_WORDS = ['微積分']
EE_CALCULUS_ANTI_KEY_WORDS = ['asdgladfj;l']
EE_MATH_KEY_WORDS = ['數學', '代數', '微分', '函數', '機率', '離散', '複變', '數值', '向量']
EE_MATH_ANTI_KEY_WORDS = ['asdgladfj;l']
EE_INTRO_COMPUTER_SCIENCE_KEY_WORDS = ['計算機', '演算', '資料', '運算', '數位系統',
                                       '資電', '作業系統', '資料結構', '編譯器']
EE_INTRO_COMPUTER_SCIENCE_ANTI_KEY_WORDS = [
    '倫理', 'Python', '機器學習', '傳輸', '素人', '思考']
EE_PROGRAMMING_KEY_WORDS = ['程式設計', '程式語言',
                            '物件', 'python', 'c++', 'java', 'c語言', '組合語言']
EE_PROGRAMMING_ANTI_KEY_WORDS = ['倫理', 'Python', '機器學習']
EE_SOFTWARE_SYSTEM_KEY_WORDS = ['軟體工程', ]
EE_SOFTWARE_SYSTEM_ANTI_KEY_WORDS = ['asdgladfj;l']
EE_CONTROL_THEORY_KEY_WORDS = ['控制', '線性系統', '非線性系統']
EE_CONTROL_THEORY_ANTI_KEY_WORDS = ['asdgladfj;l', '網路', '碼', '儀']
EE_PHYSICS_KEY_WORDS = ['物理']
EE_PHYSICS_ANTI_KEY_WORDS = ['半導體', '元件', '實驗', '史', '服務', '冶金']
EE_PHYSICS_EXP_KEY_WORDS = ['物理']
EE_PHYSICS_EXP_ANTI_KEY_WORDS = ['半導體', '元件', '史', '服務']
EE_ELECTRONICS_KEY_WORDS = ['電子', '電子電路']
EE_ELECTRONICS_ANTI_KEY_WORDS = [
    '實驗', '專題', '電力', '固態', '自動化', '倫理', '素養', '進階', '材料', '藝術', '視覺', '近代']
EE_ELECTRONICS_EXP_KEY_WORDS = ['電子實驗', '電子', '電工實驗']
EE_ELECTRONICS_EXP_ANTI_KEY_WORDS = ['專題', '電力', '固態', '自動化', '藝術', '材料', '近代']
EE_ELECTRO_CIRCUIT_KEY_WORDS = ['電路', '數位邏輯', '邏輯系統', '邏輯設計']
EE_ELECTRO_CIRCUIT_ANTI_KEY_WORDS = [
    '超大型', '專題', '倫理', '素養', '進階', '藝術', '高頻', '微波']
EE_SIGNAL_SYSTEM_KEY_WORDS = ['訊號與系統', '信號與系統', '訊號', '信號']
EE_SIGNAL_SYSTEM_ANTI_KEY_WORDS = ['asdgladfj;l''超大型', '專題']
EE_ELECTRO_MAGNET_KEY_WORDS = ['電磁']
EE_ELECTRO_MAGNET_ANTI_KEY_WORDS = ['asdgladfj;l', '專題', '進階']
EE_POWER_ELECTRO_KEY_WORDS = ['電力', '能源', '電動機', '電機', '高壓電', '電傳輸', '配電']
EE_POWER_ELECTRO_ANTI_KEY_WORDS = ['asdgladfj;l', '專題', '進階']
EE_COMMUNICATION_KEY_WORDS = ['密碼學', '安全', '傳輸', '射頻', '電信',
                              '網路', '無線', '通信', '通訊', '電波', '無線網路']
EE_COMMUNICATION_ANTI_KEY_WORDS = [
    'asdgladfj;l', '專題', '進階', '金融', '神經', '微波', '日治']
EE_HF_RF_THEO_INFO_KEY_WORDS = [
    '微波', '高頻', '電磁波', '天線', '通道', '消息', '編碼', 'RF']
EE_HF_RF_THEO_INFO_ANTI_KEY_WORDS = ['asdgladfj;l', '專題', '進階']
EE_SEMICONDUCTOR_KEY_WORDS = ['半導體', '元件', '固態']
EE_SEMICONDUCTOR_ANTI_KEY_WORDS = ['專題', '倫理', '素養', '藝術', '電子']
EE_ELEC_MATERIALS_KEY_WORDS = ['電子', '材料']
EE_ELEC_MATERIALS_ANTI_KEY_WORDS = ['專題', '倫理', '藝術', '素養']
EE_ADVANCED_ELECTRO_KEY_WORDS = ['積體電路', '自動化',  '藍芽', '晶片', '類比', '數位訊號', '數位信號',
                                 '微算機', '微處理', 'VLSI', '嵌入式', '人工智慧', '機器學習']
EE_ADVANCED_ELECTRO_ANTI_KEY_WORDS = ['倫理', '藝術', '素養']
EE_APPLICATION_ORIENTED_KEY_WORDS = ['生醫', '光機電', '電腦', '微系統', '物聯網', '聲學', '微機電',
                                     '影像', '深度學習', '光電', '應用', '綠能', '雲端運算', '醫學工程', '再生能源']
EE_APPLICATION_ORIENTED_ANTI_KEY_WORDS = ['倫理', '素養', '入門', '經濟', '微波']
EE_MACHINE_RELATED_KEY_WORDS = ['力學', '流體',
                                '熱力', '傳導', '熱傳', '機械', '動力', '熱流', '機動']
EE_MACHINE_RELATED_ANTI_KEY_WORDS = ['asdgladfj;l']
USELESS_COURSES_KEY_WORDS = ['asdgladfj;l']
USELESS_COURSES_ANTI_KEY_WORDS = ['asdgladfj;l']

#################################################################################################################
################################### Electrical Engineering English ##############################################
#################################################################################################################

# TODO: defining the keywords in proper way (iterative steps: generating, and see result, if mssing, then add keywords/anti_keywords)
EE_CALCULUS_KEY_WORDS_EN = ['calculus']
EE_CALCULUS_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
EE_MATH_KEY_WORDS_EN = ['mathe', 'algebra', 'differential', '函數', 'multivar',
                        'probability', 'discrete math', 'complex', 'numerical', 'vector analy']
EE_MATH_ANTI_KEY_WORDS_EN = ['asdgladfj;l', 'device']

EE_INTRO_COMPUTER_SCIENCE_KEY_WORDS_EN = ['computer', 'algorithm', 'object', 'computing',
                                          '資電', 'operating system', 'data structure', 'software', 'compiler']
EE_INTRO_COMPUTER_SCIENCE_ANTI_KEY_WORDS_EN = [
    '倫理', 'Python', 'machine learning', 'circuit', 'program']
EE_PROGRAMMING_KEY_WORDS_EN = ['programming', 'program',
                               'language', 'Python', 'c++', 'c language']
EE_PROGRAMMING_ANTI_KEY_WORDS_EN = [
    'ethnic', 'Python', 'machine learning', 'vision', 'chinese', 'english', 'german']
EE_SOFTWARE_SYSTEM_KEY_WORDS_EN = ['software engineering', ]
EE_SOFTWARE_SYSTEM_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
EE_CONTROL_THEORY_KEY_WORDS_EN = ['control', 'linear system', '非線性系統']
EE_CONTROL_THEORY_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
EE_PHYSICS_KEY_WORDS_EN = ['physics']
EE_PHYSICS_ANTI_KEY_WORDS_EN = [
    'semicondu', 'device', 'experiment', 'lab']
EE_PHYSICS_EXP_KEY_WORDS_EN = ['physics']
EE_PHYSICS_EXP_ANTI_KEY_WORDS_EN = ['semicondu', '元件']
EE_ELECTRONICS_KEY_WORDS_EN = ['electronic', 'electrical']
EE_ELECTRONICS_ANTI_KEY_WORDS_EN = [
    'project', 'power', 'solid', 'automation', 'ethnic', '素養', 'advanced', 'lab', 'experiment']
EE_ELECTRONICS_EXP_KEY_WORDS_EN = ['lab', 'electroni']
EE_ELECTRONICS_EXP_ANTI_KEY_WORDS_EN = [
    'physic', 'chemistry', 'general', '材料', 'wave', 'digital', 'mechanic']
EE_ELECTRO_CIRCUIT_KEY_WORDS_EN = [
    'circuit', 'signal', 'fpga', 'hdl', '數位邏輯', 'logic']
EE_ELECTRO_CIRCUIT_ANTI_KEY_WORDS_EN = ['超大型', '專題']
EE_SIGNAL_SYSTEM_KEY_WORDS_EN = ['signals and systems']
EE_SIGNAL_SYSTEM_ANTI_KEY_WORDS_EN = ['asdgladfj;l', '超大型', '專題']
EE_ELECTRO_MAGNET_KEY_WORDS_EN = ['electromagne', 'magne']
EE_ELECTRO_MAGNET_ANTI_KEY_WORDS_EN = ['asdgladfj;l', '專題', '進階']
EE_POWER_ELECTRO_KEY_WORDS_EN = [
    'power', 'energy', '電動機', 'electrical machine', 'high voltage', 'transmission']
EE_POWER_ELECTRO_ANTI_KEY_WORDS_EN = ['asdgladfj;l', '專題', '進階']
EE_COMMUNICATION_KEY_WORDS_EN = ['microwave', 'crypto', 'security', 'radio frequ',
                                 'network', 'wireless', 'communication', '通訊', '電波']
EE_COMMUNICATION_ANTI_KEY_WORDS_EN = [
    'asdgladfj;l', '專題', 'advanced', 'technical']
EE_HF_RF_THEO_INFO_KEY_WORDS_EN = [
    'microwav', 'high frequen', 'electromagnetic wave' 'antenna', 'channel', 'information theory']
EE_HF_RF_THEO_INFO_ANTI_KEY_WORDS_EN = ['asdgladfj;l', '專題', 'advanced']
EE_SEMICONDUCTOR_KEY_WORDS_EN = ['semicondu', '元件', 'solid state']
EE_SEMICONDUCTOR_ANTI_KEY_WORDS_EN = ['專題', 'ethnic', '素養']
EE_ELEC_MATERIALS_KEY_WORDS_EN = ['電子材料']
EE_ELEC_MATERIALS_ANTI_KEY_WORDS_EN = ['專題', 'ethnic', '素養']
EE_ADVANCED_ELECTRO_KEY_WORDS_EN = ['integrated circuit', 'automation',  'bluetooth', 'chip', 'analog', 'digital', 'digital signal',
                                    'microprocessor', 'microcontroller', 'vlsi', 'embedded', 'artificial', 'machine learning', 'ulsi']
EE_ADVANCED_ELECTRO_ANTI_KEY_WORDS_EN = ['ethnic', '素養']
EE_APPLICATION_ORIENTED_KEY_WORDS_EN = ['生醫', 'neuro', '光機電', 'mems', 'iot', 'accoustics', 'solar',
                                        'image', 'deep learning', 'optoelectronics', '應用', 'green', 'cloud', 'medical', 'renewable']
EE_APPLICATION_ORIENTED_ANTI_KEY_WORDS_EN = ['ethnic', '素養']
EE_MACHINE_RELATED_KEY_WORDS_EN = ['mechanics', 'fluid', 'statics', 'dynamics',
                                   'thermodyna', '傳導', 'conduction', 'machine', 'heat flux', '機動']
EE_MACHINE_RELATED_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
USELESS_COURSES_KEY_WORDS_EN = ['asdgladfj;l']
USELESS_COURSES_ANTI_KEY_WORDS_EN = ['asdgladfj;l']

KEY_WORDS = 0
ANTI_KEY_WORDS = 1
DIFFERENTIATE_KEY_WORDS = 2

#################################################################################################################
########################################## Mechanical Engineering ###############################################
#################################################################################################################

# TODO: defining the keywords in proper way (iterative steps: generating, and see result, if mssing, then add keywords/anti_keywords)
MTL_MATH_DISCRETE_KEY_WORDS = ['離散', '圖形', '圖論', '邏輯']
MTL_MATH_DISCRETE_ANTI_KEY_WORDS = ['asdgladfj;l', '管理']
MTL_MATH_LIN_ALGE_KEY_WORDS = ['線性代數', '代數']
MTL_MATH_LIN_ALGE_ANTI_KEY_WORDS = ['asdgladfj;l', '管理', '文明', '服務', '微積分']
MTL_MATH_NUM_METHOD_KEY_WORDS = ['數值方法', '數值']
MTL_MATH_NUM_METHOD_ANTI_KEY_WORDS = [
    'asdgladfj;l', '管理', '文明', '服務', '微積分', '認識']
MTL_CALCULUS_KEY_WORDS = ['微積分']
MTL_CALCULUS_ANTI_KEY_WORDS = ['asdgladfj;l']
MTL_MATH_KEY_WORDS = ['數學', '微分', '函數', '機率', '複變', '向量', '幾何']
MTL_MATH_ANTI_KEY_WORDS = ['asdgladfj;l', '離散']
MTL_PHYSICS_KEY_WORDS = ['物理']
MTL_PHYSICS_ANTI_KEY_WORDS = ['半導體', '元件', '實驗', '車輛', '通識', '化學']
MTL_PHYSICS_EXP_KEY_WORDS = ['物理']
MTL_PHYSICS_EXP_ANTI_KEY_WORDS = ['半導體', '元件', '車輛']
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
MTL_MATH_LIN_ALGE_KEY_WORDS_EN = ['linear algebra', 'numerical']
MTL_MATH_LIN_ALGE_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
MTL_MATH_NUM_METHOD_KEY_WORDS_EN = ['numerical']
MTL_MATH_NUM_METHOD_ANTI_KEY_WORDS_EN = ['asdgladfj;l', '管理', '文明', '服務']
MTL_CALCULUS_KEY_WORDS_EN = ['calculus']
MTL_CALCULUS_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
MTL_MATH_KEY_WORDS_EN = ['math', 'linear algebra', 'differential', '函數',
                         'probability', 'discrete', 'complex', 'numerical', 'vector analy']
MTL_MATH_ANTI_KEY_WORDS_EN = ['asdgladfj;l']
MTL_PHYSICS_KEY_WORDS_EN = ['physics']
MTL_PHYSICS_ANTI_KEY_WORDS_EN = [
    'semiconductor', 'device', 'experi', '車輛', '通識']
MTL_PHYSICS_EXP_KEY_WORDS_EN = ['physics']
MTL_PHYSICS_EXP_ANTI_KEY_WORDS_EN = ['semiconductor', 'device', '車輛']
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

USELESS_COURSES_KEY_WORDS_EN = ['asdgladfj;l']
USELESS_COURSES_ANTI_KEY_WORDS_EN = ['asdgladfj;l']

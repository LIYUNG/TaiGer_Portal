#https://www.youtube.com/watch?v=-ARI4Cz-awo
#https://www.youtube.com/watch?v=jxmzY9soFXg&t=3s
#https://youtu.be/p0A4CV4MWd0?si=9g-Qjbt9G6OUjo5T
#https://www.youtube.com/watch?v=gCD-Wsb_Iw4

import logging 

logger = logging.getLogger(__name__) # this is importat to avoid everyone use the "root logger"
logger.setLevel(logging.DEBUG) #default logging level above "warning"

# fomatter defines how the debug message is structured
time_format = '%Y-%m-%d %H:%M:%S'
formatter = logging.Formatter('%(asctime)s | %(name)s | %(levelname)s | %(message)s', datefmt=time_format) # https://docs.python.org/3/library/logging.html#logrecord-attributes)

# file handler is for the file name and formatting
file_handler = logging.FileHandler('../logs/test.log')
file_handler.setFormatter(formatter)

# optional stream_handler - so it will print out to the console
stream_handler = logging.StreamHandler()
stream_handler.setFormatter(formatter)

logger.addHandler(file_handler)
logger.addHandler(stream_handler)



def add(x,y):
    return x+y

def substract(x,y):
    return x-y

num_1 = 20
num_2 = 10

add_res = add(num_1, num_2)
logger.debug(f"Add: {num_1} + {num_2} = {add_res}")
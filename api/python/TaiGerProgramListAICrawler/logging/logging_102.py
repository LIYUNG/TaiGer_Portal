#https://www.youtube.com/watch?v=gCD-Wsb_Iw4

import logging 
from logging.config import dictConfig

config = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters':{
        'standard':{
            'format': '%(asctime)s | %(name)s | %(levelname)s | %(message)s'
        }
    },
    'handlers':{
        'stream':{
            'level':'DEBUG',
            'formatter':'standard',
            'class':'logging.StreamHandler',
            'stream':"ext://sys.stdout"
        },
        'file':{
            'level':'DEBUG',
            'formatter':'standard',
            'class':'logging.FileHandler',
            'filename':'../logs/dict_simple.log'
        }
    },
    'loggers':{
        "":{
            'level':"DEBUG",
            'handlers':['stream', 'file'],
            'propagate':True
        },
        "logger_test":{
            'level':"DEBUG",
            'handlers':['stream'],
            'propagate':True
        },
    }
}

dictConfig(config)
logger = logging.getLogger("logger_test")


def add(x,y):
    return x+y

def substract(x,y):
    return x-y

num_1 = 20
num_2 = 10

add_res = add(num_1, num_2)
logger.debug(f"Add: {num_1} + {num_2} = {add_res}")

logger.warning('this is warning')
## Cite sources
import textwrap
import pandas as pd


import sys
sys.path.append("..") # Adds higher directory to python module path

# add logging funcitonality
import logging.config
import json
from datetime import datetime
with open('../logging/program_info_logging_config.json', 'r') as f:
    config = json.load(f)

# Replace the placeholder with the current date
today = datetime.now().strftime('%Y-%m-%d')
log_file_path = f'../logs/program_info_{today}.log'
config['handlers']['file']['filename'] = log_file_path


logging.config.dictConfig(config)
logger = logging.getLogger("program_info_logger")


def wrap_text_preserve_newlines(text, width=110):
    # Split the input text into lines based on newline characters
    lines = text.split('\n')

    # Wrap each line individually
    wrapped_lines = [textwrap.fill(line, width=width) for line in lines]

    # Join the wrapped lines back together using newline characters
    wrapped_text = '\n'.join(wrapped_lines)

    return wrapped_text

def format_llm_response(llm_response):
    logger.info(wrap_text_preserve_newlines(llm_response['result']))
    for source in llm_response["source_documents"]:
        logger.info(f"source: {source.metadata['source']}")


def add_source_into_cell(data_dict, sources):
    '''
    add the source into the cell, update the dataframe
    '''
    updated_dict = {key: f"{value}, source = {sources}" for key, value in data_dict.items()}
    return updated_dict


def add_source_into_another_column(data_dict, source_list):

    #Extract keys and valyes from the dic
    keys = list(data_dict.keys()) # this will be used for "row name"
    values = list(data_dict.values()) # this will be used for values

    # create Dataframe
    df = pd.DataFrame({
        'Result': values,
    }, index=keys) #index = column name


    # some formating
    def format_list(items):
        return '\n'.join([f"{i+1}. {item}" for i, item in enumerate(items)])
    
    df['Source'] = [source_list for _ in range(len(df))] # now fill in with the same values
    df['Source'] = df['Source'].apply(format_list)

    return df
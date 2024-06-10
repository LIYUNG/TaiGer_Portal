import os
from dotenv import load_dotenv
import pymongo

env_file_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../../.env.development')
if not os.path.exists(env_file_path):
    raise FileNotFoundError(f'File not found: {env_file_path}')

load_dotenv(env_file_path)

def get_db_connection(db_name = 'TaiGer_Prod'):    
    connection_str = os.getenv('MONGODB_URI')
    if connection_str is None:
        raise ValueError('MONGODB_URI is not set in the .env file')
    client = pymongo.MongoClient(connection_str)
    return client[db_name]
 
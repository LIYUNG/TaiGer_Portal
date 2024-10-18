import json
import os
import boto3
from botocore.exceptions import ClientError
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

# Global variables to store the MongoDB client and database connection
mongo_client = None
db = None

# Initialize the Secrets Manager client
secrets_manager = boto3.client('secretsmanager')


def get_secret():
    secret_name = os.environ['SECRET_NAME']
    try:
        get_secret_value_response = secrets_manager.get_secret_value(
            SecretId=secret_name)
    except ClientError as e:
        raise e
    else:
        if 'SecretString' in get_secret_value_response:
            secret = get_secret_value_response['SecretString']
            return json.loads(secret)
        else:
            raise ValueError("Secret not found in expected format")


def get_database():
    global mongo_client
    global db

    if db is None:
        BASEDIR = os.path.abspath(os.path.dirname(__file__))
        full_path = os.path.join(BASEDIR, '..\..\.env.development')
        load_dotenv(full_path)
        MONGODB_URI = os.environ.get("MONGODB_URI")

        mongo_uri = MONGODB_URI
        db_name = "TaiGer"
        # # Retrieve MongoDB URI from Secrets Manager
        # secret = get_secret()
        # mongo_uri = secret['MONGODB_URI']
        # db_name = secret['DB_NAME']

        # Create a new client and connect to the server
        mongo_client = MongoClient(mongo_uri)

        # Send a ping to confirm a successful connection
        try:
            mongo_client.admin.command('ping')
            print("Successfully connected to MongoDB!")
        except Exception as e:
            print(f"Failed to connect to MongoDB: {e}")
            raise e

        # Get the database
        db = mongo_client[db_name]

    return db

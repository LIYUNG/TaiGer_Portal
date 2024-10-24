import json
import os
import boto3
from botocore.exceptions import ClientError
from pymongo import MongoClient
from dotenv import load_dotenv

from globals import programs_mock

# Global variables to store the MongoDB client and database connection
mongo_client = None
db = None

# Initialize the Secrets Manager client
secrets_manager = boto3.client('secretsmanager')


# Use this code snippet in your app.
# If you need more information about configurations
# or implementing the sample code, visit the AWS docs:
# https://aws.amazon.com/developer/language/python/


def get_secret_aws_example():

    secret_name = "prod/taigerportal/mongodb"
    region_name = "us-west-2"

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        # For a list of exceptions thrown, see
        # https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        raise e

    secret = get_secret_value_response['SecretString']

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

def get_keywords_collection():
    # Get the database connection
    database = get_database()

    # Use the database connection to perform operations
    collection = database['testkeywords']

    # Example: Fetch all documents from the collection
    documents = list(collection.find({}))

    # Preprocess data to convert to desired structure
    processed_data = {
        item['categoryName']: {
            'keywords': item['keywords'],
            'antiKeywords': item['antiKeywords']
        }
        for item in documents
    }

    return processed_data


def get_programs_analysis_collection():
    # Get the database connection
    database = get_database()

    # Use the database connection to perform operations
    collection = database['programanalyse']

    # Example: Fetch all documents from the collection
    documents = list(collection.find({}))

    return documents


def get_programs_analysis_collection_mock():
    # # Get the database connection
    # database = get_database()

    # # Use the database connection to perform operations
    # collection = database['programanalyse']

    # Example: Fetch all documents from the collection
    documents = programs_mock

    return documents


def generate_classification(lang, subjects, processed_data):
    """Helper function to dynamically generate classification dict for 'zh' and 'en'."""
    return {
        subject_name: [
            processed_data[category]['keywords'][lang],
            processed_data[category]['antiKeywords'][lang],
            extras
        ]
        for subject_name, (category, extras) in subjects.items()
    }


def convert_courses(course_dict, lang):
    result = {}

    # Loop through each course in the dictionary
    for course_name, course_details in course_dict.items():
        # Extract the relevant details
        keywords = course_details.get('keywords', {}).get(lang, [])
        anti_keywords = course_details.get('antiKeywords', {}).get(lang, [])

        # Add the additional ['一', '二'] list
        additional_list = ['一', '二']

        # Store the course data in the desired format
        result[course_name] = [keywords, anti_keywords, additional_list]

    return result

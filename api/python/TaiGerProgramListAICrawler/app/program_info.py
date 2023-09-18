import os
import sys
sys.path.append("..") # Adds higher directory to python module path

# load API
from dotenv import find_dotenv, load_dotenv
load_dotenv(find_dotenv())

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


# This provide super useful langchain debug info
#import langchain
#langchain.debug = True

def get_program_info(university_name, program_name, degree):

    #-------------- 1. Get user input for "university_name", "program_name", and "degree" ----------------
    logger.info(f"---------------1. Start looking for {university_name}, {program_name}, {degree}------------")
    from search.program_url_searcher import get_program_links
    links = get_program_links(university_name, program_name, degree, number=3) # this will change the embedding cost

    logger.info("--------------------- 2. Start Embedding ---------------------")
    from langchain.vectorstores import Chroma
    from langchain.embeddings import OpenAIEmbeddings
    from langchain.document_loaders import UnstructuredURLLoader
    
    # here might face the 'libmagic' issues
    loaders = UnstructuredURLLoader(urls=links)
    data = loaders.load()

    embedding_model = "text-embedding-ada-002"
    from embedding.embedding_utils import tokens2price, text2tokens

    from langchain.text_splitter import RecursiveCharacterTextSplitter

    text_splitter = RecursiveCharacterTextSplitter( chunk_size=1000, chunk_overlap=200)
    docs = text_splitter.split_documents(data)
    tokens = 0

    for doc in docs:
            tokens += text2tokens(embedding_model, doc.page_content)
    embedding_cost = tokens2price(embedding_model, "embedding", tokens)

    embeddings = OpenAIEmbeddings(model=embedding_model)

    persist_directory = 'tempDB'

    vectordb = Chroma.from_documents(documents = docs,
                                     embedding=embeddings,
                                     persist_directory=persist_directory)

    logger.info(f"Total Embedding Cost (USD): ${embedding_cost}")

    logger.info("--------------------- 3. Start Retrieval process ---------------------")
    retriever = vectordb.as_retriever(search_type='similarity', search_kwargs={"k":3}) # force only return 3 results
    
    
    # use the chat model
    from langchain.chat_models import ChatOpenAI
    chat=ChatOpenAI(temperature=0, model_name='gpt-3.5-turbo-0613')
    logger.info("use LLM model: {chat}")
    
    #use the llm model
    #from langchain.llms import OpenAI
    #llm=OpenAI(temperature=0)
    #logger.info("use LLM model:{llm}")
    
    from retrieval.retrieval_utls import process_program_information # This is the meat

    df_program = process_program_information(university_name=university_name, 
                                             program_name=program_name, 
                                             llm=chat, retriever=retriever)

    
    # 4. Remove VectorDB
    logger.info("--------------------- 4. Remvoing temp vector database ---------------------")
    import shutil
    if os.path.exists(persist_directory) and os.path.isdir(persist_directory):
        try:
            shutil.rmtree(persist_directory)
            logger.info(f"'{persist_directory}' has been deleted successfully.")
        except Exception as e:
            logger.warning(f"Error deleting '{persist_directory}': {e}")
    else:
        logger.warning(f"'{persist_directory}' does not exist or is not a directory.")
    
    logger.info("--------------------- End ----------------------------------\n\n\n\n\n")
    return df_program

if __name__ == "__main__":
    university_name = "Technische University Munich"
    program_name = "Informatics"
    degree = "Master degree"
    get_program_info(university_name, program_name, degree)


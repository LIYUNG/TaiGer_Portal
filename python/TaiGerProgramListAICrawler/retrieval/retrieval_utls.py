import sys
sys.path.append("..") # Adds higher directory to python module path


from langchain.callbacks import get_openai_callback # to get the cost
from langchain.chains import RetrievalQA 
from langchain import PromptTemplate
from langchain.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate
import pandas as pd

# import util functions
from retrieval.format_util import format_llm_response, add_source_into_another_column

# import pydantic object
from langchain.output_parsers import PydanticOutputParser
from schema.structure_schema_util import ProgramBaseInfo, ApplicationPeriod, RequiredDocument, RequiredLanguage, RequiredAcademicPerf, UrlLinks


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


# wraper funciton
def retreival_qa_chain_wrapper_with_chat_model(pydanticObject, retriever, chat_model, query):
    '''
    This is just a wrapper function to avoid repeated patten code
    This function includes the system and message message -> TBD: can think of to take it out later
    '''
        
    system_message_template = '''
    You are a education consultant named TaiGer who provides study program information.
    you summarizes the "program information" based on the desire study program from the applicant.
    If you don't know the answer, just say that you don't know, don't try to make up an answer!
    Always answer from the perspective of being TaiGer 
    
    ----
    context:
    {context}\n

    -----
    '''

    human_tamplate = '''
    {question}

    extract the above information in the following format:
    \n{format_instructions}\n
    '''

    # Initialize the output_parser from the pydantic object
    output_parser = PydanticOutputParser(pydantic_object=pydanticObject)

    # This is how the RetrievalQA chain
    prompt = ChatPromptTemplate(
        messages=[
            SystemMessagePromptTemplate.from_template(system_message_template),
            HumanMessagePromptTemplate.from_template(human_tamplate)  
        ],
        input_variables=["context", "question"],
        partial_variables={"format_instructions": output_parser.get_format_instructions()},
        output_parser=output_parser # here we add the output parser to the Prompt template
    )

    with get_openai_callback() as cb:
        # Form RetrievalQA chain
        chain = RetrievalQA.from_chain_type(llm=chat_model, 
                                        chain_type="stuff", # stuff cost you less.
                                        retriever=retriever,
                                        chain_type_kwargs = {"prompt":prompt},
                                        return_source_documents=True)

        llm_response = chain(query) #by-pass the query here
        format_llm_response(llm_response)

    logger.info(f"Total Tokens: {cb.total_tokens}")
    logger.info(f"Prompt Tokens: {cb.prompt_tokens}")
    logger.info(f"Completion Tokens: {cb.completion_tokens}")
    logger.info(f"Successful Requests: {cb.successful_requests}")
    logger.info(f"Total Cost (USD): ${cb.total_cost}")
    logger.info("-------------------------------------------------\n\n")
    

    # results -> use output parser to parse
    result_dict = output_parser.parse(llm_response['result']).dict() # this covert the pydantic object to dict

    source_list = []
    for source in llm_response["source_documents"]:
        source_list.append(source.metadata['source'])


    #todo: here need to clean up the output and make it json or pandas like!
    #remember that the output source need to be kept as well for traceability!
    return result_dict, source_list


# wraper funciton
def retreival_qa_chain_wrapper_with_llm_model(pydanticObject, retriever, llm_model, query):
    '''
    This is just a wrapper function to avoid repeated patten code
    This function includes the system and message message -> TBD: can think of to take it out later
    '''
        
    prompt_template = '''
    You are a education consultant named TaiGer who provides accurate study program information to taiwanese applicants.
    you summarizes the "program information" and provides the information based on the following context:
    If you don't know the answer, just say that you don't know, don't try to make up an answer.  Always answer from the perspective of being TaiGer 
    ----
    
    context:
    {context}\n

    -----
    extract the above information in the following format:
    \n{format_instructions}\n
    '''

    # Initialize the output_parser from the pydantic object
    output_parser = PydanticOutputParser(pydantic_object=pydanticObject)

    # This is how the RetrievalQA chain
    prompt = PromptTemplate(
        template=prompt_template,
        input_variables=["context"],
        partial_variables={"format_instructions": output_parser.get_format_instructions()},
        output_parser=output_parser # here we add the output parser to the Prompt template
    )

    with get_openai_callback() as cb:
        # Form RetrievalQA chain
        chain = RetrievalQA.from_chain_type(llm=llm_model, 
                                            chain_type="stuff", # stuff cost you less.
                                            retriever=retriever,
                                            chain_type_kwargs = {"prompt":prompt},
                                            return_source_documents=True)

        llm_response = chain(query) #by-pass the query here
        format_llm_response(llm_response)

    logger.info(f"Total Tokens: {cb.total_tokens}")
    logger.info(f"Prompt Tokens: {cb.prompt_tokens}")
    logger.info(f"Completion Tokens: {cb.completion_tokens}")
    logger.info(f"Successful Requests: {cb.successful_requests}")
    logger.info(f"Total Cost (USD): ${cb.total_cost}")
    logger.info("-------------------------------------------------\n\n")
    

    # results -> use output parser to parse
    result_dict = output_parser.parse(llm_response['result']).dict() # this covert the pydantic object to dict

    source_list = []
    for source in llm_response["source_documents"]:
        source_list.append(source.metadata['source'])


    #todo: here need to clean up the output and make it json or pandas like!
    #remember that the output source need to be kept as well for traceability!
    return result_dict, source_list




# main process function
def process_program_information(university_name,
                                program_name,
                                llm, 
                                retriever):
    '''
    process program inforamtion based on the given university + program name
    return pandas dataframe
    '''


    # Set up a prefix prompt
    prefix_template =  "I want to apply for {program_name} at {university_name}. " # experimental shows that this is very important, i have no idea why...
    prefix_prompt = PromptTemplate.from_template(prefix_template)
    formatted_prefix_prompt = prefix_prompt.format(program_name=program_name, university_name=university_name)

    # 1. Get ProgramBase Info
    logger.info("Retrieving (1) Program Base info..........")
    query_base_info = formatted_prefix_prompt + "Can you tell me about this program?"
    logger.info(f"Query: {query_base_info}")
    programBaseinfo_result, sources = retreival_qa_chain_wrapper_with_chat_model(ProgramBaseInfo, retriever, llm, query_base_info)
    df_programBaseInfo = add_source_into_another_column(programBaseinfo_result, sources)

    # 2. Get Application Period Info
    logger.info("Retrieving (2) Application Period info.........")
    query_application_period = formatted_prefix_prompt + "what is the application period and deadline to apply this program?"
    logger.info(f"Query: {query_application_period}")
    applicationPeriod_result, sources = retreival_qa_chain_wrapper_with_chat_model(ApplicationPeriod, retriever, llm, query_application_period)
    df_applicationPeriod = add_source_into_another_column(applicationPeriod_result, sources)


    # 3. Get the Required Document Info
    logger.info("Retrieving (3) required Document info.........")
    query_required_documents = formatted_prefix_prompt + "Which documents do I need to submit during the online application?"
    logger.info(f"Query: {query_required_documents}")
    requiredDocument_result, sources = retreival_qa_chain_wrapper_with_chat_model(RequiredDocument, retriever, llm, query_required_documents)
    df_requiredDocument = add_source_into_another_column(requiredDocument_result, sources)


    # 4. Get the Required Language Info
    logger.info("Retrieving (4) required Language info.........")
    query_required_language = formatted_prefix_prompt + "what are the required language certificate scores to apply this program? e.g. TOFEL, IELTS, GRE, GMAT"
    logger.info(f"Query: {query_required_language}")
    requiredLanguage_result, sources  = retreival_qa_chain_wrapper_with_chat_model(RequiredLanguage,  retriever, llm,query_required_language)
    df_requiredLanguage = add_source_into_another_column(requiredLanguage_result, sources)



    # 5. Get the required academic performance info
    logger.info("Retrieving (5) required Academic Performance info.........")
    query_academic_perf = formatted_prefix_prompt + "What are the required academic performance, the overall GPA, and required ETCs in any field to apply this program?"
    logger.info(f"Query: {query_academic_perf}")
    requiredAcademicPerf_result, sources  = retreival_qa_chain_wrapper_with_chat_model(RequiredAcademicPerf, retriever, llm, query_academic_perf)
    df_requiredAcademicPerf = add_source_into_another_column(requiredAcademicPerf_result, sources)


    # 6. Get the URL links
    # no need for the source
    logger.info("Retrieving (6) URL info.........")
    query_urls = formatted_prefix_prompt + "Can you provide me the application protal, website, and FPSO links and contact details for apply this program?"
    logger.info(f"Query: {query_urls}")
    urlLinks_result, sources = retreival_qa_chain_wrapper_with_chat_model(UrlLinks, retriever,  llm, query_urls)
    df_urlLinks = add_source_into_another_column(urlLinks_result, sources)


    # Need the keep the index
    df_result = pd.concat([df_programBaseInfo, df_applicationPeriod, df_requiredDocument, df_requiredLanguage, df_requiredAcademicPerf, df_urlLinks], axis=0).reset_index(drop=False)


    return df_result

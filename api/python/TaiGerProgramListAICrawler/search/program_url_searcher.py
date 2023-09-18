import sys
sys.path.append("..") # Adds higher directory to python module path

import requests
from bs4 import BeautifulSoup

from search.SearchTemplateManager import SearchTemplateManager

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


def get_google_search_links(query, number=3):

    USER_AGENT = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
              "(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
    HEADERS = {"User-Agent": USER_AGENT}


    google_url = f"https://www.google.com/search?q={query}"
    response = requests.get(google_url, headers=HEADERS)

    if response.status_code != 200:
        raise Exception(f"Failed to fetch results for query: {query}, status code {response.status_code}")

    soup = BeautifulSoup(response.text, "html.parser")
    search_results = []

    for g in soup.find_all('div', class_='tF2Cxc'):
        anchor = g.find('a')
        if anchor:
            link = anchor['href']
            search_results.append(link)

    return search_results[:number]



def get_program_links(university_name, program_name, degree, number=2):
    '''
    This wrapper funciton takes university, program, and degree, and output a Set of Url links to prepare for Web Scrapper

    This wrapper use the following functions under the hood 
    - SearchTemplateManager: to manage the search templates
    - get_duckduckgo_search_links: to get the all the search links from duckduck go
    '''
    
    # 0. Prepare url set
    url_set = set() #empty set

    # 1. format the search 
    formatted_searchs = SearchTemplateManager.format_all_templates(university_name=university_name, program_name=program_name, degree=degree)

    logger.info(f"Start Goolge Search: university: {university_name} | program: {program_name} | degree {degree}")

    # 2. Get the link
    for search in formatted_searchs:
        links = get_google_search_links(search, number) # only get 3 search result, since duckduck go search is not that good
        logger.info(f"search: {search}")
        logger.info(f"links: {links}")
        url_set.update(links) # put them into a set container
    logger.info(f"Total {len(url_set)} links")
    logger.info("Goolge Search COMPLETED")

    return url_set

if __name__ == "__main__":
    university_name = "Mannheim"
    program_name = "Master in Management"
    degree = "Master degree"
    get_program_links(university_name, program_name, degree)
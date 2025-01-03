# langchain_web

## Introduction

## Pre-request

- python v3.10

## Key Component

One-time set up

```
# virtual environment
python3 -m venv venv # create a virtual env
source venv/bin/activate # activate the virtual env◊
pip install -r requirement.txt # install all the dependencies

```

```
# open api key
vim .env
OPENAI_API_KEY = # add your api key

```

run

```
streamlit run program_info_agent_streamlit.py

```

## Developer note

[Link](https://docs.google.com/document/d/1T8Ut2YTduWFS_5UPkzIjIsZWBgsMpLpUHpn9_oQBDBs/edit)

## Parameter tunning

### Program Info

Search phase

- Google search query
- Google search request top link number

Embedding phase

- Langchain webLoader
- Langchain text split and overlap
- Embedding model

Retrieval phase

- Similarity search return number
- Retrieval model
- Retrieval system prompt
- Retrieval query

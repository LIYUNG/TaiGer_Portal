from dataclasses import dataclass
from typing import Literal
import streamlit as st
from langchain import OpenAI
from langchain import ConversationChain
from langchain.chains.conversation.memory import ConversationSummaryMemory
from langchain.callbacks import get_openai_callback # to get tokens
 

@dataclass
class Message:
    """Class for keeping track of a chat message."""
    origin: Literal["human", "ai"]
    message: str

def initialize_session_state():
    '''
    Session state is the place to store temporary information
    '''
    if "history" not in st.session_state:
        st.session_state.history = []

    if "token_count" not in st.session_state:
        st.session_state.token_count = 0
    
    if "conversation" not in st.session_state:
        # get LLM
        llm = OpenAI(
            temperature=0,
            openai_api_key=st.secrets["openai_api_key"], # deleted
            model_name="gpt-3.5-turbo-0613",
        )

        st.session_state.conversation = ConversationChain(
            llm = llm,
            memory=ConversationSummaryMemory(llm=llm) # TODO: here can test with different memory
        )


def on_click_callback():
    with get_openai_callback() as cb: # use the openai call back to count tokens
        # this is what human type
        human_prompt = st.session_state.human_prompt

        # this is why LLM response
        llm_response = st.session_state.conversation.run(
            human_prompt
        )

        # append inforamtion into history
        st.session_state.history.append(Message("human", human_prompt))
        st.session_state.history.append(Message("ai", llm_response))

        # save the tokens
        st.session_state.token_count += cb.total_tokens # count the used tokens
                                    
                                    

initialize_session_state()



st.title("Chat with Program Info")

chat_placeholder = st.container()

# This is to display the chat message
with chat_placeholder:
    for chat in st.session_state.history:
        st.markdown(f"From {chat.origin}: {chat.message}")


# Need to think about how to use this chat, for now, let's type a university name, then
# dockdock go will search all the required information
prompt_placeholder = st.form('name-of-university')

with prompt_placeholder:
    #for chat in st.session_state.history:
    #    st.markdown(chat)

    st.markdown("**Chat**")
    cols = st.columns((6, 1))
    cols[0].text_input(
        "Chat",
        value = "university-program name     or    webpage URL",
        label_visibility="collapsed",
        key='human_prompt', # this is how key-value pair in the streamlit
    )
    cols[1].form_submit_button(
        "Search",
        type="primary",
        on_click=on_click_callback,
    )


# count the token
token_placeholder = st.empty()
token_placeholder.caption(f"""
   Used {st.session_state.token_count} tokens           
""")
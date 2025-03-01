import streamlit as st
from program_info import get_program_info # the meat
import pandas as pd
 

def initialize_session_state():
    '''
    Session state is the place to store temporary information
    '''
    if "university_name" not in st.session_state:
        st.session_state.university_name = []

    if "program_name" not in st.session_state:
        st.session_state.program_name = []
    
    if "degree" not in st.session_state:
        st.session_state.degree = []

    if "df_result" not in st.session_state:
        st.session_state.df_result = pd.DataFrame()

def search_callback():
 
    university_name = st.session_state.university_name_input
    program_name = st.session_state.program_name_input
    degree = st.session_state.degree_input
 
    df_result = get_program_info(university_name, program_name, degree)
    
    # write the result back to session
    st.session_state.df_result = df_result

 

initialize_session_state()


st.title("Program Information AI")


# Create a form w/ for user inputs:
with st.form(key='input_form'):

    # text input
    university_name = st.text_input("Enter the name of university:", key='university_name_input')
    program_name = st.text_input("Enter the name of program", key='program_name_input')

    # option input
    degree_options = ["Master degree", "Bachelor degree"]
    degree = st.selectbox("Which degree", degree_options, key='degree_input')

    # add a submit button for the form
    submit_button = st.form_submit_button(label='Search', type="primary",  on_click=search_callback)


#
chat_placeholder = st.container()

# Processing after submitting the form
# This is to display the chat message
with chat_placeholder:
    if not st.session_state.df_result.empty:
        st.dataframe(st.session_state.df_result) # print a transpose result
    

import os
import json
from bs4 import BeautifulSoup
from db_connection import get_db_connection

current_dir = os.path.dirname(os.path.abspath(__file__))
output_path = os.path.join(current_dir, 'output')

def create_output_directory(output_path=output_path):
    if not os.path.exists(output_path):
        os.makedirs(output_path)
        print(f"Directory '{output_path}' created successfully.")
    else:
        print(f"Directory '{output_path}' already exists.")

def get_chat_by_students():
    db = get_db_connection()
    chat_histories = db['communications'].aggregate([
        {
            '$group': {
                '_id': '$student_id', 
                'data': {
                    '$push': {
                        'user_id': '$user_id', 
                        'message': '$message', 
                        'createdAt': '$createdAt'
                    }
                }
            }
        }, {
            '$project': {
                '_id': 0, 
                'student_id': '$_id', 
                'data': 1
            }
        }
    ])
    return chat_histories

def block2HTML(block):
        match block["type"]:
            case "header":
                return f"<h{block['data']['level']}>" + block["data"]["text"] + f"</h{block['data']['level']}>"
            case "embded":  
                return f"<div><iframe src=\"{block['data']['embed']}\" frameborder=\"0\" allow=\"autoplay; encrypted-media\" allowfullscreen></iframe></div>"
            case "paragraph":
                return f"<p>{block['data']['text']}</p>"
            case "delimiter":
                return "<hr />"
            case "image":
                return f"<img class=\"img-fluid\" src=\"{block['data']['file']['url']}\" title=\"{block['data']['caption']}\" /><br /><em>{block['data']['caption']}</em>"
            case "list":
                converted_html = "<ul>"
                for li in block["data"]["items"]:
                    converted_html += f"<li>{li}</li>"
                converted_html += "</ul>"
                return converted_html
            case "table":
                converted_html = "<table>"
                for row in block['data']['content']:
                    converted_html += "<tr>"
                    for cell in row:
                        converted_html += f"<td>{cell}</td>"
                    converted_html += "</tr>"
                converted_html += "</table>"
                return converted_html
            case _:
                print(f"Unknown block type: {block['type']}")
                return ""
        

def extract_text_from_message(message):
    msg_obj = json.loads(message["message"])
    message_blocks = msg_obj["blocks"]
    raw_html = ""
    for block in message_blocks:
        raw_html += block2HTML(block)
    soup = BeautifulSoup(raw_html, 'html.parser')
    raw_text = soup.get_text()
    return raw_text.replace("\n", " ")

def export_student_messages():
    create_output_directory()
    chat_histories = get_chat_by_students()
    for chat_history in chat_histories:
        messages = chat_history['data']
        with open(os.path.join(output_path, f"{chat_history['student_id']}.txt"), "a", encoding="utf-8") as file:
            for message in messages:
                user_type = "Student" if message["user_id"] == chat_history['student_id'] else "TaiGer"
                file.write(f'[{message["createdAt"]}] {message["user_id"]} ({user_type}): {extract_text_from_message(message)}\n')
                # output format -> [time] user: context
        # return


export_student_messages()
import os
import json
from db_connection import get_db_connection

current_dir = os.path.dirname(os.path.abspath(__file__))
output_path = os.path.join(current_dir, 'output')

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

def extract_text_from_message(message):
    msg_obj = json.loads(message["message"])
    message_blocks = msg_obj["blocks"]
    return message_blocks

def export_student_messages():
    chat_histories = get_chat_by_students()
    for chat_history in chat_histories:
        messages = chat_history['data']
        with open(os.path.join(output_path, f"{chat_history['student_id']}.txt"), "a", encoding="utf-8") as file:
            for message in messages:
                file.write(f'[{message["createdAt"]}] {message["user_id"]}: {extract_text_from_message(message)}\n')
                # output format -> [time] user: context

export_student_messages()
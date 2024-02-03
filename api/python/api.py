from typing import Union
from fastapi import FastAPI
from pydantic import BaseModel


# temp workaround for relative path in packages
import sys, os
python_path = os.path.dirname(os.path.abspath(__file__))
analyzer_path = os.path.join(python_path, "TaiGerTranscriptAnalyzerJS")
print(analyzer_path)
sys.path.append(analyzer_path)
import TaiGerTranscriptAnalyzerJS.main as TranscriptAnalyzer


app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "online"}

@app.get("/test")
def read_test():
    return {"status": "testing"}

class TranscriptInfo(BaseModel):
    courses: str
    category: str
    student_id: str
    student_name: str
    language: str
    courses_taiger_guided: str

@app.post('/analyze-transcript')
def analyze_transcript(info: TranscriptInfo):
    return TranscriptAnalyzer.analyze_transcript(info.courses, info.category, info.student_id, info.student_name, info.language, info.courses_taiger_guided)
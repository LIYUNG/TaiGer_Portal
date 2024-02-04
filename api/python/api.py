import uvicorn
from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# temp workaround for relative path in packages
import sys, os
python_path = os.path.dirname(os.path.abspath(__file__))
analyzer_path = os.path.join(python_path, "TaiGerTranscriptAnalyzerJS")
print(analyzer_path)
sys.path.append(analyzer_path)

from TaiGerTranscriptAnalyzerJS.main import analyze_transcript

# TODO: extra check if valid value
for name in ["AWS_S3_BUCKET_NAME", "AWS_S3_ACCESS_KEY_ID", "AWS_S3_ACCESS_KEY"]:
    env_val = os.environ.get(name)
    if env_val is None: 
        raise Exception("env {} is missing".format(name))

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
def create_transcript_analysis(info: TranscriptInfo):
    try:
        analyze_transcript(info.courses, info.category, info.student_id, info.student_name, info.language, info.courses_taiger_guided)
    except SystemExit as e: # TODO: improve error handling (replace sys.exit() with raise error)
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"response": {"status": "SystemExit", "error": str(e)}})
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"response": {"status": "error", "error": str(e)}})
    return {"response": {"status": "success"}}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
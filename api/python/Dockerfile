FROM python:3.9
WORKDIR /app

# FastAPI requirement
COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

# Transcript Analyzer requirement
COPY ./TaiGerTranscriptAnalyzerJS/requirements.txt /app/TA-requirements.txt
RUN pip install --no-cache-dir --upgrade -r /app/TA-requirements.txt

# Copy Transcript Analyzer code
COPY ./TaiGerTranscriptAnalyzerJS /app/TaiGerTranscriptAnalyzerJS

COPY ./api.py /app/api.py
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py ./
COPY html/ ./html/
ENV FLASK_APP=app.py
EXPOSE 5001
CMD ["python", "-m", "flask", "run", "--host=0.0.0.0", "--port=5001"]

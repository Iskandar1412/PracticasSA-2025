FROM python:3.11-slim

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "main.py"]

# docker build -t cronjob:v1 .
# docker tag cronjob:v1 iskandar1412/pruebas-sa:cronjob
# docker push iskandar1412/pruebas-sa:cronjob
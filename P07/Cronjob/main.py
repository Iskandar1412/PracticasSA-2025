from datetime import datetime
import pytz  # pip install pytz
import mysql.connector
import os

db_config = {
    'host': os.environ.get('DB_HOST_MS_ALBUMES'),
    'user': os.environ.get('DATABASE_MYSQL_USER'),
    'password': os.environ.get('DATABASE_MYSQL_PASSWORD'),
    'database': os.environ.get('DB_MS_ALBUMES')
}

carnet = 201906051

guatemala_tz = pytz.timezone("America/Guatemala")
fecha = datetime.now(pytz.timezone("America/Guatemala")).strftime('%Y-%m-%d %H:%M:%S')

try:
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    sql = "INSERT INTO noticias(carnet, fecha) VALUES (%s, %s)"
    valores = (carnet, fecha)

    cursor.execute(sql, valores)
    conn.commit()

    print(f"✅ Registro creado exitosamente: {carnet} - {fecha}")
except mysql.connector.Error as err:
    print(f"❌ Error en la conexión o inserción: {err}")
finally:
    if 'conn' in locals() and conn.is_connected():
        cursor.close()
        conn.close()

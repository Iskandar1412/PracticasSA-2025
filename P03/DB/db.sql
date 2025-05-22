CREATE DATABASE IF NOT EXISTS SAPR03;
USE SAPR03;

-- DB Usuarios
CREATE TABLE roles(
	id INT AUTO_INCREMENT PRIMARY KEY,
	rol_usuario VARCHAR(100) NOT NULL
);

CREATE TABLE usuarios(
	id INT AUTO_INCREMENT PRIMARY KEY,
	codigo_usuario VARCHAR(12) NOT NULL UNIQUE,
    nombres VARCHAR(50) NOT NULL,
    apellidos VARCHAR(50) NOT NULL,
    edad INT NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    contrasenia VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- DB Planillas
CREATE TABLE planillas(
	id INT AUTO_INCREMENT PRIMARY KEY,
	codigo_planilla VARCHAR(20) NOT NULL UNIQUE,
	nombre VARCHAR(255) NOT NULL UNIQUE,
	estado_planilla INT NOT NULL,
	planilla LONGBLOB,
	fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_aprobacion_rechazo TIMESTAMP
);

CREATE TABLE historial_aprobaciones(
	id INT AUTO_INCREMENT PRIMARY KEY,
	cod_planilla VARCHAR(20) NOT NULL,
	FOREIGN KEY (cod_planilla) REFERENCES planillas(codigo_planilla)
);

-- DB Archivos
CREATE TABLE archivos(
	id INT AUTO_INCREMENT PRIMARY KEY,
	codigo_archivo VARCHAR(20) NOT NULL UNIQUE,
	nombre VARCHAR(255) NOT NULL UNIQUE,
	archivo LONGBLOB,
	fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DB Notificaciones
CREATE TABLE notificaciones(
	id INT AUTO_INCREMENT PRIMARY KEY,
	cod_notificacion VARCHAR(30) NOT NULL UNIQUE,
	codigo_planilla VARCHAR(20) NOT NULL,
	titulo_notificacion VARCHAR(40) NOT NULL,
	descripcion VARCHAR(1000) NOT NULL,
	fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DB Historial y Auditoria
CREATE TABLE logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    servicio VARCHAR(255) NOT NULL,
    evento TEXT NOT NULL,
    usuario VARCHAR(255),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DB Generación Reportes
CREATE TABLE reportes_generados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_reporte VARCHAR(100) NOT NULL,
    parametros VARCHAR(500) NOT NULL,
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cod_usuario VARCHAR(20) NOT NULL
);

-- DB Integración con Bancos
CREATE TABLE pagos_bancarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_planilla VARCHAR(20) NOT NULL,
    banco VARCHAR(50) NOT NULL,
    estado_transaccion ENUM('pendiente', 'completado', 'fallido') NOT NULL,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    monto DECIMAL(10,2) NOT NULL
);

-- DB Control Versiones
CREATE TABLE versiones_planillas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_planilla INT NOT NULL,
    id_planilla_anterior INT,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    codigo_usuario VARCHAR(20) NOT NULL,
    cambios VARCHAR(1000)
);
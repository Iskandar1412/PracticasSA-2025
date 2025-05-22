CREATE PROCEDURE registrar_administrador (
    IN p_nombres VARCHAR(50),
    IN p_apellidos VARCHAR(50),
    IN p_edad INT,
    IN p_usuario VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_contrasenia VARCHAR(255)
)
BEGIN
	DECLARE v_rol_id INT;
	IF EXISTS(SELECT 1 FROM roles WHERE rol = "admin") THEN
		SELECT id INTO v_rol_id 
		FROM roles WHERE rol = "admin";
	ELSE
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El rol no existe';
	END IF;
    -- Verificar si el correo ya existe
    IF EXISTS(SELECT 1 FROM usuarios WHERE email = p_email) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El correo ya existe';
    -- Verificar si el usuario ya existe
    ELSEIF EXISTS(SELECT 1 FROM usuarios WHERE usuario = p_usuario) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El usuario ya existe';
    ELSE
        INSERT INTO usuarios(nombres, apellidos, edad, usuario, email, contrasenia, rol_id)
        VALUES(p_nombres, p_apellidos, p_edad, p_usuario, p_email, p_contrasenia, v_rol_id);
        SELECT 'Registro exitoso' AS mensaje;
    END IF;
END;
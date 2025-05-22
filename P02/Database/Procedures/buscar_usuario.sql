CREATE PROCEDURE buscar_usuario (
    IN p_cedenciales VARCHAR(100)
)
BEGIN
	DECLARE v_id VARCHAR(100);
	DECLARE v_nombres VARCHAR(50);
	DECLARE v_apellidos VARCHAR(50);
	DECLARE v_edad INT;
	DECLARE v_usuario VARCHAR(50);
	DECLARE v_email VARCHAR(100);
	DECLARE v_contrasenia VARCHAR(255);
	DECLARE v_rol_id INT;
 	DECLARE v_rol VARCHAR(30);
	DECLARE v_notfound INT DEFAULT 0;

	DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_notfound = 1;
	
	SELECT usuarios.id, usuarios.nombres, usuarios.apellidos, usuarios.edad, usuarios.usuario, usuarios.email, usuarios.contrasenia, usuarios.rol_id, roles.rol AS rol_asignado 
	INTO v_id, v_nombres, v_apellidos, v_edad, v_usuario, v_email, v_contrasenia, v_rol_id, v_rol
	FROM usuarios
	JOIN roles ON usuarios.rol_id = roles.id
	WHERE (usuarios.email = p_cedenciales OR usuarios.usuario = p_cedenciales)
	LIMIT 1;
	
	IF v_notfound = 1 THEN 
		-- SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Usuario no enctontrado en la base de datos";
		SELECT NULL AS id,
               NULL AS nombres,
               NULL AS apellidos,
               NULL AS edad,
               NULL AS usuario, 
               NULL AS email, 
               NULL AS pass,
               NULL AS rol;
	ELSE
		SELECT v_id AS id,
				v_nombres AS nombres,
				v_apellidos AS apellidos,
				v_edad AS edad,
				v_usuario AS usuario, 
				v_email AS email, 
				v_contrasenia AS pass,
				v_rol AS rol;
	END IF;
END;
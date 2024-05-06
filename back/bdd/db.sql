CREATE OR REPLACE TABLE configuracion (
	CONF_Idx INT PRIMARY KEY AUTO_INCREMENT,
	CONF_Nombre VARCHAR(50),
	CONF_Data JSON,
	CONF_Upd_When DATETIME

)

CREATE OR REPLACE TABLE usuario (
	User_Idx INT PRIMARY KEY AUTO_INCREMENT,
	User_Email VARCHAR(50) UNIQUE,
	User_Password MEDIUMTEXT,
	User_Rol INT
);

CREATE OR REPLACE TABLE dataset (
	DS_Idx INT PRIMARY KEY AUTO_INCREMENT,
	DS_CONF_Idx INT,
	DS_Ruta VARCHAR(255),
	DS_Ruta_Dic VARCHAR(255),
	DS_Upd_When DATETIME
);
CREATE TABLE clientes (
    idCliente SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    edad INT NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO clientes (nombre, edad, telefono)
VALUES('Juan', 34, '1234567890');
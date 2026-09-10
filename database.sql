-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS graphql_db_taller04
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE graphql_db_taller04;

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo
INSERT INTO users (name, email) VALUES
('Ana Torres', 'ana@example.com'),
('Carlos Parra', 'carlos@example.com');

-- Verificar datos
SELECT id, name, email FROM users;
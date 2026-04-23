-- Script de Migración para Railway
-- Ejecuta este script en el Query Editor o consola MySQL de Railway

CREATE DATABASE IF NOT EXISTS tareas_db;
USE tareas_db;

-- Tabla Administradores
CREATE TABLE IF NOT EXISTS administradores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Tabla Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    avatar VARCHAR(255)
);

-- Tabla Tareas
CREATE TABLE IF NOT EXISTS tareas (
    id VARCHAR(50) PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    resumen TEXT,
    expira DATE,
    idusuario VARCHAR(50),
    completada TINYINT(1) DEFAULT 0,
    FOREIGN KEY (idusuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Los datos de 'admin' se crearán automáticamente al iniciar el servidor backend por primera vez.

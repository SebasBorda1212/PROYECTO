require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();

const corsOptions = {
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:4200', 
        'http://localhost:4200',
        'https://proyecto-lemon-three.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());

// Configuración compatible con TiDB Cloud (Soporte para CA Física)
// Configuración compatible con TiDB Cloud (Soporte para CA Física)
const dbConfig = {
    host: process.env.MYSQLHOST || process.env.DB_HOST,
    user: process.env.MYSQLUSER || process.env.DB_USER,
    password: process.env.MYSQLPASSWORD || process.env.DB_PASS,
    port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '4000'),
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'test',
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: false
    },
    // Añadimos estos para mayor estabilidad en nubes
    connectTimeout: 10000,
    enableKeepAlive: true
};

// Crear el Pool
const pool = mysql.createPool(dbConfig);

function setupTables() {
    console.log('🔍 [Auto-healing] Verificando esquema de base de datos...');
    
    const dbName = process.env.MYSQLDATABASE || process.env.DB_NAME || 'tareas_db';

    const queries = [
        `CREATE DATABASE IF NOT EXISTS ${dbName}`,
        `USE ${dbName}`,
        `CREATE TABLE IF NOT EXISTS administradores (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        )`,
        `CREATE TABLE IF NOT EXISTS usuarios (
            id VARCHAR(50) PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            avatar VARCHAR(255)
        )`,
        `CREATE TABLE IF NOT EXISTS tareas (
            id VARCHAR(50) PRIMARY KEY,
            titulo VARCHAR(255) NOT NULL,
            resumen TEXT,
            expira DATE,
            idusuario VARCHAR(50),
            completada TINYINT(1) DEFAULT 0,
            FOREIGN KEY (idusuario) REFERENCES usuarios(id) ON DELETE CASCADE
        )`
    ];

    let current = 0;
    const runNextQuery = () => {
        if (current < queries.length) {
            pool.query(queries[current], (err) => {
                if (err) {
                    console.error(`❌ Error en query ${current + 1}:`, err.message);
                } else {
                    console.log(`✅ Tabla ${current + 1}/${queries.length} verificada.`);
                }
                current++;
                runNextQuery();
            });
        } else {
            console.log('📊 [Auto-healing] Esquema completado.');
            seedAdmin();
        }
    };

    runNextQuery();
}

function seedAdmin() {
    pool.query('SELECT COUNT(*) as count FROM administradores', async (err, results) => {
        if (err) return console.error('❌ Error en seeding:', err.message);
        
        if (results[0].count === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            pool.query('INSERT INTO administradores (username, password) VALUES (?, ?)', ['admin', hashedPassword], (err) => {
                if (err) return console.error('❌ Error creando admin default:', err.message);
                console.log('✨ Seed: Usuario "admin" con clave "admin123" creado.');
            });
        } else {
            console.log('ℹ️ Seeding: El usuario administrador ya existe.');
        }
    });
}

setupTables();

// Middleware JWT
const verificarToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (!bearerHeader) return res.status(403).json({ mensaje: 'No hay token provisto' });
    
    const token = bearerHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET || 'secreto', (err, decoded) => {
        if (err) return res.status(401).json({ mensaje: 'Token inválido' });
        req.adminId = decoded.id;
        next();
    });
};

// Middleware para verificar salud de la DB
const checkDB = (req, res, next) => {
    if (!pool) return res.status(503).json({ mensaje: 'Base de datos no inicializada.' });
    next();
};

// Endpoint Login
app.post('/login', checkDB, (req, res) => {
    const { username, password } = req.body;
    console.log(`🔐 Intento de login para usuario: ${username}`);

    const queryTimeout = setTimeout(() => {
        console.error('--- ⚠️ LOGIN TIMEOUT: La base de datos no respondió a tiempo. ---');
        if (!res.headersSent) {
            res.status(504).json({ mensaje: 'Tiempo de espera agotado. Revisa tu conexión a la DB.' });
        }
    }, 5000);

    const sql = 'SELECT * FROM administradores WHERE username = ?';
    pool.query(sql, [username], async (err, results) => {
        clearTimeout(queryTimeout);
        
        if (err) {
            console.error('❌ Error en consulta de login:', err.message);
            return res.status(500).json({ mensaje: 'Error interno en la base de datos' });
        }

        console.log(`🔍 Resultados encontrados: ${results.length}`);

        if (results.length === 0) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        const admin = results[0];
        const match = await bcrypt.compare(password, admin.password);
        
        if (!match) {
            console.log('❌ Contraseña incorrecta');
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        console.log('✅ Login exitoso');
        const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET || 'secreto', { expiresIn: '8h' });
        res.json({ token, username: admin.username });
    });
});

// GET: Tareas (Público)
app.get('/tareas/:idusuario', checkDB, (req, res) => {
    const { idusuario } = req.params;
    pool.query('SELECT * FROM tareas WHERE idusuario = ?', [idusuario], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// PATCH: Actualizar estado de completado (Protegido)
app.patch('/tareas/:id', checkDB, verificarToken, (req, res) => {
    const { completada } = req.body;
    // Si completada es undefined (viejo comportamiento), usamos 1. Si viene en el body, usamos su valor (0 o 1).
    const nuevoEstado = completada === undefined ? 1 : (completada ? 1 : 0);
    
    pool.query('UPDATE tareas SET completada = ? WHERE id = ?', [nuevoEstado, req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ mensaje: 'Estado de tarea actualizado', estado: nuevoEstado });
    });
});

// DELETE: Borrar (Protegido)
app.delete('/tareas/:id', checkDB, verificarToken, (req, res) => {
    pool.query('DELETE FROM tareas WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ mensaje: 'Borrado físico' });
    });
});
// ==========================================
// RUTAS DE USUARIOS
// ==========================================

// GET: Todos los usuarios (Público)
app.get('/usuarios', checkDB, (req, res) => {
    pool.query('SELECT * FROM usuarios', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// POST: Crear usuario (Protegido)
app.post('/usuarios', checkDB, verificarToken, (req, res) => {
    const { id, nombre, avatar } = req.body;
    const sql = 'INSERT INTO usuarios (id, nombre, avatar) VALUES (?, ?, ?)';
    pool.query(sql, [id, nombre, avatar], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ mensaje: 'Usuario guardado' });
    });
});

// PUT: Editar usuario (Protegido)
app.put('/usuarios/:id', checkDB, verificarToken, (req, res) => {
    const { nombre, avatar } = req.body;
    const sql = 'UPDATE usuarios SET nombre = ?, avatar = ? WHERE id = ?';
    pool.query(sql, [nombre, avatar, req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ mensaje: 'Usuario actualizado' });
    });
});

// DELETE: Borrar usuario (Protegido - Borrará tareas en cascada)
app.delete('/usuarios/:id', checkDB, verificarToken, (req, res) => {
    pool.query('DELETE FROM usuarios WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ mensaje: 'Usuario borrado' });
    });
});

// ==========================================
// RUTAS DE GESTIÓN DE ADMINISTRADORES
// ==========================================

// GET: Listar todos los administradores (Protegido)
app.get('/admins', checkDB, verificarToken, (req, res) => {
    pool.query('SELECT id, username FROM administradores', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// POST: Crear nuevo administrador (Protegido)
app.post('/admins', checkDB, verificarToken, async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO administradores (username, password) VALUES (?, ?)';
        pool.query(sql, [username, hashedPassword], (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ mensaje: 'El nombre de usuario ya existe' });
                return res.status(500).json(err);
            }
            res.json({ mensaje: 'Nuevo administrador creado' });
        });
    } catch (e) {
        res.status(500).json({ mensaje: 'Error al procesar contraseña' });
    }
});

// DELETE: Eliminar administrador (Protegido)
app.delete('/admins/:id', checkDB, verificarToken, (req, res) => {
    // Evitar que un admin se borre a sí mismo si solo hay uno (opcional, pero recomendado)
    pool.query('DELETE FROM administradores WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ mensaje: 'Administrador eliminado' });
    });
});

// ==========================================
// RUTAS DE TAREAS
// ==========================================

// POST: Crear tarea (Protegido)
app.post('/tareas', checkDB, verificarToken, (req, res) => {
    const { id, titulo, resumen, expira, idusuario } = req.body;
    const sql = 'INSERT INTO tareas (id, titulo, resumen, expira, idusuario, completada) VALUES (?, ?, ?, ?, ?, 0)';
    pool.query(sql, [id, titulo, resumen, expira, idusuario], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ mensaje: 'Tarea guardada' });
    });
});

// PUT: Editar tarea existente (Protegido)
app.put('/tareas/:id', checkDB, verificarToken, (req, res) => {
    const { titulo, resumen, expira } = req.body;
    const sql = 'UPDATE tareas SET titulo = ?, resumen = ?, expira = ? WHERE id = ?';
    pool.query(sql, [titulo, resumen, expira, req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ mensaje: 'Tarea actualizada' });
    });
});

// POST: Registrar nuevo administrador (Protegido)
app.post('/administradores', checkDB, verificarToken, async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ mensaje: 'Faltan datos' });
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        pool.query('INSERT INTO administradores (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ mensaje: 'El usuario ya existe' });
                return res.status(500).json(err);
            }
            res.json({ mensaje: 'Administrador creado con éxito' });
        });
    } catch (e) {
        res.status(500).json({ mensaje: 'Error al procesar contraseña' });
    }
});

// PATCH: Editar perfil propio (Protegido)
app.patch('/administradores/perfil', checkDB, verificarToken, async (req, res) => {
    const { username, password } = req.body;
    if (!username && !password) return res.status(400).json({ mensaje: 'Nada que actualizar' });

    let sql = 'UPDATE administradores SET ';
    const params = [];
    
    if (username) {
        sql += 'username = ?';
        params.push(username);
    }
    
    if (password) {
        if (username) sql += ', ';
        const hashedPassword = await bcrypt.hash(password, 10);
        sql += 'password = ?';
        params.push(hashedPassword);
    }
    
    sql += ' WHERE id = ?';
    params.push(req.adminId);

    pool.query(sql, params, (err) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ mensaje: 'El nombre de usuario ya está en uso' });
            return res.status(500).json(err);
        }
        res.json({ mensaje: 'Perfil actualizado con éxito' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
    console.log('---------------------------------------------------------');
});

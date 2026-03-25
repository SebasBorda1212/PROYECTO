// ==============================
// IMPORTACIONES
// ==============================
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

// ==============================
// CONFIGURACIÓN APP
// ==============================
const app = express();

app.use(cors());
app.use(express.json()); // permite recibir JSON

// ==============================
// CONEXIÓN MYSQL
// ==============================
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234', // Aquí va tu contraseña
    database: 'tareas_db',
});

// CONECTAR
db.connect((err) => {
    if (err) {
        console.error('❌ Error conexión MySQL:', err);
        return;
    }
    console.log('✅ Conectado a MySQL');
});

// ==============================
// GET -> OBTENER TODAS LAS TAREAS
// ==============================
app.get('/tareas', (req, res) => {
    const sql = 'SELECT * FROM tareas';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('❌ Error GET:', err);
            return res.status(500).json(err);
        }
        res.json(results);
    });
});

// ==============================
// POST -> CREAR TAREA
// ==============================
app.post('/tareas', (req, res) => {
    const { id, titulo, resumen, expira, idusuario } = req.body;
    console.log('📥 Datos recibidos:', req.body);

    const sql = `
        INSERT INTO tareas (id, titulo, resumen, expira, idusuario, completada)
        VALUES (?, ?, ?, ?, ?, 0)
    `;

    db.query(sql, [id, titulo, resumen, expira, idusuario], (err) => {
        if (err) {
            console.error('❌ Error INSERT:', err);
            return res.status(500).json(err);
        }
        res.json({ mensaje: 'Tarea creada correctamente' });
    });
});

// ==============================
// PUT -> COMPLETAR TAREA
// ==============================
app.put('/tareas/:id', (req, res) => {
    const { id } = req.params;
    console.log('🔄 Completar ID:', id);

    const sql = 'UPDATE tareas SET completada = 1 WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('❌ Error UPDATE:', err);
            return res.status(500).json(err);
        }
        console.log('✅ Filas afectadas:', result.affectedRows);
        res.json({ mensaje: 'Tarea completada' });
    });
});

// ==============================
// DELETE -> ELIMINAR TAREA
// ==============================
app.delete('/tareas/:id', (req, res) => {
    const { id } = req.params;
    console.log('🗑️ Eliminar ID:', id);

    const sql = 'DELETE FROM tareas WHERE id = ?';

    db.query(sql, [id], (err) => {
        if (err) {
            console.error('❌ Error DELETE:', err);
            return res.status(500).json(err);
        }
        res.json({ mensaje: 'Tarea eliminada' });
    });
});

// ==============================
// SERVIDOR
// ==============================
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});

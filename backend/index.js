const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // <--- TU CONTRASEÑA DE WORKBENCH
    database: 'tareas_db',
});

// GET: Trae TODAS las tareas (completadas y pendientes)
app.get('/tareas/:idusuario', (req, res) => {
    const { idusuario } = req.params;
    const sql = 'SELECT * FROM tareas WHERE idusuario = ?';
    db.query(sql, [idusuario], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// PATCH: Pone un 1 en la columna 'completada' en Workbench
app.patch('/tareas/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'UPDATE tareas SET completada = 1 WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ mensaje: 'Estado actualizado en DB' });
    });
});

// DELETE: Borra la fila definitivamente de MySQL
app.delete('/tareas/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM tareas WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ mensaje: 'Borrado físico' });
    });
});

// POST: Crear tarea nueva
app.post('/tareas', (req, res) => {
    const { id, titulo, resumen, expira, idusuario } = req.body;
    const sql = 'INSERT INTO tareas (id, titulo, resumen, expira, idusuario, completada) VALUES (?, ?, ?, ?, ?, 0)';
    db.query(sql, [id, titulo, resumen, expira, idusuario], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ mensaje: 'Tarea guardada' });
    });
});

app.listen(3000, () => console.log('Servidor en puerto 3000'));

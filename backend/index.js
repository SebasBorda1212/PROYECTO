const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // <--- ASEGÚRATE QUE ESTA SEA TU CONTRASEÑA DE WORKBENCH
    database: 'tareas_db',
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error conexión MySQL:', err);
        return;
    }
    console.log('✅ Conectado a MySQL');
});

// GET -> OBTENER TAREAS FILTRADAS POR USUARIO
app.get('/tareas/:idusuario', (req, res) => {
    const { idusuario } = req.params;
    const sql = 'SELECT * FROM tareas WHERE idusuario = ?';

    db.query(sql, [idusuario], (err, results) => {
        if (err) {
            console.error('❌ Error GET:', err);
            return res.status(500).json(err);
        }
        res.json(results);
    });
});

// POST -> CREAR TAREA
app.post('/tareas', (req, res) => {
    const { id, titulo, resumen, expira, idusuario } = req.body;
    const sql = `
        INSERT INTO tareas (id, titulo, resumen, expira, idusuario, completada)
        VALUES (?, ?, ?, ?, ?, 0)
    `;

    db.query(sql, [id, titulo, resumen, expira, idusuario], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ mensaje: 'Tarea creada correctamente' });
    });
});

// DELETE -> ELIMINAR TAREA
app.delete('/tareas/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM tareas WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ mensaje: 'Tarea eliminada' });
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});

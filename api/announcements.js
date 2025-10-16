const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Database connection dengan error handling
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Test connection
pool.on('error', (err) => {
    console.error('Database error:', err);
});

// GET semua pengumuman
router.get('/', async (req, res) => {
    try {
        console.log('Testing API...');
        
        // TEMPORARY: Return dummy data dulu
        res.json({
            success: true,
            data: [
                {
                    id: 1,
                    title: "Test Pengumuman",
                    content: "Ini test kalau API sudah work",
                    author: "System",
                    created_at: new Date().toISOString()
                }
            ]
        });
        
        /*
        // COMMENT DULU database code
        const result = await pool.query(
            'SELECT * FROM announcements ORDER BY created_at DESC'
        );
        
        res.json({
            success: true,
            data: result.rows
        });
        */
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error: ' + error.message
        });
    }
});

// POST pengumuman baru
router.post('/', async (req, res) => {
    try {
        const { title, content, author } = req.body;
        console.log('Adding announcement:', { title, content, author });
        
        // Validasi input
        if (!title || !content || !author) {
            return res.status(400).json({
                success: false,
                message: 'Judul, konten, dan penulis harus diisi'
            });
        }
        
        const result = await pool.query(
            'INSERT INTO announcements (title, content, author) VALUES ($1, $2, $3) RETURNING *',
            [title, content, author]
        );
        
        res.json({
            success: true,
            message: 'Pengumuman berhasil ditambahkan',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error adding announcement:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menambah pengumuman: ' + error.message
        });
    }
});

// DELETE pengumuman
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Deleting announcement ID:', id);
        
        const result = await pool.query(
            'DELETE FROM announcements WHERE id = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pengumuman tidak ditemukan'
            });
        }
        
        res.json({
            success: true,
            message: 'Pengumuman berhasil dihapus'
        });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus pengumuman: ' + error.message
        });
    }
});

module.exports = router;


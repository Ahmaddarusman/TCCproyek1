const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// GET semua pengumuman - PAKAI DATABASE
router.get('/', async (req, res) => {
    try {
        console.log('📢 Fetching announcements from database...');
        const result = await pool.query(
            'SELECT * FROM announcements ORDER BY created_at DESC'
        );
        
        console.log('✅ Data found:', result.rows.length, 'announcements');
        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('❌ Error fetching announcements:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data pengumuman: ' + error.message
        });
    }
});

// POST pengumuman baru - PAKAI DATABASE
router.post('/', async (req, res) => {
    try {
        const { title, content, author } = req.body;
        console.log('📝 Adding announcement:', { title, content, author });
        
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
        
        console.log('✅ Announcement added:', result.rows[0]);
        res.json({
            success: true,
            message: 'Pengumuman berhasil ditambahkan',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('❌ Error adding announcement:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menambah pengumuman: ' + error.message
        });
    }
});

// DELETE pengumuman - PAKAI DATABASE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('🗑️ Deleting announcement ID:', id);
        
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
        
        console.log('✅ Announcement deleted');
        res.json({
            success: true,
            message: 'Pengumuman berhasil dihapus'
        });
    } catch (error) {
        console.error('❌ Error deleting announcement:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus pengumuman: ' + error.message
        });
    }
});

module.exports = router;


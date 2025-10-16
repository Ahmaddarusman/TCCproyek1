const express = require('express');
const router = express.Router();
const pool = require('./db');

// GET semua pengumuman
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM announcements ORDER BY created_at DESC'
    );
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data pengumuman'
    });
  }
});

// POST pengumuman baru
router.post('/', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    
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
      message: 'Gagal menambah pengumuman'
    });
  }
});

// DELETE pengumuman
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
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
      message: 'Gagal menghapus pengumuman'
    });
  }
});

module.exports = router;
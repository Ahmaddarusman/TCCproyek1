const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Simpan data di memory (sementara)
let announcements = [
  {
    id: 1,
    title: "Selamat Datang!",
    content: "Ini adalah papan pengumuman pertama. Silakan tambah pengumuman Anda!",
    author: "Admin",
    created_at: new Date().toISOString()
  }
];

// GET semua pengumuman
router.get('/', async (req, res) => {
  try {
    console.log('✅ Mengambil pengumuman dari memory');
    res.json({
      success: true,
      data: announcements.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    });
  } catch (error) {
    console.error('Error:', error);
    res.json({
      success: false,
      message: 'Gagal mengambil data',
      data: []
    });
  }
});

// POST pengumuman baru
router.post('/', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    
    if (!title || !content || !author) {
      return res.json({
        success: false,
        message: 'Judul, konten, dan penulis harus diisi'
      });
    }
    
    const newAnnouncement = {
      id: Date.now(),
      title,
      content,
      author,
      created_at: new Date().toISOString()
    };
    
    announcements.push(newAnnouncement);
    console.log('✅ Pengumuman ditambah:', newAnnouncement);
    
    res.json({
      success: true,
      message: 'Pengumuman berhasil ditambahkan!',
      data: newAnnouncement
    });
  } catch (error) {
    console.error('Error:', error);
    res.json({
      success: false,
      message: 'Gagal menambah pengumuman'
    });
  }
});

// DELETE pengumuman
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = announcements.findIndex(ann => ann.id === id);
    
    if (index === -1) {
      return res.json({
        success: false,
        message: 'Pengumuman tidak ditemukan'
      });
    }
    
    announcements.splice(index, 1);
    console.log('✅ Pengumuman dihapus, ID:', id);
    
    res.json({
      success: true,
      message: 'Pengumuman berhasil dihapus!'
    });
  } catch (error) {
    console.error('Error:', error);
    res.json({
      success: false,
      message: 'Gagal menghapus pengumuman'
    });
  }
});

module.exports = router;

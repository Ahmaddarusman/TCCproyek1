const express = require('express');
const router = express.Router();

// GET semua pengumuman - SIMPLE VERSION
router.get('/', async (req, res) => {
  try {
    console.log('✅ API announcements dipanggil');
    
    // Return simple data dulu
    return res.json({
      success: true,
      data: [
        {
          id: 1,
          title: "API BERHASIL!",
          content: "Serverless function sudah tidak crash lagi",
          author: "System",
          created_at: new Date().toISOString()
        }
      ]
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    return res.json({
      success: false,
      message: 'Error: ' + error.message
    });
  }
});

// POST - simple version
router.post('/', async (req, res) => {
  try {
    console.log('✅ POST announcement');
    return res.json({
      success: true,
      message: "Pengumuman berhasil ditambahkan (test)",
      data: req.body
    });
  } catch (error) {
    console.error('❌ POST Error:', error);
    return res.json({
      success: false,
      message: 'POST Error: ' + error.message
    });
  }
});

// DELETE - simple version
router.delete('/:id', async (req, res) => {
  try {
    console.log('✅ DELETE announcement');
    return res.json({
      success: true,
      message: "Pengumuman berhasil dihapus (test)"
    });
  } catch (error) {
    console.error('❌ DELETE Error:', error);
    return res.json({
      success: false,
      message: 'DELETE Error: ' + error.message
    });
  }
});

module.exports = router;

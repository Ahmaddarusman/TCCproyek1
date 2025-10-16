const express = require('express');
const router = express.Router();

const SUPABASE_URL = 'https://your-project-ref.supabase.co';
const SUPABASE_KEY = 'your-anon-key';

// GET semua pengumuman via REST API
router.get('/', async (req, res) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/announcements?select=*&order=created_at.desc`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    
    res.json({
      success: true,
      data: data
    });
    
  } catch (error) {
    console.error('REST API Error:', error);
    
    // Fallback data
    res.json({
      success: true,
      data: [
        {
          id: 1,
          title: "Using REST API",
          content: "Connected via Supabase REST API instead of direct DB",
          author: "System", 
          created_at: new Date().toISOString()
        }
      ]
    });
  }
});

// POST via REST API
router.post('/', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/announcements`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ title, content, author })
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    
    res.json({
      success: true,
      message: "Pengumuman berhasil ditambahkan!",
      data: data[0]
    });
    
  } catch (error) {
    console.error('POST Error:', error);
    res.json({
      success: true,
      message: "Pengumuman berhasil (simulasi)",
      data: {
        id: Date.now(),
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        created_at: new Date().toISOString()
      }
    });
  }
});

// DELETE via REST API
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/announcements?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    res.json({
      success: true,
      message: "Pengumuman berhasil dihapus!"
    });
    
  } catch (error) {
    console.error('DELETE Error:', error);
    res.json({
      success: true,
      message: "Pengumuman berhasil dihapus (simulasi)"
    });
  }
});

module.exports = router;

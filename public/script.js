const API_URL = '/api/announcements';

// Elemen DOM
const form = document.getElementById('announcementForm');
const announcementList = document.getElementById('announcementList');

// Fungsi untuk fetch data dari API
async function fetchAnnouncements() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Error fetching announcements:', error);
        showError('Gagal memuat pengumuman: ' + error.message);
        return [];
    }
}

// Fungsi untuk menampilkan pengumuman
async function displayAnnouncements() {
    try {
        const announcements = await fetchAnnouncements();
        announcementList.innerHTML = '';
        
        if (announcements.length === 0) {
            announcementList.innerHTML = `
                <div style="text-align: center; color: #7f8c8d; padding: 40px;">
                    <p>📝 Belum ada pengumuman.</p>
                    <p>Silakan tambah pengumuman baru!</p>
                </div>
            `;
            return;
        }
        
        announcements.forEach(announcement => {
            const announcementElement = document.createElement('div');
            announcementElement.className = 'announcement-card';
            
            // Format tanggal
            const date = new Date(announcement.created_at);
            const formattedDate = date.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            announcementElement.innerHTML = `
                <div class="announcement-header">
                    <h3 class="announcement-title">${escapeHtml(announcement.title)}</h3>
                    <button class="delete-btn" onclick="deleteAnnouncement(${announcement.id})">
                        🗑️ Hapus
                    </button>
                </div>
                <div class="announcement-content">
                    ${escapeHtml(announcement.content).replace(/\n/g, '<br>')}
                </div>
                <div class="announcement-footer">
                    <span class="author">Oleh: ${escapeHtml(announcement.author)}</span>
                    <span class="date">${formattedDate}</span>
                </div>
            `;
            
            announcementList.appendChild(announcementElement);
        });
    } catch (error) {
        console.error('Error displaying announcements:', error);
    }
}

// Fungsi untuk menambah pengumuman
async function addAnnouncement(event) {
    event.preventDefault();
    
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const author = document.getElementById('author').value;
    
    // Validasi client-side
    if (!title || !content || !author) {
        showError('Harap isi semua field!');
        return;
    }
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content, author })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Reset form
            form.reset();
            // Refresh daftar
            await displayAnnouncements();
            showSuccess('Pengumuman berhasil ditambahkan!');
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Error adding announcement:', error);
        showError('Gagal menambah pengumuman: ' + error.message);
    }
}

// Fungsi untuk menghapus pengumuman
async function deleteAnnouncement(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            await displayAnnouncements();
            showSuccess('Pengumuman berhasil dihapus!');
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Error deleting announcement:', error);
        showError('Gagal menghapus pengumuman: ' + error.message);
    }
}

// Utility functions
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showError(message) {
    alert('❌ ' + message);
}

function showSuccess(message) {
    alert('✅ ' + message);
}

// Event listener
form.addEventListener('submit', addAnnouncement);

// Load announcements when page loads
document.addEventListener('DOMContentLoaded', displayAnnouncements);
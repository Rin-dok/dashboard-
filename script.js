const STORAGE_KEY = 'dashboard_shortcuts';

const DEFAULT_SHORTCUTS = [
    { id: 1, name: 'Google', url: 'https://google.com' },
    { id: 2, name: 'YouTube', url: 'https://youtube.com' },
    { id: 3, name: 'GitHub', url: 'https://github.com' },
    { id: 4, name: 'IFTIK UNIMUS', url: 'https://iftik.unimus.ac.id/login' },
    { id: 5, name: 'Discord Canary', url: 'https://canary.discord.com' },
    { id: 6, name: 'SIAMUS UNIMUS', url: 'https://siamus.unimus.ac.id/' },
    { id: 7, name: 'Whatsapp', url: 'https://web.whatsapp.com/'}
];

let shortcuts = [];
function loadShortcuts() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            shortcuts = JSON.parse(stored);
            shortcuts = shortcuts.map((s, index) => ({
                ...s,
                id: s.id || Date.now() + index,
            }));
        } catch {
            shortcuts = [...DEFAULT_SHORTCUTS];
        }
    } else {
        shortcuts = [...DEFAULT_SHORTCUTS];
    }
    saveShortcuts();
    render();
}

function saveShortcuts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shortcuts));
}

function addShortcut(name, url) {
    const newShortcut = {
        id: Date.now() + Math.random() * 1000,
        name: name.trim(),
        url: url.trim(),
    };
    shortcuts.push(newShortcut);
    saveShortcuts();
    render();
}

function deleteShortcut(id) {
    shortcuts = shortcuts.filter(s => s.id !== id);
    saveShortcuts();
    render();
}

function resetToDefault() {
    if (confirm('Reset semua shortcut ke default? Data saat ini akan hilang.')) {
        shortcuts = [...DEFAULT_SHORTCUTS];
        saveShortcuts();
        render();
    }
}

function render() {
    const grid = document.getElementById('shortcutGrid');
    grid.innerHTML = '';

    if (shortcuts.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.innerHTML = `
            <i class="fas fa-folder-open"></i>
            <p>Belum ada shortcut. Klik <strong>Tambah</strong> untuk menambahkan.</p>
        `;
        grid.appendChild(empty);
    } else {
        shortcuts.forEach(shortcut => {
            const card = document.createElement('div');
            card.className = 'shortcut-card';
            const iconHtml = getIconForUrl(shortcut.url);

            card.innerHTML = `
                <div class="shortcut-icon">${iconHtml}</div>
                <div class="shortcut-name">${escapeHtml(shortcut.name)}</div>
                <div class="shortcut-url">${escapeHtml(shortcut.url)}</div>
                <button class="delete-btn" data-id="${shortcut.id}" title="Hapus shortcut">
                    <i class="fas fa-times"></i>
                </button>
            `;
            card.addEventListener('click', (e) => {
                if (e.target.closest('.delete-btn')) return;
                window.open(shortcut.url, '_blank');
            });

            // Tombol hapus
            const deleteBtn = card.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(`Hapus shortcut "${shortcut.name}"?`)) {
                    deleteShortcut(shortcut.id);
                }
            });

            grid.appendChild(card);
        });
    }
    const addCard = document.createElement('div');
    addCard.className = 'shortcut-card add-card';
    addCard.innerHTML = `
        <div class="shortcut-icon"><i class="fas fa-plus"></i></div>
        <div class="shortcut-name">Tambah Baru</div>
    `;
    addCard.addEventListener('click', () => openModal());
    grid.appendChild(addCard);
}

function getIconForUrl(url) {
    if (!url) return '<i class="fas fa-link"></i>';
    const u = url.toLowerCase();

    if (u.includes('iftik.unimus.ac.id')) {
        return '<i class="fas fa-graduation-cap"></i>';
    }

    if (u.includes('siamus.unimus.ac.id')) {
        return '<i class="fas fa-book"></i>';
    }

    if (u.includes('google')) {
        return '<i class="fab fa-google"></i>';
    }
    if (u.includes('youtube')) {
        return '<i class="fab fa-youtube"></i>';
    }
    if (u.includes('github')) {
        return '<i class="fab fa-github"></i>';
    }
    if (u.includes('canary.discord') || u.includes('discord')) {
        return '<i class="fab fa-discord"></i>';
    }
    if (u.includes('twitter') || u.includes('x.com')) {
        return '<i class="fab fa-twitter"></i>';
    }
    if (u.includes('facebook')) {
        return '<i class="fab fa-facebook"></i>';
    }
    if (u.includes('instagram')) {
        return '<i class="fab fa-instagram"></i>';
    }
    if (u.includes('linkedin')) {
        return '<i class="fab fa-linkedin"></i>';
    }
    if (u.includes('reddit')) {
        return '<i class="fab fa-reddit-alien"></i>';
    }
    if (u.includes('wikipedia')) {
        return '<i class="fab fa-wikipedia-w"></i>';
    }
    if (u.includes('spotify')) {
        return '<i class="fab fa-spotify"></i>';
    }
    if (u.includes('amazon')) {
        return '<i class="fab fa-amazon"></i>';
    }
    if (u.includes('netflix')) {
        return '<i class="fas fa-film"></i>'; 
    }
    
    if (u.includes('mail') || u.includes('gmail')) {
        return '<i class="fas fa-envelope"></i>';
    }
    if (u.includes('drive')) {
        return '<i class="fas fa-cloud"></i>';
    }
    if (u.includes('maps')) {
        return '<i class="fas fa-map-marker-alt"></i>';
    }
    
    return '<i class="fas fa-globe"></i>';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const inputName = document.getElementById('inputName');
const inputUrl = document.getElementById('inputUrl');
const modalSave = document.getElementById('modalSave');
const modalCancel = document.getElementById('modalCancel');

let editingId = null;

function openModal(shortcut = null) {
    if (shortcut) {
        editingId = shortcut.id;
        modalTitle.textContent = 'Edit Shortcut';
        inputName.value = shortcut.name;
        inputUrl.value = shortcut.url;
    } else {
        editingId = null;
        modalTitle.textContent = 'Tambah Shortcut';
        inputName.value = '';
        inputUrl.value = '';
    }
    modalOverlay.classList.add('active');
    inputName.focus();
}

function closeModal() {
    modalOverlay.classList.remove('active');
    editingId = null;
}

function saveModal() {
    const name = inputName.value.trim();
    let url = inputUrl.value.trim();

    if (!name) {
        alert('Nama shortcut tidak boleh kosong.');
        inputName.focus();
        return;
    }
    if (!url) {
        alert('URL tidak boleh kosong.');
        inputUrl.focus();
        return;
    }

    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }

    if (editingId !== null) {
        const index = shortcuts.findIndex(s => s.id === editingId);
        if (index !== -1) {
            shortcuts[index].name = name;
            shortcuts[index].url = url;
        }
    } else {
        shortcuts.push({
            id: Date.now() + Math.random() * 1000,
            name,
            url,
        });
    }

    saveShortcuts();
    render();
    closeModal();
}

modalCancel.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});
modalSave.addEventListener('click', saveModal);

inputUrl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        saveModal();
    }
});

document.getElementById('addBtn').addEventListener('click', () => openModal());
document.getElementById('resetBtn').addEventListener('click', resetToDefault);

loadShortcuts();

console.log('✅ Dashboard shortcut siap!');
console.log('📌 Klik kartu untuk membuka website.');
console.log('📌 Klik "Tambah" atau kartu "+" untuk menambah shortcut.');
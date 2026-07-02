// =============================================================
// 1. СИСТЕМА БАЗЫ ДАННЫХ (localStorage)
// =============================================================
const DB_KEY = 'xteam_applications';

function getDB() {
    try {
        return JSON.parse(localStorage.getItem(DB_KEY)) || [];
    } catch { return []; }
}

function saveDB(data) {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
}

function addApplication(name, exp, contact) {
    const db = getDB();
    db.push({
        id: Date.now(),
        name: name.trim(),
        exp: exp.trim(),
        contact: contact.trim(),
        date: new Date().toLocaleString()
    });
    saveDB(db);
    renderDB();
}

function clearDB() {
    if (confirm('Удалить все заявки?')) {
        saveDB([]);
        renderDB();
    }
}

// =============================================================
// 2. ОТОБРАЖЕНИЕ БАЗЫ
// =============================================================
function renderDB() {
    const db = getDB();
    const tbody = document.getElementById('dbBody');
    if (db.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="5">Пока нет заявок. Стань первым!</td></tr>';
        return;
    }
    let html = '';
    db.forEach((row, idx) => {
        html += `<tr>
                    <td>${idx + 1}</td>
                    <td><strong>${escapeHtml(row.name)}</strong></td>
                    <td>${escapeHtml(row.exp)}</td>
                    <td>${escapeHtml(row.contact)}</td>
                    <td>${row.date}</td>
                </tr>`;
    });
    tbody.innerHTML = html;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// =============================================================
// 3. ФОРМА ПОДАЧИ ЗАЯВКИ
// =============================================================
document.getElementById('applyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('applyName').value.trim();
    const exp = document.getElementById('applyExp').value.trim();
    const contact = document.getElementById('applyContact').value.trim();

    if (!name || !exp || !contact) {
        document.getElementById('applyStatus').innerHTML = '<span style="color:#ff6b6b;">⚠️ Заполни все поля!</span>';
        return;
    }

    addApplication(name, exp, contact);
    document.getElementById('applyStatus').innerHTML = '<span style="color:#00ffc8;">✅ Заявка отправлена!</span>';
    this.reset();
    setTimeout(() => {
        document.getElementById('applyStatus').innerHTML = '';
    }, 4000);
});

// =============================================================
// 4. РЕГИСТРАЦИЯ / ВХОД (тоже храним в localStorage)
// =============================================================
const USERS_KEY = 'xteam_users';

function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; } catch { return {}; }
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

document.getElementById('registerBtn').addEventListener('click', function() {
    const login = document.getElementById('authLogin').value.trim();
    const pass = document.getElementById('authPass').value.trim();
    const status = document.getElementById('authStatus');

    if (!login || !pass) {
        status.innerHTML = '<span style="color:#ff6b6b;">⚠️ Введи логин и пароль</span>';
        return;
    }
    const users = getUsers();
    if (users[login]) {
        status.innerHTML = '<span style="color:#ff6b6b;">❌ Такой логин уже существует</span>';
        return;
    }
    users[login] = pass;
    saveUsers(users);
    status.innerHTML = '<span style="color:#00ffc8;">✅ Регистрация успешна! Теперь войди.</span>';
    setTimeout(() => status.innerHTML = '', 2500);
});

document.getElementById('authForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const login = document.getElementById('authLogin').value.trim();
    const pass = document.getElementById('authPass').value.trim();
    const status = document.getElementById('authStatus');

    if (!login || !pass) {
        status.innerHTML = '<span style="color:#ff6b6b;">⚠️ Введи логин и пароль</span>';
        return;
    }
    const users = getUsers();
    if (users[login] && users[login] === pass) {
        status.innerHTML = '<span style="color:#00ffc8;">✅ Добро пожаловать, ' + login + '!</span>';
        document.getElementById('authLink').textContent = '👤 ' + login;
        document.getElementById('authLink').style.borderColor = '#00ffc8';
        localStorage.setItem('xteam_session', login);
    } else {
        status.innerHTML = '<span style="color:#ff6b6b;">❌ Неверный логин или пароль</span>';
    }
    setTimeout(() => status.innerHTML = '', 3000);
});

// восстанавливаем сессию при загрузке
(function restoreSession() {
    const session = localStorage.getItem('xteam_session');
    if (session) {
        document.getElementById('authLink').textContent = '👤 ' + session;
        document.getElementById('authLink').style.borderColor = '#00ffc8';
    }
})();

// =============================================================
// 5. ОЧИСТКА БАЗЫ
// =============================================================
document.getElementById('clearDbBtn')?.addEventListener('click', clearDB);

// =============================================================
// 6. ПЛАВНОЕ ПОЯВЛЕНИЕ (fade-in)
// =============================================================
document.addEventListener('DOMContentLoaded', function() {
    renderDB();

    document.querySelectorAll('.service-card, .team-member, .form-container').forEach(el => {
        el.classList.add('fade-in');
        setTimeout(() => el.classList.add('visible'), 100);
    });

    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
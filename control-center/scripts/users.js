const API_URL = 'http://localhost:3000/api/users';

// page elements
const tbody = document.getElementById('userTableBody');

const searchInput = document.getElementById('searchInput');
const roleFilter = document.getElementById('roleFilter');

const tableState = document.getElementById('table-state');
const tableError = document.getElementById('table-error');

// fetching users from backend
async function loadUsers() {
    try {
        tableState.style.display = 'flex';
        tableState.innerHTML = '<p>Loading...</p>';

        const res = await fetch(API_URL);
        const users = await res.json();

        renderUsers(users);

        // live search + filter
        searchInput.addEventListener('input', () => renderUsers(users));
        roleFilter.addEventListener('change', () => renderUsers(users));
    } catch (err) {
        tableError.style.display = 'flex';
        tableError.innerHTML = "<p>Couldn't load users! Please try again later</p>";

        console.error('Error while loading users', err);
    } finally {
        tableState.style.display = 'none';
        tableState.innerHTML = '';
    }
}

// render users table
function renderUsers(users) {
    tbody.innerHTML = '';

    const searchValue = (searchInput.value || '').toLowerCase().trim();
    const roleValue = roleFilter.value;

    let filtered = (users || []).filter(Boolean);

    if (searchValue) {
        filtered = filtered.filter(
            (u) =>
                `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase().includes(searchValue) ||
                (u.email || '').toLowerCase().includes(searchValue),
        );
    }

    if (roleValue !== 'all') {
        filtered = filtered.filter((u) => u.role === roleValue);
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align:center; padding: 20px;">
                    No results found
                </td>
            </tr>
        `;
        return;
    }

    filtered.forEach((user) => {
        if (!user) return;

        const tr = document.createElement('tr');

        const status = (user.status || '').toLowerCase();

        if (status === 'disabled') {
            tr.style.backgroundColor = '#ffe5e5';
            tr.style.color = '#b30000';
            tr.style.opacity = '0.8';
        }

        tr.innerHTML = `
            <td>${user.firstName || ''} ${user.lastName || ''}</td>
            <td>${user.email || ''}</td>
            <td>${user.role || ''}</td>
        `;

        tr.onclick = () => {
            const id = user._id || user.id;

            if (!id) {
                console.error('User missing ID:', user);
                return;
            }

            window.location.href = `view.html?id=${id}`;
        };

        tbody.appendChild(tr);
    });
}

// initial load
document.addEventListener('DOMContentLoaded', async () => {
    await loadUsers();
});

const API_URL = 'http://localhost:3000/api/users';

//initialising  page elements so i resuse them later without having to query the DOM again and again
const tbody = document.getElementById('userTableBody');

const searchInput = document.getElementById('searchInput');
const roleFilter = document.getElementById('roleFilter');

const tableState = document.getElementById('table-state');
const tableError = document.getElementById('table-error');

//fetch users from backend
async function loadUsers() {
    try {
        // show the loading state
        tableState.style.display = 'flex';
        tableState.innerHTML = '<p>Loading...</p>';

        const res = await fetch(API_URL);
        const users = await res.json();

        renderUsers(users);

        //live search + filter
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

//render users table
function renderUsers(users) {
    tbody.innerHTML = '';

    let searchValue = searchInput.value.toLowerCase();
    let roleValue = roleFilter.value;

    let filtered = users;

    //search filter
    if (searchValue) {
        filtered = filtered.filter(
            (u) => u.username.toLowerCase().includes(searchValue) || u.email.toLowerCase().includes(searchValue),
        );
    }

    //role filter
    if (roleValue !== 'all') {
        filtered = filtered.filter((u) => u.role === roleValue);
    }

    if (filtered.length === 0) {
        tableError.style.display = 'flex';
        tableError.innerHTML = '<p>No users found</p>';
    }

    filtered.forEach((user) => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${user.firstName} ${user.lastName} </td>
            <td>${user.email}</td>
            <td>${user.role}</td>
        `;

        tr.onclick = () => {
            window.location.href = `view.html?id=${user._id}`; // Should navigate to users page
        };

        tbody.appendChild(tr);
    });
}

//initial load + restore state
// Use this approach to load content immediately after reloading or initially. It's consistent with what is being used on the app
document.addEventListener('DOMContentLoaded', async () => {
    await loadUsers();
});

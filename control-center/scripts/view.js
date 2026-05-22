import { backendURL, getToken } from '../../env.config.js';

const detailName = document.getElementById('detailName');
const detailEmail = document.getElementById('detailEmail');
const detailRole = document.getElementById('detailRole');
const dateJoinedDetail = document.getElementById('joined-detail');
const statusDetail = document.getElementById('status-detail');

// get user id from query params
const getUserId = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
};

// update user role
async function updateUser() {

    const currentRole = document.getElementById('detailRole').dataset.originalRole;
    if (currentRole === 'admin' && detailRole.value !== 'admin') {
        alert('You cannot change the role of an admin.');
        return;
    }

    const id = getUserId();
    if (!id) {
        alert('No user ID found');
        return;
    }

    try {
        const url = backendURL() + `/api/users/${id}`;
        const res = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: detailRole.value }),
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });

        if (res.ok) {
            const data = await res.json();
            alert(data.message || 'Role updated successfully');
        } else {
            alert('Failed to update role');
        }
    } catch (err) {
        console.error(err);
        alert('Server error while updating role');
    }
}

async function toggleUserStatus() {
    const id = getUserId();
    if (!id) {
        alert('No user ID found');
        return;
    }

    const btn = document.getElementById('toggle-status-btn');
    const isDisabled = btn.textContent.trim() === 'Enable';
    const newStatus = isDisabled ? 'active' : 'disabled';
    const confirmMsg = isDisabled
        ? 'Are you sure you want to enable this user?'
        : 'Are you sure you want to disable this user?';

    if (!confirm(confirmMsg)) return;

    try {
        const url = backendURL() + `/api/users/${id}`;
        const res = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            headers: { 'Authorization': `Bearer ${getToken()}` },
            body: JSON.stringify({ status: newStatus }),
        });

        if (res.ok) {
            statusDetail.innerHTML = newStatus;
            btn.textContent = isDisabled ? 'Disable' : 'Enable';
            alert(`User ${isDisabled ? 'enabled' : 'disabled'} successfully`);
        } else {
            alert('Failed to update user status');
        }
    } catch (err) {
        console.error(err);
        alert('Server error while updating user status');
    }
}

// fetch user data on page load
document.addEventListener('DOMContentLoaded', async () => {
    const id = getUserId();
    if (!id) {
        console.error('No user ID in query params');
        return;
    }

    try {
        const url = backendURL() + `/api/users/${id}`;
        const res = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });

        if (res.ok) {
            const user = await res.json();
            detailName.innerHTML = `${user.firstName || ''} ${user.lastName || ''}`;
            detailEmail.innerHTML = user.email || '';
            dateJoinedDetail.innerHTML = user.createdAt ? user.createdAt.slice(0, 10) : '';
            statusDetail.innerHTML = user.status || '';
            detailRole.value = user.role || '';
            detailRole.dataset.originalRole = user.role || '';
            document.getElementById('toggle-status-btn').textContent = user.status === 'disabled' ? 'Enable' : 'Disable';
        } else {
            alert('Could not load user details');
        }
    } catch (err) {
        console.error(err);
        alert('Server error while fetching user details');
    }
});

document.getElementById('save-user-details').addEventListener('click', updateUser);
document.getElementById('toggle-status-btn').addEventListener('click', toggleUserStatus);
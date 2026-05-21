import { backendURL } from '../../env.config.js';

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
            credentials: 'include',
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

// delete user
async function deleteUser() {
    const id = getUserId();
    if (!id) {
        alert('No user ID found');
        return;
    }

    try {
        const url = backendURL() + `/api/users/${id}`;
        const res = await fetch(url, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (res.ok) {
            const data = await res.json();
            alert(data.message || 'User deleted successfully');
            window.location.href = 'users.html'; // redirect after delete
        } else {
            alert('Failed to delete user');
        }
    } catch (err) {
        console.error(err);
        alert('Server error while deleting user');
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
            credentials: 'include',
        });

        if (res.ok) {
            const user = await res.json();
            detailName.innerHTML = `${user.firstName || ''} ${user.lastName || ''}`;
            detailEmail.innerHTML = user.email || '';
            dateJoinedDetail.innerHTML = user.createdAt ? user.createdAt.slice(0, 10) : '';
            statusDetail.innerHTML = user.status || '';
            detailRole.value = user.role || '';
            detailRole.dataset.originalRole = user.role || '';
        } else {
            alert('Could not load user details');
        }
    } catch (err) {
        console.error(err);
        alert('Server error while fetching user details');
    }
});

document.getElementById('save-user-details').addEventListener('click', updateUser);
document.getElementById('delete-user').addEventListener('click', deleteUser);
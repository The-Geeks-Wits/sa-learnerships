const API_URL = 'http://localhost:3000/api/users';

//initialising  page elements so i resuse them later without having to query the DOM again and again
const detailSection = document.getElementById('userDetailSection');

const detailName = document.getElementById('detailName');
const detailEmail = document.getElementById('detailEmail');
const detailRole = document.getElementById('detailRole');
const dateJoinedDetail = document.getElementById('joined-detail');
const statusDetail = document.getElementById('status-detail');

//get user id from the query params
const getUserId = () => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    return params.get('id');
};

//update user role
async function updateUser(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: detailRole.value }),
        });

        if (res.ok) {
            const data = await res.json();
            alert(data.message || 'Update failed');
        }
    } catch (err) {
        console.error(err);
        alert('Server error');
    }
}

//delete user
async function deleteUser(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            const data = await res.json();
            alert(data.message || 'Delete failed');
        }
    } catch (err) {
        console.error(err);
    }
}

// Fetch user data
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const id = getUserId();

        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: detailRole.value }),
        });

        if (res.ok) {
            const user = await res.json();
            detailName.innerHTML = user.firstName + ' ' + user.lastName;
            detailEmail.innerHTML = user.email;
            dateJoinedDetail.innerHTML = user.createdAt.slice(0, 10);
            statusDetail.innerHTML = user.status;
            detailRole.value = user.role;
        }
    } catch (err) {
        console.error(err);
    }
});

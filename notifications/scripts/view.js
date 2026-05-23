import { backendURL, getToken } from '../../env.config.js';

const pageError = document.getElementById('page-error');
const pageState = document.getElementById('page-state');
const pageContainer = document.getElementById('page-container');
const pageTitle = document.getElementById('page-title');
const notificationMessage = document.getElementById('notification-message');
const notificationDate = document.getElementById('notification-date');
const readToggleBtn = document.getElementById('read-toggle-btn');

// A method to mark the notification as read or unread
const markNotification = async (id, read) => {
    try {
        const url = backendURL() + `/notifications/${id}`;

        const response = await fetch(url, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ read }),
        });
    } catch (error) {
        // TODO: Do something with the error
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const queryString = window.location.search;
        const params = new URLSearchParams(queryString);
        const id = params.get('id');

        const url = backendURL() + `/notifications/${id}`;

        pageState.style.display = 'flex';
        pageState.innerHTML = 'Loading...';

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });

        const data = await response.json();
        if (response.ok) {
            await markNotification(data._id, true); // Mark notification as read

            const notificationCounts = document.querySelectorAll('.notifications-count');

            notificationCounts.forEach((count) => {
                const currentCount = Number(count.textContent);

                if (currentCount > 0) {
                    count.textContent = currentCount - 1;
                }
            });


            pageContainer.style.display = 'block';
            pageTitle.innerHTML = data.title;
            notificationMessage.innerHTML = data.message;
            notificationDate.innerHTML += data.createdAt.slice(0, 10);
        } else {
            pageError.style.display = 'flex';
            pageError.innerHTML = `<p>${data.error}</p>`;
        }
    } catch (error) {
        pageError.style.display = 'flex';
        pageError.innerHTML = 'Something went wrong! Please try again later';
    } finally {
        pageState.style.display = 'none';
        pageState.innerHTML = '';
    }
});

readToggleBtn.addEventListener('click', async () => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const id = params.get('id');

    const action = readToggleBtn.textContent;
    readToggleBtn.textContent = 'Loading...';

    if (action === 'Mark as unread') {
        await markNotification(id, false);
        readToggleBtn.textContent = 'Mark as read';
    } else {
        await markNotification(id, true);
        readToggleBtn.textContent = 'Mark as unread';
    }
});

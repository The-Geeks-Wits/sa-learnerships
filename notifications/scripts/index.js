import { backendURL } from '../../env.config.js';

const pageError = document.getElementById('page-error');
const pageState = document.getElementById('page-state');
const notifications = document.getElementById('notifications-list');
const allNotificationsTab = document.getElementById('all-notifications-tab');
const unreadNotificationsTab = document.getElementById('unread-notifications-tab');
const readNotificationsTab = document.getElementById('read-notifications-tab');

const getNotificationElement = (id, title, createdAt) => {
    return `<li>
        <h3>${title}</h3>   
        <section class="notification-details">
            <section>
                <p><b>Sent:</b> ${createdAt.slice(0, 10)}</p>   
            </section>
            <secttion>
                <button class="transparent-btn full-details-btn" data-id="${id}">Full Details</button>
            </section>
        </section>
    </li>`;
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const url = backendURL() + '/notifications/mine';

        const token = localStorage.getItem('jwt');
        if (!token) return (window.location.href = '/login.html');

        pageState.style.display = 'flex';
        pageState.innerHTML = 'Loading...';

        const response = await fetch(url, {
            method: 'GET',
            headers: { Authorization: token },
        });

        const data = await response.json();
        if (response.ok) {
            if (data.count == 0) {
                // TODO: Set a tab query param so that we show a customised tab message when there are no notifications for that particular tab
                pageError.style.display = 'flex';
                pageError.innerHTML = '<p>No notifications found</p>';
            } else {
                data.notifications.forEach(({ _id, title, createdAt }) => {
                    notifications.innerHTML += getNotificationElement(_id, title, createdAt);
                });
            }
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

notifications.addEventListener('click', (event) => {
    if (event.target.classList.contains('full-details-btn')) {
        const id = event.target.getAttribute('data-id');
        window.location.href = `/notifications/view.html?id=${id}`;
    }
});

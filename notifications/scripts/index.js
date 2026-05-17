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
            <section>
                <button class="transparent-btn full-details-btn" data-id="${id}">Full Details</button>
            </section>
        </section>
    </li>`;
};

const showAllNotifications = (allNotifications) => {
    allNotificationsTab.classList.add('visible');
    unreadNotificationsTab.classList.remove('visible');
    readNotificationsTab.classList.remove('visible');

    if (allNotifications.length === 0) {
        notifications.innerHTML = '<li><p>No notifications yet</p></li>';
        return;
    }

    notifications.innerHTML = '';

    allNotifications.forEach(({ _id, title, createdAt }) => {
        notifications.innerHTML += getNotificationElement(_id, title, createdAt);
    });
};

const showUnreadNotifications = (allNotifications) => {
    allNotificationsTab.classList.remove('visible');
    unreadNotificationsTab.classList.add('visible');
    readNotificationsTab.classList.remove('visible');

    const filteredNotifications = allNotifications.filter(({ read }) => !read);

    if (filteredNotifications.length === 0) {
        notifications.innerHTML = '<h5>No unread notifications</h5>';
        return;
    }

    notifications.innerHTML = '';

    filteredNotifications.forEach(({ _id, title, createdAt }) => {
        notifications.innerHTML += getNotificationElement(_id, title, createdAt);
    });
};

const showReadNotifications = (allNotifications) => {
    allNotificationsTab.classList.remove('visible');
    unreadNotificationsTab.classList.remove('visible');
    readNotificationsTab.classList.add('visible');

    const filteredNotifications = allNotifications.filter(({ read }) => read);

    if (filteredNotifications.length === 0) {
        notifications.innerHTML = '<h5>No read notifications</h5>';
        return;
    }

    notifications.innerHTML = '';

    filteredNotifications.forEach(({ _id, title, createdAt }) => {
        notifications.innerHTML += getNotificationElement(_id, title, createdAt);
    });
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const url = backendURL() + '/notifications/mine';


        pageState.style.display = 'flex';
        pageState.innerHTML = 'Loading...';

        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();
        if (response.ok) {
            if (data.count == 0) {
                // TODO: Set a tab query param so that we show a customised tab message when there are no notifications for that particular tab
                pageError.style.display = 'flex';
                pageError.innerHTML = '<p>No notifications found</p>';
            } else {
                allNotificationsTab.addEventListener('click', () => showAllNotifications(data.notifications));
                unreadNotificationsTab.addEventListener('click', () => showUnreadNotifications(data.notifications));
                readNotificationsTab.addEventListener('click', () => showReadNotifications(data.notifications));

                // TODO: Set a tab query param so that we start with the tab provided
                // Start with all notifications
                showAllNotifications(data.notifications);
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

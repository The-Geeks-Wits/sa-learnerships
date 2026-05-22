import { backendURL, getToken } from '../../env.config.js';

const pageState = document.getElementById('page-state');
const pageError = document.getElementById('page-error');
const pageContainer = document.getElementById('page-container');
const applications = document.getElementById('applications');
const pageDescription = document.getElementById('page-description');

const getUserRole = async () => {
    const response = await fetch(backendURL() + '/api/users/profile', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${getToken()}` },
    });

    const data = await response.json();
    return data.user.role;
};

const getApplicationElement = (opportunity, application) => {
    let location = opportunity.location;
    if (!location) location = 'Not provided';

     let buttons = `
        <section class="application-actions">
            <button class="view-btn coloured-btn"
                data-id="${application._id}">
                View Full Details
            </button>
        </section>
    `;

    return `<li>
        <section class="application-heading">
            <h3>${opportunity.title}</h3>
            <p>${application.status}</p>
        </section>
        <section class="application-details">
            <section>
                <p><b>Location:</b> ${location}</p>
                <p><b>Date submitted:</b> ${application.createdAt.slice(0, 10)}</p>
            </section>
            ${buttons}
        </section>
    </li>`;
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        pageState.style.display = 'flex';
        pageState.innerHTML = '<p>Loading...</p>';

        const role = await getUserRole();

        if (role === 'provider'){
            pageDescription.innerHTML = 'This is where you can view applications for all opportunities you created. You can review candidate applications and view their full details.'
        }else{
            pageDescription.innerHTML = 'This is where you can view all applications that you have submitted. You can open each application to review its full details and current status.'
        }

        const url =
            role === 'provider'
                ? backendURL() + '/applications'
                : backendURL() + '/applications/mine';

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });

        const data = await response.json();

        if (response.ok) {
            pageContainer.style.display = 'block';

            if (!data.applications || data.applications.length === 0) {
                applications.innerHTML = '<p class="no-data">No applications found</p>';
                return;
            }

            applications.innerHTML = '';

            data.applications.forEach((application) => {
                if (!application.opportunity) return;

                applications.innerHTML += getApplicationElement(
                    application.opportunity,
                    application
                );
            });
        } else {
            pageError.style.display = 'flex';
            pageError.innerHTML = `<p>${data.error}</p>`;
        }
    } catch (err) {
        console.log(err);
        pageError.style.display = 'flex';
        pageError.innerHTML = '<p>An error occurred! Please try again later</p>';
    } finally {
        pageState.style.display = 'none';
        pageState.innerHTML = '';
    }
});

applications.addEventListener('click', (event) => {
    if (event.target.classList.contains('view-btn')) {
        const applicationId = event.target.getAttribute('data-id');
        window.location.href = `/applications/view.html?id=${applicationId}`;
    }
});
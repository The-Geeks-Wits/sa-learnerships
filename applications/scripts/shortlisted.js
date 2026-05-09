import { backendURL } from '../../env.config.js';

const pageState = document.getElementById('page-state');
const pageError = document.getElementById('page-error');
const pageContainer = document.getElementById('page-container');
const applications = document.getElementById('applications');

const getUserRole = async () => {
    const response = await fetch(backendURL() + '/api/users/profile', {
        method: 'GET',
        credentials: 'include',
    });

    const data = await response.json();
    return data.user.role;
};

const getApplicationElement = (opportunity, dateSubmitted) => {
    let location = opportunity.location;

    if (!location) location = 'Not provided';

    return `<li>
        <h3>${opportunity.title}</h3>
        <section class="application-details">
            <section>
                <p><b>Location:</b> ${location}</p>
                <p><b>Date submitted:</b> ${dateSubmitted.slice(0, 10)}</p>
            </section>
        </section>
    </li>`;
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        pageState.style.display = 'flex';
        pageState.innerHTML = '<p>Loading...</p>';

        const role = await getUserRole();

        const url =
            role === 'provider'
                ? backendURL() + '/applications?status=Shortlisted'
                : backendURL() + '/applications/mine?status=Shortlisted';

        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
            pageContainer.style.display = 'block';

            if (!data.applications || data.applications.length === 0) {
                applications.innerHTML = '<p class="no-data">No shortlisted applications found</p>';
                return;
            }

            applications.innerHTML = '';

            data.applications.forEach((application) => {
                if (!application.opportunity) return;

                applications.innerHTML += getApplicationElement(
                    application.opportunity,
                    application.createdAt
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
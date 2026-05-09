import { backendURL } from '../../env.config.js';

const pageState = document.getElementById('page-state');
const pageError = document.getElementById('page-error');
const pageContainer = document.getElementById('page-container');
const applications = document.getElementById('applications');

const getApplicationElement = (opportunity, dateSubmitted) => {
    let location = opportunity.location;
    if (!location) location = 'Not provided';

    return `<li>
        <h3>${opportunity.title}</h3>
        <section class="application-details">
            <section>
                <p><b>Location:</b> ${location}<p>
                <p><b>Date submitted:</b> ${dateSubmitted.slice(0, 10)}</p>
            </section>
        </section>
    </li>`;
};

document.addEventListener('DOMContentLoaded', async () => {
    try {

        pageState.style.display = 'flex';
        pageState.innerHTML = '<p>Loading...</p>';

        const url = backendURL() + '/applications/mine?status=Rejected';
        const response = await fetch(url, {
            method: 'GET',
            credentials : 'include',
        });

        const data = await response.json();
        if (response.ok) {
            pageContainer.style.display = 'block';
            data.applications.forEach((application) => {
                const opportunity = application.opportunity;
                applications.innerHTML += getApplicationElement(opportunity, application.createdAt);
            });
        } else {
            pageError.style.display = 'flex';
            pageError.innerHTML = `<p>${data.error}</p>`;
        }
    } catch (err) {
    } finally {
        pageState.style.display = 'none';
        pageState.innerHTML = '';
    }
});

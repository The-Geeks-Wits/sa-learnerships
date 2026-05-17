import { backendURL } from '../../env.config.js';

const pageState = document.getElementById('page-state');
const pageError = document.getElementById('page-error');
const pageContainer = document.getElementById('page-container');
const applications = document.getElementById('applications');

const getApplicationElement = (opportunity, dateSubmitted) => {
    let location = opportunity.location;
    if (!location) location = 'Not provided';

    return `<li class="rejected-application">
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
       const token = localStorage.getItem('jwt');
        if (!token) {
            window.location.href = '/login.html';
            return;
        }
        pageState.style.display = 'flex';
        pageState.innerHTML = '<p>Loading...</p>';

        const url = backendURL() + '/applications/mine?status=Rejected';
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: { Authorization: token },
        });

        const data = await response.json();
        if (response.ok) {
            pageContainer.style.display = 'block';
            const applicationsList = data.applications || [];
            if (applicationsList.length === 0) {
                applications.innerHTML = '<li class="empty-message">You have no rejected applications. Your applications are either pending or shortlisted.</li>';
            }
            else {
                applications.innerHTML = '';
                data.applications.forEach((application) => {
                    const opportunity = application.opportunity;
                    applications.innerHTML += getApplicationElement(opportunity, application.createdAt);
                });
            }
            pageState.style.display = 'none';
        } 
        else {
            pageError.style.display = 'flex';
            pageError.innerHTML = `<p>${data.error}</p>`;
        }
    } catch (err) {
    } finally {
        console.error('Error loading rejected applications:', err);
        pageError.style.display = 'flex';
        pageError.innerHTML = `<p>An error occurred while loading your applications. Please try again later.</p>`;
        pageState.style.display = 'none';
    }
});

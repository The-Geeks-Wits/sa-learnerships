import { backendURL } from '../../env.config.js';

const pageState = document.getElementById('page-state');
const pageError = document.getElementById('page-error');
const pageContainer = document.getElementById('page-container');
const opportunities = document.getElementById('opportunities');

const getOpportunityElement = (id, title, status, location, closingDate) => {
    if (!location) location = 'Not provided';

    return `<li>
        <section class="opportunity-heading">
            <h3>${title}</h3>
            <p>${status}</p>
        </section>
        <section class="opportunity-details">
            <section>
                <p><b>Location:</b> ${location}<p>
                <p><b>Closes:</b> ${closingDate.slice(0, 10)}</p>
            </section>
            <section>
                <button class="full-details-btn transparent-btn" data-id="${id}">Full Details</button>
                <button class="applications-btn coloured-btn" data-id="${id}">Applications</button>
            </section>
        </section>
    </li>`;
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        pageState.style.display = 'flex';
        pageState.innerHTML = '<p>Loading...</p>';

        const url = backendURL() + '/opportunities/mine';

        const token = localStorage.getItem('jwt');
        if (!token) return (window.location.href = '/login.html');

        const response = await fetch(url, {
            method: 'GET',
            headers: { Authorization: token },
        });

        if (response.ok) {
            const data = await response.json();

            pageContainer.style.display = 'block';
            if (data.opportunities.length == 0) {
                opportunities.innerHTML = '<p class="no-data">No opportunities found</p>';
                return;
            }

            data.opportunities.forEach(({ _id, title, status, location, closingDate }) => {
                opportunities.innerHTML += getOpportunityElement(_id, title, status, location, closingDate);
            });
        }
    } catch (error) {
        pageError.style.display = 'flex';
        pageError.innerHTML = '<p>An error occurred! Please try again later</p>';
    } finally {
        pageState.style.display = 'none';
        pageState.innerHTML = '';
    }
});

opportunities.addEventListener('click', async (event) => {
    if (event.target.classList.contains('full-details-btn')) {
        const id = event.target.getAttribute('data-id');
        window.location.href = `/opportunities/view.html?id=${id}`;
    }
});

import { backendURL } from '../../env.config.js';

const pageState = document.getElementById('page-state');
const pageError = document.getElementById('page-error');
const pageContainer = document.getElementById('page-container');
const opportunities = document.getElementById('opportunities');

const getOpportunityElement = (id, title, location, closingDate) => {
    if (!location) location = 'Not provided';

    return `<li>
        <h3>${title}</h3>
        <section class="opportunity-details">
            <section>
                <p><b>Location:</b> ${location}<p>
                <p><b>Closes:</b> ${closingDate.slice(0, 10)}</p>
            </section>
            <section>
                <button class="approve-btn coloured-btn" data-opportunity-id="${id}">Approve</button>
                <button class="reject-btn transparent-btn">Reject</button>
            </section>
        </section>
    </li>`;
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        pageState.style.display = 'flex';
        pageState.innerHTML = '<p>Loading...</p>';

        const url = backendURL() + '/opportunities?status=Pending';
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            const data = await response.json();

            pageContainer.style.display = 'block';
            if (data.opportunities.length == 0) {
                opportunities.innerHTML = '<p class="no-data">No pending opportunities found</p>';
                return;
            }

            data.opportunities.forEach(({ _id, title, location, closingDate }) => {
                opportunities.innerHTML += getOpportunityElement(_id, title, location, closingDate);
            });
        }
    } catch (error) {
        pageError.style.display = 'flex';
        pageError.innerHTML = '<p>An error occurred! Please try again later</p>';
        console.error('View opportunity error:', error);
    } finally {
        pageState.style.display = 'none';
        pageState.innerHTML = '';
    }
});

opportunities.addEventListener('click', async (event) => {
    if (event.target.classList.contains('approve-btn')) {
        const opportunityId = event.target.getAttribute('data-opportunity-id');

        try {
            const url = backendURL() + `/opportunities/${opportunityId}/approve`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();

            if (response.ok) {
                alert('Opportunity approved successfully!');
                window.location.reload();
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert('Something went wrong! Please try again later');
        }
    } else if (event.target.classList.contains('reject-btn')) {
        const opportunityId = event.target.previousElementSibling.getAttribute('data-opportunity-id');

        try {
            const url = backendURL() + `/opportunities/${opportunityId}/reject`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();

            if (response.ok) {
                alert('Opportunity rejected successfully!');
                window.location.reload();
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert('Something went wrong! Please try again later');
        }
    }
});

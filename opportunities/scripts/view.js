import { backendURL } from '../../env.config.js';

const pageState = document.getElementById('page-state');
const detailsContainer = document.getElementById('details-container');
const browserTitle = document.getElementById('browser-title');
const pageTitle = document.getElementById('page-title');
const statusElement = document.getElementById('status');
const descriptionContainer = document.getElementById('description-container');
const description = document.getElementById('description');
const requirements = document.getElementById('requirements');
const stipend = document.getElementById('stipend');
const duration = document.getElementById('duration');
const locationElement = document.getElementById('location');
const closingDate = document.getElementById('closing-date');
const approveButton = document.getElementById('approve-btn');
const rejectButton = document.getElementById('reject-btn');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        pageState.style.display = 'flex';
        pageState.innerHTML = '<p>Loading...</p>';

        // Get the id of the opportunity
        const queryString = window.location.search;
        const params = new URLSearchParams(queryString);
        const id = params.get('id');

        const url = backendURL() + `/opportunities/${id}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (response.ok) {
            detailsContainer.style.display = 'block';

            browserTitle.innerHTML = 'Opportunity | ' + data.title;
            pageTitle.innerHTML = data.title;
            statusElement.innerHTML = data.status;

            if (data.description) description.innerHTML = data.description;
            else description.innerHTML = 'Not Provided';

            if (data.location) locationElement.innerHTML = data.location;
            else locationElement.innerHTML = 'Not Provided';

            if (data.stipend) stipend.innerHTML = 'R ' + data.stipend + ' pm';
            else stipend.innerHTML = 'Not Provided';

            if (data.duration) duration.innerHTML = data.duration + ' months';
            else duration.innerHTML = 'Not Provided';

            if (data.closingDate) closingDate.innerHTML = data.closingDate.slice(0, 10);
            else closingDate.innerHTML = 'Not Provided';

            data.requirements.forEach((item) => {
                requirements.innerHTML += `<li><p>${item}</p></li>`;
            });
        } else {
            pageState.style.display = 'flex';
            pageState.innerHTML = data.error;
        }
    } catch (error) {
        pageState.style.display = 'flex';
        pageState.innerHTML = '<p>An error occurred! Please try again later</p>';
        console.error('View opportunity error:', error);
    } finally {
        pageState.style.display = 'none';
        pageState.innerHTML = '';
    }
});

approveButton.addEventListener('click', async () => {
    try {
        const id = new URLSearchParams(window.location.search).get('id');
        const url = backendURL() + `/opportunities/${id}/approve`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (response.ok) {
            approveButton.disabled = true;
            approveButton.style.cursor = 'not-allowed';
            alert('Opportunity approved successfully!');
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Something went wrong! Please try again later');
    }
});

rejectButton.addEventListener('click', async () => {
    try {
        const id = new URLSearchParams(window.location.search).get('id');
        const url = backendURL() + `/opportunities/${id}/reject`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (response.ok) {
            rejectButton.disabled = true;
            rejectButton.style.cursor = 'not-allowed';
            alert('Opportunity rejected successfully!');
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Something went wrong! Please try again later');
    }
});

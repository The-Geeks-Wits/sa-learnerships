import { backendURL } from '../../env.config.js';

const pageState = document.getElementById('page-state');
const pageError = document.getElementById('page-error');
const pageTitle = document.getElementById('page-title');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Get opportunity details
        const id = new URLSearchParams(window.location.search).get('id');

        if (!id) {
            pageState.style.display = 'flex';
            pageState.innerHTML =
                'Opportunity id required! Please provide the id of the opportunity you want to apply for';
            return;
        }

        const url = backendURL() + '/opportunities/' + id;

        const response = await fetch(url, { method: 'GET' });

        const data = await response.json();
        if (response.ok) {
            pageTitle.innerHTML = data.title;
        } else {
            pageState.style.display = 'flex';
            pageState.innerHTML = data.error;
        }
    } catch (err) {}
});

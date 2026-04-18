import { backendURL } from '../../env.config.js';

const pageState = document.getElementById('page-state');
const pageError = document.getElementById('page-error');
const pageContainer = document.getElementById('page-container');
const opportunities = document.getElementById('opportunities');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        pageState.style.display = 'flex';
        pageState.innerHTML = '<p>Loading...</p>';

        const url = backendURL() + '/opportunities?status=Approved';
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (response.ok) {
            pageContainer.style.display = 'block';
            data.opportunities.forEach(({ _id, title, location, closingDate }) => {
                opportunities.innerHTML += `<li>
                    <h3>${title}</h3>   
                    <section class="opportunity-details">
                        <section>
                            <p><b>Location:</b> ${location || 'Not provided'}<p>
                            <p><b>Closes:</b> ${closingDate.slice(0, 10)}</p>   
                        </section>
                        <secttion>
                            <button class="coloured-btn">Apply</button>
                            <button class="transparent-btn full-details-btn" data-id="${_id}">Full Details</button>
                        </section>
                    </section>
                </li>`;
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

opportunities.addEventListener('click', (event) => {
    if (event.target.classList.contains('full-details-btn')) {
        const id = event.target.getAttribute('data-id');
        window.location.href = `/opportunities/view.html?id=${id}`;
    }
});

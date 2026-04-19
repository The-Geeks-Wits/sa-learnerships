import { backendURL } from '../../env.config.js';

const pageState = document.getElementById('page-state');
const opportunitiesList = document.getElementById('opportunities');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        pageState.style.display = 'flex';
        pageState.innerHTML = '<p>Loading...</p>';

        const token = localStorage.getItem('token');

        const response = await fetch(backendURL() + '/opportunities/rejected/mine', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
            pageState.style.display = 'none';
            pageState.innerHTML = '';
            document.getElementById('page-container').style.display = 'block';

            if (data.opportunities.length === 0) {
                pageState.style.display = 'flex';
                pageState.innerHTML = '<p>You have no rejected opportunities</p>';
                document.getElementById('page-container').style.display = 'block';
                return;
            }

            data.opportunities.forEach((opportunity) => {
                opportunitiesList.innerHTML += `
                    <li>
                        <section class="opportunity-card">
                            <section class="opportunity-card-details">
                                <h3>${opportunity.title}</h3>
                                <p>${opportunity.description || 'No description provided'}</p>
                            </section>
                            <button class="coloured-btn edit-btn" data-id="${opportunity._id}">Edit and Resubmit</button>
                        </section>
                    </li>`;
            });

            const editButtons = document.getElementsByClassName('edit-btn');
            for (let i = 0; i < editButtons.length; i++) {
                editButtons[i].addEventListener('click', () => {
                    const id = editButtons[i].getAttribute('data-id');
                    window.location.href = '/opportunities/edit.html?id=' + id;
                });
            }
        } else {
            pageState.style.display = 'flex';
            pageState.innerHTML = '<p>' + data.error + '</p>';
        }
    } catch (error) {
        pageState.style.display = 'flex';
        pageState.innerHTML = '<p>An error occurred! Please try again later</p>';
        console.log(error);
    }
});
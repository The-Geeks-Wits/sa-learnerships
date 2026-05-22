import { backendURL } from '../../env.config.js';

const pageState = document.getElementById('page-state');
const pageError = document.getElementById('page-error');
const pageContainer = document.getElementById('page-container');
const opportunities = document.getElementById('opportunities');

const getOpportunityElement = (id, title, location, closingDate) => {
    return `<li>
        <h3>${title}</h3>   
        <section class="opportunity-details">
            <section>
                <p><b>Location:</b> ${location || 'Not provided'}<p>
                <p><b>Closes:</b> ${closingDate.slice(0, 10)}</p>   
            </section>
            <secttion>
                <button class="coloured-btn opportunity-apply-btn" data-id="${id}">Apply</button>
                <button class="transparent-btn full-details-btn" data-id="${id}">Full Details</button>
            </section>
        </section>
    </li>`;
};

const submitApplication = async (opportunityId) => {
    try {
        const url = backendURL() + '/applications';

        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ opportunityId }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('You have successfully applied for this opportunity!');
            window.location.href = '/applications/pending.html';
        }
        else {
            alert(data.error);
        }    
    } catch (err) {
        // Alert or show the error as a modal
        alert('Something went wrong! Please try again later');
    }
};

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

opportunities.addEventListener('click', (event) => {
    if (event.target.classList.contains('full-details-btn')) {
        const id = event.target.getAttribute('data-id');
        window.location.href = `/opportunities/view.html?id=${id}`;
    } else if (event.target.classList.contains('opportunity-apply-btn')) {
        // Show a modal and ask the applicant if they really want to apply to this opportunity
        // When they click yes then we should just take their details make an application for them in the backend
        // For now just send the request directly
        const confirmed = confirm('Are you sure you want to apply for this opportunity?');
        
        if(!confirmed)
            return;
        
        const id = event.target.getAttribute('data-id');
        submitApplication(id);
    }
});

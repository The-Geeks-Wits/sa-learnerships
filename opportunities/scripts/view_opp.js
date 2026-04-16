const pageState = document.getElementById('page-state');
const opportunitiesList = document.getElementById('opportunities-list');
const createButton = document.getElementById('create-btn');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        pageState.textContent = 'Loading your opportunities...';

        const response = await fetch('http://localhost:3000/opportunities/my_opportunities', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
            const opportunities = data.data || [];

            if (opportunities.length === 0) {
                opportunitiesList.textContent = 'You haven\'t created any opportunities yet.';
            } else {
                opportunitiesList.innerHTML = '';
                for (let i = 0; i < opportunities.length; i++) {
                    const opp = opportunities[i];
                    const closingDate = opp.closingDate ? opp.closingDate.slice(0, 10) : 'Not specified';
                    const location = opp.location || 'Not provided';
                    const status = opp.status || 'Pending';
                    
                    const listItem = document.createElement('li');
                    const title = document.createElement('h3');
                    title.textContent = opp.title;
                    listItem.appendChild(title);
                    
                    const locationPara = document.createElement('p');
                    locationPara.innerHTML = '<strong>Location:</strong> ' + location;
                    listItem.appendChild(locationPara);
                    
                    const closingPara = document.createElement('p');
                    closingPara.innerHTML = '<strong>Closes:</strong> ' + closingDate;
                    listItem.appendChild(closingPara);
                    
                    const statusPara = document.createElement('p');
                    statusPara.innerHTML = '<strong>Status:</strong> ' + status;
                    listItem.appendChild(statusPara);
                    
                    if (opp.description) {
                        const descPara = document.createElement('p');
                        let description = opp.description;
                        if (description.length > 150) description = description.substring(0, 150) + '...';
                        descPara.innerHTML = '<strong>Description:</strong> ' + description;
                        listItem.appendChild(descPara);
                    }
                    
                    const viewButton = document.createElement('button');
                    viewButton.textContent = 'View Details';
                    viewButton.onclick = function() {
                        viewOpportunity(opp._id);
                    };
                    listItem.appendChild(viewButton);
                    
                    const separator = document.createElement('hr');
                    opportunitiesList.appendChild(separator);
                    opportunitiesList.appendChild(listItem);
                }
            }
        } else {
            pageState.textContent = data.error || 'Failed to load opportunities';
        }
    } catch (error) {
        pageState.textContent = 'An error occurred! Please try again later';
        console.error('View opportunities error:', error);
    } finally {
        pageState.textContent = '';
    }
});

function viewOpportunity(id) {
    window.location.href = 'view.html?id=' + id;
}

if (createButton) {
    createButton.addEventListener('click', function() {
        window.location.href = 'create.html';
    });
}
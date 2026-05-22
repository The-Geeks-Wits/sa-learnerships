import { backendURL, getToken } from '../../env.config.js';

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
const actionsElement = document.getElementById('actions');

const addAdminButtonsListeners = (approveButton, rejectButton) => {
    approveButton.addEventListener('click', async () => {
        try {
            const id = new URLSearchParams(window.location.search).get('id');
            const url = backendURL() + `/opportunities/${id}/approve`;


            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${getToken()}` },
                headers: {
                    'Content-Type': 'application/json',
                },
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
                headers: { 'Authorization': `Bearer ${getToken()}` },
                headers: {
                    'Content-Type': 'application/json',
                },
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
};

const addOwnerButtonsListeners = (resubmitButton) => {
    resubmitButton.addEventListener('click', async () => {
        try {
            const id = new URLSearchParams(window.location.search).get('id');
            const url = backendURL() + `/opportunities/${id}/resubmit`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${getToken()}` },
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                resubmitButton.disabled = true;
                resubmitButton.style.cursor = 'not-allowed';
                alert('Opportunity resubmitted successfully!');
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert('Something went wrong! Please try again later');
        }
    });
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        pageState.style.display = 'flex';
        pageState.innerHTML = '<p>Loading...</p>';

        // Get the id of the opportunity
        const queryString = window.location.search;
        const params = new URLSearchParams(queryString);
        const id = params.get('id');

        let url = backendURL() + `/opportunities/${id}`;
        const res = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${getToken()}` },
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await res.json();

        if (res.ok) {
            detailsContainer.style.display = 'block';

            browserTitle.innerHTML = 'Opportunity | ' + data.title;
            pageTitle.innerHTML = data.title;

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

        // Show approve and reject buttons if the user is an admin
        url = backendURL() + '/api/users/profile';

        
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });

        if (response.ok) {
            const data2 = await response.json();

            if (data2.user && data2.user.role !== 'applicant') {
                statusElement.innerHTML = data.status;
            }

            if (data2.user && data2.user.role === 'admin') {
                // show buttons
                actionsElement.innerHTML = `<hr />
                <section>
                    <button id="approve-btn" class="coloured-btn">Approve</button>
                    <button id="reject-btn" class="transparent-btn">Reject</button>
                </section>`;

                const approveButton = document.getElementById('approve-btn');
                const rejectButton = document.getElementById('reject-btn');
                addAdminButtonsListeners(approveButton, rejectButton);
            }

            if (data2.user && data2.user.role === 'provider') {
                if (data.creator === data2.user._id && data.status === 'Rejected') {
                    actionsElement.innerHTML = `<hr />
                    <section>
                        <button id="resubmit-btn" class="coloured-btn">Re-submit</button>
                        <button id="delete-btn" class="transparent-btn">Delete</button>
                        <button class="transparent-btn" onclick="history.back()">Back</button>
                    </section>`;
                    const resubmitButton = document.getElementById('resubmit-btn');
                    addOwnerButtonsListeners(resubmitButton);
                } else {
                    actionsElement.innerHTML = `<hr />
                    <section>
                        <button class="coloured-btn" onclick="window.location.href='/opportunities/mine.html'">View My Opportunities</button>
                        <button class="transparent-btn" onclick="history.back()">Back</button>
                    </section>`;
                }
            }

            if (data2.user && data2.user.role === 'applicant') {
                actionsElement.innerHTML = `<hr />
                <section>
                    <button id="apply-opportunity-btn" class="coloured-btn">Apply</button>
                    <button id="back-btn" class="transparent-btn" onclick="history.back()">Back</button>
                </section>`;

                document.getElementById('apply-opportunity-btn').addEventListener('click', async () => {
                    try {
                        if (!confirm('Are you sure you want to apply for this opportunity?')) return;

                        const applyUrl = backendURL() + '/applications';
                        const applyResponse = await fetch(applyUrl, {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${getToken()}` },
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ opportunityId: id }),
                        });

                        const applyData = await applyResponse.json();

                        if (applyResponse.ok) {
                            document.getElementById('apply-opportunity-btn').disabled = true;
                            document.getElementById('apply-opportunity-btn').style.cursor = 'not-allowed';
                            alert('Application submitted successfully!');
                        } else {
                            alert(applyData.error || 'Failed to apply. Please try again.');
                        }
                    } catch (error) {
                        alert('Something went wrong! Please try again later');
                    }
                });
            }
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

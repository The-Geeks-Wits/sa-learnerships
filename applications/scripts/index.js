const pageState = document.getElementById('page-state');
const applicationsList = document.getElementById('applications-list');
const pageTitle = document.getElementById('page-title');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        pageState.style.display = 'flex';
        pageState.innerHTML = '<p>Loading...</p>';

        const queryString = window.location.search;
        const params = new URLSearchParams(queryString);
        const id = params.get('id');

        if (!id) {
            pageState.innerHTML = '<p>Opportunity id is required!</p>';
            return;
        }

        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:3000/applications/' + id + '/applications', {
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

            if (data.applications.length === 0) {
                pageState.style.display = 'flex';
                pageState.innerHTML = '<p>No applications found for this opportunity</p>';
                return;
            }

            data.applications.forEach((application) => {
                applicationsList.innerHTML += `
                    <li>
                        <section class="application-card">
                            <p><strong>Name:</strong> ${application.applicant.firstName} ${application.applicant.lastName}</p>
                            <p><strong>Email:</strong> ${application.applicant.email}</p>
                            <p><strong>Status:</strong> ${application.status}</p>
                            <p><strong>Applied:</strong> ${application.createdAt.slice(0, 10)}</p>
                        </section>
                    </li>`;
            });
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

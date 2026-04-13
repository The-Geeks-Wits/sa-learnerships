const pageState = document.getElementById('page-state');
const pageError = document.getElementById('page-error');
const pageContainer = document.getElementById('page-container');
const opportunities = document.getElementById('opportunities');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        pageState.style.display = 'flex';
        pageState.innerHTML = '<p>Loading...</p>';
        const response = await fetch('http://localhost:3000/opportunities?status=Rejected', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            const data = await response.json();

            pageContainer.style.display = 'block';

            if (data.opportunities.length == 0) {
                opportunities.innerHTML = '<p class="no-data">No rejected opportunities</p>';
                return;
            }

            data.opportunities.forEach(({ title, location, closingDate }) => {
                opportunities.innerHTML += `<li>
                    <h3>${title}</h3>   
                    <section class="opportunity-details">
                        <section>
                            <p><b>Location:</b> ${location || 'Not provided'}<p>
                            <p><b>Closes:</b> ${closingDate.slice(0, 10)}</p>   
                        </section>
                        <button class="transparent-btn">Delete</button>
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

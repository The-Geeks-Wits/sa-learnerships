import { backendURL } from '../../env.config.js';

const form = document.getElementById('create-opportunity-form');
const title = document.getElementById('title');
const description = document.getElementById('description');
const requirements = document.getElementById('requirements');
const allRequirements = document.getElementsByClassName('requirement');
const stipend = document.getElementById('stipend');
const duration = document.getElementById('duration');
const locationElement = document.getElementById('location');
const closingDate = document.getElementById('closing-date');
const errorMessage = document.getElementById('error-message');
const submitBtn = document.getElementById('submit-btn');
const addRequirementsBtn = document.getElementById('add-requirement-btn');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!title.value) {
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = 'Title required! Please provide the title of the opportunity';
        return;
    }

    if (!closingDate.value) {
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = 'Closing date required! Please provide the closing date of the opportunity';
        return;
    }

    if (allRequirements.length == 0) {
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = 'At least one requirement is required';
        return;
    }

    errorMessage.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Loading...';

    const reqList = [];

    for (let i = 0; i < allRequirements.length; i++) {
        reqList.push(allRequirements[i].value);
    }

    try {
        const url = backendURL() + '/opportunities';

    
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title.value,
                closingDate: closingDate.value,
                description: description.value,
                requirements: reqList,
                duration: duration.value,
                stipend: stipend.value,
                location: locationElement.value,
            }),
        });

        if (response.status === 201) {
            const data = await response.json();
            window.location.href = `/opportunities/view.html?id=${data.id}`;
        }
    } catch (error) {
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = 'An error occurred! Please try again later';
        console.error('Create opportunity error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit for review';
    }
});

addRequirementsBtn.addEventListener('click', () => {
    requirements.insertAdjacentHTML('beforeend', '<li><input type="text" class="requirement" /></li>');
});

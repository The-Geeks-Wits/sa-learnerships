import { backendURL } from '../../env.config.js';

const form = document.getElementById('edit-opportunity-form');
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

const id = new URLSearchParams(window.location.search).get('id');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(backendURL() + '/opportunities/' + id, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (response.ok) {
            title.value = data.title;
            description.value = data.description || '';
            stipend.value = data.stipend || '';
            duration.value = data.duration || '';
            locationElement.value = data.location || '';
            closingDate.value = data.closingDate.slice(0, 10);

            data.requirements.forEach((requirement) => {
                requirements.innerHTML += `<li><input type="text" class="requirement" value="${requirement}" /></li>`;
            });
        }
    } catch (error) {
        console.log(error);
    }
});

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

    if (allRequirements.length === 0) {
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
        const token = localStorage.getItem('token');

        const response = await fetch(backendURL() + '/opportunities/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            credentials: 'include',
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

        if (response.ok) {
            window.location.href = '/opportunities/view.html?id=' + id;
        } else {
            const data = await response.json();
            errorMessage.style.display = 'block';
            errorMessage.innerHTML = data.error;
        }
    } catch (error) {
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = 'An error occurred! Please try again later';
        console.log(error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Resubmit for review';
    }
});

addRequirementsBtn.addEventListener('click', () => {
    requirements.insertAdjacentHTML('beforeend', '<li><input type="text" class="requirement" /></li>');
});
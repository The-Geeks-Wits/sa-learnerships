import { backendURL } from '../../env.config.js';

const visibleDetails = document.getElementById('visible-profile-details');
const personalTab = document.getElementById('personal-tab');
const educationTab = document.getElementById('education-tab');
const skillsTab = document.getElementById('skills-tab');
const pageError = document.getElementById('page-error');
const pageState = document.getElementById('page-state');

// Adds an event listener to the save profile button under the personal tab
const addPersonalDetailsSubmitListener = (formElement, user) => {
    formElement.addEventListener('submit', async (event) => {
        // Get all the input fields elements. The elements are available only after the method to show personal details has been called
        // Hence we cannot get them from outside
        const firstNameElement = document.getElementById('firstName');
        const lastNameElement = document.getElementById('lastName');
        const emailElement = document.getElementById('email');
        const locationElement = document.getElementById('location');
        const phoneElement = document.getElementById('phone');
        const dobElement = document.getElementById('dob');
        const genderElement = document.getElementById('gender');
        const saveBtn = document.getElementById('save-profile-btn');
        const errorElement = document.getElementById('error-message');

        try {
            event.preventDefault();

            const url = backendURL() + '/api/users/profile';

            const token = localStorage.getItem('jwt');
            if (!token) return (window.location.href = '../../login.html');

            // Build the request body
            const requestBody = {};

            if (firstNameElement.value !== '' && firstNameElement.value !== user.firstName) {
                requestBody.firstName = firstNameElement.value;
            }

            if (lastNameElement.value && lastNameElement.value !== user.lastName) {
                requestBody.lastName = lastNameElement.value;
            }

            if (emailElement.value && emailElement.value !== user.email) {
                requestBody.email = emailElement.value;
            }

            if (dobElement.value && dobElement.value !== user.dateOfBirth) {
                requestBody.dateOfBirth = dobElement.value;
            }

            if (genderElement.value && genderElement.value !== user.genger) {
                requestBody.gender = genderElement.value;
            }

            if (locationElement.value && locationElement.value !== user.location) {
                requestBody.location = locationElement.value;
            }

            if (phoneElement.value && phoneElement.value !== user.phone) {
                requestBody.phone = phoneElement.value;
            }

            saveBtn.textContent = 'Loading...';
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();
            if (response.ok) {
                // Since we are updating by category, we can easily alert information about the specific category
                alert('Personal details updated successfully!');
            } else {
                errorElement.innerHTML = data.error;
            }
        } catch (err) {
            errorElement.innerHTML = 'Something went wrong! Please try again later';
        } finally {
            saveBtn.textContent = 'Save profile';
        }
    });
};

// Adds an event listener to the save profile button under the education tab
const addEducationSubmitListener = (formElement, user) => {
    formElement.addEventListener('submit', async (event) => {
        // Get all the input fields elements. The elements are available only after the method to show education details has been called
        // Hence we cannot get them from outside
        const qualificationNameElement = document.getElementById('qualification-name');
        const institutionElement = document.getElementById('institution');
        const saveBtn = document.getElementById('save-profile-btn');
        const errorElement = document.getElementById('error-message');

        try {
            event.preventDefault();

            const url = backendURL() + '/api/users/profile';

            const token = localStorage.getItem('jwt');
            if (!token) return (window.location.href = '../../login.html');

            if (qualificationNameElement.value && institutionElement.value) {
                const qualification = {
                    qualificationName: qualificationNameElement.value,
                    institution: institutionElement.value,
                };
                user.qualifications.push(qualification);
                const response = await fetch(url, {
                    method: 'PATCH',
                    headers: {
                        Authorization: token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ qualifications: user.qualifications }),
                });

                const data = await response.json();
                if (response.ok) {
                    // Since we are updating by category, we can easily alert information about the specific category
                    alert('Education details updated successfully!');
                } else {
                    errorElement.innerHTML = data.error;
                }
            }
        } catch (err) {
            errorElement.innerHTML = 'Something went wrong! Please try again later';
        } finally {
            saveBtn.textContent = 'Save profile';
        }
    });
};

// Adds an event listener to the save profile button under the skills tab
const addSkillSubmitListener = (formElement, user) => {
    formElement.addEventListener('submit', async (event) => {
        // Get all the input fields elements. The elements are available only after the method to show education details has been called
        // Hence we cannot get them from outside
        const skillElement = document.getElementById('skill');
        const saveBtn = document.getElementById('save-profile-btn');
        const errorElement = document.getElementById('error-message');

        try {
            event.preventDefault();

            const url = backendURL() + '/api/users/profile';

            const token = localStorage.getItem('jwt');
            if (!token) return (window.location.href = '../../login.html');

            if (skillElement.value) {
                user.skills.push(skillElement.value);

                const response = await fetch(url, {
                    method: 'PATCH',
                    headers: {
                        Authorization: token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ skills: user.skills }),
                });

                const data = await response.json();
                if (response.ok) {
                    // Since we are updating by category, we can easily alert information about the specific category
                    alert('Skills details updated successfully!');
                } else {
                    errorElement.innerHTML = data.error;
                }
            }
        } catch (err) {
            errorElement.innerHTML = 'Something went wrong! Please try again later';
        } finally {
            saveBtn.textContent = 'Save profile';
        }
    });
};

// Renders personal details when the user clicks the personal tab
const showPersonalDetails = (user) => {
    personalTab.classList.add('visible');
    educationTab.classList.remove('visible');
    skillsTab.classList.remove('visible');

    if (user.dateOfBirth) user.dateOfBirth = user.dateOfBirth.slice(0, 10);

    visibleDetails.innerHTML = `<form id="personal-details-form">
        <section class="input-group">
            <label for="firstName">First Name</label>
            <section class="input-wrapper">
                <input type="text"  id="firstName" name="firstName" value="${user.firstName}"/>
            </section>
        </section>
        <section class="input-group">
            <label for="lastName">Last Name</label>
            <section class="input-wrapper">
                <input type="text" id="lastName" name="lastName" value="${user.lastName}" />
            </section>
        </section>
        <section class="input-group">
            <label for="email">Email</label>
            <section class="input-wrapper">
                <input type="email" id="email" name="email" value="${user.email}" />
            </section>
        </section>
        <section class="input-group">
            <label for="gender">Gender</label>
            <select id="gender" name="gender">
                <option value="">Select gender</option>
                <option value="female" ${user.gender === 'female' ? 'selected' : ''}>Female</option>
                <option value="male" ${user.gender === 'male' ? 'selected' : ''}>Male</option>
                <option value="prefer not to say" ${user.gender === 'prefer not to say' ? 'selected' : ''}>Prefer not to say</option>
            </select>
        </section>
        <section class="input-group">
            <label for="dob">Date of Birth</label>
            <input type="date" id="dob" name="dob" value="${user.dateOfBirth || ''}" />
        </section>
        <section class="input-group">
            <label for="location">Location</label>
            <section class="input-wrapper">
                <input type="text" id="location" name="location" value="${user.location || ''}" />
            </section>
        </section>
        <section class="input-group">
            <label for="phone">Phone</label>
            <section class="input-wrapper">
                <input type="text" id="phone" name="phone" value="${user.phone || ''}" />
            </section>
        </section>
        <p id="error-message"></p>
        <button id="save-profile-btn" class="coloured-btn">Save profile</button>
    </form>`;

    const form = document.getElementById('personal-details-form');
    addPersonalDetailsSubmitListener(form, user);
};
// Renders education details when the user clicks the education tab
const showEducationDetails = (user) => {
    personalTab.classList.remove('visible');
    educationTab.classList.add('visible');
    skillsTab.classList.remove('visible');

    visibleDetails.innerHTML = `<form id="education-form">
        <section class="input-group">
            <label for="qualification-name">Qualification Name</label>
            <input type="text" id="qualification-name" name="qualification-name" placeholder="Please enter your qualification name" />
        </section>
        <section class="input-group">
            <label for="institution">Institution</label>
            <input type="text" id="institution" name="institution" placeholder="Please enter your institution name" />
        </section>
        <p id="error-message"></p>
        <button id="add-education-btn" class="coloured-btn">Add education</button>
    </form>`;

    const form = document.getElementById('education-form');
    addEducationSubmitListener(form, user);
};

// Renders skills details when the user clicks the skills tab
const showSkillsDetails = (user) => {
    personalTab.classList.remove('visible');
    educationTab.classList.remove('visible');
    skillsTab.classList.add('visible');

    visibleDetails.innerHTML = `<form id="skill-form">
        <section class="input-group">
            <label for="skill">Skill</label>
            <input type="text" id="skill" name="skill" placeholder="Please enter your skill name" />
        </section>
        <p id="error-message"></p>
        <button id="add-skill-btn" class="coloured-btn">Add skill</button>
    </form>`;

    const form = document.getElementById('skill-form');
    addSkillSubmitListener(form, user);
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const url = backendURL() + '/api/users/profile';

        const token = localStorage.getItem('jwt');
        if (!token) return (window.location.href = '/login.html');

        pageState.style.display = 'flex';
        pageState.innerHTML = 'Loading...';

        const response = await fetch(url, {
            method: 'GET',
            headers: { Authorization: token },
        });

        const data = await response.json();
        if (response.ok) {
            personalTab.addEventListener('click', () => showPersonalDetails(data.user));
            educationTab.addEventListener('click', () => showEducationDetails(data.user));
            skillsTab.addEventListener('click', () => showSkillsDetails(data.user));

            // Start with personal details
            showPersonalDetails(data.user);
        } else {
            pageError.style.display = 'flex';
            pageError.innerHTML = `<p>${data.error}</p>`;
        }
    } catch (err) {
        pageError.style.display = 'flex';
        pageError.innerHTML = 'Something went wrong! Please try again later';
    } finally {
        pageState.style.display = 'none';
        pageState.innerHTML = '';
    }
});

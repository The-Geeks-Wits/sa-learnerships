import { backendURL } from '../../env.config.js';

const personalDetails = document.getElementById('personal-details');
const visibleDetails = document.getElementById('visible-profile-details');
const personalTab = document.getElementById('personal-tab');
const educationTab = document.getElementById('education-tab');
const skillsTab = document.getElementById('skills-tab');

const getPersonalDetailsElement = (user) => {
    const element = `
        <section id="profile-img">
            <p>${user.firstName[0].toUpperCase()}</p>
        </section>
        <section id="profile-main-details">
            <section id="name-email-details">
                <section>
                    <p id="full-name">${user.firstName} ${user.lastName}</p>
                    <p id="email">${user.email}</p>
                </section>
                <button class="coloured-btn">Edit profile</button>
            </section>
            <section id="user-role">
                <img src="../../assets/user.svg" />
                <p>${user.role}</p>
            </section>
        </section>`;
    return element;
};

const showPersonalDetails = (user) => {
    personalTab.classList.add('visible');
    educationTab.classList.remove('visible');
    skillsTab.classList.remove('visible');
    console.log(user);

    visibleDetails.innerHTML = `<ul id="visible-details">
        <li>
            <h4>Location</h4>
            <p>${user.location || 'Not provided'}</p>
        </li>
        <li>
            <h4>Phone</h4>
            <p>${user.phone || 'Not provided'}</p>
        </li>
    </ul>`;
};

const showEducationDetails = (user) => {
    personalTab.classList.remove('visible');
    educationTab.classList.add('visible');
    skillsTab.classList.remove('visible');

    visibleDetails.innerHTML = '';
};

const showSkillsDetails = (user) => {
    personalTab.classList.remove('visible');
    educationTab.classList.remove('visible');
    skillsTab.classList.add('visible');

    visibleDetails.innerHTML = '';
};

document.addEventListener('DOMContentLoaded', async () => {
    const url = backendURL() + '/api/users/profile';

    const token = localStorage.getItem('jwt');
    if (!token) return (window.location.href = '/login.html');

    const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: token },
    });

    if (response.ok) {
        const data = await response.json();

        personalDetails.innerHTML += getPersonalDetailsElement(data.user);

        personalTab.addEventListener('click', () => showPersonalDetails(data.user));
        educationTab.addEventListener('click', () => showEducationDetails(data.user));
        skillsTab.addEventListener('click', () => showSkillsDetails(data.user));

        // Start with personal details
        showPersonalDetails(data.user);
    }
});

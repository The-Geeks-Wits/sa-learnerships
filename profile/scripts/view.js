import { backendURL } from '../../env.config.js';

const personalDetails = document.getElementById('personal-details');
const visibleDetails = document.getElementById('visible-profile-details');
const personalTab = document.getElementById('personal-tab');
const educationTab = document.getElementById('education-tab');
const skillsTab = document.getElementById('skills-tab');

const setPersonalDetails = (user) => {
    personalDetails.innerHTML += `
    <section id="profile-img">
        <p>${user.firstName[0].toUpperCase()}</p>
    </section>
    <section id="profile-main-details">
        <section id="name-email-details">
            <section>
                <p id="full-name">${user.firstName} ${user.lastName}</p>
                <p id="email">${user.email}</p>
            </section>
            <button id="edit-profile" class="coloured-btn">Edit profile</button>
        </section>
        <section id="user-role">
            <img src="../../assets/user.svg" />
            <p>${user.role}</p>
        </section>
    </section>`;

    const editProfileBtn = document.getElementById('edit-profile');
    editProfileBtn.addEventListener('click', () => {
        window.location.href = 'edit.html';
    });
};

const showPersonalDetails = (user) => {
    personalTab.classList.add('visible');
    educationTab.classList.remove('visible');
    skillsTab.classList.remove('visible');

    if (user.dateOfBirth) user.dateOfBirth = user.dateOfBirth.slice(0, 10);

    visibleDetails.innerHTML = `<ul class="visible-details">
        <li>
            <h4>Date Of Birth</h4>
            <p>${user.dateOfBirth || 'Not provided'}</p>
        </li>
        <li>
            <h4>Gender</h4>
            <p>${user.gender || 'Not provided'}</p>
        </li>
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

    const qualifications = user.qualifications || [];
    if (qualifications.length === 0) {
        visibleDetails.innerHTML = `<ul class="visible-details">
            <li><p>Not provided</p></li>
        </ul>`;
        return;
    }

    let qualificationsElement = '';
    for (let i = 0; i < qualifications.length; i++) {
        qualificationsElement += `<li class="card">
            <h4>${qualifications[i].qualificationName}</h4>
            <p>${qualifications[i].institution}</p>
        </li>`;
    }

    visibleDetails.innerHTML = `<ul id="education-visible-details" class="visible-details">
        ${qualificationsElement}
    </ul>`;
};

const showSkillsDetails = (user) => {
    personalTab.classList.remove('visible');
    educationTab.classList.remove('visible');
    skillsTab.classList.add('visible');

    const skills = user.skills || [];

    if (skills.length === 0) {
        visibleDetails.innerHTML = `<ul class="visible-details">
            <li><p>Not provided</p></li>
        </ul>`;
        return;
    }

    let skillsElement = '';
    for (let i = 0; i < skills.length; i++) {
        skillsElement += `<li><p>${skills[i]}</p></li>`;
    }

    visibleDetails.innerHTML = `<ul class="visible-details">
        ${skillsElement}
    </ul>`;
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

        setPersonalDetails(data.user);

        personalTab.addEventListener('click', () => showPersonalDetails(data.user));
        educationTab.addEventListener('click', () => showEducationDetails(data.user));
        skillsTab.addEventListener('click', () => showSkillsDetails(data.user));

        // Start with personal details
        showPersonalDetails(data.user);
    }
});

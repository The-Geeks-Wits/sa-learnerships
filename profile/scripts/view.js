import { backendURL } from '../../env.config.js';

const personalDetails = document.getElementById('personal-details');
const visibleDetails = document.getElementById('visible-profile-details');
const personalTab = document.getElementById('personal-tab');
const educationTab = document.getElementById('education-tab');
const skillsTab = document.getElementById('skills-tab');
const attachmentsTab = document.getElementById('attachments-tab');
const pageError = document.getElementById('page-error');
const pageState = document.getElementById('page-state');

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

// Renders personal details when the user clicks the skills tab
const showPersonalDetails = (user) => {
    personalTab.classList.add('visible');
    educationTab.classList.remove('visible');
    skillsTab.classList.remove('visible');
    attachmentsTab.classList.remove('visible');

    if (user.dateOfBirth) user.dateOfBirth = user.dateOfBirth.slice(0, 10);

    visibleDetails.innerHTML = `<ul class="visible-details personal-details">
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

// Renders education details when the user clicks the education tab
const showEducationDetails = (user) => {
    personalTab.classList.remove('visible');
    educationTab.classList.add('visible');
    skillsTab.classList.remove('visible');
    attachmentsTab.classList.remove('visible');

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

// Renders skills details when the user clicks the skills tab
const showSkillsDetails = (user) => {
    personalTab.classList.remove('visible');
    educationTab.classList.remove('visible');
    skillsTab.classList.add('visible');
    attachmentsTab.classList.remove('visible');

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

// Renders attachments when the user clicks the attachments tab
const showAttachments = (user) => {
    personalTab.classList.remove('visible');
    educationTab.classList.remove('visible');
    skillsTab.classList.remove('visible');
    attachmentsTab.classList.add('visible');

    const attachments = user.attachments || [];

    let attachmentsElement = '';
    if (attachments.length === 0) {
        visibleDetails.innerHTML = `<ul class="visible-details">
            <li><p>No attachments found</p></li>
            <li><button class="coloured-btn">Add</button></li>
        </ul>`;
        return;
    }

    visibleDetails.innerHTML = `<ul class="visible-details">
        ${attachmentsElement}
    </ul>`;
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
            setPersonalDetails(data.user);

            personalTab.addEventListener('click', () => showPersonalDetails(data.user));
            educationTab.addEventListener('click', () => showEducationDetails(data.user));
            skillsTab.addEventListener('click', () => showSkillsDetails(data.user));
            attachmentsTab.addEventListener('click', () => showAttachments(data.user));

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

import { backendURL, getToken } from '../../env.config.js';

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

    document.getElementById('edit-profile').addEventListener('click', () => {
        window.location.href = 'edit.html';
    });
};

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

const showEducationDetails = (user) => {
    personalTab.classList.remove('visible');
    educationTab.classList.add('visible');
    skillsTab.classList.remove('visible');
    attachmentsTab.classList.remove('visible');

    const qualifications = user.qualifications || [];

    if (qualifications.length === 0) {
        visibleDetails.innerHTML = `<p>No qualifications added yet. Click "Edit profile" to add your qualifications.</p>`;
        return;
    }

    let cardsHtml = '';
    for (let i = 0; i < qualifications.length; i++) {
        const q = qualifications[i];
        cardsHtml += `
        <li>
            <section class="qualification-card">
                <h4>${q.qualificationName || 'N/A'}</h4>
                <ul class="qualification-fields">
                    <li><p><strong>Level:</strong> ${q.qualificationLevel || 'N/A'}</p></li>
                    <li><p><strong>NQF:</strong> ${q.nqfLevel ?? 'N/A'}</p></li>
                    <li><p><strong>Institution:</strong> ${q.institution || 'N/A'}</p></li>
                </ul>
            </section>
        </li>`;
    }

    visibleDetails.innerHTML = `<ul id="education-visible-details" class="visible-details">${cardsHtml}</ul>`;
};

const showSkillsDetails = async (user) => {
    personalTab.classList.remove('visible');
    educationTab.classList.remove('visible');
    skillsTab.classList.add('visible');
    attachmentsTab.classList.remove('visible');

    const skills = user.skills || [];

    if (skills.length === 0) {
        visibleDetails.innerHTML = `<p>No skills added yet. Click "Edit profile" to add your skills.</p>`;
        return;
    }

    try {
        const response = await fetch(backendURL() + '/api/users/data/skills');
        const skillCategories = await response.json();

        const skillCategoryMap = {};
        for (const [category, skillList] of Object.entries(skillCategories)) {
            skillList.forEach(skill => {
                skillCategoryMap[skill.toLowerCase().trim()] = category;
            });
        }

        let cardsHtml = '';
        for (let i = 0; i < skills.length; i++) {
            const skill = skills[i].trim();
            const category = skillCategoryMap[skill.toLowerCase()] || 'General';
            cardsHtml += `
            <li>
                <section class="qualification-card">
                    <h4>${skill}</h4>
                    <ul class="qualification-fields">
                        <li><p><strong>Category:</strong> ${category}</p></li>
                    </ul>
                </section>
            </li>`;
        }

        visibleDetails.innerHTML = `<ul id="education-visible-details" class="visible-details">${cardsHtml}</ul>`;
    } catch {
        let cardsHtml = '';
        for (let i = 0; i < skills.length; i++) {
            cardsHtml += `<li><p>${skills[i]}</p></li>`;
        }
        visibleDetails.innerHTML = `<ul class="visible-details">${cardsHtml}</ul>`;
    }
};

const showAttachments = (user) => {
    personalTab.classList.remove('visible');
    educationTab.classList.remove('visible');
    skillsTab.classList.remove('visible');
    attachmentsTab.classList.add('visible');

    const cvUrl = user.cv ? backendURL() + user.cv : null;

    visibleDetails.innerHTML = `<section id="cv-section">
        <h3>Curriculum Vitae (CV)</h3>
        ${cvUrl
            ? `<p>CV uploaded. <a href="${cvUrl}" target="_blank">View CV</a></p>`
            : `<p>No CV uploaded yet. Click "Edit profile" to upload your CV.</p>`
        }
    </section>`;
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        pageState.style.display = 'flex';
        pageState.innerHTML = 'Loading...';

        const response = await fetch(backendURL() + '/api/users/profile', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });

        const data = await response.json();
        if (response.ok) {
            setPersonalDetails(data.user);

            personalTab.addEventListener('click', () => showPersonalDetails(data.user));
            educationTab.addEventListener('click', () => showEducationDetails(data.user));
            skillsTab.addEventListener('click', () => showSkillsDetails(data.user));
            attachmentsTab.addEventListener('click', () => showAttachments(data.user));

            showPersonalDetails(data.user);
        } else {
            pageError.style.display = 'flex';
            pageError.innerHTML = `<p>${data.error}</p>`;
        }
    } catch {
        pageError.style.display = 'flex';
        pageError.innerHTML = 'Something went wrong! Please try again later';
    } finally {
        pageState.style.display = 'none';
        pageState.innerHTML = '';
    }
});
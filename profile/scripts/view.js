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

// Renders personal details
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

// Clean, properly stacked education cards update for professionalism
const showEducationDetails = (user) => {
    personalTab.classList.remove('visible');
    educationTab.classList.add('visible');
    skillsTab.classList.remove('visible');
    attachmentsTab.classList.remove('visible');

    const qualifications = user.qualifications || [];

    let contentHtml = '';
    if (qualifications.length === 0) {
        contentHtml = `<p style="color:#666; font-size:0.95rem;">No qualifications added yet. Click “Edit profile” to add your qualifications.</p>`;
    } else {
        // Welcome header
        contentHtml = `<header style="margin-bottom: 16px;">
            <h3 style="margin:0 0 4px 0; font-size:1.15rem; font-weight:600; color:#1a202c;">
                Your Qualifications
            </h3>
            <p style="margin:0; font-size:0.9rem; color:#666;">
                These are your registered qualifications aligned with the South African NQF framework.
            </p>
        </header>`;

        let cardsHtml = '';
        for (let i = 0; i < qualifications.length; i++) {
            const q = qualifications[i];
            cardsHtml += `
            <li style="
                list-style: none;
                background: #ffffff;
                border-radius: 8px;
                padding: 16px 20px;
                margin-bottom: 12px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.06);
                font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
            ">
                <header style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                    <h4 style="margin:0; font-size:1.1rem; font-weight:600; color:#1a202c;">
                        ${q.qualificationName || 'N/A'}
                    </h4>
                    <small style="
                        background: #ebf4ff;
                        color: #2b6cb0;
                        padding: 4px 10px;
                        border-radius: 20px;
                        font-size: 0.8rem;
                        font-weight: 600;
                    ">NQF ${q.nqfLevel ?? 'N/A'}</small>
                </header>
                <section style="color: #4a5568; font-size: 0.92rem; line-height: 1.5;">
                    <p style="margin: 0 0 4px 0;">
                        <strong>Qualification Level:</strong> ${q.qualificationLevel || 'N/A'}
                    </p>
                    <p style="margin: 0;">
                        <strong>Institution:</strong> ${q.institution || 'N/A'}
                    </p>
                </section>
            </li>`;
        }
        contentHtml += `<ul style="padding:0; margin:0;">${cardsHtml}</ul>`;
    }

    visibleDetails.innerHTML = `${contentHtml}`;
};


const showSkillsDetails = async (user) => {
    personalTab.classList.remove('visible');
    educationTab.classList.remove('visible');
    skillsTab.classList.add('visible');
    attachmentsTab.classList.remove('visible');

    const skills = user.skills || [];

    if (skills.length === 0) {
        visibleDetails.innerHTML = `<p style="color:#666; font-size:0.95rem;">No skills added yet. Click “Edit profile” to add your skills.</p>`;
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

        let contentHtml = `<header style="margin-bottom: 16px;">
            <h3 style="margin:0 0 4px 0; font-size:1.15rem; font-weight:600; color:#1a202c;">
                Your Skills
            </h3>
            <p style="margin:0; font-size:0.9rem; color:#666;">
                These are your standardised skills recognised across South African industries.
            </p>
        </header>`;

        let cardsHtml = '';
        for (let i = 0; i < skills.length; i++) {
            const skill = skills[i].trim();
            const skillLower = skill.toLowerCase();
            const category = skillCategoryMap[skillLower] || 'General';

            cardsHtml += `
            <li style="
                list-style: none;
                background: #ffffff;
                border-radius: 8px;
                padding: 16px 20px;
                margin-bottom: 12px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.06);
                font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
                display: flex;
                align-items: center;
                justify-content: space-between;
            ">
                <section>
                    <h4 style="margin:0 0 4px 0; font-size:1.1rem; font-weight:600; color:#1a202c;">
                        ${skill}
                    </h4>
                    <p style="margin:0; font-size:0.92rem; color:#4a5568;">
                        <strong>Category:</strong> ${category}
                    </p>
                </section>
            </li>`;
        }
        contentHtml += `<ul style="padding:0; margin:0;">${cardsHtml}</ul>`;
        visibleDetails.innerHTML = `${contentHtml}`;   // no wrapping div
    } catch (err) {
        let skillsElement = '';
        for (let i = 0; i < skills.length; i++) {
            skillsElement += `<li>${skills[i]}</li>`;
        }
        visibleDetails.innerHTML = `<ul class="visible-details">${skillsElement}</ul>`;
    }
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
        

        pageState.style.display = 'flex';
        pageState.innerHTML = 'Loading...';

        const response = await fetch(url, {
            method: 'GET',
            credentials:'include'
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
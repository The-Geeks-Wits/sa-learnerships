// This file is for preparing and showing elements conditionally based on the users role
// where all this is common such as in the side bar

import { backendURL } from '../env.config.js';

const opportunitiesNav = document.getElementById('opportunities-nav');
const opportunitiesNavOptions = document.getElementById('opportunities-nav-options');
const opportunitiesNavImage = document.getElementById('opportunities-nav-image');
const sidebarOptions = document.getElementById('sidebar-options');
const profileElement = document.getElementById('profile-details');
const appName = document.getElementById('app-name');

// optionsElement -> The element that has the list of all the options
// imageElement -> The element used to change the toggle image
const toggleOptions = (optionsElement, imageElement) => {
    const optionsDisplay = window.getComputedStyle(optionsElement).display;
    if (optionsDisplay === 'none') {
        imageElement.src = '../assets/down-arrow.png';
        optionsElement.style.display = 'block';
    } else {
        imageElement.src = '../assets/right-arrow.png';
        optionsElement.style.display = 'none';
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load the opportunities options on the sidebar based on the role of the user
        const applicantOptions = `<ul>
            <li id="all-opportunities-tab"><a href="/opportunities/index.html">All Opportunities</a></li>
            <li id="analytics-tab"><a href="/opportunities/analytics.html">Analytics</a></li>
        </ul>`;

        const providerOptions = `<ul>
            <li id="your-opportunities-tab"><a href="/opportunities/mine.html">Your Opportunities</a></li>
            <li id="all-opportunities-tab"><a href="/opportunities/index.html">All Opportunities</a></li>
            <li id="create-opportunity-tab"><a href="/opportunities/create.html">Create</a></li>
            <li id="analytics-tab"><a href="/opportunities/analytics.html">Analytics</a></li>
        </ul>`;

        const adminOptions = `<ul>
            <li id="your-opportunities-tab"><a href="/opportunities/mine.html">Your Opportunities</a></li>
            <li id="all-opportunities-tab"><a href="/opportunities/index.html">All Opportunities</a></li>
            <li id="pending-opportunities-tab"><a href="/opportunities/pending.html">Pending</a></li>
            <li id="rejected-opportunities-tab"><a href="/opportunities/rejected.html">Rejected</a></li>
            <li id="create-opportunity-tab"><a href="/opportunities/create.html">Create</a></li>
            <li id="analytics-tab"><a href="/opportunities/analytics.html">Analytics</a></li>
        </ul>`;

        // Get the user id
        const response = await fetch('http://localhost:3000/api/users/profile', {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();

        console.log('PROFILE RESPONSE:', response.status, data);

        if (!response.ok) {
            window.location.href = '/login.html';
            return;
        }

        const user = data.user;
        if (!user) {
            return;
        }

        const userRole = user.role;

        profileElement.innerHTML = `
        <section>
            <h4>${user.firstName} ${user.lastName}</h4>
            <p>${user.role}</p>
        </section>
        <a href="../profile/profile.html">
            <h3>${user.firstName[0].toUpperCase()}</h3>
        </a>
`;

        if (userRole === 'applicant') opportunitiesNavOptions.innerHTML = applicantOptions;
        else if (userRole === 'provider') opportunitiesNavOptions.innerHTML = providerOptions;
        else if (userRole === 'admin') {
            opportunitiesNavOptions.innerHTML = adminOptions;

            // Add a control center navigation option on the sidebar
            sidebarOptions.insertAdjacentHTML(
                'beforeend',
                `<li>
                <section id="control-center-nav" class="heading">
                    <p>Control Center</p>
                    <img id="control-center-nav-image" src="../assets/right-arrow.png" />
                </section>
                <section id="control-center-nav-options">
                    <ul>
                        <li id="user-management-tab"><a href="/control-center/users.html">User Management</a></li>
                    </ul>
                </section>
            </li>`,
            );

            // Add an event listeners of the control center items since they are added after the DOM content has been loaded
            const controlCenterNav = document.getElementById('control-center-nav');
            const controlCenterNavOptions = document.getElementById('control-center-nav-options');
            const controlCenterNavImage = document.getElementById('control-center-nav-image');

            controlCenterNav.addEventListener('click', () => {
                toggleOptions(controlCenterNavOptions, controlCenterNavImage);
            });

            // Since we can't set this directly on the users.js file
            if (window.location.pathname === '/control-center/users.html') {
                controlCenterNavImage.src = '../assets/down-arrow.png';
            }
        }
    } catch (error) {
        profileElement.innerHTML = `<section>
            <p>Couldn't load user details</p>
        </section>`;
        console.log(error);
    }
});

appName.addEventListener('click', () => {
    window.location.href = window.location.origin + './home.html';
});

opportunitiesNav.addEventListener('click', () => {
    toggleOptions(opportunitiesNavOptions, opportunitiesNavImage);
});

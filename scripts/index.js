// This file is for preparing and showing elements conditionally based on the users role
// where all this is common such as in the side bar

import { backendURL } from '../env.config.js';

const opportunitiesNav = document.getElementById('opportunities-nav');
const opportunitiesNavOptions = document.getElementById('opportunities-nav-options');
const opportunitiesNavImage = document.getElementById('opportunities-nav-image');
const settingsNav = document.getElementById('settings-nav');
const settingsNavOptions = document.getElementById('settings-nav-options');
const settingsNavImage = document.getElementById('settings-nav-image');
const applicationsNav = document.getElementById('applications-nav');
const applicationsNavOptions = document.getElementById('applications-nav-options');
const applicationsNavImage = document.getElementById('applications-nav-image');
const sidebarOptions = document.getElementById('sidebar-options');
const profileElement = document.getElementById('profile-details');
const appName = document.getElementById('app-name');
const applyBtn = document.getElementById('apply-btn');
const notificationsElement = document.getElementById('notifications');
const notificationCountElements = document.getElementsByClassName('notifications-count');

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

// Returns the correct opportunity options for the sidebar based on the user rolw
const getOpportunitiesOptions = (role) => {
    const applicantOptions = `<ul>
        <li id="all-opportunities-tab"><a href="/opportunities/index.html">All Opportunities</a></li>
    </ul>`;

    const providerOptions = `<ul>
        <li id="your-opportunities-tab"><a href="/opportunities/mine.html">Your Opportunities</a></li>
        <li id="create-opportunity-tab"><a href="/opportunities/create.html">Create</a></li>
    </ul>`;

    const adminOptions = `<ul>
        <li id="your-opportunities-tab"><a href="/opportunities/mine.html">Your Opportunities</a></li>
        <li id="all-opportunities-tab"><a href="/opportunities/index.html">All Opportunities</a></li>
        <li id="pending-opportunities-tab"><a href="/opportunities/pending.html">Pending</a></li>
        <li id="rejected-opportunities-tab"><a href="/opportunities/rejected.html">Rejected</a></li>
        <li id="create-opportunity-tab"><a href="/opportunities/create.html">Create</a></li>
    </ul>`;

    if (role === 'applicant') return applicantOptions;
    else if (role === 'provider') return providerOptions;
    else return adminOptions;
};

// Returns the correct applications options for the sidebar based on the user rolw
const getApplicationsOptions = (role) => {
    const applicantOptions = `<ul>
        <li id="all-applications-nav-tab"><a href="/applications/index.html">All Applications</a></li>
        <li id="pending-nav-tab"><a href="/applications/pending.html">Pending</a></li>
        <li id="shortlisted-nav-tab"><a href="/applications/shortlisted.html">Shortlisted</a></li>
        <li id="rejected-nav-tab"><a href="/applications/rejected.html">Rejected</a></li>
    </ul>`;

    const providerOptions = `<ul>
        <li id="all-applications-nav-tab"><a href="/applications/index.html">All Applications</a></li>
        <li id="pending-nav-tab"><a href="/applications/pending.html">Pending</a></li>
        <li id="shortlisted-nav-tab"><a href="/applications/shortlisted.html">Shortlisted</a></li>
        <li id="rejected-nav-tab"><a href="/applications/rejected.html">Rejected</a></li>
    </ul>`;

    // Admins should not see the applications tab on the sidebar
    if (role === 'applicant') return applicantOptions;
    else if (role === 'provider') return providerOptions;
    else return '';
};

// This is placed here to reduce the clutter in the document event listener
// Putting this here also allows us to set the notification count asynchronously
const showNotificationsCount = async () => {
    try {
        const url = backendURL() + '/notifications/mine';

        // By the time this method is called we can be sure that the existence of the jwt has been confirmed and the jwt does exist

        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();

        for (let i = 0; i < notificationCountElements.length; i++) {
            notificationCountElements[i].innerHTML = data.count;
        }
    } catch (error) {
        // TODO: Do something with this error here
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const url = backendURL() + '/api/users/profile';


        // The sooner we show them the better, since this will happen asynchronously
        showNotificationsCount();

        profileElement.innerHTML = `<section id="profile-state">
            <p>Loading...</p>
        </section>`;

        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include'
        });

        let userRole = 'applicant';
        if (response.ok) {
            const data = await response.json();
            const user = data.user;
            userRole = user.role;

            profileElement.innerHTML = `<section>
                <h4>${user.firstName} ${user.lastName}</h4>
                <p>${user.role}</p>
            </section><h3 id="profile-letter">${user.firstName[0].toUpperCase()}</h3>`;

            document.getElementById('profile-letter').addEventListener('click', () => {
                window.location.href = '../profile/view.html';
            });
        } else {
            profileElement.innerHTML = `<section>
                <p>Couldn't load user details</p>
            </section>`;
        }

        opportunitiesNavOptions.innerHTML = getOpportunitiesOptions(userRole);
        applicationsNavOptions.innerHTML = getApplicationsOptions(userRole);

        //added sidebar option for report
        if (userRole === 'admin' || userRole === 'provider') {
            sidebarOptions.insertAdjacentHTML(
                'beforeend',
                `<li>
                    <section id="reports-nav" class="heading">
                        <p>Reports</p>
                        <img id="reports-nav-image" src="../assets/right-arrow.png" />
                    </section>
                    <section id="reports-nav-options" class="sidebar-nav-options">
                        <ul>
                            <li id="custom-report-tab"><a href="/opportunities/custom.html">Custom View</a></li>
                            <li id="applications-volume-tab"><a href="/opportunities/application-volume.html">Application Volume</a></li>
                            <li id="placement-rate-tab"><a href="/opportunities/placement_form.html">Placement Success</a></li>
                            
                            
                        </ul>
                    </section>
                </li>`
            );

            const reportsNav = document.getElementById('reports-nav');
            const reportsNavOptions = document.getElementById('reports-nav-options');
            const reportsNavImage = document.getElementById('reports-nav-image');

            reportsNav.addEventListener('click', () => {
                toggleOptions(reportsNavOptions, reportsNavImage);
            });

            if (window.location.pathname.startsWith('/analytics/')) {
                reportsNavImage.src = '../assets/down-arrow.png';
                reportsNavOptions.style.display = 'block';
            }
        }

        
    } catch (error) {
        profileElement.innerHTML = `<section id="profile-error">
            <p>Couldn't load profile details</p>
        </section>`;
    }
});

appName.addEventListener('click', () => {
    window.location.href = '/home.html';
});

notificationsElement.addEventListener('click', () => {
    window.location.href = '/notifications/index.html';
});

applyBtn.addEventListener('click', () => {
    window.location.href = '/opportunities/index.html';
});

opportunitiesNav.addEventListener('click', () => {
    toggleOptions(opportunitiesNavOptions, opportunitiesNavImage);
});

settingsNav.addEventListener('click', () => {
    toggleOptions(settingsNavOptions, settingsNavImage);
});

applicationsNav.addEventListener('click', () => {
    toggleOptions(applicationsNavOptions, applicationsNavImage);
});

applyBtn.addEventListener('click', () => {});
import { backendURL, getToken, saveToken } from '../env.config.js';

// Catch token from Google OAuth redirect
const params = new URLSearchParams(window.location.search);
const token = params.get('token');
if (token) {
    saveToken(token);
    window.history.replaceState({}, document.title, window.location.pathname);
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const [opportunitiesRes, applicationsRes] = await Promise.all([
            fetch(backendURL() + '/opportunities?status=Approved', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${getToken()}` }
            }),
            fetch(backendURL() + '/applications', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${getToken()}` }
            }),
        ]);

        const opportunitiesData = await opportunitiesRes.json();
        const applicationsData = await applicationsRes.json();

        const totalOpportunities = opportunitiesData.opportunities?.length ?? 0;
        const applications = applicationsData.applications ?? [];
        const totalApplications = applications.length;
        const shortlisted = applications.filter(a => a.status === 'Shortlisted').length;
        const acceptanceRate = totalApplications > 0
            ? Math.round((shortlisted / totalApplications) * 100)
            : 0;

        document.querySelector('#insights li:nth-child(1) h4').textContent = totalOpportunities;
        document.querySelector('#insights li:nth-child(2) h4').textContent = `${acceptanceRate}%`;
        document.querySelector('#insights li:nth-child(3) h4').textContent = totalApplications;
        document.querySelector('#insights li:nth-child(3) p').textContent = 'Total Applications';

    } catch (err) {
        console.error('Failed to load home stats:', err);
    }
});
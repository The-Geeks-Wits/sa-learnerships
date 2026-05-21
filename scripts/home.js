import { backendURL } from '../env.config.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const [opportunitiesRes, applicationsRes] = await Promise.all([
            fetch(backendURL() + '/opportunities', { method: 'GET', credentials: 'include' }),
            fetch(backendURL() + '/applications', { method: 'GET', credentials: 'include' }),
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

        // Update labels to be accurate
        document.querySelector('#insights li:nth-child(3) p').textContent = 'Total Applications';

    } catch (err) {
        console.error('Failed to load home stats:', err);
    }
});
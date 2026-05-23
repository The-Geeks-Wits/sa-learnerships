import { backendURL, getToken } from '../../env.config.js';

let chartInstance = null;

document.addEventListener('DOMContentLoaded', async ()=>{
    await loadApplicationVolume();

    const exportButton = document.getElementById('export-csv');
    exportButton.addEventListener('click',exportCSV);

})

const loadApplicationVolume = async () => {
    try{
        const response = await fetch (`${backendURL()}/api/analytics/application-volume`,{
            method: 'GET',
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });

        const data = await response.json();

        if (!response.ok){
            showError(data.error || 'Could not load application volume report.');
            return;
        }

        displayResults(data.data);
    }catch(error){
        console.error('Error loading application volume:', error);
        showError('Something went wrong while loading the application volume report.');
    }
};

const displayResults = (data) => {
    const headerRow = document.getElementById('results-header');
    const tableBody = document.getElementById('results-body');

    headerRow.innerHTML = `
        <tr>
            <th> Opportunity </th>
            <th> Total Applications </th>
        
        </tr>

    `;

    tableBody.innerHTML = '';

    if (!data || data.length === 0){
        tableBody.innerHTML = `
            <tr>
                <td colspan="2">No application volume data found. </td>
            
            </tr>
        `;

        return;
    }

    for (let i = 0; i < data.length; i++){
        const row = data[i];
        const tableRow = document.createElement('tr');

        tableRow.innerHTML = `
            <td>${row.opportunityTitle || 'Unknown Opportunity'} </td>
            <td>${row.totalApplications || 0} </td>
        `;

        tableBody.appendChild(tableRow);
    }

    renderChart(data);

}

const renderChart = (data) => {
    const chartElement = document.getElementById('report-chart');
    const chartContext = chartElement.getContext('2d');

    if (chartInstance) {
        chartInstance.destroy();
    }

    const labels = [];
    const values = [];

    for (let i = 0; i < data.length; i++) {
        labels.push(data[i].opportunityTitle || 'Unknown Opportunity');
        values.push(data[i].totalApplications || 0);
    }

    chartInstance = new Chart(chartContext, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Total Applications',
                    data: values,
                    backgroundColor: '#2b6cb0'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Total Applications'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Opportunity'
                    }
                }
            }
        }
    });
};


const exportCSV = () => {
    const table = document.getElementById('results-table');

    let csv = '';

    const headers = table.querySelectorAll('thead th');
    for (let i = 0; i < headers.length; i++) {
        csv += headers[i].textContent.trim();

        if (i < headers.length - 1) {
            csv += ';';
        }
    }

    csv += '\n';

    const rows = table.querySelectorAll('tbody tr');
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll('td');

        for (let j = 0; j < cells.length; j++) {
            csv += cells[j].textContent.trim();

            if (j < cells.length - 1) {
                csv += ';';
            }
        }

        csv += '\n';
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `application-volume-${new Date().toISOString().slice(0, 10)}.csv`;

    downloadLink.click();

    URL.revokeObjectURL(url);
};

const showError = (message) => {
    const mainDetails = document.getElementById('main-details');

    let errorElement = document.getElementById('report-error');

    if (!errorElement) {
        errorElement = document.createElement('p');
        errorElement.id = 'report-error';
        mainDetails.insertAdjacentElement('afterbegin', errorElement);
    }

    errorElement.textContent = message;
};
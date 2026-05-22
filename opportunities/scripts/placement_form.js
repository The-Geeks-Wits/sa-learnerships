import { backendURL, getToken } from '../../env.config.js';

let chartInstance = null;

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Page loaded, fetching sectors...');
    try {
        const response = await fetch(`${backendURL()}/api/analytics/placement-options`);
        console.log('Response status:', response.status);
        const { sectors } = await response.json();
        console.log('Sectors received:', sectors);
        
        buildForm(sectors);
        
        const form = document.getElementById('placement-report-form');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            await generateReport();
        });

        document.getElementById('export-csv').addEventListener('click', exportCSV);
        document.getElementById('export-pdf').addEventListener('click', exportPDF);
        
    } catch (err) {
        console.error('Failed to load placement options:', err);
        showError('Could not load placement report options. Please try again later.');
    }
});

function buildForm(sectors) {
    console.log('Building form with sectors:', sectors);
    
    const sectorContainer = document.getElementById('sector-options');
    if (sectorContainer) {
        sectorContainer.innerHTML = sectors
            .map(sector => `<label><input type="checkbox" name="sector" value="${sector}" /> ${sector}</label>`)
            .join('');
        console.log('Added', sectors.length, 'sector checkboxes');
    } else {
        console.error('sector-options element not found!');
    }

    const filterContainer = document.getElementById('filter-options');
    if (filterContainer) {
        filterContainer.innerHTML = `
            <label>From: <input type="date" id="filter-dateFrom" /></label>
            <label>To: <input type="date" id="filter-dateTo" /></label>
        `;
        console.log('Filters added');
    } else {
        console.error('filter-options element not found!');
    }
}

function formatLabel(key) {
    if (key === 'placementSuccessRate') return 'Placement Success Rate';
    if (key === 'totalOpportunities') return 'Total Opportunities';
    if (key === 'totalApplications') return 'Total Applications';
    if (key === 'successfulApplications') return 'Successful Applications';
    if (key === 'unsuccessfulApplications') return 'Unsuccessful Applications';
    if (key === 'ongoingApplications') return 'Ongoing Applications';
    if (key === 'sector') return 'Sector';
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim();
}

async function generateReport() {
    showLoading(true);

    const selectedSectors = [];
    document.querySelectorAll('input[name="sector"]:checked').forEach(cb => selectedSectors.push(cb.value));
    
    if (selectedSectors.length === 0) {
        showError('Please select at least one sector.');
        showLoading(false);
        return;
    }

    console.log('Selected sectors:', selectedSectors);

    const filters = {};
    const dateFrom = document.getElementById('filter-dateFrom').value;
    const dateTo = document.getElementById('filter-dateTo').value;
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;

    try {
        const url = `${backendURL()}/api/analytics/placement-success-report`;
        console.log('Sending request to:', url);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({
                sectors: selectedSectors,
                ...filters
            })
        });

        const result = await response.json();
        console.log('Response:', result);
        
        if (result.success) {
            clearError();
            displayResults(result.data);
        } else {
            showError(result.error || 'Failed to generate placement report.');
        }
    } catch (err) {
        console.error('Error generating report:', err);
        showError('Something went wrong while generating the report.');
    } finally {
        showLoading(false);
    }
}

function displayResults(data) {
    document.getElementById('report-results').classList.remove('hidden');

    const headerRow = document.getElementById('results-header');
    const tbody = document.getElementById('results-body');
    headerRow.innerHTML = '';
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="100%">No data found for the selected sectors.</td></tr>';
        if (chartInstance) chartInstance.destroy();
        document.getElementById('chart-container').style.display = 'none';
        return;
    }

    // Update columns to use applications instead of placements
    const columns = ['sector', 'totalOpportunities', 'totalApplications', 'successfulApplications', 'placementSuccessRate'];
    headerRow.innerHTML = columns.map(col => `<th>${formatLabel(col)}</th>`).join('');

    data.forEach(row => {
        const tr = document.createElement('tr');
        columns.forEach(col => {
            const td = document.createElement('td');
            if (col === 'placementSuccessRate') {
                td.textContent = `${row[col].toFixed(1)}%`;
            } else {
                td.textContent = row[col] !== undefined ? row[col] : 'N/A';
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    renderChart(data);
}
function renderChart(data) {
    const chartContainer = document.getElementById('chart-container');
    chartContainer.style.display = 'block';
    const ctx = document.getElementById('report-chart').getContext('2d');

    if (chartInstance) chartInstance.destroy();

    const labels = data.map(row => row.sector || 'N/A');
    const values = data.map(row => row.placementSuccessRate || 0);

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Placement Success Rate',
                data: values,
                backgroundColor: '#1562f2'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Placement Success Rate (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Sector'
                    }
                }
            }
        }
    });
}

function exportCSV() {
    const table = document.getElementById('results-table');
    if (!table) return;

    let csv = '';
    const headers = [];
    table.querySelectorAll('thead th').forEach(th => headers.push(th.textContent));
    csv += headers.join(',') + '\n';

    table.querySelectorAll('tbody tr').forEach(tr => {
        const row = [];
        tr.querySelectorAll('td').forEach(td => row.push(td.textContent));
        csv += row.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `placement-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

async function exportPDF() {
    const table = document.getElementById('results-table');
    if (!table) return;

    const headers = [];
    table.querySelectorAll('thead th').forEach(th => headers.push(th.textContent));
    
    const rows = [];
    table.querySelectorAll('tbody tr').forEach(tr => {
        const row = [];
        tr.querySelectorAll('td').forEach(td => row.push(td.textContent));
        rows.push(row);
    });

    try {
        const response = await fetch(`${backendURL()}/api/analytics/export-placement-report`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({
                headers: headers,
                rows: rows,
                format: 'pdf'
            })
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `placement-report-${new Date().toISOString().slice(0, 10)}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } else {
            showError('Failed to generate PDF.');
        }
    } catch (err) {
        console.error('PDF export error:', err);
        showError('Failed to export PDF.');
    }
}

function showLoading(show) {
    const submitBtn = document.querySelector('#placement-report-form button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = show;
        submitBtn.textContent = show ? 'Generating...' : 'Generate Report';
    }
}

function showError(message) {
    let errEl = document.getElementById('report-error');
    if (!errEl) {
        errEl = document.createElement('p');
        errEl.id = 'report-error';
        errEl.style.color = '#1562f2';
        errEl.style.marginTop = '12px';
        errEl.style.fontWeight = '500';
        const form = document.getElementById('placement-report-form');
        if (form) form.insertAdjacentElement('afterend', errEl);
    }
    errEl.textContent = message;
}

function clearError() {
    const errEl = document.getElementById('report-error');
    if (errEl) errEl.textContent = '';
}
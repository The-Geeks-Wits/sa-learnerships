import { backendURL, getToken } from '../../env.config.js';

let chartInstance = null;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch available dimensions, metrics, and filters from backend
        const response = await fetch(`${backendURL()}/api/analytics/available-options`);
        const { dimensions, metrics } = await response.json();

        // Build the form
        buildForm(dimensions, metrics);

        // Handle form submission
        const form = document.getElementById('custom-report-form');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            await generateReport(dimensions, metrics);
        });

        // Export CSV handler
        document.getElementById('export-csv').addEventListener('click', exportCSV);
    } catch (err) {
        console.error('Failed to load analytics options:', err);
        showError('Could not load report options. Please try again later.');
    }
});

function buildForm(dimensions, metrics) {
    const dimContainer = document.getElementById('dimension-options');
    dimContainer.innerHTML = dimensions
        .map(dim => `<label><input type="checkbox" name="dimension" value="${dim}" /> ${formatLabel(dim)}</label>`)
        .join('');

    const metricContainer = document.getElementById('metric-options');
    metricContainer.innerHTML = metrics
        .map((met, idx) => `<label><input type="radio" name="metric" value="${met}" ${idx === 0 ? 'checked' : ''} /> ${formatLabel(met)}</label>`)
        .join('');

    const filterContainer = document.getElementById('filter-options');
    filterContainer.innerHTML = `
        <label>Status: <select id="filter-status">
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Rejected">Rejected</option>
        </select></label>
        <label>From: <input type="date" id="filter-dateFrom" /></label>
        <label>To: <input type="date" id="filter-dateTo" /></label>
    `;
}

function formatLabel(key) {
    if (key === 'shortlistRate') return 'Shortlisting Rate';
    if (key === 'totalApplications') return 'Total Applications';
    if (key === 'nqfLevel') return 'NQF Level';
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim();
}

async function generateReport(dimensions, metrics) {
    showLoading(true);

    const selectedDimensions = [];
    document.querySelectorAll('input[name="dimension"]:checked').forEach(cb => selectedDimensions.push(cb.value));
    if (selectedDimensions.length === 0) {
        showError('Please select at least one dimension.');
        showLoading(false);
        return;
    }

    const metricRadio = document.querySelector('input[name="metric"]:checked');
    const selectedMetric = metricRadio ? metricRadio.value : metrics[0];

    const filters = {};
    const statusFilter = document.getElementById('filter-status').value;
    if (statusFilter) filters.status = statusFilter;
    const dateFrom = document.getElementById('filter-dateFrom').value;
    const dateTo = document.getElementById('filter-dateTo').value;
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;

    try {
        const url = `${backendURL()}/api/analytics/custom-report`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },        
            body: JSON.stringify({
                dimensions: selectedDimensions,
                metric: selectedMetric,
                filters: Object.keys(filters).length ? filters : undefined
            })
        }); 

        const result = await response.json();
        if (result.success) {
            clearError();
            displayResults(result.data, selectedDimensions, selectedMetric);
        } else {
            showError(result.error || 'Failed to generate report.');
        }
    } catch (err) {
        console.error('Error generating report:', err);
        showError('Something went wrong while generating the report.');
    } finally {
        showLoading(false);
    }
}

function displayResults(data, selectedDimensions, selectedMetric) {
    document.getElementById('report-results').classList.remove('hidden');

    const headerRow = document.getElementById('results-header');
    const tbody = document.getElementById('results-body');
    headerRow.innerHTML = '';
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="100%">No data found for the selected criteria.</td></tr>';
        if (chartInstance) chartInstance.destroy();
        document.getElementById('chart-container').style.display = 'none';
        return;
    }

    const columns = [...selectedDimensions, selectedMetric];
    headerRow.innerHTML = columns.map(col => `<th>${formatLabel(col)}</th>`).join('');

    data.forEach(row => {
        const tr = document.createElement('tr');
        columns.forEach(col => {
            const td = document.createElement('td');
            td.textContent = row[col] !== undefined ? (typeof row[col] === 'number' ? row[col].toFixed(1) : row[col]) : 'N/A';
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    renderChart(data, selectedDimensions, selectedMetric);
}

function renderChart(data, selectedDimensions, selectedMetric) {
    const chartContainer = document.getElementById('chart-container');
    chartContainer.style.display = 'block';
    const ctx = document.getElementById('report-chart').getContext('2d');

    if (chartInstance) chartInstance.destroy();

    const labelDim = selectedDimensions[0];
    const labels = data.map(row => row[labelDim] || 'N/A');
    const values = data.map(row => row[selectedMetric] || 0);

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: formatLabel(selectedMetric),
                data: values,
                backgroundColor: '#2b6cb0'
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
                    title: {
                        display: true,
                        text: formatLabel(selectedMetric)
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: formatLabel(labelDim)
                    }
                }
            }
        }
    });
}

//Improved CSV export formatting ,bugs fixed
function exportCSV() {
    const table = document.getElementById('results-table');
    if (!table) return;

    let csv = '';

    // Headers
    const headers = table.querySelectorAll('thead th');
    for (let i = 0; i < headers.length; i++) {
        csv += headers[i].textContent.trim();
        if (i < headers.length - 1) csv += ';';
    }
    csv += '\n';

    // Body rows
    const rows = table.querySelectorAll('tbody tr');
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll('td');
        for (let j = 0; j < cells.length; j++) {
            let val = cells[j].textContent.trim();
            // If the value contains a semicolon or comma, wrap in quotes
            if (val.includes(';') || val.includes(',')) {
                val = `"${val}"`;
            }
            csv += val;
            if (j < cells.length - 1) csv += ';';
        }
        csv += '\n';
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `custom-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

//HELPER FUNCTIONS FOR OUR UI FEEDBACK
function showLoading(show) {
    const submitBtn = document.querySelector('#custom-report-form button[type="submit"]');
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
        errEl.style.color = '#c53030';
        errEl.style.marginTop = '12px';
        errEl.style.fontWeight = '500';
        const form = document.getElementById('custom-report-form');
        if (form) form.insertAdjacentElement('afterend', errEl);
    }
    errEl.textContent = message;
}

function clearError() {
    const errEl = document.getElementById('report-error');
    if (errEl) errEl.textContent = '';
}
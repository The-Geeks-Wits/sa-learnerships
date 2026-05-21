import { backendURL } from '../../env.config.js';

const pageState = document.getElementById('page-state');
const pageError = document.getElementById('page-error');
const pageContainer = document.getElementById('page-container');
const actions = document.getElementById('actions');
const applicantDetails = document.getElementById('applicant-details');
const opportunityDetails = document.getElementById('opportunity-details');

const params = new URLSearchParams(window.location.search);
const applicationId = params.get('id');

const getUserRole = async () => {
    const response = await fetch(backendURL() + '/api/users/profile', {
        method: 'GET',
        credentials: 'include',
    });

    const data = await response.json();
    return data.user.role;
};

document.addEventListener('DOMContentLoaded', async ()=> {
    try{
        pageState.style.display = 'flex';
        pageState.innerHTML = '<p>Loading...</p>';
        const role = await getUserRole();

        const response = await fetch(backendURL() + `/applications/details/${applicationId}`,{
            method: 'GET',
            credentials: 'include',
        })

        const applicationDetails = await response.json();

        if (response.ok){
            pageContainer.style.display = 'block';

            const application = applicationDetails.detailedApplication;
            const applicant = application.applicant;
            const opportunity = application.opportunity;

            let skillsHTML = '<li>No skills provided</li>';

            if (applicant.skills.length > 0){
                skillsHTML = '';

                for (let i = 0; i < applicant.skills.length; i++){
                    skillsHTML += `<li>${applicant.skills[i]}</li>`;
                }
            }

            let qualificationsHTML = '<li>No qualifications provided</li>';

            if(applicant.qualifications.length > 0){
                qualificationsHTML = '';

                for (let i = 0; i < applicant.qualifications.length; i++){
                    const qualification = applicant.qualifications[i];

                    qualificationsHTML += `
                    <li>
                        <p><b>Qualification:</b> ${qualification.qualificationName ||'Not provided'} </p>
                        <p><b>Level:</b> ${qualification.qualificationLevel || 'Not provided'}</p>
                        <p><b>NQF Level:</b> ${qualification.nqfLevel || 'Not provided'} </p>
                        <p><b>Institution:</b> ${qualification.institution || 'Not provided'}</p>
                    </li>
                    `;
                }
            }

            applicantDetails.innerHTML = `
                <h2>Applicant Details</h2>

                <p><b>Name:</b> ${applicant.firstName} ${applicant.lastName}</p>

                <p><b>Email:</b> ${applicant.email}</p>

                <p><b>Phone:</b> ${applicant.phone || 'Not provided'}</p>

                <p><b>Location:</b> ${applicant.location || 'Not provided'}</p>

                <h3>Skills</h3>
                <ul>
                    ${skillsHTML}
                </ul>

                <h3>Qualifications</h3>
                <ul>
                    ${qualificationsHTML}
                </ul>

                <p>
                    <b>CV:</b>
                    ${applicant.cv 
                        ? `<a href="${backendURL()}${applicant.cv}" target="_blank"> View CV </a>`
                        : 'No CV uploaded'


                    }
                </p>

            `;

            opportunityDetails.innerHTML = `
                <h2>Opportunity Details</h2>

                <p><b>Title:</b> ${opportunity.title}</p>

                <p><b>Description:</b> ${opportunity.description || 'Not provided'}</p>

                <p><b>Location:</b> ${opportunity.location || 'Not provided'}</p>

                <p><b>Posted By:</b> ${opportunity.creator.firstName} ${opportunity.creator.lastName} </p>

                <p><b>Application status:</b> ${application.status}</p>

                <p><b>Date Submitted:</b> ${application.createdAt.slice(0,10)}</p>

                <p><b>Date Posted:</b> ${opportunity.createdAt.slice(0,10)}</p>
            `;

            if (role === 'provider' && application.status == 'Pending'){
                actions.innerHTML = `
                    <button id="shortlist-btn" class="coloured-btn">Shortlist</button>
                    <button id="reject-btn" class="transparent-btn">Reject</button>
                    <button class="transparent-btn" onclick="history.back()">Back</button>
                `;
            } else {
                actions.innerHTML = `
                    <button class="transparent-btn" onclick="history.back()">Back</button>
                `;
            }
        }else{
                pageError.style.display = 'flex';
                pageError.innerHTML = `<p>${applicationDetails.error}</p>`;
        }

    }catch(err){
        console.log(err);
        pageError.style.display = 'flex';
        pageError.innerHTML = '<p>An error occurred! Please try again later</p>';

    }finally{
        pageState.style.display = 'none';
        pageState.innerHTML = '';
    }
})


actions.addEventListener('click', async(event)=>{
    
    try{
            if (event.target.id === "shortlist-btn"){

                const confirmed = confirm(
                    'Are you sure you want to shortlist this application?'
                );

                if (!confirmed){
                    return;
                }
                const response = await fetch(backendURL() + `/applications/${applicationId}/shortlist`,{
                    method: 'PATCH',
                    credentials: 'include',
                    }
                );

                const data = await response.json();

                if (response.ok){
                    alert(data.message);
                    window.location.href = '/applications/shortlisted.html';
                }else{
                    pageError.style.display = 'flex';
                    pageError.innerHTML = `<p>${data.error}</p>`;
                }
            }
    }catch(err){
        pageError.style.display = 'flex';
        pageError.innerHTML = '<p>An error has occurred! Please try again later</p>';
    }

});

actions.addEventListener('click', async(event)=>{
    
    try{
            if (event.target.id === "reject-btn"){

                const confirmed = confirm(
                    'Are you sure you want to reject this application?'
                );

                if (!confirmed){
                    return;
                }
                const response = await fetch(backendURL() + `/applications/${applicationId}/reject`,{
                    method: 'PATCH',
                    credentials: 'include',
                    }
                );

                const data = await response.json();

                if (response.ok){
                    alert(data.message);
                    window.location.href = '/applications/rejected.html';
                }else{
                    pageError.style.display = 'flex';
                    pageError.innerHTML = `<p>${data.error}</p>`;
                }
            }
    }catch(err){
        pageError.style.display = 'flex';
        pageError.innerHTML = '<p>An error has occurred! Please try again later</p>';
    }

});
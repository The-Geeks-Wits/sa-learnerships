import { backendURL } from '../../env.config.js';

const visibleDetails = document.getElementById('visible-profile-details');
const personalTab = document.getElementById('personal-tab');
const educationTab = document.getElementById('education-tab');
const skillsTab = document.getElementById('skills-tab');

const addFormSubmitListener = (formElement, user) => {
    formElement.addEventListener('submit', async (event) => {
        event.preventDefault();

        const url = backendURL() + '/api/users/profile';

        const token = localStorage.getItem('jwt');
        if (!token) return (window.location.href = '../../login.html');

        // Get all the input fields elements
        const firstNameElement = document.getElementById('firstName');
        const lastNameElement = document.getElementById('lastName');
        const emailElement = document.getElementById('email');
        const locationElement = document.getElementById('location');
        const phoneElement = document.getElementById('phone');

        // Build the request body
        const requestBody = {};

        if (firstNameElement.value !== '' && firstNameElement.value !== user.firstName) {
            requestBody.firstName = firstNameElement.value;
        }

        if (lastNameElement.value !== '' && lastNameElement.value !== user.lastName) {
            requestBody.lastName = lastNameElement.value;
        }

        if (emailElement.value !== '' && emailElement.value !== user.email) {
            requestBody.email = emailElement.value;
        }

        if (locationElement.value !== '' && locationElement.value !== user.location) {
            requestBody.location = locationElement.value;
        }

        if (phoneElement.value !== '' && phoneElement.value !== user.phone) {
            requestBody.phone = phoneElement.value;
        }

        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                Authorization: token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        console.log(await response.json());
    });
};

const showPersonalDetails = (user) => {
    personalTab.classList.add('visible');
    educationTab.classList.remove('visible');
    skillsTab.classList.remove('visible');

    visibleDetails.innerHTML = `<form id="personal-details-form">
        <section class="input-group">
            <label for="firstName">First Name</label>
            <section class="input-wrapper">
                <input type="text"  id="firstName" name="firstName" value="${user.firstName}"/>
            </section>
        </section>
        <section class="input-group">
            <label for="lastName">Last Name</label>
            <section class="input-wrapper">
                <input type="text" id="lastName" name="lastName" value="${user.lastName}" />
            </section>
        </section>
        <section class="input-group">
            <label for="email">Email</label>
            <section class="input-wrapper">
                <input type="email" id="email" name="email" value="${user.email}" />
            </section>
        </section>
        <section class="input-group">
            <label for="gender">Gender</label>
            <select id="gender" name="gender">
                <option value="">Select gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Prefer Not To Say">Prefer Not To Say</option>
            </select>
        </section>
        <section class="input-group">
            <label for="dob">Date of Birth</label>
            <input type="date" id="dob" name="dob" />
        </section>
        <section class="input-group">
            <label for="location">Location</label>
            <section class="input-wrapper">
                <input type="text" id="location" name="location" value="${user.location || ''}" />
            </section>
        </section>
        <section class="input-group">
            <label for="phone">Phone</label>
            <section class="input-wrapper">
                <input type="text" id="phone" name="phone" value="${user.phone || ''}" />
            </section>
        </section>
        <button id="save-profile-btn" class="coloured-btn">Save profile</button>
    </form>`;

    const form = document.getElementById('personal-details-form');
    addFormSubmitListener(form, user);
};

const showEducationDetails = (user) => {
    personalTab.classList.remove('visible');
    educationTab.classList.add('visible');
    skillsTab.classList.remove('visible');

    visibleDetails.innerHTML = '';
};

const showSkillsDetails = (user) => {
    personalTab.classList.remove('visible');
    educationTab.classList.remove('visible');
    skillsTab.classList.add('visible');

    visibleDetails.innerHTML = '';
};

document.addEventListener('DOMContentLoaded', async () => {
    const url = backendURL() + '/api/users/profile';

    const token = localStorage.getItem('jwt');
    if (!token) return (window.location.href = '/login.html');

    const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: token },
    });

    if (response.ok) {
        const data = await response.json();

        personalTab.addEventListener('click', () => showPersonalDetails(data.user));
        educationTab.addEventListener('click', () => showEducationDetails(data.user));
        skillsTab.addEventListener('click', () => showSkillsDetails(data.user));

        // Start with personal details
        showPersonalDetails(data.user);
    }
});

// document.addEventListener("DOMContentLoaded", async () => {

//     //fetch user data from backens
//     const response = await fetch('http://localhost:3000/api/users/profile', {
//         method: "GET",
//         credentials: "include"
//     });

//     if (!response.ok) {
//         window.location.href = "./login.html";
//         return;
//     }

//     const data = await response.json();
//     const user = data.user;

//     document.getElementById("full-name").textContent =
//         user.firstName + " " + user.lastName;

//     document.getElementById("email").textContent = user.email;

//     //triger cv upload on button click
//     document.getElementById("upload-btn").addEventListener("click", async () => {
//         await uploadCV();
//     });

//     //pre-filling profile form with user data
//     document.getElementById("first-name").value = user.firstName || "";
//     document.getElementById("last-name").value = user.lastName || "";
//     document.getElementById("email-input").value = user.email || "";

//     const firstName = document.getElementById("first-name");
//     const lastName = document.getElementById("last-name");
//     const emailInput = document.getElementById("email-input");
//     const gender = document.getElementById("gender");
//     const dateOfBirth = document.getElementById("dob");
//     const phone = document.getElementById("phone");
//     const location = document.getElementById("location");
//     const qualificationLevel = document.getElementById("qualification-level");
//     const nqfLevel = document.getElementById("nqfLevel");
//     const institution = document.getElementById("institution");
//     const cv = document.getElementById("cv");
//     const skills = document.getElementById("skills");
//     const qualificationName = document.getElementById("qualification-name");

//     phone.value = user.phone || "";
//     gender.value = user.gender || "";
//     location.value = user.location || "";

//     // fixing:date input wasnt showing in frontend
//     if (user.dateOfBirth) {
//         const dob = new Date(user.dateOfBirth);
//         // Format date to YYYY-MM-DD for input value
//         dateOfBirth.value = dob.toISOString().split("T")[0];
//     } else {
//         dateOfBirth.value = "";
//     }

//     //dispalying skills in the profile page
//     const skillsContainer = document.getElementById("skills-container");
//     const userSkills = user.skills || [];

//     skillsContainer.innerHTML = "";

//     userSkills.forEach(skill => {
//         const li = document.createElement("li");
//         li.textContent = skill;
//         skillsContainer.appendChild(li);
//     });

//     //showing qualifications in the profile page
//     const qContainer = document.getElementById("qualifications-container");
//     const userQualifications = user.qualifications || [];

//     qContainer.innerHTML = "";

//     const title = document.createElement("h3");
//     title.textContent = "Your Qualifications";

//     const intro = document.createElement("p");
//     intro.textContent = "Here is a list of your qualifications:";
//     intro.style.color = "#555";
//     intro.style.fontSize = "0.9rem";
//     intro.style.marginBottom = "10px";

//     qContainer.appendChild(title);
//     qContainer.appendChild(intro);

//     const sortedQualifications = [...userQualifications].reverse();

//     sortedQualifications.forEach((q, index) => {

//         const article = document.createElement("article");

//         article.style.borderLeft = "3px solid #1562f2";
//         article.style.padding = "10px 12px";
//         article.style.marginBottom = "10px";
//         article.style.background = "#f7faff";
//         article.style.borderRadius = "6px";

//         article.innerHTML = `
//             <strong>${index + 1}. ${q.qualificationName}</strong>
//             <p>${q.qualificationLevel} (NQF ${q.nqfLevel})</p>
//             <p>${q.institution}</p>
//         `;

//         qContainer.appendChild(article);
//     });

//     const editBtn = document.getElementById("edit-btn");

//     //enabling profile editing on click and showing save button down there
//     editBtn.addEventListener("click", async () => {

//         skills.disabled = false;
//         cv.disabled = false;
//         institution.disabled = false;
//         qualificationLevel.disabled = false;
//         qualificationName.disabled = false;
//         location.disabled = false;
//         phone.disabled = false;
//         dateOfBirth.disabled = false;
//         gender.disabled = false;
//         emailInput.disabled = false;
//         firstName.disabled = false;
//         lastName.disabled = false;

//         //clear qualification inputs for new qualification entry
//         qualificationName.value = "";
//         qualificationLevel.value = "";
//         nqfLevel.value = "";
//         institution.value = "";

//         document.getElementById("save-profile").style.display = "block";
//         editBtn.style.display = "none";
//     });

//     //mapping nqf levels to qualifications
//     const nqfMap = {
//         matric: 4,
//         certificate: 5,
//         diploma: 6,
//         degree: 7,
//         honours: 8,
//         masters: 9,
//         phd: 10
//     };

//     qualificationLevel.addEventListener("change", () => {
//         const choice = qualificationLevel.value;
//         nqfLevel.value = nqfMap[choice] || "";
//     });

//     const saveProfileBtn = document.getElementById("save-profile");

//     //saving profile changes to the backend
//     saveProfileBtn.addEventListener("click", async () => {

//         const new_qualification = {
//             qualificationName: qualificationName.value,
//             qualificationLevel: qualificationLevel.value,
//             nqfLevel: nqfLevel.value,
//             institution: institution.value
//         };

//         const requestBody = {
//             firstName: firstName.value,
//             lastName: lastName.value,
//             location: location.value,
//             gender: gender.value,
//             phone: phone.value,
//             dateOfBirth: dateOfBirth.value,
//             skills: skills.value
//                 .split(",")
//                 .map(s => s.trim().toLowerCase())
//                 .filter(s => s !== ""),
//         };

//         const hasQualification =
//             new_qualification.qualificationName?.trim() &&
//             new_qualification.qualificationLevel?.trim() &&
//             new_qualification.institution?.trim() &&
//             new_qualification.nqfLevel;

//         if (hasQualification) {
//             requestBody.qualification = new_qualification;
//         }

//         try {
//             await fetch('http://localhost:3000/api/users/profile', {
//                 method: "PUT",
//                 headers: { "content-type": "application/json" },
//                 credentials: "include",
//                 body: JSON.stringify(requestBody)
//             });

//         } catch (err) {
//             console.error(err);
//         }
//     });

//     //function to upload cv
//     async function uploadCV() {
//         const cvInput = document.getElementById("cv");
//         const file = cvInput.files[0];

//         if (!file) {
//             alert("Please select a CV file");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("cv", file);

//         try {
//             const response = await fetch("http://localhost:3000/api/users/upload-cv", {
//                 method: "POST",
//                 body: formData,
//                 credentials: "include"
//             });

//             const data = await response.json();

//             if (data.success) {

//                 const cvLink = document.getElementById("cv-link");

//                 cvLink.style.display = "block";
//                 cvLink.href = "http://localhost:3000" + data.cv;
//                 cvLink.textContent = "View / Download CV";

//                 alert("CV uploaded successfully!");
//             }

//         } catch (err) {
//             console.error("CV upload error:", err);
//         }
//     }

//     //show cv link if cv exists and is uploaded by the user
//     if (user.cv) {
//         const cvLink = document.getElementById("cv-link");

//         cvLink.style.display = "block";
//         cvLink.href = "http://localhost:3000" + user.cv;
//         cvLink.textContent = "View / Download CV";
//     }

// });

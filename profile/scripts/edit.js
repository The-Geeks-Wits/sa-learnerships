import { backendURL } from '../../env.config.js';

//locations dropdown data
const LOCATIONS = {
  "Eastern Cape": ["East London", "Gqeberha (Port Elizabeth)", "Grahamstown", "King William's Town", "Mthatha", "Queenstown"],
  "Free State": ["Bethlehem", "Bloemfontein", "Kroonstad", "Phuthaditjhaba", "Sasolburg", "Welkom"],
  "Gauteng": ["Alberton", "Benoni", "Boksburg", "Germiston", "Johannesburg", "Kempton Park", "Midrand", "Pretoria", "Randburg", "Roodepoort", "Sandton", "Soweto", "Springs", "Tembisa"],
  "KwaZulu-Natal": ["Durban", "Empangeni", "Ladysmith", "Newcastle", "Pietermaritzburg", "Pinetown", "Richards Bay", "Umlazi"],
  "Limpopo": ["Giyani", "Lebowakgomo", "Makhado", "Modimolle", "Mokopane", "Phalaborwa", "Polokwane", "Thohoyandou"],
  "Mpumalanga": ["Emalahleni (Witbank)", "Ermelo", "Mbombela (Nelspruit)", "Middelburg", "Piet Retief", "Sabie", "Secunda", "Standerton"],
  "Northern Cape": ["De Aar", "Kimberley", "Kuruman", "Postmasburg", "Springbok", "Upington"],
  "North West": ["Brits", "Klerksdorp", "Lichtenburg", "Mahikeng", "Potchefstroom", "Rustenburg", "Vryburg"],
  "Western Cape": ["Bellville", "Cape Town", "George", "Hermanus", "Knysna", "Mossel Bay", "Paarl", "Stellenbosch", "Worcester"]
};

const visibleDetails = document.getElementById('visible-profile-details');
const personalTab = document.getElementById('personal-tab');
const educationTab = document.getElementById('education-tab');
const skillsTab = document.getElementById('skills-tab');
const attachmentsTab = document.getElementById('attachments-tab');
const pageError = document.getElementById('page-error');
const pageState = document.getElementById('page-state');

//personal tab submission with confirmation
const addPersonalDetailsSubmitListener = (formElement, user) => {
    formElement.addEventListener('submit', async (event) => {
        const firstNameElement = document.getElementById('firstName');
        const lastNameElement = document.getElementById('lastName');
        const emailElement = document.getElementById('email');
        const locationElement = document.getElementById('location');
        const phoneElement = document.getElementById('phone');
        const dobElement = document.getElementById('dob');
        const genderElement = document.getElementById('gender');
        const saveBtn = document.getElementById('save-profile-btn');
        const errorElement = document.getElementById('error-message');

        try {
            event.preventDefault();
            const url = backendURL() + '/api/users/profile';

            if (!confirm('Are you sure you want to update your personal details?')) return;

            const requestBody = {};
            if (firstNameElement.value !== '' && firstNameElement.value !== user.firstName)
                requestBody.firstName = firstNameElement.value;
            if (lastNameElement.value && lastNameElement.value !== user.lastName)
                requestBody.lastName = lastNameElement.value;
            if (emailElement.value && emailElement.value !== user.email) requestBody.email = emailElement.value;
            if (dobElement.value && dobElement.value !== user.dateOfBirth) requestBody.dateOfBirth = dobElement.value;
            if (genderElement.value && genderElement.value !== user.genger) requestBody.gender = genderElement.value;
            if (locationElement.value && locationElement.value !== user.location)
                requestBody.location = locationElement.value;
            if (phoneElement.value && phoneElement.value !== user.phone) requestBody.phone = phoneElement.value;

            saveBtn.textContent = 'Loading...';
            const response = await fetch(url, {
                method: 'PUT',
                credentials: 'include',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();
            if (response.ok) {
                    errorElement.style.color = 'green';
                    errorElement.innerHTML = 'Personal details updated successfully!';
            } else {
                errorElement.innerHTML = data.error;
            }
        } catch (err) {
            errorElement.innerHTML = 'Something went wrong! Please try again later';
        } finally {
            saveBtn.textContent = 'Save profile';
        }
    });
};

//education tab submission with confirmation
const addEducationSubmitListener = (formElement, user, qualifications) => {
    formElement.addEventListener('submit', async (event) => {
        const qualificationLevelElement = document.getElementById('qualification-level');
        const qualificationNameElement = document.getElementById('qualification-name');
        const institutionElement = document.getElementById('institution');
        const saveBtn = document.getElementById('add-education-btn');
        const errorElement = document.getElementById('error-message');

        try {
            event.preventDefault();
            const url = backendURL() + '/api/users/profile';

            if (
                !qualificationLevelElement.value ||
                !qualificationNameElement.value.trim() ||
                !institutionElement.value
            ) {
                errorElement.innerHTML = 'Please fill all three fields.';
                return;
            }

            if (!confirm('Are you sure you want to add this qualification?')) return;

            const selectedLevel = qualificationLevelElement.value;
            const matchingQual = qualifications.find((q) => q.qualificationLevel === selectedLevel);
            const qualification = {
                qualificationLevel: selectedLevel,
                qualificationName: qualificationNameElement.value.trim(),
                institution: institutionElement.value,
                nqfLevel: matchingQual ? matchingQual.nqfLevel : null,
            };

            user.qualifications.push(qualification);

            const response = await fetch(url, {
                method: 'PUT',
                credentials: 'include',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify({ qualifications: user.qualifications }),
            });

            const data = await response.json();
            if (response.ok) {
                errorElement.style.color = 'green';
                errorElement.innerHTML = 'Education details updated successfully!';
            } else {
                errorElement.innerHTML = data.error;
            }
        } catch (err) {
            errorElement.innerHTML = 'Something went wrong! Please try again later';
        } finally {
            saveBtn.textContent = 'Add education';
        }
    });
};

//skills management with confirmation (now uses cookie instead of localStorage)
const addSkillSubmitListener = (formElement, user) => {
    formElement.addEventListener('submit', async (event) => {
        const skillSelect = document.getElementById('skill-name');   //only the selected skill here
        const saveBtn = document.getElementById('add-skill-btn');
        const errorElement = document.getElementById('error-message');

        try {
            event.preventDefault();
            const url = backendURL() + '/api/users/profile';

            const selectedSkill = skillSelect.value;
            if (!selectedSkill) {
                errorElement.innerHTML = 'Please select a skill.';
                return;
            }

            if (!confirm('Are you sure you want to add this skill?')) return;

//adding new skill to array
            user.skills.push(selectedSkill.trim());

            const response = await fetch(url, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skills: user.skills }),
            });

            const data = await response.json();
            if (response.ok) {
                errorElement.style.color = 'green';
                errorElement.innerHTML = 'Skill added successfully!';
            } else {
                errorElement.innerHTML = data.error;
            }
        } catch (err) {
            errorElement.innerHTML = 'Something went wrong! Please try again later';
        } finally {
            saveBtn.textContent = 'Add skill';
        }
    });
};

//these are user personal details 
const showPersonalDetails = (user) => {
    personalTab.classList.add('visible');
    educationTab.classList.remove('visible');
    skillsTab.classList.remove('visible');
    attachmentsTab.classList.remove('visible');

    if (user.dateOfBirth) user.dateOfBirth = user.dateOfBirth.slice(0, 10);

    //Replacing the location text input with province/city dropdowns
    //  + hidden location input
    visibleDetails.innerHTML = `<form id="personal-details-form">
        <section class="input-group">
            <label for="firstName">First Name</label>
            <section class="input-wrapper">
                <input type="text" id="firstName" name="firstName" value="${user.firstName}" />
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
                <option value="Female" ${user.gender === 'Female' ? 'selected' : ''}>Female</option>
                <option value="Male" ${user.gender === 'Male' ? 'selected' : ''}>Male</option>
                <option value="Prefer Not To Say" ${user.gender === 'Prefer Not To Say' ? 'selected' : ''}>Prefer not to say</option>
            </select>
        </section>
        <section class="input-group">
            <label for="dob">Date of Birth</label>
            <input type="date" id="dob" name="dob" value="${user.dateOfBirth || ''}" />
        </section>
        <section class="input-group">
            <label for="province">Province</label>
            <select id="province" name="province">
                <option value="">Select province</option>
            </select>
        </section>
        <section class="input-group">
            <label for="city">City / Town</label>
            <select id="city" name="city" disabled>
                <option value="">Select a province first</option>
            </select>
            <input type="hidden" id="location" name="location" value="${user.location || ''}" />
        </section>
        <section class="input-group">
            <label for="phone">Phone</label>
            <section class="input-wrapper">
                <input type="text" id="phone" name="phone" value="${user.phone || ''}" />
            </section>
        </section>

        <p id="error-message"></p>
        <button id="save-profile-btn" class="coloured-btn">Save profile</button>
    </form>`;

    //populating location dropdowns
    const provinceSelect = document.getElementById('province');
    const citySelect = document.getElementById('city');
    const locationInput = document.getElementById('location');

    // Build province options
    for (const province of Object.keys(LOCATIONS)) {
        const option = document.createElement('option');
        option.value = province;
        option.textContent = province;
        provinceSelect.appendChild(option);
    }

    // Handle province change
    provinceSelect.addEventListener('change', () => {
        const selectedProvince = provinceSelect.value;
        citySelect.innerHTML = '<option value="">Select city</option>';
        if (selectedProvince && Array.isArray(LOCATIONS[selectedProvince])) {
            citySelect.disabled = false;
            LOCATIONS[selectedProvince].forEach(city => {
                const opt = document.createElement('option');
                opt.value = city;
                opt.textContent = city;
                citySelect.appendChild(opt);
            });
        } else {
            citySelect.disabled = true;
        }
        locationInput.value = '';
    });

    // When a city is selected show hidden input
    citySelect.addEventListener('change', () => {
        const province = provinceSelect.value;
        const city = citySelect.value;
        if (province && city) {
            locationInput.value = `${city}, ${province}`;
        }
    });

    // Pre‑select if user already has a location
    if (user.location) {
        const parts = user.location.split(',').map(s => s.trim());
        if (parts.length === 2) {
            const [city, province] = parts;
            if (LOCATIONS[province] && Array.isArray(LOCATIONS[province]) && LOCATIONS[province].includes(city)) {
                provinceSelect.value = province;
                provinceSelect.dispatchEvent(new Event('change'));
                setTimeout(() => {
                    citySelect.value = city;
                    locationInput.value = user.location;
                }, 50);
            }
        }
    }

    const form = document.getElementById('personal-details-form');
    addPersonalDetailsSubmitListener(form, user);
};

//education info tab 
const showEducationDetails = async (user) => {
    personalTab.classList.remove('visible');
    educationTab.classList.add('visible');
    skillsTab.classList.remove('visible');
    attachmentsTab.classList.remove('visible');

    try {
        const [qualResponse, instResponse] = await Promise.all([
            fetch(backendURL() + '/api/users/data/qualifications'),
            fetch(backendURL() + '/api/users/data/institutions'),
        ]);
        const qualifications = await qualResponse.json();
        const institutionGroups = await instResponse.json();

        const levelMap = new Map();
        qualifications.forEach((q) => {
            if (!levelMap.has(q.qualificationLevel)) {
                levelMap.set(q.qualificationLevel, q.nqfLevel);
            }
        });
        const levelOptions = Array.from(levelMap.entries())
            .map(([level, nqf]) => `<option value="${level}">${level} (NQF ${nqf})</option>`)
            .join('');

        let instOptionsHtml = '<option value="">Select an institution</option>';
        institutionGroups.forEach((group) => {
            instOptionsHtml += `<optgroup label="${group.label}">`;
            group.options.forEach((i) => {
                instOptionsHtml += `<option value="${i}">${i}</option>`;
            });
            instOptionsHtml += `</optgroup>`;
        });

        visibleDetails.innerHTML = `<form id="education-form">
            <section class="input-group">
                <label for="qualification-level">Qualification Level</label>
                <select id="qualification-level" name="qualification-level">
                    <option value="">Select qualification level</option>
                    ${levelOptions}
                </select>
            </section>
            <section class="input-group">
                <label for="qualification-name">Qualification Name</label>
                <input type="text" id="qualification-name" name="qualification-name"
                       placeholder="e.g., BSc Computer Science" />
            </section>
            <section class="input-group">
                <label for="institution">Institution</label>
                <select id="institution" name="institution">
                    ${instOptionsHtml}
                </select>
            </section>
            <section class="input-group">
                <label>NQF Level</label>
                <p id="nqf-display" style="font-weight:600; margin: 0;">–</p>
            </section>
            <p id="error-message"></p>
            <button id="add-education-btn" class="coloured-btn">Add education</button>
        </form>`;

        const levelSelect = document.getElementById('qualification-level');
        const nqfDisplay = document.getElementById('nqf-display');

        levelSelect.addEventListener('change', () => {
            const selectedLevel = levelSelect.value;
            const qual = qualifications.find((q) => q.qualificationLevel === selectedLevel);
            if (qual) {
                nqfDisplay.textContent = `Level ${qual.nqfLevel}`;
            } else {
                nqfDisplay.textContent = '–';
            }
        });

        const form = document.getElementById('education-form');
        addEducationSubmitListener(form, user, qualifications);
    } catch (err) {
        visibleDetails.innerHTML = `<p>Failed to load education options. Please try again later.</p>`;
    }
};

//skills tab with dropdown categories and confirmation
const showSkillsDetails = async (user) => {
    personalTab.classList.remove('visible');
    educationTab.classList.remove('visible');
    skillsTab.classList.add('visible');
    attachmentsTab.classList.remove('visible');

    try {
        //Fetching the standardised skills data
        const response = await fetch(backendURL() + '/api/users/data/skills');
        const skillCategories = await response.json();   

        //Building category dropdown
        const categoryOptions = Object.keys(skillCategories)
            .map(cat => `<option value="${cat}">${cat}</option>`)
            .join('');

        visibleDetails.innerHTML = `<form id="skill-form">
            <section class="input-group">
                <label for="skill-category">Skill Category</label>
                <select id="skill-category" name="skill-category">
                    <option value="">Select a category</option>
                    ${categoryOptions}
                </select>
            </section>
            <section class="input-group">
                <label for="skill-name">Skill</label>
                <select id="skill-name" name="skill-name" disabled>
                    <option value="">Select a category first</option>
                </select>
            </section>
            <p id="error-message"></p>
            <button id="add-skill-btn" class="coloured-btn">Add skill</button>
        </form>`;

        //Handling category change – populate skill dropdown
        const categorySelect = document.getElementById('skill-category');
        const skillSelect = document.getElementById('skill-name');

        categorySelect.addEventListener('change', () => {
            const selectedCategory = categorySelect.value;
            skillSelect.innerHTML = '<option value="">Select a skill</option>';

            if (selectedCategory && skillCategories[selectedCategory]) {
                skillSelect.disabled = false;
                skillCategories[selectedCategory].forEach(skill => {
                    const option = document.createElement('option');
                    option.value = skill;
                    option.textContent = skill;
                    skillSelect.appendChild(option);
                });
            } else {
                skillSelect.disabled = true;
                skillSelect.innerHTML = '<option value="">Select a category first</option>';
            }
        });

        const form = document.getElementById('skill-form');
        addSkillSubmitListener(form, user);
    } catch (err) {
        visibleDetails.innerHTML = `<p>Failed to load skills. Please try again later.</p>`;
    }
};

//attachments tab for CV upload with confirmation
const showAttachments = (user) => {
    personalTab.classList.remove('visible');
    educationTab.classList.remove('visible');
    skillsTab.classList.remove('visible');
    attachmentsTab.classList.add('visible');

    const cvUrl = user.cv ? backendURL() + user.cv : null;

    visibleDetails.innerHTML = `<section id="cv-section">
        <h3>Curriculum Vitae (CV)</h3>
        ${cvUrl
            ? `<p>CV uploaded. <a href="${cvUrl}" target="_blank">View current CV</a></p>`
            : `<p>No CV uploaded yet.</p>`
        }
        <form id="cv-upload-form">
            <label for="cv-file">Select a CV file (PDF, DOC, DOCX)</label>
            <input type="file" id="cv-file" name="cv" accept=".pdf,.doc,.docx" />
            <button type="submit" class="coloured-btn">Upload CV</button>
        </form>
        <p id="cv-message"></p>
    </section>`;

    document.getElementById('cv-upload-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const file = document.getElementById('cv-file').files[0];
        const cvMessage = document.getElementById('cv-message');

        if (!file) {
            cvMessage.style.color = 'red';
            cvMessage.textContent = 'Please select a file.';
            return;
        }

        const formData = new FormData();
        formData.append('cv', file);

        try {
            const res = await fetch(backendURL() + '/api/users/upload-cv', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                cvMessage.style.color = 'green';
                cvMessage.textContent = 'CV uploaded successfully!';
                user.cv = data.cv;
            } else {
                cvMessage.style.color = 'red';
                cvMessage.textContent = data.message || 'Upload failed.';
            }
        } catch {
            cvMessage.style.color = 'red';
            cvMessage.textContent = 'Something went wrong. Please try again.';
        }
    });
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const url = backendURL() + '/api/users/profile';

        pageState.style.display = 'flex';
        pageState.innerHTML = 'Loading...';

        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();
        if (response.ok) {
            personalTab.addEventListener('click', () => showPersonalDetails(data.user));
            educationTab.addEventListener('click', () => showEducationDetails(data.user));
            skillsTab.addEventListener('click', () => showSkillsDetails(data.user));
            attachmentsTab.addEventListener('click', () => showAttachments(data.user));

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
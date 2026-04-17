document.addEventListener("DOMContentLoaded", async () => {
   
    const response = await fetch('http://localhost:3000/api/users/profile', {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok) {
        window.location.href = "./login.html";
        return;
    }

    const data = await response.json();
    
    const user = data.user;

    document.getElementById("full-name").textContent = user.firstName + " " + user.lastName;
    document.getElementById("email").textContent = user.email;
    document.getElementById("upload-btn").addEventListener("click", uploadCV);

    document.getElementById("first-name").value = user.firstName;
    document.getElementById("last-name").value = user.lastName;
    document.getElementById("email-input").value = user.email;

    const firstName= document.getElementById("first-name");
    const lastName = document.getElementById("last-name");
    const emailInput = document.getElementById("email-input");
    const gender =  document.getElementById("gender");
    const dateOfBirth = document.getElementById("dob");
    const phone = document.getElementById("phone");
    const location = document.getElementById("location");
    const qualificationLevel = document.getElementById("qualification-level");
    const nqfLevel = document.getElementById("nqfLevel");
    const institution =  document.getElementById("institution");
    const cv = document.getElementById("cv");
    const skills = document.getElementById("skills");
    const qualificationName = document.getElementById("qualification-name");

    phone.value = user.phone;
    gender.value = user.gender;
    location.value = user.location;

    
    const skillsContainer = document.getElementById("skills-container");
    const userSkills = user.skills;
    userSkills.forEach(skill => {
        const li = document.createElement("li");
        li.textContent = skill;
        skillsContainer.append(li);
    });

    const qContainer = document.getElementById("qualifications-container");
    const userQualifications = user.qualifications;
    userQualifications.forEach(q =>{
        const article = document.createElement("article");

        article.innerHTML = `
        <h4>${q.qualificationName}</h4>
        <p>${q.qualificationLevel} (NQF ${q.nqfLevel})</p>
        <p>${q.institution}</p>
        `;

        qContainer.appendChild(article);
    })

    const editBtn = document.getElementById("edit-btn");

    editBtn.addEventListener('click', async()=>{
    
        skills.disabled = false;
        cv.disabled = false;
        institution.disabled = false;
        qualificationLevel.disabled = false;
        qualificationName.disabled = false;
        location.disabled = false;
        phone.disabled = false;
        dateOfBirth.disabled = false;
        gender.disabled = false;
        emailInput.disabled = false;
        firstName.disabled = false;
        lastName.disabled = false;
        document.getElementById("save-profile").style.display = "block";
        editBtn.style.display = "none"
        

    })

    const nqfMap = {
            matric : 4,
            certificate: 5,
            diploma: 6,
            degree: 7,
            honours: 8,
            masters: 9,
            phd: 10
        }
    qualificationLevel.addEventListener("change", ()=>{
        const choice = qualificationLevel.value;
        nqfLevel.value = nqfMap[choice] || "";
    })

    const saveProfileBtn = document.getElementById("save-profile");

    saveProfileBtn.addEventListener("click", async ()=>{
        

        const new_qualification = {
            qualificationName : qualificationName.value.toLowerCase(),
            qualificationLevel: qualificationLevel.value.toLowerCase(),
            nqfLevel : nqfLevel.value,
            institution : institution.value.toLowerCase()
            
        }
        
        const requestBody = {
            firstName : firstName.value,
            lastName : lastName.value,
            location : location.value,
            gender : gender.value,
            phone : phone.value,
            dateOfBirth: dateOfBirth.value,
            skills : skills.value.split(",").map(s=>s.trim().toLowerCase()).filter(s=>s!=""),
        }

        const hasQualification = new_qualification.qualificationName?.trim() && new_qualification.qualificationLevel?.trim() && new_qualification.institution?.trim() && new_qualification.nqfLevel;

        if (hasQualification) {
           requestBody.qualification = new_qualification;
        }

        try{
            
            const res = await fetch('http://localhost:3000/api/users/profile', {
                method: "PUT",
                headers: {"content-type" : "application/json"},
                credentials: 'include',
                body: JSON.stringify(requestBody)
            })
            

        }catch(err){
            
        }
    })

    // cv upload function
window.uploadCV = async function () {
    const cvInput = document.getElementById("cv");
    const file = cvInput.files[0];

    const uploadBtn = document.querySelector("button[onclick='uploadCV()']");

    // no file selected
    if (!file) {
        alert("Please select a CV file");
        uploadBtn.disabled = true;
        return;
    }

    // file size limit (5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
        alert("File too large. Maximum allowed size is 5MB.");
        cvInput.value = "";
        uploadBtn.disabled = true;
        return;
    }

    // optional: restrict file types
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.type)) {
        alert("Only PDF, DOC, or DOCX files are allowed.");
        cvInput.value = "";
        uploadBtn.disabled = true;
        return;
    }

    const formData = new FormData();
    formData.append("cv", file);

    try {
        const response = await fetch("http://localhost:3000/api/users/upload-cv", {
            method: "POST",
            body: formData,
            credentials: "include"
        });

        const data = await response.json();

        if (data.success) {
            alert("CV uploaded successfully!");

            // reset UI
            cvInput.value = "";
            uploadBtn.disabled = true;

            console.log("CV saved at:", data.cv);
        } else {
            alert(data.message || "Upload failed");
        }

    } catch (err) {
        console.error("CV upload error:", err);
        alert("Something went wrong while uploading CV");
    }
};


});







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
    

    //triger cv upload on button click
    document.getElementById("upload-btn").addEventListener("click", async () => {
        await uploadCV();
    });

    const uploadBtn = document.getElementById("upload-btn");
    const firstName= document.getElementById("first-name");
    const lastName = document.getElementById("last-name");
    const emailInput = document.getElementById("email-input");
    const gender = document.getElementById("gender");
    const dateOfBirth = document.getElementById("dob");
    const phone = document.getElementById("phone");
    const location = document.getElementById("location");
    const qualificationLevel = document.getElementById("qualification-level");
    const nqfLevel = document.getElementById("nqfLevel");
    const institution = document.getElementById("institution");
    const cv = document.getElementById("cv");
    const skills = document.getElementById("skills");
    const qualificationName = document.getElementById("qualification-name");

    firstName.value = user.firstName;
    lastName.value = user.lastName;
    emailInput.value = user.email;
    phone.value = user.phone;
    gender.value = user.gender;
    location.value = user.location;
    dateOfBirth.value = user.dateOfBirth 
    ? user.dateOfBirth.split("T")[0] 
    : "";

    // fixing:date input wasnt showing in frontend
    if (user.dateOfBirth) {
        const dob = new Date(user.dateOfBirth);
        // Format date to YYYY-MM-DD for input value
        dateOfBirth.value = dob.toISOString().split("T")[0];
    } else {
        dateOfBirth.value = "";
    }

    //dispalying skills in the profile page
    const skillsContainer = document.getElementById("skills-container");
    const userSkills = user.skills || [];

    skillsContainer.innerHTML = "";

    userSkills.forEach(skill => {
        const li = document.createElement("li");
        li.textContent = skill;

        const removeSkillBtn = document.createElement("button");
        removeSkillBtn.textContent = "x";
        removeSkillBtn.classList.add("delete-skill-btn");
        removeSkillBtn.disabled = true;
        
        removeSkillBtn.addEventListener("click", async ()=>{
            const res = await fetch("http://localhost:3000/api/users/remove-skill",{
                method: "PUT",
                headers : {"content-type": "application/json"},
                credentials: "include",
                body: JSON.stringify({skill: skill})
            });
            const data = await res.json();
            if (res.ok){
                alert(data.message);
                li.remove();
            }else{
                alert(data.error || "Failed to remove skill");
            }
           
        });

        li.appendChild(removeSkillBtn);

        skillsContainer.append(li);
    });

    //showing qualifications in the profile page
    const qContainer = document.getElementById("qualifications-container");
    const userQualifications = user.qualifications || [];

    qContainer.innerHTML = "";

    const title = document.createElement("h3");
    title.textContent = "Your Qualifications";

    const intro = document.createElement("p");
    intro.textContent = "Here is a list of your qualifications:";
    intro.style.color = "#555";
    intro.style.fontSize = "0.9rem";
    intro.style.marginBottom = "10px";

    qContainer.appendChild(title);
    qContainer.appendChild(intro);

    const sortedQualifications = [...userQualifications].reverse();

    sortedQualifications.forEach((q, index) => {

        const article = document.createElement("article");

        article.style.borderLeft = "3px solid #1562f2";
        article.style.padding = "10px 12px";
        article.style.marginBottom = "10px";
        article.style.background = "#f7faff";
        article.style.borderRadius = "6px";

        article.innerHTML = `
            <strong>${index + 1}. ${q.qualificationName}</strong>
            <p>${q.qualificationLevel} (NQF ${q.nqfLevel})</p>
            <p>${q.institution}</p>
        `;
        const removeQBtn = document.createElement("button");
        removeQBtn.textContent = "x";
        removeQBtn.classList.add("delete-qualification-btn");
        removeQBtn.disabled = true;

        removeQBtn.addEventListener("click", async ()=>{
            const res = await fetch("http://localhost:3000/api/users/remove-qualification",{
                method: "PUT",
                headers : {"content-type": "application/json"},
                credentials: "include",
                body: JSON.stringify({qualification: q})
            });
            const data = await res.json();
            if (res.ok){
                alert(data.message);
                article.remove();
            }else{
                alert(data.error || "Failed to remove qualification");
            }
        });

        article.appendChild(removeQBtn);
        qContainer.appendChild(article);

    })

    const editBtn = document.getElementById("edit-btn");

    editBtn.addEventListener('click', async()=>{
       
        document.getElementById("save-profile").style.display = "block";
        editBtn.style.display = "none"


        const deleteSkillButtons = document.querySelectorAll(".delete-skill-btn");
        deleteSkillButtons.forEach(btn=>{
            btn.disabled = false;
        });

        const deleteQualificationButtons = document.querySelectorAll(".delete-qualification-btn");
        deleteQualificationButtons.forEach(btn=>{
            btn.disabled = false;
        })
        
        skills.disabled = false;
        cv.disabled = false;
        institution.disabled = false;
        qualificationLevel.disabled = false;
        qualificationName.disabled = false;
        location.disabled = false;
        phone.disabled = false;
        dateOfBirth.disabled = false;
        gender.disabled = false;
        firstName.disabled = false;
        lastName.disabled = false;
       
        

    })

    const backToDashboard = document.getElementById("back");
    backToDashboard.addEventListener('click', async()=>{
        window.location.href = "/home.html"
    })

    const nqfMap = {
        matric: 4,
        certificate: 5,
        diploma: 6,
        degree: 7,
        honours: 8,
        masters: 9,
        phd: 10
    };

    qualificationLevel.addEventListener("change", () => {
        const choice = qualificationLevel.value;
        nqfLevel.value = nqfMap[choice] || "";
    });

    const saveProfileBtn = document.getElementById("save-profile");

    //saving profile changes to the backend
    saveProfileBtn.addEventListener("click", async () => {

        const new_qualification = {
            qualificationName: qualificationName.value,
            qualificationLevel: qualificationLevel.value,
            nqfLevel: nqfLevel.value,
            institution: institution.value
        };

        const requestBody = {
            firstName: firstName.value,
            lastName: lastName.value,
            location: location.value,
            gender: gender.value,
            phone: phone.value,
            dateOfBirth: dateOfBirth.value,
            skills: skills.value
                .split(",")
                .map(s => s.trim().toLowerCase())
                .filter(s => s !== ""),
        };

        const hasQualification =
            new_qualification.qualificationName?.trim() &&
            new_qualification.qualificationLevel?.trim() &&
            new_qualification.institution?.trim() &&
            new_qualification.nqfLevel;

        if (hasQualification) {
            requestBody.qualification = new_qualification;
        }

        try {
            await fetch('http://localhost:3000/api/users/profile', {
                method: "PUT",
                headers: { "content-type": "application/json" },
                credentials: "include",
                body: JSON.stringify(requestBody)
            })
            const data = await res.json();

            if (!res.ok) {
                alert(data.error || data.message || "Update failed");
                return;
            }

            alert(data.message || "Profile updated successfully");
            
        }catch(err){
            
        }
    });

    //function to upload cv
    async function uploadCV() {
        const cvInput = document.getElementById("cv");
        const file = cvInput.files[0];

        if (!file) {
            alert("Please select a CV file");
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

                const cvLink = document.getElementById("cv-link");

                cvLink.style.display = "block";
                cvLink.href = "http://localhost:3000" + data.cv;
                cvLink.textContent = "View / Download CV";

                alert("CV uploaded successfully!");
            }

        } catch (err) {
            console.error("CV upload error:", err);
        }
    }

    //show cv link if cv exists and is uploaded by the user
    if (user.cv) {
        const cvLink = document.getElementById("cv-link");

        cvLink.style.display = "block";
        cvLink.href = "http://localhost:3000" + user.cv;
        cvLink.textContent = "View / Download CV";
    }

});



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
    location.value = user.gender;
    skills.value = user.skills;
    

    

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
            qualificationName : qualificationName.value,
            qualificationLevel: qualificationLevel.value,
            nqfLevel : nqfLevel.value,
            institution : institution.value

        }

        try{
            

            const res = await fetch('http://localhost:3000/api/users/profile', {
                method: "PUT",
                headers: {"content-type" : "application/json"},
                credentials: 'include',
                body: JSON.stringify({
                    firstName : firstName.value,
                    lastName : lastName.value,
                    location : location.value,
                    qualification: new_qualification,
                    gender : gender.value,
                    skills : skills.value.split(",").map(s=>s.trim()).filter(s=>s!=""),
                    phone : phone.value,
                    dateOfBirth: dateOfBirth.value
                })

            })


        }catch(err){
            
        }
    })

});







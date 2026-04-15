

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
    const qualification = document.getElementById("qualification");
    const nqfLevel = document.getElementById("nqfLevel");
    const institution =  document.getElementById("institution");
    const cv = document.getElementById("cv");
    const skills = document.getElementById("skills");

    const editBtn = document.getElementById("edit-btn");

    editBtn.addEventListener('click', async()=>{
    
        skills.disabled = false;
        cv.disabled = false;
        institution.disabled = false;
        nqfLevel.disabled = false;
        qualification.disabled = false;
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

    const backBtn = document.getElementById("back");
    backBtn.addEventListener('click', async(e)=>{
        e.preventDefault();
        window.location.href = '/home.html';
    })

    const saveProfileBtn = document.getElementById("save-profile");

    saveProfileBtn.addEventListener('click', async (e)=>{
        e.preventDefault();

        const response = await fetch('http://localhost:3000/api/users/profile', {
            method: 'PUT',
            headers: {"Content-Type":"application/json"},
            credentials: 'include',
            body: JSON.stringify({
                dateOfBirth : dateOfBirth.value,
                phone : phone.value,
                location: location.value,
                qualification: qualification.value,
                nqfLevel : nqfLevel.value,
                institution: institution.value,
                skills : skills.value
            })
        })
         
        if (response.ok) {
            location.reload();
        }

    })
});







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

});

const editBtn = document.getElementById("edit-btn");
editBtn.addEventListener('click', async()=>{
    

    document.getElementById("first-name").disabled = false;
    document.getElementById("last-name").disabled = false;
    document.getElementById("email-input").disabled = false;
    document.getElementById("gender").disabled = false;
    document.getElementById("dob").disabled = false;
    document.getElementById("phone").disabled = false;
    document.getElementById("location").disabled = false;
    document.getElementById("qualification").disabled = false;
    document.getElementById("nqfLevel").disabled = false;
    document.getElementById("institution").disabled = false;
    document.getElementById("cv").disabled = false;
    document.getElementById("skills").disabled = false;
    document.getElementById("save-profile").style.display = "block";
    editBtn.style.display = "none"
})

const backBtn = document.getElementById("back");
backBtn.addEventListener('click', async(e)=>{
    e.preventDefault();
    window.location.href = '/home.html';
})
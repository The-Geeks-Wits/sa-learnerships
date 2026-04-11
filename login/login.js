const errorMessage = document.getElementById('error-message');
const form = document.getElementById('login-form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const rememberMe = document.getElementById('remember-me');

const loginButton = document.getElementById('login-btn');
const googleBtn = document.getElementById('google-btn')
googleBtn.addEventListener('click', () => {
    window.location.href = 'http://localhost:3000/google';
});

form.addEventListener('submit', async function (event) {
    event.preventDefault();

    errorMessage.style.display = "none";

    if(!email.value || !password.value){
        errorMessage.style.display = "block";
        errorMessage.textContent = "All fields are required";
        return;
    }
    
    loginButton.disabled = true;
    loginButton.textContent = "Logging in";

    try{
        const response = await fetch('http://localhost:3000/login',{
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                email : email.value,
                password : password.value,
            })
        });
    
        const data = await response.json();
        if (data.success){
            if(data.token){
                
                if (rememberMe && rememberMe.checked) {
                    localStorage.setItem('jwtToken', data.token);
                    localStorage.setItem('rememberedEmail', email.value);
                    localStorage.setItem('rememberMeChecked', 'true');
                } else {
                    sessionStorage.setItem('jwtToken', data.token);
                    localStorage.removeItem('rememberedEmail');
                    localStorage.setItem('rememberMeChecked', 'false');
                }
                
                sessionStorage.setItem('userId', data.user.id);
                sessionStorage.setItem('username', data.user.firstName);
                sessionStorage.setItem('userEmail', data.user.email);
                sessionStorage.setItem('isLoggedIn', 'true');
                setTimeout(()=>{
                   app.get('/dashboard.html', (req, res) => {
                        res.redirect('/adminDash.html');
                    });
                }, 3000);
            }
        }
        
        else{
            errorMessage.style.display = "block";
            errorMessage.textContent = data.error;
        }
    
    }
    catch(err){
            errorMessage.style.display = "block";
            errorMessage.textContent = "Server error";
            console.error("Login error:", err);

        }
    finally{
        loginButton.disabled = false;
        loginButton.textContent = "Login";
    }
});
function loadRememberedCredentials() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberMeChecked = localStorage.getItem('rememberMeChecked');
    
    if (rememberedEmail && rememberMeChecked === 'true') {
        email.value = rememberedEmail;
        //password.value = rememberedPassword;
        
        if (rememberMe) {
            rememberMe.checked = true;
        }
        password.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadRememberedCredentials();
});
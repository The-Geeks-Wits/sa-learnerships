const errorMessage = document.getElementById('error-message');
const form = document.getElementById('registration-form');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const password = document.getElementById('newPassword');
const confirmPassword = document.getElementById('confirmPassword');
const loadingSpinner = document.getElementById('loading-spinner');
const googleBtn = document.getElementById('google-btn');

googleBtn.addEventListener('click', () => {
    window.location.href = 'http://localhost:3000/api/users/google';
});

function isStrong(password) {
    let hasLowercase = false;
    let hasUppercase = false;
    let hasDigit = false;
    let SpecialSymbols = ['!', '@', '#', '$', '%', '&', '*'];
    let HasSpecialSymbols = false;

    for (let x of password) {
        if (x >= 'A' && x <= 'Z') {
            hasUppercase = true;
        } else if (x >= 'a' && x <= 'z') {
            hasLowercase = true;
        } else if (x >= '0' && x <= '9') {
            hasDigit = true;
        } else if (SpecialSymbols.includes(x)) {
            HasSpecialSymbols = true;
        }
    }

    return hasLowercase && hasUppercase && hasDigit && HasSpecialSymbols;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorMessage.style.display = 'none';

    if (password.value !== confirmPassword.value) {
        confirmPassword.style.border = '2px solid red';
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Passwords Do Not Match!';
        return;
    }

    const p = password.value;
    if (p.length < 8) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Password must be at least 8 characters long!';
        return;
    }
    if (!isStrong(p)) {
        errorMessage.style.display = 'block';
        errorMessage.textContent =
            "Password is too weak. It must include at least one uppercase letter, one lowercase letter, one digit and one special symbol {'!','@','#','$','%','&','*'}";
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                password: password.value,
                confirmPassword: confirmPassword.value,
            }),
        });

        if (response.status === 201) {
            const data = await response.json();
            if (data) {
                // The token needs to come from the server as an http only cookie
                window.location.href = 'home.html';
                localStorage.setItem('userId', data.user.id);
            }
        } else {
            errorMessage.style.display = 'block';
            errorMessage.textContent = data.error || data.message || 'Registration failed';
        }
    } catch (err) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = err.message;
    }
});

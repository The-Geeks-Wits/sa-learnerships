import { backendURL, saveToken, getToken } from '../env.config.js';

const errorMessage = document.getElementById('error-message');
const form = document.getElementById('login-form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const rememberMe = document.getElementById('remember-me');
const loginButton = document.getElementById('login-btn');
const googleBtn = document.getElementById('google-btn');
const appName = document.getElementById('app-name');

googleBtn.addEventListener('click', () => {
    window.location.href = backendURL() + '/api/users/google';
});

form.addEventListener('submit', async function (event) {
    event.preventDefault();

    errorMessage.style.display = 'none';

    if (!email.value || !password.value) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'All fields are required';
        return;
    }

    loginButton.disabled = true;
    loginButton.textContent = 'Logging in';

    try {
        const url = backendURL() + '/api/users/login';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value,
                rememberMe: rememberMe.checked,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            saveToken(data.token);
            window.location.href = 'home.html';
        } else {
            const data = await response.json();
            errorMessage.style.display = 'block';
            errorMessage.textContent = data.error || 'Login failed';
        }
    } catch (err) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Server error';
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = 'Login';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberMeChecked = localStorage.getItem('rememberMeChecked');

    if (rememberedEmail && rememberMeChecked === 'true') {
        email.value = rememberedEmail;
        if (rememberMe) {
            rememberMe.checked = true;
        }
        password.focus();
    }
});

appName.addEventListener('click', () => {
    window.location.href = '/index.html';
});

// This file contains scripts for the landing page (index.html file) and should not used anywhere else

const registerBtns = document.getElementsByClassName('register-btn');
const loginBtns = document.getElementsByClassName('login-btn');

for (let i = 0; i < registerBtns.length; i++) {
    registerBtns[i].addEventListener('click', () => {
        window.location.href = 'register.html';
    });
}

for (let i = 0; i < loginBtns.length; i++) {
    loginBtns[i].addEventListener('click', () => {
        window.location.href = 'login.html';
    });
}

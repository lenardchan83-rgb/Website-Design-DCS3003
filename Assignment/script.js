//Get the elements from the page
var loginForm = document.getElementById("loginForm");
var forgotForm = document.getElementById("forgotForm");
var boxTitle = document.getElementById("boxTitle");

var username = document.getElementById("username");
var password = document.getElementById("password");
var usernameError = document.getElementById("usernameError");
var passwordError = document.getElementById("passwordError");
var showPassword = document.getElementById("showPassword");
var message = document.getElementById("message");

var forgotLink = document.getElementById("forgotLink");
var backLink = document.getElementById("backLink");
var forgotEmail = document.getElementById("forgotEmail");
var emailError = document.getElementById("emailError");
var forgotMessage = document.getElementById("forgotMessage");

//Show or hide the password 
showPassword.addEventListener("change", function () {
    if (showPassword.checked) {
        password.type = "text";
    } else {
        password.type = "password";
    }
});

//LOGIN FORM
loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the page from reloading

    var valid = true;
    message.textContent = "";

    // Check username
    if (username.value.trim() === "") {
        usernameError.textContent = "Username is required.";
        username.classList.add("invalid");
        valid = false;
    } else if (username.value.trim().length < 3) {
        usernameError.textContent = "Username must be at least 3 characters.";
        username.classList.add("invalid");
        valid = false;
    } else {
        usernameError.textContent = "";
        username.classList.remove("invalid");
    }

    //Check password
    if (password.value === "") {
        passwordError.textContent = "Password is required.";
        password.classList.add("invalid");
        valid = false;
    } else if (password.value.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters.";
        password.classList.add("invalid");
        valid = false;
    } else {
        passwordError.textContent = "";
        password.classList.remove("invalid");
    }

    //If everything is valid, check the login details
    if (valid) {
        if (username.value.trim() === "student" && password.value === "123456") {
            message.style.color = "green";
            message.textContent = "Login successful! Redirecting...";

            // Wait 1.5 seconds, then go to the website
            setTimeout(function () {
                window.location.href = "https://lms.crescendo.edu.my/my/";
            }, 1500);
        } else {
            message.style.color = "red";
            message.textContent = "Wrong username or password.";
        }
    }
});

//FORGOT PASSWORD: open the reset form
forgotLink.addEventListener("click", function (event) {
    event.preventDefault();             // stop the link from jumping to the top
    loginForm.classList.add("hidden");  // hide the login form
    forgotForm.classList.remove("hidden"); // show the reset form
    boxTitle.textContent = "Reset Password";
});

//FORGOT PASSWORD: go back to login
backLink.addEventListener("click", function (event) {
    event.preventDefault();
    forgotForm.classList.add("hidden");    // hide the reset form
    loginForm.classList.remove("hidden");  // show the login form
    boxTitle.textContent = "Login Page";

    // clear the reset form
    forgotEmail.value = "";
    emailError.textContent = "";
    forgotEmail.classList.remove("invalid");
    forgotMessage.textContent = "";
});

//FORGOT PASSWORD: send reset link
forgotForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var email = forgotEmail.value.trim();
    forgotMessage.textContent = "";

    // A simple email check: text + @ + text + . + text
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
        emailError.textContent = "Email is required.";
        forgotEmail.classList.add("invalid");
    } else if (!emailPattern.test(email)) {
        emailError.textContent = "Please enter a valid email.";
        forgotEmail.classList.add("invalid");
    } else {
        emailError.textContent = "";
        forgotEmail.classList.remove("invalid");

        // This is only a demo message. A real website would send the email from a server.
        forgotMessage.style.color = "green";
        forgotMessage.textContent = "A reset link has been sent to " + email;
    }
});
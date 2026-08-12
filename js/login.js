document.addEventListener("DOMContentLoaded", () => {

    const loginForm =
        document.getElementById("loginForm");

    const countryCode =
        document.getElementById("countryCode");

    const phone =
        document.getElementById("phone");

    const password =
        document.getElementById("password");

    const togglePassword =
        document.getElementById("togglePassword");

    const loginBtn =
        document.getElementById("loginBtn");

    const loginBtnText =
        document.getElementById("loginBtnText");

    const loginLoader =
        document.getElementById("loginLoader");

    const phoneError =
        document.getElementById("phoneError");

    const passwordError =
        document.getElementById("passwordError");

    const loginMessage =
        document.getElementById("loginMessage");


    // =====================================================
    // PHONE - ONLY NUMBERS
    // =====================================================

    phone.addEventListener("input", () => {

        phone.value =
            phone.value
                .replace(/\D/g, "")
                .slice(0, 10);

        phoneError.textContent = "";

    });


    // =====================================================
    // PASSWORD SHOW / HIDE
    // =====================================================

    togglePassword.addEventListener("click", () => {

        const isPassword =
            password.type === "password";

        password.type =
            isPassword
                ? "text"
                : "password";


        togglePassword.innerHTML =
            isPassword
                ? '<i class="fa-solid fa-eye-slash"></i>'
                : '<i class="fa-solid fa-eye"></i>';

    });


    // =====================================================
    // CLEAR ERROR
    // =====================================================

    function clearErrors() {

        phoneError.textContent = "";

        passwordError.textContent = "";

        loginMessage.textContent = "";

        loginMessage.className =
            "login-message";

    }


    // =====================================================
    // SHOW ERROR
    // =====================================================

    function showMessage(message) {

        loginMessage.textContent = message;

        loginMessage.className =
            "login-message error";

    }


    // =====================================================
    // LOGIN
    // =====================================================

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        clearErrors();


        const phoneValue =
            phone.value.trim();

        const passwordValue =
            password.value;


        // =================================================
        // PHONE VALIDATION
        // =================================================

        if (!/^\d{10}$/.test(phoneValue)) {

            phoneError.textContent =
                "Enter a valid 10-digit mobile number.";

            phone.focus();

            return;

        }


        // =================================================
        // PASSWORD VALIDATION
        // =================================================

        if (passwordValue.length < 8) {

            passwordError.textContent =
                "Password must contain at least 8 characters.";

            password.focus();

            return;

        }


        // =================================================
        // LOADING
        // =================================================

        loginBtn.disabled = true;

        loginBtnText.textContent =
            "Logging in...";

        loginLoader.style.display =
            "inline-block";


        /*
         * -------------------------------------------------
         * DEMO LOGIN
         * -------------------------------------------------
         *
         * Replace this section with your backend API.
         *
         * DO NOT store a real password in frontend JS.
         */

        try {

            await new Promise(resolve => {

                setTimeout(resolve, 700);

            });


            /*
             * Demo navigation.
             *
             * Replace with successful backend response.
             */

            window.location.href =
                "Dashboard.html";


        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            showMessage(
                "Unable to login. Please try again."
            );

            loginBtn.disabled = false;

            loginBtnText.textContent =
                "Login";

            loginLoader.style.display =
                "none";

        }

    });

});
const form = document.getElementById("form")
const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")
const confirmPasswordInput = document.getElementById("confirmPassword")
const emailError = document.getElementById("emailError")
const passwordError = document.getElementById("passwordError")
const confirmPasswordError = document.getElementById("confirmPasswordError")
const button = document.getElementById("btn")
const formMessage = document.getElementById("formMsg")
const r1 = document.getElementById("r1")
const r2 = document.getElementById("r2")
const r3 = document.getElementById("r3")
const r4 = document.getElementById("r4")

// Password toggle elements
const togglePassword = document.getElementById("togglePassword")
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword")

// Social login buttons
const googleBtn = document.getElementById("googleBtn")
const githubBtn = document.getElementById("githubBtn")
const microsoftBtn = document.getElementById("microsoftBtn")

// OTP Modal elements
const otpModal = document.getElementById("otpModal")
const otpOverlay = document.getElementById("otpOverlay")
const otpEmail = document.getElementById("otpEmail")
const otpVerifyBtn = document.getElementById("otpVerifyBtn")
const otpResendBtn = document.getElementById("otpResendBtn")
const otpError = document.getElementById("otpError")
const timerCount = document.getElementById("timerCount")
const otpInputs = document.querySelectorAll(".otp-input")

// OTP state
let generatedOTP = ""
let timerInterval = null
let userEmail = ""


// ==================== EMAIL VALIDATION ====================
function checkEmail() {
    let emailValue = emailInput.value.trim()

    if (emailValue === "") {
        emailError.textContent = "This field cannot be empty!"
        emailInput.className = "invalid"
        return false
    }

    // Improved email validation with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailValue)) {
        emailError.textContent = "Please enter a valid email address"
        emailInput.className = "invalid"
        return false
    }

    emailError.textContent = ""
    emailInput.className = "valid"
    return true
}


// ==================== PASSWORD VALIDATION ====================

// Helper functions
function hasUpperCase(text) {
    return text.toLowerCase() !== text
}

function hasLowerCase(text) {
    return text.toUpperCase() !== text
}

function hasNumber(text) {
    return /\d/.test(text)
}

function checkPassword() {
    let passwordValue = passwordInput.value

    // Track if all requirements are met
    let allValid = true

    // Check for length
    if (passwordValue.length >= 8) {
        r1.className = "req ok"
    } else {
        r1.className = "req"
        allValid = false
    }

    // Check for uppercase
    if (hasUpperCase(passwordValue)) {
        r2.className = "req ok"
    } else {
        r2.className = "req"
        allValid = false
    }

    // Check for lowercase
    if (hasLowerCase(passwordValue)) {
        r3.className = "req ok"
    } else {
        r3.className = "req"
        allValid = false
    }

    // Check for number
    if (hasNumber(passwordValue)) {
        r4.className = "req ok"
    } else {
        r4.className = "req"
        allValid = false
    }

    // Update password field styling
    if (passwordValue === "") {
        passwordInput.className = ""
        passwordError.textContent = ""
        return false
    } else if (allValid) {
        passwordInput.className = "valid"
        passwordError.textContent = ""
        return true
    } else {
        passwordInput.className = "invalid"
        passwordError.textContent = ""
        return false
    }
}


// ==================== CONFIRM PASSWORD VALIDATION ====================
function checkConfirmPassword() {
    const passwordValue = passwordInput.value
    const confirmPasswordValue = confirmPasswordInput.value

    if (confirmPasswordValue === "") {
        confirmPasswordInput.className = ""
        confirmPasswordError.textContent = ""
        return false
    }

    if (passwordValue !== confirmPasswordValue) {
        confirmPasswordInput.className = "invalid"
        confirmPasswordError.textContent = "Passwords do not match"
        return false
    }

    confirmPasswordInput.className = "valid"
    confirmPasswordError.textContent = ""
    return true
}


// ==================== PASSWORD VISIBILITY TOGGLE ====================
function togglePasswordVisibility(inputField, toggleButton) {
    const eyeIcon = toggleButton.querySelector('.icon-eye')
    const eyeSlashIcon = toggleButton.querySelector('.icon-eye-slash')

    if (inputField.type === 'password') {
        inputField.type = 'text'
        eyeIcon.style.display = 'none'
        eyeSlashIcon.style.display = 'block'
    } else {
        inputField.type = 'password'
        eyeIcon.style.display = 'block'
        eyeSlashIcon.style.display = 'none'
    }
}

togglePassword.addEventListener('click', function () {
    togglePasswordVisibility(passwordInput, togglePassword)
})

toggleConfirmPassword.addEventListener('click', function () {
    togglePasswordVisibility(confirmPasswordInput, toggleConfirmPassword)
})


// ==================== BUTTON STATE MANAGEMENT ====================
function updateButtonState() {
    const emailValid = checkEmail()
    const passwordValid = checkPassword()
    const confirmPasswordValid = checkConfirmPassword()

    if (emailValid && passwordValid && confirmPasswordValid) {
        button.disabled = false
    } else {
        button.disabled = true
    }
}


// ==================== EVENT LISTENERS ====================
emailInput.addEventListener("input", function () {
    if (emailInput.value.trim() !== "") {
        checkEmail()
    } else {
        emailInput.className = ""
        emailError.textContent = ""
    }
    updateButtonState()
})

passwordInput.addEventListener("input", function () {
    checkPassword()
    if (confirmPasswordInput.value !== "") {
        checkConfirmPassword()
    }
    updateButtonState()
})

confirmPasswordInput.addEventListener("input", function () {
    checkConfirmPassword()
    updateButtonState()
})


// ==================== OTP FUNCTIONALITY ====================
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

function showOTPModal(email) {
    userEmail = email
    otpEmail.textContent = email
    generatedOTP = generateOTP()

    // Log OTP to console (simulating email send)
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("📧 EMAIL VERIFICATION")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("To:", email)
    console.log("Your verification code is:", generatedOTP)
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    otpModal.classList.add('active')
    otpInputs[0].focus()
    startOTPTimer()
}

function hideOTPModal() {
    otpModal.classList.remove('active')
    clearInterval(timerInterval)
    otpInputs.forEach(input => {
        input.value = ""
        input.classList.remove('filled')
    })
    otpError.textContent = ""
}

function startOTPTimer() {
    let timeLeft = 60
    timerCount.textContent = timeLeft
    otpResendBtn.disabled = true

    timerInterval = setInterval(() => {
        timeLeft--
        timerCount.textContent = timeLeft

        if (timeLeft <= 0) {
            clearInterval(timerInterval)
            otpResendBtn.disabled = false
        }
    }, 1000)
}

// OTP Input handling with auto-focus
otpInputs.forEach((input, index) => {
    input.addEventListener('input', function (e) {
        const value = e.target.value

        // Only allow numbers
        if (!/^\d*$/.test(value)) {
            e.target.value = value.replace(/\D/g, '')
            return
        }

        if (value) {
            e.target.classList.add('filled')
            // Move to next input
            if (index < otpInputs.length - 1) {
                otpInputs[index + 1].focus()
            }
        } else {
            e.target.classList.remove('filled')
        }

        otpError.textContent = ""
    })

    input.addEventListener('keydown', function (e) {
        // Handle backspace
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            otpInputs[index - 1].focus()
        }
    })

    // Handle paste
    input.addEventListener('paste', function (e) {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').slice(0, 6)

        if (/^\d+$/.test(pastedData)) {
            pastedData.split('').forEach((char, i) => {
                if (otpInputs[i]) {
                    otpInputs[i].value = char
                    otpInputs[i].classList.add('filled')
                }
            })
            if (pastedData.length < 6) {
                otpInputs[pastedData.length].focus()
            }
        }
    })
})

// Verify OTP
otpVerifyBtn.addEventListener('click', function () {
    const enteredOTP = Array.from(otpInputs).map(input => input.value).join('')

    if (enteredOTP.length !== 6) {
        otpError.textContent = "Please enter complete 6-digit code"
        return
    }

    if (enteredOTP === generatedOTP) {
        otpError.textContent = ""
        otpError.style.color = "#7CFFB2"
        otpError.textContent = "✓ Verification successful!"

        setTimeout(() => {
            hideOTPModal()
            formMessage.textContent = "✓ Account created successfully!"
            formMessage.style.color = "#7CFFB2"

            // Reset form after success
            setTimeout(() => {
                form.reset()
                emailInput.className = ""
                passwordInput.className = ""
                confirmPasswordInput.className = ""
                r1.className = "req"
                r2.className = "req"
                r3.className = "req"
                r4.className = "req"
                button.disabled = true
                formMessage.textContent = ""
            }, 2500)
        }, 1000)
    } else {
        otpError.textContent = "✗ Invalid code. Please try again."
        otpInputs.forEach(input => {
            input.value = ""
            input.classList.remove('filled')
        })
        otpInputs[0].focus()
    }
})

// Resend OTP
otpResendBtn.addEventListener('click', function () {
    generatedOTP = generateOTP()
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("📧 RESENT VERIFICATION CODE")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("Your new code is:", generatedOTP)
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    startOTPTimer()
    otpError.textContent = ""
    otpInputs.forEach(input => {
        input.value = ""
        input.classList.remove('filled')
    })
    otpInputs[0].focus()
})

// Close modal on overlay click
otpOverlay.addEventListener('click', function () {
    if (confirm('Are you sure you want to cancel verification?')) {
        hideOTPModal()
        formMessage.textContent = ""
    }
})


// ==================== FORM SUBMISSION ====================
form.addEventListener("submit", function (e) {
    e.preventDefault()

    const emailValid = checkEmail()
    const passwordValid = checkPassword()
    const confirmPasswordValid = checkConfirmPassword()

    if (emailValid && passwordValid && confirmPasswordValid) {
        formMessage.textContent = "Sending verification code..."
        formMessage.style.color = "#2d6bff"

        // Simulate sending OTP
        setTimeout(() => {
            showOTPModal(emailInput.value)
            formMessage.textContent = ""
        }, 800)
    } else {
        formMessage.textContent = "Please fix the errors above"
        formMessage.style.color = "#ff6b6b"
    }
})


// ==================== SOCIAL LOGIN HANDLERS ====================
googleBtn.addEventListener('click', function () {
    console.log("🔐 Google Sign-In initiated")
    console.log("In production, this would redirect to Google OAuth flow")
    alert("Google Sign-In\n\nThis would connect to Google OAuth in production.\nYou'll need to configure Google Cloud Console credentials.")
})

githubBtn.addEventListener('click', function () {
    console.log("🔐 GitHub Sign-In initiated")
    console.log("In production, this would redirect to GitHub OAuth flow")
    alert("GitHub Sign-In\n\nThis would connect to GitHub OAuth in production.\nYou'll need to register your app on GitHub.")
})

microsoftBtn.addEventListener('click', function () {
    console.log("🔐 Microsoft Sign-In initiated")
    console.log("In production, this would redirect to Microsoft OAuth flow")
    alert("Microsoft Sign-In\n\nThis would connect to Microsoft OAuth in production.\nYou'll need to register your app in Azure AD.")
})
// Authentication JavaScript for EduMorph platform

// DOM Elements
const loginForm = document.getElementById("login-form")
const signupForm = document.getElementById("signup-form")
const passwordInput = document.getElementById("password")
const confirmPasswordInput = document.getElementById("confirmPassword")
const passwordStrength = document.getElementById("password-strength")

// Initialize authentication
document.addEventListener("DOMContentLoaded", () => {
  initializeAuthForms()
  initializePasswordValidation()
  checkExistingAuth()
})

// Initialize authentication forms
function initializeAuthForms() {
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  if (signupForm) {
    signupForm.addEventListener("submit", handleSignup)
  }

  // Social authentication buttons
  const googleBtn = document.querySelector(".btn-google")
  const facebookBtn = document.querySelector(".btn-facebook")

  if (googleBtn) {
    googleBtn.addEventListener("click", () => handleSocialAuth("google"))
  }

  if (facebookBtn) {
    facebookBtn.addEventListener("click", () => handleSocialAuth("facebook"))
  }
}

// Handle login form submission
function handleLogin(e) {
  e.preventDefault()

  const formData = new FormData(loginForm)
  const email = formData.get("email")
  const password = formData.get("password")
  const remember = formData.get("remember")

  // Validate inputs
  if (!email || !password) {
    showNotification("Please fill in all fields", "error")
    return
  }

  // Simulate authentication
  authenticateUser(email, password, remember)
}

// Handle signup form submission
function handleSignup(e) {
  e.preventDefault()

  const formData = new FormData(signupForm)
  const firstName = formData.get("firstName")
  const lastName = formData.get("lastName")
  const email = formData.get("email")
  const password = formData.get("password")
  const confirmPassword = formData.get("confirmPassword")
  const role = formData.get("role")
  const terms = formData.get("terms")

  // Validate inputs
  if (!firstName || !lastName || !email || !password || !confirmPassword || !role) {
    showNotification("Please fill in all fields", "error")
    return
  }

  if (!terms) {
    showNotification("Please accept the terms and conditions", "error")
    return
  }

  if (password !== confirmPassword) {
    showNotification("Passwords do not match", "error")
    return
  }

  if (!isPasswordStrong(password)) {
    showNotification("Please choose a stronger password", "error")
    return
  }

  // Create new user account
  createUserAccount({
    firstName,
    lastName,
    email,
    password,
    role,
  })
}

// Authenticate user
function authenticateUser(email, password, remember = false) {
  // Simulate API call delay
  const submitBtn = document.querySelector('button[type="submit"]')
  const originalText = submitBtn.textContent
  submitBtn.textContent = "Signing in..."
  submitBtn.disabled = true

  setTimeout(() => {
    // Check if user exists in localStorage (for demo purposes)
    const users = getFromStorage("edumorph_users") || []
    const user = users.find((u) => u.email === email)

    if (user && user.password === password) {
      // Successful login
      const sessionData = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        loginTime: new Date().toISOString(),
      }

      saveToStorage("edumorph_user", sessionData)

      if (remember) {
        saveToStorage("edumorph_remember", true)
      }

      showNotification("Login successful! Redirecting...", "success")

      setTimeout(() => {
        window.location.href = "dashboard.html"
      }, 1500)
    } else {
      // Failed login
      showNotification("Invalid email or password", "error")
      submitBtn.textContent = originalText
      submitBtn.disabled = false
    }
  }, 1500)
}

// Create user account
function createUserAccount(userData) {
  const submitBtn = document.querySelector('button[type="submit"]')
  const originalText = submitBtn.textContent
  submitBtn.textContent = "Creating account..."
  submitBtn.disabled = true

  setTimeout(() => {
    // Check if user already exists
    const users = getFromStorage("edumorph_users") || []
    const existingUser = users.find((u) => u.email === userData.email)

    if (existingUser) {
      showNotification("An account with this email already exists", "error")
      submitBtn.textContent = originalText
      submitBtn.disabled = false
      return
    }

    // Create new user
    const newUser = {
      id: generateId(),
      ...userData,
      createdAt: new Date().toISOString(),
      enrolledCourses: [],
      completedCourses: [],
      preferences: {
        theme: "light",
        notifications: true,
        language: "en",
      },
    }

    users.push(newUser)
    saveToStorage("edumorph_users", users)

    // Auto-login the new user
    const sessionData = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      loginTime: new Date().toISOString(),
    }

    saveToStorage("edumorph_user", sessionData)

    showNotification("Account created successfully! Redirecting...", "success")

    setTimeout(() => {
      window.location.href = "dashboard.html"
    }, 1500)
  }, 1500)
}

// Handle social authentication
function handleSocialAuth(provider) {
  showNotification(`${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication coming soon!`, "info")
}

// Password validation
function initializePasswordValidation() {
  if (passwordInput) {
    passwordInput.addEventListener("input", function () {
      const password = this.value
      updatePasswordStrength(password)
    })
  }

  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener("input", function () {
      const password = passwordInput.value
      const confirmPassword = this.value

      if (confirmPassword && password !== confirmPassword) {
        this.setCustomValidity("Passwords do not match")
      } else {
        this.setCustomValidity("")
      }
    })
  }
}

// Update password strength indicator
function updatePasswordStrength(password) {
  if (!passwordStrength) return

  const strength = calculatePasswordStrength(password)

  passwordStrength.className = "password-strength"

  if (password.length === 0) {
    passwordStrength.style.width = "0%"
    return
  }

  if (strength < 3) {
    passwordStrength.classList.add("weak")
    passwordStrength.style.width = "33%"
  } else if (strength < 5) {
    passwordStrength.classList.add("medium")
    passwordStrength.style.width = "66%"
  } else {
    passwordStrength.classList.add("strong")
    passwordStrength.style.width = "100%"
  }
}

// Calculate password strength
function calculatePasswordStrength(password) {
  let strength = 0

  if (password.length >= 8) strength++
  if (password.match(/[a-z]/)) strength++
  if (password.match(/[A-Z]/)) strength++
  if (password.match(/[0-9]/)) strength++
  if (password.match(/[^a-zA-Z0-9]/)) strength++

  return strength
}

// Check if password is strong enough
function isPasswordStrong(password) {
  return calculatePasswordStrength(password) >= 3
}

// Check for existing authentication
function checkExistingAuth() {
  const user = getFromStorage("edumorph_user")

  if (user) {
    // User is already logged in, redirect to dashboard
    window.location.href = "dashboard.html"
  }
}

// Utility functions (imported from main script)
function showNotification(message, type) {
  if (window.EduMorph && window.EduMorph.showNotification) {
    window.EduMorph.showNotification(message, type)
  }
}

function generateId() {
  if (window.EduMorph && window.EduMorph.generateId) {
    return window.EduMorph.generateId()
  }
  return Math.random().toString(36).substr(2, 9)
}

function saveToStorage(key, data) {
  if (window.EduMorph && window.EduMorph.saveToStorage) {
    return window.EduMorph.saveToStorage(key, data)
  }
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error("Error saving to storage:", error)
    return false
  }
}

function getFromStorage(key) {
  if (window.EduMorph && window.EduMorph.getFromStorage) {
    return window.EduMorph.getFromStorage(key)
  }
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Error reading from storage:", error)
    return null
  }
}

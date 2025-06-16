// Global state management
const AppState = {
  user: null,
  courses: [],
  isLoggedIn: false,
}

// Sample course data
const sampleCourses = [
  {
    id: 1,
    title: "Advanced Mathematics",
    instructor: "Dr. Sarah Johnson",
    rating: 4.9,
    students: 2847,
    duration: "12 weeks",
    level: "Advanced",
    category: "Mathematics",
    price: 89,
    image: "📊",
  },
  {
    id: 2,
    title: "Machine Learning Fundamentals",
    instructor: "Prof. Michael Chen",
    rating: 4.8,
    students: 5234,
    duration: "16 weeks",
    level: "Intermediate",
    category: "Computer Science",
    price: 129,
    image: "🤖",
  },
  {
    id: 3,
    title: "Creative Writing Workshop",
    instructor: "Emma Rodriguez",
    rating: 4.7,
    students: 1892,
    duration: "8 weeks",
    level: "Beginner",
    category: "Literature",
    price: 59,
    image: "✍️",
  },
]

// Utility functions
function showAlert(message, type = "info") {
  const alertDiv = document.createElement("div")
  alertDiv.className = `alert alert-${type}`
  alertDiv.textContent = message

  const container = document.querySelector(".container")
  if (container) {
    container.insertBefore(alertDiv, container.firstChild)

    setTimeout(() => {
      alertDiv.remove()
    }, 5000)
  }
}

function showSpinner(button) {
  const spinner = document.createElement("span")
  spinner.className = "spinner"
  button.insertBefore(spinner, button.firstChild)
  button.disabled = true
}

function hideSpinner(button) {
  const spinner = button.querySelector(".spinner")
  if (spinner) {
    spinner.remove()
  }
  button.disabled = false
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

// Local storage helpers
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error("Error saving to storage:", error)
    return false
  }
}

function getFromStorage(key) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Error reading from storage:", error)
    return null
  }
}

// Authentication functions
function login(email, password) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate API call
      if (email && password) {
        const user = {
          id: Date.now(),
          email: email,
          name: email.split("@")[0],
          role: "student",
        }

        AppState.user = user
        AppState.isLoggedIn = true
        saveToStorage("edumorph_user", user)
        saveToStorage("edumorph_session", true)

        resolve({ success: true, user })
      } else {
        resolve({ success: false, error: "Invalid credentials" })
      }
    }, 1000)
  })
}

function signup(userData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate API call
      const user = {
        id: Date.now(),
        ...userData,
      }

      AppState.user = user
      AppState.isLoggedIn = true
      saveToStorage("edumorph_user", user)
      saveToStorage("edumorph_session", true)

      resolve({ success: true, user })
    }, 1000)
  })
}

function logout() {
  AppState.user = null
  AppState.isLoggedIn = false
  localStorage.removeItem("edumorph_user")
  localStorage.removeItem("edumorph_session")
  window.location.href = "index.html"
}

// Course functions
function loadCourses() {
  const coursesGrid = document.getElementById("coursesGrid")
  if (!coursesGrid) return

  coursesGrid.innerHTML = ""

  sampleCourses.forEach((course) => {
    const courseCard = createCourseCard(course)
    coursesGrid.appendChild(courseCard)
  })
}

function createCourseCard(course) {
  const card = document.createElement("div")
  card.className = "course-card"

  card.innerHTML = `
        <div class="course-image">
            ${course.image}
        </div>
        <div class="course-content">
            <h3 class="course-title">${course.title}</h3>
            <p class="course-instructor">by ${course.instructor}</p>
            <div class="course-meta">
                <div class="course-rating">
                    <i class="fas fa-star"></i>
                    <span>${course.rating}</span>
                </div>
                <div>
                    <i class="fas fa-users"></i>
                    <span>${course.students.toLocaleString()}</span>
                </div>
                <div>
                    <i class="fas fa-clock"></i>
                    <span>${course.duration}</span>
                </div>
            </div>
            <div class="course-price">$${course.price}</div>
            <button class="btn-primary" onclick="enrollCourse(${course.id})">
                Enroll Now
            </button>
        </div>
    `

  return card
}

function enrollCourse(courseId) {
  if (!AppState.isLoggedIn) {
    showAlert("Please login to enroll in courses", "error")
    setTimeout(() => {
      window.location.href = "login.html"
    }, 2000)
    return
  }

  const course = sampleCourses.find((c) => c.id === courseId)
  if (course) {
    showAlert(`Successfully enrolled in ${course.title}!`, "success")

    // Save enrollment to localStorage
    const enrollments = getFromStorage("enrollments") || []
    enrollments.push({
      courseId: courseId,
      userId: AppState.user.id,
      enrolledAt: new Date().toISOString(),
      progress: 0,
    })
    saveToStorage("enrollments", enrollments)
  }
}

// Form validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function validatePassword(password) {
  return password.length >= 8
}

// DOM Elements
const hamburger = document.getElementById("hamburger")
const navMenu = document.getElementById("nav-menu")
const contactForm = document.getElementById("contact-form")

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation()
  initializeContactForm()
  initializeSmoothScrolling()
  checkAuthStatus()
  initApp()
  initAIAssistant()
  initAccessibility()
})

// Navigation functionality
function initializeNavigation() {
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active")
      hamburger.classList.toggle("active")
    })
  }

  // Close mobile menu when clicking on links
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("active")) {
        navMenu.classList.remove("active")
        hamburger.classList.remove("active")
      }
    })
  })
}

// Contact form functionality
function initializeContactForm() {
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const formData = new FormData(contactForm)
      const name = formData.get("name")
      const email = formData.get("email")
      const message = formData.get("message")

      // Simulate form submission
      showNotification("Thank you for your message! We'll get back to you soon.", "success")
      contactForm.reset()
    })
  }
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]')

  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href").substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Check authentication status
function checkAuthStatus() {
  const user = localStorage.getItem("edumorph_user")
  const authButtons = document.querySelector(".nav-auth")

  if (user && authButtons) {
    const userData = JSON.parse(user)
    authButtons.innerHTML = `
            <span>Welcome, ${userData.firstName}!</span>
            <a href="dashboard.html" class="btn btn-primary">Dashboard</a>
            <button onclick="logout()" class="btn btn-outline">Logout</button>
        `
  }
}

// Notification system
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification")
  existingNotifications.forEach((notification) => notification.remove())

  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="notification-close">×</button>
        </div>
    `

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `

  // Add to document
  document.body.appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove()
    }
  }, 5000)
}

// Add CSS for notification animation
const style = document.createElement("style")
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
`
document.head.appendChild(style)

// Initialize app
function initApp() {
  // Check if user is logged in
  const savedUser = getFromStorage("edumorph_user")
  const isLoggedIn = getFromStorage("edumorph_session")

  if (savedUser && isLoggedIn) {
    AppState.user = savedUser
    AppState.isLoggedIn = true
  }

  // Load courses on homepage
  loadCourses()
}

// AI Assistant functionality
function initAIAssistant() {
  const messages = []

  function addMessage(content, isUser = false) {
    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${isUser ? "user-message" : "ai-message"}`
    messageDiv.innerHTML = `
            <div class="message-content">
                ${content}
            </div>
            <div class="message-time">
                ${new Date().toLocaleTimeString()}
            </div>
        `

    const chatMessages = document.getElementById("chatMessages")
    if (chatMessages) {
      chatMessages.appendChild(messageDiv)
      chatMessages.scrollTop = chatMessages.scrollHeight
    }

    messages.push({ content, isUser, timestamp: new Date() })
  }

  function simulateAIResponse(userMessage) {
    const responses = [
      "That's a great question! Let me help you understand that concept better.",
      "I can see you're working hard on your studies. Here's what I recommend...",
      "Based on your learning style, I suggest trying this approach...",
      "Let me break that down into simpler steps for you.",
      "That's exactly the kind of thinking that will help you succeed!",
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    setTimeout(() => {
      addMessage(randomResponse, false)
    }, 1000)
  }

  // Expose functions globally
  window.addMessage = addMessage
  window.simulateAIResponse = simulateAIResponse
}

// Accessibility features
function initAccessibility() {
  // High contrast mode
  function toggleHighContrast() {
    document.body.classList.toggle("high-contrast")
    saveToStorage("highContrast", document.body.classList.contains("high-contrast"))
  }

  // Font size adjustment
  function adjustFontSize(increase = true) {
    const currentSize = Number.parseInt(getComputedStyle(document.body).fontSize)
    const newSize = increase ? currentSize + 2 : Math.max(currentSize - 2, 12)
    document.body.style.fontSize = newSize + "px"
    saveToStorage("fontSize", newSize)
  }

  // Text-to-speech
  function speakText(text) {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      speechSynthesis.speak(utterance)
    }
  }

  // Load saved accessibility preferences
  const savedHighContrast = getFromStorage("highContrast")
  const savedFontSize = getFromStorage("fontSize")

  if (savedHighContrast) {
    document.body.classList.add("high-contrast")
  }

  if (savedFontSize) {
    document.body.style.fontSize = savedFontSize + "px"
  }

  // Expose functions globally
  window.toggleHighContrast = toggleHighContrast
  window.adjustFontSize = adjustFontSize
  window.speakText = speakText
}

// Export functions for use in other files
window.EduMorph = {
  showNotification,
  logout,
  formatDate,
  formatTime,
  generateId,
  saveToStorage,
  getFromStorage,
}

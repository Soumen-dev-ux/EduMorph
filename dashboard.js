// Dashboard JavaScript for EduMorph platform

// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
  checkAuthentication()
  loadUserData()
  loadDashboardData()
  initializeDashboard()
})

// Check if user is authenticated
function checkAuthentication() {
  const user = getFromStorage("edumorph_user")

  if (!user) {
    window.location.href = "login.html"
    return
  }

  // Update user name in header
  const userNameElement = document.getElementById("user-name")
  if (userNameElement) {
    userNameElement.textContent = user.firstName
  }
}

// Load user data
function loadUserData() {
  const user = getFromStorage("edumorph_user")
  if (!user) return

  // Load user's courses and progress
  const users = getFromStorage("edumorph_users") || []
  const fullUserData = users.find((u) => u.id === user.id)

  if (fullUserData) {
    updateDashboardStats(fullUserData)
  }
}

// Update dashboard statistics
function updateDashboardStats(userData) {
  const enrolledCourses = userData.enrolledCourses || []
  const completedCourses = userData.completedCourses || []

  // Calculate stats
  const totalEnrolled = enrolledCourses.length
  const totalCompleted = completedCourses.length
  const studyHours = calculateStudyHours(enrolledCourses)
  const averageProgress = calculateAverageProgress(enrolledCourses)

  // Update DOM elements
  updateStatElement("courses-enrolled", totalEnrolled)
  updateStatElement("courses-completed", totalCompleted)
  updateStatElement("study-hours", studyHours)
  updateStatElement("progress-score", `${averageProgress}%`)
}

// Update individual stat element
function updateStatElement(id, value) {
  const element = document.getElementById(id)
  if (element) {
    element.textContent = value
  }
}

// Calculate total study hours
function calculateStudyHours(enrolledCourses) {
  return enrolledCourses.reduce((total, course) => {
    return total + (course.studyTime || 0)
  }, 0)
}

// Calculate average progress
function calculateAverageProgress(enrolledCourses) {
  if (enrolledCourses.length === 0) return 0

  const totalProgress = enrolledCourses.reduce((total, course) => {
    return total + (course.progress || 0)
  }, 0)

  return Math.round(totalProgress / enrolledCourses.length)
}

// Load dashboard data
function loadDashboardData() {
  loadCurrentCourses()
  loadAIRecommendations()
  loadRecentActivity()
}

// Load current courses
function loadCurrentCourses() {
  const user = getFromStorage("edumorph_user")
  if (!user) return

  const users = getFromStorage("edumorph_users") || []
  const fullUserData = users.find((u) => u.id === user.id)
  const enrolledCourses = fullUserData?.enrolledCourses || []

  const coursesContainer = document.getElementById("current-courses")
  if (!coursesContainer) return

  if (enrolledCourses.length === 0) {
    coursesContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <h3>No courses yet</h3>
                <p>Start your learning journey by enrolling in a course</p>
                <a href="courses.html" class="btn btn-primary">Browse Courses</a>
            </div>
        `
    return
  }

  coursesContainer.innerHTML = enrolledCourses
    .map(
      (course) => `
        <div class="course-card">
            <div class="course-image">
                <i class="fas fa-${getCourseIcon(course.category)}"></i>
            </div>
            <div class="course-content">
                <h3 class="course-title">${course.title}</h3>
                <p class="course-description">${course.description}</p>
                <div class="course-meta">
                    <span><i class="fas fa-clock"></i> ${course.duration}</span>
                    <span><i class="fas fa-signal"></i> ${course.level}</span>
                </div>
                <div class="course-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${course.progress || 0}%"></div>
                    </div>
                    <span>${course.progress || 0}% Complete</span>
                </div>
                <a href="#" class="btn btn-primary" onclick="continueCourse('${course.id}')">Continue Learning</a>
            </div>
        </div>
    `,
    )
    .join("")
}

// Load AI recommendations
function loadAIRecommendations() {
  const recommendationsContainer = document.getElementById("ai-recommendations")
  if (!recommendationsContainer) return

  const recommendations = generateAIRecommendations()

  recommendationsContainer.innerHTML = recommendations
    .map(
      (rec) => `
        <div class="recommendation-card">
            <div class="recommendation-icon">
                <i class="fas fa-${rec.icon}"></i>
            </div>
            <h4>${rec.title}</h4>
            <p>${rec.description}</p>
            <button class="btn btn-outline btn-small" onclick="applyRecommendation('${rec.id}')">
                ${rec.action}
            </button>
        </div>
    `,
    )
    .join("")
}

// Load recent activity
function loadRecentActivity() {
  const activityContainer = document.getElementById("recent-activity")
  if (!activityContainer) return

  const activities = getRecentActivities()

  if (activities.length === 0) {
    activityContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-history"></i>
                <h3>No recent activity</h3>
                <p>Your learning activities will appear here</p>
            </div>
        `
    return
  }

  activityContainer.innerHTML = activities
    .map(
      (activity) => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas fa-${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-time">${formatTimeAgo(activity.timestamp)}</div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Initialize dashboard functionality
function initializeDashboard() {
  // Add any interactive elements here
  setupProgressAnimations()
}

// Setup progress bar animations
function setupProgressAnimations() {
  const progressBars = document.querySelectorAll(".progress-fill")

  progressBars.forEach((bar) => {
    const width = bar.style.width
    bar.style.width = "0%"

    setTimeout(() => {
      bar.style.width = width
    }, 500)
  })
}

// Generate AI recommendations
function generateAIRecommendations() {
  return [
    {
      id: "study-schedule",
      icon: "calendar-alt",
      title: "Optimize Study Schedule",
      description: "Based on your learning patterns, we recommend studying for 45 minutes in the morning.",
      action: "Create Schedule",
    },
    {
      id: "skill-gap",
      icon: "chart-line",
      title: "Fill Skill Gap",
      description: "Consider taking a course in Data Visualization to complement your current learning.",
      action: "View Courses",
    },
    {
      id: "practice-more",
      icon: "dumbbell",
      title: "Practice Recommendation",
      description: "You haven't practiced JavaScript in 3 days. Regular practice improves retention.",
      action: "Start Practice",
    },
  ]
}

// Get recent activities
function getRecentActivities() {
  const user = getFromStorage("edumorph_user")
  if (!user) return []

  // Simulate recent activities
  return [
    {
      id: "1",
      icon: "play",
      title: "Completed lesson: JavaScript Functions",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: "2",
      icon: "trophy",
      title: "Earned badge: Problem Solver",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: "3",
      icon: "book",
      title: "Started course: Python Fundamentals",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      id: "4",
      icon: "comment",
      title: "Posted in discussion forum",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
  ]
}

// Get course icon based on category
function getCourseIcon(category) {
  const icons = {
    programming: "code",
    design: "palette",
    business: "briefcase",
    science: "flask",
    language: "globe",
    math: "calculator",
    default: "book",
  }

  return icons[category] || icons.default
}

// Continue course function
function continueCourse(courseId) {
  showNotification("Continuing course...", "info")
  // In a real app, this would navigate to the course content
  setTimeout(() => {
    showNotification("Course content coming soon!", "info")
  }, 1000)
}

// Apply recommendation function
function applyRecommendation(recommendationId) {
  const actions = {
    "study-schedule": () => {
      showNotification("Study schedule feature coming soon!", "info")
    },
    "skill-gap": () => {
      window.location.href = "courses.html?category=design"
    },
    "practice-more": () => {
      showNotification("Practice exercises coming soon!", "info")
    },
  }

  const action = actions[recommendationId]
  if (action) {
    action()
  }
}

// Format time ago
function formatTimeAgo(timestamp) {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInSeconds = Math.floor((now - time) / 1000)

  if (diffInSeconds < 60) {
    return "Just now"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? "s" : ""} ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? "s" : ""} ago`
  }
}

// Logout function
function logout() {
  if (window.EduMorph && window.EduMorph.logout) {
    window.EduMorph.logout()
  } else {
    localStorage.removeItem("edumorph_user")
    localStorage.removeItem("edumorph_session")
    window.location.href = "index.html"
  }
}

// Utility functions
function showNotification(message, type) {
  if (window.EduMorph && window.EduMorph.showNotification) {
    window.EduMorph.showNotification(message, type)
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

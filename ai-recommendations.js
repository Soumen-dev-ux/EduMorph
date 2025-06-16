// AI Recommendations JavaScript for EduMorph platform

let currentTab = "courses"

// Initialize AI Recommendations
document.addEventListener("DOMContentLoaded", () => {
  checkAuthentication()
  loadRecommendations()
  setupTabNavigation()
})

// Check authentication
function checkAuthentication() {
  const user = getFromStorage("edumorph_user")
  if (!user) {
    window.location.href = "login.html"
    return
  }
}

// Setup tab navigation
function setupTabNavigation() {
  const tabButtons = document.querySelectorAll(".tab-btn")
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const tabName = this.textContent.toLowerCase().split(" ")[0]
      showTab(tabName)
    })
  })
}

// Show specific tab
function showTab(tabName) {
  // Update active tab button
  const tabButtons = document.querySelectorAll(".tab-btn")
  tabButtons.forEach((btn) => {
    btn.classList.remove("active")
    if (btn.textContent.toLowerCase().includes(tabName)) {
      btn.classList.add("active")
    }
  })

  // Update active tab content
  const tabContents = document.querySelectorAll(".tab-content")
  tabContents.forEach((content) => {
    content.classList.remove("active")
  })

  const activeTab = document.getElementById(`${tabName}-tab`)
  if (activeTab) {
    activeTab.classList.add("active")
  }

  currentTab = tabName
  loadRecommendations()
}

// Load recommendations based on current tab
function loadRecommendations() {
  switch (currentTab) {
    case "courses":
      loadCourseRecommendations()
      break
    case "skills":
      loadSkillRecommendations()
      break
    case "resources":
      loadResourceRecommendations()
      break
    case "paths":
      loadPathRecommendations()
      break
  }
}

// Load course recommendations
function loadCourseRecommendations() {
  const container = document.getElementById("course-recommendations")
  if (!container) return

  const user = getFromStorage("edumorph_user")
  const recommendations = generateCourseRecommendations(user)

  container.innerHTML = recommendations
    .map(
      (course) => `
        <div class="recommendation-card">
            <div class="course-image">
                <i class="fas fa-${course.icon}"></i>
            </div>
            <div class="course-content">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <div class="course-meta">
                    <span><i class="fas fa-clock"></i> ${course.duration}</span>
                    <span><i class="fas fa-signal"></i> ${course.level}</span>
                    <span><i class="fas fa-star"></i> ${course.rating}</span>
                </div>
                <div class="recommendation-reason">
                    <i class="fas fa-lightbulb"></i>
                    <span>${course.reason}</span>
                </div>
                <button class="btn btn-primary" onclick="enrollInRecommendedCourse('${course.id}')">
                    Enroll Now
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

// Load skill recommendations
function loadSkillRecommendations() {
  const container = document.getElementById("skill-recommendations")
  if (!container) return

  const user = getFromStorage("edumorph_user")
  const skills = generateSkillRecommendations(user)

  container.innerHTML = skills
    .map(
      (skill) => `
        <div class="skill-card">
            <div class="skill-icon">
                <i class="fas fa-${skill.icon}"></i>
            </div>
            <div class="skill-content">
                <h3>${skill.name}</h3>
                <p>${skill.description}</p>
                <div class="skill-level">
                    <span>Current Level: ${skill.currentLevel}</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${skill.progress}%"></div>
                    </div>
                </div>
                <div class="skill-benefits">
                    <h4>Benefits:</h4>
                    <ul>
                        ${skill.benefits.map((benefit) => `<li>${benefit}</li>`).join("")}
                    </ul>
                </div>
                <button class="btn btn-primary" onclick="startSkillDevelopment('${skill.id}')">
                    Start Learning
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

// Load resource recommendations
function loadResourceRecommendations() {
  const container = document.getElementById("resource-recommendations")
  if (!container) return

  const resources = generateResourceRecommendations()

  container.innerHTML = resources
    .map(
      (resource) => `
        <div class="resource-card">
            <div class="resource-icon">
                <i class="fas fa-${resource.icon}"></i>
            </div>
            <div class="resource-content">
                <h3>${resource.title}</h3>
                <p>${resource.description}</p>
                <div class="resource-meta">
                    <span><i class="fas fa-tag"></i> ${resource.type}</span>
                    <span><i class="fas fa-clock"></i> ${resource.duration}</span>
                    <span><i class="fas fa-star"></i> ${resource.rating}</span>
                </div>
                <div class="resource-tags">
                    ${resource.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
                </div>
                <button class="btn btn-outline" onclick="openResource('${resource.url}')">
                    View Resource
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

// Load learning path recommendations
function loadPathRecommendations() {
  const container = document.getElementById("path-recommendations")
  if (!container) return

  const paths = generatePathRecommendations()

  container.innerHTML = paths
    .map(
      (path) => `
        <div class="path-card">
            <div class="path-header">
                <div class="path-icon">
                    <i class="fas fa-${path.icon}"></i>
                </div>
                <div class="path-info">
                    <h3>${path.title}</h3>
                    <p>${path.description}</p>
                </div>
            </div>
            <div class="path-details">
                <div class="path-meta">
                    <span><i class="fas fa-clock"></i> ${path.duration}</span>
                    <span><i class="fas fa-signal"></i> ${path.level}</span>
                    <span><i class="fas fa-users"></i> ${path.students} students</span>
                </div>
                <div class="path-steps">
                    <h4>Learning Steps:</h4>
                    <ol>
                        ${path.steps.map((step) => `<li>${step}</li>`).join("")}
                    </ol>
                </div>
                <div class="path-outcomes">
                    <h4>What you'll achieve:</h4>
                    <ul>
                        ${path.outcomes.map((outcome) => `<li>${outcome}</li>`).join("")}
                    </ul>
                </div>
                <button class="btn btn-primary" onclick="startLearningPath('${path.id}')">
                    Start Path
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

// Generate course recommendations
function generateCourseRecommendations(user) {
  return [
    {
      id: "advanced-js",
      title: "Advanced JavaScript Concepts",
      description: "Master closures, prototypes, and async programming",
      icon: "code",
      duration: "12 hours",
      level: "Advanced",
      rating: "4.9",
      reason: "Based on your JavaScript fundamentals progress",
    },
    {
      id: "react-basics",
      title: "React for Beginners",
      description: "Build modern web applications with React",
      icon: "atom",
      duration: "15 hours",
      level: "Intermediate",
      rating: "4.8",
      reason: "Perfect next step after JavaScript basics",
    },
    {
      id: "data-viz",
      title: "Data Visualization with D3.js",
      description: "Create interactive charts and graphs",
      icon: "chart-bar",
      duration: "10 hours",
      level: "Intermediate",
      rating: "4.7",
      reason: "Combines your programming and data interests",
    },
  ]
}

// Generate skill recommendations
function generateSkillRecommendations(user) {
  return [
    {
      id: "problem-solving",
      name: "Problem Solving",
      description: "Develop systematic approaches to complex challenges",
      icon: "puzzle-piece",
      currentLevel: "Beginner",
      progress: 35,
      benefits: ["Better debugging skills", "Improved algorithm design", "Enhanced critical thinking"],
    },
    {
      id: "version-control",
      name: "Version Control (Git)",
      description: "Master Git for collaborative development",
      icon: "code-branch",
      currentLevel: "Novice",
      progress: 20,
      benefits: ["Track code changes effectively", "Collaborate with teams", "Manage project versions"],
    },
    {
      id: "testing",
      name: "Software Testing",
      description: "Learn to write and execute effective tests",
      icon: "vial",
      currentLevel: "Beginner",
      progress: 15,
      benefits: ["Write more reliable code", "Catch bugs early", "Improve code quality"],
    },
  ]
}

// Generate resource recommendations
function generateResourceRecommendations() {
  return [
    {
      id: "mdn-docs",
      title: "MDN Web Docs",
      description: "Comprehensive web development documentation",
      icon: "book",
      type: "Documentation",
      duration: "Self-paced",
      rating: "4.9",
      tags: ["JavaScript", "HTML", "CSS", "Web APIs"],
      url: "https://developer.mozilla.org",
    },
    {
      id: "coding-challenges",
      title: "LeetCode Practice",
      description: "Algorithmic problem-solving practice",
      icon: "dumbbell",
      type: "Practice Platform",
      duration: "Ongoing",
      rating: "4.7",
      tags: ["Algorithms", "Data Structures", "Interview Prep"],
      url: "https://leetcode.com",
    },
    {
      id: "design-patterns",
      title: "JavaScript Design Patterns",
      description: "Learn common programming patterns",
      icon: "drafting-compass",
      type: "Tutorial Series",
      duration: "3 hours",
      rating: "4.8",
      tags: ["Design Patterns", "Best Practices", "Architecture"],
      url: "#",
    },
  ]
}

// Generate learning path recommendations
function generatePathRecommendations() {
  return [
    {
      id: "fullstack-dev",
      title: "Full-Stack Web Developer",
      description: "Complete path from frontend to backend development",
      icon: "layer-group",
      duration: "6 months",
      level: "Beginner to Advanced",
      students: "2,500",
      steps: [
        "HTML & CSS Fundamentals",
        "JavaScript Programming",
        "Frontend Framework (React)",
        "Backend Development (Node.js)",
        "Database Design (MongoDB)",
        "Deployment & DevOps",
      ],
      outcomes: [
        "Build complete web applications",
        "Understand full development lifecycle",
        "Ready for junior developer roles",
      ],
    },
    {
      id: "data-scientist",
      title: "Data Science Specialist",
      description: "Master data analysis, visualization, and machine learning",
      icon: "chart-line",
      duration: "8 months",
      level: "Intermediate",
      students: "1,800",
      steps: [
        "Statistics & Probability",
        "Python for Data Science",
        "Data Manipulation (Pandas)",
        "Data Visualization",
        "Machine Learning Basics",
        "Advanced ML & Deep Learning",
      ],
      outcomes: ["Analyze complex datasets", "Build predictive models", "Create data-driven insights"],
    },
  ]
}

// Enroll in recommended course
function enrollInRecommendedCourse(courseId) {
  showNotification("Enrolling in recommended course...", "info")
  // Simulate enrollment
  setTimeout(() => {
    showNotification("Successfully enrolled! Check your dashboard.", "success")
  }, 1500)
}

// Start skill development
function startSkillDevelopment(skillId) {
  showNotification("Starting skill development plan...", "info")
  // In a real app, this would create a personalized learning plan
  setTimeout(() => {
    showNotification("Skill development plan created!", "success")
  }, 1500)
}

// Open resource
function openResource(url) {
  if (url === "#") {
    showNotification("Resource coming soon!", "info")
  } else {
    window.open(url, "_blank")
  }
}

// Start learning path
function startLearningPath(pathId) {
  showNotification("Starting learning path...", "info")
  // In a real app, this would enroll user in the path
  setTimeout(() => {
    showNotification("Learning path started! Check your dashboard.", "success")
  }, 1500)
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

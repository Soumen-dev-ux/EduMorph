// Courses JavaScript for EduMorph platform

// Sample course data
const coursesData = [
  {
    id: "js-basics",
    title: "JavaScript Fundamentals",
    description: "Learn the basics of JavaScript programming language",
    category: "programming",
    level: "beginner",
    duration: "8 hours",
    price: "Free",
    rating: 4.8,
    students: 1250,
    instructor: "John Smith",
    image: "code",
  },
  {
    id: "python-intro",
    title: "Python for Beginners",
    description: "Start your programming journey with Python",
    category: "programming",
    level: "beginner",
    duration: "12 hours",
    price: "$49",
    rating: 4.9,
    students: 2100,
    instructor: "Sarah Johnson",
    image: "python",
  },
  {
    id: "web-design",
    title: "Modern Web Design",
    description: "Create beautiful and responsive websites",
    category: "design",
    level: "intermediate",
    duration: "15 hours",
    price: "$79",
    rating: 4.7,
    students: 890,
    instructor: "Mike Chen",
    image: "palette",
  },
  {
    id: "data-science",
    title: "Data Science Essentials",
    description: "Introduction to data analysis and visualization",
    category: "science",
    level: "intermediate",
    duration: "20 hours",
    price: "$99",
    rating: 4.6,
    students: 750,
    instructor: "Dr. Emily Davis",
    image: "chart-bar",
  },
  {
    id: "business-strategy",
    title: "Business Strategy Fundamentals",
    description: "Learn strategic thinking and business planning",
    category: "business",
    level: "beginner",
    duration: "10 hours",
    price: "$59",
    rating: 4.5,
    students: 650,
    instructor: "Robert Wilson",
    image: "briefcase",
  },
  {
    id: "spanish-basics",
    title: "Spanish for Beginners",
    description: "Start speaking Spanish with confidence",
    category: "language",
    level: "beginner",
    duration: "25 hours",
    price: "$69",
    rating: 4.8,
    students: 1100,
    instructor: "Maria Rodriguez",
    image: "globe",
  },
]

let filteredCourses = [...coursesData]
let currentPage = 1
const coursesPerPage = 6

// Initialize courses page
document.addEventListener("DOMContentLoaded", () => {
  checkAuthentication()
  initializeFilters()
  loadCourses()
  setupEventListeners()
})

// Check authentication
function checkAuthentication() {
  const user = getFromStorage("edumorph_user")
  if (!user) {
    // Redirect to login for protected features
    const enrollButtons = document.querySelectorAll(".enroll-btn")
    enrollButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        showNotification("Please log in to enroll in courses", "info")
        setTimeout(() => {
          window.location.href = "login.html"
        }, 2000)
      })
    })
  }
}

// Initialize filters
function initializeFilters() {
  const categoryFilter = document.getElementById("category-filter")
  const levelFilter = document.getElementById("level-filter")
  const durationFilter = document.getElementById("duration-filter")
  const searchInput = document.getElementById("course-search")

  if (categoryFilter) {
    categoryFilter.addEventListener("change", applyFilters)
  }

  if (levelFilter) {
    levelFilter.addEventListener("change", applyFilters)
  }

  if (durationFilter) {
    durationFilter.addEventListener("change", applyFilters)
  }

  if (searchInput) {
    searchInput.addEventListener("input", debounce(applyFilters, 300))
  }
}

// Setup event listeners
function setupEventListeners() {
  const loadMoreBtn = document.getElementById("load-more-btn")
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", loadMoreCourses)
  }
}

// Apply filters
function applyFilters() {
  const categoryFilter = document.getElementById("category-filter")
  const levelFilter = document.getElementById("level-filter")
  const durationFilter = document.getElementById("duration-filter")
  const searchInput = document.getElementById("course-search")

  const category = categoryFilter?.value || ""
  const level = levelFilter?.value || ""
  const duration = durationFilter?.value || ""
  const search = searchInput?.value.toLowerCase() || ""

  filteredCourses = coursesData.filter((course) => {
    const matchesCategory = !category || course.category === category
    const matchesLevel = !level || course.level === level
    const matchesDuration = !duration || matchesDurationFilter(course.duration, duration)
    const matchesSearch =
      !search ||
      course.title.toLowerCase().includes(search) ||
      course.description.toLowerCase().includes(search) ||
      course.instructor.toLowerCase().includes(search)

    return matchesCategory && matchesLevel && matchesDuration && matchesSearch
  })

  currentPage = 1
  loadCourses()
}

// Check if course matches duration filter
function matchesDurationFilter(courseDuration, filter) {
  const hours = Number.parseInt(courseDuration)

  switch (filter) {
    case "short":
      return hours < 5
    case "medium":
      return hours >= 5 && hours <= 20
    case "long":
      return hours > 20
    default:
      return true
  }
}

// Load courses
function loadCourses() {
  const courseGrid = document.getElementById("course-grid")
  if (!courseGrid) return

  const startIndex = 0
  const endIndex = currentPage * coursesPerPage
  const coursesToShow = filteredCourses.slice(startIndex, endIndex)

  if (coursesToShow.length === 0) {
    courseGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No courses found</h3>
                <p>Try adjusting your search criteria</p>
                <button class="btn btn-outline" onclick="clearFilters()">Clear Filters</button>
            </div>
        `
    updateLoadMoreButton(false)
    return
  }

  courseGrid.innerHTML = coursesToShow.map((course) => createCourseCard(course)).join("")

  // Update load more button
  const hasMore = endIndex < filteredCourses.length
  updateLoadMoreButton(hasMore)
}

// Create course card HTML
function createCourseCard(course) {
  const user = getFromStorage("edumorph_user")
  const isEnrolled = user && isUserEnrolled(user.id, course.id)

  return `
        <div class="course-card">
            <div class="course-image">
                <i class="fas fa-${course.image}"></i>
            </div>
            <div class="course-content">
                <h3 class="course-title">${course.title}</h3>
                <p class="course-description">${course.description}</p>
                <div class="course-meta">
                    <span><i class="fas fa-clock"></i> ${course.duration}</span>
                    <span><i class="fas fa-signal"></i> ${course.level}</span>
                    <span><i class="fas fa-star"></i> ${course.rating}</span>
                </div>
                <div class="course-footer">
                    <div class="course-price">${course.price}</div>
                    <button class="btn ${isEnrolled ? "btn-outline" : "btn-primary"}" 
                            onclick="${isEnrolled ? `continueCourse('${course.id}')` : `enrollInCourse('${course.id}')`}">
                        ${isEnrolled ? "Continue" : "Enroll Now"}
                    </button>
                </div>
                <div class="course-instructor">
                    <i class="fas fa-user"></i>
                    ${course.instructor} • ${course.students} students
                </div>
            </div>
        </div>
    `
}

// Check if user is enrolled in course
function isUserEnrolled(userId, courseId) {
  const users = getFromStorage("edumorph_users") || []
  const user = users.find((u) => u.id === userId)

  if (!user || !user.enrolledCourses) return false

  return user.enrolledCourses.some((course) => course.id === courseId)
}

// Enroll in course
function enrollInCourse(courseId) {
  const user = getFromStorage("edumorph_user")

  if (!user) {
    showNotification("Please log in to enroll in courses", "info")
    setTimeout(() => {
      window.location.href = "login.html"
    }, 2000)
    return
  }

  const course = coursesData.find((c) => c.id === courseId)
  if (!course) {
    showNotification("Course not found", "error")
    return
  }

  // Update user data
  const users = getFromStorage("edumorph_users") || []
  const userIndex = users.findIndex((u) => u.id === user.id)

  if (userIndex === -1) {
    showNotification("User not found", "error")
    return
  }

  // Check if already enrolled
  if (!users[userIndex].enrolledCourses) {
    users[userIndex].enrolledCourses = []
  }

  const alreadyEnrolled = users[userIndex].enrolledCourses.some((c) => c.id === courseId)

  if (alreadyEnrolled) {
    showNotification("You are already enrolled in this course", "info")
    return
  }

  // Add course to user's enrolled courses
  const enrolledCourse = {
    ...course,
    enrolledAt: new Date().toISOString(),
    progress: 0,
    studyTime: 0,
    lastAccessed: new Date().toISOString(),
  }

  users[userIndex].enrolledCourses.push(enrolledCourse)

  // Save updated data
  saveToStorage("edumorph_users", users)

  showNotification(`Successfully enrolled in ${course.title}!`, "success")

  // Reload courses to update UI
  setTimeout(() => {
    loadCourses()
  }, 1000)
}

// Continue course
function continueCourse(courseId) {
  showNotification("Continuing course...", "info")
  // In a real app, this would navigate to the course content
  setTimeout(() => {
    showNotification("Course content coming soon!", "info")
  }, 1000)
}

// Load more courses
function loadMoreCourses() {
  currentPage++
  loadCourses()
}

// Update load more button
function updateLoadMoreButton(hasMore) {
  const loadMoreBtn = document.getElementById("load-more-btn")
  if (!loadMoreBtn) return

  if (hasMore) {
    loadMoreBtn.style.display = "block"
    loadMoreBtn.textContent = "Load More Courses"
  } else {
    loadMoreBtn.style.display = "none"
  }
}

// Clear all filters
function clearFilters() {
  const categoryFilter = document.getElementById("category-filter")
  const levelFilter = document.getElementById("level-filter")
  const durationFilter = document.getElementById("duration-filter")
  const searchInput = document.getElementById("course-search")

  if (categoryFilter) categoryFilter.value = ""
  if (levelFilter) levelFilter.value = ""
  if (durationFilter) durationFilter.value = ""
  if (searchInput) searchInput.value = ""

  applyFilters()
}

// Debounce function for search
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
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

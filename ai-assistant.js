// AI Assistant JavaScript for EduMorph platform

let chatHistory = []
let isTyping = false

// Initialize AI Assistant
document.addEventListener("DOMContentLoaded", () => {
  checkAuthentication()
  initializeChat()
  setupEventListeners()
  loadChatHistory()
})

// Check authentication
function checkAuthentication() {
  const user = getFromStorage("edumorph_user")
  if (!user) {
    window.location.href = "login.html"
    return
  }
}

// Initialize chat
function initializeChat() {
  const messagesContainer = document.getElementById("chat-messages")
  if (!messagesContainer) return

  // Scroll to bottom
  scrollToBottom()
}

// Setup event listeners
function setupEventListeners() {
  const messageInput = document.getElementById("message-input")
  const sendButton = document.getElementById("send-button")

  if (messageInput) {
    messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
    })
  }

  if (sendButton) {
    sendButton.addEventListener("click", sendMessage)
  }
}

// Send message
function sendMessage() {
  const messageInput = document.getElementById("message-input")
  if (!messageInput) return

  const message = messageInput.value.trim()
  if (!message || isTyping) return

  // Add user message
  addMessage(message, "user")
  messageInput.value = ""

  // Show typing indicator
  showTypingIndicator()

  // Simulate AI response
  setTimeout(
    () => {
      hideTypingIndicator()
      const response = generateAIResponse(message)
      addMessage(response, "ai")
      saveChatHistory()
    },
    1500 + Math.random() * 1000,
  )
}

// Send quick message
function sendQuickMessage(message) {
  const messageInput = document.getElementById("message-input")
  if (messageInput) {
    messageInput.value = message
  }
  sendMessage()
}

// Add message to chat
function addMessage(content, sender) {
  const messagesContainer = document.getElementById("chat-messages")
  if (!messagesContainer) return

  const messageElement = document.createElement("div")
  messageElement.className = `message ${sender}-message`

  const avatarIcon = sender === "ai" ? "robot" : "user"

  messageElement.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-${avatarIcon}"></i>
        </div>
        <div class="message-content">
            ${formatMessageContent(content)}
        </div>
    `

  messagesContainer.appendChild(messageElement)

  // Add to chat history
  chatHistory.push({
    content,
    sender,
    timestamp: new Date().toISOString(),
  })

  scrollToBottom()
}

// Format message content
function formatMessageContent(content) {
  // Convert line breaks to <br>
  content = content.replace(/\n/g, "<br>")

  // Convert **bold** to <strong>
  content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

  // Convert *italic* to <em>
  content = content.replace(/\*(.*?)\*/g, "<em>$1</em>")

  // Convert `code` to <code>
  content = content.replace(/`(.*?)`/g, "<code>$1</code>")

  return content
}

// Show typing indicator
function showTypingIndicator() {
  if (isTyping) return

  isTyping = true
  const messagesContainer = document.getElementById("chat-messages")
  if (!messagesContainer) return

  const typingElement = document.createElement("div")
  typingElement.className = "message ai-message typing-indicator"
  typingElement.id = "typing-indicator"

  typingElement.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `

  messagesContainer.appendChild(typingElement)
  scrollToBottom()

  // Add typing animation styles
  if (!document.getElementById("typing-styles")) {
    const style = document.createElement("style")
    style.id = "typing-styles"
    style.textContent = `
            .typing-dots {
                display: flex;
                gap: 4px;
                align-items: center;
            }
            
            .typing-dots span {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: #6b7280;
                animation: typing 1.4s infinite ease-in-out;
            }
            
            .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
            .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
            
            @keyframes typing {
                0%, 80%, 100% {
                    transform: scale(0.8);
                    opacity: 0.5;
                }
                40% {
                    transform: scale(1);
                    opacity: 1;
                }
            }
        `
    document.head.appendChild(style)
  }
}

// Hide typing indicator
function hideTypingIndicator() {
  isTyping = false
  const typingIndicator = document.getElementById("typing-indicator")
  if (typingIndicator) {
    typingIndicator.remove()
  }
}

// Generate AI response
function generateAIResponse(userMessage) {
  const message = userMessage.toLowerCase()

  // Predefined responses based on keywords
  if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
    return "Hello! I'm your AI learning assistant. How can I help you with your studies today?"
  }

  if (message.includes("javascript") || message.includes("js")) {
    return "JavaScript is a versatile programming language! Here are some key concepts to focus on:\n\n**Variables & Data Types**: let, const, var\n**Functions**: Regular functions, arrow functions, callbacks\n**DOM Manipulation**: Selecting and modifying HTML elements\n**Async Programming**: Promises, async/await\n\nWould you like me to explain any of these topics in detail?"
  }

  if (message.includes("python")) {
    return "Python is an excellent language for beginners! Here's what I recommend learning:\n\n**Basics**: Variables, data types, operators\n**Control Flow**: if/else, loops (for, while)\n**Data Structures**: Lists, dictionaries, tuples\n**Functions**: Defining and calling functions\n**Libraries**: NumPy, Pandas for data science\n\nWhat specific Python topic would you like help with?"
  }

  if (message.includes("study plan") || message.includes("schedule")) {
    return "I'd be happy to help you create a study plan! Here's a general framework:\n\n**1. Set Clear Goals**: What do you want to achieve?\n**2. Assess Your Time**: How many hours per week can you dedicate?\n**3. Break It Down**: Divide topics into manageable chunks\n**4. Practice Regularly**: 30-45 minutes daily is better than long sessions\n**5. Review & Adjust**: Weekly check-ins to track progress\n\nWhat subject would you like to create a study plan for?"
  }

  if (message.includes("machine learning") || message.includes("ml")) {
    return "Machine Learning is fascinating! Here's a beginner-friendly roadmap:\n\n**Prerequisites**:\n- Basic statistics and probability\n- Python programming\n- Linear algebra basics\n\n**Core Concepts**:\n- Supervised vs Unsupervised learning\n- Regression and Classification\n- Model evaluation and validation\n\n**Popular Algorithms**:\n- Linear Regression\n- Decision Trees\n- Neural Networks\n\nWould you like me to explain any of these concepts?"
  }

  if (message.includes("math") || message.includes("mathematics")) {
    return "Mathematics is the foundation of many fields! What area of math are you working on?\n\n**Common Topics**:\n- **Algebra**: Equations, functions, graphing\n- **Calculus**: Derivatives, integrals, limits\n- **Statistics**: Probability, distributions, hypothesis testing\n- **Discrete Math**: Logic, sets, combinatorics\n\nI can help explain concepts, work through problems, or suggest practice exercises. What would be most helpful?"
  }

  if (message.includes("help") || message.includes("stuck") || message.includes("confused")) {
    return "I'm here to help! When you're stuck, try these strategies:\n\n**1. Break it down**: Divide the problem into smaller parts\n**2. Review basics**: Make sure you understand the fundamentals\n**3. Find examples**: Look for similar problems you've solved\n**4. Take a break**: Sometimes stepping away helps\n**5. Ask specific questions**: The more specific, the better I can help\n\nWhat specific topic or problem are you working on?"
  }

  if (message.includes("course") || message.includes("recommend")) {
    return "I'd love to recommend courses based on your interests! Here are some popular options:\n\n**Programming**: JavaScript Fundamentals, Python for Beginners\n**Design**: Modern Web Design, UI/UX Principles\n**Data**: Data Science Essentials, Statistics Basics\n**Business**: Business Strategy, Digital Marketing\n\nWhat field interests you most? I can provide more specific recommendations based on your goals and current skill level."
  }

  if (message.includes("thank") || message.includes("thanks")) {
    return "You're very welcome! I'm always here to help with your learning journey. Feel free to ask me anything about your studies, and remember - every expert was once a beginner. Keep up the great work! 🌟"
  }

  // Default response for unrecognized queries
  return "That's an interesting question! While I may not have a specific answer for that, I can help you with:\n\n• **Study strategies** and time management\n• **Programming concepts** (JavaScript, Python, etc.)\n• **Math and science** problem-solving\n• **Course recommendations** based on your goals\n• **Learning techniques** to improve retention\n\nCould you rephrase your question or let me know what specific topic you'd like help with?"
}

// Scroll to bottom of chat
function scrollToBottom() {
  const messagesContainer = document.getElementById("chat-messages")
  if (messagesContainer) {
    setTimeout(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }, 100)
  }
}

// Save chat history
function saveChatHistory() {
  const user = getFromStorage("edumorph_user")
  if (!user) return

  const chatData = {
    userId: user.id,
    history: chatHistory,
    lastUpdated: new Date().toISOString(),
  }

  saveToStorage(`edumorph_chat_${user.id}`, chatData)
}

// Load chat history
function loadChatHistory() {
  const user = getFromStorage("edumorph_user")
  if (!user) return

  const chatData = getFromStorage(`edumorph_chat_${user.id}`)
  if (chatData && chatData.history) {
    chatHistory = chatData.history

    // Display recent messages (last 10)
    const recentMessages = chatHistory.slice(-10)
    const messagesContainer = document.getElementById("chat-messages")

    if (messagesContainer && recentMessages.length > 0) {
      // Clear welcome message
      messagesContainer.innerHTML = ""

      // Add recent messages
      recentMessages.forEach((msg) => {
        addMessageToDOM(msg.content, msg.sender)
      })
    }
  }
}

// Add message to DOM without updating history
function addMessageToDOM(content, sender) {
  const messagesContainer = document.getElementById("chat-messages")
  if (!messagesContainer) return

  const messageElement = document.createElement("div")
  messageElement.className = `message ${sender}-message`

  const avatarIcon = sender === "ai" ? "robot" : "user"

  messageElement.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-${avatarIcon}"></i>
        </div>
        <div class="message-content">
            ${formatMessageContent(content)}
        </div>
    `

  messagesContainer.appendChild(messageElement)
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

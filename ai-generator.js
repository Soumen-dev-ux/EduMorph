// AI Content Generator JavaScript for EduMorph platform

let currentGenerator = null
const generatedContent = null

// Initialize AI Generator
document.addEventListener("DOMContentLoaded", () => {
  checkAuthentication()
  setupEventListeners()
})

// Check authentication
function checkAuthentication() {
  const user = getFromStorage("edumorph_user")
  if (!user) {
    window.location.href = "login.html"
    return
  }
}

// Setup event listeners
function setupEventListeners() {
  const contentForm = document.getElementById("content-form")
  if (contentForm) {
    contentForm.addEventListener("submit", generateContent)
  }
}

// Select generator type
function selectGenerator(type) {
  currentGenerator = type

  const generatorOptions = document.querySelector(".generator-options")
  const generatorForm = document.getElementById("generator-form")
  const generatorTitle = document.getElementById("generator-title")

  if (generatorOptions) generatorOptions.style.display = "none"
  if (generatorForm) generatorForm.style.display = "block"

  // Update form based on generator type
  updateFormForGenerator(type)

  // Update title
  const titles = {
    quiz: "Quiz Generator",
    flashcards: "Flashcard Generator",
    summary: "Summary Generator",
    exercises: "Exercise Generator",
  }

  if (generatorTitle) {
    generatorTitle.textContent = titles[type] || "Content Generator"
  }
}

// Update form based on generator type
function updateFormForGenerator(type) {
  const quantityGroup = document.getElementById("quantity-group")
  const quantityInput = document.getElementById("quantity")
  const quantityLabel = quantityGroup?.querySelector("label")

  if (!quantityGroup || !quantityInput || !quantityLabel) return

  switch (type) {
    case "quiz":
      quantityLabel.textContent = "Number of Questions"
      quantityInput.placeholder = "e.g., 10"
      quantityInput.value = "10"
      quantityInput.max = "50"
      break
    case "flashcards":
      quantityLabel.textContent = "Number of Cards"
      quantityInput.placeholder = "e.g., 20"
      quantityInput.value = "20"
      quantityInput.max = "100"
      break
    case "summary":
      quantityGroup.style.display = "none"
      break
    case "exercises":
      quantityLabel.textContent = "Number of Exercises"
      quantityInput.placeholder = "e.g., 15"
      quantityInput.value = "15"
      quantityInput.max = "30"
      break
    default:
      quantityGroup.style.display = "block"
  }
}

// Reset generator
function resetGenerator() {
  currentGenerator = null

  const generatorOptions = document.querySelector(".generator-options")
  const generatorForm = document.getElementById("generator-form")
  const generatedContentDiv = document.getElementById("generated-content")

  if (generatorOptions) generatorOptions.style.display = "grid"
  if (generatorForm) generatorForm.style.display = "none"
  if (generatedContentDiv) generatedContentDiv.style.display = "none"

  // Reset form
  const contentForm = document.getElementById("content-form")
  if (contentForm) contentForm.reset()
}

// Generate content
function generateContent(e) {
  e.preventDefault()

  if (!currentGenerator) {
    showNotification("Please select a generator type first", "error")
    return
  }

  const formData = new FormData(e.target)
  const topic = formData.get("topic")
  const difficulty = formData.get("difficulty")
  const quantity = formData.get("quantity")
  const additionalInfo = formData.get("additional-info")

  if (!topic || !difficulty) {
    showNotification("Please fill in all required fields", "error")
    return
  }

  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...'
  submitBtn.disabled = true

  // Simulate AI generation
  setTimeout(
    () => {
      const content = generateContentByType(currentGenerator, {
        topic,
        difficulty,
        quantity: Number.parseInt(quantity) || 10,
        additionalInfo,
      })

      displayGeneratedContent(content)

      // Reset button
      submitBtn.innerHTML = originalText
      submitBtn.disabled = false

      showNotification("Content generated successfully!", "success")
    },
    2000 + Math.random() * 1000,
  )
}

// Generate content by type
function generateContentByType(type, params) {
  switch (type) {
    case "quiz":
      return generateQuiz(params)
    case "flashcards":
      return generateFlashcards(params)
    case "summary":
      return generateSummary(params)
    case "exercises":
      return generateExercises(params)
    default:
      return { type: "error", content: "Unknown generator type" }
  }
}

// Generate quiz content
function generateQuiz(params) {
  const questions = []

  for (let i = 0; i < params.quantity; i++) {
    questions.push({
      question: `Sample question ${i + 1} about ${params.topic}?`,
      options: [
        "Option A - Correct answer",
        "Option B - Incorrect answer",
        "Option C - Incorrect answer",
        "Option D - Incorrect answer",
      ],
      correct: 0,
      explanation: `This is the explanation for question ${i + 1} about ${params.topic}.`,
    })
  }

  return {
    type: "quiz",
    title: `${params.topic} Quiz - ${params.difficulty} Level`,
    questions,
  }
}

// Generate flashcards content
function generateFlashcards(params) {
  const cards = []

  for (let i = 0; i < params.quantity; i++) {
    cards.push({
      front: `${params.topic} concept ${i + 1}`,
      back: `Detailed explanation of ${params.topic} concept ${i + 1}. This would include key points, examples, and important details to remember.`,
    })
  }

  return {
    type: "flashcards",
    title: `${params.topic} Flashcards - ${params.difficulty} Level`,
    cards,
  }
}

// Generate summary content
function generateSummary(params) {
  const summary = `
# ${params.topic} Summary

## Overview
This is a comprehensive summary of ${params.topic} at the ${params.difficulty} level.

## Key Concepts
- **Concept 1**: Important foundational idea about ${params.topic}
- **Concept 2**: Advanced principle that builds on the basics
- **Concept 3**: Practical application of ${params.topic} concepts

## Main Points
1. **Introduction**: ${params.topic} is a crucial subject that involves...
2. **Core Principles**: The fundamental ideas include...
3. **Applications**: Real-world uses of ${params.topic} can be seen in...
4. **Best Practices**: When working with ${params.topic}, it's important to...

## Conclusion
Understanding ${params.topic} is essential for success in this field. The key takeaways are...

${params.additionalInfo ? `\n## Additional Notes\n${params.additionalInfo}` : ""}
    `

  return {
    type: "summary",
    title: `${params.topic} Summary - ${params.difficulty} Level`,
    content: summary.trim(),
  }
}

// Generate exercises content
function generateExercises(params) {
    const exercises = [];
    
    for (let i = 0; i < params.quantity; i++) {
        exercises.push({
            title: `Exercise ${i + 1}: ${params.topic} Practice`,
            description: `This exercise focuses on applying ${params.topic} concepts in a practical scenario.`,
            instructions: [
                'Read the problem statement carefully',
                'Identify the key concepts involved',
                'Apply the appropriate methods',
                'Verify your solution'
            ],
            problem: `Sample problem ${i + 1} related to ${params.topic}. This would be a realistic scenario that requires

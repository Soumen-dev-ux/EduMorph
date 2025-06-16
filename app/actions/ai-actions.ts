"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { supabase } from "@/lib/supabase"

export async function generateCourseRecommendations(userId: string, userProfile: any) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are an expert educational AI assistant. Analyze the user's learning profile and generate personalized course recommendations.`,
      prompt: `
        User Profile:
        - Learning Style: ${userProfile.learningStyle}
        - Current Level: ${userProfile.currentLevel}
        - Weak Areas: ${userProfile.weakAreas?.join(", ")}
        - Strong Areas: ${userProfile.strongAreas?.join(", ")}
        - Goals: ${userProfile.goals?.join(", ")}
        - Available Time: ${userProfile.timeAvailable}

        Generate 3 personalized course recommendations with:
        1. Course title
        2. Detailed reason for recommendation
        3. AI match percentage (realistic)
        4. Learning path explanation
        5. Expected outcomes

        Format as JSON array with objects containing: title, reason, match, duration, difficulty, aiInsight, expectedOutcomes
      `,
    })

    // Store AI interaction in database
    await supabase.from("ai_interactions").insert({
      user_id: userId,
      type: "recommendation",
      input: JSON.stringify(userProfile),
      output: text,
    })

    return { success: true, recommendations: JSON.parse(text) }
  } catch (error) {
    console.error("Error generating recommendations:", error)
    return { success: false, error: "Failed to generate recommendations" }
  }
}

export async function generateQuizContent(topic: string, difficulty: string, questionCount: number) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are an expert educational content creator. Generate high-quality quiz questions.`,
      prompt: `
        Create a ${difficulty} level quiz about "${topic}" with ${questionCount} questions.
        
        For each question, provide:
        1. Clear, well-written question
        2. 4 multiple choice options (A, B, C, D)
        3. Correct answer (index 0-3)
        4. Detailed explanation of why the answer is correct
        5. Learning objective addressed

        Format as JSON array with objects containing: question, options, correct, explanation, objective
      `,
    })

    return { success: true, quiz: JSON.parse(text) }
  } catch (error) {
    console.error("Error generating quiz:", error)
    return { success: false, error: "Failed to generate quiz" }
  }
}

export async function generateStudyPlan(userProfile: any, timeframe: string) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are an expert learning strategist. Create personalized study plans.`,
      prompt: `
        Create a ${timeframe} study plan for:
        - Learning Style: ${userProfile.learningStyle}
        - Weak Areas: ${userProfile.weakAreas?.join(", ")}
        - Goals: ${userProfile.goals?.join(", ")}
        - Available Time: ${userProfile.timeAvailable}

        Include:
        1. Weekly breakdown with specific focus areas
        2. Daily tasks and activities
        3. Time allocation for each activity
        4. Progress milestones
        5. Recommended resources

        Format as JSON with weeks array containing: week, focus, tasks, timeRequired, milestones
      `,
    })

    return { success: true, studyPlan: JSON.parse(text) }
  } catch (error) {
    console.error("Error generating study plan:", error)
    return { success: false, error: "Failed to generate study plan" }
  }
}

export async function chatWithAI(messages: any[], userRole: "student" | "teacher", userId: string) {
  try {
    const systemPrompt =
      userRole === "student"
        ? `You are EduMorph's AI learning assistant for students. You help with:
         - Explaining complex concepts in simple terms
         - Providing study strategies and tips
         - Answering academic questions
         - Motivating and encouraging learning
         - Suggesting resources and practice materials
         
         Be encouraging, patient, and educational. Use examples and analogies when helpful.`
        : `You are EduMorph's AI teaching assistant for educators. You help with:
         - Creating lesson plans and curricula
         - Generating assessment materials
         - Analyzing student performance data
         - Suggesting teaching strategies
         - Providing classroom management tips
         
         Be professional, insightful, and practical. Focus on evidence-based teaching methods.`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages,
    })

    // Store conversation in database
    await supabase.from("ai_interactions").insert({
      user_id: userId,
      type: "chat",
      input: JSON.stringify(messages),
      output: text,
    })

    return { success: true, response: text }
  } catch (error) {
    console.error("Error in AI chat:", error)
    return { success: false, error: "Failed to get AI response" }
  }
}

export async function analyzeStudentPerformance(studentData: any) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are an expert educational data analyst. Analyze student performance and provide insights.`,
      prompt: `
        Analyze this student performance data:
        ${JSON.stringify(studentData)}

        Provide:
        1. Overall performance assessment
        2. Strengths and weaknesses identification
        3. Learning pattern analysis
        4. Specific recommendations for improvement
        5. Predicted future performance trends

        Format as JSON with: assessment, strengths, weaknesses, patterns, recommendations, predictions
      `,
    })

    return { success: true, analysis: JSON.parse(text) }
  } catch (error) {
    console.error("Error analyzing performance:", error)
    return { success: false, error: "Failed to analyze performance" }
  }
}

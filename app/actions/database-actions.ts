"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function createUser(userData: {
  email: string
  name: string
  role: "student" | "teacher" | "admin"
  institution?: string
  learning_style?: string
}) {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", userData.email).single()

    if (existingUser) {
      return { success: false, error: "User with this email already exists" }
    }

    // Create new user
    const { data, error } = await supabase
      .from("users")
      .insert({
        ...userData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Database error creating user:", error)
      throw error
    }

    return { success: true, user: data }
  } catch (error: any) {
    console.error("Error creating user:", error)

    if (error.code === "23505") {
      // Unique constraint violation
      return { success: false, error: "User with this email already exists" }
    }

    return { success: false, error: error.message || "Failed to create user" }
  }
}

export async function getUserById(userId: string) {
  try {
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (error) {
      console.error("Database error fetching user:", error)
      throw error
    }

    return { success: true, user: data }
  } catch (error: any) {
    console.error("Error fetching user:", error)
    return { success: false, error: error.message || "User not found" }
  }
}

export async function getUserByEmail(email: string) {
  try {
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return { success: false, error: "User not found" }
      }
      console.error("Database error fetching user by email:", error)
      throw error
    }

    return { success: true, user: data }
  } catch (error: any) {
    console.error("Error fetching user by email:", error)
    return { success: false, error: error.message || "User not found" }
  }
}

export async function getCourses(filters?: {
  category?: string
  level?: string
  search?: string
}) {
  try {
    let query = supabase.from("courses").select("*")

    if (filters?.category && filters.category !== "all") {
      query = query.eq("category", filters.category)
    }

    if (filters?.level && filters.level !== "all") {
      query = query.eq("level", filters.level)
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    const { data, error } = await query.order("rating", { ascending: false })

    if (error) {
      console.error("Database error fetching courses:", error)
      throw error
    }

    return { success: true, courses: data || [] }
  } catch (error: any) {
    console.error("Error fetching courses:", error)
    return { success: false, error: error.message || "Failed to fetch courses" }
  }
}

export async function enrollInCourse(userId: string, courseId: string) {
  try {
    // Check if already enrolled
    const { data: existingEnrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .single()

    if (existingEnrollment) {
      return { success: false, error: "Already enrolled in this course" }
    }

    const { data, error } = await supabase
      .from("enrollments")
      .insert({
        user_id: userId,
        course_id: courseId,
        progress: 0,
        completed: false,
        enrolled_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Database error enrolling in course:", error)
      throw error
    }

    // Update course student count
    const { error: updateError } = await supabase.rpc("increment_students_count", {
      course_id: courseId,
    })

    if (updateError) {
      console.warn("Failed to update student count:", updateError)
    }

    revalidatePath("/courses")
    revalidatePath("/dashboard")

    return { success: true, enrollment: data }
  } catch (error: any) {
    console.error("Error enrolling in course:", error)
    return { success: false, error: error.message || "Failed to enroll in course" }
  }
}

export async function getUserEnrollments(userId: string) {
  try {
    const { data, error } = await supabase
      .from("enrollments")
      .select(`
        *,
        courses (
          id,
          title,
          instructor,
          category,
          level
        )
      `)
      .eq("user_id", userId)
      .order("enrolled_at", { ascending: false })

    if (error) {
      console.error("Database error fetching enrollments:", error)
      throw error
    }

    return { success: true, enrollments: data || [] }
  } catch (error: any) {
    console.error("Error fetching enrollments:", error)
    return { success: false, error: error.message || "Failed to fetch enrollments" }
  }
}

export async function updateProgress(enrollmentId: string, progress: number) {
  try {
    const { data, error } = await supabase
      .from("enrollments")
      .update({
        progress,
        completed: progress >= 100,
        completed_at: progress >= 100 ? new Date().toISOString() : null,
      })
      .eq("id", enrollmentId)
      .select()
      .single()

    if (error) {
      console.error("Database error updating progress:", error)
      throw error
    }

    revalidatePath("/dashboard")

    return { success: true, enrollment: data }
  } catch (error: any) {
    console.error("Error updating progress:", error)
    return { success: false, error: error.message || "Failed to update progress" }
  }
}

export async function submitFeedback(feedbackData: {
  user_id: string
  type: string
  rating: number
  subject: string
  message: string
  email?: string
}) {
  try {
    const { data, error } = await supabase
      .from("feedback")
      .insert({
        ...feedbackData,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Database error submitting feedback:", error)
      throw error
    }

    revalidatePath("/feedback")

    return { success: true, feedback: data }
  } catch (error: any) {
    console.error("Error submitting feedback:", error)
    return { success: false, error: error.message || "Failed to submit feedback" }
  }
}

export async function getFeedbackAnalytics() {
  try {
    const { data: feedbackData, error: feedbackError } = await supabase
      .from("feedback")
      .select("rating, type, created_at")

    if (feedbackError) {
      console.error("Database error fetching feedback:", feedbackError)
      throw feedbackError
    }

    const totalFeedback = feedbackData?.length || 0
    const averageRating = totalFeedback > 0 ? feedbackData.reduce((sum, f) => sum + f.rating, 0) / totalFeedback : 0

    // Calculate feedback by type
    const feedbackByType =
      feedbackData?.reduce(
        (acc, f) => {
          acc[f.type] = (acc[f.type] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ) || {}

    return {
      success: true,
      analytics: {
        totalFeedback,
        averageRating: Math.round(averageRating * 10) / 10,
        feedbackByType,
        responseRate: 98, // Mock data
        improvementSuggestions: 156, // Mock data
      },
    }
  } catch (error: any) {
    console.error("Error fetching feedback analytics:", error)
    return { success: false, error: error.message || "Failed to fetch analytics" }
  }
}

// Test database connection
export async function testConnection() {
  try {
    const { data, error } = await supabase.from("users").select("count(*)").limit(1)

    if (error) {
      console.error("Connection test failed:", error)
      return { success: false, error: error.message }
    }

    return { success: true, message: "Database connection successful" }
  } catch (error: any) {
    console.error("Connection test error:", error)
    return { success: false, error: error.message || "Connection failed" }
  }
}

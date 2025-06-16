import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://likipraehiedarembxwf.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key for admin operations
export const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: "student" | "teacher" | "admin"
          institution?: string
          learning_style?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: "student" | "teacher" | "admin"
          institution?: string
          learning_style?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: "student" | "teacher" | "admin"
          institution?: string
          learning_style?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string
          instructor: string
          category: string
          level: "beginner" | "intermediate" | "advanced"
          duration: string
          price: number
          rating: number
          students_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          instructor: string
          category: string
          level: "beginner" | "intermediate" | "advanced"
          duration: string
          price: number
          rating?: number
          students_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          instructor?: string
          category?: string
          level?: "beginner" | "intermediate" | "advanced"
          duration?: string
          price?: number
          rating?: number
          students_count?: number
          updated_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          progress: number
          completed: boolean
          enrolled_at: string
          completed_at?: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          progress?: number
          completed?: boolean
          enrolled_at?: string
          completed_at?: string
        }
        Update: {
          id?: string
          progress?: number
          completed?: boolean
          completed_at?: string
        }
      }
      ai_interactions: {
        Row: {
          id: string
          user_id: string
          type: "chat" | "recommendation" | "content_generation"
          input: string
          output: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: "chat" | "recommendation" | "content_generation"
          input: string
          output: string
          created_at?: string
        }
        Update: {
          id?: string
          input?: string
          output?: string
        }
      }
      feedback: {
        Row: {
          id: string
          user_id: string
          type: string
          rating: number
          subject: string
          message: string
          email?: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          rating: number
          subject: string
          message: string
          email?: string
          created_at?: string
        }
        Update: {
          id?: string
          rating?: number
          subject?: string
          message?: string
        }
      }
    }
  }
}

import { supabase, supabaseAdmin } from "./supabase"

export async function testDatabaseConnection() {
  try {
    console.log("Testing database connection...")

    // Test basic connection
    const { data, error } = await supabase.from("users").select("count(*)").limit(1)

    if (error) {
      console.error("Database connection error:", error)
      return { success: false, error: error.message }
    }

    console.log("Database connection successful!")
    return { success: true, data }
  } catch (error) {
    console.error("Database test failed:", error)
    return { success: false, error: "Connection failed" }
  }
}

export async function testAdminConnection() {
  try {
    console.log("Testing admin database connection...")

    // Test admin connection
    const { data, error } = await supabaseAdmin.from("users").select("count(*)").limit(1)

    if (error) {
      console.error("Admin database connection error:", error)
      return { success: false, error: error.message }
    }

    console.log("Admin database connection successful!")
    return { success: true, data }
  } catch (error) {
    console.error("Admin database test failed:", error)
    return { success: false, error: "Admin connection failed" }
  }
}

export async function generateHabitPlan(goal: string): Promise<string[]> {
  try {
    console.log("Calling Edge Function for goal:", goal)
    
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-habit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ goal })
    })
    
    console.log("Response status:", response.status)
    
    const data = await response.json()
    console.log("Edge Function response:", data)
    
    if (data.success && data.habits && data.habits.length === 7) {
      return data.habits
    } else {
      throw new Error(data.error || "Invalid response from Edge Function")
    }
    
  } catch (error) {
    console.error("Edge Function error:", error)
    // Re-throw the error instead of using fallback
    throw new Error(`Failed to generate AI habits: ${error.message}`)
  }
}
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')

serve(async (req) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Content-Type': 'application/json',
  }

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers })
  }

  try {
    const { goal } = await req.json()
    
    console.log("Generating habits for goal:", goal)
    console.log("API Key exists:", !!GROQ_API_KEY)

    if (!GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "GROQ_API_KEY is not configured" 
        }),
        { status: 500, headers }
      )
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { 
            role: 'system', 
            content: 'You are a sustainability expert. Return ONLY valid JSON. No markdown, no explanations, just the JSON object.' 
          },
          { 
            role: 'user', 
            content: `Generate a 7-day habit plan for: "${goal}".
            
Return ONLY a JSON object with this exact structure:
{
  "habits": [
    "Day 1: [specific action for day 1]",
    "Day 2: [specific action for day 2]",
    "Day 3: [specific action for day 3]",
    "Day 4: [specific action for day 4]",
    "Day 5: [specific action for day 5]",
    "Day 6: [specific action for day 6]",
    "Day 7: [specific action for day 7]"
  ]
}

Make each habit specific, actionable, and relevant to ${goal}. Do not include any other text outside the JSON.` 
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    })

    const data = await response.json()
    
    console.log("Groq response status:", response.status)
    
    if (!response.ok) {
      console.error("Groq API error:", data)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: data.error?.message || "Groq API request failed",
          details: data
        }),
        { status: response.status, headers }
      )
    }

    let habits = []
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const content = data.choices[0].message.content
      console.log("Raw response:", content)
      
      // Clean up response
      let cleanContent = content.trim()
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '')
      }
      
      const parsed = JSON.parse(cleanContent)
      habits = parsed.habits || []
    }

    if (!habits.length || habits.length !== 7) {
      throw new Error(`Expected 7 habits, got ${habits.length}`)
    }

    console.log(`Successfully generated ${habits.length} habits for ${goal}`)

    return new Response(
      JSON.stringify({ success: true, habits: habits }),
      { status: 200, headers }
    )

  } catch (error) {
    console.error("Function error:", error.message)
    
    // Return the actual error - no fallback!
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        type: error.name || "UnknownError"
      }),
      { status: 500, headers }
    )
  }
})
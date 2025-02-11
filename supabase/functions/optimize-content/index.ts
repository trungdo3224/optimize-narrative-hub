
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4.28.0'
import { serve } from "https://deno.fresh.runtime.dev/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  text: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get credentials from environment variables
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!openaiApiKey) {
      throw new Error('Missing OpenAI API key')
    }

    // Initialize OpenAI and Supabase clients
    const openai = new OpenAI({ apiKey: openaiApiKey })
    const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!)

    // Get user token from request header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    // Get original text from request body
    const { text }: RequestBody = await req.json()
    if (!text) {
      throw new Error('Missing text in request body')
    }

    // Get user information from the token
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    if (userError || !user) {
      throw new Error('Invalid user token')
    }

    // Create optimization history entry
    const { data: historyEntry, error: historyError } = await supabase
      .from('optimization_history')
      .insert({
        user_id: user.id,
        original_text: text,
        status: 'processing'
      })
      .select()
      .single()

    if (historyError) {
      throw new Error('Failed to create history entry')
    }

    // Get SEO optimization from OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an SEO expert. Analyze and optimize the given content following these guidelines:
            - Improve readability and structure
            - Optimize keyword usage and density
            - Add relevant LSI keywords
            - Suggest better headings and meta descriptions
            - Enhance content structure with proper heading hierarchy
            Return the optimized content along with a detailed analysis of changes made.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.7,
    })

    const optimizedContent = completion.choices[0].message.content
    const seoScore = Math.floor(Math.random() * 30) + 70 // Placeholder scoring logic

    // Update optimization history with results
    const { error: updateError } = await supabase
      .from('optimization_history')
      .update({
        optimized_text: optimizedContent,
        seo_score: seoScore,
        status: 'completed',
        optimization_details: {
          score: seoScore,
          timestamp: new Date().toISOString(),
          model: "gpt-4"
        }
      })
      .eq('id', historyEntry.id)

    if (updateError) {
      throw new Error('Failed to update optimization results')
    }

    return new Response(
      JSON.stringify({
        optimized_text: optimizedContent,
        seo_score: seoScore
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})

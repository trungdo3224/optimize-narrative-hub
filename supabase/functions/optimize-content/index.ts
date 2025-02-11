
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
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
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!geminiApiKey) {
      throw new Error('Missing Gemini API key')
    }

    // Initialize Supabase client
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

    // Get SEO optimization from Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `As an SEO expert, optimize the following content. Follow these guidelines:
                - Improve readability and structure
                - Optimize keyword usage and density
                - Add relevant LSI keywords
                - Suggest better headings and meta descriptions
                - Enhance content structure with proper heading hierarchy
                
                Content to optimize:
                ${text}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    const data = await response.json();
    const optimizedContent = data.candidates[0].content.parts[0].text;
    const seoScore = Math.floor(Math.random() * 30) + 70; // Placeholder scoring logic

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
          model: "gemini-pro"
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
    console.error('Optimization error:', error);
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

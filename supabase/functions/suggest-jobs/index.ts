import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid token');
    }

    const { profile } = await req.json();

    // Create AI prompt based on user profile
    const prompt = `Based on the following user profile, suggest 5-8 specific job titles that would be perfect matches. Focus on real job titles that exist in the market.

User Profile:
- Education: ${profile.education || 'Not specified'}
- Specialization: ${profile.specialization || 'Not specified'}
- Skills: ${profile.skills?.join(', ') || 'None specified'}
- Interests: ${profile.interests?.join(', ') || 'None specified'}

For each job suggestion, provide:
1. Job title (be specific)
2. Match percentage (realistic 65-95%)
3. Brief reason why it matches (2-3 sentences)
4. Required skills (3-5 skills)
5. Typical salary range
6. Common locations for this role

Format as JSON array with this structure:
[
  {
    "job_title": "Senior Frontend Developer",
    "match_percentage": 85,
    "reason": "Your React and JavaScript skills align perfectly with frontend development. The combination of your technical skills and user interface interest makes this an excellent match.",
    "required_skills": ["React", "JavaScript", "CSS", "TypeScript", "HTML"],
    "salary_range": "$70,000 - $120,000",
    "location": "Remote/San Francisco/New York"
  }
]

Only return the JSON array, no other text.`;

    console.log('Making OpenAI request for user:', user.id);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a career advisor AI that provides personalized job recommendations based on user profiles. Always respond with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log('OpenAI response received');

    let jobSuggestions;
    try {
      jobSuggestions = JSON.parse(aiResponse.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse.choices[0].message.content);
      throw new Error('Invalid AI response format');
    }

    // Clear old suggestions and insert new ones
    await supabase
      .from('job_suggestions')
      .delete()
      .eq('user_id', user.id);

    // Insert new suggestions into database
    const suggestionPromises = jobSuggestions.map((suggestion: any) => ({
      user_id: user.id,
      job_title: suggestion.job_title,
      match_percentage: suggestion.match_percentage,
      reason: suggestion.reason,
      required_skills: suggestion.required_skills,
      salary_range: suggestion.salary_range,
      location: suggestion.location,
      job_type: 'Full-time',
      company: 'Various Companies',
      description: `${suggestion.reason} This role typically requires ${suggestion.required_skills.join(', ')} and offers competitive compensation in the ${suggestion.salary_range} range.`
    }));

    const { error: insertError } = await supabase
      .from('job_suggestions')
      .insert(suggestionPromises);

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error('Failed to save job suggestions');
    }

    console.log('Job suggestions saved successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      suggestions: jobSuggestions.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in suggest-jobs function:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
// app/api/generate-queries/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { logEnrichmentData } from '../../../lib/logger';

interface BusinessContext {
  businessName: string;
  industry: string;
  businessModel: string;
  targetCustomer: string;
  brandPositioning: string;
  goals: string[];
  additionalContext: string;
}

interface Variable {
  variable: string;
  category: string;
  rationale: string;
}

interface QueryBucket {
  category: string;
  description: string;
  queries: string[];
}

function generateQueryPrompt(
  businessContext: BusinessContext, 
  selectedVariables: Variable[], 
  insights: string
): string {
  const variablesList = selectedVariables.map(v => `${v.variable} (${v.category})`).join(', ');
  
  return `You are a strategic business intelligence analyst generating natural language database queries.

BUSINESS CONTEXT:
- Business: ${businessContext.businessName}
- Industry: ${businessContext.industry}
- Business Model: ${businessContext.businessModel}
- Target Customer: ${businessContext.targetCustomer}
- Brand Positioning: ${businessContext.brandPositioning}
- Goals: ${businessContext.goals.join(', ')}

SELECTED VARIABLES ANALYZED: ${variablesList}

KEY INSIGHTS DISCOVERED:
${insights.substring(0, 1500)}...

YOUR TASK: Generate natural language queries in TWO strategic buckets:

BUCKET 1: MARKET INTELLIGENCE QUERIES
Generate 3-4 natural language queries that would help this business understand their market landscape, competitive positioning, and customer segments in greater depth. These should be analytical queries that reveal market opportunities and strategic positioning insights.

BUCKET 2: GROWTH AUDIENCE QUERIES  
Generate 3-4 natural language queries that would help this business identify and size potential growth audiences - finding more customers like their best existing customers. These should focus on audience discovery, market expansion, and prospect identification.

REQUIREMENTS:
- Make queries specific to this business context and industry
- Reference geographic areas, demographics, or characteristics mentioned in the insights
- Use natural, business-friendly language (not technical SQL terms)
- Each query should be actionable and lead to specific business decisions
- Queries should leverage the variables that were analyzed

RESPOND IN JSON FORMAT:
{
  "marketIntelligence": {
    "category": "Market Intelligence & Competitive Analysis",
    "description": "Deep analytical queries to understand market dynamics and positioning opportunities",
    "queries": ["query1", "query2", "query3", "query4"]
  },
  "growthAudiences": {
    "category": "Growth Audience Discovery", 
    "description": "Prospect identification and market expansion opportunities",
    "queries": ["query1", "query2", "query3", "query4"]
  }
}

Focus on creating queries that would naturally lead to SQL analysis against a customer intelligence database.`;
}

function generateFallbackQueries(businessContext: BusinessContext, selectedVariables: Variable[]): any {
  const industry = businessContext.industry.toLowerCase();
  const isRetail = industry.includes('retail') || industry.includes('food');
  const isRealEstate = industry.includes('real estate');
  const isProfessionalServices = industry.includes('professional') || industry.includes('services');

  let marketQueries = [
    `Analyze demographic composition and income distribution in the top 3 markets for ${businessContext.businessName}`,
    `Compare lifestyle preferences and purchasing behaviors across different age groups in our target geography`,
    `Show education levels, professional occupations, and family status patterns among high-value customer segments`,
    `Identify market segments with the highest concentration of customers matching our ideal profile`
  ];

  let growthQueries = [
    `Count prospects matching our best customer profile: similar demographics, income levels, and lifestyle interests`,
    `Size the addressable market for customers with high disposable income and interests aligned with our positioning`,
    `Quantify growth opportunities in adjacent zip codes with similar demographic patterns to our current customer base`,
    `Estimate market potential for premium segments that match our most profitable customer characteristics`
  ];

  // Customize based on industry
  if (isRetail) {
    marketQueries[1] = `Compare shopping behaviors, brand preferences, and spending patterns across different demographic segments`;
    growthQueries[0] = `Count prospects with high disposable income, premium product affinity, and shopping behaviors matching our best customers`;
  } else if (isRealEstate) {
    marketQueries[0] = `Analyze homeownership rates, property values, and investment behavior across target neighborhoods`;
    growthQueries[0] = `Count high-net-worth prospects with investment experience and property ownership in target markets`;
  } else if (isProfessionalServices) {
    marketQueries[1] = `Compare business ownership, professional occupations, and service purchasing patterns across market segments`;
    growthQueries[0] = `Count business owners and professionals with characteristics matching our most engaged clients`;
  }

  return {
    marketIntelligence: {
      category: "Market Intelligence & Competitive Analysis",
      description: "Deep analytical queries to understand market dynamics and positioning opportunities",
      queries: marketQueries
    },
    growthAudiences: {
      category: "Growth Audience Discovery",
      description: "Prospect identification and market expansion opportunities", 
      queries: growthQueries
    }
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessContext, selectedVariables, insights } = body;

    if (!businessContext || !selectedVariables || !insights) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.log('No API key found, using fallback queries');
      return NextResponse.json({
        queryBuckets: generateFallbackQueries(businessContext, selectedVariables)
      });
    }

    const prompt = generateQueryPrompt(businessContext, selectedVariables, insights);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Anthropic API error: ${response.status} - ${errorText}`);
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content[0].text.trim();

    // Parse JSON response
    let queryBuckets;
    try {
      // Clean up markdown formatting if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      }
      queryBuckets = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.log('Raw AI response:', content);
      queryBuckets = generateFallbackQueries(businessContext, selectedVariables);
    }

    return NextResponse.json({ queryBuckets });

  } catch (error) {
    console.error('Error generating queries:', error);
    try {
      const body = await request.json();
      const { businessContext, selectedVariables } = body;
      const fallbackQueries = generateFallbackQueries(businessContext, selectedVariables);
      return NextResponse.json({ queryBuckets: fallbackQueries });
    } catch {
      return NextResponse.json({ 
        error: 'Failed to generate queries' 
      }, { status: 500 });
    }
  }
}
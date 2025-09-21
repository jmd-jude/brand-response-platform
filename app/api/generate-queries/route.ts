// app/api/generate-queries/route.ts
import { NextRequest, NextResponse } from 'next/server';

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

function generateEnhancedQueryPrompt(
  businessContext: BusinessContext, 
  selectedVariables: Variable[], 
  insights: string,
  aggregatedData: any
): string {
  const variablesList = selectedVariables.map(v => `${v.variable} (${v.category})`).join(', ');
  
  // Extract key patterns from aggregated data
let dataPatterns = "No enriched data available";
if (aggregatedData && aggregatedData.variableAnalysis) {
  const patterns: string[] = [];
  
  Object.entries(aggregatedData.variableAnalysis).forEach(([fieldName, analysis]: [string, any]) => {
    if (analysis && typeof analysis === 'object' && analysis.summary) {
      patterns.push(`- ${fieldName}: ${analysis.summary}`);
    }
  });
    
    Object.entries(aggregatedData.variableAnalysis).forEach(([fieldName, analysis]: [string, any]) => {
      if (analysis.summary) {
        patterns.push(`- ${fieldName}: ${analysis.summary}`);
      }
    });
    
    if (patterns.length > 0) {
      dataPatterns = patterns.join('\n');
    }
  }
  
  return `You are a strategic business intelligence analyst generating natural language database queries based on ACTUAL customer data patterns.

BUSINESS CONTEXT:
- Business: ${businessContext.businessName}
- Industry: ${businessContext.industry}
- Business Model: ${businessContext.businessModel}
- Target Customer Assumption: ${businessContext.targetCustomer}
- Brand Positioning: ${businessContext.brandPositioning}
- Goals: ${businessContext.goals.join(', ')}
- Additional User-Defined Business Context: ${businessContext.additionalContext ? `- Additional Context: ${businessContext.additionalContext} **[IMPORTANT: Incorporate any geographic references into queries logic where appropriate.]**` : ''}

SELECTED VARIABLES ANALYZED: ${variablesList}

ACTUAL CUSTOMER DATA PATTERNS DISCOVERED:
${dataPatterns}

STRATEGIC INSIGHTS:
${insights.substring(0, 1000)}...

YOUR TASK: Generate natural language business queries that leverage the SPECIFIC data patterns discovered above. These will be given to a Senior Analyst who will query an Identity Data Graph database.

BUCKET 1: MARKET ANALYSIS QUERIES
Generate 3-4 queries that help understand market dynamics using the actual demographic/economic patterns found. Reference actual data and patterns that were discovered.

BUCKET 2: LOOKALIKE AUDIENCE QUERIES  
Generate 3-4 queries to find and size audiences matching the discovered customer profile. Use the actual characteristics found in the analyses.

REQUIREMENTS:
- Reference SPECIFIC data patterns from the analysis above.
- Use natural business language, not technical terms
- Make queries usable in a 'natural language to SQL' application for audience sizing and market expansion

RESPOND IN JSON FORMAT:
{
  "marketIntelligence": {
    "category": "Market Analysis",
    "description": "Queries to understand market size and landscape",
    "queries": ["query1", "query2", "query3", "query4"]
  },
  "growthAudiences": {
    "category": "Lookalike Audience", 
    "description": "Find prospects matching discovered customer patterns",
    "queries": ["query1", "query2", "query3", "query4"]
  }
}

Focus on queries that reference the specific patterns discovered in the data analysis. No fancy marketing speak. No AI slop.`;
}

function generateFallbackQueries(businessContext: BusinessContext, selectedVariables: Variable[]): any {
  const industry = businessContext.industry.toLowerCase();
  
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

  // Industry-specific customization
  if (industry.includes('food') || industry.includes('retail')) {
    marketQueries[1] = `Compare shopping behaviors, brand preferences, and spending patterns across different demographic segments`;
    growthQueries[0] = `Count prospects with high disposable income, premium product affinity, and shopping behaviors matching our best customers`;
  } else if (industry.includes('real estate')) {
    marketQueries[0] = `Analyze homeownership rates, property values, and investment behavior across target neighborhoods`;
    growthQueries[0] = `Count high-net-worth prospects with investment experience and property ownership in target markets`;
  } else if (industry.includes('professional') || industry.includes('services')) {
    marketQueries[1] = `Compare business ownership, professional occupations, and service purchasing patterns across market segments`;
    growthQueries[0] = `Count business owners and professionals with characteristics matching our most engaged clients`;
  }

  return {
    marketIntelligence: {
      category: "Market Analysis",
      description: "Queries to understand market size and landscape",
      queries: marketQueries
    },
    growthAudiences: {
      category: "Growth Audience Discovery",
      description: "Find prospects matching discovered customer patterns", 
      queries: growthQueries
    }
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessContext, selectedVariables, insights, aggregatedData } = body;

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

    // Use enhanced prompt that includes aggregated data patterns
    const prompt = generateEnhancedQueryPrompt(businessContext, selectedVariables, insights, aggregatedData);

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
        temperature: 0.5,
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
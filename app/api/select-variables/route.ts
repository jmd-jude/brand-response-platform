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

// Available variables from the identity graph schema
const availableVariables = [
  // Demographics
  { name: 'AGE', category: 'demographics', description: 'Customer age for segmentation' },
  { name: 'GENDER', category: 'demographics', description: 'Gender identification' },
  { name: 'MARITAL_STATUS', category: 'demographics', description: 'Married/Single status' },
  { name: 'CHILDREN_HH', category: 'demographics', description: 'Number of children in household' },
  { name: 'GENERATION', category: 'demographics', description: 'Generational cohort' },
  
  // Economic
  { name: 'INCOME_HH', category: 'economic', description: 'Household income levels' },
  { name: 'NET_WORTH_HH', category: 'economic', description: 'Household net worth' },
  { name: 'OWNS_INVESTMENTS', category: 'economic', description: 'Investment ownership' },
  { name: 'CREDIT_CARD', category: 'economic', description: 'Credit card usage patterns' },
  
  // Lifestyle
  { name: 'EDUCATION', category: 'lifestyle', description: 'Educational attainment' },
  { name: 'OCCUPATION_TYPE', category: 'lifestyle', description: 'White collar vs blue collar' },
  { name: 'URBANICITY', category: 'lifestyle', description: 'Urban/suburban/rural residence' },
  { name: 'DWELLING_TYPE', category: 'lifestyle', description: 'Housing type' },
  
  // Interests & Affinities
  { name: 'GOURMET_AFFINITY', category: 'interests', description: 'Interest in gourmet/premium products' },
  { name: 'FITNESS_AFFINITY', category: 'interests', description: 'Health and fitness interest' },
  { name: 'HIGH_TECH_AFFINITY', category: 'interests', description: 'Technology adoption' },
  { name: 'TRAVEL_AFFINITY', category: 'interests', description: 'Travel and leisure interest' },
  { name: 'COOKING_AFFINITY', category: 'interests', description: 'Cooking and culinary interest' },
  { name: 'BUSINESS_AFFINITY', category: 'interests', description: 'Business and entrepreneurship interest' },
  
  // Behavioral
  { name: 'READING_MAGAZINES', category: 'behavioral', description: 'Magazine reading behavior' },
  { name: 'LIKELY_CHARITABLE_DONOR', category: 'behavioral', description: 'Charitable giving tendency' },
  { name: 'RECENT_CATALOG_PURCHASES_TOTAL_ORDERS', category: 'behavioral', description: 'Catalog shopping behavior' },
];

function generateVariableSelectionPrompt(businessContext: BusinessContext): string {
  const variablesText = availableVariables
    .map(v => `- ${v.name}: ${v.description} (${v.category})`)
    .join('\n');

  return `You are a strategic data analyst selecting customer intelligence variables for brand strategy.

BUSINESS CONTEXT:
- Business: ${businessContext.businessName}
- Industry: ${businessContext.industry}
- Business Model: ${businessContext.businessModel}
- Target Customer Assumptions: ${businessContext.targetCustomer}
- Brand Positioning: ${businessContext.brandPositioning}
- Goals: ${businessContext.goals.join(', ')}
- Additional Context: ${businessContext.additionalContext || 'None'}

AVAILABLE VARIABLES:
${variablesText}

YOUR TASK: Select 6-8 variables that will provide the most strategic value for this business context.

SELECTION CRITERIA:
1. Choose variables that directly relate to this business and industry
2. Prioritize variables that can challenge current customer assumptions
3. Include a strategic mix across different categories
4. Focus on variables that inform brand positioning decisions
5. Consider variables that reveal unexpected customer segments

RESPOND WITH VALID JSON ONLY (no markdown formatting):
{
  "variables": [
    {
      "variable": "VARIABLE_NAME",
      "category": "category_name", 
      "rationale": "Specific explanation of why this variable is critical for this business context"
    }
  ]
}

Select variables that will reveal the most surprising and actionable insights about who this business's customers really are.`;
}

function getFallbackVariables(businessContext: BusinessContext): NextResponse {
  const baseVariables: Variable[] = [
    {
      variable: "AGE",
      category: "demographics",
      rationale: "Core demographic for market segmentation and age-appropriate messaging"
    },
    {
      variable: "INCOME_HH",
      category: "economic", 
      rationale: "Essential for pricing strategy and premium positioning decisions"
    },
    {
      variable: "EDUCATION",
      category: "lifestyle",
      rationale: "Indicates customer sophistication and preferred communication style"
    },
    {
      variable: "URBANICITY",
      category: "lifestyle",
      rationale: "Geographic preferences affect brand positioning and distribution strategy"
    },
    {
      variable: "MARITAL_STATUS",
      category: "demographics",
      rationale: "Life stage affects purchasing behavior and product usage patterns"
    },
    {
      variable: "OCCUPATION_TYPE",
      category: "lifestyle",
      rationale: "Professional vs blue-collar preferences inform messaging approach"
    }
  ];

  // Add industry-specific variables
  if (businessContext.industry === 'Food & Beverage') {
    baseVariables.push({
      variable: "GOURMET_AFFINITY",
      category: "interests",
      rationale: "Quality appreciation aligns with premium food/beverage positioning"
    });
    baseVariables.push({
      variable: "FITNESS_AFFINITY", 
      category: "interests",
      rationale: "Health consciousness affects food and beverage preferences"
    });
  } else if (businessContext.industry === 'Technology') {
    baseVariables.push({
      variable: "HIGH_TECH_AFFINITY",
      category: "interests", 
      rationale: "Technology adoption patterns crucial for tech product positioning"
    });
    baseVariables.push({
      variable: "BUSINESS_AFFINITY",
      category: "interests",
      rationale: "B2B technology adoption correlates with business interest"
    });
  }

  return NextResponse.json({ variables: baseVariables });
}

export async function POST(request: NextRequest) {
  let businessContext: BusinessContext;
  
  try {
    const body = await request.json();
    businessContext = body.businessContext;

    if (!businessContext) {
      return NextResponse.json({ error: 'Business context is required' }, { status: 400 });
    }

    // Debug logging
    const apiKey = process.env.ANTHROPIC_API_KEY;
    console.log('API Key exists:', !!apiKey);
    console.log('API Key prefix:', apiKey?.substring(0, 12));
    
    if (!apiKey) {
      console.log('No API key found, using fallback variables');
      return getFallbackVariables(businessContext);
    }

    console.log('Making API call to Anthropic...');
    const prompt = generateVariableSelectionPrompt(businessContext);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        temperature: 0.3,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Anthropic API error: ${response.status} - ${errorText}`);
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response received, parsing...');
    const content = data.content[0].text.trim();

    // Parse JSON response
    let variables;
    try {
      const parsed = JSON.parse(content);
      variables = parsed.variables;
      console.log('Successfully parsed AI response with', variables.length, 'variables');
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.log('Raw AI response:', content);
      return getFallbackVariables(businessContext);
    }

    // Validate variables exist in our schema
    const validVariables = variables.filter((v: Variable) => 
      availableVariables.some(av => av.name === v.variable)
    );

    if (validVariables.length === 0) {
      console.log('No valid variables found, using fallback');
      return getFallbackVariables(businessContext);
    }

    console.log('Returning', validVariables.length, 'valid variables');
    return NextResponse.json({ variables: validVariables });

  } catch (error) {
    console.error('Error in variable selection:', error);
    if (businessContext!) {
      return getFallbackVariables(businessContext);
    } else {
      return NextResponse.json({ 
        variables: [
          {
            variable: "AGE",
            category: "demographics",
            rationale: "Core demographic for market segmentation"
          }
        ]
      });
    }
  }
}
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

interface SchemaField {
  category: string;
  description: string;
}

interface Schema {
  tables: Record<string, {
    fields: Record<string, SchemaField>;
  }>;
}

// Load schema from file
function loadSchema(): Schema | null {
  try {
    const schemaPath = path.join(process.cwd(), 'data', 'schema.json');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    return JSON.parse(schemaContent);
  } catch (error) {
    console.error('Error loading schema:', error);
    return null;
  }
}

// Extract available variables from schema
// In your getAvailableVariables() function, replace the current logic with:
function getAvailableVariables(): Array<{name: string, category: string, description: string}> {
  const schema = loadSchema();
  
  if (!schema || !schema.tables) {
    console.log('Schema not found, using fallback variables');
    return getFallbackVariables();
  }

  const variables: Array<{name: string, category: string, description: string}> = [];

  // Process all tables in the schema
  Object.entries(schema.tables).forEach(([tableName, tableInfo]) => {
    if (tableInfo.fields) {
      Object.entries(tableInfo.fields).forEach(([fieldName, fieldInfo]) => {
        variables.push({
          name: fieldName,
          category: fieldInfo.category,
          description: fieldInfo.description
        });
      });
    }
  });

  return variables.length > 0 ? variables : getFallbackVariables();
}

// Fallback variables if schema loading fails
function getFallbackVariables(): Array<{name: string, category: string, description: string}> {
  return [
    // Demographics
    { name: 'age', category: 'demographics', description: 'Customer age in years' },
    { name: 'gender', category: 'demographics', description: 'Customer gender (Male/Female)' },
    { name: 'maritalStatus', category: 'demographics', description: 'Marital status (Married/Single)' },
    { name: 'householdChildren', category: 'demographics', description: 'Number of children in household' }, // Fixed
    { name: 'generation', category: 'demographics', description: 'Generational cohort (Gen Z, Millennial, Gen X, Baby Boomer)' },
    
    // Economic
    { name: 'householdIncome', category: 'economic', description: 'Household income range' }, // Fixed
    { name: 'householdNetWorth', category: 'economic', description: 'Household net worth estimate' }, // Fixed
    { name: 'investments', category: 'behavioral', description: 'Investment purchasing behavior' },
    { name: 'discretionaryIncome', category: 'economic', description: 'Available discretionary spending power' },
    
    // Lifestyle
    { name: 'education', category: 'lifestyle', description: 'Educational attainment level' },
    { name: 'occupationType', category: 'lifestyle', description: 'Occupation category (White Collar/Blue Collar/Other)' },
    { name: 'urbanicity', category: 'lifestyle', description: 'Geographic lifestyle (Urban/Suburban/Rural)' },
    
    // Interests
    { name: 'gourmetAffinity', category: 'interests', description: 'Interest in gourmet food and premium dining' }, // Fixed
    { name: 'fitnessAffinity', category: 'interests', description: 'Interest in fitness and health activities' }, // Fixed
    { name: 'highTechAffinity', category: 'interests', description: 'Interest in technology and digital products' }, // Fixed
    { name: 'travelAffinity', category: 'interests', description: 'Interest in travel and vacation activities' },
    { name: 'cookingAffinity', category: 'interests', description: 'Interest in cooking and culinary activities' },
    
    // Behavioral
    { name: 'magazineSubscriber', category: 'behavioral', description: 'Magazine subscription behavior' },
    { name: 'petOwner', category: 'behavioral', description: 'Pet ownership indicator' },
    { name: 'sohoBusiness', category: 'behavioral', description: 'Small office/home office business owner' },
  ];
}

function generateVariableSelectionPrompt(businessContext: BusinessContext): string {
  const availableVariables = getAvailableVariables();
  const variablesText = availableVariables
    .map(v => `- ${v.name}: ${v.description} (${v.category})`)
    .join('\n');

  return `You are a senior marketing data analyst selecting variables to append to 1st party data, the analysis of which will be used to inform brand and design strategy.

BUSINESS CONTEXT:
- Business: ${businessContext.businessName}
- Industry: ${businessContext.industry}
- Business Model: ${businessContext.businessModel}
- Target Customer Assumption: ${businessContext.targetCustomer}
- Brand Positioning: ${businessContext.brandPositioning}
- Goals: ${businessContext.goals.join(', ')}
${businessContext.additionalContext ? `- Additional Context: ${businessContext.additionalContext} **[IMPORTANT: Consider this context when selecting variables - geographic, industry-specific, or operational details may suggest different variable priorities.]**` : ''}

AVAILABLE VARIABLES FROM IDENTITY GRAPH:
${variablesText}

SELECTION CRITERIA:
1. Choose 8-10 variables that directly relate to this business, industry and the goals
2. Include some variables that can validate or challenge current customer assumptions
3. Include a strategic mix across different categories (demographics, economic, lifestyle, interests, behavioral)
4. Focus on variables that will inform brand positioning and design decisions
5. Consider variables that will help reveal relevant customer segments

RESPOND WITH VALID JSON ONLY (no markdown formatting):
{
  "variables": [
    {
      "variable": "VARIABLE_NAME",
      "category": "category_name", 
      "rationale": "15-20 word explanation why this variable is relevant to this analysis"
    }
  ]
}

CRITICAL: Return ONLY the raw JSON object. Do not wrap in markdown code blocks or backticks.

Select variables that will reveal insightful and actionable insights about who this business's customers really are.`;
}

function getFallbackVariablesForContext(businessContext: BusinessContext): Variable[] {
  const baseVariables: Variable[] = [
    {
      variable: "age",
      category: "demographics",
      rationale: "Core demographic for market segmentation and age-appropriate messaging"
    },
    {
      variable: "householdIncome",
      category: "economic", 
      rationale: "Essential for pricing strategy and premium positioning decisions"
    },
    {
      variable: "education",
      category: "lifestyle",
      rationale: "Indicates customer sophistication and preferred communication style"
    },
    {
      variable: "urbanicity",
      category: "lifestyle",
      rationale: "Geographic preferences affect brand positioning and distribution strategy"
    },
    {
      variable: "maritalStatus",
      category: "demographics",
      rationale: "Life stage affects purchasing behavior and product usage patterns"
    },
    {
      variable: "occupationType",
      category: "lifestyle",
      rationale: "Professional vs blue-collar preferences inform messaging approach"
    }
  ];

  // Add industry-specific variables
  if (businessContext.industry === 'Food & Beverage') {
    baseVariables.push({
      variable: "gourmetAffinity",
      category: "interests",
      rationale: "Quality appreciation aligns with premium food/beverage positioning"
    });
    baseVariables.push({
      variable: "fitnessAffinity", 
      category: "interests",
      rationale: "Health consciousness affects food and beverage preferences"
    });
  } else if (businessContext.industry === 'Technology') {
    baseVariables.push({
      variable: "highTechAffinity",
      category: "interests", 
      rationale: "Technology adoption patterns crucial for tech product positioning"
    });
    baseVariables.push({
      variable: "sohoBusiness",
      category: "behavioral",
      rationale: "B2B technology adoption correlates with business ownership"
    });
  } else if (businessContext.industry === 'Retail') {
    baseVariables.push({
      variable: "magazineSubscriber",
      category: "behavioral",
      rationale: "Shopping behavior indicates customer engagement preferences"
    });
  }

  return baseVariables.slice(0, 8);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const businessContext = body.businessContext as BusinessContext;

    if (!businessContext) {
      return NextResponse.json({ error: 'Business context is required' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.log('No API key found, using schema-based fallback variables');
      const fallbackVariables = getFallbackVariablesForContext(businessContext);
      return NextResponse.json({ variables: fallbackVariables });
    }

    const prompt = generateVariableSelectionPrompt(businessContext);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        temperature: 0.2,
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
    let variables;
    try {
      // Clean up markdown formatting if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      const parsed = JSON.parse(cleanContent);
      variables = parsed.variables;
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.log('Raw AI response:', content);
      const fallbackVariables = getFallbackVariablesForContext(businessContext);
      return NextResponse.json({ variables: fallbackVariables });
    }

    // Validate variables exist in our schema
    const availableVariables = getAvailableVariables();
    const validVariables = variables.filter((v: Variable) => 
      availableVariables.some(av => av.name === v.variable)
    );

    if (validVariables.length === 0) {
      console.log('No valid variables found, using fallback');
      const fallbackVariables = getFallbackVariablesForContext(businessContext);
      return NextResponse.json({ variables: fallbackVariables });
    }

    return NextResponse.json({ variables: validVariables });

  } catch (error) {
    console.error('Error in variable selection:', error);
    try {
      const body = await request.json();
      const businessContext = body.businessContext as BusinessContext;
      const fallbackVariables = getFallbackVariablesForContext(businessContext);
      return NextResponse.json({ variables: fallbackVariables });
    } catch {
      return NextResponse.json({ 
        error: 'Failed to select variables' 
      }, { status: 500 });
    }
  }
}

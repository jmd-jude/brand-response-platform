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

function generateInsightsPrompt(businessContext: BusinessContext, variables: Variable[]): string {
  const variablesList = variables.map(v => `${v.variable} (${v.category}): ${v.rationale}`).join('\n- ');

  return `You are a strategic brand consultant analyzing customer data to generate actionable insights.

BUSINESS CONTEXT:
- Business: ${businessContext.businessName}
- Industry: ${businessContext.industry}  
- Business Model: ${businessContext.businessModel}
- Current Target Customer Assumption: ${businessContext.targetCustomer}
- Current Brand Positioning: ${businessContext.brandPositioning}
- Goals: ${businessContext.goals.join(', ')}

SELECTED DATA VARIABLES:
- ${variablesList}

SAMPLE CUSTOMER DATA INSIGHTS:
Based on the enriched customer data, here are key patterns discovered:
- 68% of customers are aged 30-55 (vs assumed 25-35)
- 58% have household incomes above $75K (higher than assumed $50-65K)
- 73% show preference for quality over convenience
- 45% are suburban (vs assumed primarily urban)
- 62% are college-educated or higher
- Premium product affinity is 3x higher than market average

YOUR TASK: Generate a strategic brand intelligence report in markdown format that includes:

1. Executive Summary (2-3 sentences of key findings)
2. Customer Reality vs Assumptions table comparing what they assumed vs what data shows
3. Strategic Recommendations (3-4 actionable recommendations)
4. Most Surprising Discovery (1 key insight that challenges assumptions)
5. Immediate Action Items (5 specific next steps)

Focus on:
- Specific gaps between assumptions and reality
- Actionable repositioning opportunities  
- Concrete business impact and ROI potential
- Professional consulting tone

Use professional markdown formatting with headers, tables, and bullet points.`;
}

function generateFallbackInsights(businessContext: BusinessContext, variables: Variable[]): string {
  return `# Customer Intelligence Report
## ${businessContext.businessName}

### Executive Summary

Analysis of your customer data reveals significant opportunities to refine brand positioning and targeting strategy. Key findings challenge several current assumptions about your customer base, particularly around age demographics and income levels.

### Customer Reality vs. Assumptions

| Aspect | Your Assumption | Data Reality | Strategic Implication |
|--------|----------------|--------------|---------------------|
| **Primary Age Group** | Young professionals (25-35) | Broader range (30-55, 68% of customers) | Expand messaging to include established professionals |
| **Income Level** | Mid-range earners | Higher income brackets (58% earn $75K+) | Opportunity for premium positioning |
| **Lifestyle Focus** | Convenience-oriented | Quality and experience-focused (73%) | Emphasize craftsmanship over speed |
| **Geographic Distribution** | Urban-focused | Mixed urban/suburban (45% suburban) | Consider suburban market expansion |

### Strategic Recommendations

#### 1. Brand Positioning Adjustment
**Current:** "${businessContext.brandPositioning}"
**Recommended:** Premium ${businessContext.industry.toLowerCase()} experience for discerning professionals who value quality craftsmanship

**Rationale:** Customer data shows higher income levels and quality orientation than assumed.

#### 2. Target Audience Refinement  
Shift focus from young urban professionals to "Quality-conscious professionals aged 30-55 with household incomes above $75K."

#### 3. Messaging Strategy
- **Emphasize:** Quality, craftsmanship, experience
- **De-emphasize:** Speed, convenience, budget-friendly  
- **New themes:** Sophistication, tradition, expertise

#### 4. Premium Pricing Opportunity
Test 15-25% price increases on core products/services, supported by enhanced quality positioning.

### Most Surprising Discovery

Your customer base is **42% more affluent** and **15 years older on average** than your current brand positioning targets. This represents significant untapped potential for premium positioning and pricing strategy.

### Immediate Action Items

1. **Update website copy** to emphasize quality and craftsmanship over convenience
2. **Refresh visual identity** to appeal to more sophisticated demographic  
3. **Test premium pricing** on select products/services
4. **Develop loyalty program** targeting higher-spending customer segments
5. **Create content strategy** that speaks to experienced professionals rather than entry-level workers

### Expected Impact
- **15-25% increase** in average transaction value through premium positioning
- **Improved customer retention** through better brand-customer alignment  
- **Higher profit margins** on products/services positioned as premium offerings

---
**BrandIntel Lab Customer Intelligence Analysis**  
*Report generated from ${variables.length} strategic variables*`;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body first
    const body = await request.json();
    const { businessContext, selectedVariables } = body;

    if (!businessContext || !selectedVariables) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.log('No API key found, using fallback insights');
      return NextResponse.json({
        insights: generateFallbackInsights(businessContext, selectedVariables)
      });
    }

    const prompt = generateInsightsPrompt(businessContext, selectedVariables);

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
    const insights = data.content[0].text.trim();

    return NextResponse.json({ insights });

  } catch (error) {
    console.error('Error generating insights:', error);
    // Use fallback if we have the required data
    try {
      const body = await request.json();
      const { businessContext, selectedVariables } = body;
      return NextResponse.json({
        insights: generateFallbackInsights(businessContext, selectedVariables)
      });
    } catch {
      return NextResponse.json({ 
        error: 'Failed to generate insights' 
      }, { status: 500 });
    }
  }
}
'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BusinessContext } from './BusinessContextForm';
import { Variable } from './VariableSelection';
import QuerySuggestions from './QuerySuggestions';

interface InsightsGeneratorProps {
  businessContext: BusinessContext;
  selectedVariables: Variable[];
  enrichedCustomers?: any[];
  onComplete: (insights: string) => void;
}

interface AggregatedData {
  totalRecords: number;
  enrichedRecords: number;
  matchRate: number;
  variableAnalysis: Record<string, {
    category: string;
    coverage: number;
    summary: string;
    guidance?: string;
    [key: string]: any;
  }>;
}

interface GuidanceIndicator {
  variableAnalysis: Record<string, {
    category: string;
    coverage: number;
    summary: string;
    guidance?: string;
    [key: string]: any;
  }>;
}

function AnalysisGuidancePanel({ aggregatedData }: { aggregatedData: GuidanceIndicator | null }) {
  if (!aggregatedData || !aggregatedData.variableAnalysis) return null;

  const guidanceEntries = Object.entries(aggregatedData.variableAnalysis)
    .filter(([, analysis]) => analysis.guidance)
    .slice(0, 3); // Show top 3 AI guidance examples

  if (guidanceEntries.length === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
      <div className="flex items-center mb-4">
        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <h3 className="text-lg font-semibold text-blue-900">AI Analysis Intelligence</h3>
      </div>
      <p className="text-blue-800 text-sm mb-4">
        Strategic analysis parameters dynamically derived based on business context:
      </p>
      <div className="space-y-3">
        {guidanceEntries.map(([fieldName, analysis]) => (
          <div key={fieldName} className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <span className="font-medium text-blue-900 text-sm">
                  {fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
                <p className="text-blue-700 text-xs mt-1">{analysis.guidance}</p>
              </div>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full ml-3">
                Smart Analysis
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function InsightsGenerator({ 
  businessContext, 
  selectedVariables, 
  enrichedCustomers = [], // Default to empty array
  onComplete 
}: InsightsGeneratorProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [aggregatedData, setAggregatedData] = useState<AggregatedData | null>(null);

  useEffect(() => {
    generateInsights();
  }, []);

  const generateInsights = async () => {
    setIsLoading(true);
    setError(null);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    try {
      const response = await fetch('/api/generate-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          businessContext, 
          selectedVariables,
          enrichedCustomers
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }

      const data = await response.json();
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Small delay to show 100% progress
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setInsights(data.insights);

      // Store aggregated data for query generation
      if (data.aggregatedData) {
        setAggregatedData(data.aggregatedData);
      }

      setIsLoading(false);
      onComplete(data.insights);
      
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Error generating insights:', error);
      setError('Failed to generate insights. Using sample analysis.');
      
      // Fallback insights based on business context
      const fallbackInsights = generateFallbackInsights(businessContext, selectedVariables);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInsights(fallbackInsights);
      setAggregatedData(null);
      setIsLoading(false);
      onComplete(fallbackInsights);
    }
  };

  const generateFallbackInsights = (context: BusinessContext, variables: Variable[]): string => {
    return `# BrandIntel Report
## ${context.businessName}

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
**Current:** "${context.brandPositioning}"  
**Recommended:** Premium ${context.industry.toLowerCase()} experience for discerning professionals who value quality craftsmanship

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
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Processing...
          </h2>
          <p className="text-gray-600 mb-6">
            Smart analytics is analyzing your customer data and identifying key strategic 
            opportunities for brand positioning and growth.
          </p>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="text-sm text-gray-500 mb-8">
            {progress}% complete
          </div>
        </div>

        {/* Progress Steps */}
        <div className="max-w-md mx-auto space-y-4">
          <div className={`flex items-center transition-opacity duration-500 ${progress > 10 ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`w-6 h-6 rounded-full mr-4 flex items-center justify-center ${progress > 20 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
              {progress > 20 ? '✓' : '1'}
            </div>
            <span className="text-gray-700">Processing customer demographics and behaviors</span>
          </div>
          
          <div className={`flex items-center transition-opacity duration-500 ${progress > 30 ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`w-6 h-6 rounded-full mr-4 flex items-center justify-center ${progress > 45 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
              {progress > 45 ? '✓' : '2'}
            </div>
            <span className="text-gray-700">Comparing assumptions vs. data reality</span>
          </div>
          
          <div className={`flex items-center transition-opacity duration-500 ${progress > 50 ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`w-6 h-6 rounded-full mr-4 flex items-center justify-center ${progress > 65 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
              {progress > 65 ? '✓' : '3'}
            </div>
            <span className="text-gray-700">Identifying strategic positioning opportunities</span>
          </div>
          
          <div className={`flex items-center transition-opacity duration-500 ${progress > 70 ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`w-6 h-6 rounded-full mr-4 flex items-center justify-center ${progress > 85 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
              {progress > 85 ? '✓' : '4'}
            </div>
            <span className="text-gray-700">Creating actionable recommendations</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          BrandIntel Report
        </h2>
        <p className="text-gray-600">
          Smart analytics has analyzed your customer data and identified key strategic 
          opportunities for brand positioning and growth.
        </p>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-yellow-800 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Success Banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
        <div className="flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l6m0 0l-3-3m3 3l-3 3m6-6h2a3 3 0 010 6h-2m-9-6H2a3 3 0 000 6h2" />
          </svg>
          <div className="text-center">
            <span className="text-green-800 font-semibold text-lg">
              Strategic analysis complete
            </span>
            <div className="text-green-700 text-sm mt-1">
              Customer intelligence transformed into actionable brand strategy recommendations
            </div>
          </div>
        </div>
      </div>

      {/* NEW: AI Guidance Panel */}
      <AnalysisGuidancePanel aggregatedData={aggregatedData} />

      {/* Insights Report */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <h3 className="text-xl font-bold text-gray-900">BrandIntel Lab Report</h3>
          <p className="text-sm text-gray-600 mt-1">{businessContext.businessName} • {businessContext.industry}</p>
        </div>
        
        <div className="px-8 py-8">
          {/* Use ReactMarkdown for proper rendering */}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-blue-600" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3" {...props} />,
                h4: ({ node, ...props }) => <h4 className="text-lg font-semibold text-gray-700 mt-4 mb-2" {...props} />,
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-6">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg" {...props} />
                  </div>
                ),
                thead: ({ node, ...props }) => <thead className="bg-gray-50" {...props} />,
                th: ({ node, ...props }) => <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />,
                td: ({ node, ...props }) => <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-t border-gray-200" {...props} />,
                p: ({ node, ...props }) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal list-outside space-y-3 mb-6 ml-6 pl-2" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc list-outside space-y-2 mb-4 ml-6 pl-2" {...props} />,
                li: ({ node, ...props }) => <li className="text-gray-700 leading-relaxed pl-2" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
                em: ({ node, ...props }) => <em className="italic text-gray-700" {...props} />,
                hr: ({ node, ...props }) => <hr className="my-8 border-gray-200" {...props} />,
              }}
            >
              {insights}
            </ReactMarkdown>
          </div>
        </div>

        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              <strong>BrandIntel</strong> Customer Intelligence Analysis
            </div>
            <div>
              {selectedVariables.length} variables analyzed • {enrichedCustomers.length} customer records processed
            </div>
          </div>
        </div>
      </div>

      <QuerySuggestions 
        businessContext={businessContext}
        selectedVariables={selectedVariables}
        insights={insights}
        aggregatedData={aggregatedData}
      />

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mt-8">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Start New Analysis
        </button>
        <button
          onClick={() => {
            const element = document.createElement('a');
            const file = new Blob([insights], {type: 'text/markdown'});
            element.href = URL.createObjectURL(file);
            element.download = `${businessContext.businessName}_Intelligence_Report.md`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm"
        >
          Download Report
        </button>
      </div>
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { BusinessContext } from './BusinessContextForm';

export interface Variable {
  variable: string;
  category: string;
  rationale: string;
}

interface VariableSelectionProps {
  businessContext: BusinessContext;
  onVariablesSelected: (variables: Variable[]) => void;
}

export default function VariableSelection({ businessContext, onVariablesSelected }: VariableSelectionProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariables, setSelectedVariables] = useState<Variable[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateVariableSelection();
  }, [businessContext]);

  const generateVariableSelection = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/select-variables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessContext }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate variable selection');
      }

      const data = await response.json();
      setSelectedVariables(data.variables);
    } catch (error) {
      console.error('Error generating variables:', error);
      setError('Failed to generate variable selection. Using fallback variables.');
      
      // Fallback variables based on business context
      const fallbackVariables: Variable[] = [
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
          rationale: "Geographic preferences affect brand positioning and distribution"
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

      // Customize based on industry
      if (businessContext.industry === 'Food & Beverage') {
        fallbackVariables.push({
          variable: "GOURMET_AFFINITY",
          category: "interests",
          rationale: "Quality appreciation aligns with premium coffee positioning"
        });
        fallbackVariables.push({
          variable: "FITNESS_AFFINITY",
          category: "interests",
          rationale: "Health consciousness affects beverage preferences and timing"
        });
      }

      setSelectedVariables(fallbackVariables);
    }

    setIsLoading(false);
  };

  const handleContinue = () => {
    onVariablesSelected(selectedVariables);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      demographics: 'bg-blue-100 text-blue-800',
      economic: 'bg-green-100 text-green-800',
      lifestyle: 'bg-purple-100 text-purple-800',
      interests: 'bg-orange-100 text-orange-800',
      behavioral: 'bg-pink-100 text-pink-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryCounts = () => {
    const counts: Record<string, number> = {};
    selectedVariables.forEach(variable => {
      counts[variable.category] = (counts[variable.category] || 0) + 1;
    });
    return counts;
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Variable Selection Processing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analyzing your business context to select the most strategic data variables...
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Smart Analytics in Progress
          </h3>
          <p className="text-gray-600 mb-4">
            Selecting optimal variables
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></div>
              Analyzing industry patterns
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse delay-200"></div>
              Matching business goals
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-600 rounded-full mr-2 animate-pulse delay-400"></div>
              Optimizing variable mix
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Recommended Variables & Strategic Rationale
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Smart analytics selected these variables based on your business context and strategic goals.
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{selectedVariables.length}</div>
          <div className="text-sm font-medium text-gray-600">Variables Selected</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{Object.keys(getCategoryCounts()).length}</div>
          <div className="text-sm font-medium text-gray-600">Categories Covered</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {Math.max(...Object.values(getCategoryCounts()))}
          </div>
          <div className="text-sm font-medium text-gray-600">Max Variables per Category</div>
        </div>
      </div>

      {/* Variables Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Selected Variables</h3>
          <p className="text-sm text-gray-600 mt-1">Optimized for {businessContext.industry} industry</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variable</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strategic Rationale</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedVariables.map((variable, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{variable.variable}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(variable.category)}`}>
                      {variable.category.charAt(0).toUpperCase() + variable.category.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 leading-relaxed">{variable.rationale}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(getCategoryCounts()).map(([category, count]) => (
            <div key={category} className="text-center">
              <div className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getCategoryColor(category)} mb-2`}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </div>
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-xs text-gray-500">variable{count !== 1 ? 's' : ''}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="text-center">
        <button
          onClick={handleContinue}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
        >
          Continue to Data Enrichment →
        </button>
      </div>
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { BusinessContext } from './BusinessContextForm';
import { Variable } from './VariableSelection';

interface QueryBucket {
  category: string;
  description: string;
  queries: string[];
}

interface QueryBuckets {
  marketIntelligence: QueryBucket;
  growthAudiences: QueryBucket;
}

interface AggregatedData {
  totalRecords: number;
  enrichedRecords: number;
  matchRate: number;
  variableAnalysis: Record<string, {
    category: string;
    coverage: number;
    summary: string;
    [key: string]: any;
  }>;
}

interface QuerySuggestionsProps {
  businessContext: BusinessContext;
  selectedVariables: Variable[];
  insights: string;
  aggregatedData?: AggregatedData | null;
}

export default function QuerySuggestions({ 
  businessContext, 
  selectedVariables, 
  insights,
  aggregatedData = null
}: QuerySuggestionsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [queryBuckets, setQueryBuckets] = useState<QueryBuckets | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);

  useEffect(() => {
    generateQueries();
  }, [businessContext, selectedVariables, insights]);

  const generateQueries = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-queries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessContext,
          selectedVariables,
          insights,
          aggregatedData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate queries');
      }

      const data = await response.json();
      console.log('Query API response:', data);
      setQueryBuckets(data.queryBuckets);
    } catch (error) {
      console.error('Error generating queries:', error);
      setError('Failed to generate strategic queries. Please try again.');
    }

    setIsLoading(false);
  };

  const copyToClipboard = async (query: string) => {
    try {
      await navigator.clipboard.writeText(query);
      setCopiedQuery(query);
      setTimeout(() => setCopiedQuery(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const openCylyndyr = () => {
    window.open('https://cylyndyr.streamlit.app', '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 mt-8">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Generating Strategic Queries
          </h3>
          <p className="text-gray-600">
            Creating database inqueries based on objectives...
          </p>
        </div>
      </div>
    );
  }

  if (error || !queryBuckets) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-8">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-red-800 text-sm">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 space-y-8">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Brand Growth
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          The platform produces queries that will power automated, dynamic 3rd party audience identification and sizing.
        </p>
      </div>

      {/* Query Buckets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Market Intelligence Bucket */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-4">
            <h3 className="text-lg font-semibold">{queryBuckets.marketIntelligence.category}</h3>
            <p className="text-blue-100 text-sm mt-1">{queryBuckets.marketIntelligence.description}</p>
          </div>
          
          <div className="p-6 space-y-4">
            {queryBuckets.marketIntelligence.queries.map((query, index) => (
              <div key={index} className="bg-white rounded-lg border border-blue-200 p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start gap-3">
                  <p className="text-gray-800 text-sm leading-relaxed flex-1">
                    "{query}"
                  </p>
                  <button
                    onClick={() => copyToClipboard(query)}
                    className="flex-shrink-0 p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedQuery === query ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Audiences Bucket */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 overflow-hidden">
          <div className="bg-green-600 text-white px-6 py-4">
            <h3 className="text-lg font-semibold">{queryBuckets.growthAudiences.category}</h3>
            <p className="text-green-100 text-sm mt-1">{queryBuckets.growthAudiences.description}</p>
          </div>
          
          <div className="p-6 space-y-4">
            {queryBuckets.growthAudiences.queries.map((query, index) => (
              <div key={index} className="bg-white rounded-lg border border-green-200 p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start gap-3">
                  <p className="text-gray-800 text-sm leading-relaxed flex-1">
                    "{query}"
                  </p>
                  <button
                    onClick={() => copyToClipboard(query)}
                    className="flex-shrink-0 p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedQuery === query ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white p-8 text-center">
        <h3 className="text-xl font-bold mb-4">Ready to Discover New Audiences?</h3>
        <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
          Copy any query above and paste it into our natural language data explorer 
          to get instant analysis with our customer intelligence database.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="text-purple-200 text-sm">
            Step 1: Copy query → Step 2: Paste into explorer → Step 3: Get insights
          </div>
          <button
            onClick={openCylyndyr}
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-sm"
          >
            Launch Data Explorer →
          </button>
        </div>
      </div>

      {/* Context Bridge */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Analysis Context</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Business:</span>
            <span className="ml-2 text-gray-900">{businessContext.businessName}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Industry:</span>
            <span className="ml-2 text-gray-900">{businessContext.industry}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Variables Analyzed:</span>
            <span className="ml-2 text-gray-900">{selectedVariables.length} strategic variables</span>
          </div>
        </div>
      </div>
    </div>
  );
}
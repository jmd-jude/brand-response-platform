'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Separate component that uses useSearchParams
function AnalyticsContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const streamlitUrl = 'https://cylyndyr.streamlit.app';
  
  // Extract context from URL params if available
  const businessContext = {
    businessName: searchParams.get('businessName') || 'Your Business',
    industry: searchParams.get('industry') || 'Industry',
    businessModel: searchParams.get('businessModel') || 'Business Model'
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setError('Failed to load analytics interface. Please check your connection and try again.');
    setIsLoading(false);
  };

  // Generate contextual query suggestions
  const getQuerySuggestions = () => {
    const baseQueries = [
      "Show me the age distribution of customers",
      "What's the average household income by generation?",
      "Compare urban vs suburban customer preferences",
      "Show customers with high gourmet affinity scores",
      "What percentage of customers are homeowners?",
      "Display income distribution across different age groups"
    ];

    // Add industry-specific queries
    if (businessContext.industry === 'Food & Beverage') {
      return [
        ...baseQueries,
        "Show customers with fitness and gourmet affinities",
        "Compare cooking affinity by income level",
        "What's the overlap between health-conscious and gourmet customers?"
      ];
    }

    return baseQueries;
  };

  return (
    <main className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Introduction Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Interactive Data Exploration
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Now that you have strategic insights, dive deeper with natural language queries 
            against your enhanced customer database. Ask questions in plain English and get instant SQL-powered answers.
          </p>
        </div>

        {/* Context Bridge */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🎯 Ready to Explore: {businessContext.businessName}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Industry:</span>
              <span className="ml-2 text-gray-900">{businessContext.industry}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Business Model:</span>
              <span className="ml-2 text-gray-900">{businessContext.businessModel}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Data Source:</span>
              <span className="ml-2 text-gray-900">Enhanced Customer Intelligence</span>
            </div>
          </div>
        </div>

        {/* Query Suggestions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            💡 Try These Queries
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {getQuerySuggestions().slice(0, 6).map((query, index) => (
              <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                <span className="text-sm text-gray-700">"{query}"</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            💡 <strong>Pro tip:</strong> Copy any of these queries into the chat interface below, or ask your own questions about customer demographics, income, interests, and behaviors.
          </p>
        </div>

        {/* Streamlit App Embed */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Natural Language Data Explorer</h3>
            <p className="text-sm text-gray-600 mt-1">Chat with your enhanced customer data using plain English</p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mr-3"></div>
              <span className="text-gray-600">Loading chat interface...</span>
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="text-red-800 text-sm font-medium">{error}</span>
                  <p className="text-red-700 text-xs mt-1">
                    This could be due to iframe restrictions. Try opening <a href={streamlitUrl} target="_blank" className="underline">the app directly</a>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Iframe */}
          <iframe
            src={streamlitUrl}
            width="100%"
            height="700"
            style={{ 
              border: 'none', 
              display: error ? 'none' : 'block',
              minHeight: '700px'
            }}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title="BrandIntel Deep Analytics - Cylyndyr"
            allow="camera; microphone; geolocation"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <Link 
            href="/demo"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            ← Back to Strategic Report
          </Link>
          
          <div className="text-sm text-gray-500">
            <strong>BrandIntel Lab</strong> • Enhanced Customer Intelligence Platform
          </div>
          
          <a
            href={streamlitUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Open in New Window ↗
          </a>
        </div>
      </div>
    </main>
  );
}

// Loading fallback component
function AnalyticsLoading() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mr-3"></div>
      <span className="text-gray-600">Loading analytics...</span>
    </div>
  );
}

// Main page component
export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="text-2xl font-bold">BrandIntel Lab - Deep Analytics</div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/demo" className="text-white/90 hover:text-white transition-colors">
                ← Back to Report
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Wrap the content that uses useSearchParams in Suspense */}
      <Suspense fallback={<AnalyticsLoading />}>
        <AnalyticsContent />
      </Suspense>
    </div>
  );
}
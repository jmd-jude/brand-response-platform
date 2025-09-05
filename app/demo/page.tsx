'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SampleDataPreview from '../../components/SampleDataPreview';
import BusinessContextForm, { BusinessContext } from '../../components/BusinessContextForm';
import VariableSelection, { Variable } from '../../components/VariableSelection';
import DataPreview from '../../components/DataPreview';
import InsightsGenerator from '../../components/InsightsGenerator';

interface CustomerRecord {
  customer_id?: string;
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  city?: string;
  state?: string;
  [key: string]: any;
}

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState('sample-data');
  const [customerData, setCustomerData] = useState<CustomerRecord[]>([]);
  const [businessContext, setBusinessContext] = useState<BusinessContext | null>(null);
  const [selectedVariables, setSelectedVariables] = useState<Variable[]>([]);
  const [enrichedCustomers, setEnrichedCustomers] = useState<CustomerRecord[]>([]); // Add this state

  const handleDataLoaded = (data: CustomerRecord[]) => {
    setCustomerData(data);
    setCurrentStep('business-context');
  };

  const handleBusinessContextSubmit = (context: BusinessContext) => {
    setBusinessContext(context);
    setCurrentStep('variable-selection');
  };

  const handleVariablesSelected = (variables: Variable[]) => {
    setSelectedVariables(variables);
    setCurrentStep('data-preview');
  };

  // Updated to capture enriched data
  const handleDataPreviewContinue = (enrichedData?: CustomerRecord[]) => {
    if (enrichedData) {
      setEnrichedCustomers(enrichedData);
    }
    setCurrentStep('insights-generation');
  };

  const handleInsightsComplete = () => {
    // Insights completed - stay on current step
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="text-2xl font-bold">BrandIntel Lab</div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-white/90 hover:text-white transition-colors">
                Home
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center space-x-4">
              {/* Step 1 */}
              <div className={`flex items-center ${
                currentStep === 'sample-data' ? 'text-blue-600' : 
                ['business-context', 'variable-selection', 'data-preview', 'insights-generation'].includes(currentStep) ? 'text-green-600' : 
                'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep === 'sample-data' ? 'bg-blue-100 text-blue-600' : 
                  ['business-context', 'variable-selection', 'data-preview', 'insights-generation'].includes(currentStep) ? 'bg-green-100 text-green-600' : 
                  'bg-gray-100 text-gray-400'
                }`}>
                  {['business-context', 'variable-selection', 'data-preview', 'insights-generation'].includes(currentStep) ? '✓' : '1'}
                </div>
                <span className="ml-2 text-sm font-medium">Upload Data</span>
              </div>
              
              <div className="w-12 h-0.5 bg-gray-200"></div>
              
              {/* Step 2 */}
              <div className={`flex items-center ${
                currentStep === 'business-context' ? 'text-blue-600' : 
                ['variable-selection', 'data-preview', 'insights-generation'].includes(currentStep) ? 'text-green-600' : 
                'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep === 'business-context' ? 'bg-blue-100 text-blue-600' :
                  ['variable-selection', 'data-preview', 'insights-generation'].includes(currentStep) ? 'bg-green-100 text-green-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {['variable-selection', 'data-preview', 'insights-generation'].includes(currentStep) ? '✓' : '2'}
                </div>
                <span className="ml-2 text-sm font-medium">Business Context</span>
              </div>
              
              <div className="w-12 h-0.5 bg-gray-200"></div>
              
              {/* Step 3 */}
              <div className={`flex items-center ${
                currentStep === 'variable-selection' ? 'text-blue-600' : 
                ['data-preview', 'insights-generation'].includes(currentStep) ? 'text-green-600' : 
                'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep === 'variable-selection' ? 'bg-blue-100 text-blue-600' :
                  ['data-preview', 'insights-generation'].includes(currentStep) ? 'bg-green-100 text-green-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {['data-preview', 'insights-generation'].includes(currentStep) ? '✓' : '3'}
                </div>
                <span className="ml-2 text-sm font-medium">Variable Selection</span>
              </div>
              
              <div className="w-12 h-0.5 bg-gray-200"></div>
              
              {/* Step 4 */}
              <div className={`flex items-center ${
                currentStep === 'data-preview' ? 'text-blue-600' : 
                currentStep === 'insights-generation' ? 'text-green-600' : 
                'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep === 'data-preview' ? 'bg-blue-100 text-blue-600' :
                  currentStep === 'insights-generation' ? 'bg-green-100 text-green-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {currentStep === 'insights-generation' ? '✓' : '4'}
                </div>
                <span className="ml-2 text-sm font-medium">Data Enhancement</span>
              </div>
              
              <div className="w-12 h-0.5 bg-gray-200"></div>
              
              {/* Step 5 */}
              <div className={`flex items-center ${currentStep === 'insights-generation' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep === 'insights-generation' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  5
                </div>
                <span className="ml-2 text-sm font-medium">Strategic Insights</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-12">
        {currentStep === 'sample-data' && (
          <SampleDataPreview onDataLoaded={handleDataLoaded} />
        )}
        
        {currentStep === 'business-context' && (
          <BusinessContextForm onSubmit={handleBusinessContextSubmit} />
        )}
        
        {currentStep === 'variable-selection' && businessContext && (
          <VariableSelection 
            businessContext={businessContext} 
            onVariablesSelected={handleVariablesSelected} 
          />
        )}
        
        {currentStep === 'data-preview' && (
          <DataPreview 
            customerData={customerData}
            selectedVariables={selectedVariables}
            onContinue={handleDataPreviewContinue}
          />
        )}
        
        {currentStep === 'insights-generation' && businessContext && (
          <InsightsGenerator 
            businessContext={businessContext}
            selectedVariables={selectedVariables}
            enrichedCustomers={enrichedCustomers} // Pass the enriched data
            onComplete={handleInsightsComplete}
          />
        )}
      </main>
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { Variable } from './VariableSelection';

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

interface EnrichedCustomer extends CustomerRecord {
  // Enriched data fields from the API
  age?: number;
  gender?: string;
  income_hh?: string;
  education?: string;
  urbanicity?: string;
  marital_status?: string;
  occupation_type?: string;
  children_hh?: number;
  generation?: string;
  fitness_affinity?: string;
  gourmet_affinity?: string;
  high_tech_affinity?: string;
  travel_affinity?: string;
  cooking_affinity?: string;
  outdoors_affinity?: string;
  reading_magazines?: string;
  household_vehicles?: number;
  property_value?: number;
  homeowner?: string;
  discretionary_income?: string;
  enrichment_source?: string;
}

interface DataPreviewProps {
  customerData: CustomerRecord[];
  selectedVariables: Variable[];
  onContinue: (enrichedData?: CustomerRecord[]) => void;
}

export default function DataPreview({ customerData, selectedVariables, onContinue }: DataPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [enrichedData, setEnrichedData] = useState<EnrichedCustomer[]>([]);
  const [stats, setStats] = useState({ total: 0, enhanced: 0, matchRate: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    enrichCustomerData();
  }, [customerData, selectedVariables]);

  const enrichCustomerData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/enrich-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerData,
          selectedVariables
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to enrich customer data');
      }

      const result = await response.json();
      setEnrichedData(result.enrichedCustomers);
      setStats(result.stats);
      
    } catch (error) {
      console.error('Error enriching data:', error);
      setError('Failed to enhance customer data. Please try again.');
      
      // Fallback to original data if API fails
      setEnrichedData(customerData.slice(0, 8).map(customer => ({
        ...customer,
        enrichment_source: 'error'
      })));
      setStats({ total: customerData.length, enhanced: 0, matchRate: 0 });
    }
    
    setIsLoading(false);
  };

  const getVariableDisplayName = (variable: string) => {
    const displayNames: Record<string, string> = {
      'customer_id': 'ID',
      'id': 'ID',
      'first_name': 'First Name',
      'last_name': 'Last Name', 
      'email': 'Email',
      'city': 'City',
      'state': 'State',
      'age': 'Age',
      'gender': 'Gender',
      'income_hh': 'Income',
      'education': 'Education',
      'urbanicity': 'Location Type',
      'marital_status': 'Marital Status',
      'occupation_type': 'Occupation',
      'children_hh': 'Children',
      'generation': 'Generation',
      'fitness_affinity': 'Fitness Interest',
      'gourmet_affinity': 'Gourmet Interest',
      'high_tech_affinity': 'Tech Interest',
      'travel_affinity': 'Travel Interest',
      'cooking_affinity': 'Cooking Interest',
      'outdoors_affinity': 'Outdoors Interest',
      'reading_magazines': 'Magazine Reader',
      'household_vehicles': 'Vehicles',
      'property_value': 'Property Value',
      'homeowner': 'Homeowner',
      'discretionary_income': 'Discretionary Income'
    };
    return displayNames[variable] || variable.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getEnrichedColumns = () => {
  return selectedVariables.map(v => v.variable);
};

  const formatValue = (value: any, column: string) => {
    if (value === null || value === undefined) return 'N/A';
    
    if (column === 'property_value' && typeof value === 'number') {
      return `$${value.toLocaleString()}`;
    }
    
    return value.toString();
  };

  const getOriginalColumns = () => {
    if (customerData.length === 0) return [];
    
    const firstRecord = customerData[0];
    const priorityFields = ['customer_id', 'id', 'first_name', 'last_name', 'email', 'city', 'state'];
    const availableFields = Object.keys(firstRecord);
    
    return priorityFields.filter(field => availableFields.includes(field));
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Data Enhancement
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Adding data using identity resolution...
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Processing Customer Records
          </h3>
          <p className="text-gray-600 mb-6">
            Enhancing {customerData.length} customer records with BrandIntel data
          </p>
          
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></div>
              Email matching
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse delay-200"></div>
              Adding demographics
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-600 rounded-full mr-2 animate-pulse delay-400"></div>
              Extracting insights
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Enhanced Customer Data
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your customer data has been enhanced with from the enterprise identity graph.
        </p>
      </div>

      {/* Success/Error Banner */}
      {error ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-yellow-800 text-sm">{error}</span>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div className="text-center">
              <span className="text-green-800 font-semibold text-lg">
                Data enhancement completed successfully
              </span>
              <div className="text-green-700 text-sm mt-1">
                {stats.enhanced} of {stats.total} records enhanced • {stats.matchRate}% match rate • Real identity data
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">{stats.total}</div>
          <div className="text-sm font-medium text-gray-600">Records Processed</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{getEnrichedColumns().length}</div>
          <div className="text-sm font-medium text-gray-600">Variables Added</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{stats.matchRate}%</div>
          <div className="text-sm font-medium text-gray-600">Match Rate</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{stats.enhanced}</div>
          <div className="text-sm font-medium text-gray-600">Records Enhanced</div>
        </div>
      </div>

      {/* Before/After Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Original Data */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Original Data</h3>
            <p className="text-sm text-gray-600 mt-1">Basic customer information</p>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {getOriginalColumns().map((col) => (
                <div key={col} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">{getVariableDisplayName(col)}</span>
                  <span className="text-sm text-gray-400">✓ Available</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Data */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
            <h3 className="text-lg font-semibold text-gray-900">Enhanced Data</h3>
            <p className="text-sm text-gray-600 mt-1">Variables added</p>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {getEnrichedColumns().map((col) => (
                <div key={col} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">{getVariableDisplayName(col)}</span>
                  <span className="text-sm text-green-600 font-medium">✓ Enhanced</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Enhanced Customer Records</h3>
          <p className="text-sm text-gray-600 mt-1">BrandIntel data from enterprise identity graph</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* Original columns */}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                {/* Enhanced columns */}
                {getEnrichedColumns().map(col => (
                  <th key={col} className="px-4 py-3 text-left text-xs font-medium text-green-600 uppercase bg-green-50">
                    {getVariableDisplayName(col)}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrichedData.slice(0, 10).map((customer, index) => (
                <tr key={customer.customer_id || customer.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    {customer.customer_id || customer.id || `CUST_${index + 1}`}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {customer.first_name && customer.last_name 
                      ? `${customer.first_name} ${customer.last_name}`
                      : customer.email || 'N/A'
                    }
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {customer.city && customer.state 
                      ? `${customer.city}, ${customer.state}`
                      : customer.city || customer.state || 'N/A'
                    }
                  </td>
                  {getEnrichedColumns().map(col => (
                    <td key={col} className="px-4 py-4 text-sm text-gray-700 bg-green-50">
                      {formatValue((customer as any)[col], col)}
                    </td>
                  ))}
                  <td className="px-4 py-4 text-sm text-gray-500">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      customer.enrichment_source === 'email' ? 'bg-green-100 text-green-800' :
                      customer.enrichment_source === 'pii' ? 'bg-blue-100 text-blue-800' :
                      customer.enrichment_source === 'no_match' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {customer.enrichment_source === 'email' ? 'Email' :
                       customer.enrichment_source === 'pii' ? 'Name+Location' :
                       customer.enrichment_source === 'no_match' ? 'No Match' :
                       'Error'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Continue Button */}
      <div className="text-center">
        <button
          onClick={() => onContinue(enrichedData)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
        >
          Generate Strategic Insights →
        </button>
      </div>
    </div>
  );
}
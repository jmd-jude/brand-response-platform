'use client';

import React, { useState, useEffect } from 'react';
import { Variable } from './VariableSelection';

interface EnrichedCustomer {
  // Original data
  customer_id: string;
  first_name: string;
  last_name: string;
  email: string;
  city: string;
  state: string;
  // Enriched data
  age?: number;
  income_hh?: string;
  education?: string;
  urbanicity?: string;
  marital_status?: string;
  occupation_type?: string;
  children_hh?: number;
  gourmet_affinity?: number;
  fitness_affinity?: number;
  high_tech_affinity?: number;
  reading_magazines?: number;
}

interface DataPreviewProps {
  selectedVariables: Variable[];
  onContinue: () => void;
}

const enrichedSampleData: EnrichedCustomer[] = [
  {
    customer_id: 'CUST_0001',
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.johnson@gmail.com',
    city: 'Seattle',
    state: 'WA',
    age: 34,
    income_hh: 'H. $75,000-$99,999',
    education: 'Completed College',
    urbanicity: '4. Urban',
    marital_status: 'Married',
    occupation_type: 'White Collar',
    children_hh: 1,
    gourmet_affinity: 3,
    fitness_affinity: 2,
    high_tech_affinity: 3,
    reading_magazines: 1
  },
  {
    customer_id: 'CUST_0002',
    first_name: 'Michael',
    last_name: 'Chen',
    email: 'michael.chen@outlook.com',
    city: 'Portland',
    state: 'OR',
    age: 42,
    income_hh: 'K. $100,000-$149,999',
    education: 'Completed Graduate School',
    urbanicity: '3. Suburban',
    marital_status: 'Single',
    occupation_type: 'White Collar',
    children_hh: 0,
    gourmet_affinity: 3,
    fitness_affinity: 3,
    high_tech_affinity: 2,
    reading_magazines: 1
  },
  {
    customer_id: 'CUST_0003',
    first_name: 'Emily',
    last_name: 'Davis',
    email: 'emily.davis@yahoo.com',
    city: 'San Francisco',
    state: 'CA',
    age: 28,
    income_hh: 'G. $60,000-$74,999',
    education: 'Completed College',
    urbanicity: '4. Urban',
    marital_status: 'Single',
    occupation_type: 'White Collar',
    children_hh: 0,
    gourmet_affinity: 2,
    fitness_affinity: 3,
    high_tech_affinity: 3,
    reading_magazines: 0
  },
  {
    customer_id: 'CUST_0004',
    first_name: 'David',
    last_name: 'Williams',
    email: 'david.williams@gmail.com',
    city: 'Denver',
    state: 'CO',
    age: 51,
    income_hh: 'L. $150,000-$174,999',
    education: 'Completed High School',
    urbanicity: '3. Suburban',
    marital_status: 'Married',
    occupation_type: 'Blue Collar',
    children_hh: 2,
    gourmet_affinity: 1,
    fitness_affinity: 1,
    high_tech_affinity: 1,
    reading_magazines: 1
  },
  {
    customer_id: 'CUST_0005',
    first_name: 'Jessica',
    last_name: 'Brown',
    email: 'jessica.brown@hotmail.com',
    city: 'Seattle',
    state: 'WA',
    age: 39,
    income_hh: 'K. $100,000-$149,999',
    education: 'Completed College',
    urbanicity: '4. Urban',
    marital_status: 'Single',
    occupation_type: 'White Collar',
    children_hh: 1,
    gourmet_affinity: 3,
    fitness_affinity: 2,
    high_tech_affinity: 2,
    reading_magazines: 1
  },
  {
    customer_id: 'CUST_0006',
    first_name: 'Robert',
    last_name: 'Miller',
    email: 'robert.miller@gmail.com',
    city: 'Portland',
    state: 'OR',
    age: 45,
    income_hh: 'H. $75,000-$99,999',
    education: 'Some College',
    urbanicity: '3. Suburban',
    marital_status: 'Married',
    occupation_type: 'Blue Collar',
    children_hh: 2,
    gourmet_affinity: 2,
    fitness_affinity: 1,
    high_tech_affinity: 1,
    reading_magazines: 1
  },
  {
    customer_id: 'CUST_0007',
    first_name: 'Amanda',
    last_name: 'Wilson',
    email: 'amanda.wilson@outlook.com',
    city: 'San Francisco',
    state: 'CA',
    age: 33,
    income_hh: 'N. $200,000-$249,999',
    education: 'Completed Graduate School',
    urbanicity: '4. Urban',
    marital_status: 'Single',
    occupation_type: 'White Collar',
    children_hh: 0,
    gourmet_affinity: 3,
    fitness_affinity: 3,
    high_tech_affinity: 3,
    reading_magazines: 1
  },
  {
    customer_id: 'CUST_0008',
    first_name: 'James',
    last_name: 'Taylor',
    email: 'james.taylor@gmail.com',
    city: 'Denver',
    state: 'CO',
    age: 47,
    income_hh: 'K. $100,000-$149,999',
    education: 'Completed College',
    urbanicity: '1. Rural',
    marital_status: 'Married',
    occupation_type: 'White Collar',
    children_hh: 1,
    gourmet_affinity: 2,
    fitness_affinity: 2,
    high_tech_affinity: 2,
    reading_magazines: 0
  }
];

const originalColumns = ['customer_id', 'first_name', 'last_name', 'email', 'city', 'state'];

export default function DataPreview({ selectedVariables, onContinue }: DataPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data enrichment process
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getVariableDisplayName = (variable: string) => {
    const displayNames: Record<string, string> = {
      'customer_id': 'ID',
      'first_name': 'First Name',
      'last_name': 'Last Name', 
      'email': 'Email',
      'city': 'City',
      'state': 'State',
      'age': 'Age',
      'income_hh': 'Income',
      'education': 'Education',
      'urbanicity': 'Location Type',
      'marital_status': 'Marital Status',
      'occupation_type': 'Occupation',
      'children_hh': 'Children',
      'gourmet_affinity': 'Gourmet Interest',
      'fitness_affinity': 'Fitness Interest',
      'high_tech_affinity': 'Tech Interest',
      'reading_magazines': 'Magazine Reader'
    };
    return displayNames[variable] || variable;
  };

  const getEnrichedColumns = () => {
    return selectedVariables.map(v => v.variable.toLowerCase());
  };

  const formatValue = (value: any, column: string) => {
    if (value === null || value === undefined) return 'N/A';
    
    if (column.includes('affinity') || column === 'reading_magazines') {
      if (value === 0) return 'No';
      if (value === 1) return 'Low';
      if (value === 2) return 'Medium';
      if (value === 3) return 'High';
      return value.toString();
    }
    
    return value.toString();
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Data Enrichment
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enhancing customer records with strategic intelligence variables...
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Looking Up Customer Information
          </h3>
          <p className="text-gray-600 mb-6">
            Finding details about your customers and improving {enrichedSampleData.length} customer records
          </p>
          
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></div>
              Identity resolution
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse delay-200"></div>
              Appending {selectedVariables.length} variables
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-600 rounded-full mr-2 animate-pulse delay-400"></div>
              Quality validation
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
          Your customer data has been enriched with strategic intelligence variables from our enterprise identity graph.
        </p>
      </div>

      {/* Success Banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
        <div className="flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div className="text-center">
            <span className="text-green-800 font-semibold text-lg">
              Data enrichment completed successfully
            </span>
            <div className="text-green-700 text-sm mt-1">
              {enrichedSampleData.length} records enhanced • {selectedVariables.length} variables appended • 94% match rate
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">{enrichedSampleData.length}</div>
          <div className="text-sm font-medium text-gray-600">Records Processed</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{selectedVariables.length}</div>
          <div className="text-sm font-medium text-gray-600">Variables Added</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">94%</div>
          <div className="text-sm font-medium text-gray-600">Match Rate</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">2.3s</div>
          <div className="text-sm font-medium text-gray-600">Avg Processing Time</div>
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
              {originalColumns.map((col) => (
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
            <p className="text-sm text-gray-600 mt-1">Strategic intelligence variables added</p>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {getEnrichedColumns().map((col) => (
                <div key={col} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">{getVariableDisplayName(col)}</span>
                  <span className="text-sm text-green-600 font-medium">✓ Enriched</span>
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
          <p className="text-sm text-gray-600 mt-1">Sample of enriched data ready for strategic analysis</p>
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrichedSampleData.map((customer, index) => (
                <tr key={customer.customer_id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{customer.customer_id}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{customer.first_name} {customer.last_name}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">{customer.city}, {customer.state}</td>
                  {getEnrichedColumns().map(col => (
                    <td key={col} className="px-4 py-4 text-sm text-gray-700 bg-green-50">
                      {formatValue((customer as any)[col], col)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Continue Button */}
      <div className="text-center">
        <button
          onClick={onContinue}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
        >
          Generate Strategic Insights →
        </button>
      </div>
    </div>
  );
}
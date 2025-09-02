'use client';

import React, { useState } from 'react';

interface CustomerRecord {
  customer_id: string;
  first_name: string;
  last_name: string;
  email: string;
  city: string;
  state: string;
  age?: number;
  income?: string;
  education?: string;
}

const sampleCustomers: CustomerRecord[] = [
  { customer_id: 'CUST_0001', first_name: 'Sarah', last_name: 'Johnson', email: 'sarah.johnson@gmail.com', city: 'Seattle', state: 'WA', age: 34, income: '$75,000-$99,999', education: 'Completed College' },
  { customer_id: 'CUST_0002', first_name: 'Michael', last_name: 'Chen', email: 'michael.chen@outlook.com', city: 'Portland', state: 'OR', age: 42, income: '$100,000-$149,999', education: 'Completed Graduate School' },
  { customer_id: 'CUST_0003', first_name: 'Emily', last_name: 'Davis', email: 'emily.davis@yahoo.com', city: 'San Francisco', state: 'CA', age: 28, income: '$60,000-$74,999', education: 'Completed College' },
  { customer_id: 'CUST_0004', first_name: 'David', last_name: 'Williams', email: 'david.williams@gmail.com', city: 'Denver', state: 'CO', age: 51, income: '$150,000-$174,999', education: 'Completed High School' },
  { customer_id: 'CUST_0005', first_name: 'Jessica', last_name: 'Brown', email: 'jessica.brown@hotmail.com', city: 'Seattle', state: 'WA', age: 39, income: '$100,000-$149,999', education: 'Completed College' },
  { customer_id: 'CUST_0006', first_name: 'Robert', last_name: 'Miller', email: 'robert.miller@gmail.com', city: 'Portland', state: 'OR', age: 45, income: '$75,000-$99,999', education: 'Some College' },
  { customer_id: 'CUST_0007', first_name: 'Amanda', last_name: 'Wilson', email: 'amanda.wilson@outlook.com', city: 'San Francisco', state: 'CA', age: 33, income: '$200,000-$249,999', education: 'Completed Graduate School' },
  { customer_id: 'CUST_0008', first_name: 'James', last_name: 'Taylor', email: 'james.taylor@gmail.com', city: 'Denver', state: 'CO', age: 47, income: '$100,000-$149,999', education: 'Completed College' },
];

interface SampleDataPreviewProps {
  onDataLoaded: () => void;
}

export default function SampleDataPreview({ onDataLoaded }: SampleDataPreviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showData, setShowData] = useState(false);

  const handleLoadSample = async () => {
    setIsLoading(true);
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setShowData(true);
  };

  const handleProceed = () => {
    onDataLoaded();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Customer Data Analysis
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We&apos;ll analyze your customer data to reveal insights that inform brand strategy. 
          For this demo, we&apos;ll use sample coffee shop customer data.
        </p>
      </div>

      {!showData ? (
        <div className="text-center">
          <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md mx-auto">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Sample Customer Data
              </h3>
              <p className="text-gray-600 text-sm">
                500 customer records from &quot;Roasted Bean Coffee Co.&quot;
              </p>
            </div>

            <button
              onClick={handleLoadSample}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading Sample Data...
                </div>
              ) : (
                'Load Sample Data'
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-800 font-medium">
                Successfully loaded 500 customer records
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Customer Data Preview</h3>
              <p className="text-sm text-gray-600 mt-1">Sample of customer records ready for analysis</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Income</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Education</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sampleCustomers.map((customer) => (
                    <tr key={customer.customer_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {customer.customer_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.first_name} {customer.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.city}, {customer.state}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.age || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.income || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.education || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing 8 of 500 total customer records
              </p>
            </div>
          </div>

          <div className="text-center pt-6">
            <button
              onClick={handleProceed}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Proceed to Business Context →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
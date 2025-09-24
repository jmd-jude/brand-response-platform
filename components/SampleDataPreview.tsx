'use client';

import React, { useState } from 'react';
import Papa, { ParseResult } from 'papaparse';

interface CustomerRecord {
  customer_id?: string;
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  city?: string;
  state?: string;
  [key: string]: any; // Allow additional fields from CSV
}

const fallbackSampleData: CustomerRecord[] = [
  { customer_id: 'CUST_0001', first_name: 'Sarah', last_name: 'Johnson', email: 'sarah.johnson@gmail.com', city: 'Seattle', state: 'WA' },
  { customer_id: 'CUST_0002', first_name: 'Michael', last_name: 'Chen', email: 'michael.chen@outlook.com', city: 'Portland', state: 'OR' },
  { customer_id: 'CUST_0003', first_name: 'Emily', last_name: 'Davis', email: 'emily.davis@yahoo.com', city: 'San Francisco', state: 'CA' },
  { customer_id: 'CUST_0004', first_name: 'David', last_name: 'Williams', email: 'david.williams@gmail.com', city: 'Denver', state: 'CO' },
  { customer_id: 'CUST_0005', first_name: 'Jessica', last_name: 'Brown', email: 'jessica.brown@hotmail.com', city: 'Seattle', state: 'WA' },
  { customer_id: 'CUST_0006', first_name: 'Robert', last_name: 'Miller', email: 'robert.miller@gmail.com', city: 'Portland', state: 'OR' },
  { customer_id: 'CUST_0007', first_name: 'Amanda', last_name: 'Wilson', email: 'amanda.wilson@outlook.com', city: 'San Francisco', state: 'CA' },
  { customer_id: 'CUST_0008', first_name: 'James', last_name: 'Taylor', email: 'james.taylor@gmail.com', city: 'Denver', state: 'CO' },
];

interface SampleDataPreviewProps {
  onDataLoaded: (data: CustomerRecord[]) => void;
}

export default function SampleDataPreview({ onDataLoaded }: SampleDataPreviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showData, setShowData] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerRecord[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'sample' | 'uploaded'>('sample');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setUploadError('Please upload a CSV file');
      return;
    }

    setIsLoading(true);
    setUploadError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (results: ParseResult<any>) => {
        try {
          const data = results.data as CustomerRecord[];
          
          if (data.length === 0) {
            setUploadError('CSV file appears to be empty');
            setIsLoading(false);
            return;
          }

          // Normalize field names - handle common variations
          const normalizedData = data.map((row, index) => {
            const normalized: CustomerRecord = {};
            
            Object.keys(row).forEach(key => {
              const lowerKey = key.toLowerCase().trim();
              const value = row[key];
              
              // Map common field variations
              if (lowerKey.includes('id') && !normalized.customer_id && !normalized.id) {
                normalized.customer_id = value || `CUST_${String(index + 1).padStart(4, '0')}`;
              } else if (lowerKey.includes('first') && lowerKey.includes('name')) {
                normalized.first_name = value;
              } else if (lowerKey.includes('last') && lowerKey.includes('name')) {
                normalized.last_name = value;
              } else if (lowerKey === 'email' || key === 'EMAIL') {
                normalized.email = value;
              } else if (lowerKey.includes('city')) {
                normalized.city = value;
              } else if (lowerKey.includes('state')) {
                normalized.state = value;
              } else {
                // Keep original field names for other data
                normalized[key] = value;
              }
            });

            // Ensure we have a customer ID
            if (!normalized.customer_id && !normalized.id) {
              normalized.customer_id = `CUST_${String(index + 1).padStart(4, '0')}`;
            }

            return normalized;
          });

          console.log(`Loaded ${normalizedData.length} customer records from CSV`);
          setCustomerData(normalizedData);
          setDataSource('uploaded');
          setIsLoading(false);
          setShowData(true);
          
        } catch (error) {
          console.error('Error parsing CSV:', error);
          setUploadError('Error parsing CSV file. Please check the format.');
          setIsLoading(false);
        }
      },
      error: (error) => {
        console.error('Papa Parse error:', error);
        setUploadError('Error reading CSV file');
        setIsLoading(false);
      }
    });
  };

  const handleLoadSample = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setCustomerData(fallbackSampleData);
    setDataSource('sample');
    setIsLoading(false);
    setShowData(true);
  };

  const handleProceed = () => {
    onDataLoaded(customerData);
  };

  const getDisplayData = () => {
    return customerData.slice(0, 8); // Show first 8 records for preview
  };

  const getDisplayColumns = () => {
    if (customerData.length === 0) return [];
    
    const firstRecord = customerData[0];
    const priorityFields = ['customer_id', 'id', 'first_name', 'last_name', 'email', 'city', 'state'];
    const availableFields = Object.keys(firstRecord);
    
    // Show priority fields first, then up to 3 additional fields
    const displayFields = priorityFields.filter(field => availableFields.includes(field));
    const otherFields = availableFields.filter(field => !priorityFields.includes(field)).slice(0, 3);
    
    return [...displayFields, ...otherFields];
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Customer Data Upload
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload customer data CSV file or use our sample data to see how customer intelligence analysis works.
        </p>
      </div>

      {!showData ? (
        <div className="space-y-6">
          {/* Upload Option */}
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-8 text-center hover:border-blue-400 transition-colors">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Upload Customer Data
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                CSV file with customer emails, names, and locations
              </p>
            </div>

            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
              disabled={isLoading}
            />
            <label
              htmlFor="csv-upload"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing CSV...
                </>
              ) : (
                'Choose CSV File'
              )}
            </label>
          </div>

          {uploadError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-800 text-sm">{uploadError}</span>
              </div>
            </div>
          )}

          {/* OR Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or</span>
            </div>
          </div>

          {/* Sample Data Option */}
          <div className="text-center">
            <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md mx-auto">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Try Sample Data
                </h3>
                <p className="text-gray-600 text-sm">
                  {fallbackSampleData.length} sample customer records from "Roasted Bean Coffee Co."
                </p>
              </div>

              <button
                onClick={handleLoadSample}
                disabled={isLoading}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Load Sample Data
              </button>
            </div>
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
                Successfully loaded {customerData.length} customer records {dataSource === 'uploaded' ? 'from CSV file' : 'from sample data'}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Customer Data Preview</h3>
              <p className="text-sm text-gray-600 mt-1">Sample of records ready for enhancement</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {getDisplayColumns().map(column => (
                      <th key={column} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getDisplayData().map((customer, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {getDisplayColumns().map(column => (
                        <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer[column] || 'N/A'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {Math.min(8, customerData.length)} of {customerData.length} total customer records
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6">
            <button
              onClick={() => {
                setShowData(false);
                setCustomerData([]);
                setUploadError(null);
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Upload Different File
            </button>
            
            <button
              onClick={handleProceed}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Continue to Business Context →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
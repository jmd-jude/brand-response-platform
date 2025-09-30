'use client';

import React, { useState } from 'react';

export default function APIEndpointTester() {
  const [email, setEmail] = useState('test@example.com');
  const [sha256Hash, setSha256Hash] = useState('');
  
  const [emailResponse, setEmailResponse] = useState<any>(null);
  const [sha256Response, setSha256Response] = useState<any>(null);
  const [bothResponse, setBothResponse] = useState<any>(null);
  const [loading, setLoading] = useState({ email: false, sha256: false, both: false });
  const [error, setError] = useState<string | null>(null);

  // Generate SHA-256 hash from email
  const generateHash = async () => {
    if (!email) return;
    const encoder = new TextEncoder();
    const data = encoder.encode(email.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    setSha256Hash(hashHex);
  };

  const testEndpoint = async (testType: 'email' | 'sha256' | 'both') => {
    setLoading({ ...loading, [testType]: true });
    setError(null);
    
    try {
      const response = await fetch('/api/test-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, testType }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      
      if (testType === 'email') {
        setEmailResponse(data);
      } else if (testType === 'sha256') {
        setSha256Response(data);
      } else {
        setBothResponse(data);
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading({ ...loading, [testType]: false });
    }
  };

  const copyAsCode = (data: any) => {
    const code = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            API Endpoint Discovery Tool
          </h1>
          <p className="text-gray-600 mb-6">
            Compare byEmail vs bySha256 endpoint responses to determine compatibility
          </p>

          {/* Test Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Email Input */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">📧 Email Address</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="test@example.com"
                />
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => testEndpoint('email')}
                  disabled={loading.email || !email}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading.email ? 'Testing...' : 'Test Email Endpoint'}
                </button>

                <button
                  onClick={() => testEndpoint('both')}
                  disabled={loading.both || !email}
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading.both ? 'Testing...' : 'Test Both & Compare'}
                </button>
              </div>

              {emailResponse && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center text-green-800 text-sm mb-2">
                    ✓ Email endpoint response received
                  </div>
                  <button
                    onClick={() => copyAsCode(emailResponse)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Copy full response
                  </button>
                </div>
              )}
            </div>

            {/* SHA-256 Input */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">#️⃣ SHA-256 Hash</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SHA-256 Hash
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sha256Hash}
                    onChange={(e) => setSha256Hash(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                    placeholder="Generate from email"
                  />
                  <button
                    onClick={generateHash}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <button
                onClick={() => testEndpoint('sha256')}
                disabled={loading.sha256 || !sha256Hash}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading.sha256 ? 'Testing...' : 'Test SHA-256 Endpoint'}
              </button>

              {sha256Response && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center text-green-800 text-sm mb-2">
                    ✓ SHA-256 endpoint response received
                  </div>
                  <button
                    onClick={() => copyAsCode(sha256Response)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Copy full response
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-800 text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Comparison Results */}
          {bothResponse && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">Response Comparison</h3>
                <button
                  onClick={() => copyAsCode(bothResponse)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center text-sm"
                >
                  📋 Copy Results
                </button>
              </div>

              {bothResponse.comparison && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${
                    bothResponse.comparison.recommendation?.status === 'READY_TO_IMPLEMENT' 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <div className="flex items-center mb-2">
                      <span className="font-semibold text-lg">
                        {bothResponse.comparison.recommendation?.status === 'READY_TO_IMPLEMENT' ? '✅' : '⚠️'}
                      </span>
                      <span className="ml-2 font-semibold">
                        {bothResponse.comparison.recommendation?.status || 'Unknown'}
                      </span>
                    </div>
                    <p className="text-sm mb-2">
                      {bothResponse.comparison.recommendation?.message}
                    </p>
                    <p className="text-sm font-medium">
                      Action: {bothResponse.comparison.recommendation?.action}
                    </p>
                  </div>

                  {bothResponse.comparison.dataFieldsAnalysis && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Field Analysis</h4>
                      <div className="text-sm space-y-1">
                        <p>Email endpoint fields: {bothResponse.comparison.dataFieldsAnalysis.emailFieldCount}</p>
                        <p>SHA-256 endpoint fields: {bothResponse.comparison.dataFieldsAnalysis.sha256FieldCount}</p>
                        
                        {bothResponse.comparison.dataFieldsAnalysis.missingInSha256?.length > 0 && (
                          <div className="mt-3 p-3 bg-red-50 rounded">
                            <p className="font-medium text-red-900">Missing in SHA-256:</p>
                            <ul className="list-disc list-inside text-red-800">
                              {bothResponse.comparison.dataFieldsAnalysis.missingInSha256.map((field: string) => (
                                <li key={field}>{field}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {bothResponse.comparison.dataFieldsAnalysis.extraInSha256?.length > 0 && (
                          <div className="mt-3 p-3 bg-blue-50 rounded">
                            <p className="font-medium text-blue-900">Extra in SHA-256:</p>
                            <ul className="list-disc list-inside text-blue-800">
                              {bothResponse.comparison.dataFieldsAnalysis.extraInSha256.map((field: string) => (
                                <li key={field}>{field}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Raw Response Preview */}
                  <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="cursor-pointer font-medium">View Raw Response Data</summary>
                    <pre className="mt-4 text-xs overflow-x-auto bg-white p-4 rounded border">
                      {JSON.stringify(bothResponse, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Implementation Guide */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📋 How to Use</h2>
          <ol className="space-y-3 text-gray-700">
            <li className="flex">
              <span className="font-semibold mr-2">1.</span>
              <span>Enter a real customer email from your data</span>
            </li>
            <li className="flex">
              <span className="font-semibold mr-2">2.</span>
              <span>Click "Test Both & Compare" to test both endpoints simultaneously</span>
            </li>
            <li className="flex">
              <span className="font-semibold mr-2">3.</span>
              <span>Review the comparison results to see if structures match</span>
            </li>
            <li className="flex">
              <span className="font-semibold mr-2">4.</span>
              <span>If status is "READY_TO_IMPLEMENT", you can swap endpoints without code changes</span>
            </li>
            <li className="flex">
              <span className="font-semibold mr-2">5.</span>
              <span>If "NEEDS_ADJUSTMENT", review which fields differ and update your extraction logic</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
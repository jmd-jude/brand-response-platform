'use client';

import React, { useState } from 'react';

export interface BusinessContext {
  businessName: string;
  industry: string;
  businessModel: string;
  targetCustomer: string;
  brandPositioning: string;
  goals: string[];
  additionalContext: string;
}

interface BusinessContextFormProps {
  onSubmit: (context: BusinessContext) => void;
}

const industries = [
  'Food & Beverage',
  'Retail',
  'Professional Services',
  'Healthcare',
  'Technology',
  'Real Estate',
  'Financial Services',
  'Education',
  'Manufacturing',
  'Other'
];

const businessModels = [
  'B2C Retail',
  'B2B Services',
  'Subscription',
  'Marketplace',
  'SaaS',
  'E-commerce',
  'Brick & Mortar',
  'Hybrid',
  'Other'
];

const availableGoals = [
  'Understand customer demographics',
  'Identify market positioning opportunities',
  'Optimize marketing messaging',
  'Competitive differentiation',
  'Target audience refinement',
  'Brand strategy validation'
];

export default function BusinessContextForm({ onSubmit }: BusinessContextFormProps) {
  const [formData, setFormData] = useState<BusinessContext>({
    businessName: 'Roasted Bean Coffee Co.',
    industry: 'Food & Beverage',
    businessModel: 'B2C Retail',
    targetCustomer: 'Young professionals, ages 25-40, urban, tech-savvy, values convenience and quality coffee for their busy lifestyle.',
    brandPositioning: 'Hip, modern coffee shop for busy professionals who want premium quality without the wait.',
    goals: ['Understand customer demographics', 'Optimize marketing messaging'],
    additionalContext: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGoalChange = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Business Context
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Tell us about your business so we can select the most strategically relevant data variables for analysis.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Business Name */}
          <div>
            <label htmlFor="businessName" className="block text-sm font-semibold text-gray-900 mb-2">
              Business Name
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g., Roasted Bean Coffee Co."
              required
            />
          </div>

          {/* Industry */}
          <div>
            <label htmlFor="industry" className="block text-sm font-semibold text-gray-900 mb-2">
              Industry
            </label>
            <select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            >
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          {/* Business Model */}
          <div className="md:col-span-1">
            <label htmlFor="businessModel" className="block text-sm font-semibold text-gray-900 mb-2">
              Business Model
            </label>
            <select
              id="businessModel"
              name="businessModel"
              value={formData.businessModel}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            >
              {businessModels.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Target Customer */}
        <div className="mb-6">
          <label htmlFor="targetCustomer" className="block text-sm font-semibold text-gray-900 mb-2">
            Who do you think your customers are?
          </label>
          <textarea
            id="targetCustomer"
            name="targetCustomer"
            value={formData.targetCustomer}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="e.g., Young professionals, ages 25-40, urban, tech-savvy, values convenience..."
            required
          />
        </div>

        {/* Brand Positioning */}
        <div className="mb-6">
          <label htmlFor="brandPositioning" className="block text-sm font-semibold text-gray-900 mb-2">
            How do you currently position your brand?
          </label>
          <textarea
            id="brandPositioning"
            name="brandPositioning"
            value={formData.brandPositioning}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="e.g., Premium artisanal coffee for discerning professionals..."
            required
          />
        </div>

        {/* Goals */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            What are your main goals for this analysis?
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableGoals.map(goal => (
              <label key={goal} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.goals.includes(goal)}
                  onChange={() => handleGoalChange(goal)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm text-gray-700">{goal}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Context */}
        <div className="mb-8">
          <label htmlFor="additionalContext" className="block text-sm font-semibold text-gray-900 mb-2">
            Additional Context <span className="text-gray-500 font-normal">(Optional)</span>
          </label>
          <textarea
            id="additionalContext"
            name="additionalContext"
            value={formData.additionalContext}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Any other relevant information about your business, customers, or market..."
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting || formData.goals.length === 0}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing Context...
              </div>
            ) : (
              'Continue to Variable Selection →'
            )}
          </button>
          
          {formData.goals.length === 0 && (
            <p className="text-sm text-red-500 mt-2">Please select at least one goal</p>
          )}
        </div>
      </form>
    </div>
  );
}
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="text-2xl font-bold">BrandIntel™ Lab</div>
            <nav className="hidden md:flex space-x-8">
              <a href="#how-it-works" className="text-white/90 hover:text-white transition-colors">
                How It Works
              </a>
              <a href="#results" className="text-white/90 hover:text-white transition-colors">
                Case Studies
              </a>
              <Link href="/demo" className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
                See Demo
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Customer Intelligence for
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Innovative Agencies</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Lead every brand engagement with data-driven insights. 
              Transform client assumptions into empirical strategic creative advantage.
            </p>
            
            <div className="flex justify-center mb-12">
              <Link 
                href="/demo"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                See Agency Demo →
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                10-minute client insights
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Strategic differentiation
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                White-label ready
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Elevate the Discovery Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              When clients describe their current customers, do you rely on their assumptions or on real data?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-semibold text-red-800 mb-3">❌ Current Reality</h3>
                <ul className="space-y-2 text-red-700">
                  <li>• "Who do you think your customers are?"</li>
                  <li>• Relying on client assumptions and guesswork</li>
                  <li>• Creative decisions without customer data</li>
                  <li>• Competing on price, not strategic insight</li>
                  <li>• Reactive relationship: client drives, agency executes</li>
                </ul>
              </div>
            </div>

            <div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-3">✅ With BrandIntel™</h3>
                <ul className="space-y-2 text-green-700">
                  <li>• "Here's who your customers actually are..."</li>
                  <li>• Lead strategy sessions with real demographic data</li>
                  <li>• Justify creative decisions with customer insights</li>
                  <li>• Differentiate on strategic intelligence</li>
                  <li>• Proactive partnership: agency leads with data</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Agency Benefits
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional-grade customer intelligence without the research budget or timeline.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">90%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Cost Reduction</div>
              <div className="text-gray-600 text-sm">vs. $25K traditional market research</div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">Rapid</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Turnaround</div>
              <div className="text-gray-600 text-sm">vs. expensive 6-week research projects</div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">$ Increased $</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Project Value</div>
              <div className="text-gray-600 text-sm">New, incremental revenue stream</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Transform Your Agency Positioning</h3>
            <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
              "Every creative decision we make is backed by actual customer insights" becomes your competitive advantage.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Improve the Client Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Integrate customer intelligence into every brand engagement.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Discovery Session</h3>
              <p className="text-gray-600">
                Lead client discovery with business context questions. Upload their customer data (emails, CRM exports) directly into BrandIntel™ Lab.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Intelligence Enhancement</h3>
              <p className="text-gray-600">
                Our AI selects strategic variables and enhances customer records with real demographic, income, lifestyle, and behavioral data.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Strategic Presentation</h3>
              <p className="text-gray-600">
                Lead client meetings with "Here's who your customers actually are" insights. Use white-labeled reports to drive brand strategy discussions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section id="results" className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Case Study: Creative Agency Success
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              How customer intelligence transformed client relationships and project outcomes
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Client: Regional Coffee Brand</h3>
                <h4 className="text-lg font-semibold mb-3 text-yellow-300">Client Assumptions vs. Data Reality</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Target Age: "Young millennials"</span>
                    <span className="text-yellow-300 font-semibold">Reality: 68% age 30-55</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Income: "Mid-market"</span>
                    <span className="text-yellow-300 font-semibold">Reality: 58% earn $100K+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Location: "Urban focus"</span>
                    <span className="text-yellow-300 font-semibold">Reality: 45% suburban</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Priority: "Convenience"</span>
                    <span className="text-yellow-300 font-semibold">Reality: 73% quality-focused</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-4 text-yellow-300">Agency Results</h4>
                <ul className="space-y-3 text-blue-100">
                  <li>• <strong>Led strategy session</strong> with customer reality data</li>
                  <li>• <strong>Repositioned brand</strong> to premium quality messaging</li>
                  <li>• <strong>Increased project scope</strong> from $15K to $35K</li>
                  <li>• <strong>Client satisfaction</strong> - renewed for brand expansion</li>
                  <li>• <strong>Referral source</strong> - 3 new clients from case study</li>
                </ul>
                
                <div className="mt-6 p-4 bg-white/20 rounded-lg">
                  <p className="text-sm italic">
                    "Instead of guessing about our customers, [Agency] showed us exactly who they are. 
                    The data insights completely changed our brand strategy." - Client CMO
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Lead with Customer Intelligence?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Transform your discovery process. See how customer intelligence 
            elevates every client engagement.
          </p>
          <Link 
            href="/demo"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-block"
          >
            See Agency Demo →
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            Test with real client data • 5-minute setup • White-label ready
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4">BrandIntel™ Lab</div>
            <p className="text-gray-400 mb-6">Customer Intelligence for Innovative Agencies</p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <span>Professional-grade insights</span>
              <span>•</span>
              <span>Rapid turnaround</span>
              <span>•</span>
              <span>Strategic differentiation</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
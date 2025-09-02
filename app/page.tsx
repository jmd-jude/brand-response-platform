import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="text-2xl font-bold">Brand Response</div>
            <nav className="hidden md:flex space-x-8">
              <a href="#how-it-works" className="text-white/90 hover:text-white transition-colors">
                How It Works
              </a>
              <a href="#results" className="text-white/90 hover:text-white transition-colors">
                Results
              </a>
              <Link href="/demo" className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
                Try Demo
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
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Smart Brands</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform assumptions into insights. Turn demographic data into strategic brand decisions. 
              Get enterprise-level customer intelligence at small business scale.
            </p>
            
            <div className="flex justify-center mb-12">
              <Link 
                href="/demo"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                See Prototype →
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Enterprise insights
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                SMB pricing
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                5-minute setup
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
              Stop Guessing. Start Growing.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Many strategic branding decisions are based on assumptions. We fix that.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-semibold text-red-800 mb-3">❌ The Problem</h3>
                <ul className="space-y-2 text-red-700">
                  <li>• &quot;We think our customers are millennials&quot;</li>
                  <li>• &quot;They probably prefer convenience over quality&quot;</li>
                  <li>• &quot;Our target audience is urban professionals&quot;</li>
                  <li>• Brand strategies built on assumptions</li>
                </ul>
              </div>
            </div>

            <div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-3">✅ The Reality</h3>
                <ul className="space-y-2 text-green-700">
                  <li>• &quot;Your customers are 42% more affluent Gen X&quot;</li>
                  <li>• &quot;73% prioritize quality over convenience&quot;</li>
                  <li>• &quot;45% live in suburban areas&quot;</li>
                  <li>• Strategic decisions backed by customer data</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload customer data, get strategic insights in minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Upload Customer Data</h3>
              <p className="text-gray-600">
                Import your CRM data, email lists, or customer database. Names, emails, addresses - your existing customer information.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Enterprise-grade Analytics</h3>
              <p className="text-gray-600">
                Our smart analytics system identifies strategically relevant variables and enhances records with demographic, lifestyle, and behavioral data points.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Strategic Recommendations</h3>
              <p className="text-gray-600">
                We produce professional, easy-to-read brand intelligence reports comparing assumptions to reality with actionable positioning strategies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Real Results from Real Data
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              See how customer intelligence transforms brand strategy
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Roasted Bean Coffee Co.</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Customer Age (Reality vs Assumption)</span>
                    <span className="text-yellow-300 font-semibold">+15 years older</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Income Level</span>
                    <span className="text-yellow-300 font-semibold">+42% more affluent</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Quality vs Convenience Priority</span>
                    <span className="text-yellow-300 font-semibold">73% quality-focused</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-4 text-yellow-300">Strategic Impact</h4>
                <ul className="space-y-2 text-blue-100">
                  <li>• Repositioned to premium quality messaging</li>
                  <li>• Increased average transaction value 31%</li>
                  <li>• Better brand-customer alignment</li>
                  <li>• Enhanced customer retention</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Brand Strategy?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Stop making brand decisions based on assumptions. Get customer intelligence that drives real results.
          </p>
          <Link 
            href="/demo"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-block"
          >
            Try the Live Demo →
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            No signup required • Real customer intelligence in minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4">Brand Response</div>
            <p className="text-gray-400 mb-6">Customer Intelligence for Smart Brands</p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <span>Enterprise insights at SMB scale</span>
              <span>•</span>
              <span>5-minute setup</span>
              <span>•</span>
              <span>Actionable recommendations</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Visitor Management System
            </h1>
            <p className="text-xl text-gray-600">
              Digital platform for managing visitor registrations and check-ins
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Login */}
            <Link
              href="/auth/login"
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-2xl mb-2">🔐</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Login</h2>
              <p className="text-gray-600">Sign in to your account</p>
            </Link>

            {/* Security Dashboard */}
            <Link
              href="/dashboard/security"
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-2xl mb-2">👮</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Security</h2>
              <p className="text-gray-600">Register & manage visitor check-ins</p>
            </Link>

            {/* Admin Dashboard */}
            <Link
              href="/dashboard/admin"
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-2xl mb-2">📊</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Admin</h2>
              <p className="text-gray-600">View reports & analytics</p>
            </Link>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                Visitor Registration & Auto-Fill
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                QR Code Generation & Scanning
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                Check-In & Check-Out Management
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                Reports & Analytics
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                Offline Support (PWA)
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                Role-Based Access Control
              </li>
            </ul>
          </div>

          {/* Documentation Links */}
          <div className="text-center text-gray-600">
            <p className="mb-4">Need help? Check the documentation</p>
            <Link
              href="/docs"
              className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full bg-linear-to-r from-blue-600 to-blue-700 shadow-lg">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="text-white text-xl font-bold">LMS Platform</div>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-white hover:text-blue-100 transition-colors font-medium">Home</Link>
          <Link href="/signin" className="text-white hover:text-blue-100 transition-colors font-medium">Sign In</Link>
          <button className="bg-white text-blue-600 px-5 py-2 rounded-lg hover:bg-blue-50 transition-all font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5">Get Started</button>
        </div>
      </div>
    </nav>
  );
}
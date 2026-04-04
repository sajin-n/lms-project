import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to LMS Project</h1>
        <p className="text-gray-600 mb-6">Your Learning Management System</p>
        <div className="space-x-4 space-y-3">
          <Link href="/signin" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Sign In</Link>
          <Link href="/signup" className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

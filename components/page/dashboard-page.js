import MainLayout from "../layout/main-layout";
import Card from "../global/card";

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome back! Here&#39;s your learning overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-blue-600">Course Progress</h2>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">Track your learning journey</p>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">React Fundamentals</span>
              <span className="font-semibold text-blue-600">75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-linear-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-300" style={{width: '75%'}}></div>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-green-600">Upcoming Lessons</h2>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">Next sessions scheduled</p>
          <ul className="space-y-3">
            <li className="flex items-start p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-1.5 shrink-0"></span>
              <span className="text-sm text-gray-700">Advanced JavaScript - Today 3:00 PM</span>
            </li>
            <li className="flex items-start p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3 mt-1.5 shrink-0"></span>
              <span className="text-sm text-gray-700">Node.js Basics - Tomorrow 10:00 AM</span>
            </li>
          </ul>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-purple-600">Assignments</h2>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">Pending submissions</p>
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-2">
              <div className="text-4xl font-bold text-purple-600">3</div>
            </div>
            <div className="text-sm text-gray-500">Due this week</div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
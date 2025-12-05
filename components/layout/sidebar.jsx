export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 min-h-screen">
      <div className="mb-8">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Navigation</h2>
      </div>
      <ul className="space-y-1">
        <li>
          <a href="#" className="flex items-center px-4 py-3 rounded-lg bg-blue-50 text-blue-600 font-medium transition-all">
            <span>📊 Dashboard</span>
          </a>
        </li>
        <li>
          <a href="#" className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-all">
            <span>📚 Courses</span>
          </a>
        </li>
        <li>
          <a href="#" className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-all">
            <span>👤 Profile</span>
          </a>
        </li>
        <li>
          <a href="#" className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-all">
            <span>⚙️ Settings</span>
          </a>
        </li>
      </ul>
    </aside>
  );
}
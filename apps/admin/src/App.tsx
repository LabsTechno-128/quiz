import { Outlet, Link } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Placeholder */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-indigo-600 mb-4">Quiz Admin</h2>
        <nav className="flex flex-col gap-2">
          <Link to="/" className="p-2 hover:bg-gray-50 rounded text-gray-700">Dashboard</Link>
          <Link to="/manage-quizzes" className="p-2 hover:bg-gray-50 rounded text-gray-700">Manage Quizzes</Link>
          <Link to="/analytics" className="p-2 hover:bg-gray-50 rounded text-gray-700">Analytics</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default App

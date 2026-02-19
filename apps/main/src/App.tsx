import { Outlet } from 'react-router-dom'
import Navbar from './components/layout/Nav'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <h1>My dear 3 friend you r greate</h1>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}

export default App

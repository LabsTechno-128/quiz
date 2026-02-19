import { Outlet } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Placeholder */}
      <h1>my quizz i s my pran welcom to bro you r greate </h1>
      sdfdsfdsa sad fsad fsadf asdf asf
      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default App

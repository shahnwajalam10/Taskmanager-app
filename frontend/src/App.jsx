"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-black mb-2">404</h1>
        <h2 className="text-2xl font-medium text-black mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">The page you're looking for doesn't exist.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Go Back
          </button>
          <a href="/dashboard" className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-4 px-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-black">Taskmanager App</span>
          <div className="text-sm text-gray-600">© {new Date().getFullYear()} Taskmanager App</div>
        </div>
      </div>
    </footer>
  )
}

export default App

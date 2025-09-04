import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import RequestServices from './pages/RequestServices'
import CustomerDashboard from './pages/CustomerDashboard'
import WorkerDashboard from './pages/WorkerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import AuthProvider from './Providers/AuthProvider'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/request-services" element={<RequestServices />} />
              <Route path="/customer-dashboard" element={<CustomerDashboard />} />
              <Route path="/worker-dashboard" element={<WorkerDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

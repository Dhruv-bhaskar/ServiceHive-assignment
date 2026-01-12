import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loadUser } from './store/slices/authSlice'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CreateGig from './pages/CreateGig'
import GigDetails from './pages/GigDetails'
import MyGigs from './pages/MyGigs'
import MyBids from './pages/MyBids'
import Notifications from './components/Notifications'

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, loading } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Notifications />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />} 
        />
        <Route 
          path="/register" 
          element={!isAuthenticated ? <Register /> : <Navigate to="/" />} 
        />
        <Route 
          path="/create-gig" 
          element={isAuthenticated ? <CreateGig /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/gig/:id" 
          element={<GigDetails />} 
        />
        <Route 
          path="/my-gigs" 
          element={isAuthenticated ? <MyGigs /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/my-bids" 
          element={isAuthenticated ? <MyBids /> : <Navigate to="/login" />} 
        />
      </Routes>
    </div>
  )
}

export default App
import React from 'react'
import { useAuth } from './context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  const { loading, isAuthenticated } = useAuth()

  if (loading)
    return (
      <div className='flex justify-center items-center h-screen'>
        Loading...
      </div>
    )
  if (!loading && !isAuthenticated) return <Navigate to='/signin' replace />

  return <Outlet />
}

export default ProtectedRoute

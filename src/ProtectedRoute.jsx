import { Suspense } from 'react'
import { useAuth } from './context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  const { loading, isAuthenticated } = useAuth()

  if (!loading && !isAuthenticated) return <Navigate to='/signin' replace />

  return (
    <Suspense
      fallback={
        <div className='fixed inset-0 flex items-center justify-center'>
          <div className='animate-pulse flex space-x-4'>
            <div className='rounded-full bg-blue-400 h-12 w-12'></div>
          </div>
        </div>
      }
    >
      <Outlet />
    </Suspense>
  )
}

export default ProtectedRoute

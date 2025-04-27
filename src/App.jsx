import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AuthContainer from './pages/Auth'
import NotFound from './pages/NotFound'
import SignInForm from './components/auth/SignInForm'
import SignUpForm from './components/auth/SignUpForm'
import DashboardDoctor from './pages/DashboardDoctor'
import DashboardPatient from './pages/DashboardPatient'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './ProtectedRoute'
import { PatientProvider } from './context/PatientsCotext'

const App = () => {
  return (
    <PatientProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path='/' element={<AuthContainer />}>
              <Route index path='signin' element={<SignInForm />} />
              <Route path='signup' element={<SignUpForm />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path='dashboard-doctor' element={<DashboardDoctor />} />
              <Route path='dashboard-patient' element={<DashboardPatient />} />
            </Route>
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </PatientProvider>
  )
}

export default App

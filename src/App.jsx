import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AuthContainer from './pages/Auth'
import NotFound from './pages/NotFound'
import SignInForm from './components/auth/SignInForm'
import SignUpForm from './components/auth/SignUpForm'
import ForgotPasswordForm from './components/auth/ForgotPasswordForm'
import ResetPasswordForm from './components/auth/ResetPasswordForm'
import DashboardDoctor from './pages/DashboardDoctor'
import DashboardPatient from './pages/DashboardPatient'
import ConsultationsPage from './pages/ConsultationsPage'
import PatientConsultationsList from './pages/PatientConsultationsList'
import PatientProfile from './pages/PatientProfile'
import ConsultationDetail from './pages/ConsultationDetail'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './ProtectedRoute'
import { PatientProvider } from './context/PatientsContext'
import Header from './components/ui/Header'
import Footer from './components/ui/Footer'

const App = () => {
  return (
    <PatientProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Routes>
              <Route path='/' element={<AuthContainer />}>
                <Route index path='signin' element={<SignInForm />} />
                <Route path='signup' element={<SignUpForm />} />
                <Route path='forgot-password' element={<ForgotPasswordForm />} />
                <Route path='reset-password' element={<ResetPasswordForm />} />
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route
                  path='dashboard-doctor'
                  element={
                    <>
                      <Header />
                      <div className="flex-1">
                        <DashboardDoctor />
                      </div>
                      <Footer />
                    </>
                  }
                />
                <Route
                  path='dashboard-doctor/patients/:id'
                  element={
                    <>
                      <PatientProfile />
                      <Footer />
                    </>
                  }
                />
                <Route
                  path='dashboard-doctor/patients/:id/consultations'
                  element={
                    <>
                      <ConsultationsPage />
                      <Footer />
                    </>
                  }
                />
                <Route
                  path='dashboard-doctor/patients/:id/consultation/:consultationId'
                  element={
                    <>
                      <ConsultationDetail />
                      <Footer />
                    </>
                  }
                />
              </Route>
              <Route path='*' element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </PatientProvider>
  )
}

export default App

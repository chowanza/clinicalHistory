import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AuthContainer from './pages/Auth'
import NotFound from './pages/NotFound'
import SignInForm from './components/auth/SignInForm'
import SignUpForm from './components/auth/SignUpForm'
import DashboardDoctor from './pages/DashboardDoctor'
import DashboardPatient from './pages/DashboardPatient'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<AuthContainer />}>
          <Route index path='signup' element={<SignUpForm />} />
          <Route path='signin' element={<SignInForm />} />
        </Route>
        <Route path='dashboard-doctor' element={<DashboardDoctor />} />
        <Route path='dashboard-patient' element={<DashboardPatient />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App

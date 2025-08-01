import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer } from 'react-toastify'
import NotFound from './pages/NotFound'
// import NewPassword from './pages/NewPassword'

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home/>}/> {/* now whenever we hit the / we will be in home page */}
        <Route path='/login' element={<Login />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        {/* <Route path='/reset-password/new-password' element={<NewPassword />}/> */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
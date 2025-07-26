import express from 'express'
import { login, register, logout, sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOtp, resetPassword } from '../controllers/authController.js'
import userAuth from '../middleware/userAuth.js'

const authRouter = express.Router()

// when we hit /register endpoint, we will execute the register function
authRouter.post('/register', register)

// when we hit /login endpoint, we will execute the login function
authRouter.post('/login', login)

// when we hit /logout endpoint, we will execute the logout function
authRouter.post('/logout', logout)

// when we hit /send-verify-otp endpoint, we will execute the userAuth function that executes sendVerifyOtp() inside it 
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp)

// when we hit /verify-account endpoint, we will execute the userAuth function that executes verifyEmail() inside it
authRouter.post('/verify-account', userAuth, verifyEmail)

// check whether the user is authenticated or no
authRouter.get('/is-auth', userAuth, isAuthenticated)

// we send the reset otp to reset password
authRouter.post('/send-reset-otp', sendResetOtp)

// we enter the generated otp so we can actually reset the password
authRouter.post('/reset-password', resetPassword)


export default authRouter
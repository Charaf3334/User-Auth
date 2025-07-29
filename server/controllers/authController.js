import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'
import transporter from '../config/nodemailer.js'
import mailData from '../config/mailRelated.js'
import passwordParse from '../config/passwordParse.js'

// handle sign up
export const register = async(req, res) => {

    const {name, email, password} = req.body

    if (!name || !email || !password)
        return res.json({success: false, message: 'Missing Details'})

    try {

        const existingUser = await userModel.findOne({email})
        if (existingUser)
            return res.json({success: false, message: 'Email already exists, try a different one'})

        const domain = email.split('@')[1]

        if (!mailData.mailDomains.includes(domain))
            return res.json({success: false, message: 'We cannot verify the domain of the email you entered'})

        if (!passwordParse(password))
            return res.json({success: false, message: 'Password can only contain letters, numbers, and underscores (_)'})

        if (password.toString().length < 8)
            return res.json({success: false, message: 'Password must be at least 8 characters long'})
        
        const hashedPassword = await bcrypt.hash(password, 10) // 10 is the default to use, since it is secure and not too slow

        const date = new Date()
        const currentDate = date.getFullYear() + '/' + String(date.getMonth() + 1).padStart(2, '0') + '/' + String(date.getDate()).padStart(2, '0') + ' ' + String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0') + ':' + String(date.getSeconds()).padStart(2, '0')

        const user = new userModel({name, email, password: hashedPassword, createdAt: currentDate})

        await user.save() // save user in db

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'}) // this creates a JWT, will expire in 7 days

        // this sends the token to the browser in an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milleseconds
        })

        // sending a welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to the website!',
            text: `Welcome to our website ${name}! Your account has been created with email id: ${email}\nThe quote for today is: ${mailData.getRandomQuote()}`,
        }
        await transporter.sendMail(mailOptions)

        return res.json({success: true}) // sign in successfuly
    } 
    catch (error) {
        res.json({success: false, message: error.message})
    }
}

// handle login
export const login = async (req, res) => {
    
    const {email, password} = req.body

    if (!email || !password)
        return res.json({success: false, message: 'Email and password are required'})
    
    try {
        
        const user = await userModel.findOne({email})

        // later to modify the behavior of messages: invalid email or password
        if (!user)
            return res.json({success: false, message: 'Invalid email or password'})

        const isMatch = await bcrypt.compare(password, user.password) // compare the two passwords

        if (!isMatch)
            return res.json({success: false, message: 'Invalid email or password'})

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'}) // this creates a JWT, will expire in 7 days

        // this sends the token to the browser in an HTTP-only cookie
        res.cookie('token', token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milleseconds
        })

        return res.json({success: true}) // login succesfully

    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

// handle logout
export const logout = async (req, res) => {
    try {
        
        res.clearCookie('token', { // to logout we just clear the token by clearing the cookie
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.json({success: true, message: 'Logged Out'})

    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}


// handle sending verification OTP to the user's email
export const sendVerifyOtp = async (req, res) => {

    try {
        
        const { userId } = req.body

        const user = await userModel.findById(userId)

        if (user.isAccountVerified)
            return res.json({success: false, message: 'Account already verified'})

        const otp = String(Math.floor(100000 + Math.random() * 900000)) // line that generate a 6 digit random number

        user.verifyOtp = otp
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000 // date.now() returns the current time in ms, then we add to it 24h converted to ms

        await user.save()

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Your OTP is ${otp}, Verify your account using this OTP.`
        }

        await transporter.sendMail(mailOptions)

        return res.json({success: true, message: 'Verification OTP sent on email'})

    } catch (error) {
        return res.json({success: false, message: error.message})
    }

}

// handle verifying email using OTP
export const verifyEmail = async (req, res) => {
    
    const {userId, otp} = req.body

    if (!userId || !otp)
        return res.json({success: false, message: 'Missing details'})

    try {
        
        const user = await userModel.findById(userId)

        if (!user)
            return res.json({success: false, message: 'User not found'})

        if (user.verifyOtp === '' || user.verifyOtp !== otp)
            return res.json({success: false, message: 'Invalid OTP'})

        if (user.verifyOtpExpireAt < Date.now())
            return res.json({success: false, message: 'OTP Expired'})

        user.isAccountVerified = true
        user.verifyOtp = ''
        user.verifyOtpExpireAt = 0

        await user.save()

        return res.json({success: true, message: 'Email verified successfully'})

    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}


// check if user is authenticated
export const isAuthenticated = async (req, res) => {

    try {
        return res.json({success: true})
    } catch (error) {
        return res.json({success: false, message: error.message})
    }

}


// send password reset OTP
export const sendResetOtp = async (req, res) => {

    const {email} = req.body

    if (!email)
        return res.json({success: false, message: 'Email is required'})

    try {
        
        const user = await userModel.findOne({email})
        
        if (!user)
           return res.json({success: false, message: 'No account is associated with this email address'})

        const otp = String(Math.floor(100000 + Math.random() * 900000)) // line that generate a 6 digit random number

        user.resetOtp = otp
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000 // date.now() returns the current time in ms, then we add to it 15min converted to ms

        await user.save()

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.`
        }

        await transporter.sendMail(mailOptions)

        return res.json({success: true, message: 'OTP sent to your email'})


    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}


// reset user password
export const resetPassword = async (req, res) => {
    
    const {email, otp, newPassword} = req.body

    if (!email || !otp || !newPassword)
        return res.json({success: false, message: 'Email, OTP and new password are required'})

    try {

        const user = await userModel.findOne({email})

        if (!user)
            return res.json({success: false, message: 'User not found'})

        if (user.resetOtp === '' || user.resetOtp !== otp)
            return res.json({success: false, message: 'Invalid OTP'})

        if (user.resetOtpExpireAt < Date.now())
            return res.json({success: false, message: 'OTP expired'})

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword
        user.resetOtp = ''
        user.resetOtpExpireAt = 0

        await user.save()

        return res.json({success: true, message: 'Password has been reset successfully'})
        
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

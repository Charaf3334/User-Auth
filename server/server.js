import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import connectDB from './config/mongodb.js'
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'

const app = express()
const port = 4000
connectDB()

const allowedOrigins = ['http://localhost:5173']

app.use(express.json())
app.use(cookieParser())
app.use(cors({origin: allowedOrigins, credentials: true})) // here we are allowing the frontend to use our backend server

// API Endpoints
app.get('/', (req, res) => res.send('API Working'))
app.use('/api/auth', authRouter) // all the routes inside authRouter will be prefixed with /api/auth
app.use('/api/user', userRouter)

app.listen(port, () => console.log(`Server started on PORT: ${port}`))
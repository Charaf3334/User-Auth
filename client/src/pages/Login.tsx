import { useContext, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {

  const navigate = useNavigate()
  const context = useContext(AppContext)
  if (!context)
    throw new Error('AppContext is not provided')

  const {backendUrl, setIsLoggedin, getUserData} = context

  {/* this have to be Login ig .. */}
  const [state, setState] = useState('Login') 

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [test, setTest] = useState(false)

  const onSubmitHandler = async (e: any) => {
    try {
      
      setTest(true)
      
      setTimeout(() => {
        setTest(false)
      }, 2000)

      {/* this will prevent the browser from reloading the web page */}
      e.preventDefault()

      {/* this will send cookies with the request to the API */}
      axios.defaults.withCredentials = true

      if (!validateEmail(email)) {
        
        toast.error('Invalid email format!')
        return
      }

      if (state === 'Sign up') {

        const {data} = await axios.post(backendUrl + '/api/auth/register', {name, email, password})
        // setName('') // not working hh
        // setEmail('')
        // setPassword('')
        if (data.success) {
          setIsLoggedin(true)
          getUserData()
          toast.success("Your account has been created!")
          navigate('/')
        }
        else {
          toast.error(data.message)
        }
      }
      else {
        
        const {data} = await axios.post(backendUrl + '/api/auth/login', {email, password})

        if (data.success) {
          setIsLoggedin(true)
          getUserData()
          toast.success("You logged in successfully!")
          navigate('/')
        }
        else {
          toast.error(data.message)
        }
      }
    } catch (error: any) {
      // setTest(false);
      const errorMessage = error.response?.data?.message || error.message || 'Something went wrong'
      toast.error(errorMessage)
    }
  }

  const validateEmail = (email: string) => {
    
    if (!email)
      return true

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-indigo-100 via-sky-100 to-blue-200'>
      <img onClick={() => navigate('/')} src={assets.logo} alt='' className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />

      <div className='bg-white p-10 rounded-2xl shadow-2xl w-full sm:w-96 text-gray-700'>
        <h2 className='text-3xl font-bold mb-1 text-blue-900 text-center'>
          {state === 'Sign up' ? 'Create Account' : 'Welcome Back!'}
        </h2>

        <p className='mb-6 text-sm text-gray-500 text-center'>
          {state === 'Sign up' ? 'Let’s get started!' : 'Login to continue!'}
        </p>

        <form onSubmit={onSubmitHandler}>

          {state === 'Sign up' && (
            <div className='mb-4 w-full px-5 py-2.5 rounded-full bg-blue-50 border border-blue-300'>
            <input
              onChange={e => setName(e.target.value)} value={name}
              className='bg-transparent outline-none text-blue-900 placeholder:text-blue-400 w-full'
              type='text'
              placeholder='Full Name'
              required
            />
          </div>)}

          <div className='mb-4 w-full px-5 py-2.5 rounded-full bg-blue-50 border border-blue-300'>
            <input
              onChange={e => setEmail(e.target.value)}
              value={email}
              className='bg-transparent outline-none text-blue-900 placeholder:text-blue-400 w-full'
              type='text'
              placeholder='Email'
              required
            />
          </div>

          <div className='mb-4 w-full px-5 py-2.5 rounded-full bg-blue-50 border border-blue-300'>
            <input
              onChange={e => setPassword(e.target.value)}
              value={password}
              className='bg-transparent outline-none text-blue-900 placeholder:text-blue-400 w-full'
              type='password'
              placeholder='Password'
              required
            />
          </div>

          <div className='mb-4'>
            {state === 'Login' && (<span onClick={() => navigate('/reset-password')} className='text-sm text-gray-500 cursor-pointer hover:underline'>Forgot password?</span>)}  
          </div>
          
          <button
            disabled={test}
            className={`w-full py-3 rounded-full bg-gradient-to-br from-blue-400 via-indigo-400 to-blue-600 
             text-white font-semibold shadow-md transition-all duration-300 
             hover:brightness-110 hover:shadow-lg active:scale-95 cursor-pointer${test ? "cursor-not-allowed opacity-65" : ""}`}
          >
            {test ? <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div> : state}
          </button>
        </form>

        {state === 'Sign up' 
        ? (<p className='text-gray-400 text-center text-xs mt-4'>
          Already have an account?{' '}
            <span onClick={() => setState('Login')} className='text-blue-400 cursor-pointer underline'>Login here</span>
        </p>) 
        : (<p className='text-gray-400 text-center text-xs mt-4'>
          Don't have an account?{' '}
            <span onClick={() => setState('Sign up')} className='text-blue-400 cursor-pointer underline'>Sign up</span>
        </p>)}

      </div>
    </div>
  )
}

export default Login

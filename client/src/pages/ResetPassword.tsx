import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'

const ResetPassword = () => {
  
  axios.defaults.withCredentials = true

  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const context = useContext(AppContext)
  if (!context)
    throw new Error('AppContext is not provided')

  const {backendUrl, getUserData} = context

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [state, setState] = useState('otp')
  const [password, setPassword] = useState('')
  // const [otp, setOtp] = useState('')

  const OnSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {

    try {
      
      e.preventDefault()

      if (!validateEmail(email)) {
        
        toast.error('Invalid email format!')
        return
      }

      const {data} = await axios.post(backendUrl + '/api/auth/send-reset-otp', {email})

      if (data.success) {
        toast.success(data.message)
        navigate('/reset-password/new-password')
      }
      else
        toast.error(data.message)


    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Something went wrong'
      toast.error(errorMessage)
    }

  }

  const validateEmail = (email: string) => {
    
    if (!email)
      return true

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

     // input focus
     const handleInput = (e: React.FormEvent<HTMLInputElement>, index: number) => {
  
        if (e.currentTarget.value.length > 0 && index < inputRefs.current.length - 1)
          inputRefs.current[index + 1]?.focus()
     }
  
     // delete previos focus
     const handleDeleteInput = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
  
        if (e.key === 'Backspace' && e.currentTarget.value === '' && index > 0)
          inputRefs.current[index - 1]?.focus()
  
     }
  
     // copy paste OTP
     const handlePasting = (e: React.ClipboardEvent<HTMLInputElement>) => {
  
        const pasteData = e.clipboardData.getData('text')
        const pasteArray = pasteData.split('')
        pasteArray.forEach((digit: string, index: number) => {
          
          if (inputRefs.current[index])
            inputRefs.current[index].value = digit
  
        });
     }
  
  
     const handleArrows = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
  
        if (e.key === 'ArrowRight' && index != 5)
          inputRefs.current[index + 1]?.focus()
        else if (e.key === 'ArrowLeft' && index > 0)
          inputRefs.current[index - 1]?.focus()
  
     }

     /*
      currently things are not working, still figuring out how to send otp, newPassword to backend to confirm.
      entering email seems to be working for the time being .. i guess
     */

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-blue-200'>

      <img onClick={() => navigate('/')} src={assets.logo} alt='' className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />

      <form onSubmit={OnSubmitHandler} className='bg-white p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-3xl font-bold text-blue-900 text-center mb-4'>Password Reset</h1>
        {state === 'otp' && (<p className='text-center mb-6 text-gray-500'>Enter the 6-digit code sent to your email</p>)}
        {state === 'email' && (<p className='text-center mb-6 text-gray-500'>Enter your email</p>)}
        {state === 'password' && (<p className='text-center mb-6 text-gray-500'>Enter your new password</p>)}
        <div className='flex justify-between mb-8'>
          {state === 'email' && (
            <input type="text" required placeholder='Email'
            className='w-full h-12 p-5 bg-blue-200 outline-none text-blue-900 text-base rounded-full placeholder:text-[16px]'
            onChange={e => setEmail(e.target.value)}
            value={email}
            /> 
          )}
          {state === 'password' && (
            <input type="text" required placeholder='New password'
            className='w-full h-12 p-5 bg-blue-200 outline-none text-blue-900 text-base rounded-full placeholder:text-[16px]'
            onChange={e => setPassword(e.target.value)}
            value={password}
            />
          )} 
          {state === 'otp' && (
            <div className='flex justify-between gap-1.5' onPaste={handlePasting}>
              {Array(6).fill(0).map((_, index) => (
                <input type="text" maxLength={1} key={index} required 
                className='w-12 h-12 bg-blue-200 outline-none text-blue-900 text-center text-xl rounded-md'
                ref={(e) => {
                  inputRefs.current[index] = e
                }}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleDeleteInput(e, index)}
                onKeyUp={(e) => handleArrows(e, index)}
                />
              ))}
            </div>
          )}
        </div>

        {state === 'email' && (<button className='w-full py-3 rounded-full bg-gradient-to-br from-blue-400 via-indigo-400 to-blue-600 
             text-white font-semibold shadow-md transition-all duration-300 
             hover:brightness-110 hover:shadow-lg active:scale-95 cursor-pointer'>Reset My Password</button>)}
        {state === 'otp' && (<button className='w-full py-3 rounded-full bg-gradient-to-br from-blue-400 via-indigo-400 to-blue-600 
             text-white font-semibold shadow-md transition-all duration-300 
             hover:brightness-110 hover:shadow-lg active:scale-95 cursor-pointer'>Verify OTP</button>)}
        {state === 'password' && (<button className='w-full py-3 rounded-full bg-gradient-to-br from-blue-400 via-indigo-400 to-blue-600 
             text-white font-semibold shadow-md transition-all duration-300 
             hover:brightness-110 hover:shadow-lg active:scale-95 cursor-pointer'>Confirm my new password</button>)}
        
      </form>
    </div>
  )
}

export default ResetPassword
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'

const EmailVerify = () => {
  
  axios.defaults.withCredentials = true

   const navigate = useNavigate()

   const {backendUrl, isLoggedin, userData, getUserData} = useContext(AppContext)

   const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

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


   const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {

    try {

      e.preventDefault()

      const otpArray = inputRefs.current.map(e => e?.value)
      const otpString = otpArray.join('')
      console.log(otpString)

      const {data} = await axios.post(backendUrl + '/api/auth/verify-account', {otp: otpString}, {withCredentials: true})
      
      if (data.success) {
        toast.success(data.message)
        getUserData()
        navigate('/')
      }
      else {
        toast.error(data.message)
      }

      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Something went wrong'
      toast.error(errorMessage)
    }

   }


  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-blue-200'>
        <img onClick={() => navigate('/')} src={assets.logo} alt='' className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
        {/* <div className='bg-white p-10 rounded-2xl shadow-2xl w-full sm:w-96 text-gray-700'>
          
        </div> */}
        <form onSubmit={onSubmitHandler} className='bg-white p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-3xl font-bold text-blue-900 text-center mb-4'>Email Verify OTP</h1>
          <p className='text-center mb-6 text-gray-500'>Enter the 6-digit code sent to your email</p>
          <div className='flex justify-between mb-8' onPaste={handlePasting}>
            {Array(6).fill(0).map((_, index) => (
              <input type="text" maxLength={1} key={index} required 
              className='w-12 h-12 bg-blue-200 outline-none text-blue-900 text-center text-xl rounded-md'
              ref={(e) => {
                inputRefs.current[index] = e;
              }}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleDeleteInput(e, index)}
              onKeyUp={(e) => handleArrows(e, index)}
              />
          ))}
          </div>
          <button className={`w-full py-3 rounded-full bg-gradient-to-br from-blue-400 via-indigo-400 to-blue-600 
             text-white font-semibold shadow-md transition-all duration-300 
             hover:brightness-110 hover:shadow-lg active:scale-95 cursor-pointer`}>Verify email</button>
        </form>
    </div>
  )
}

export default EmailVerify
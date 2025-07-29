import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'

const NewPassword = () => {

  const navigate = useNavigate()

  const [state, setState] = useState('otp')

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-blue-200'>

      <img onClick={() => navigate('/')} src={assets.logo} alt='' className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />

      <form className='bg-white p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-3xl font-bold text-blue-900 text-center mb-4'>Password Reset</h1>
        <p className='text-center mb-6 text-gray-500'>Enter the 6-digit code sent to your email</p>


      </form>


    </div>
  )
}

export default NewPassword
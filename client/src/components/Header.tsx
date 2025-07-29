import React, { useContext } from 'react'
import assets from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Header = () => {

  const context = useContext(AppContext)
  if (!context)
    throw new Error('AppContext is not provided')

  const navigate = useNavigate()

  const {userData} = context

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center scale-115">
        <img src={assets.robot} alt='' className='w-36 rounded-full mb-6 mx-auto' />

        <h1 className='flex justify-center items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>
          Hey {userData ? userData.name : 'Developer'}!
          <img src={assets.wave} alt='' className='w-8 aspect-square'  />
        </h1>

        <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to our app</h2>
        <p className='mb-8 max-w-md mx-auto'>Let's start with a quick product tour and we will have you up and running in no time!</p>
        
        <button className='cursor-pointer border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all'>
          Get Started
        </button>
      </div>
    </div>
  )
}

export default Header

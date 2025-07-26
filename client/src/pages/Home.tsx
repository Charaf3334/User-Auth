import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-blue-200">
      <Navbar />
      <Header />
    </div>
  )
}

export default Home
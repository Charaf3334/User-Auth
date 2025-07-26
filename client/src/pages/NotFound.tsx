import React from 'react'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-indigo-100 via-sky-100 to-blue-200">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-2">Oops! Page not found.</p>
      <p className="text-md text-gray-500">The page you're looking for doesn't exist.</p>
    </div>
  )
}

export default NotFound

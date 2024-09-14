import React from 'react'

const EmptyProductCards = () => {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
    {Array(7)
      .fill('')
      .map((_, index) => (
        <div key={index} className="w-48 border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white animate-pulse">
          <div className="w-full h-48 bg-gray-300"></div>
          <div className="p-4 text-center">
            <div className="h-4 bg-gray-300 mb-2"></div>
            <div className="h-4 bg-gray-300 w-1/2 mx-auto"></div>
          </div>
        </div>
      ))}
  </div>
  )
}

export default EmptyProductCards

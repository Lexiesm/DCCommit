'use client'

import { FC } from 'react'

interface LoadingProps {
  count?: number
}

const Loading: FC<LoadingProps> = ({ count = 3 }) => {
  // Crear un array con el número de elementos indicado
  const skeletons = Array.from({ length: count }, (_, index) => index)

  return (
    <>
      {skeletons.map((_, index) => (
        <div key={index} className="w-full bg-gray-800 rounded-lg p-4 mb-4">
          <div className="flex items-center mb-4">
            {/* Avatar skeleton */}
            <div className="w-10 h-10 bg-gray-700 rounded-full mr-4"></div>
            {/* Username and date skeleton */}
            <div className="flex-1">
              <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/8 mb-1"></div>
              <div className="h-3 bg-gray-700 rounded w-1/16"></div>
            </div>
          </div>
          {/* Content skeleton */}
          <div className="space-y-2">
            <div className="h-8 bg-gray-700 rounded w-1/4"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </>
  )
}

export default Loading

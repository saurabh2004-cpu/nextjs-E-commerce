'use client'

import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from 'next/image'

const MyCarousel = () => {

  const carouselLinks = [
    'https://tse2.mm.bing.net/th?id=OIP.c9xCr_QD8JsHRFfNL4ZVqQHaCe&pid=Api&P=0&h=220',
    'https://tse2.mm.bing.net/th?id=OIP.c9xCr_QD8JsHRFfNL4ZVqQHaCe&pid=Api&P=0&h=220',
    'https://tse2.mm.bing.net/th?id=OIP.c9xCr_QD8JsHRFfNL4ZVqQHaCe&pid=Api&P=0&h=220',
  ]

  return (
    <div className="flex justify-center items-center w-full h-full bg-gray-100">
      <Carousel className="w-full relative overflow-hidden">
        <CarouselContent className="w-full h-full flex transition-transform duration-100">
          {carouselLinks.map((link, index) => (
            <CarouselItem key={index} className="w-full h-full flex-shrink-0">
              <div className={`w-full h-full bg-cover bg-center`} style={{ backgroundImage: `url(${link})` }}>
                <Image
                  src='/src/app/img/Screenshot_20240915_093913.png'
                  alt=""
                  width={500} // Replace with the actual width of the image
                  height={300} // Replace with the actual height of the image
                  className='w-full h-full object-cover'
                />

              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute top-1/2 left-0 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-md">
          <span className="sr-only">Previous</span>
          <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.293 15.707a1 1 0 010-1.414L8.414 10l3.879-3.879a1 1 0 00-1.415-1.414l-4.95 4.95a1 1 0 000 1.414l4.95 4.95a1 1 0 001.415 0z" clipRule="evenodd"></path>
          </svg>
        </CarouselPrevious>
        <CarouselNext className="absolute top-1/2 right-0 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-md">
          <span className="sr-only">Next</span>
          <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.707 4.293a1 1 0 010 1.414L11.586 10l-3.879 3.879a1 1 0 001.415 1.414l4.95-4.95a1 1 0 000-1.414l-4.95-4.95a1 1 0 00-1.415 0z" clipRule="evenodd"></path>
          </svg>
        </CarouselNext>
      </Carousel>
    </div>
  )
}

export default MyCarousel

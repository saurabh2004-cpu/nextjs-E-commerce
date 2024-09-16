'use client'

import SellerNavBar from '@/components/comps/SellerNavbar'
import SellerFooter from '@/components/footer/SellerFooter'
import Image from 'next/image'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

const Page = () => {

    const userData = useSelector((state:RootState) => state.user.userData);
    console.log("userdata",userData)

  return (
    <div>
        <SellerNavBar display={'hidden'}/>
        <div className="bg-white py-10 px-5 sm:px-20">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 mb-5">
                <a href="/" className="hover:underline">Home</a> &gt; <span>Sell Online</span>
            </div>
            <Image src="https://static-assets-web.flixcart.com/fk-sp-static/images/prelogin/banner/Desktop_sell.webp" alt="" />

            {/* Main Section */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 flex relative items-center bottom-[155px] justify-between ">Sell Online with Flipkart</h1>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="flex flex-col items-center">
                        <div className="text-4xl text-blue-500 mb-2">👥</div> {/* Replace with appropriate icon */}
                        <div className="text-lg font-semibold">45 crore+ Flipkart customers</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-4xl text-blue-500 mb-2">💳</div> {/* Replace with appropriate icon */}
                        <div className="text-lg font-semibold">7* days secure & regular payments</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-4xl text-blue-500 mb-2">💼</div> {/* Replace with appropriate icon */}
                        <div className="text-lg font-semibold">Low cost of doing business</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-4xl text-blue-500 mb-2">📞</div> {/* Replace with appropriate icon */}
                        <div className="text-lg font-semibold">One click Seller Support</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-4xl text-blue-500 mb-2">🛍️</div> {/* Replace with appropriate icon */}
                        <div className="text-lg font-semibold">Access to The Big Billion Days & more</div>
                    </div>
                </div>
            </div>
        </div>
        <SellerFooter/>
      
    </div>
  )
}

export default Page

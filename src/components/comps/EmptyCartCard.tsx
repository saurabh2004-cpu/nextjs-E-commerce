import React from 'react';
import Navbar from '../navbar/Navbar';
import Image from 'next/image';

const EmptyCartCard = () => {
    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center justify-center h-screen bg-white">
                <div className="flex flex-col items-center">
                    {/* Image */}
                    <Image
                        src="/path-to-your-image.svg" // Replace with the actual path to the image
                        alt="Empty Cart"
                        className="w-1/3 mb-6"
                    />
                    {/* Text */}
                    <h2 className="text-lg font-semibold text-gray-800">Your cart is empty!</h2>
                    <p className="text-gray-500 mb-6">Add items to it now.</p>
                    {/* Button */}
                    <a href="/">
                        <button className="bg-blue-500 text-white py-2 px-6 rounded">
                            Shop now
                        </button>
                    </a>
                </div>
            </div>
        </>
    );
};

export default EmptyCartCard;

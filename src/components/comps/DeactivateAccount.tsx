'use client'
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const DeactivateAccount = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const userData = useSelector(state=>state.user.userData)

  const handleDeactivate = () => {
    
  };

  const handleCancel = ()=>{
    
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white max-w-fit w-11/12 max-w-lg p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Are you sure you want to leave?</h2>
        <div className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={userData.email}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none "
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={userData.phone}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none "
          />
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter received OTP"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleDeactivate}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none"
        >
          CONFIRM DEACTIVATION
        </button>
        <button
          onClick={() => {}}
          className="w-full mt-2 bg-transparent text-blue-600 py-2 rounded-md hover:underline focus:outline-none"
        >
          NO, LET ME STAY!
        </button>
        <div className="mt-6 text-sm text-gray-700">
          <h3 className="font-semibold mb-2">When you deactivate your account</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>You are logged out of your Flipkart Account</li>
            <li>Your public profile on Flipkart is no longer visible</li>
            <li>Your reviews/ratings are still visible, while your profile information is shown as ‘unavailable’ as a result of deactivation.</li>
            <li>Your wishlist items are no longer accessible through the associated public hyperlink. Wishlist is shown as ‘unavailable’ as a result of deactivation.</li>
            <li>You will be unsubscribed from receiving promotional emails from Flipkart</li>
            <li>Your account data is retained and is restored in case you choose to reactivate your account</li>
          </ul>
          <h3 className="font-semibold mt-4 mb-2">How do I reactivate my Flipkart account?</h3>
          <p>Reactivation is easy.</p>
          <p>Simply login with your registered email id or mobile number and password combination used prior to deactivation. Your account data is fully restored. Default settings are applied and you will be subscribed to receive promotional emails from Flipkart.</p>
          <p>Flipkart retains your account data for you to conveniently start off from where you left, if you decide to reactivate your account.</p>
          <p className="mt-2 font-semibold">Remember: Account Reactivation can be done on the Desktop version only.</p>
        </div>
      </div>
    </div>
  );
};

export default DeactivateAccount;

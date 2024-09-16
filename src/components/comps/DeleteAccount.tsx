import axiosInstance from '@/app/(frontend)/services/api';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const DeleteAccount = () => {
  const [agreed, setAgreed] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter()

  const handleCheckboxChange = (e:any) => {
    setAgreed(e.target.checked);
  };

  const handleFeedbackChange = (e:any) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = async(e:any) => {
    e.preventDefault();
    if (!agreed) {
      alert('You must agree to the terms and conditions.');
      return;
    }
    setIsSubmitting(true);
    
    const response = await axiosInstance.post('http://localhost:3000/api/delete-account')

    if(!response){
      alert("Err: Internal server error please try again or letter")
    }

    // console.log('Feedback:', feedback);
    setTimeout(() => {
      alert('Account deleted successfully.');
      setIsSubmitting(false);
    }, 1000);
    router.replace('/')
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-lg ">
      <h2 className="text-2xl font-bold text-red-600 mb-4">We are sorry to see you go!</h2>
      <p className="mb-2">Please note that once you choose to delete your account with Flipkart or Shopsy (&quot;Platform&quot;), your account will no longer be available to you and you will not be able to activate, restore or use the account again.</p>
      <p className="mb-4">In case, you are not sure about deleting your account, you may instead deactivate your account...</p>
      <ul className="list-disc list-inside mb-4">
        <li className="mb-2">There are no pending orders, cancellations, returns, refunds or other requests (&quot;Transactions&quot;)...</li>
        <li className="mb-2">If you hold any subscription or membership, you will lose all benefits and rewards...</li>
        <li className="mb-2">You have exhausted or do not intend to use SuperCoins, Gift Cards or any such reward points...</li>
        <li className="mb-2">... (Add other points as needed)</li>
      </ul>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input 
            type="checkbox" 
            id="agree" 
            checked={agreed} 
            onChange={handleCheckboxChange} 
            className="mr-2 leading-tight" 
          />
          <label htmlFor="agree" className="text-sm">I have read and agreed to the Terms and Conditions.</label>
        </div>
        <div className="mb-4">
          <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">Please tell us why you&apos;re leaving us:</label>
          <textarea 
            id="feedback" 
            value={feedback} 
            onChange={handleFeedbackChange} 
            className="w-full p-2 border border-gray-300 rounded-md" 
          ></textarea>
        </div>
        <button 
          type="submit" 
          className={`w-1/2 py-2 px-4 bg-red-600 text-white rounded-md font-semibold ${isSubmitting ? 'cursor-not-allowed' : 'hover:bg-red-700'}`} 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Deleting...' : 'Delete Account'}
        </button>
      </form>
    </div>
  );
};

export default DeleteAccount;

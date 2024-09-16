'use client';

import "./utilty.css";

import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signUpSchema } from '@/schemas/signupSchema';
import { Loader2 } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../services/api';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '@/components/navbar/Navbar';
import DeleteAccount from '@/components/comps/DeleteAccount';
import DeactivateAccount from "@/components/comps/DeactivateAccount";
import { useToast } from "@/components/ui/use-toast";
import ListWishlist from "@/components/comps/ListWishlist";
import { z } from "zod";
import { setUser } from "../store/userSlice";
import store, { RootState } from "../store/store";
import AddressCard from "@/components/comps/AddressCard";
import { useSearchParams } from "next/navigation";

const ProfileSettings = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitBtn, setShowSubmitBtn] = useState(false);
  const [readOnly, setReadonly] = useState(true);
  const [activeTab, setActiveTab] = useState('Profile Information');
  const [showDeleteAccountCard, setShowDeleteAccountCard] = useState(false)
  const [showDeactivateAccountCard, setShowDeactivateAccountCard] = useState(false)
  const [loading, setloading] = useState(false)

  const { data: session, status } = useSession();
  const user = session?.user;
  const dispatch = useDispatch();
  const { toast } = useToast();

  const userData = useSelector((state: RootState) => state.user.userData);
  console.log("userdata", userData)

  const [gender, setGender] = useState<string>(userData?.gender || '');

  const searchParams = useSearchParams()
  const myWishlist =searchParams.get('wishlist')


  const form = useForm({
    defaultValues: {
      username: userData?.username || '',
      fullname: userData?.fullname || '',
      phone: userData?.phone || '',
      email: userData?.email || 'no email',
      gender: userData?.gender || ''
    }
  });

  useEffect(() => {
    form.reset(userData);

    if(myWishlist){
      setActiveTab(myWishlist)
    }
  }, [userData, form,myWishlist]);

  //
  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGender(e.target.value);
  };

  //
  const updateUserNameAndSurname = async (data: z.infer<typeof signUpSchema>) => {
    if (!data) {
      console.log("no data found");
    }

    console.log("data, gender", data, gender); // Check if the form data is logged
    setIsSubmitting(true);

    const formData = {
      username: data.username || userData?.username,
      fullname: data.fullname || userData?.fullname,
      gender: gender || '',
      email: data.email || userData?.email,
      phone: data.phone || userData?.phone,
    };

    console.log(formData)
    try {
      const response = await axiosInstance.post('http://localhost:3000/api/update-user-details', formData);
      console.log("response", response.data.data);
      if (!response) {
        console.log("failed to update user details");
        toast({
          title: 'user details updated',
        });
      }

      dispatch(setUser(response.data.data));

      alert("User data updated successfully");
      console.log("User data updated successfully");
      setReadonly(true);
      setShowSubmitBtn(false);
    } catch (error) {
      console.error("Failed to update user data", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  //
  const toggleDisplay = () => {
    setShowSubmitBtn(!showSubmitBtn);
    setReadonly(!readOnly);
  };

  //
  const handleLogout = async () => {
    setloading(true);
    try {
      await signOut({ callbackUrl: "/" }); 
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setloading(false);
    }
  };

  //
  const handleTab = (tab: string) => () => {
    setActiveTab(tab);
    console.log("tab", tab)
  };

  //
  const handleShowDeleteCard = () => {
    setShowDeleteAccountCard(!showDeleteAccountCard)
  }

  //
  const handleShowDeactivateCard = () => {
    setShowDeactivateAccountCard(!showDeactivateAccountCard)
  }


  

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Not authorized</div>;
  }
  // const localWishlist = localStorage.getItem('wishlist');
  // if (localWishlist) {
  //   store.dispatch(setWishlist(JSON.parse(localWishlist)));
  // }

  const getInitial = (name:string) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <aside className="w-1/4 bg-white border-r">
          <div className="flex items-center p-4 border-b">
          <div
              className="rounded-full text-red-500 mr-4 flex items-center justify-center bg-orange-500 text-white font-bold text-2xl"
              style={{ width: '50px', height: '50px' }}
            >
              {getInitial(userData?.username || '')}
            </div>
            <div>
              <h2 className="text-lg font-semibold">Hello, {userData?.username}</h2>
            </div>
          </div>
          <nav className="p-4">
            <ul>
              <li className="py-2">
                <a href="myOrders" className="text-blue-600 hover:text-blue-600">
                  My Orders
                </a>
              </li>
              <li className="py-2">
                <a href="#" className="text-blue-600 ">
                  Account Settings
                </a>
              </li>
              <ul className="pl-4">
                <li className="py-1">
                  <button className="text-gray-800 hover:text-blue-600 " onClick={handleTab('Profile Information')}>
                    Profile Information
                  </button>
                </li>
                <li className="py-1">
                  <a href="#" className="text-gray-800 hover:text-blue-600" onClick={handleTab('Manage Addresses')}>
                    Manage Addresses
                  </a>
                </li>
                <li className="py-1">
                  <a href="#" className="text-gray-800 hover:text-blue-600" onClick={handleTab('PAN Card Information')}>
                    PAN Card Information
                  </a>
                </li>
              </ul>
            </ul>
          </nav>
          <div className="p-4 border-t">
            <ul>
              <li className="py-2">
                <a href="#" className="text-blue-600 hover:text-blue-600">
                  Payments
                </a>
              </li>
              <ul className="pl-4">
                <li className="py-1">
                  <a href="#" className="text-gray-800 hover:text-blue-600" onClick={handleTab('Gift Cards')}>
                    Gift Cards
                  </a>
                </li>
                <li className="py-1">
                  <a href="#" className="text-gray-800 hover:text-blue-600" onClick={handleTab('Saved UPI')}>
                    Saved UPI
                  </a>
                </li>
                <li className="py-1">
                  <a href="#" className="text-gray-800 hover:text-blue-600" onClick={handleTab('Saved Cards')}>
                    Saved Cards
                  </a>
                </li>
              </ul>
            </ul>
          </div>
          <div className="p-4 border-t">
            <ul>
              <li className="py-2">
                <a href="#" className="text-blue-600 hover:text-blue-600">
                  My Stuff
                </a>
              </li>
              <ul className="pl-4">
                <li className="py-1">
                  <a href="#" className="text-gray-800 hover:text-blue-600" onClick={handleTab('My Coupons')}>
                    My Coupons
                  </a>
                </li>
                <li className="py-1">
                  <a href="#" className="text-gray-800 hover:text-blue-600" onClick={handleTab('My Reviews & Ratings')}>
                    My Reviews & Ratings
                  </a>
                </li>
                <li className="py-1">
                  <a href="#" className="text-gray-800 hover:text-blue-600" onClick={handleTab('All Notifications')}>
                    All Notifications
                  </a>
                </li>
                <li className="py-1">
                  <a href="#" className="text-gray-800 hover:text-blue-600" onClick={handleTab('My Wishlist')}>
                    My Wishlist
                  </a>
                </li>
              </ul>
            </ul>
          </div>
          <div className="p-4 border-t">
            <button className="text-red-600 hover:text-blue-600" onClick={handleLogout}>Logout</button>
          </div>
          <div className="p-4">
            <p className="text-gray-600">Frequently Visited:</p>
            <ul>
              <li className="py-1">
                <a href="/myOrders" className="text-blue-600 hover:text-blue-600">
                  Track Order
                </a>
              </li>
              <li className="py-1">
                <a href="#" className="text-blue-600 hover:text-blue-600">
                  Help Center
                </a>
              </li>
            </ul>
          </div>
        </aside>

        {activeTab === 'Profile Information' &&
          <main className="w-3/4 p-8 bg-gray-50 w-full">
            <div className="bg-white p-6 rounded shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
              {!showDeleteAccountCard && <button className='blue text-blue-600' onClick={toggleDisplay}>{showSubmitBtn ? 'Cancel' : 'Edit'}</button>}
              <div className="mb-4">
                {!showDeleteAccountCard && <div className="flex">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(updateUserNameAndSurname)} className="space-6  m-4 w-1/2">
                      <FormField
                        name="username"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className=''>
                            <FormLabel className='font-bold'>Username</FormLabel>
                            <Input placeholder={userData?.username} {...field} readOnly={readOnly} />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="fullname"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className=' my-4'>
                            <FormLabel className='font-bold'>Fullname</FormLabel>
                            <Input placeholder={userData?.fullname} type='' {...field} readOnly={readOnly} />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className=' my-4'>
                            <FormLabel className='font-bold'>Email</FormLabel>
                            <Input placeholder={userData?.email} type='email' {...field} readOnly={readOnly} />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="phone"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className=' my-4'>
                            <FormLabel className='font-bold'>Phone</FormLabel>
                            <Input placeholder={userData?.phone}  {...field} readOnly={readOnly} />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {showSubmitBtn && <Button type="submit" className='w-full '>
                        {isSubmitting ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          "Save"
                        )}
                      </Button>}

                    </form>
                  </Form>
                </div>}
                {showDeleteAccountCard && <DeleteAccount />}
                {showDeactivateAccountCard && <DeactivateAccount />}

                {showDeleteAccountCard &&
                  <div className='flex justify-center'>
                    <button className='text-bolder bg-blue-500 p-2 rounded-lg w-1/4 cancel-Btn' onClick={handleShowDeleteCard}>Cancel</button>
                  </div>
                }
              </div>
              <div className="mb-4">
                <label className="block text-gray-600">Your Gender</label>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    className="mr-2"
                    checked={gender === 'male'}
                    onChange={handleGenderChange}
                    disabled={readOnly}
                  />
                  <label className="mr-4">Male</label>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    className="mr-2"
                    checked={gender === 'female'}
                    onChange={handleGenderChange}
                    disabled={readOnly}
                  />
                  <label>Female</label>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">FAQs</h3>
              <div className="mb-4">
                <p className="text-gray-800 font-semibold">
                  What happens when I update my email address (or mobile number)?
                </p>
                <p className="text-gray-600">
                  Your login email id (or mobile number) changes, likewise. You &apos;ll
                  receive all your account related communication on your updated
                  email address (or mobile number).
                </p>
              </div>
              <div className="mb-4">
                <p className="text-gray-800 font-semibold">
                  When will my Flipkart account be updated with the new email
                  address (or mobile number)?
                </p>
                <p className="text-gray-600">
                  It happens as soon as you confirm the verification code sent to
                  your email (or mobile) and save the changes.
                </p>
              </div>
              <div className="mb-4">
                <p className="text-gray-800 font-semibold">
                  What happens to my existing Flipkart account when I update my
                  email address (or mobile number)?
                </p>
                <p className="text-gray-600">
                  Updating your email address (or mobile number) doesn&apos;t invalidate
                  your account. Your account remains fully functional. You&apos;ll
                  continue seeing your Order history, saved information and personal
                  details.
                </p>
              </div>
              <div className="mb-4">
                <p className="text-gray-800 font-semibold">
                  Does my Seller account get affected when I update my email
                  address?
                </p>
                <p className="text-gray-600">
                  Flipkart has a &apos;single sign-on&apos; policy. Any changes will reflect
                  in your Seller account also.
                </p>
              </div>
              <div className="mt-6 flex items-center">
                <button className="bg-red-600 text-white py-2 px-4 rounded mr-2" onClick={handleShowDeactivateCard}>
                  Deactivate Account
                </button>
                <button className="bg-red-600 text-white py-2 px-4 rounded" onClick={handleShowDeleteCard}>
                  Delete Account
                </button>
              </div>
            </div>
          </main>}

        {activeTab === 'My Wishlist' && <ListWishlist />}

        {activeTab === 'Manage Addresses' && <AddressCard />}


      </div>


    </>
  );
};

export default ProfileSettings;

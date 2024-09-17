'use client';
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../services/api';
import { signUpSchema } from '@/schemas/signupSchema';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';

const Page = () => {
  const router = useRouter(); // next-navigation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signUpError, setSignUpError] = useState('')

  // zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      fullname: '',
      phone: '',
      email: ''
    }
  });

  // form submit
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    console.log(data)

    try {
      const response = await axiosInstance.post(`http://localhost:3000/api/sign-up`, data);
      console.log("signup:", response);

      if(!response){
        console.log("no response")
      }
      
      // if (response.data.statusCode !== 200 && response.data.statusCode === 400) {
      //   
      //   )
      // }

      toast({ title: 'Sucessfully Registered', });

      setIsSubmitting(false);
      router.push('/sign-in'); // Redirect to login page on success

    } catch (error:any) {
      console.error("Error in signup of user", error);

      setSignUpError(error.response.data.message)

      console.log(error.response.data.message)

      toast({
        title: 'SignUp Failed',
        description: "",
        variant: "destructive"
      });

      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <p className="mb-4">Sign up</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input placeholder='Username' {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="fullname"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <Input placeholder='Full Name' {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input placeholder='Email' {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <Input placeholder='Phone' {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full' disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Sign Up"
              )}
            </Button>

       <div> {signUpError && <p className='text-red-500'>{signUpError}</p>}</div>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already have an account?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;

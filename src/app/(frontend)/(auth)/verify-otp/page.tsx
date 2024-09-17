'use client';

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosInstance from '../../services/api';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { verifySchema } from '@/schemas/verifyCodeSchema';
import { ApiError } from '@/utils/ApiError';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import Link from "next/link"
import { signOut } from 'next-auth/react';


const VerifyOtpPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  

  const searchParams = useSearchParams();
  const phone = searchParams.get('phone');

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      otp: '',
    },
  });

  useEffect(() => {
    if (phone) {
      console.log('Phone:', phone);
    }

    const getOtp = async () => {
      try {
        const response = await axiosInstance.get(`http://localhost:3000/api/send-otp/${phone}`);
        console.log('otp', response);

        if (!response ) {
          throw new ApiError(400, 'Error while sending OTP to user');
        }
      } catch (error:any) {
        console.error('Error while sending OTP:', error);

        
        setErrorMessage("Error while sending OTP")
        toast({
          title: 'Error',
          description: 'Failed to send OTP',
          variant: 'destructive',
        });
        await signOut({ redirect :false });
      }
    };

    getOtp();
  }, [phone]);

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    setErrorMessage('');
    console.log(data);

    try {
      const response = await axiosInstance.post(`http://localhost:3000/api/verify-otp/`,{phone, otp: data.otp});
      
      console.log('verify-otp:', response);
      if (response.data.statusCode !== 200) {
        setErrorMessage(response.data.message);
      } else {
        router.replace(`/`);
      }
    } catch (error) {
      console.error('Error in OTP verification', error);
      toast({
        title: 'Verify OTP Failed',
        description: '',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <p className="mb-4">Verify OTP</p>
          <p className="mb-4 text-red-500">{errorMessage}</p>
        </div>
      {errorMessage && <Link href="/"> <Button>Back</Button></Link>}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="otp"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTP</FormLabel>
                  <FormControl>
                    <div className="flex justify-center ">
                      <InputOTP maxLength={6} {...field} className="text-center">
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Verify'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyOtpPage;

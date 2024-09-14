import React, { useState } from 'react';
import axiosInstance from '@/app/(frontend)/services/api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { addressSchema } from '@/schemas/addressSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';

interface Address {
    _id?: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

interface AddressFormProps {
    addressData: Partial<Address>;  // Use Partial<Address> to allow optional properties
    onClose: () => void;
    onSave: (savedAddress: Address) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ addressData, onClose, onSave }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);

    const form = useForm<z.infer<typeof addressSchema>>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            addressLine1: addressData.addressLine1 || '',
            addressLine2: addressData.addressLine2 || '',
            city: addressData.city || '',
            state: addressData.state || '',
            postalCode: addressData.postalCode || '',
            country: addressData.country || '',
        },
    });

    ////fetch Address From longitude and lattitude
    const fetchAddressFromLocation = async (latitude: number, longitude: number) => {
        try {
            // Replace with your API endpoint or external service that converts lat/lon to an address
            const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
                params: {
                    key: process.env.NEXT_PUBLIC_OPEN_CAGE_API_KEY,
                    q: `${latitude},${longitude}`,
                    pretty: 1,
                    no_annotations: 1
                }
            });

            if (!response) {
                console.log("no response")
            }

            console.log("long and lat address", response)

            const address = response.data.results[0].components;

            form.setValue('addressLine1', address.road);
            form.setValue('addressLine2', address.suburb);
            form.setValue('city', address.city || address.town || address.village);
            form.setValue('state', address.state);
            form.setValue('postalCode', address.postcode);
            form.setValue('country', address.country);

            toast({ description: "Location fetched successfully" });
        } catch (error) {
            console.error('Error fetching address from location', error);
            toast({ description: "Error fetching address from location", variant: "destructive" });
        }
    };

    ////get longitude and lattitide
    const handleUseCurrentLocation = () => {
        setLoadingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchAddressFromLocation(latitude, longitude);
                    setLoadingLocation(false);
                },
                (error) => {
                    console.error('Error fetching location', error);
                    toast({ description: "Error fetching location", variant: "destructive" });
                    setLoadingLocation(false);
                }
            );
        } else {
            toast({ description: "Geolocation is not supported by this browser", variant: "destructive" });
            setLoadingLocation(false);
        }
    };


    ////submit
    const onSubmit = async (data: z.infer<typeof addressSchema>) => {
        setIsSubmitting(true);
        try {
            let response;
            if (addressData._id) {
                response = await axiosInstance.patch(`/api/update-address?addressId=${addressData._id}`, data);
                toast({ description: "Address updated successfully" });
            } else {

                response = await axiosInstance.post('/api/create-address', data);
                toast({ description: "Address created successfully" });
            }

            form.reset();
            onClose();
            onSave(response.data.data);  // Pass the saved data back to AddressCard
        } catch (error) {
            console.error('Error while creating/updating the address', error);
            toast({ description: "Error: Could not save address", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-full mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex justify-center mb-4">
                        <Button
                            type="button"
                            className="bg-blue-600 text-white py-2 px-4 rounded"
                            onClick={handleUseCurrentLocation}
                            disabled={loadingLocation}
                        >
                            {loadingLocation ? <Loader2 className="animate-spin" /> : 'Use my current location'}
                        </Button>
                    </div>

                    <FormField
                        name="addressLine1"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address Line 1</FormLabel>
                                <Input
                                    placeholder="Address Line 1"
                                    {...field}
                                    className="w-full border-gray-300 rounded px-3 py-2"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="addressLine2"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address Line 2</FormLabel>
                                <Input
                                    placeholder="Address Line 2"
                                    {...field}
                                    className="w-full border-gray-300 rounded px-3 py-2"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            name="postalCode"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Postal Code</FormLabel>
                                    <Input
                                        placeholder="Postal Code"
                                        {...field}
                                        className="w-full border-gray-300 rounded px-3 py-2"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="city"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <Input
                                        placeholder="City"
                                        {...field}
                                        className="w-full border-gray-300 rounded px-3 py-2"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            name="state"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <Input
                                        placeholder="State"
                                        {...field}
                                        className="w-full border-gray-300 rounded px-3 py-2"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="country"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <Input
                                        placeholder="Country"
                                        {...field}
                                        className="w-full border-gray-300 rounded px-3 py-2"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-center mt-6">
                        <Button
                            type="submit"
                            className={`bg-blue-600 text-white py-2 px-4 rounded w-full ${isSubmitting ? 'cursor-not-allowed' : ''}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Save'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default AddressForm;

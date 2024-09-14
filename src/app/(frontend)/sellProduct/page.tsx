'use client';

import SellerNavBar from '@/components/comps/SellerNavbar';
import { productSchema } from '@/schemas/productschema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, ImagePlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axiosInstance from '../services/api';
import ProductByCategory from '@/components/comps/ProductByCategory';
import { Description } from '@radix-ui/react-toast';
import { toast } from '@/components/ui/use-toast';
import Image from 'next/image';

const Page = () => {
    const router = useRouter(); // next-navigation
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [productImage, setProductImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [productCategory, setProductCategory] = useState<string | null>('');


    // zod implementation
    const form = useForm({
        defaultValues: {
            name: '',
            price: 0,
            description: '',
            category: '',
            stock: 0,
            keywords: '',
            imageUrl: '',
            highlight: '',
            ram: null,
            storage: null,
            color: '',
            battery: null,
            displaySize: 0,
            launchYear: 0,
            hdTechnology: '',
            clotheSize: '',
            clotheColor: ''
        },
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        console.log(data)
        try {
            const formData = new FormData();

            formData.append('name', data.name);
            formData.append('price', data.price);
            formData.append('description', data.description);
            formData.append('category', data.category);
            formData.append('stock', data.stock);
            formData.append('keywords', data.keywords);
            formData.append('highlight', data.highlight)

            if (!productImage) {
                toast({ description: "please select a thumbnial image for product" })
            }

            formData.append('imageUrl', productImage);

            //mobiles and tablets
            if (data.category === "mobiles and tablets") {
                if (!data.color || !data.ram || !data.storage || !data.battery) {
                    toast({ description: "Please fill out all product details" });
                    setIsSubmitting(false);
                    return;
                }
                formData.append('ram', data.ram);
                formData.append('storage', data.storage);
                formData.append('color', data.color);
                formData.append('battery', data.battery);
            }

            //tv and appliences
            if (productCategory === "tv and appliances") {
                if (!data.displaySize || !data.launchYear || !data.hdTechnology) {
                    toast({ description: "Please fill out all product details" });
                    setIsSubmitting(false);
                    return;
                }
                formData.append('displaySize', data.displaySize);
                formData.append('launchYear', data.launchYear);
                formData.append('hdTechnology', data.hdTechnology);
            }

            //fashion
            if (productCategory === "fashion") {
                if (!data.clotheSize || !data.clotheColor) {
                    toast({ description: "Please fill out all product details" });
                    setIsSubmitting(false);
                    return;
                }
                formData.append('clotheSize', data.clotheSize);
                formData.append('clotheColor', data.clotheColor);
            }


            const response = await axiosInstance.post('http://localhost:3000/api/create-product',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            console.log('Success:', response.data);
            router.replace(`/get-product?productId=${encodeURIComponent(response.data.data._id)}`)
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProductImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <SellerNavBar display={'hidden'} />

            <div className="flex justify-center mt-10">
                <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        Add New Product
                    </h2>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <FormField
                                name="imageUrl"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Image</FormLabel>
                                        <div className="flex flex-col items-center">
                                            {<label className="w-full flex flex-col items-center px-4 py-6 bg-gray-100 text-blue-600 rounded-lg shadow-md tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-600 hover:text-white transition duration-200 ease-in-out">
                                                <ImagePlus className="w-8 h-8 mb-2" />
                                                <span className="text-sm leading-normal">
                                                    Select a Product Thumbnail Image
                                                </span>
                                                <Input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={handleImageChange}
                                                />
                                            </label>}
                                            {imagePreview && (
                                                <div className="mt-4">
                                                    <Image
                                                        src={imagePreview}
                                                        alt="Image Preview"
                                                        className="w-50 h-50 object-cover rounded-md"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-6">
                                <FormField
                                    name="name"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Name</FormLabel>
                                            <Input
                                                placeholder="Product Name"
                                                {...field}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="price"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price</FormLabel>
                                            <Input
                                                placeholder="Price"
                                                step="0.01"
                                                {...field}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                name="description"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <Input
                                            placeholder="Description"
                                            {...field}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-6">
                                <FormField
                                    name="category"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <select
                                                {...field}
                                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                onChange={(event) => {
                                                    setProductCategory(event.target.value);  // Update the local state if needed
                                                    field.onChange(event);  // Notify react-hook-form of the change
                                                }}
                                                value={field.value}  // Bind the current value to the form's internal state
                                            >
                                                <option value='' disabled>
                                                    Select a category
                                                </option>
                                                <option value="mobiles and tablets">Mobiles and Tablets</option>
                                                <option value="tv and appliances">TV and Appliances</option>
                                                <option value="fashion">Fashion</option>
                                                <option value="beauty">Beauty</option>
                                                <option value="home and kitchen">Home and Kitchen</option>
                                                <option value="furniture">Furniture</option>
                                                <option value="travel">Travel</option>
                                                <option value="grocery">Grocery</option>
                                                <option value="electronics">Electronics</option>
                                            </select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="stock"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Stock</FormLabel>
                                            <Input
                                                placeholder="Stock"
                                                {...field}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* mobiles and tablets */}
                            {productCategory === 'mobiles and tablets' &&
                                <div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <FormField
                                            name="ram"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Ram</FormLabel>
                                                    <Input
                                                        placeholder="Ram"
                                                        {...field}
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="storage"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Storage</FormLabel>
                                                    <Input
                                                        placeholder="Storage"
                                                        // step="0.01"
                                                        {...field}
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="color"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Color</FormLabel>
                                                    <Input
                                                        placeholder="Color"
                                                        {...field}
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="battery"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Battery</FormLabel>
                                                    <Input
                                                        placeholder="battery"
                                                        {...field}
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            }

                            {/* tvs and appliences */}
                            {productCategory === "tv and appliances" &&
                                <div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <FormField
                                            name="displaySize"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Display Size</FormLabel>
                                                    <Input
                                                        placeholder="Display Size"
                                                        {...field}
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="launchYear"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Launch Year</FormLabel>
                                                    <Input
                                                        placeholder="Launch Year"
                                                        {...field}
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="hdTechnology"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>HD Technology</FormLabel>
                                                    <select
                                                        {...field}
                                                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                        value={field.value}
                                                    >
                                                        <option value='' disabled>
                                                            Select a display type
                                                        </option>
                                                        <option value="Full HD">Full HD</option>
                                                        <option value="HD Ready">HD Ready</option>
                                                        <option value="Ultra HD (4k)">Ultra HD (4k)</option>
                                                    </select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                    </div>
                                </div>
                            }

                            {/* //fashion */}
                            {productCategory === "fashion" &&
                                <div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <FormField
                                            name="clotheSize"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Clothe Size</FormLabel>
                                                    <Input
                                                        placeholder="Size"
                                                        {...field}
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="clotheColor"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Color</FormLabel>
                                                    <Input
                                                        placeholder="Color"
                                                        {...field}
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            }

                            



                            <FormField
                                name="highlight"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Highlights</FormLabel>
                                        <Input
                                            placeholder="Highlights"
                                            {...field}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="keywords"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Keywords(insert keyword with "," seperated)</FormLabel>
                                        <Input
                                            placeholder="Keywords"
                                            {...field}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    'Create'
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Page;

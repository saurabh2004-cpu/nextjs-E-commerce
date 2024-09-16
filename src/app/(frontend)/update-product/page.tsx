'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import 'nprogress/nprogress.css';
import NProgress from 'nprogress';
import axiosInstance from '../services/api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
// import { updateProductSchema } from '@/schemas/productschema';
// import { zodResolver } from '@hookform/resolvers/zod';

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
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProductSchema } from '@/schemas/productschema';

interface Product {
    imageUrl: string;
    name: string;
    price: number;
    totalReviews: number;
    description: string;
    category?: string;
    stock?: number;
    keywords?: string[];
}

const Page = () => {
    const searchParams = useSearchParams();
    const productId = searchParams.get('productId');
    const router = useRouter()

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [product, setProduct] = useState<Product | null>(null);
    const [productImage, setProductImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const form = useForm({
        resolver: zodResolver(updateProductSchema),
        defaultValues: {
            name: '',
            price: 0,
            description: '',
            category: '',
            stock: '',
            keywords: '',
            imageUrl: '',
        },
    });

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) {
                setLoading(false);
                console.error("Product ID is missing");
                return;
            }
    
            try {
                NProgress.start();
                const response = await axiosInstance.get(`/api/get-product?productId=${productId}`);
                if (response && response.data && response.data.data) {
                    setProduct(response.data.data);
                    
                    form.reset({
                        name: response.data.data.name,
                        price: response.data.data.price,
                        description: response.data.data.description,
                        category: response.data.data.category,
                        stock: response.data.data.stock,
                        keywords: response.data.data.keywords.join(','),  // Convert array to comma-separated string
                        imageUrl: response.data.data.imageUrl,
                    });
                }
            } catch (error) {
                console.error("Error while fetching product:", error);
            } finally {
                setLoading(false);
                NProgress.done();
            }
        };
    
        fetchProduct();
    }, [productId, form]);
    
    
    const onSubmit = async (data: z.infer<typeof updateProductSchema>) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            
            // Convert keywords string to an array
            const keywordsArray = (data.keywords || '').split(',').map(keyword => keyword.trim());
    
            // Append form data
            formData.append('name', data.name);
            formData.append('price', String(data.price));  // Convert number to string
            formData.append('description', data.description || '');
            formData.append('category', data.category);
            formData.append('stock', String(data.stock));  // Convert number to string
            formData.append('keywords', String(keywordsArray));  // Convert array to JSON string
    
            if (productImage) {
                formData.append('image', productImage);
            }
    
            const response = await axiosInstance.post(
                `/api/update-product-details?productId=${productId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
    
            console.log('Success:', response.data);
            // router.replace('/seller'); // Redirect after success
            router.refresh()
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

    const handleUpdateProductImage = async () => {
        if (!productImage) return;  // Check if an image is selected
    
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('imageUrl', productImage);  // Adjust the key if necessary
    
            const response = await axiosInstance.post(`/api/update-product-image?productId=${productId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if (!response) {
                console.log("No response from server");
            }
            setProductImage(null)
            console.log("Image updated successfully");
        } catch (error) {
            console.error("Error while updating product image", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    

    if (loading) return <p>Loading...</p>;
    if (!product) return <p>No product data available</p>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex justify-center mt-10">
                <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        Edit Product
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
                                            <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-100 text-blue-600 rounded-lg shadow-md tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-600 hover:text-white transition duration-200 ease-in-out">
                                                <ImagePlus className="w-8 h-8 mb-2" />
                                                <span className="text-sm leading-normal">
                                                    Change Image
                                                </span>
                                               
                                                <Input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                            <div className="mt-4">
                                                <Image
                                                    src={imagePreview || product.imageUrl}
                                                    alt="Image Preview"
                                                    className="w-50 h-50 object-cover rounded-md"
                                                />
                                            </div>
                                            {productImage && (
                                                <Button
                                                    className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition duration-200"
                                                    onClick={handleUpdateProductImage}
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? (
                                                        <Loader2 className="animate-spin" />
                                                    ) : (
                                                        'Update Image'
                                                    )}
                                                </Button>
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
                                                // step="0.01"
                                                type="number"
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
                                            >
                                                <option value="" disabled>
                                                    Select a category
                                                </option>
                                                <option value="mobiles and tablets">Mobiles and Tablets</option>
                                                <option value="tv and appliances">TV and Appliances</option>
                                                <option value="electronics">Electronics</option>
                                                <option value="fashion">Fashion</option>
                                                <option value="beauty">Beauty</option>
                                                <option value="home and kitchen">Home and Kitchen</option>
                                                <option value="furniture">Furniture</option>
                                                <option value="travel">Travel</option>
                                                <option value="grocery">Grocery</option>
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
                                                type='number'
                                                {...field}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                name="keywords"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Keywords</FormLabel>
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
                                    'Update Product'
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default Page;

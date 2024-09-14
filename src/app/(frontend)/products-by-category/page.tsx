'use client'

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import axiosInstance from '../services/api';
import Navbar from '@/components/navbar/Navbar';
import debounce from 'lodash/debounce';
import { useDebounceCallback } from 'usehooks-ts' 
import Image from 'next/image';

interface Product {
    name: string;
    price: number;
    imageUrl: string;
    description: string;
    category: string;
    _id: string;
}

const Page = () => {
    const searchParams = useSearchParams();
    const category = searchParams.get('category')?.toLowerCase();
    const [maxPrice, setMaxPrice] = useState(50000);
    const [sortOrder, setSortOrder] = useState('popularity');
    const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
    const [showToastMessage, setShowToastMessage] = useState(false);
    const [maxPricerangeValue,setMaxPricerangeValue] =  useState(0);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [rangeMinPrice,setRangeMinPrice] = useState(0)
    const [rangeMaxPrice,setRangeMaxPrice] = useState(0)

    const fetchProductbySortOrder = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/api/sort-products`, {
                params: {
                    maxPrice,
                    sortOrder,
                    category,
                },
            });

            if (response && response.data) {
                console.log("response", response)

                setSortedProducts(response.data.data);

                //set minpricerange and maxprice range  according to category
               if(response.data.data[0].category === 'mobiles and tablets'){
                setRangeMaxPrice(200000)
                setRangeMinPrice(5000)

               }else if(response.data.data[0].category === 'tv and appliances'){
                setRangeMaxPrice(250000)
                setRangeMinPrice(5000)

               } else if(response.data.data[0].category === 'fashion'){
                setRangeMaxPrice(5000)
                setRangeMinPrice(300)
               }


                if (showToastMessage) {
                    toast({ description: "Changes applied" });
                }
            }

            

           

            
        } catch (error) {
            console.error("Error fetching products:", error);
            toast({ description: "Error while getting products" });
        } finally {
            setLoading(false);
        }
    };
    
    const handlePriceChange = (value:number) => {
        setMaxPrice(Number(value));
    };

    const debounced = useDebounceCallback(setMaxPrice,300)
    
    useEffect(() => {
        fetchProductbySortOrder()
    }, [ maxPrice,sortOrder, category]);


    const handleCardClick = (productId: string) => {
        router.replace(`/get-product?productId=${encodeURIComponent(productId)}`);
    };


    return (<><Navbar />
        <div className="flex gap-6 p-6 h-screen">

            <aside className="w-1/4 bg-white p-4 rounded-lg shadow-md">
                <div className="mb-6">
                    <h3 className="font-semibold mb-4">PRICE</h3>
                    <div className="ml-2">
                        <input type="range" min={rangeMinPrice} max={rangeMaxPrice}
                            className="w-full"
                            onChange={(event) => {
                                const value = event.target.value;
                                debounced(() => handlePriceChange(value));
                                setMaxPricerangeValue(value);
                            }}
                            
                        />
                        <div className="flex justify-between mt-2">
                            <span>Mix</span>
                            <span>$: {maxPricerangeValue} </span>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="font-semibold mb-4">SORT BY</h3>
                    <div className="ml-2">
                        <ul>
                            <li className="mb-2">
                                <input type="radio" name="sort" className="mr-2" onClick={() => setSortOrder('popularity')} />
                                <span>Popularity</span>
                            </li>
                            <li className="mb-2">
                                <input type="radio" name="sort" className="mr-2" onClick={() => setSortOrder('priceLowToHigh')} />
                                <span>Price -- Low to High</span>
                            </li>
                            <li className="mb-2">
                                <input type="radio" name="sort" className="mr-2" onClick={() => setSortOrder('priceHighToLow')} />
                                <span>Price -- High to Low</span>
                            </li>
                            <li className="mb-2">
                                <input type="radio" name="sort" className="mr-2" onClick={() => setSortOrder('newestFirst')} />
                                <span>Newest First</span>
                            </li>

                        </ul>
                    </div>
                </div>

                
            </aside>

            {/* {loading &&  <h2 className='font-bold m-3 p-2 background-black'>Loading ... </h2> } */}
            {!sortedProducts &&  <h2 className='font-bold m-3 p-2 background-black'>No Products found </h2> }


            {sortedProducts && <main className="w-3/4 overflow-y-scroll hide-scrollbar">
                <div>
                    <h2 className='font-bold m-3 p-2 background-black'>{category} </h2>
                    <div className="flex flex-wrap gap-4 ">
                        {sortedProducts?.map(product => (

                            <div
                                key={product._id}
                                className="w-48 border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white"
                                onClick={() => handleCardClick(product._id)}
                            >
                                <div className="w-full h-48 flex items-center justify-center bg-gray-100 overflow-hidden">
                                    <Image src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="p-4 text-center">
                                    <h3 className="text-m  mb-2">{product.name.length > 20 ? product.name.slice(0, 18)  : product.name}</h3>
                                    <p className="text-green-600 text-sm">From ₹{product.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>}
        </div>
    </>
    )
}

export default Page

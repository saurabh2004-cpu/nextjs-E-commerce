'use client';
import React, { useEffect, useState } from 'react';
import { Trash } from 'lucide-react';
import axiosInstance from '@/app/(frontend)/services/api';
import { useRouter } from 'next/navigation';
import 'nprogress/nprogress.css';
import NProgress from 'nprogress';
import { useSession } from 'next-auth/react';
import Image from 'next/image';



interface Product {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    isAvailable: boolean;
    totalReviews: number;
    averageRating: number;
}

interface WishlistItem {
    product: Product;
}



const ListWishlist = () => {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]); // Set the wishlist type
    const session =useSession()
    // const user =session.user

    const router = useRouter();

    useEffect(() => {
        const fetchWishlist = async () => {
            NProgress.start();
            try {
                const response = await axiosInstance.get('/api/get-wishlist');
                if (!response) {
                    console.error("No response from the wishlist API");
                    return;
                }

                // Assuming the response data contains an array of wishlist items
                setWishlist(response.data.data.items); // Set the wishlist state

            } catch (error:any) {
                console.error("Error fetching wishlist:", error.message);
            } finally {
                NProgress.done();
            }
        };

        fetchWishlist();
    }, []);

    const handleRemoveFromWishlist = async (productId: string) => {
        setWishlist(prevWishlist => prevWishlist.filter(item => item.product._id !== productId));
        try {
            NProgress.start();
            const response = await axiosInstance.post('/api/remove-from-wishlist', { productId });
            if (response.status === 200) {
                // Update local state after removing the item
                console.log("Product removed successfully");
            } else {
                console.error("Unexpected response while removing product from wishlist", response);
            }
        } catch (error) {
            console.error("Error removing product from wishlist:", error);
        } finally {
            NProgress.done();
        }
    };

    const handleCardClick = (productId: string) => {
        router.replace(`/get-product?productId=${encodeURIComponent(productId)}`);
    };

    // If wishlist is empty, return a message
    if (!wishlist || wishlist.length === 0) return <p className="text-gray-500">Your wishlist is empty.</p>;

    return (
        <div className="p-4 w-full">
            <h1 className="text-xl font-bold mb-4">My Wishlist ({wishlist.length})</h1>
            <ul className="space-y-4">
                {wishlist.map((product) => (
                    <li
                        key={product.product._id}
                        className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white"
                    >
                        <div className="flex items-center space-x-4" onClick={() => handleCardClick(product.product._id)}>
                            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-md">
                                <Image
                                    src={product.product.imageUrl}
                                    alt={product.product.name}
                                    width={100}
                                    height={100}
                                    className="w-full h-full object-cover rounded-md"
                                />
                            </div>
                            <div>
                                <h2 className="font-medium text-lg">{product.product.name}</h2>
                                <p className="text-sm text-gray-500">
                                    Rating: {product.product.averageRating} ({product.product.totalReviews} reviews)
                                </p>
                                <p className="text-sm text-gray-500">
                                    Price: ₹{product.product.price}
                                </p>
                                <p className={`text-sm ${product.product.isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                                    {product.product.isAvailable ? 'Available' : 'Currently unavailable'}
                                </p>
                            </div>
                        </div>
                        <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveFromWishlist(product.product._id)}
                        >
                            <Trash className="w-5 h-5" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListWishlist;

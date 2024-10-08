'use client'
import '../utility.css'
import axiosInstance from '@/app/(frontend)/services/api';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import 'nprogress/nprogress.css';
import NProgress from 'nprogress';
import { Heart, Loader2 } from 'lucide-react';
import Navbar from '../navbar/Navbar';
import PostReviewAndRatings from './PostReviewAndRatings';
import ListAllReviews from './ListAllReviews';
import { toast } from '../ui/use-toast';
import Image from 'next/image';

interface Product {
    imageUrl: string;
    name: string;
    price: number;
    totalReviews: number;
    description: string;
    [key: string]: any;
}

interface WishlistItem {
    product: {
        _id: string;
        [key: string]: any;
    };

}

const GetProductPage = () => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddedToWishList, setIsAddedToWishList] = useState(false);
    const router = useRouter()


    // const wishlistItems = useSelector((state) => state.wishlist.items);
    // console.log("wishlist", wishlistItems);

    const searchParams = useSearchParams();
    const productId = searchParams.get('productId');

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) {
                setError("Product ID is missing");
                setLoading(false);
                return;
            }

            try {
                NProgress.start();
                const response = await axiosInstance.get(`/api/get-product?productId=${productId}`);
                if (response.data && response.data.data) {
                    setProduct(response.data.data);
                    console.log("product",response.data.data)
                } else {
                    setError("No product data found");
                }
            } catch (error) {
                setError("Error while fetching product");
            } finally {
                setLoading(false);
                NProgress.done();
            }
        };

        const fetchWishlist = async () => {
            try {
                const response = await axiosInstance.get('/api/get-wishlist');
                if (!response) {
                    console.error("No response from the wishlist API");
                    return;
                }

                const wishlistItems: WishlistItem[] = response.data.data.items;
                const isProductInWishlist = wishlistItems.some(item => item.product._id === productId);

                console.log(response.data.data);

                setIsAddedToWishList(isProductInWishlist);
            } catch (error) {
                console.log("wishlist is empty");
            }
        };

        if (productId) {
            fetchProduct();
            fetchWishlist();
        }
    }, [productId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!product) return <p>No product data available</p>;

    const discountAmount = product?.price * 0.25;
    const newPrice = product?.price + discountAmount;

    const handleHaertclick = async () => {
        try {
            if (isAddedToWishList) {
                const response = await axiosInstance.post('/api/remove-from-wishlist', { productId });
                if (response.status === 200) {
                    console.log("Product removed successfully", response.data.data);
                    setIsAddedToWishList(false);
                    // fetchWishlist();
                } else {
                    console.error("Unexpected response while removing product from wishlist", response);
                }
            } else {
                const response = await axiosInstance.post('/api/add-to-wishlist', { productId });
                if (response.status === 200 || response.status === 201) {
                    console.log(response.data.message);
                    setIsAddedToWishList(true);
                    // fetchWishlist();
                } else {
                    console.error("Unexpected response while adding product to wishlist", response);
                }
            }
        } catch (error) {
            console.error("Error while updating wishlist", error);
        }
    };

    const handleAddToCart = async () => {
        setLoading(true)
        try {
            const response = await axiosInstance.post('/api/add-to-cart', { productId, quantity: 1 })

            if (!response) {
                console.log("no response ")
            }

            console.log("cart", response)
            toast({ description: "Product added to cart successfully" });
        } catch (error) {
            console.error("errior while adding the product in cart", error)
            toast({ description: "Error: Could not add to cart", variant: "destructive" });
        } finally {
            setLoading(false)
        }
    }

    const handleBuyProduct = async (quantity: number) => {

        console.log("clicked")
        try {
            const response = await axiosInstance.post('/api/create-order', { productId, quantity })

            if (!response) {
                console.log("no response from api")
            }
            console.log("buyed", response.data.data)

            router.replace('/orders')



        } catch (error) {
            console.error("error while buying the product")
            toast({ description: "Error: Could not buy the product", variant: "destructive" });
        }
    }

    return (
        <>
            <Navbar />
            <div className="flex flex-col md:flex-row gap-6 p-4 bg-white">
                {/* Left Side: Image and Main Actions */}
                <div className="md:w-1/3 flex flex-col items-center relative sticky top-4">
                    <div
                        className="absolute top-2 right-2 cursor-pointer text-red-500 hover:text-red-600"
                        onClick={handleHaertclick}
                    >
                        <Heart className="h-7 w-7" fill={isAddedToWishList ? 'currentColor' : 'none'} />
                    </div>
                    <Image src={product.imageUrl}
                        alt={product.name}
                        width={100}
                        height={100}
                        className="w-full h-auto object-contain" />
                    <div className="flex mt-4 gap-2">
                        <button className="bg-yellow-500 text-white py-2 px-4 rounded" onClick={handleAddToCart}>
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                "Add To Cart"
                            )}
                        </button>
                        <button
                            className="bg-orange-500 text-white py-2 px-4 rounded"
                            onClick={() => handleBuyProduct(1)}
                        >Buy Now</button>
                    </div>
                </div>

                {/* Right Side: Product Details */}
                <div className="md:w-2/3 flex flex-col overflow-y-auto max-h-screen hide-scrollbar">
                    <h1 className="text-2xl font-bold">{product.name}</h1>
                    <div className="text-xl text-green-600 font-bold mt-2">
                        ₹{product.price} <span className="line-through text-gray-500 ml-2">{newPrice}</span> <span className="text-red-500">(25% off)</span>
                    </div>
                    <p className="text-gray-600 mt-2">{product.totalReviews} Ratings & {product.totalReviews} Reviews</p>

                    {/* Available Offers */}
                    <div className="mt-4">
                        <h3 className="font-bold text-lg">Available Offers</h3>
                        <ul className="list-disc ml-4 text-gray-700">
                            <li>5% Cashback on Flipkart Axis Bank Card T&C</li>
                            <li>Extra ₹2000 off</li>
                            <li>Bank Offer 5% off on ICICI Bank Credit Card Transactions</li>
                        </ul>
                    </div>

                    {/* Variants: Color, RAM, Storage */}
                    <div className="mt-4">
                        <div className="flex items-center gap-4">
                            <div>
                                <span className="font-bold">Color:</span>
                                <span className="ml-2">Power Black</span>
                            </div>
                            <div>
                                <span className="font-bold">RAM:</span>
                                <span className="ml-2">4 GB</span>
                            </div>
                            <div>
                                <span className="font-bold">Storage:</span>
                                <span className="ml-2">128 GB</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Options */}
                    <div className="mt-4">
                        <h3 className="font-bold text-lg">Delivery</h3>
                        <input type="text" placeholder="Enter Delivery Pincode" className="border rounded p-2 mt-2" />
                        <p className="mt-2 text-gray-700">Delivery by 14 Aug, Wednesday | Free ₹40</p>
                    </div>

                    {/* Highlights */}
                    <div className="mt-4">
                        <h3 className="font-bold text-lg">Highlights</h3>
                        <ul className="list-disc ml-4 text-gray-700">
                            <li>{product.description}</li>
                            <li>5000 mAh Battery</li>
                        </ul>
                    </div>

                    {/* Seller Information */}
                    <div className="mt-4">
                        <h3 className="font-bold text-lg">Seller</h3>
                        <p className="text-gray-700">{}</p>
                        <p className="text-gray-600">7 Days Service Center Replacement/Repair</p>
                    </div>

                    {/* Product Description */}
                    <div className="mt-4">
                        <h3 className="font-bold text-lg">Product Description</h3>
                        <p className="text-gray-700">{product.description}</p>
                        <a href="#view-more" className="text-blue-600">View all features</a>
                    </div>
                    <PostReviewAndRatings productId={productId || ""} />
                    <ListAllReviews productId={productId || ""} averageRating={product.averageRating} totalReviews={product.totalReviews} />
                </div>
            </div>
        </>
    );
};

export default GetProductPage;

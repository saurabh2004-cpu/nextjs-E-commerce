'use client';
import SellerNavBar from '@/components/comps/SellerNavbar';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/api';
import SellerFooter from '@/components/footer/SellerFooter';
import { useRouter } from 'next/navigation';
import 'nprogress/nprogress.css';
import NProgress from 'nprogress';
import Image from 'next/image';

interface UserData {
    _id: string;
    username: string;
    email: string;
    fullname: string;
    gender: string;
    phone: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    verifyCode: string;
    verifyCodeExpiry: string;
    profilePicture?: string;
}

interface ProductData {
    _id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    category: string;
    isAvailable: boolean;
    stock: number;
    createdAt: string;
    updatedAt: string;
    productOwner: string;
    averageRating: string
}

const SellerProfile = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setloading] = useState(false)
    const userId = userData?._id;
    const [productsData, setProductsData] = useState<ProductData[]>([]);
    const [featuredproductsData, setFeaturedProductsData] = useState<ProductData[]>([]);
    const router = useRouter()

    

    
    const lastSixProducts = productsData.slice(-6);

    
   

    useEffect(() => {
        const fetchCurrentUserDetails = async () => {
            NProgress.start();
            try {
                const response = await axiosInstance.get('http://localhost:3000/api/current-user');
                if (response) {
                    console.log("Current user", response.data.data);
                    setUserData(response.data.data);
                } else {
                    console.log("Error while fetching current user");
                }
            } catch (error) {
                console.error("erroe while fetching sellers profile")
                NProgress.done();
            }
        };

        fetchCurrentUserDetails();
    }, [userId]);


    useEffect(() => {
        const fetchProducts = async () => {
            // console.log(userData?._id)
            NProgress.start();
            setloading(true)
            try {
                const response = await axiosInstance.get(`http://localhost:3000/api/get-sellers-products?userId=${userData?._id}`);
                if (response) {
                    setProductsData(response.data.data);
                }
            } catch (error) {
                console.log("Error while fetching user's products", error);
            } finally {
                setloading(false)
                NProgress.done();
            }
        };
        if (userId) {
            fetchProducts();
        }
    }, [userData?._id,userId]);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            setloading(true)
            try {
                const response = await axiosInstance.get(`http://localhost:3000/api/sellers-featured-products?userId=${userId}`);
                if (response) {
                    console.log("featured Products", response);
                    setFeaturedProductsData(response.data.data);
                }
            } catch (error) {
                console.log("Error while fetching user's featured products", error);
            } finally {
                setloading(false)
                NProgress.done();
            }
        };

        if (userId) {
            fetchFeaturedProducts();
        }
    }, [userId]);


    // Function to render the user avatar
    const renderUserAvatar = () => {
        if (userData?.profilePicture) {
            return (
                <Image
                    src={userData.profilePicture}
                    alt="Seller Profile"
                    width={24}
                    height={24}
                    className="w-24 h-24 rounded-full object-cover mr-6"
                />
            );
        } else if (userData?.username) {
            const initial = userData.username.charAt(0).toUpperCase();
            const backgroundColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#33FFA1', '#A133FF', '#FFA133'];
            const backgroundColor = backgroundColors[userData.username.charCodeAt(0) % backgroundColors.length];

            return (
                <div
                    style={{
                        backgroundColor: backgroundColor,
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        width: '96px',
                        height: '96px',
                        fontSize: '36px',
                        fontWeight: 'bold',
                        marginRight: '24px'
                    }}
                >
                    {initial}
                </div>
            );
        } else {
            return null;
        }
    };

    const handleCardClick = (productId: any) => {
        router.replace(`/get-product?productId=${encodeURIComponent(productId)}`);
    };





    return (
        <>
            <SellerNavBar display={'hidden'} />




            <div className="min-h-screen bg-gray-100 py-10">
                <div className="container mx-auto px-4">
                    {/* Seller's Profile Section */}
                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                        <div className="flex items-center">
                            {renderUserAvatar()}
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{userData?.username}</h1>
                                <div className="flex items-center mb-2">
                                    <span className="text-yellow-500">★★★★★</span>
                                    <span className="ml-2">(4.5)</span>
                                </div>
                                <p className="text-gray-600 mb-4">
                                    Brief overview of the seller&apos;s business, mission, and values.
                                </p>
                                <div className="flex items-center space-x-4 mb-4">
                                    <a href={`mailto:${userData?.email}`} className="text-blue-500 hover:underline">
                                        Contact Seller
                                    </a>
                                    <a href="#" className="text-blue-500 hover:underline">
                                        Follow
                                    </a>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <a href="#" className="text-blue-500 hover:underline">
                                        Facebook
                                    </a>
                                    <a href="#" className="text-blue-500 hover:underline">
                                        Twitter
                                    </a>
                                    <a href="#" className="text-blue-500 hover:underline">
                                        Instagram
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 text-gray-700">
                            <p><strong>Location:</strong> Seller&apos;s Location</p>
                            <p><strong>Business Registration:</strong> Business Registration Details</p>
                            <p><strong>Years in Business:</strong> X years</p>
                        </div>
                    </div>

                    {/* Seller's Products Section */}

                    {loading && <div className="flex flex-wrap gap-4 justify-center">
                        {Array(7)
                            .fill('')
                            .map((_, index) => (
                                <div key={index} className="w-48 border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white animate-pulse">
                                    <div className="w-full h-48 bg-gray-300"></div>
                                    <div className="p-4 text-center">
                                        <div className="h-4 bg-gray-300 mb-2"></div>
                                        <div className="h-4 bg-gray-300 w-1/2 mx-auto"></div>
                                    </div>
                                </div>
                            ))}
                    </div>}

                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">Seller&apos;s Products</h2>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Search Products"
                                    className="px-4 py-2 border rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 ">
                            {lastSixProducts.map((product, index) => (
                                <div
                                    key={product._id}
                                    className="w-48 border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white"
                                    onClick={() => handleCardClick(product._id)}
                                >
                                    <Image
                                        src={product.imageUrl || '/product.jpg'}
                                        alt={product.name}
                                        width={100}
                                        height={48}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4 text-center">
                                        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                                        <p className="text-gray-700 mb-2">${product.price}</p>

                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 text-right">
                            <a
                                href="/sellerProductsList"  // Update this URL to the correct route for all products
                                className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                See All Products
                            </a>
                        </div>
                    </div>

                    {/* Featured Products Section */}
                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">Featured Products</h2>

                        </div>
                        <div className="flex flex-wrap gap-4 ">
                            {featuredproductsData.map((product, index) => (
                                <div
                                    key={product._id}
                                    className="w-48 border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white"
                                    onClick={() => handleCardClick(product._id)}
                                >
                                    <Image
                                        src={product.imageUrl || '/product.jpg'}
                                        alt={product.name}
                                        width={100}
                                        height={48}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4 text-center">
                                        <h3 className="text-m mb-2">{product.name.length > 20 ? product.name.slice(0, 18)  : product.name}</h3>
                                        <p className="text-gray-700 mb-2">${product.price}</p>
                                        {product.averageRating > '0' &&<p className="text-gray-700 mb-2">Rating: {product?.averageRating}</p>}
                                        
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <SellerFooter />
        </>
    );
};

export default SellerProfile;

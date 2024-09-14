'use client'
import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/api';
import { useSession } from 'next-auth/react';
import SellerNavBar from '@/components/comps/SellerNavbar';
import SellerFooter from '@/components/footer/SellerFooter';
import { useRouter } from 'next/navigation';
import { MoreVertical } from 'lucide-react';
import ConfirmRemoveCard from '@/components/comps/ConfirmRemoveCard';
import 'nprogress/nprogress.css';
import NProgress from 'nprogress';
import EmptyProductCards from '@/components/comps/EmptyProductCards';

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
}

const Page = () => {
    const [productsData, setProductsData] = useState<ProductData[]>([]);
    const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
    const [showConfirmRemoveCard, setShowConfirmRemoveCard] = useState<boolean>(false);
    const [productToRemove, setProductToRemove] = useState<string | null>(null);
    const { data: session } = useSession();
    const userId = session?.user.id;
    const router = useRouter();
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [loading, setLoading] = useState(false)
    const [isSellerHaveProducts,setisSellerHaveProducts] = useState(false)
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        NProgress.start();
        try {
            const response = await axiosInstance.get(`/api/get-sellers-products?userId=${userId}`);

            if (response.data.statusCode === 404 || response.data.data.length === 0) {
                setError("You don't have any products to sell.");
                setProductsData([]);  // Ensure productsData is empty
            } else {
                setProductsData(response.data.data);
            }
        } catch (error) {
            setError("Error while fetching your products. Please try again later.");
            console.log("Error while fetching user's products", error);
        } finally {
            setLoading(false);
            NProgress.done();
        }
    };
    useEffect(() => {

        if (userId) {
            fetchProducts();
        }
    }, [userId]);

    const handleCardClick = (productId: string) => {
        router.replace(`/get-product?productId=${encodeURIComponent(productId)}`);
    };

    const handleUpdateClick = (productId: string) => {
        router.replace(`/update-product?productId=${encodeURIComponent(productId)}`);
    };

    const handleRemoveClick = (productId: string) => {
        setProductToRemove(productId);
        setShowConfirmRemoveCard(true);
    };

    const confirmRemove = async () => {
        if (!productToRemove) {
            console.error("product id is missing")
        }
        try {
            await axiosInstance.post(`/api/delete-product?productId=${productToRemove}`);
            // await fetchProducts(); // Refresh the product list after deletion
            setProductsData((prevProducts) => prevProducts.filter((product) => product._id !== productToRemove));
            setShowConfirmRemoveCard(false); // Hide confirmation card
            setProductToRemove(null); // Clear the product to remove
            router.refresh()

        } catch (error) {
            console.log("Error while deleting product", error);
        }

    };

    const cancelRemove = () => {
        setShowConfirmRemoveCard(false);
        setProductToRemove(null);
    };

    const toggleDropdown = (productId: string) => {
        setActiveDropdown(activeDropdown === productId ? null : productId);
    };

    const handleMouseEnter = (productId: string) => {
        setHoveredProductId(productId);
    };

    const handleMouseLeave = () => {
        setHoveredProductId(null);
        setActiveDropdown(null);
    };

    if (loading) return <EmptyProductCards />;
    if (error) return <p className="text-center text-lg font-semibold text-gray-600">{error}</p>;

    return (
        <>
            <SellerNavBar display={'hidden'} />
            <div className="bg-white shadow rounded-lg p-6 mb-6">
                {loading && <EmptyProductCards />}
                <div className="flex justify-between items-center mb-4">


                    <div>
                        <input
                            type="text"
                            placeholder="Search Products"
                            className="px-4 py-2 border rounded-lg"
                        />
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 ">
                    {productsData.map((product) => (
                        <div
                            key={product._id}
                            className="relative w-48 border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white"
                            onMouseEnter={() => handleMouseEnter(product._id)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <img
                                src={product.imageUrl || '/product.jpg'}
                                alt={product.name}
                                className="w-full h-48 object-cover"
                                onClick={() => handleCardClick(product._id)}
                            />
                            <div className="p-4 text-center">
                                <h3 className="text-m mb-2">{product.name.length > 20 ? product.name.slice(0, 18)  : product.name}</h3>
                                <p className="text-gray-700 mb-2">${product.price}</p>
                            </div>

                            {/* Three dots icon - Click to show dropdown */}
                            <div className="absolute top-2 right-2">
                                {hoveredProductId === product._id && (
                                    <MoreVertical
                                        className="text-gray-600 cursor-pointer"
                                        onClick={() => toggleDropdown(product._id)}
                                    />
                                )}
                                {activeDropdown === product._id && (
                                    <div className="bg-white border border-gray-200 rounded shadow-lg mt-2 absolute right-0 z-10">
                                        <button
                                            onClick={() => handleUpdateClick(product._id)}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                            Update Details
                                        </button>
                                        <button
                                            onClick={() => handleRemoveClick(product._id)}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {showConfirmRemoveCard && (
                <ConfirmRemoveCard
                    onConfirm={confirmRemove}
                    onCancel={cancelRemove}
                    message="Are you sure you want to remove this product?"
                />
            )}
            <SellerFooter />
        </>
    );
}

export default Page;

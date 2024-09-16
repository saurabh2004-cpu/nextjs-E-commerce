'use client'
import { toast } from '@/components/ui/use-toast'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import axiosInstance from '../services/api';
import Navbar from '@/components/navbar/Navbar';
import Image from 'next/image';

interface Order {
    _id: string;
    status: string;
    total: number;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
}
interface Product {
    name: string;
    price: number;
    imageUrl: string;
    description: string;
    _id: string;
}

interface OrderItem {
    _id: string;
    quantity: number;
    product: Product;
}

const OrderDetailsPage = () => {
    const searchParams = useSearchParams()
    const orderId = searchParams.get('orderId')
    const [loading, setLoading] = useState(true);
    const [orderDetails, setOrderDetails] = useState<Order>()

    

    useEffect(() => {

        const fetchOrder = async () => {
            setLoading(true)
            try {
                const response = await axiosInstance.get(`/api/get-order-details?orderId=${orderId}`)
                setOrderDetails(response.data.data)
            } catch (error) {
                console.error("Error fetching order details ", error)
                toast({ description: "Error: Getting order details please try again", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        }

        fetchOrder()
    }, [orderId])

    if (loading) {
        return <p>Loading...</p>
    }

    if (!orderDetails) {
        return <p>No order details available.</p>
    }

    const { items, status, total, updatedAt } = orderDetails;
    const deliveryDate = new Date(updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    return (<><Navbar/>
        <div className="m-4 container mx-auto p-6 bg-gray-100">
            {/* Delivery Address, Rewards, and More Actions Section */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>
                    <p>Saurabh Bodakhe</p>
                    <p>Puntamba Rahta Subdistrict, Ahmadnagar District - 413707, Maharashtra</p>
                    <p>Phone number: 8010566607</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Your Rewards</h3>
                    <p>6 SuperCoins Cashback</p>
                    <p className="text-gray-500">Use it to save on your next order</p>
                </div>
                
            </div>

            {/* Order Timeline and Product Section */}
            <div className="bg-white p-4 rounded-md shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <div className="flex items-center mr-4">
                            <div className={`w-3 h-3 rounded-full ${status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'} mr-2`}></div>
                            <span className="font-semibold">{status === 'pending' ? 'Order Confirmed' : 'Delivered'}</span>
                        </div>
                        {status !== 'pending' && (
                            <p className="text-gray-500 text-sm">Your item has been delivered</p>
                        )}
                        {status === 'pending' &&
                        <p className="text-yellow-500 text-sm">Your item will be delivered soon </p>
                        }
                    </div>
                    <p>{deliveryDate}</p>
                </div>

                {items.map((item) => (
                    <div key={item._id} className="flex items-center mb-4">
                        <Image src={item.product.imageUrl} alt={item.product.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                            <p className="text-gray-500 text-sm">{item.product.description}</p>
                            <p className="font-semibold text-gray-800 mt-2">₹{item.product.price}</p>
                        </div>
                    </div>
                ))}

                <div className="flex justify-between items-center mt-6">
                    <div className="flex space-x-4">
                        <button className="text-blue-600">
                            Rate & Review Product
                        </button>
                        <button className="text-blue-600">
                            Chat with us
                        </button>
                    </div>
                    <p className="font-semibold">Total: ₹{total}</p>
                </div>
            </div>
        </div>
    </>
    )
}

export default OrderDetailsPage

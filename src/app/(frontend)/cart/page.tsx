'use client'
import '../userProfile/utilty.css'
import Navbar from '@/components/navbar/Navbar'
import React, { useEffect, useState } from 'react'
import axiosInstance from '../services/api'
import { toast } from '@/components/ui/use-toast'
import EmptyCartCard from '@/components/comps/EmptyCartCard'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import 'nprogress/nprogress.css';
import NProgress from 'nprogress';
import Image from 'next/image'

interface Product {
    name: string;
    price: number;
    imageUrl: string;
    description: string;
    _id: string;
}

interface CartItem {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
    description: string;
    product: Product;
}

const Page = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [showEmptyCartCard, setShowEmptyCartCard] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const fetchCartItems = async () => {
        NProgress.start();
        try {
            const response = await axiosInstance.get('/api/get-cart-items')

            if (!response) {
                setShowEmptyCartCard(true)
            }else if(response.status === null){
                setShowEmptyCartCard(true)
            }

            setCartItems(response.data.data.items)
        } catch (error) {
            setShowEmptyCartCard(true)
            console.log(error)
        }finally{
            NProgress.done();
        }
    }

    useEffect(() => {
        fetchCartItems()
    }, [])

    const handleCardClick = (productId: string) => {
        router.replace(`/get-product?productId=${encodeURIComponent(productId)}`);
    };

    const handleRemoveFromCart = async (productId: string) => {
        try {
            const response = await axiosInstance.post('/api/remove-from-cart', { productId })

            if (!response) {
                console.log("no response from api")
            }

            setCartItems((prevItems) => prevItems.filter((item) => item.product._id !== productId));
            router.refresh()

            if(cartItems.length === 1)
            {
               setShowEmptyCartCard(true) 
            }
            
            router.refresh()
            toast({ description: "Item removed from cart" })
        } catch (error) {
            toast({ description: "Error: Could not remove item from cart ", variant: "destructive" });
            console.log("err", error)
        } 
    }

    const handleRemoveAllFromCart = async () => {
        setLoading(true)
        try {
            const response = await axiosInstance.post('/api/clear-cart')

            if (!response) {
                console.log("no response from api")
            }

            setCartItems([]); // Clear the cart items from the state
            toast({ description: "All items removed from cart" })
            setShowEmptyCartCard(true)
            router.refresh()
        } catch (error) {
            toast({ description: "Error: Could not remove all items from cart ", variant: "destructive" });
            console.log("err", error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateQuantity = async (productId: string, quantityChange: number) => {
        setLoading(true)
        try {
            const response = await axiosInstance.patch(`/api/update-quentity?productId=${productId}`, { quantityChange })

            if (!response) {
                console.log("no response from api")
            }

            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.product._id === productId
                        ? { ...item, quantity: item.quantity + quantityChange }
                        : item
                )
            );
            toast({ description: "Quantity updated" });

        } catch (error) {
            console.error("err: while updating the product quantity")
            toast({ description: "Error: Could not update the quantity of item from cart ", variant: "destructive" });
        } finally {
            setLoading(false)
        }
    }

    const handlePlaceAllItemsOrder = async()=>{
        setLoading(true)
        try {
            const response  = await axiosInstance.post('/api/place-all-orders')

            if(!response){
                console.log("no response from api")
            }

            toast({ description: "Your order is placed" })
            console.log(response.data.data)
        } catch (error) {
            console.error("error while placing all items order from cart")
            toast({ description: "Error: Cant place orders try again ", variant: "destructive" });
        }finally {
            setLoading(false)
        }
    }

    if (showEmptyCartCard) return (<EmptyCartCard />)

    const totalPrice = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
    const totalDiscount = cartItems.reduce((acc, item) => acc + item.product.price * 0.25 * item.quantity, 0)
    const finalAmount = totalPrice - totalDiscount + 3

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4 md:p-8 flex flex-col md:flex-row">
                <div className="flex-1 md:flex-none md:w-2/3 h-[calc(100vh-10rem)] overflow-auto hide-scrollbar m-4">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4 w-full md:w-auto">Shopping Cart</h1>
                    {cartItems.map(item => (
                        <div key={item._id} className="flex flex-col md:flex-row border-b border-gray-200 py-4">
                            {/* Image */}
                            <Image
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                className="w-full md:w-1/5 h-auto object-contain mb-4 md:mb-0"
                                onClick={() => handleCardClick(item.product._id)}
                            />
                            {/* Product Details */}
                            <div className="flex-1 md:ml-4">
                                <h2 className="text-lg font-semibold text-gray-800">{item.product.name}</h2>
                                {/* <p className="text-gray-500 text-sm mt-2">{item.product.description}</p> */}
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-red-500 line-through">₹{item.product.price} </span>
                                    <span className="text-gray-800 font-semibold">₹{item.product.price - item.product.price * 0.25}</span>
                                </div>
                                <div className="flex items-center mt-2">
                                    <button 
                                        className="px-2 py-1 border border-gray-300 rounded"
                                        onClick={() => handleUpdateQuantity(item.product._id, -1)}
                                        disabled={loading || item.quantity <= 1} // Disable when loading or if quantity is 1
                                    >
                                        -
                                    </button>
                                    <span className="mx-2">{item.quantity}</span>
                                    <button 
                                        className="px-2 py-1 border border-gray-300 rounded"
                                        onClick={() => handleUpdateQuantity(item.product._id, 1)}
                                        disabled={loading} // Disable when loading
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="flex items-center mt-4">
                                    <button 
                                        className="text-blue-600 mr-4"
                                        disabled={loading} // Disable when loading
                                    >
                                        SAVE FOR LATER
                                    </button>
                                    <button 
                                        className="text-red-600"
                                        onClick={() => handleRemoveFromCart(item.product._id)}
                                        disabled={loading} // Disable when loading
                                    >
                                        REMOVE
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Remove All Items Button */}
                    {cartItems.length != 0 && <div className="flex justify-end mt-4">
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded"
                            onClick={handleRemoveAllFromCart}
                            disabled={loading || cartItems.length === 0} // Disable when loading or if cart is empty
                        >
                           {loading ? <Loader2/> : ' REMOVE ALL ITEMS'}
                        </button>
                    </div>}
                </div>
                {/* Price Summary */}
                <div className="bg-gray-100 p-4 rounded-lg md:w-1/3 sticky top-20 self-start">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Price Details</h2>
                    <div className="flex justify-between text-gray-600 mb-2">
                        <span>Price ({cartItems.length} items)</span>
                        <span>₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 mb-2">
                        <span>Discount</span>
                        <span className="text-green-500">₹{totalDiscount}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 mb-2">
                        <span>Platform Fee</span>
                        <span>₹3</span>
                    </div>
                    <div className="flex justify-between text-gray-600 mb-2">
                        <span>Delivery Charges</span>
                        <span className="text-green-500">Free</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between text-gray-800 font-semibold">
                        <span>Total Amount</span>
                        <span>₹{finalAmount}</span>
                    </div>
                    <p className="text-green-500 text-sm mt-2">You will save ₹{totalDiscount} on this order</p>
                    <button 
                        className="bg-orange-500 text-white w-full py-2 rounded mt-4"
                        disabled={loading} // Disable when loading
                        onClick={handlePlaceAllItemsOrder}
                    >
                        PLACE ORDER
                    </button>
                </div>
            </div>
        </>
    )
}

export default Page

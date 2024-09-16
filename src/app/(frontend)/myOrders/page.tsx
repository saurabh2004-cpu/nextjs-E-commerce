'use client'
import { toast } from '@/components/ui/use-toast';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/api';
import Navbar from '@/components/navbar/Navbar';
import { MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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

interface Order {
  _id: string;
  status: string;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

const Page = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [noOrders, setNoOrders] = useState(false)
  const router = useRouter();

  const handleMenuToggle = (id: string) => {
    setActiveMenu(activeMenu === id ? null : id);
  };


  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/get-all-orders');

      if (!response) {
        console.log("No response from API");
        setNoOrders(true)

      }

      console.log("orders", response.data.data);
      setOrders(response.data.data);

    } catch (error) {
      console.error("Error while fetching the orders");
      toast({ description: "Error: Could not fetch orders", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // if(orders){
  //   orders.map((order)=>{
  //     order.items.map((item)=>{
  //       console.log("item",item.product)
  //     })
  //   })
  //  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    try {
      const response = await axiosInstance.post('/api/cancel-order', { orderId });

      if (!response) {
        console.log("no response from api")
      }

      toast({ description: "Order sucessfully canceled" });
      setOrders(orders.filter(orders => orders._id !== orderId));
    } catch (error) {
      console.error("error while canceling order")
      toast({ description: "Error: Could not cancel order", variant: "destructive" });
    }
  }

  const handleGetOrderDetails = async (orderId: string) => {
    router.replace(`/orderDetails?orderId=${encodeURIComponent(orderId)}`);
  }


  if (noOrders === true) return <p>You dont have any order</p>

  return (<><Navbar />
    <div className="container mx-auto p-6 bg-gray-100">
      <div className="flex">
        {/* Filters Section */}
        <aside className="w-1/4 p-4 bg-white shadow-md rounded-md">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="mb-4">
            <h3 className="text-md font-semibold mb-2">ORDER STATUS</h3>
            <div className="space-y-2">
              <div>
                <input type="checkbox" id="status-on-the-way" />
                <label htmlFor="status-on-the-way" className="ml-2 text-gray-700">On the way</label>
              </div>
              <div>
                <input type="checkbox" id="status-delivered" />
                <label htmlFor="status-delivered" className="ml-2 text-gray-700">Delivered</label>
              </div>
              <div>
                <input type="checkbox" id="status-cancelled" />
                <label htmlFor="status-cancelled" className="ml-2 text-gray-700">Cancelled</label>
              </div>
              <div>
                <input type="checkbox" id="status-returned" />
                <label htmlFor="status-returned" className="ml-2 text-gray-700">Returned</label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-2">ORDER TIME</h3>
            <div className="space-y-2">
              <div>
                <input type="checkbox" id="time-30-days" />
                <label htmlFor="time-30-days" className="ml-2 text-gray-700">Last 30 days</label>
              </div>
              <div>
                <input type="checkbox" id="time-2023" />
                <label htmlFor="time-2023" className="ml-2 text-gray-700">2023</label>
              </div>
              <div>
                <input type="checkbox" id="time-2022" />
                <label htmlFor="time-2022" className="ml-2 text-gray-700">2022</label>
              </div>
              <div>
                <input type="checkbox" id="time-2021" />
                <label htmlFor="time-2021" className="ml-2 text-gray-700">2021</label>
              </div>
              <div>
                <input type="checkbox" id="time-2020" />
                <label htmlFor="time-2020" className="ml-2 text-gray-700">2020</label>
              </div>
              <div>
                <input type="checkbox" id="time-older" />
                <label htmlFor="time-older" className="ml-2 text-gray-700">Older</label>
              </div>
            </div>
          </div>
        </aside>

        {/* Order List Section */}
        <div className="w-3/4 ml-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Your Orders</h2>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search your orders here"
                className="border border-gray-300 p-2 rounded-md"
              />
              <button className="flex items-center ml-2 bg-blue-500 text-white p-2 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m2.55-7.65a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Search Orders
              </button>
            </div>
          </div>

          {loading ? (
            <p>Loading orders...</p>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="bg-white p-4 mb-4 rounded-md shadow-md flex">
                <div className="w-2/3 flex flex-col">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex mb-4 w-full">
                      {item.product && item.product.imageUrl ? (
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          width={20}
                          height={20}
                          className="w-20 h-20 object-cover rounded-md mr-4"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md mr-4">
                          <span>No Image</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.product?.name || 'Product Name'}</h3>
                        {/* <p className="text-gray-500 text-sm"> {item.product?.description || 'N/A'}</p> */}
                        <p className="font-semibold text-gray-800 mt-2">₹{item.product?.price || '0'}</p>
                      </div>
                      {/* <p>{item.quantity}</p> */}
                    </div>
                  ))}
                </div>

                <div className="ml-4 w-1/3 flex flex-col justify-between">
                  <div>
                    <p className={`font-semibold ${order.status === 'Delivered' ? 'text-green-500' : 'text-red-500'}`}>

                      {order.status === 'Delivered' ? (
                        <>
                          <span className="flex items-center">
                            <span className="bg-green-500 rounded-full w-3 h-3 inline-block mr-2"></span>
                            Delivered on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </span>
                          <span className="text-gray-500 text-sm">Your item has been delivered</span>
                        </>
                      ) : order.status === 'Cancelled' ? (
                        <>
                          <span className="flex items-center">
                            <span className="bg-red-500 rounded-full w-3 h-3 inline-block mr-2"></span>
                            Cancelled on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </span>
                          <span className="text-gray-500 text-sm">{order.status === 'Cancelled' && 'Shipment is cancelled'}</span>
                        </>
                      ) : order.status === 'pending' ? (
                        <>
                          <span className="flex items-center">
                            <span className="bg-yellow-500 rounded-full w-3 h-3 inline-block mr-2"></span>
                            Pending
                          </span>
                          <span className="text-gray-500 text-sm">Your item divelivered soon</span>
                        </>
                      ) : null}
                    </p>
                  </div>
                  <div className="flex items-end">
                    <button className="text-blue-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 7.5h.008v.008H11.25V7.5zm.008 0H11.25h.008zm-.008 0a.75.75 0 11-.008 1.5h.008a.75.75 0 110-1.5zm1.757-1.746a2.25 2.25 0 113.268 3.268l-6.996 6.996a1.5 1.5 0 01-2.122 0l-2.997-2.996a2.25 2.25 0 113.268-3.268l3.755 3.755 6.996-6.996z" />
                      </svg>
                      Rate & Review Product
                    </button>
                  </div>
                </div>
                <MoreVertical
                  className="w-6 h-6 text-gray-500 cursor-pointer"
                  onMouseEnter={() => handleMenuToggle(order._id)}
                />
                {activeMenu === order._id &&
                  <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg" onMouseLeave={() => handleMenuToggle('')}>
                    <button
                      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                      onClick={() => handleGetOrderDetails(order._id)}

                    >
                      Order details
                    </button>
                    {order.status === 'pending' && <button
                      className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      Cancel order
                    </button>}
                  </div>
                }
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  </>
  );
};

export default Page;

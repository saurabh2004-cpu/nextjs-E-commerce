'use client'
import '../userProfile/utilty.css'
import axiosInstance from '@/app/(frontend)/services/api';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import 'nprogress/nprogress.css';
import NProgress from 'nprogress';
import { Heart, Loader2 } from 'lucide-react';
import Navbar from '@/components/navbar/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import PostReviewAndRatings from '@/components/comps/PostReviewAndRatings';
import ListAllReviews from '@/components/comps/ListAllReviews';
import { toast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query"

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
  };
}

const GetProductPage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAddedToWishList, setIsAddedToWishList] = useState(false);
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user;



  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');


  //fetch product 
  const fetchProduct = async () => {
    const response = await axiosInstance.get(`/api/get-product?productId=${productId}`);
    return response.data.data
  };

  //fetch wishlist 
  const fetchWishlist = async () => {
    NProgress.start();
    const response = await axiosInstance.get('/api/get-wishlist');
    NProgress.done();
    return response.data.data.items;
  };
  
  // const isProductInWishlist = response.data.data.items.some((item: WishlistItem) => item.product._id === productId);

  const results = useQueries({
    queries: [
      {
        queryKey: ['productData'],
        queryFn: fetchProduct,
        staleTime:10000
      },
      {
        queryKey: ['wishlistData'],
        queryFn: fetchWishlist,
        staleTime:10000
      },
    ],

    
  });

  // Extract the data and loading states for each query
  const productData = results[0].data;
  const isProductLoading = results[0].isLoading;
  const productError = results[0].error;

  const wishlistData = results[1].data;
  const isWishlistLoading = results[1].isLoading;
  const wishlistError = results[1].error;


  useEffect(() => {
    if (productData) {
      setProduct(productData);
    }

    if (wishlistData) {
      const isInWishlist = wishlistData.some((item: WishlistItem) => item.product._id === productId);
      setIsAddedToWishList(isInWishlist);
    }
  }, [productData,wishlistData]);

//add or remove from wishlist
  const handleHaertclick = async () => {
    if (!user) {
      router.push("/sign-up")
    }
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
    if (!user) {
      router.push("/sign-up")
    }
    try {
      setLoading(true)
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
      setLoading(false); // Stop spinner
    }
  }

  const handleBuyProduct = async (quantity: number) => {
    if (!user) {
      router.push("/sign-up")
    }
    try {
      const response = await axiosInstance.post('/api/create-order', { productId, quantity })

      if (!response) {
        console.log("no response from api")
      }
      console.log("buyed", response.data.data)

      toast({ description: "Product sucessfully buyed" });
      router.replace('/myOrders')

    } catch (error) {
      console.error("error while buying the product")
      toast({ description: "Error: Could not buy the product", variant: "destructive" });
    }
  }



  if (isProductLoading || isWishlistLoading) {
    return <div>Loading...</div>;
  }

  if (productError || wishlistError) {
    return <div>Error: {productError?.message || wishlistError?.message}</div>;
  }
  if (!product) return <p>No product data available</p>;

  const discountAmount = product?.price * 0.25;
  const newPrice = product?.price + discountAmount;

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
            className="w-full bg-gray-100 h-auto object-contain" />
          <div className="flex mt-4 gap-2">
            <button className="bg-yellow-500 text-white py-2 px-4 rounded" onClick={handleAddToCart}>
              {loading === true ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Add To Cart"
              )}
            </button>
            <button className="bg-orange-500 text-white py-2 px-4 rounded" onClick={() => handleBuyProduct(1)}>Buy Now</button>
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

            {/* //mobiles and tablets */}
            {product.category === "mobiles and tablets" &&
              <div className="flex items-center gap-4">
                <div>
                  <span className="font-bold">Color:</span>
                  <span className="ml-2">{product.color}</span>
                </div>
                <div>
                  <span className="font-bold">RAM:</span>
                  <span className="ml-2">{product.ram} GB</span>
                </div>
                <div>
                  <span className="font-bold">Storage:</span>
                  <span className="ml-2">{product.storage} GB</span>
                </div>
              </div>
            }

            {/* //tv and appliences */}
            {product.category === "tv and appliances" &&
              <div className="flex items-center gap-4">
                <div>
                  <span className="font-bold">Display Size:</span>
                  <span className="ml-2">{product.displaySize}</span>
                </div>
                <div>
                  <span className="font-bold">Launch Year:</span>
                  <span className="ml-2">{product.launchYear} </span>
                </div>
                <div>
                  <span className="font-bold">HD Technology:</span>
                  <span className="ml-2">{product.hdTechnology}</span>
                </div>
              </div>
            }

            {/* //fashio */}





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

            {/* mobile and tablets */}
            {product.category === 'mobiles and tablets' &&
              <ul className="list-disc ml-4 text-gray-700">
                <li>{product.description}</li>
                <li>{product.battery} MAh Battery</li>
                <li>{product.highlight} </li>
              </ul>
            }

            {/* tv and appliences */}
            {product.category === 'tv and appliances' &&
              <ul className="list-disc ml-4 text-gray-700">
                <li>{product.description}</li>
                <li>{product.displaySize} Inch</li>
                <li>{product.highlight} </li>
              </ul>}

            {/* fashion */}
            {product.category === 'fashion' &&
              <ul className="list-disc ml-4 text-gray-700">
                <li>{product.description}</li>
                <li>{product.highlight} </li>
              </ul>}






          </div>





          {/* Seller Information */}
          <div className="mt-4">
            <h3 className="font-bold text-lg">Seller</h3>
            <p className="text-gray-700">{product.productOwner?.username}</p>
            <p className="text-gray-600">7 Days Service Center Replacement/Repair</p>
          </div>

          {/* Product Description */}
          <div className="mt-4">
            <h3 className="font-bold text-lg">Product Description</h3>
            <p className="text-gray-700">{product.description}</p>
            <a href="#view-more" className="text-blue-600">View all features</a>
          </div>

          {productId && product ? (
            <>
              <PostReviewAndRatings productId={productId} />
              <ListAllReviews
                productId={productId}
                averageRating={product?.averageRating || 0}
                totalReviews={product?.totalReviews || 0}
              />
            </>
          ) : (
            <p>Product not found or productId is missing.</p>
          )}

        </div>
      </div>
    </>
  );
};

export default GetProductPage;

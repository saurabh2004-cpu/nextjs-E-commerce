'use client'

import axiosInstance from '@/app/(frontend)/services/api';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ProductByCategoryProps{
  category:string;
  heading:string;
}

interface Product{
  _id:string;
  imageUrl:string;
  name:string;
  price:number

}



const ProductByCategory:React.FC<ProductByCategoryProps> = ({ category, heading }) => {


  // const category = 'mobile';

  const [products, setProducts] = useState<Product[]>([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter()

  const { data: session, status } = useSession();
  const user = session?.user;

  if (!user || !session) {
    console.log("not authorized")
  }

  // console.log(user)

  useEffect(() => {
    const fetchProducts = async () => {

      try {
        const response = await axiosInstance.get(`/api/get-products-by-category?category=${category}`);
        setProducts(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);
  // const sevenProducts = products?.slice(1);

  const handleCardClick = (productId:any) => {
    router.replace(`/get-product?productId=${encodeURIComponent(productId)}`);
  };

  if (loading) {
    return (
      <div className="flex flex-wrap gap-4 ">
        {Array(7).fill('').map((_, index) => (
          <div key={index} className="w-48 border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white animate-pulse">
            <div className="w-full h-48 bg-gray-300"></div>
            <div className="p-4 text-center">
              <div className="h-4 bg-gray-300 mb-2"></div>
              <div className="h-4 bg-gray-300 w-1/2 mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) return <div>Error fetching products</div>;
  if (!products) return <div>No products found</div>;

  return (<>
    <div>
      <h2 className='font-bold m-3 p-2 background-black'>{heading} </h2>
      <div className="flex flex-wrap gap-4 m-4 ml-9">
        {products.slice(0,7).map(product => (
          <div
            key={product._id}
            className="w-48 border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white"
            onClick={()=>handleCardClick(product._id)}
            >
            <div className="w-full h-48 flex items-center justify-center overflow-hidden">
              <Image src={product.imageUrl}
               alt={product.name}
               width={100}
               height={100}
              className="w-full h-full object-contain" />
            </div>
            <div className="p-4 text-center">
              <h3 className="text-m  mb-2">{product.name.length > 20 ? product.name.slice(0, 18)  : product.name}</h3>
              <p className="text-green-600 text-sm">From ₹{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
  );
};

export default ProductByCategory;

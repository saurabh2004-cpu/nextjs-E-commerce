'use client';

import axiosInstance from '@/app/(frontend)/services/api';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useInfiniteQuery } from '@tanstack/react-query';

interface Product {
  _id: string;
  imageUrl: string;
  name: string;
  price: number;
}

const GetAllProducts = () => {
  const [limit, setLimit] = useState(7);
  const router = useRouter();

  const { data: session } = useSession();
  const user = session?.user;

  if (!user || !session) {
    console.log('Not authorized');
  }

  const fetchProducts = async ({ pageParam = 1 }) => {
    const response = await axiosInstance.get(`/api/get-all-products?page=${pageParam}&limit=${limit}`);


    //this data stored as lastPage 
    return {
      products: response.data.data.products,
      currentPage: response.data.data.currentPage, 
      totalPages: response.data.data.totalPages,
    };
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,

  } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: ({ pageParam = 1 }) => fetchProducts({ pageParam }),
    getNextPageParam: (lastPage) => {
      // If the last page has no products, return undefined to stop fetching more pages
      if (lastPage.products.length === 0 || lastPage.currentPage === lastPage.totalPages) {
        return undefined;
      }
      // Otherwise, fetch the next page
      return lastPage.currentPage + 1;
    },
    initialPageParam: 1,
    staleTime:100000
  });

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [isFetchingNextPage, hasNextPage]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleCardClick = (productId: string) => {
    router.push(`/get-product?productId=${encodeURIComponent(productId)}`);
  };

  if (status === 'pending') {
    return (
      <div className="flex flex-wrap gap-4 justify-center">
        {Array(7)
          .fill('')
          .map((_, index) => (
            <div
              key={index}
              className="w-48 border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white animate-pulse"
            >
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
  if (!data?.pages?.length && !isFetchingNextPage) return <div>No products found</div>;

  return (
    <div>
      <h2 className="font-bold m-3 p-2 background-black">All Products</h2>
      <div className="flex flex-wrap gap-4 m-4 ml-9">
        {data.pages.map((page) =>
          page.products.map((product: Product) => (
            <div
              key={product._id}
              className="w-48 border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white"
              onClick={() => handleCardClick(product._id)}
            >
              <div className="w-full h-48 flex items-center justify-center overflow-hidden">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={100}
                  height={100}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-m mb-2">
                  {product.name.length > 20 ? product.name.slice(0, 18) : product.name}
                </h3>
                <p className="text-green-600 text-sm">From ₹{product.price}</p>
              </div>
            </div>
          ))
        )}
      </div>
      {isFetchingNextPage && <div>Loading more products...</div>}
    </div>
  );
};

export default GetAllProducts;

'use client';

import axiosInstance from '@/app/(frontend)/services/api';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Heart, ShoppingCart, Star, Grid, List, Search, Filter } from 'lucide-react';

interface Product {
  _id: string;
  imageUrl: string;
  name: string;
  price: number;
}

const GetAllProducts = () => {
  const [limit, setLimit] = useState(7);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  const { data: session } = useSession();
  const user = session?.user;

  if (!user || !session) {
    console.log('Not authorized');
  }

  const fetchProducts = async ({ pageParam = 1 }) => {
    const response = await axiosInstance.get(`/api/get-all-products?page=${pageParam}&limit=${limit}`);

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
    queryKey: ['products', limit],
    queryFn: ({ pageParam = 1 }) => fetchProducts({ pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.products.length === 0 || lastPage.currentPage === lastPage.totalPages) {
        return undefined;
      }
      return lastPage.currentPage + 1;
    },
    initialPageParam: 1,
    staleTime: 100000
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
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleCardClick = (productId: string) => {
    router.push(`/get-product?productId=${encodeURIComponent(productId)}`);
  };

  const toggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const allProducts = data?.pages.flatMap(page => page.products) || [];
  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'pending') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8 space-y-4">
          <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        
        {/* Products Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-3 md:gap-4 lg:gap-6">
          {Array(10).fill('').map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
            >
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">Error Loading Products</div>
          <p className="text-red-500">Unable to fetch products. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!data?.pages?.length && !isFetchingNextPage) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <div className="text-gray-600 text-lg font-semibold mb-2">No Products Found</div>
          <p className="text-gray-500">Check back later for new products.</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" mx-auto px-4 py-6 md:py-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          All Products
          
        </h1>
        
      </div>

      {/* Products Grid */}
      <div className={`
        ${viewMode === 'grid' 
          ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-3 md:gap-4 lg:gap-6' 
          : 'space-y-4'
        }
      `}>
        {filteredProducts.map((product: Product) => (
          <div
            key={product._id}
            className={`
              group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden 
              hover:shadow-lg hover:border-gray-200 transition-all duration-300 cursor-pointer
              transform hover:-translate-y-1
              ${viewMode === 'list' ? 'flex flex-row' : 'flex flex-col'}
            `}
            onClick={() => handleCardClick(product._id)}
          >
            {/* Product Image */}
            <div className={`
              relative overflow-hidden bg-gray-50
              ${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'aspect-square'}
            `}>
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Favorite Button */}
              <button
                onClick={(e) => toggleFavorite(product._id, e)}
                className="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm
                         hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <Heart 
                  className={`h-4 w-4 ${
                    favorites.has(product._id) 
                      ? 'text-red-500 fill-red-500' 
                      : 'text-gray-600'
                  }`}
                />
              </button>
              
              {/* Quick Add to Cart */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Add to cart logic here
                }}
                className="absolute bottom-2 right-2 p-2 rounded-full bg-blue-600 text-white
                         hover:bg-blue-700 transition-all duration-200 opacity-0 group-hover:opacity-100
                         transform translate-y-2 group-hover:translate-y-0"
              >
                <ShoppingCart className="h-4 w-4" />
              </button>
            </div>

            {/* Product Info */}
            <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm md:text-base">
                  {product.name}
                </h3>
              </div>
              
              {/* Rating (placeholder) */}
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">(4.0)</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-600">₹{product.price}</span>
                  <span className="text-sm text-gray-500 line-through">₹{Math.floor(product.price * 1.2)}</span>
                </div>
                
                {viewMode === 'list' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to cart logic
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                             transition-colors duration-200 text-sm font-medium"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading More Indicator */}
      {isFetchingNextPage && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span>Loading more products...</span>
          </div>
        </div>
      )}

      {/* No More Products */}
      {!hasNextPage && allProducts.length > 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 text-sm">
            You&apos;ve reached the end of our product catalog
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllProducts;
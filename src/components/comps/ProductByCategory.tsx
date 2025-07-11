'use client';

import axiosInstance from '@/app/(frontend)/services/api';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight, Eye, ArrowRight } from 'lucide-react';

interface ProductByCategoryProps {
  category: string;
  heading: string;
}

interface Product {
  _id: string;
  imageUrl: string;
  name: string;
  price: number;
}

const ProductByCategory: React.FC<ProductByCategoryProps> = ({ category, heading }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const { data: session, status } = useSession();
  const user = session?.user;

  if (!user || !session) {
    console.log("not authorized");
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/get-products-by-category?category=${category}`);
        setProducts(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

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

  const handleAddToCart = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Add to cart logic here
    console.log(`Added product ${productId} to cart`);
  };

  const displayedProducts = products.slice(0, 7);

  const viewAllProducts = () => {
    router.push(`/products?category=${encodeURIComponent(category)}`);
  };

  if (loading) {
    return (
      <div className="py-8 px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-3 md:gap-4 lg:gap-6">
          {Array(7).fill('').map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
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
      <div className="py-8 px-4 md:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">Error Loading Products</div>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-8 px-4 md:px-6 lg:px-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <div className="text-gray-600 text-lg font-semibold mb-2">No Products Found</div>
          <p className="text-gray-500">No products available in this category.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-8 px-4 md:px-6 lg:px-8 bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {heading}
          </h2>
          <p className="text-gray-600 text-sm">
            {displayedProducts.length} products available
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View All Button */}
          <button
            onClick={viewAllProducts}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
          >
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-3 md:gap-4 lg:gap-6">
        {displayedProducts.map((product) => (
          <ProductCard 
            key={product._id}
            product={product}
            onCardClick={handleCardClick}
            onToggleFavorite={toggleFavorite}
            onAddToCart={handleAddToCart}
            isFavorite={favorites.has(product._id)}
          />
        ))}
      </div>
    </section>
  );
};

// Product Card Component
const ProductCard: React.FC<{
  product: Product;
  onCardClick: (id: string) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onAddToCart: (id: string, e: React.MouseEvent) => void;
  isFavorite: boolean;
}> = ({ product, onCardClick, onToggleFavorite, onAddToCart, isFavorite }) => {
  return (
    <div
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      onClick={() => onCardClick(product._id)}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300">
          {/* Favorite Button */}
          <button
            onClick={(e) => onToggleFavorite(product._id, e)}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
          >
            <Heart 
              className={`h-4 w-4 ${
                isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'
              }`}
            />
          </button>

          {/* Quick View Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Quick view logic here
            }}
            className="absolute top-3 left-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => onAddToCart(product._id, e)}
            className="absolute bottom-3 right-3 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>

        {/* Sale Badge */}
        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
          Sale
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base line-clamp-2">
          {product.name}
        </h3>
        
        {/* Rating */}
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
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-600">₹{product.price}</span>
            <span className="text-sm text-gray-500 line-through">₹{Math.floor(product.price * 1.2)}</span>
          </div>
          <div className="text-xs text-green-600 font-medium">
            {Math.floor(((product.price * 1.2 - product.price) / (product.price * 1.2)) * 100)}% off
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductByCategory;
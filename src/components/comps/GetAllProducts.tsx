import axiosInstance from '@/app/(frontend)/services/api';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Product {
  _id: string;
  imageUrl: string;
  name: string;
  price: number;
}

const GetAllProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  const { data: session } = useSession();
  const user = session?.user;

  if (!user || !session) {
    console.log("Not authorized");
  }

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/get-all-products?page=${page}&limit=10`);
      const { products: newProducts = [], totalPages } = response.data.data; // Default to an empty array if newProducts is undefined
      console.log("All products", response.data.data);

      if (!Array.isArray(newProducts)) {
        throw new Error("Expected newProducts to be an array");
      }

      setProducts((prevProducts) => [...prevProducts, ...newProducts]);
      setHasMore(page < totalPages); // Check if there are more pages
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Error fetching products");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 &&
      hasMore &&
      !loading
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleCardClick = (productId: string) => {
    router.replace(`/get-product?productId=${encodeURIComponent(productId)}`);
  };

  if (loading && page === 1) {
    return (
      <div className="flex flex-wrap gap-4 justify-center ">
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
      </div>
    );
  }

  if (error) return <div>{error}</div>;
  if (!products.length && !loading) return <div>No products found</div>;

  return (
    <div>
      <h2 className="font-bold m-3 p-2 background-black">All Products</h2>
      <div className="flex flex-wrap gap-4 m-4 ml-9">
        {products.map((product) => (
          <div
            key={product._id}
            className="w-48 border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white"
            onClick={() => handleCardClick(product._id)}
          >
            <div className="w-full h-48 flex items-center justify-center  overflow-hidden">
              <Image src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
            </div>
            <div className="p-4 text-center">
              <h3 className="text-m mb-2">{product.name.length > 20 ? product.name.slice(0, 18)  : product.name}</h3>
              <p className="text-green-600 text-sm">From ₹{product.price}</p>
            </div>
          </div>
        ))}
      </div>
      {loading && <div>Loading more products...</div>}
    </div>
  );
};

export default GetAllProducts;

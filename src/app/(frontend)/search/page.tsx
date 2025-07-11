"use client"
import { useEffect, useState } from "react"
import axiosInstance from "../services/api"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import Navbar from "@/components/navbar/Navbar"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface Product {
  _id: string
  name: string
  description: string
  imageUrl: string
  price: number
  category: string
  isAvailable: boolean
  stock: number
  createdAt: string
  updatedAt: string
  productOwner: string
}

const SearchResultsPage = () => {
  const searchParams = useSearchParams()
  const query = searchParams.get("query")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) {
        setProducts([])
        setError("Please enter a search query.")
        return
      }

      setLoading(true)
      setError(null) // Clear previous errors
      try {
        const response = await axiosInstance.get(`/api/search-product-by-keyword?query=${query}`)
        if (response.data.statusCode === 200) {
          setProducts(response.data.data)
          if (response.data.data.length === 0) {
            setError(`No products found for "${query}".`)
          }
        } else {
          setError("Failed to fetch products. Please try again.")
          toast({ description: "Error: Could not fetch products", variant: "destructive" })
        }
      } catch (err) {
        console.error("Error while fetching products:", err)
        setError("An unexpected error occurred while searching. Please try again later.")
        toast({ description: "Error: Could not fetch products", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [query])

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left">Search Results for {query}</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="ml-3 text-lg text-gray-600">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-gray-600">
            <p className="text-xl font-semibold mb-4">{error}</p>
            {products.length === 0 && query && <p>Try a different search term or browse our categories.</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product._id} href={`/get-product?productId=${encodeURIComponent(product._id)}`}>
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                  <CardContent className="p-0 flex-grow">
                    <div className="w-full h-48 relative overflow-hidden rounded-t-lg">
                      <Image
                        src={product.imageUrl || "/placeholder.svg?height=200&width=200"}
                        alt={product.name}
                        layout="fill"
                        objectFit="contain"
                        className="bg-gray-100"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex flex-col items-start text-left">
                    <CardTitle className="text-lg font-semibold mb-2 line-clamp-2">{product.name}</CardTitle>
                    <p className="text-xl font-bold text-green-600">₹{product.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default SearchResultsPage

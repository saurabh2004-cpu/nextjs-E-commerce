"use client"

import "../userProfile/utilty.css"
import axiosInstance from "@/app/(frontend)/services/api"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import "nprogress/nprogress.css"
import NProgress from "nprogress"
import {
  Heart,
  Loader2,
  ShoppingCart,
  Zap,
  Truck,
  Shield,
  Star,
  Package,
  Award,
  Clock,
  ArrowLeft,
  Share2,
  CheckCircle,
  Gift,
} from "lucide-react"
import Navbar from "@/components/navbar/Navbar"
import PostReviewAndRatings from "@/components/comps/PostReviewAndRatings"
import ListAllReviews from "@/components/comps/ListAllReviews"
import { toast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useQueries } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Product {
  imageUrl: string
  name: string
  price: number
  totalReviews: number
  description: string
  category: string
  color?: string
  ram?: number
  storage?: number
  displaySize?: string
  launchYear?: number
  hdTechnology?: string
  battery?: number
  highlight?: string
  productOwner?: {
    username: string
  }
  averageRating?: number
  [key: string]: any
}

interface WishlistItem {
  product: {
    _id: string
  }
}

const GetProductPage = () => {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [isAddedToWishList, setIsAddedToWishList] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [pincode, setPincode] = useState("")
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user
  const searchParams = useSearchParams()
  const productId = searchParams.get("productId")

  //fetch product
  const fetchProduct = async () => {
    const response = await axiosInstance.get(`/api/get-product?productId=${productId}`)
    return response.data.data
  }

  //fetch wishlist
  const fetchWishlist = async () => {
    NProgress.start()
    const response = await axiosInstance.get("/api/get-wishlist")
    NProgress.done()
    return response.data.data.items
  }

  const results = useQueries({
    queries: [
      {
        queryKey: ["productData"],
        queryFn: fetchProduct,
        staleTime: 10000,
      },
      {
        queryKey: ["wishlistData"],
        queryFn: fetchWishlist,
        staleTime: 10000,
      },
    ],
  })

  // Extract the data and loading states for each query
  const productData = results[0].data
  const isProductLoading = results[0].isLoading
  const productError = results[0].error
  const wishlistData = results[1].data
  const isWishlistLoading = results[1].isLoading
  const wishlistError = results[1].error

  useEffect(() => {
    if (productData) {
      setProduct(productData)
    }
    if (wishlistData) {
      const isInWishlist = wishlistData.some((item: WishlistItem) => item.product._id === productId)
      setIsAddedToWishList(isInWishlist)
    }
  }, [productData, wishlistData, productId])

  //add or remove from wishlist
  const handleHeartClick = async () => {
    if (!user) {
      router.push("/sign-up")
      return
    }
    try {
      if (isAddedToWishList) {
        const response = await axiosInstance.post("/api/remove-from-wishlist", { productId })
        if (response.status === 200) {
          console.log("Product removed successfully", response.data.data)
          setIsAddedToWishList(false)
          toast({ description: "Removed from wishlist" })
        } else {
          console.error("Unexpected response while removing product from wishlist", response)
        }
      } else {
        const response = await axiosInstance.post("/api/add-to-wishlist", { productId })
        if (response.status === 200 || response.status === 201) {
          console.log(response.data.message)
          setIsAddedToWishList(true)
          toast({ description: "Added to wishlist" })
        } else {
          console.error("Unexpected response while adding product to wishlist", response)
        }
      }
    } catch (error) {
      console.error("Error while updating wishlist", error)
      toast({ description: "Error updating wishlist", variant: "destructive" })
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      router.push("/sign-up")
      return
    }
    try {
      setLoading(true)
      const response = await axiosInstance.post("/api/add-to-cart", { productId, quantity })
      if (!response) {
        console.log("no response ")
      }
      console.log("cart", response)
      toast({ description: "Product added to cart successfully" })
    } catch (error) {
      console.error("error while adding the product in cart", error)
      toast({ description: "Error: Could not add to cart", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleBuyProduct = async (quantity: number) => {
    if (!user) {
      router.push("/sign-up")
      return
    }
    try {
      const response = await axiosInstance.post("/api/create-order", { productId, quantity })
      if (!response) {
        console.log("no response from api")
      }
      console.log("bought", response.data.data)
      toast({ description: "Product successfully purchased" })
      router.replace("/myOrders")
    } catch (error) {
      console.error("error while buying the product")
      toast({ description: "Error: Could not buy the product", variant: "destructive" })
    }
  }

  if (isProductLoading || isWishlistLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Product</h3>
              <p className="text-gray-600">Please wait while we fetch the product details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (productError || wishlistError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <Package className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Product</h3>
              <p className="text-gray-600">{productError?.message || wishlistError?.message}</p>
              <Button onClick={() => router.back()} className="mt-4">
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Not Found</h3>
              <p className="text-gray-600">The product you&apos;re looking for doesn&apos;t exist.</p>
              <Button onClick={() => router.back()} className="mt-4">
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const discountAmount = product?.price * 0.25
  const originalPrice = product?.price + discountAmount
  const savings = originalPrice - product?.price

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleHeartClick}>
              <Heart className="h-5 w-5" fill={isAddedToWishList ? "currentColor" : "none"} />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side: Product Images */}
          <div className="space-y-4">
            {/* Main Product Image */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardContent className="p-0 relative">
                {/* Desktop Wishlist Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm hover:bg-white/90 hidden lg:flex"
                  onClick={handleHeartClick}
                >
                  <Heart className="h-5 w-5" fill={isAddedToWishList ? "currentColor" : "none"} />
                </Button>

                <div className="aspect-square bg-white flex items-center justify-center p-8">
                  <Image
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    width={500}
                    height={500}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                    priority
                  />
                </div>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {[1, 2, 3].map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${index === selectedImageIndex ? "bg-blue-600" : "bg-gray-300"}`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail Images */}
            <div className="hidden lg:flex gap-3">
              {[1, 2, 3].map((_, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all duration-200 ${index === selectedImageIndex ? "ring-2 ring-blue-600" : "hover:shadow-md"
                    }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <CardContent className="p-2">
                    <div className="aspect-square w-20 bg-gray-50 rounded-lg flex items-center justify-center">
                      <Image
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={`${product.name} view ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={loading}
                className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                ) : (
                  <ShoppingCart className="h-5 w-5 mr-2" />
                )}
                Add to Cart
              </Button>
              <Button
                onClick={() => handleBuyProduct(quantity)}
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold"
              >
                <Zap className="h-5 w-5 mr-2" />
                Buy Now
              </Button>
            </div>
          </div>

          {/* Right Side: Product Details */}
          <div className="space-y-6">
            {/* Product Title and Rating */}
            <div className="space-y-3">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded text-sm font-medium">
                    <Star className="h-3 w-3 fill-current" />
                    <span>{product.averageRating || 4.2}</span>
                  </div>
                  <span className="text-gray-600 text-sm">
                    ({product.totalReviews} ratings & {product.totalReviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Price Section */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-blue-50">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-green-600">₹{product.price.toLocaleString()}</span>
                    <span className="text-lg text-gray-500 line-through">₹{originalPrice.toLocaleString()}</span>
                    <Badge className="bg-red-500 text-white">25% off</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Gift className="h-4 w-4" />
                    <span className="font-medium">You save ₹{savings.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Offers */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Award className="h-5 w-5 text-orange-500" />
                  Available Offers
                </h3>
                <div className="space-y-2">
                  {[
                    "5% Cashback on Flipkart Axis Bank Card T&C",
                    "Extra ₹2000 off on exchange",
                    "Bank Offer 5% off on ICICI Bank Credit Card Transactions",
                    "No Cost EMI available",
                  ].map((offer, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{offer}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Product Variants */}
            {(product.category === "mobiles and tablets" ||
              product.category === "tv and appliances" ||
              product.category === "fashion") && (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-3">Product Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Mobile and Tablets */}
                      {product.category === "mobiles and tablets" && (
                        <>
                          {product.color && (
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="font-medium text-gray-700">Color</span>
                              <span className="text-gray-900">{product.color}</span>
                            </div>
                          )}
                          {product.ram && (
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="font-medium text-gray-700">RAM</span>
                              <span className="text-gray-900">{product.ram} GB</span>
                            </div>
                          )}
                          {product.storage && (
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="font-medium text-gray-700">Storage</span>
                              <span className="text-gray-900">{product.storage} GB</span>
                            </div>
                          )}
                          {product.battery && (
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="font-medium text-gray-700">Battery</span>
                              <span className="text-gray-900">{product.battery} mAh</span>
                            </div>
                          )}
                        </>
                      )}

                      {/* TV and Appliances */}
                      {product.category === "tv and appliances" && (
                        <>
                          {product.displaySize && (
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="font-medium text-gray-700">Display Size</span>
                              <span className="text-gray-900">{product.displaySize}</span>
                            </div>
                          )}
                          {product.launchYear && (
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="font-medium text-gray-700">Launch Year</span>
                              <span className="text-gray-900">{product.launchYear}</span>
                            </div>
                          )}
                          {product.hdTechnology && (
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="font-medium text-gray-700">HD Technology</span>
                              <span className="text-gray-900">{product.hdTechnology}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Delivery Options */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-500" />
                  Delivery Options
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Input
                      type="text"
                      placeholder="Enter Delivery Pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline">Check</Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span className="text-gray-700">Delivery by 14 Aug, Wednesday</span>
                      <Badge variant="secondary" className="text-green-600">
                        Free
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-blue-500" />
                      <span className="text-gray-700">7 Days Replacement Policy</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Highlights */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-3">Highlights</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{product.description}</span>
                  </div>
                  {product.highlight && (
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{product.highlight}</span>
                    </div>
                  )}
                  {product.category === "mobiles and tablets" && product.battery && (
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{product.battery} mAh Long-lasting Battery</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Seller Information */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-3">Seller Information</h3>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {product.productOwner?.username?.charAt(0).toUpperCase() || "S"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{product.productOwner?.username || "Unknown Seller"}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current text-yellow-400" />
                      <span className="text-sm text-gray-600">4.3 Seller Rating</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>7 Days Service Center Replacement/Repair</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-blue-500" />
                    <span>Verified Seller</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile Sticky Bottom Actions */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-40">
          <div className="flex gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={loading}
              variant="outline"
              className="flex-1 h-12 border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <ShoppingCart className="h-5 w-5 mr-2" />}
              Add to Cart
            </Button>
            <Button
              onClick={() => handleBuyProduct(quantity)}
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            >
              <Zap className="h-5 w-5 mr-2" />
              Buy Now
            </Button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 space-y-8">
          <Separator />
          {productId && product ? (
            <div className="space-y-8">
              <PostReviewAndRatings productId={productId} />
              <ListAllReviews
                productId={productId}
                averageRating={product?.averageRating || 0}
                totalReviews={product?.totalReviews || 0}
              />
            </div>
          ) : (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">Product not found or productId is missing.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Mobile Bottom Padding */}
        <div className="lg:hidden h-20" />
      </div>
    </div>
  )
}

export default GetProductPage

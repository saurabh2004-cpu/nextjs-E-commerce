"use client"
import SellerNavBar from "@/components/comps/SellerNavbar"
import { useEffect, useState } from "react"
import axiosInstance from "../services/api"
import SellerFooter from "@/components/footer/SellerFooter"
import { useRouter } from "next/navigation"
import "nprogress/nprogress.css"
import NProgress from "nprogress"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import {
  Star,
  MapPin,
  Calendar,
  Building,
  Mail,
  Heart,
  Search,
  Facebook,
  Twitter,
  Instagram,
  Phone,
  Award,
  TrendingUp,
  Package,
  Users,
  ShoppingBag,
  Eye,
} from "lucide-react"

interface UserData {
  _id: string
  username: string
  email: string
  fullname: string
  gender: string
  phone: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
  verifyCode: string
  verifyCodeExpiry: string
  profilePicture?: string
}

interface ProductData {
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
  averageRating: string
}

const SellerProfile = () => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const userId = userData?._id
  const [productsData, setProductsData] = useState<ProductData[]>([])
  const [featuredproductsData, setFeaturedProductsData] = useState<ProductData[]>([])
  const router = useRouter()

  const lastSixProducts = productsData.slice(-6)
  const filteredProducts = lastSixProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    const fetchCurrentUserDetails = async () => {
      NProgress.start()
      try {
        const response = await axiosInstance.get("/api/current-user")
        if (response) {
          console.log("Current user", response.data.data)
          setUserData(response.data.data)
        } else {
          console.log("Error while fetching current user")
        }
      } catch (error) {
        console.error("Error while fetching sellers profile")
        NProgress.done()
      }
    }
    fetchCurrentUserDetails()
  }, [userId])

  useEffect(() => {
    const fetchProducts = async () => {
      NProgress.start()
      setLoading(true)
      try {
        const response = await axiosInstance.get(`/api/get-sellers-products?userId=${userData?._id}`)
        if (response) {
          setProductsData(response.data.data)
        }
      } catch (error) {
        console.log("Error while fetching user's products", error)
      } finally {
        setLoading(false)
        NProgress.done()
      }
    }
    if (userId) {
      fetchProducts()
    }
  }, [userData?._id, userId])

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true)
      try {
        const response = await axiosInstance.get(`/api/sellers-featured-products?userId=${userId}`)
        if (response) {
          console.log("featured Products", response)
          setFeaturedProductsData(response.data.data)
        }
      } catch (error) {
        console.log("Error while fetching user's featured products", error)
      } finally {
        setLoading(false)
        NProgress.done()
      }
    }
    if (userId) {
      fetchFeaturedProducts()
    }
  }, [userId])

  // Function to render the user avatar
  const renderUserAvatar = () => {
    if (userData?.profilePicture) {
      return (
        <div className="relative">
          <Image
            src={userData.profilePicture || "/placeholder.svg"}
            alt="Seller Profile"
            width={120}
            height={120}
            className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
          {userData.isVerified && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
              <Award className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
      )
    } else if (userData?.username) {
      const initial = userData.username.charAt(0).toUpperCase()
      const backgroundColors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#33FFA1", "#A133FF", "#FFA133"]
      const backgroundColor = backgroundColors[userData.username.charCodeAt(0) % backgroundColors.length]
      return (
        <div className="relative">
          <div
            style={{
              backgroundColor: backgroundColor,
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              width: "80px",
              height: "80px",
              fontSize: "28px",
              fontWeight: "bold",
              border: "4px solid white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
            className="md:w-28 md:h-28 lg:w-32 lg:h-32 md:text-4xl"
          >
            {initial}
          </div>
          {userData.isVerified && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
              <Award className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
      )
    } else {
      return null
    }
  }

  const handleCardClick = (productId: any) => {
    router.replace(`/get-product?productId=${encodeURIComponent(productId)}`)
  }

  const ProductSkeleton = () => (
    <Card className="w-full max-w-sm overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-4">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  )

  const ProductCard = ({ product }: { product: ProductData }) => (
    <Card
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 w-full max-w-sm"
      onClick={() => handleCardClick(product._id)}
    >
      <div className="relative overflow-hidden">
        <Image
          src={product.imageUrl || "/product.jpg"}
          alt={product.name}
          width={300}
          height={200}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        {product.averageRating > "0" && (
          <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
            <Star className="h-3 w-3 mr-1 fill-current" />
            {product.averageRating}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm md:text-base mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name.length > 25 ? product.name.slice(0, 25) + "..." : product.name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-green-600">${product.price}</p>
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
        </div>
        {product.stock > 0 ? (
          <Badge variant="secondary" className="mt-2 text-xs">
            In Stock ({product.stock})
          </Badge>
        ) : (
          <Badge variant="destructive" className="mt-2 text-xs">
            Out of Stock
          </Badge>
        )}
      </CardContent>
    </Card>
  )

  return (
    <>
      <SellerNavBar display={"hidden"} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {renderUserAvatar()}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
                  <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-0">{userData?.username}</h1>
                  {userData?.isVerified && (
                    <Badge className="bg-green-500 text-white w-fit mx-auto md:mx-0">
                      <Award className="h-3 w-3 mr-1" />
                      Verified Seller
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-center md:justify-start mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                    ))}
                    <span className="ml-2 text-sm">(4.5) • 1,234 reviews</span>
                  </div>
                </div>
                <p className="text-blue-100 mb-6 max-w-2xl">
                  Trusted seller providing high-quality products with excellent customer service. Join thousands of
                  satisfied customers who trust our brand.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button variant="secondary" className="w-full sm:w-auto">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Seller
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Follow Store
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 -mt-16 relative z-10">
            <Card className="text-center shadow-lg">
              <CardContent className="p-4">
                <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{productsData.length}</div>
                <div className="text-sm text-gray-600">Products</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg">
              <CardContent className="p-4">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">1.2K</div>
                <div className="text-sm text-gray-600">Customers</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg">
              <CardContent className="p-4">
                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">98%</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg">
              <CardContent className="p-4">
                <ShoppingBag className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">5.4K</div>
                <div className="text-sm text-gray-600">Orders</div>
              </CardContent>
            </Card>
          </div>

          {/* Seller Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-sm text-gray-600">New York, USA</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Member Since</div>
                    <div className="text-sm text-gray-600">
                      {userData?.createdAt ? new Date(userData.createdAt).getFullYear() : "2020"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Contact</div>
                    <div className="text-sm text-gray-600">{userData?.phone || "Available on request"}</div>
                  </div>
                </div>
              </div>
              <Separator className="my-6" />
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" size="sm">
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </Button>
                <Button variant="outline" size="sm">
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
                <Button variant="outline" size="sm">
                  <Instagram className="h-4 w-4 mr-2" />
                  Instagram
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Products Section */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Recent Products ({productsData.length})
                </CardTitle>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-64"
                    />
                  </div>
                  <Button asChild>
                    <a href="/sellerProductsList">
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </a>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array(8)
                    .fill("")
                    .map((_, index) => (
                      <ProductSkeleton key={index} />
                    ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? "Try adjusting your search terms" : "This seller hasn't added any products yet"}
                  </p>
                  {!searchTerm && (
                    <Button asChild>
                      <a href="/sellProduct">Add Your First Product</a>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Featured Products Section */}
          {featuredproductsData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  Featured Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {featuredproductsData.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <SellerFooter />
    </>
  )
}

export default SellerProfile

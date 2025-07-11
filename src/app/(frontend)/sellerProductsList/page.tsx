"use client"
import { useEffect, useState } from "react"
import axiosInstance from "../services/api"
import { useSession } from "next-auth/react"
import SellerNavBar from "@/components/comps/SellerNavbar"
import SellerFooter from "@/components/footer/SellerFooter"
import { useRouter } from "next/navigation"
import {
  MoreVertical,
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  Package,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react"
import ConfirmRemoveCard from "@/components/comps/ConfirmRemoveCard"
import "nprogress/nprogress.css"
import NProgress from "nprogress"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

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
  averageRating?: number
  totalSales?: number
}

const Page = () => {
  const [productsData, setProductsData] = useState<ProductData[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showConfirmRemoveCard, setShowConfirmRemoveCard] = useState<boolean>(false)
  const [productToRemove, setProductToRemove] = useState<string | null>(null)
  const { data: session } = useSession()
  const userId = session?.user.id
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get unique categories from products
  const categories = ["all", ...new Set(productsData.map((product) => product.category))]

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      NProgress.start()
      try {
        const response = await axiosInstance.get(`/api/get-sellers-products?userId=${userId}`)
        if (response.data.statusCode === 404 || response.data.data.length === 0) {
          setError("You don't have any products to sell.")
          setProductsData([])
        } else {
          setProductsData(response.data.data)
          setFilteredProducts(response.data.data)
        }
      } catch (error) {
        setError("Error while fetching your products. Please try again later.")
        console.log("Error while fetching user's products", error)
      } finally {
        setLoading(false)
        NProgress.done()
      }
    }

    if (userId) {
      fetchProducts()
    }
  }, [userId])

  // Filter and sort products
  useEffect(() => {
    const filtered = productsData.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        case "stock-low":
          return a.stock - b.stock
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }, [productsData, searchQuery, selectedCategory, sortBy])

  const handleCardClick = (productId: string) => {
    router.replace(`/get-product?productId=${encodeURIComponent(productId)}`)
  }

  const handleUpdateClick = (productId: string) => {
    router.replace(`/update-product?productId=${encodeURIComponent(productId)}`)
  }

  const handleRemoveClick = (productId: string) => {
    setProductToRemove(productId)
    setShowConfirmRemoveCard(true)
  }

  const confirmRemove = async () => {
    if (!productToRemove) {
      console.error("product id is missing")
      return
    }
    try {
      await axiosInstance.post(`/api/delete-product?productId=${productToRemove}`)
      setProductsData((prevProducts) => prevProducts.filter((product) => product._id !== productToRemove))
      setShowConfirmRemoveCard(false)
      setProductToRemove(null)
      router.refresh()
    } catch (error) {
      console.log("Error while deleting product", error)
    }
  }

  const cancelRemove = () => {
    setShowConfirmRemoveCard(false)
    setProductToRemove(null)
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "destructive", icon: XCircle }
    if (stock < 10) return { label: "Low Stock", color: "warning", icon: AlertCircle }
    return { label: "In Stock", color: "success", icon: CheckCircle }
  }

  const ProductCard = ({ product }: { product: ProductData }) => {
    const stockStatus = getStockStatus(product.stock)
    const StockIcon = stockStatus.icon

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] bg-white border border-gray-200">
        <div className="relative overflow-hidden">
          <div className="aspect-square cursor-pointer overflow-hidden" onClick={() => handleCardClick(product._id)}>
            <Image
              src={product.imageUrl || "/placeholder.svg?height=200&width=200"}
              alt={product.name}
              width={200}
              height={200}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Status Badge */}
          <div className="absolute top-2 left-2">
            <Badge variant={stockStatus.color as any} className="flex items-center gap-1 text-xs">
              <StockIcon className="h-3 w-3" />
              {stockStatus.label}
            </Badge>
          </div>

          {/* Actions Dropdown */}
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleCardClick(product._id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Product
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateClick(product._id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleRemoveClick(product._id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Product
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem]">{product.name}</h3>

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-green-600">${product.price.toFixed(2)}</span>
              {product.averageRating && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">{product.averageRating}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Stock: {product.stock}</span>
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const ProductListItem = ({ product }: { product: ProductData }) => {
    const stockStatus = getStockStatus(product.stock)
    const StockIcon = stockStatus.icon

    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div
              className="w-20 h-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg"
              onClick={() => handleCardClick(product._id)}
            >
              <Image
                src={product.imageUrl || "/placeholder.svg?height=80&width=80"}
                alt={product.name}
                width={80}
                height={80}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>

                  <div className="flex items-center gap-4 mt-2">
                    <span className="font-bold text-green-600">${product.price.toFixed(2)}</span>
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    <Badge variant={stockStatus.color as any} className="flex items-center gap-1 text-xs">
                      <StockIcon className="h-3 w-3" />
                      {product.stock} left
                    </Badge>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleCardClick(product._id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateClick(product._id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRemoveClick(product._id)} className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array(8)
        .fill(0)
        .map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  )

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Package className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        {searchQuery || selectedCategory !== "all"
          ? "Try adjusting your search or filter criteria"
          : "Start by adding your first product to begin selling"}
      </p>
      <Button onClick={() => router.push("/sellProduct")} className="bg-blue-600 hover:bg-blue-700">
        <Plus className="h-4 w-4 mr-2" />
        Add New Product
      </Button>
    </div>
  )

  if (loading)
    return (
      <>
        <SellerNavBar display={"hidden"} />
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-6">
            <LoadingSkeleton />
          </div>
        </div>
        <SellerFooter />
      </>
    )

  return (
    <>
      <SellerNavBar display={"hidden"} />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
                <p className="text-gray-600 mt-1">Manage your product inventory ({filteredProducts.length} products)</p>
              </div>
              <Button
                onClick={() => router.push("/sellProduct")}
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
            </div>

            {/* Stats Cards - Mobile Responsive */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">Total Products</p>
                      <p className="text-lg font-bold">{productsData.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-600">In Stock</p>
                      <p className="text-lg font-bold">{productsData.filter((p) => p.stock > 0).length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-xs text-gray-600">Low Stock</p>
                      <p className="text-lg font-bold">
                        {productsData.filter((p) => p.stock > 0 && p.stock < 10).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-xs text-gray-600">Out of Stock</p>
                      <p className="text-lg font-bold">{productsData.filter((p) => p.stock === 0).length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Mobile Filters */}
                <div className="flex gap-2 lg:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[400px]">
                      <SheetHeader>
                        <SheetTitle>Filter Products</SheetTitle>
                      </SheetHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Category</label>
                          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category === "all" ? "All Categories" : category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Sort By</label>
                          <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="newest">Newest First</SelectItem>
                              <SelectItem value="oldest">Oldest First</SelectItem>
                              <SelectItem value="price-low">Price: Low to High</SelectItem>
                              <SelectItem value="price-high">Price: High to Low</SelectItem>
                              <SelectItem value="name">Name A-Z</SelectItem>
                              <SelectItem value="stock-low">Stock: Low to High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  >
                    {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
                  </Button>
                </div>

                {/* Desktop Filters */}
                <div className="hidden lg:flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
                      <SelectItem value="stock-low">Stock: Low to High</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex border rounded-lg">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid/List */}
          {filteredProducts.length === 0 ? (
            <EmptyState />
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "space-y-4"
              }
            >
              {filteredProducts.map((product) =>
                viewMode === "grid" ? (
                  <ProductCard key={product._id} product={product} />
                ) : (
                  <ProductListItem key={product._id} product={product} />
                ),
              )}
            </div>
          )}
        </div>
      </div>

      {showConfirmRemoveCard && (
        <ConfirmRemoveCard
          onConfirm={confirmRemove}
          onCancel={cancelRemove}
          message="Are you sure you want to remove this product? This action cannot be undone."
        />
      )}

      <SellerFooter />
    </>
  )
}

export default Page

"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import axiosInstance from "../services/api"
import Navbar from "@/components/navbar/Navbar"
import { useDebounceCallback } from "usehooks-ts"
import Image from "next/image"
import { Filter, SlidersHorizontal, Grid3X3, List, Star, Heart, ShoppingCart, ChevronLeft, Search } from "lucide-react"

interface Product {
  name: string
  price: number
  imageUrl: string
  description: string
  category: string
  _id: string
  averageRating?: number
  totalReviews?: number
  originalPrice?: number
  discount?: number
}

const CategoryPage = () => {
  const searchParams = useSearchParams()
  const category = searchParams.get("category")?.toLowerCase()
  const [maxPrice, setMaxPrice] = useState(50000)
  const [sortOrder, setSortOrder] = useState("popularity")
  const [sortedProducts, setSortedProducts] = useState<Product[]>([])
  const [showToastMessage, setShowToastMessage] = useState(false)
  const [maxPricerangeValue, setMaxPricerangeValue] = useState([50000])
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const router = useRouter()
  const [rangeMinPrice, setRangeMinPrice] = useState(0)
  const [rangeMaxPrice, setRangeMaxPrice] = useState(100000)

  const debounced = useDebounceCallback(setMaxPrice, 500)

  const handlePriceChange = (value: number[]) => {
    setMaxPricerangeValue(value)
    debounced(value[0])
    setShowToastMessage(true)
  }

  useEffect(() => {
    const fetchProductbySortOrder = async () => {
      setLoading(true)
      try {
        const response = await axiosInstance.get(`/api/sort-products`, {
          params: {
            maxPrice,
            sortOrder,
            category,
          },
        })
        if (response && response.data) {
          setSortedProducts(response.data.data)

          // Set price ranges according to category
          if (response.data.data.length > 0) {
            const categoryType = response.data.data[0].category
            if (categoryType === "mobiles and tablets") {
              setRangeMaxPrice(200000)
              setRangeMinPrice(5000)
            } else if (categoryType === "tv and appliances") {
              setRangeMaxPrice(250000)
              setRangeMinPrice(5000)
            } else if (categoryType === "fashion") {
              setRangeMaxPrice(5000)
              setRangeMinPrice(300)
            }
          }

          if (showToastMessage) {
            toast({ description: "Filters applied successfully" })
            setShowToastMessage(false)
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        toast({
          description: "Error loading products. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProductbySortOrder()
  }, [maxPrice, sortOrder, category, showToastMessage])

  const handleCardClick = (productId: string) => {
    router.push(`/get-product?productId=${encodeURIComponent(productId)}`)
  }

  const formatCategoryName = (cat: string | undefined) => {
    if (!cat) return "Products"
    return cat
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const calculateDiscount = (price: number, originalPrice?: number) => {
    if (!originalPrice || originalPrice <= price) return 0
    return Math.round(((originalPrice - price) / originalPrice) * 100)
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Filter */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Price Range</h3>
          <Badge variant="secondary">₹{maxPricerangeValue[0].toLocaleString()}</Badge>
        </div>
        <div className="px-2">
          <Slider
            value={maxPricerangeValue}
            onValueChange={handlePriceChange}
            max={rangeMaxPrice}
            min={rangeMinPrice}
            step={1000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>₹{rangeMinPrice.toLocaleString()}</span>
            <span>₹{rangeMaxPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Sort By</h3>
        <RadioGroup
          value={sortOrder}
          onValueChange={(value:any) => {
            setSortOrder(value)
            setShowToastMessage(true)
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="popularity" id="popularity" />
            <Label htmlFor="popularity">Popularity</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="priceLowToHigh" id="priceLowToHigh" />
            <Label htmlFor="priceLowToHigh">Price: Low to High</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="priceHighToLow" id="priceHighToLow" />
            <Label htmlFor="priceHighToLow">Price: High to Low</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="newestFirst" id="newestFirst" />
            <Label htmlFor="newestFirst">Newest First</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )

  const ProductCard = ({ product }: { product: Product }) => {
    const discount = calculateDiscount(product.price, product.originalPrice)

    return (
      <Card
        className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-sm hover:shadow-xl"
        onClick={() => handleCardClick(product._id)}
      >
        <CardContent className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <Image
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.name}
                width={200}
                height={200}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            {discount > 0 && (
              <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">{discount}% OFF</Badge>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation()
                // Add to wishlist logic
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-4 space-y-2">
            <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem]">{product.name}</h3>

            <div className="flex items-center gap-2">
              {product.averageRating && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-muted-foreground">
                    {product.averageRating} ({product.totalReviews || 0})
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-green-600">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            <Button
              size="sm"
              className="w-full mt-2"
              onClick={(e) => {
                e.stopPropagation()
                // Add to cart logic
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const ProductSkeleton = () => (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-0">
        <Skeleton className="aspect-square rounded-t-lg" />
        <div className="p-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-8 w-full" />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <>
      <Navbar />

      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-white border-b lg:hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold text-lg">{formatCategoryName(category)}</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
              {viewMode === "grid" ? <List className="h-5 w-5" /> : <Grid3X3 className="h-5 w-5" />}
            </Button>

            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <SlidersHorizontal className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh]">
                <SheetHeader>
                  <SheetTitle>Filters & Sort</SheetTitle>
                  <SheetDescription>Refine your search results</SheetDescription>
                </SheetHeader>
                <div className="mt-6 overflow-y-auto">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-80 shrink-0">
              <Card className="sticky top-6 border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Filter className="h-5 w-5" />
                    <h2 className="font-semibold text-lg">Filters</h2>
                  </div>
                  <FilterContent />
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {/* Desktop Header */}
              <div className="hidden lg:flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold">{formatCategoryName(category)}</h1>
                  <p className="text-muted-foreground mt-1">
                    {loading ? "Loading..." : `${sortedProducts.length} products found`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div
                  className={`grid gap-4 ${
                    viewMode === "grid" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"
                  }`}
                >
                  {Array.from({ length: 8 }).map((_, index) => (
                    <ProductSkeleton key={index} />
                  ))}
                </div>
              ) : sortedProducts.length === 0 ? (
                <Card className="border-0 shadow-sm">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No products found</h3>
                    <p className="text-muted-foreground text-center">Try adjusting your filters or search terms</p>
                    <Button
                      variant="outline"
                      className="mt-4 bg-transparent"
                      onClick={() => {
                        setMaxPrice(rangeMaxPrice)
                        setMaxPricerangeValue([rangeMaxPrice])
                        setSortOrder("popularity")
                      }}
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div
                  className={`grid gap-4 ${
                    viewMode === "grid" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"
                  }`}
                >
                  {sortedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  )
}

export default CategoryPage

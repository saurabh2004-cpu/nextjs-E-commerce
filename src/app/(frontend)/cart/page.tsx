"use client"

import "../userProfile/utilty.css"
import Navbar from "@/components/navbar/Navbar"
import { useEffect, useState } from "react"
import axiosInstance from "../services/api"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import EmptyCartCard from "@/components/comps/EmptyCartCard"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Minus, Trash2, Heart, ShoppingCart, Tag, Truck, Shield, ArrowRight, X } from "lucide-react"
import "nprogress/nprogress.css"
import NProgress from "nprogress"
import Image from "next/image"

interface Product {
  name: string
  price: number
  imageUrl: string
  description: string
  _id: string
}

interface CartItem {
  _id: string
  name: string
  price: number
  quantity: number
  imageUrl: string
  description: string
  product: Product
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [showEmptyCartCard, setShowEmptyCartCard] = useState(false)
  const [loading, setLoading] = useState(false)
  const [updatingItem, setUpdatingItem] = useState<string | null>(null)
  const [removingItem, setRemovingItem] = useState<string | null>(null)
  const router = useRouter()

  const fetchCartItems = async () => {
    NProgress.start()
    try {
      const response = await axiosInstance.get("/api/get-cart-items")
      if (!response || response.status === null || !response.data?.data?.items) {
        setShowEmptyCartCard(true)
      } else {
        setCartItems(response.data.data.items)
      }
    } catch (error) {
      setShowEmptyCartCard(true)
      console.log(error)
    } finally {
      NProgress.done()
    }
  }

  useEffect(() => {
    fetchCartItems()
  }, [])

  const handleCardClick = (productId: string) => {
    router.push(`/get-product?productId=${encodeURIComponent(productId)}`)
  }

  const handleRemoveFromCart = async (productId: string) => {
    setRemovingItem(productId)
    try {
      const response = await axiosInstance.post("/api/remove-from-cart", { productId })
      if (response) {
        setCartItems((prevItems) => prevItems.filter((item) => item.product._id !== productId))
        if (cartItems.length === 1) {
          setShowEmptyCartCard(true)
        }
        toast({ description: "Item removed from cart" })
      }
    } catch (error) {
      toast({ description: "Error: Could not remove item from cart", variant: "destructive" })
      console.log("err", error)
    } finally {
      setRemovingItem(null)
    }
  }

  const handleRemoveAllFromCart = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.post("/api/clear-cart")
      if (response) {
        setCartItems([])
        toast({ description: "All items removed from cart" })
        setShowEmptyCartCard(true)
      }
    } catch (error) {
      toast({ description: "Error: Could not remove all items from cart", variant: "destructive" })
      console.log("err", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQuantity = async (productId: string, quantityChange: number) => {
    setUpdatingItem(productId)
    try {
      const response = await axiosInstance.patch(`/api/update-quentity?productId=${productId}`, { quantityChange })
      if (response) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.product._id === productId ? { ...item, quantity: item.quantity + quantityChange } : item,
          ),
        )
        toast({ description: "Quantity updated" })
      }
    } catch (error) {
      console.error("err: while updating the product quantity")
      toast({ description: "Error: Could not update the quantity of item from cart", variant: "destructive" })
    } finally {
      setUpdatingItem(null)
    }
  }

  const handlePlaceAllItemsOrder = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.post("/api/place-all-orders")
      if (response) {
        toast({ description: "Your order is placed" })
        console.log(response.data.data)
        router.push("/orders")
      }
    } catch (error) {
      console.error("error while placing all items order from cart")
      toast({ description: "Error: Can't place orders try again", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  if (showEmptyCartCard) return <EmptyCartCard />

  const totalPrice = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const totalDiscount = cartItems.reduce((acc, item) => acc + item.product.price * 0.25 * item.quantity, 0)
  const platformFee = 3
  const finalAmount = totalPrice - totalDiscount + platformFee

  const CartItemCard = ({ item }: { item: CartItem }) => {
    const discountedPrice = item.product.price - item.product.price * 0.25
    const isUpdating = updatingItem === item.product._id
    const isRemoving = removingItem === item.product._id

    return (
      <Card className="mb-4 overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Product Image */}
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <div className="relative cursor-pointer group" onClick={() => handleCardClick(item.product._id)}>
                <Image
                  src={item.product.imageUrl || "/placeholder.svg"}
                  alt={item.product.name}
                  width={120}
                  height={120}
                  className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg border group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all" />
              </div>
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <h3
                  className="font-semibold text-gray-900 text-sm sm:text-base cursor-pointer hover:text-blue-600 transition-colors line-clamp-2"
                  onClick={() => handleCardClick(item.product._id)}
                >
                  {item.product.name}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFromCart(item.product._id)}
                  disabled={isRemoving}
                  className="text-gray-400 hover:text-red-500 p-1 h-auto"
                >
                  {isRemoving ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                </Button>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold text-gray-900">₹{discountedPrice.toFixed(2)}</span>
                <span className="text-sm text-gray-500 line-through">₹{item.product.price}</span>
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                  25% OFF
                </Badge>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdateQuantity(item.product._id, -1)}
                    disabled={isUpdating || item.quantity <= 1}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                    {isUpdating ? <Loader2 className="h-3 w-3 animate-spin mx-auto" /> : item.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdateQuantity(item.product._id, 1)}
                    disabled={isUpdating}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 p-2 h-auto">
                    <Heart className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Save</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFromCart(item.product._id)}
                    disabled={isRemoving}
                    className="text-red-600 hover:text-red-700 p-2 h-auto"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Remove</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const PriceSummary = () => (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Tag className="h-5 w-5 mr-2" />
          Price Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Price ({cartItems.length} items)</span>
            <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Discount</span>
            <span className="font-medium text-green-600">-₹{totalDiscount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Platform Fee</span>
            <span className="font-medium">₹{platformFee}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Delivery Charges</span>
            <span className="font-medium text-green-600">Free</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">Total Amount</span>
          <span className="font-bold text-xl">₹{finalAmount.toFixed(2)}</span>
        </div>

        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-green-700 text-sm font-medium">You will save ₹{totalDiscount.toFixed(2)} on this order</p>
        </div>

        <Button
          onClick={handlePlaceAllItemsOrder}
          disabled={loading || cartItems.length === 0}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Placing Order...
            </>
          ) : (
            <>
              Place Order
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>

        {/* Trust Indicators */}
        <div className="pt-4 space-y-2">
          <div className="flex items-center text-xs text-gray-600">
            <Shield className="h-3 w-3 mr-2" />
            Safe and Secure Payments
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <Truck className="h-3 w-3 mr-2" />
            Free Delivery on orders above ₹499
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <ShoppingCart className="h-6 w-6 mr-3 text-gray-700" />
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
              <Badge variant="secondary" className="ml-3">
                {cartItems.length} items
              </Badge>
            </div>
            {cartItems.length > 0 && (
              <Button
                variant="outline"
                onClick={handleRemoveAllFromCart}
                disabled={loading}
                className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                Clear Cart
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItemCard key={item._id} item={item} />
                ))}
              </div>
            </div>

            {/* Price Summary - Desktop */}
            <div className="hidden lg:block">
              <PriceSummary />
            </div>
          </div>

          {/* Mobile Price Summary - Fixed Bottom */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-xl font-bold">₹{finalAmount.toFixed(2)}</p>
              </div>
              <Button
                onClick={handlePlaceAllItemsOrder}
                disabled={loading || cartItems.length === 0}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Place Order
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-green-600 text-center">
              You will save ₹{totalDiscount.toFixed(2)} on this order
            </p>
          </div>

          {/* Mobile Spacer */}
          <div className="lg:hidden h-24" />
        </div>
      </div>
    </>
  )
}

export default CartPage

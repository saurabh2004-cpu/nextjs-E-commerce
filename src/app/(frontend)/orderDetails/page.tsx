"use client"

import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axiosInstance from "../services/api"
import Navbar from "@/components/navbar/Navbar"
import Image from "next/image"
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Star,
  MessageCircle,
  ArrowLeft,
  Gift,
  Loader2,
  ShoppingBag,
  Calendar,
  CreditCard,
} from "lucide-react"

interface Order {
  _id: string
  status: string
  total: number
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  deliveryAddress?: {
    name: string
    address: string
    phone: string
  }
  rewards?: {
    amount: number
    description: string
  }
}

interface Product {
  name: string
  price: number
  imageUrl: string
  description: string
  _id: string
}

interface OrderItem {
  _id: string
  quantity: number
  product: Product
}

const OrderDetailsPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get("orderId")
  const [loading, setLoading] = useState(true)
  const [orderDetails, setOrderDetails] = useState<Order>()

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        toast({ description: "Invalid order ID", variant: "destructive" })
        router.push("/orders")
        return
      }

      setLoading(true)
      try {
        const response = await axiosInstance.get(`/api/get-order-details?orderId=${orderId}`)
        setOrderDetails(response.data.data)
      } catch (error) {
        console.error("Error fetching order details", error)
        toast({ description: "Error: Getting order details please try again", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId, router])

  const getStatusInfo = (status: string) => {
    const statusLower = status.toLowerCase()
    switch (statusLower) {
      case "pending":
        return { label: "Order Confirmed", icon: Clock, color: "bg-yellow-500", textColor: "text-yellow-600" }
      case "processing":
        return { label: "Processing", icon: Package, color: "bg-blue-500", textColor: "text-blue-600" }
      case "shipped":
        return { label: "On the way", icon: Truck, color: "bg-purple-500", textColor: "text-purple-600" }
      case "delivered":
        return { label: "Delivered", icon: CheckCircle, color: "bg-green-500", textColor: "text-green-600" }
      default:
        return { label: "Order Confirmed", icon: Clock, color: "bg-yellow-500", textColor: "text-yellow-600" }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const OrderTimeline = ({ status }: { status: string }) => {
    const steps = [
      { id: "confirmed", label: "Order Confirmed", icon: CheckCircle },
      { id: "processing", label: "Processing", icon: Package },
      { id: "shipped", label: "Shipped", icon: Truck },
      { id: "delivered", label: "Delivered", icon: CheckCircle },
    ]

    const getStepStatus = (stepId: string) => {
      const statusLower = status.toLowerCase()
      const stepIndex = steps.findIndex((step) => step.id === stepId)
      const currentIndex = steps.findIndex((step) => step.id === statusLower)

      if (stepIndex <= currentIndex) return "completed"
      if (stepIndex === currentIndex + 1) return "current"
      return "pending"
    }

    return (
      <div className="py-6">
        <h3 className="text-lg font-semibold mb-4">Order Timeline</h3>
        <div className="space-y-4">
          {steps.map((step, index) => {
            const stepStatus = getStepStatus(step.id)
            const StepIcon = step.icon

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center mr-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      stepStatus === "completed"
                        ? "bg-green-500 text-white"
                        : stepStatus === "current"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <StepIcon className="h-4 w-4" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-0.5 h-8 mt-2 ${stepStatus === "completed" ? "bg-green-500" : "bg-gray-200"}`} />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      stepStatus === "completed" || stepStatus === "current" ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                  {stepStatus === "current" && <p className="text-sm text-blue-600">In progress</p>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </>
    )
  }

  if (!orderDetails) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-6">We couldn&apos;t find the order details you&apos;re looking for.</p>
            <Button onClick={() => router.push("/orders")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </div>
        </div>
      </>
    )
  }

  const { items, status, total, updatedAt, createdAt } = orderDetails
  const statusInfo = getStatusInfo(status)
  const StatusIcon = statusInfo.icon

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <Button variant="ghost" onClick={() => router.push("/orders")} className="mb-4 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
                <p className="text-gray-600 mt-1">Order ID: {orderId}</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Badge variant="secondary" className="text-sm">
                  <StatusIcon className="h-4 w-4 mr-1" />
                  {statusInfo.label}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <StatusIcon className={`h-5 w-5 mr-2 ${statusInfo.textColor}`} />
                    {statusInfo.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        {status.toLowerCase() === "delivered" && "Delivered on "}
                        {status.toLowerCase() === "pending" && "Order placed on "}
                        {formatDate(status.toLowerCase() === "delivered" ? updatedAt : createdAt)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {status.toLowerCase() === "delivered"
                          ? "Your item has been delivered"
                          : "Your item will be delivered soon"}
                      </p>
                    </div>
                  </div>
                  <OrderTimeline status={status} />
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div key={item._id}>
                        <div className="flex space-x-4">
                          <div className="flex-shrink-0">
                            {item.product?.imageUrl ? (
                              <Image
                                src={item.product.imageUrl || "/placeholder.svg"}
                                alt={item.product.name || "Product"}
                                width={80}
                                height={80}
                                className="w-20 h-20 object-cover rounded-lg border"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-lg border">
                                <ShoppingBag className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900">{item.product?.name || "Product Name"}</h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {item.product?.description || "No description available"}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                                <span className="font-semibold text-gray-900">₹{item.product?.price || "0"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {index < items.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  {/* Order Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" className="flex items-center bg-transparent">
                      <Star className="h-4 w-4 mr-2" />
                      Rate & Review
                    </Button>
                    <Button variant="outline" className="flex items-center bg-transparent">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat with us
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-semibold">{orderDetails.deliveryAddress?.name || "Saurabh Bodakhe"}</p>
                    <p className="text-sm text-gray-600">
                      {orderDetails.deliveryAddress?.address ||
                        "Puntamba Rahta Subdistrict, Ahmadnagar District - 413707, Maharashtra"}
                    </p>
                    <div className="flex items-center mt-3">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {orderDetails.deliveryAddress?.phone || "8010566607"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rewards */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gift className="h-5 w-5 mr-2" />
                    Your Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Gift className="h-6 w-6 text-yellow-600" />
                    </div>
                    <p className="font-semibold text-lg">{orderDetails.rewards?.amount || 6} SuperCoins Cashback</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {orderDetails.rewards?.description || "Use it to save on your next order"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Order Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Order Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date</span>
                      <span>{formatDate(createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID</span>
                      <span className="font-mono text-xs">{orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method</span>
                      <span>Cash on Delivery</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderDetailsPage

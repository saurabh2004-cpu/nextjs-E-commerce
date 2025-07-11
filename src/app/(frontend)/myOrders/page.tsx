"use client"

import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import axiosInstance from "../services/api"
import Navbar from "@/components/navbar/Navbar"
import {
  MoreVertical,
  Search,
  Filter,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Calendar,
  Loader2,
  ShoppingBag,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

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

interface Order {
  _id: string
  status: string
  total: number
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [timeFilter, setTimeFilter] = useState<string[]>([])
  const [noOrders, setNoOrders] = useState(false)
  const router = useRouter()

  const statusOptions = [
    { value: "pending", label: "Pending", icon: Clock, color: "bg-yellow-500" },
    { value: "processing", label: "Processing", icon: Package, color: "bg-blue-500" },
    { value: "shipped", label: "On the way", icon: Truck, color: "bg-purple-500" },
    { value: "delivered", label: "Delivered", icon: CheckCircle, color: "bg-green-500" },
    { value: "cancelled", label: "Cancelled", icon: XCircle, color: "bg-red-500" },
  ]

  const timeOptions = [
    { value: "30days", label: "Last 30 days" },
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" },
    { value: "2022", label: "2022" },
    { value: "2021", label: "2021" },
    { value: "older", label: "Older" },
  ]

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get("/api/get-all-orders")
      if (!response.data?.data) {
        setNoOrders(true)
        return
      }
      setOrders(response.data.data)
      setFilteredOrders(response.data.data)
    } catch (error) {
      console.error("Error while fetching the orders", error)
      toast({ description: "Error: Could not fetch orders", variant: "destructive" })
      setNoOrders(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    let filtered = orders

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((order) =>
        order.items.some((item) => item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by status
    if (statusFilter.length > 0) {
      filtered = filtered.filter((order) => statusFilter.includes(order.status.toLowerCase()))
    }

    // Filter by time (simplified logic)
    if (timeFilter.length > 0) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt)
        const now = new Date()

        return timeFilter.some((filter) => {
          if (filter === "30days") {
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            return orderDate >= thirtyDaysAgo
          }
          if (filter === "2024" || filter === "2023" || filter === "2022" || filter === "2021") {
            return orderDate.getFullYear().toString() === filter
          }
          if (filter === "older") {
            return orderDate.getFullYear() < 2021
          }
          return false
        })
      })
    }

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter, timeFilter])

  const handleCancelOrder = async (orderId: string) => {
    try {
      const response = await axiosInstance.post("/api/cancel-order", { orderId })
      if (response.data) {
        toast({ description: "Order successfully canceled" })
        setOrders(orders.filter((order) => order._id !== orderId))
      }
    } catch (error) {
      console.error("Error while canceling order", error)
      toast({ description: "Error: Could not cancel order", variant: "destructive" })
    }
  }

  const handleGetOrderDetails = (orderId: string) => {
    router.push(`/orderDetails?orderId=${encodeURIComponent(orderId)}`)
  }

  const getStatusInfo = (status: string) => {
    const statusLower = status.toLowerCase()
    return statusOptions.find((option) => option.value === statusLower) || statusOptions[0]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const handleFilterChange = (type: "status" | "time", value: string, checked: boolean) => {
    if (type === "status") {
      setStatusFilter((prev) => (checked ? [...prev, value] : prev.filter((item) => item !== value)))
    } else {
      setTimeFilter((prev) => (checked ? [...prev, value] : prev.filter((item) => item !== value)))
    }
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Package className="h-4 w-4 mr-2" />
          Order Status
        </h3>
        <div className="space-y-3">
          {statusOptions.map((option) => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={statusFilter.includes(option.value)}
                onChange={(e) => handleFilterChange("status", option.value, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${option.color}`} />
                <span className="text-sm text-gray-700">{option.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          Order Time
        </h3>
        <div className="space-y-3">
          {timeOptions.map((option) => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={timeFilter.includes(option.value)}
                onChange={(e) => handleFilterChange("time", option.value, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <Button
          variant="outline"
          onClick={() => {
            setStatusFilter([])
            setTimeFilter([])
            setSearchTerm("")
          }}
          className="w-full"
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  )

  const OrderCard = ({ order }: { order: Order }) => {
    const statusInfo = getStatusInfo(order.status)
    const StatusIcon = statusInfo.icon

    return (
      <Card className="mb-4 overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-0">
          {/* Order Header */}
          <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${statusInfo.color}`} />
              <div>
                <p className="font-semibold text-gray-900 capitalize">{order.status}</p>
                <p className="text-sm text-gray-600">
                  {order.status.toLowerCase() === "delivered" && "Delivered on "}
                  {order.status.toLowerCase() === "cancelled" && "Cancelled on "}
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleGetOrderDetails(order._id)}>View Details</DropdownMenuItem>
                {order.status.toLowerCase() === "pending" && (
                  <DropdownMenuItem onClick={() => handleCancelOrder(order._id)} className="text-red-600">
                    Cancel Order
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Order Items */}
          <div className="p-4">
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item._id} className="flex space-x-4">
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
                    <h3 className="font-semibold text-gray-900 truncate">{item.product?.name || "Product Name"}</h3>
                    <p className="text-sm text-gray-600 mt-1">Qty: {item.quantity}</p>
                    <p className="font-semibold text-gray-900 mt-2">₹{item.product?.price || "0"}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Actions */}
            <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row gap-3">
              <Button variant="outline" size="sm" className="flex items-center bg-transparent">
                <Star className="h-4 w-4 mr-2" />
                Rate & Review
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleGetOrderDetails(order._id)}>
                Track Order
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </>
    )
  }

  if (noOrders) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven&apos;t placed any orders yet. Start shopping to see your orders here!
            </p>
            <Button onClick={() => router.push("/")}>Start Shopping</Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-600">Track and manage your orders</p>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search your orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {/* Mobile Filter Sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {(statusFilter.length > 0 || timeFilter.length > 0) && (
                      <Badge variant="secondary" className="ml-2">
                        {statusFilter.length + timeFilter.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filter Orders</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-80">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-6 flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                    {(statusFilter.length > 0 || timeFilter.length > 0) && (
                      <Badge variant="secondary" className="ml-2">
                        {statusFilter.length + timeFilter.length}
                      </Badge>
                    )}
                  </h2>
                  <FilterContent />
                </CardContent>
              </Card>
            </aside>

            {/* Orders List */}
            <main className="flex-1">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-600">
                    {searchTerm || statusFilter.length > 0 || timeFilter.length > 0
                      ? "Try adjusting your search or filters"
                      : "You haven't placed any orders yet"}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-600">
                      Showing {filteredOrders.length} of {orders.length} orders
                    </p>
                  </div>
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <OrderCard key={order._id} order={order} />
                    ))}
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrdersPage

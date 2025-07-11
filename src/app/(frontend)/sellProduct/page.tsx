"use client"
import SellerNavBar from "@/components/comps/SellerNavbar"
import type React from "react"
import { useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Loader2,
  ImagePlus,
  Upload,
  X,
  ArrowLeft,
  Package,
  Tag,
  Palette,
  Monitor,
  Smartphone,
  Shirt,
} from "lucide-react"
import { useRouter } from "next/navigation"
import axiosInstance from "../services/api"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"
import { useMutation } from "@tanstack/react-query"

interface ProductFormData {
  name: string
  price: number
  description: string
  category: string
  stock: number
  keywords: string
  highlight: string
  color?: string
  ram?: number
  storage?: number
  battery?: number
  displaySize?: number
  launchYear?: number
  hdTechnology?: string
  clotheSize?: string
  clotheColor?: string
}

const Page = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [productImage, setProductImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [productCategory, setProductCategory] = useState<string | null>("")

  const form = useForm({
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      category: "",
      stock: 0,
      keywords: "",
      imageUrl: "",
      highlight: "",
      ram: undefined,
      storage: undefined,
      color: "",
      battery: undefined,
      displaySize: undefined,
      launchYear: undefined,
      hdTechnology: "",
      clotheSize: "",
      clotheColor: "",
    },
  })

  const { mutate, isError, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      setIsSubmitting(true)
      return await axiosInstance.post("/api/create-product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    },
    onSuccess: (response) => {
      console.log("Success:", response.data)
      toast({
        description: "Product created successfully!",
      })
      router.replace(`/get-product?productId=${encodeURIComponent(response.data.data._id)}`)
    },
    onError: (error) => {
      console.error("Error:", error)
      toast({
        description: "Error While Creating New Product",
        variant: "destructive",
      })
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  if (isPending) {
    setIsSubmitting(true)
  }

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("price", data.price.toString())
    formData.append("description", data.description)
    formData.append("category", data.category)
    formData.append("stock", data.stock.toString())
    formData.append("keywords", data.keywords)
    formData.append("highlight", data.highlight)

    if (!productImage) {
      toast({ description: "Please select a thumbnail image for the product" })
      setIsSubmitting(false)
      return
    }
    formData.append("imageUrl", productImage)

    // Category-specific fields
    if (data.category === "mobiles and tablets") {
      if (!data.color || !data.ram || !data.storage || !data.battery) {
        toast({ description: "Please fill out all product details" })
        setIsSubmitting(false)
        return
      }
      formData.append("ram", data.ram.toString())
      formData.append("storage", data.storage.toString())
      formData.append("color", data.color)
      formData.append("battery", data.battery.toString())
    }

    if (data.category === "tv and appliances") {
      if (!data.displaySize || !data.launchYear || !data.hdTechnology) {
        toast({ description: "Please fill out all product details" })
        setIsSubmitting(false)
        return
      }
      formData.append("displaySize", data.displaySize.toString())
      formData.append("launchYear", data.launchYear.toString())
      formData.append("hdTechnology", data.hdTechnology)
    }

    if (data.category === "fashion") {
      if (!data.clotheSize || !data.clotheColor) {
        toast({ description: "Please fill out all product details" })
        setIsSubmitting(false)
        return
      }
      formData.append("clotheSize", data.clotheSize)
      formData.append("clotheColor", data.clotheColor)
    }

    mutate(formData)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProductImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setProductImage(null)
    setImagePreview(null)
  }

  const categories = [
    { value: "mobiles and tablets", label: "Mobiles and Tablets", icon: Smartphone },
    { value: "tv and appliances", label: "TV and Appliances", icon: Monitor },
    { value: "fashion", label: "Fashion", icon: Shirt },
    { value: "beauty", label: "Beauty", icon: Palette },
    { value: "home and kitchen", label: "Home and Kitchen", icon: Package },
    { value: "furniture", label: "Furniture", icon: Package },
    { value: "travel", label: "Travel", icon: Package },
    { value: "grocery", label: "Grocery", icon: Package },
    { value: "electronics", label: "Electronics", icon: Package },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <SellerNavBar display={"hidden"} />

      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b shadow-sm sticky top-16 z-40">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold text-gray-900">Add New Product</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        {/* Desktop Header */}
        <div className="hidden lg:block mb-8">
          <div className="flex items-center space-x-4 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
              <p className="text-gray-600">Create a new product listing for your store</p>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 lg:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Image Upload Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <ImagePlus className="h-5 w-5 text-blue-600" />
                    <span>Product Image</span>
                  </h3>

                  <FormField
                    name="imageUrl"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-4">
                          {!imagePreview ? (
                            <label className="group relative flex flex-col items-center justify-center w-full h-48 lg:h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-10 h-10 mb-3 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                                <p className="mb-2 text-sm text-gray-500 group-hover:text-gray-700">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                              </div>
                              <Input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                            </label>
                          ) : (
                            <div className="relative">
                              <div className="relative w-full h-48 lg:h-64 rounded-xl overflow-hidden bg-gray-100">
                                <Image
                                  src={imagePreview || "/placeholder.svg"}
                                  alt="Product Preview"
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={removeImage}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <Badge className="absolute top-2 right-2 bg-green-500">Image Selected</Badge>
                            </div>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Tag className="h-5 w-5 text-blue-600" />
                    <span>Basic Information</span>
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FormField
                      name="name"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Product Name</FormLabel>
                          <Input
                            placeholder="Enter product name"
                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="price"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Price (₹)</FormLabel>
                          <Input
                            type="number"
                            placeholder="0.00"
                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Description</FormLabel>
                        <Textarea
                          placeholder="Describe your product in detail..."
                          className="min-h-[100px] border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FormField
                      name="category"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Category</FormLabel>
                          <Select
                            onValueChange={(value: string) => {
                              setProductCategory(value)
                              field.onChange(value)
                            }}
                            value={field.value}
                          >
                            <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                  <div className="flex items-center space-x-2">
                                    <category.icon className="h-4 w-4" />
                                    <span>{category.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="stock"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Stock Quantity</FormLabel>
                          <Input
                            type="number"
                            placeholder="0"
                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Category-specific fields */}
                {productCategory === "mobiles and tablets" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                      <Smartphone className="h-5 w-5 text-blue-600" />
                      <span>Mobile & Tablet Specifications</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        name="ram"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">RAM (GB)</FormLabel>
                            <Input
                              type="number"
                              placeholder="4"
                              className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="storage"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Storage (GB)</FormLabel>
                            <Input
                              type="number"
                              placeholder="64"
                              className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="color"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Color</FormLabel>
                            <Input
                              placeholder="Black, White, Blue..."
                              className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="battery"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Battery (mAh)</FormLabel>
                            <Input
                              type="number"
                              placeholder="4000"
                              className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {productCategory === "tv and appliances" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                      <Monitor className="h-5 w-5 text-blue-600" />
                      <span>TV & Appliance Specifications</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        name="displaySize"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Display Size (inches)</FormLabel>
                            <Input
                              type="number"
                              placeholder="32"
                              className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="launchYear"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Launch Year</FormLabel>
                            <Input
                              type="number"
                              placeholder="2024"
                              className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="hdTechnology"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel className="text-sm font-medium text-gray-700">HD Technology</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                                <SelectValue placeholder="Select display type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Full HD">Full HD</SelectItem>
                                <SelectItem value="HD Ready">HD Ready</SelectItem>
                                <SelectItem value="Ultra HD (4k)">Ultra HD (4K)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {productCategory === "fashion" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                      <Shirt className="h-5 w-5 text-blue-600" />
                      <span>Fashion Specifications</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        name="clotheSize"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Size</FormLabel>
                            <Input
                              placeholder="S, M, L, XL..."
                              className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="clotheColor"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Color</FormLabel>
                            <Input
                              placeholder="Red, Blue, Green..."
                              className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>

                  <FormField
                    name="highlight"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Key Highlights</FormLabel>
                        <Textarea
                          placeholder="Key features and highlights of your product..."
                          className="min-h-[80px] border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="keywords"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Keywords <span className="text-gray-500">(comma separated)</span>
                        </FormLabel>
                        <Input
                          placeholder="smartphone, android, camera, gaming..."
                          className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Add relevant keywords to help customers find your product
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t">
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="animate-spin h-4 w-4" />
                        <span>Creating Product...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4" />
                        <span>Create Product</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Page

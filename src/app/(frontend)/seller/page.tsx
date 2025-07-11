"use client"
import SellerNavBar from "@/components/comps/SellerNavbar"
import SellerFooter from "@/components/footer/SellerFooter"
import { useSelector } from "react-redux"
import type { RootState } from "../store/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  CreditCard,
  Briefcase,
  Phone,
  ShoppingBag,
  ArrowRight,
  Star,
  TrendingUp,
  Shield,
  Zap,
  Globe,
} from "lucide-react"
import Image from "next/image"

const Page = () => {
  const userData = useSelector((state: RootState) => state.user.userData)
  console.log("userdata", userData)

  const benefits = [
    {
      icon: Users,
      title: "45+ Crore Customers",
      description: "Reach millions of customers across India",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: CreditCard,
      title: "7* Days Secure Payments",
      description: "Regular and secure payment cycles",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Briefcase,
      title: "Low Cost Business",
      description: "Minimal investment, maximum returns",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Phone,
      title: "One Click Support",
      description: "24/7 dedicated seller support",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: ShoppingBag,
      title: "Big Billion Days Access",
      description: "Participate in major shopping festivals",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ]

  const features = [
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Your business data is safe with us",
    },
    {
      icon: Zap,
      title: "Quick Setup",
      description: "Start selling in just 15 minutes",
    },
    {
      icon: Globe,
      title: "Pan India Reach",
      description: "Sell across all states and cities",
    },
    {
      icon: TrendingUp,
      title: "Growth Analytics",
      description: "Track your business performance",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <SellerNavBar display={"hidden"} />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="text-sm text-gray-500 flex items-center space-x-2">
            <a href="/" className="hover:text-blue-600 transition-colors duration-200">
              Home
            </a>
            <ArrowRight className="h-3 w-3" />
            <span className="text-gray-900 font-medium">Sell Online</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Hero Section */}
        <div className="relative mb-12 lg:mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-5"></div>
          <Card className="relative border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Left Content */}
                <div className="p-6 lg:p-12 flex flex-col justify-center">
                  <div className="space-y-6">
                    <div>
                      <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        ✨ Start Your Journey
                      </Badge>
                      <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent leading-tight">
                        Sell Online with{" "}
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          Mykart
                        </span>
                      </h1>
                      <p className="text-lg text-gray-600 mt-4 leading-relaxed">
                        Join millions of sellers and grow your business with India&apos;s leading e-commerce platform. Start
                        selling today and reach customers across the country.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        asChild
                      >
                        <a href="/sellProduct" className="flex items-center space-x-2">
                          <span>Start Selling Now</span>
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-2 hover:bg-gray-50 transition-all duration-300 bg-transparent"
                      >
                        Learn More
                      </Button>
                    </div>

                    <div className="flex items-center space-x-6 pt-4">
                      <div className="flex items-center space-x-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">4.8/5 Seller Rating</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-900">10L+</span> Active Sellers
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Image */}
                <div className="relative lg:p-8">
                  <div className="relative h-64 lg:h-full min-h-[300px] rounded-2xl overflow-hidden">
                    {/* <Image
                      src="https://static-assets-web.flixcart.com/fk-sp-static/images/prelogin/banner/Desktop_sell.webp"
                      alt="Sell Online with Mykart"
                      fill
                      className="object-cover"
                      priority
                    /> */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mb-12 lg:mb-16">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose Mykart?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of successful sellers who trust Mykart for their online business growth
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`inline-flex p-4 rounded-2xl ${benefit.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <benefit.icon className={`h-8 w-8 ${benefit.color}`} />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-12 lg:mb-16">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4">Everything You Need to Succeed</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful tools and features designed to help you grow your online business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white/60 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
          <CardContent className="p-8 lg:p-12 text-center relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h2 className="text-2xl lg:text-4xl font-bold mb-4">Ready to Start Your Success Story?</h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                Join over 10 lakh sellers who are already growing their business with Mykart. Start your journey today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  asChild
                >
                  <a href="/sellProduct" className="flex items-center space-x-2">
                    <span>Get Started Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300 bg-transparent"
                >
                  Contact Sales
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <SellerFooter />
    </div>
  )
}

export default Page

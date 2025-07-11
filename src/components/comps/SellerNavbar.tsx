"use client"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Menu, ChevronDown, ShoppingBag, CreditCard, TrendingUp, BookOpen, Home, Store } from "lucide-react"

interface SellerNavBarProps {
  display: string
}

const SellerNavBar: React.FC<SellerNavBarProps> = ({ display }) => {
  const [showDropdown, setShowDropdown] = useState<number | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openCollapsible, setOpenCollapsible] = useState<number | null>(null)

  const handleMouseEnter = (index: number) => {
    setShowDropdown(index)
  }

  const handleMouseLeave = () => {
    setShowDropdown(null)
  }

  const toggleCollapsible = (index: number) => {
    setOpenCollapsible(openCollapsible === index ? null : index)
  }

  const menuItems = [
    {
      title: "Sell Online",
      icon: ShoppingBag,
      items: [
        { name: "Sell Product", endpoint: "/sellProduct" },
        { name: "Account", endpoint: "/sellerProfile" },
        { name: "List Products", endpoint: "/sellerProductsList" },
      ],
    },
    {
      title: "Fees and Commission",
      icon: CreditCard,
      items: [
        { name: "Payment Cycle", endpoint: "/payment-cycle" },
        { name: "Fee Type", endpoint: "/fee-type" },
        { name: "Calculate Gross Margin", endpoint: "/calculate-gross-margin" },
      ],
    },
    {
      title: "Grow",
      icon: TrendingUp,
      items: [
        { name: "FAssured badge", endpoint: "/fassured-badge" },
        { name: "Insights & Tools", endpoint: "/insights-tools" },
        { name: "Mykart Ads", endpoint: "/Mykart-ads" },
        { name: "Mykart Value Services", endpoint: "/Mykart-value-services" },
        { name: "Shopping Festivals", endpoint: "/shopping-festivals" },
        { name: "Service Partners", endpoint: "/service-partners" },
      ],
    },
    {
      title: "Learn",
      icon: BookOpen,
      items: [
        { name: "FAQs", endpoint: "/faqs" },
        { name: "Seller Success Stories", endpoint: "/seller-success-stories" },
        { name: "Seller Blogs", endpoint: "/seller-blogs" },
      ],
    },
  ]

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <a href="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg group-hover:shadow-lg transition-all duration-300">
                <Store className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Mykart
                </span>
                <div className="text-xs text-gray-500 -mt-1">Seller Hub</div>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((menuItem, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium">
                  <menuItem.icon className="h-4 w-4" />
                  <span>{menuItem.title}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>

                {showDropdown === index && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    {menuItem.items.map((item, idx) => (
                      <a
                        key={idx}
                        href={item.endpoint}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button
              className={`${display} bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
              asChild
            >
              <a href="/sellProduct">Start Selling</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <SheetHeader className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                  <SheetTitle className="flex items-center space-x-2">
                    <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                      <Store className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Mykart
                      </div>
                      <div className="text-xs text-gray-500 -mt-1">Seller Hub</div>
                    </div>
                  </SheetTitle>
                </SheetHeader>

                <div className="p-4 space-y-2">
                  {/* Home Link */}
                  <a
                    href="/"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Home className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-700">Home</span>
                  </a>

                  {/* Menu Items */}
                  {menuItems.map((menuItem, index) => (
                    <Collapsible
                      key={index}
                      open={openCollapsible === index}
                      onOpenChange={() => toggleCollapsible(index)}
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex items-center space-x-3">
                          <menuItem.icon className="h-5 w-5 text-gray-600" />
                          <span className="font-medium text-gray-700">{menuItem.title}</span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                            openCollapsible === index ? "rotate-180" : ""
                          }`}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="ml-8 mt-1 space-y-1">
                        {menuItem.items.map((item, idx) => (
                          <a
                            key={idx}
                            href={item.endpoint}
                            className="block p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.name}
                          </a>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ))}

                  {/* Shopsy Link */}
                  <a
                    href="#"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ShoppingBag className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-700">Shopsy</span>
                  </a>
                </div>

                {/* Mobile CTA Button */}
                <div className="p-4 border-t bg-gray-50">
                  <Button
                    className={`${display} w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                    asChild
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <a href="/sellProduct">Start Selling</a>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default SellerNavBar

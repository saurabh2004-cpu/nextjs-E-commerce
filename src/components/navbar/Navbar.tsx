// components/Navbar.tsx

"use client"

import React, { useEffect, useState } from "react"
import { Search, User, ShoppingCart, Store, MoreVertical, Box, Heart, Gift, Star, Loader2, LucideIcon, StoreIcon, Menu, X, Bell, MapPin } from 'lucide-react'
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { signOut, useSession } from "next-auth/react"
import axiosInstance from "@/app/(frontend)/services/api"
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "@/app/(frontend)/store/userSlice"
import { useRouter, useSearchParams } from "next/navigation"
import 'nprogress/nprogress.css';
import NProgress from 'nprogress';
import { RootState } from "@/app/(frontend)/store/store"
import { useQuery } from "@tanstack/react-query"
import { useDebounceCallback } from 'usehooks-ts'

interface UserData {
  username?: string;
}

const Navbar = () => {
  const [loading, setloading] = useState(false)
  const [userData, setUserData] = useState<UserData>({})
  const [authorized, setAuthorized] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  
  const dispatch = useDispatch()
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user;

  const userFromStore = useSelector((state: RootState) => state.user.userData)
  let username = user?.username

  // React queries
  const fetchCurrentUserDetails = async () => {
    NProgress.start();
    const response = await axiosInstance.get('/api/current-user')
    setUserData(response.data.data)
    dispatch(setUser(response.data.data))
    NProgress.done();
    return response.data.data
  }

  const { isLoading, error, data: currentUserData } = useQuery({
    queryKey: ['currentUserData'],
    queryFn: fetchCurrentUserDetails,
    staleTime: 10000,
    enabled: !!user
  })

  useEffect(() => {
    if (user) {
      setAuthorized(true)
    }

    if (userFromStore) {
      setUserData(userFromStore)
      // username = userData?.username
    }
  }, [user, userFromStore])

  // Mock cart count - replace with actual cart logic
  useEffect(() => {
    setCartCount(3) // Mock count
  }, [])

  const handleLogin = () => {
    if (!user || !userData || !authorized) {
      router.replace('/sign-in')
    }
  }

  const handleSignOut = async () => {
    setloading(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setloading(false);
    }
  };

  const handleButtonClick = (link: string) => {
    setIsMobileMenuOpen(false) // Close mobile menu when navigating
    
    if (authorized === true) {
      router.push(link)
      
      if (link === '/userProfile') {
        setloading(true)
        router.push(`userProfile?wishlist=${encodeURIComponent('My Wishlist')}`)
        setloading(false)
      }
    } else {
      router.push("/sign-up")
    }
  }

  const debounced = useDebounceCallback((value: string) => {
    setSearchQuery(value)
    // Mock search suggestions
    if (value.length > 2) {
      setSearchSuggestions([
        `${value} phones`,
        `${value} laptops`,
        `${value} headphones`,
        `${value} accessories`
      ])
    } else {
      setSearchSuggestions([])
    }
  }, 300)

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`)
      setIsSearchFocused(false)
      setSearchSuggestions([])
    }
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4">
          {/* Main navbar */}
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2 group">
                <StoreIcon className="h-6 w-6 text-blue-600 group-hover:text-blue-700 transition-colors" />
                <span className="font-bold text-xl text-blue-600 group-hover:text-blue-700 transition-colors">
                  Mykart
                </span>
              </Link>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-6 relative">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search for Products, Brands and More"
                  className={cn(
                    "w-full pl-10 pr-12 py-3 border-2 rounded-lg transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                    isSearchFocused ? "shadow-lg" : "shadow-sm"
                  )}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  onChange={(e) => debounced(e.target.value)}
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </div>
              
              {/* Search Suggestions */}
              {isSearchFocused && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10">
                  {searchSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                      onClick={() => {
                        setSearchQuery(suggestion)
                        handleSearch()
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-gray-400" />
                        <span>{suggestion}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 ">
              {/* User Menu */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="flex  items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                      <User className="h-5 w-5" />
                      {loading ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : (
                        <span className="font-medium">
                          {session?.user && userData?.username || username || 'Login'}
                        </span>
                      )}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="p-4 min-w-64">
                      {!session && (
                        <div className="flex justify-between items-center mb-4 p-2 bg-gray-50 rounded">
                          <span className="text-sm">New customer?</span>
                          <Link href="/sign-up" className="text-blue-600 hover:text-blue-700 font-medium">
                            Sign Up
                          </Link>
                        </div>
                      )}
                      <ul className="space-y-1">
                        <DropdownItem 
                          href="#" 
                          icon={User} 
                          label="My Profile" 
                          onClick={() => handleButtonClick("/userProfile")}
                        />
                        <DropdownItem 
                          href="#" 
                          icon={Star} 
                          label="Flipkart Plus Zone" 
                          onClick={() => handleButtonClick("#")}
                        />
                        <DropdownItem 
                          href="/myOrders" 
                          icon={Box} 
                          label="Orders" 
                          onClick={() => handleButtonClick("/myOrders")}
                        />
                        <DropdownItem 
                          href="/userProfile" 
                          icon={Heart} 
                          label="Wishlist" 
                          onClick={() => handleButtonClick("/userProfile")}
                        />
                        
                        {session?.user && (
                          <li className="pt-2 border-t">
                            <button
                              onClick={handleSignOut}
                              className="flex items-center space-x-2 w-full text-left text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
                            >
                              <span>Logout</span>
                            </button>
                          </li>
                        )}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* Cart */}
              <Link href="/cart" className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                  <div className="relative">
                    <ShoppingCart className="h-6 w-6" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span className="font-medium">Cart</span>
                </button>
              </Link>

              {/* Become a Seller */}
              <Link href="/seller">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                  <Store className="h-5 w-5" />
                  <span className="font-medium">Become a Seller</span>
                </button>
              </Link>

              {/* More Menu */}
              <button className="text-gray-700 hover:text-blue-600 transition-colors">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <Link href="/cart" className="relative">
                <ShoppingCart className="h-6 w-6 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={toggleMobileMenu}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for Products, Brands and More"
                className="w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => debounced(e.target.value)}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMobileMenu} />
      )}

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out",
        isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button onClick={toggleMobileMenu} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          {/* User Section */}
          <div className="border-b pb-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">
                  {session?.user && userData?.username || username || 'Guest'}
                </p>
                {!session && (
                  <Link href="/sign-in" className="text-blue-600 text-sm hover:underline">
                    Login / Sign Up
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-2">
            <MobileMenuItem icon={User} label="My Profile" onClick={() => handleButtonClick("/userProfile")} />
            <MobileMenuItem icon={Box} label="Orders" onClick={() => handleButtonClick("/myOrders")} />
            <MobileMenuItem icon={Heart} label="Wishlist" onClick={() => handleButtonClick("/userProfile")} />
            <MobileMenuItem icon={Gift} label="Rewards" onClick={() => handleButtonClick("#")} />
            <MobileMenuItem icon={Store} label="Become a Seller" onClick={() => handleButtonClick("/seller")} />
            <MobileMenuItem icon={Bell} label="Notifications" onClick={() => handleButtonClick("#")} />
            <MobileMenuItem icon={MapPin} label="My Address" onClick={() => handleButtonClick("#")} />
          </div>

          {/* Logout */}
          {session?.user && (
            <div className="pt-4 border-t">
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-3 w-full text-left text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
              >
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

interface DropdownItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ href, icon: Icon, label, onClick }) => {
  return (
    <li>
      <button
        onClick={onClick}
        className="flex items-center space-x-3 w-full text-left text-gray-700 hover:bg-gray-100 p-2 rounded transition-colors"
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </button>
    </li>
  )
}

interface MobileMenuItemProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

const MobileMenuItem: React.FC<MobileMenuItemProps> = ({ icon: Icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-3 w-full text-left text-gray-700 hover:bg-gray-100 p-3 rounded-lg transition-colors"
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  )
}

export default Navbar
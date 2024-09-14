// components/Navbar.tsx

"use client"

import React, { useEffect, useState } from "react"
import { Search, User, ShoppingCart, Store, MoreVertical, Box, Heart, Gift, Star, Loader2 } from 'lucide-react'
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
import { useRouter } from "next/navigation"
import 'nprogress/nprogress.css';
import NProgress from 'nprogress';


const Navbar = () => {
  const [loading, setloading] = useState(false)
  const { data: session } = useSession()
  const [userData, setUserData] = useState()
  const [authorized,setAuthorized] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()
  const user = session?.user;

  const userFromStore = useSelector(state=>state.user.userData)
  console.log("userdata",userFromStore)


  useEffect(() => {

    if (user) {
      setAuthorized(true)
    }

    if(userFromStore){
      setUserData(userFromStore)
    }
  }, [user,userFromStore])

  
  const fetchCurrentUserDetails = async () => {
    NProgress.start();
    const response = await axiosInstance.get('http://localhost:3000/api/current-user')

    if (!response) {
      console.log("error while fetching current user")
    }

    setUserData(response.data.data)
    dispatch(setUser(response.data.data))

    console.log("current user", response.data.data)
    NProgress.done();
  }
  useEffect(() => {

    if(authorized===true && userFromStore=== null  ){
      fetchCurrentUserDetails() 
    }
    console.log("unauthorized")
  }, [user,userFromStore])

  const handleLogin = () => {
   if(!user){
    router.replace('/sign-in')
   }
  }

  const handleSignOut = async () => {
    setloading(true);
    try {
      await signOut({ callbackUrl: "/" }); // NextAuth signOut with redirect
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setloading(false);
    }
  };

  const handleButtonClick = (link: string) => {
    
    if(authorized===true){
      router.push(link)

      if(link ==='/userProfile' ){
        setloading(true)
        router.push(`userProfile?wishlist=${encodeURIComponent('My Wishlist')}`)
        setloading(false)
      }
    }
    else{
      router.push("/sign-up")
    }

  }

  return (
    <nav className="bg-white shadow-md py-2">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <a href="/">
            <span className="font-bold text-blue-600">Flipkart</span>
            <span className="text-xs text-gray-500">
              Explore <span className="text-yellow-500">Plus</span>
            </span>
          </a>
        </div>
        <div className="flex-grow mx-4 relative">
          <Search className="absolute left-3 top-2.5 text-gray-500" />
          <input
            type="text"
            placeholder="Search for Products, Brands and More"
            className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring"
          // onSubmit={handleSearch}
          />
        </div>
        <button type="submit">Search</button>
        <div className="flex items-center space-x-4 z-20">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center space-x-1 text-gray-600">
                  <User className="h-5 w-5" />
                  {loading && <Loader2 className="animate-spin" /> ||
                    <span onClick={handleLogin}>{session?.user && userData?.username || 'login'} </span>
                  }
                </NavigationMenuTrigger>
                <NavigationMenuContent className="p-4 ">
                  {!userData && <div className="flex justify-between items-center mb-2">
                    <span>New customer?</span>
                    <Link href="/sign-up" className="text-blue-600">Sign Up</Link>
                  </div>}
                  <ul className="space-y-2 w-60 z-50">
                    <div onClick={()=>handleButtonClick("/userProfile")}><DropdownItem href="#" icon={User} label="My Profile"  /></div>
                    <div onClick={()=>handleButtonClick("#")}> <DropdownItem href="#" icon={Star} label="Flipkart Plus Zone" /></div>
                    <div onClick={()=>handleButtonClick("/myOrders")}> <DropdownItem href="/myOrders" icon={Box} label="Orders" /></div>
                    <div onClick={()=>handleButtonClick("/userProfile")}> <DropdownItem href="/userProfile" icon={Heart} label="Wishlist" /></div>
                    <div onClick={()=>handleButtonClick("#")}> <DropdownItem href="#" icon={Gift} label="Rewards" /></div>
                    <div onClick={()=>handleButtonClick("#")}> <DropdownItem href="#" icon={Gift} label="Gift Cards" /></div>
                    {session?.user && (
                      <li>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center space-x-2 text-gray-600 hover:bg-red-500 hover:text-white p-2 rounded"
                        >
                          {/* <Gift className="h-5 w-5" /> */}
                          <span>Logout</span>
                        </button>
                      </li>
                    )}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <button className="flex items-center space-x-1 text-gray-600">
            <a href="/myCart"><ShoppingCart className="h-5 w-5" /></a>
            <div onClick={()=>handleButtonClick("/cart")}><a href="/cart"><span>Cart</span></a></div>
          </button>
          <button className="flex items-center space-x-1 text-gray-600">
            <Store className="h-5 w-5" />
            <div onClick={()=>handleButtonClick("/seller")}><a href="/seller"><span>Become a Seller</span></a></div>
          </button>
          <button className="flex items-center space-x-1 text-gray-600">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  )
}

const DropdownItem = ({ href, icon: Icon, label }) => {
  return (
    <li>
      <Link href={href} className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 p-2 rounded">
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </Link>
    </li>
  )
}

export default Navbar

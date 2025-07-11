"use client"

import "./utilty.css"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { signUpSchema } from "@/schemas/signupSchema"
import {
  Loader2,
  User,
  MapPin,
  CreditCard,
  Gift,
  Heart,
  Bell,
  Star,
  LogOut,
  Edit3,
  Save,
  X,
  Package,
  HelpCircle,
  Settings,
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import type React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import axiosInstance from "../services/api"
import { useDispatch, useSelector } from "react-redux"
import Navbar from "@/components/navbar/Navbar"
import DeleteAccount from "@/components/comps/DeleteAccount"
import DeactivateAccount from "@/components/comps/DeactivateAccount"
import { useToast } from "@/components/ui/use-toast"
import ListWishlist from "@/components/comps/ListWishlist"
import type { z } from "zod"
import { setUser } from "../store/userSlice"
import type { RootState } from "../store/store"
import AddressCard from "@/components/comps/AddressCard"
import { useSearchParams } from "next/navigation"

const ProfileSettings = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSubmitBtn, setShowSubmitBtn] = useState(false)
  const [readOnly, setReadonly] = useState(true)
  const [activeTab, setActiveTab] = useState("profile")
  const [showDeleteAccountCard, setShowDeleteAccountCard] = useState(false)
  const [showDeactivateAccountCard, setShowDeactivateAccountCard] = useState(false)
  const [loading, setLoading] = useState(false)

  const { data: session, status } = useSession()
  const user = session?.user
  const dispatch = useDispatch()
  const { toast } = useToast()
  const userData = useSelector((state: RootState) => state.user.userData)
  const [gender, setGender] = useState<string>(userData?.gender || "")
  const searchParams = useSearchParams()
  const myWishlist = searchParams.get("wishlist")

  const form = useForm({
    defaultValues: {
      username: userData?.username || "",
      fullname: userData?.fullname || "",
      phone: userData?.phone || "",
      email: userData?.email || "no email",
      gender: userData?.gender || "",
    },
  })

  useEffect(() => {
    form.reset(userData)
    if (myWishlist) {
      setActiveTab("wishlist")
    }
  }, [userData, form, myWishlist])

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGender(e.target.value)
  }

  const updateUserNameAndSurname = async (data: z.infer<typeof signUpSchema>) => {
    if (!data) {
      console.log("no data found")
      return
    }

    setIsSubmitting(true)
    const formData = {
      username: data.username || userData?.username,
      fullname: data.fullname || userData?.fullname,
      gender: gender || "",
      email: data.email || userData?.email,
      phone: data.phone || userData?.phone,
    }

    try {
      const response = await axiosInstance.post("/api/update-user-details", formData)

      if (response.data) {
        dispatch(setUser(response.data.data))
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
        setReadonly(true)
        setShowSubmitBtn(false)
      }
    } catch (error) {
      console.error("Failed to update user data", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleDisplay = () => {
    setShowSubmitBtn(!showSubmitBtn)
    setReadonly(!readOnly)
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      await signOut({ callbackUrl: "/" })
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleShowDeleteCard = () => {
    setShowDeleteAccountCard(!showDeleteAccountCard)
  }

  const handleShowDeactivateCard = () => {
    setShowDeactivateAccountCard(!showDeactivateAccountCard)
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Not Authorized</h2>
          <p className="text-muted-foreground">Please sign in to access your profile</p>
        </div>
      </div>
    )
  }

  const getInitial = (name: string) => {
    if (!name) return ""
    return name.charAt(0).toUpperCase()
  }

  const menuItems = [
    { id: "profile", label: "Profile", icon: User, shortLabel: "Profile" },
    { id: "orders", label: "My Orders", icon: Package, shortLabel: "Orders" },
    { id: "addresses", label: "Addresses", icon: MapPin, shortLabel: "Address" },
    { id: "wishlist", label: "Wishlist", icon: Heart, shortLabel: "Wishlist" },
    { id: "more", label: "More", icon: Settings, shortLabel: "More" },
  ]

  const moreMenuItems = [
    { id: "cards", label: "Saved Cards", icon: CreditCard },
    { id: "coupons", label: "My Coupons", icon: Gift },
    { id: "reviews", label: "Reviews & Ratings", icon: Star },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "help", label: "Help Center", icon: HelpCircle },
  ]

  const ProfileHeader = () => (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg mb-6">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl">
          {getInitial(userData?.username || "")}
        </div>
        <div>
          <h2 className="text-xl font-semibold"> {userData?.username}</h2>
          {/* <p className="text-blue-100">{userData?.email}</p> */}
        </div>
      </div>
    </div>
  )

  const DesktopSidebar = () => (
    <aside className="hidden lg:block w-80 bg-white rounded-lg shadow-sm p-6 h-fit sticky top-8">
      <ProfileHeader />

      <nav className="space-y-2">
        {[...menuItems.slice(0, -1), ...moreMenuItems].map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <Separator className="my-6" />

      <button
        onClick={handleLogout}
        disabled={loading}
        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogOut className="h-5 w-5" />}
        <span>Logout</span>
      </button>
    </aside>
  )

  const MobileBottomNav = () => (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive =
            activeTab === item.id ||
            (item.id === "more" && ["cards", "coupons", "reviews", "notifications", "help"].includes(activeTab))

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 ${isActive ? "text-blue-600" : "text-gray-600"}`} />
              <span className={`text-xs font-medium ${isActive ? "text-blue-600" : "text-gray-600"}`}>
                {item.shortLabel}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )

  const ProfileInformationContent = () => (
    <div className="space-y-6">
      <div className="lg:hidden">
        <ProfileHeader />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
          <p className="text-gray-600 mt-1">Manage your personal details and preferences</p>
        </div>
        {!showDeleteAccountCard && !showDeactivateAccountCard && (
          <Button
            variant={showSubmitBtn ? "outline" : "default"}
            onClick={toggleDisplay}
            className="flex items-center space-x-2"
          >
            {showSubmitBtn ? (
              <>
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">Cancel</span>
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4" />
                <span className="hidden sm:inline">Edit</span>
              </>
            )}
          </Button>
        )}
      </div>

      {!showDeleteAccountCard && !showDeactivateAccountCard && (
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(updateUserNameAndSurname)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    name="username"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Username</FormLabel>
                        <Input
                          placeholder={userData?.username}
                          {...field}
                          readOnly={readOnly}
                          className={readOnly ? "bg-gray-50" : ""}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="fullname"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Full Name</FormLabel>
                        <Input
                          placeholder={userData?.fullname}
                          {...field}
                          readOnly={readOnly}
                          className={readOnly ? "bg-gray-50" : ""}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                        <Input
                          placeholder={userData?.email}
                          type="email"
                          {...field}
                          readOnly={readOnly}
                          className={readOnly ? "bg-gray-50" : ""}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="phone"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Phone</FormLabel>
                        <Input
                          placeholder={userData?.phone}
                          {...field}
                          readOnly={readOnly}
                          className={readOnly ? "bg-gray-50" : ""}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-3">Gender</label>
                  <div className="flex space-x-6">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={gender === "male"}
                        onChange={handleGenderChange}
                        disabled={readOnly}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Male</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={gender === "female"}
                        onChange={handleGenderChange}
                        disabled={readOnly}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Female</span>
                    </label>
                  </div>
                </div>

                {showSubmitBtn && (
                  <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {showDeleteAccountCard && (
        <Card>
          <CardContent className="p-6">
            <DeleteAccount />
            <div className="flex justify-center mt-6">
              <Button variant="outline" onClick={handleShowDeleteCard}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showDeactivateAccountCard && (
        <Card>
          <CardContent className="p-6">
            <DeactivateAccount />
            <div className="flex justify-center mt-6">
              <Button variant="outline" onClick={handleShowDeactivateCard}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!showDeleteAccountCard && !showDeactivateAccountCard && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-red-600">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="destructive" onClick={handleShowDeactivateCard} className="flex-1">
                Deactivate Account
              </Button>
              <Button variant="destructive" onClick={handleShowDeleteCard} className="flex-1">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">What happens when I update my email address?</h4>
            <p className="text-gray-600 text-sm">
              Your login email changes accordingly. You&apos;ll receive all account-related communications on your updated
              email address.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">When will my account be updated?</h4>
            <p className="text-gray-600 text-sm">
              Changes take effect immediately after you save them and verify any required verification codes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const MoreContent = () => (
    <div className="space-y-6">
      <div className="lg:hidden">
        <ProfileHeader />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">More Options</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {moreMenuItems.map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.label}</h3>
                      <p className="text-sm text-gray-600">Manage your {item.label.toLowerCase()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-50 rounded-lg">
                  <LogOut className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Logout</h3>
                  <p className="text-sm text-gray-600">Sign out of your account</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Logout"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileInformationContent />
      case "wishlist":
        return (
          <div className="space-y-6">
            <div className="lg:hidden">
              <ProfileHeader />
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <ListWishlist />
            </div>
          </div>
        )
      case "addresses":
        return (
          <div className="space-y-6">
            <div className="lg:hidden">
              <ProfileHeader />
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <AddressCard />
            </div>
          </div>
        )
      case "orders":
        return (
          <div className="space-y-6">
            <div className="lg:hidden">
              <ProfileHeader />
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">My Orders</h2>
              <p className="text-gray-600">Your order history will appear here.</p>
            </div>
          </div>
        )
      case "more":
        return <MoreContent />
      default:
        return (
          <div className="space-y-6">
            <div className="lg:hidden">
              <ProfileHeader />
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
              <p className="text-gray-600">This feature is under development.</p>
            </div>
          </div>
        )
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <DesktopSidebar />
            <main className="flex-1">{renderContent()}</main>
          </div>
        </div>
      </div>
      <MobileBottomNav />
    </>
  )
}

export default ProfileSettings

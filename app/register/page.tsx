// "use client"

// import type React from "react"

// import { useState } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { ShoppingBag } from "lucide-react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import RegisterImage from "@/assets/images/Galcon_Login_Image.png"

// export default function RegisterPage() {
//   const [activeTab, setActiveTab] = useState("owner")
//   const [ownerData, setOwnerData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//   })
//   const [shopData, setShopData] = useState({
//     shopName: "",
//     address: "",
//     shopPhone: "",
//     shopEmail: "",
//     gstNumber: "",
//   })
//   const [isLoading, setIsLoading] = useState(false)
//   const router = useRouter()

//   const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setOwnerData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleShopChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setShopData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     // Here you would implement actual registration logic
//     // For now, we'll just simulate registration
//     setTimeout(() => {
//       setIsLoading(false)
//       router.push("/dashboard")
//     }, 1000)
//   }

//   const nextStep = () => {
//     setActiveTab("shop")
//   }

//   return (
//     <div className="flex min-h-screen bg-white">
//       {/* Logo at the top */}
//       <Link href="/" className="absolute left-8 top-8 flex items-center gap-2 z-10">
//         <ShoppingBag className="h-6 w-6" />
//         <span className="font-bold">AgroBill</span>
//       </Link>

//       {/* Left Side - Registration Form */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
//         <Card className="w-full max-w-md border-none shadow-none">
//           <CardHeader>
//             <CardTitle className="text-2xl font-bold">Create Your Agro Shop</CardTitle>
//             <CardDescription className="text-base">Register as a shop owner and set up your agro shop</CardDescription>
//           </CardHeader>
//           <form onSubmit={handleSubmit}>
//             <Tabs value={activeTab} onValueChange={setActiveTab}>
//               <TabsList className="grid w-full grid-cols-2">
//                 <TabsTrigger value="owner">Owner Details</TabsTrigger>
//                 <TabsTrigger value="shop">Shop Details</TabsTrigger>
//               </TabsList>
//               <TabsContent value="owner" className="space-y-4 mt-4">
//                 <CardContent className="space-y-4 pt-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="name">Full Name</Label>
//                     <Input
//                       id="name"
//                       name="name"
//                       placeholder="John Doe"
//                       value={ownerData.name}
//                       onChange={handleOwnerChange}
//                       className="h-11"
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="email">Email</Label>
//                     <Input
//                       id="email"
//                       name="email"
//                       type="email"
//                       placeholder="name@example.com"
//                       value={ownerData.email}
//                       onChange={handleOwnerChange}
//                       className="h-11"
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="phone">Phone Number</Label>
//                     <Input
//                       id="phone"
//                       name="phone"
//                       placeholder="+91 9876543210"
//                       value={ownerData.phone}
//                       onChange={handleOwnerChange}
//                       className="h-11"
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="password">Password</Label>
//                     <Input
//                       id="password"
//                       name="password"
//                       type="password"
//                       value={ownerData.password}
//                       onChange={handleOwnerChange}
//                       className="h-11"
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="confirmPassword">Confirm Password</Label>
//                     <Input
//                       id="confirmPassword"
//                       name="confirmPassword"
//                       type="password"
//                       value={ownerData.confirmPassword}
//                       onChange={handleOwnerChange}
//                       className="h-11"
//                       required
//                     />
//                   </div>
//                 </CardContent>
//                 <CardFooter>
//                   <Button type="button" className="w-full h-11" onClick={nextStep}>
//                     Next: Shop Details
//                   </Button>
//                 </CardFooter>
//               </TabsContent>
//               <TabsContent value="shop">
//                 <CardContent className="space-y-4 pt-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="shopName">Shop Name</Label>
//                     <Input
//                       id="shopName"
//                       name="shopName"
//                       placeholder="Green Harvest Agro Shop"
//                       value={shopData.shopName}
//                       onChange={handleShopChange}
//                       className="h-11"
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="address">Shop Address</Label>
//                     <Textarea
//                       id="address"
//                       name="address"
//                       placeholder="123 Farm Road, Agricity"
//                       value={shopData.address}
//                       onChange={handleShopChange}
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="shopPhone">Shop Phone Number</Label>
//                     <Input
//                       id="shopPhone"
//                       name="shopPhone"
//                       placeholder="+91 9876543210"
//                       value={shopData.shopPhone}
//                       onChange={handleShopChange}
//                       className="h-11"
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="shopEmail">Shop Email (Optional)</Label>
//                     <Input
//                       id="shopEmail"
//                       name="shopEmail"
//                       type="email"
//                       placeholder="shop@example.com"
//                       value={shopData.shopEmail}
//                       onChange={handleShopChange}
//                       className="h-11"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="gstNumber">GST Number (Optional)</Label>
//                     <Input
//                       id="gstNumber"
//                       name="gstNumber"
//                       placeholder="22AAAAA0000A1Z5"
//                       value={shopData.gstNumber}
//                       onChange={handleShopChange}
//                       className="h-11"
//                     />
//                   </div>
//                 </CardContent>
//                 <CardFooter className="flex flex-col space-y-4">
//                   <Button type="submit" className="w-full h-11" disabled={isLoading}>
//                     {isLoading ? "Creating account..." : "Register Shop"}
//                   </Button>
//                   <div className="text-center text-sm">
//                     Already have an account?{" "}
//                     <Link href="/login" className="text-primary font-medium hover:underline">
//                       Login
//                     </Link>
//                   </div>
//                 </CardFooter>
//               </TabsContent>
//             </Tabs>
//           </form>
//         </Card>
//       </div>

//       {/* Right Side - Image */}
//       <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-green-50 to-green-100">
//         <div className="absolute inset-0 flex items-center justify-center p-10">
//           <div className="relative w-full h-full max-w-2xl">
//             <Image 
//               src={RegisterImage}
//               alt="Agro Shop Registration" 
//               fill
//               priority
//               className="object-contain rounded-lg shadow-lg"
//             />
//           </div>
//           <div className="absolute bottom-10 left-10 bg-white/80 backdrop-blur-sm p-4 rounded-lg max-w-md">
//             <h3 className="text-lg font-semibold text-green-800">Grow Your Agro Business</h3>
//             <p className="text-sm text-gray-700">Join thousands of shop owners using AgroBill to streamline operations and increase profits.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }




"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ShoppingBag, ArrowRight, User, Mail, Phone, Lock, Building, MapPin, EyeOff, Eye } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import RegisterImage from "@/assets/images/Galcon_Login_Image.png"
import { serverRegister } from "@/services/serverApi"

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState("owner")
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    number: Yup.string()
      .matches(/^[0-9]+$/, "Phone number must be numeric")
      .min(10, "Phone number must be at least 10 digits")
      .required("Phone number is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "Passwords must match")
      .required("Confirm Password is required"),
    shopName: Yup.string().required("Shop Name is required"),
    address: Yup.string().required("Shop Address is required"),
    shopNumber: Yup.string()
      .matches(/^[0-9]+$/, "Shop phone number must be numeric")
      .min(10, "Shop phone number must be at least 10 digits")
      .required("Shop phone number is required"),
    shopEmail: Yup.string().email("Invalid shop email address").required("Shop email is required"),
    gst: Yup.string().required("GST Number is required")
  })

  const handleSubmit = async (values: any) => {
    setIsLoading(true)
    setError(null)

    try {
      const bodyData = {
        name: values?.name,
        email: values?.email,
        number: Number(values?.number),
        password: values?.password,
        shopName: values?.shopName,
        address: values?.address,
        shopNumber: Number(values?.shopNumber),
        shopEmail: values?.shopEmail,
        gst: values?.gst,
      }
      await serverRegister(bodyData)
      setIsLoading(false)
      router.push("/login")
    } catch (error: any) {
      setIsLoading(false)
      setError(error?.response?.data?.message || "Registration failed. Please try again.")
      console.error("Registration error:", error)
    }
  }

  return (
    <div className="flex min-h-screen bg-background transition-colors">
      {/* Left Side - Image Only */}
      <div className="hidden lg:block lg:w-2/3 relative">
        <Image 
          src={RegisterImage} 
          alt="Agro Shop Registration" 
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-800/30 to-transparent"></div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/3 relative flex flex-col justify-center px-8 py-12 lg:px-16 bg-background shadow-2xl shadow-slate-200/50 transition-colors">
        <Link href="/" className="absolute left-8 top-8 flex items-center gap-2">
          <div className="bg-green-500 p-2 rounded-lg">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-900 dark:text-white">AgroBill</span>
        </Link>
        
        <div className="w-full max-w-md mx-auto mt-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-3 text-slate-900 dark:text-white">Create Your Shop</h1>
            <div className="h-1 w-12 bg-green-500 rounded-full mb-3"></div>
            <p className="text-slate-500 dark:text-slate-300">Register as a shop owner and start managing your agro business</p>
          </div>
          <Formik
            initialValues={{
              name: "",
              email: "",
              number: "",
              password: "",
              confirmPassword: "",
              shopName: "",
              address: "",
              shopNumber: "",
              shopEmail: "",
              gst: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange }) => (
              <Form className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 border-l-4 border-red-500">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="owner">Owner Details</TabsTrigger>
                    <TabsTrigger value="shop">Shop Details</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="owner" className="space-y-5 pt-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                        <Field
                          as={Input}
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          className="w-full pl-12 h-12"
                        />
                        <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                        <Field
                          as={Input}
                          id="email"
                          name="email"
                          type="email"
                          placeholder="name@example.com"
                          className="w-full pl-12 h-12"
                        />
                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="number" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                        <Field
                          as={Input}
                          id="number"
                          name="number"
                          placeholder="Enter your phone number"
                          className="w-full pl-12 h-12"
                        />
                        <ErrorMessage name="number" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                        <Field
                          as={Input}
                          id="password"
                          name="password"
                          type={isPasswordVisible ? "text" : "password"}
                          placeholder="Create a strong password"
                          className="w-full pl-12 h-12"
                        />
                        <button
                          type="button"
                          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                          className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                        >
                          {isPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                        <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                        <Field
                          as={Input}
                          id="confirmPassword"
                          name="confirmPassword"
                          type={isConfirmPasswordVisible ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="w-full pl-12 h-12"
                        />
                        <button
                          type="button"
                          onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                          className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                        >
                          {isConfirmPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                        <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                    
                    <Button 
                      type="button" 
                      onClick={() => setActiveTab("shop")}
                      className="w-full h-12 mt-2 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-all shadow-lg shadow-green-600/30"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span>Next: Shop Details</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="shop" className="space-y-5 pt-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="shopName" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Shop Name
                      </Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                        <Field
                          as={Input}
                          id="shopName"
                          name="shopName"
                          placeholder="Green Harvest Agro Shop"
                          className="w-full pl-12 h-12"
                        />
                        <ErrorMessage name="shopName" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="address" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Shop Address
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                        <Field
                          as={Textarea}
                          id="address"
                          name="address"
                          placeholder="123 Farm Road, Agricity"
                          className="w-full pl-12 pt-3 pr-3 pb-3 h-12 min-h-[100px]"
                        />
                        <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="shopNumber" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Shop Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                        <Field
                          as={Input}
                          id="shopNumber"
                          name="shopNumber"
                          placeholder="Enter shop phone number"
                          className="w-full pl-12 h-12"
                        />
                        <ErrorMessage name="shopNumber" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="shopEmail" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Shop Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                        <Field
                          as={Input}
                          id="shopEmail"
                          name="shopEmail"
                          type="email"
                          placeholder="shop@example.com"
                          className="w-full pl-12 h-12"
                        />
                        <ErrorMessage name="shopEmail" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="gst" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        GST Number
                      </Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                        <Field
                          as={Input}
                          id="gst"
                          name="gst"
                          placeholder="22AAAAA0000A1Z5"
                          className="w-full pl-12 h-12"
                        />
                        <ErrorMessage name="gst" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 mt-3 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-all shadow-lg shadow-green-600/30" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Creating Shop...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span>Create Your Shop</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </Button>
                    
                    <div className="pt-4">
                      <div className="relative flex items-center">
                        <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                        <span className="flex-shrink mx-3 text-slate-400 dark:text-slate-500 text-sm">Already have an account?</span>
                        <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                      </div>
                      
                      <div className="mt-4 text-center">
                        <Link 
                          href="/login" 
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-green-600 rounded-lg text-green-600 font-medium hover:bg-green-50 dark:hover:bg-green-900 transition-colors"
                        >
                          Sign In Instead
                        </Link>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}



// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { ShoppingBag } from "lucide-react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import RegisterImage from "@/assets/images/Galcon_Login_Image.png"

// export default function RegisterPage() {
//   const [activeTab, setActiveTab] = useState("owner")
//   const [ownerData, setOwnerData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//   })
//   const [shopData, setShopData] = useState({
//     shopName: "",
//     address: "",
//     shopPhone: "",
//     shopEmail: "",
//     gstNumber: "",
//   })
//   const [isLoading, setIsLoading] = useState(false)
//   const router = useRouter()

//   const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setOwnerData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleShopChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setShopData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setTimeout(() => {
//       setIsLoading(false)
//       router.push("/dashboard")
//     }, 1000)
//   }

//   const nextStep = () => {
//     setActiveTab("shop")
//   }

//   return (
//     <div className="flex min-h-screen bg-white dark:bg-slate-900 transition-colors">
//       {/* Logo at the top */}
//       <Link href="/" className="absolute left-8 top-8 flex items-center gap-2 z-10">
//         <ShoppingBag className="h-6 w-6 text-green-700 dark:text-green-400" />
//         <span className="font-bold text-slate-900 dark:text-white">AgroBill</span>
//       </Link>

//       {/* Left Side - Registration Form */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
//         <Card className="w-full max-w-md border-none shadow-none bg-white dark:bg-slate-800 transition-colors">
//           <CardHeader>
//             <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Create Your Agro Shop</CardTitle>
//             <CardDescription className="text-base text-slate-600 dark:text-slate-300">
//               Register as a shop owner and set up your agro shop
//             </CardDescription>
//           </CardHeader>
//           <form onSubmit={handleSubmit}>
//             <Tabs value={activeTab} onValueChange={setActiveTab}>
//               <TabsList className="grid w-full grid-cols-2">
//                 <TabsTrigger value="owner">Owner Details</TabsTrigger>
//                 <TabsTrigger value="shop">Shop Details</TabsTrigger>
//               </TabsList>
//               <TabsContent value="owner" className="space-y-4 mt-4">
//                 <CardContent className="space-y-4 pt-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="name">Full Name</Label>
//                     <Input
//                       id="name"
//                       name="name"
//                       placeholder="John Doe"
//                       value={ownerData.name}
//                       onChange={handleOwnerChange}
//                       className="h-11"
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="email">Email</Label>
//                     <Input
//                       id="email"
//                       name="email"
//                       type="email"
//                       placeholder="name@example.com"
//                       value={ownerData.email}
//                       onChange={handleOwnerChange}
//                       className="h-11"
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="phone">Phone Number</Label>
//                     <Input
//                       id="phone"
//                       name="phone"
//                       placeholder="+91 9876543210"
//                       value={ownerData.phone}
//                       onChange={handleOwnerChange}
//                       className="h-11"
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="password">Password</Label>
//                     <Input
//                       id="password"
//                       name="password"
//                       type="password"
//                       value={ownerData.password}
//                       onChange={handleOwnerChange}
//                       className="h-11"
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="confirmPassword">Confirm Password</Label>
//                     <Input
//                       id="confirmPassword"
//                       name="confirmPassword"
//                       type="password"
//                       value={ownerData.confirmPassword}
//                       onChange={handleOwnerChange}
//                       className="h-11"
//                       required
//                     />
//                   </div>
//                 </CardContent>
//                 <CardFooter>
//                   <Button type="button" className="w-full h-11" onClick={nextStep}>
//                     Next: Shop Details
//                   </Button>
//                 </CardFooter>
//               </TabsContent>
//               <TabsContent value="shop">
//                 <CardContent className="space-y-4 pt-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="shopName">Shop Name</Label>
//                     <Input
//                       id="shopName"
//                       name="shopName"
//                       placeholder="Green Harvest Agro Shop"
//                       value={shopData.shopName}
//                       onChange={handleShopChange}
//                       className="h-11"
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="address">Shop Address</Label>
//                     <Textarea
//                       id="address"
//                       name="address"
//                       placeholder="123 Farm Road, Agricity"
//                       value={shopData.address}
//                       onChange={handleShopChange}
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="shopPhone">Shop Phone Number</Label>
//                     <Input
//                       id="shopPhone"
//                       name="shopPhone"
//                       placeholder="+91 9876543210"
//                       value={shopData.shopPhone}
//                       onChange={handleShopChange}
//                       className="h-11"
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="shopEmail">Shop Email (Optional)</Label>
//                     <Input
//                       id="shopEmail"
//                       name="shopEmail"
//                       type="email"
//                       placeholder="shop@example.com"
//                       value={shopData.shopEmail}
//                       onChange={handleShopChange}
//                       className="h-11"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="gstNumber">GST Number (Optional)</Label>
//                     <Input
//                       id="gstNumber"
//                       name="gstNumber"
//                       placeholder="22AAAAA0000A1Z5"
//                       value={shopData.gstNumber}
//                       onChange={handleShopChange}
//                       className="h-11"
//                     />
//                   </div>
//                 </CardContent>
//                 <CardFooter className="flex flex-col space-y-4">
//                   <Button type="submit" className="w-full h-11" disabled={isLoading}>
//                     {isLoading ? "Creating account..." : "Register Shop"}
//                   </Button>
//                   <div className="text-center text-sm">
//                     Already have an account?{" "}
//                     <Link href="/login" className="text-primary font-medium hover:underline">
//                       Login
//                     </Link>
//                   </div>
//                 </CardFooter>
//               </TabsContent>
//             </Tabs>
//           </form>
//         </Card>
//       </div>

//       {/* Right Side - Image */}
//       <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
//         <div className="absolute inset-0 flex items-center justify-center p-10">
//           <div className="relative w-full h-full max-w-2xl">
//             <Image 
//               src={RegisterImage}
//               alt="Agro Shop Registration" 
//               fill
//               priority
//               className="object-contain rounded-lg shadow-lg"
//             />
//           </div>
//           <div className="absolute bottom-10 left-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-lg max-w-md">
//             <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">Grow Your Agro Business</h3>
//             <p className="text-sm text-gray-700 dark:text-gray-200">Join thousands of shop owners using AgroBill to streamline operations and increase profits.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
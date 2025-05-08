"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { serverGetCategory, serverUpdateCategory } from "@/services/serverApi"

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    description: "",
    isActive: true,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await serverGetCategory();
        const categoryData = res?.data?.find((category: any) => category?._id === params?.id);
  
        setFormData({
          _id: categoryData?._id,
          name: categoryData.name,
          description: categoryData.description,
          isActive: categoryData.isActive,
        })
  
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching category:", error);
        setIsLoading(false);
      }
    };
  
    fetchCategory();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsSaving(true)
      const res = await serverUpdateCategory({...formData});
      if (res?.success) {
        router.push(`/dashboard/categories`)
      }
      setIsSaving(false)
    } catch (error) {
      setIsSaving(false)
      console.error("Error updating category:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading category data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Edit Category</h2>
      </div>

      <Card className="w-full">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Category Information</CardTitle>
            <CardDescription>Update the category details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Fertilizers"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="All types of fertilizers for crops"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}


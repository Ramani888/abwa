"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import { serverGetAllPermission, serverGetUser, serverUpdateUser } from "@/services/serverApi"

// Define permission type
type Permission = {
  _id: string;
  name: string;
  selected?: boolean;
}

export default function UserPermissionsPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>(null)
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    selectedPermissions: [] as string[] // Store selected permission IDs
  })
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await serverGetUser();
        const userData = res?.data?.find((item: any) => item?._id === params?.id);
        setUser(userData);
        setFormData({
          selectedPermissions: userData?.permissionIds,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setIsLoading(false);
      }
    };
  
    fetchUser();
  }, [params.id]);

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData((prev) => {
      if (checked) {
        return {
          ...prev,
          selectedPermissions: [...prev.selectedPermissions, permissionId]
        }
      } else {
        return {
          ...prev,
          selectedPermissions: prev.selectedPermissions.filter(id => id !== permissionId)
        }
      }
    })
  }

  const getPermissionData = async () => {
    try {
      setIsLoading(true);
      const res = await serverGetAllPermission();
      
      // Initialize permissions state with data from API
      if (res?.data && Array.isArray(res?.data)) {
        setPermissions(res?.data?.map((permission: any) => ({
          ...permission,
          selected: false
        })));
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error getting permission data:", error)
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getPermissionData();
  }, [])
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsLoading(true)
      const finalData = {
        ...user,
        permissionIds: formData?.selectedPermissions,
      }
      await serverUpdateUser(finalData);
      setIsLoading(false)
      router.push("/dashboard/users")
    } catch (error) {
      console.error("Error update user:", error)
      setIsLoading(false)
    }
  }

  // Group permissions by their type
  const groupPermissions = (): Record<string, Permission[]> => {
    const groups: Record<string, Permission[]> = {};
    
    permissions.forEach(permission => {
      // Extract category from permission name (e.g., "add-product" → "product")
      const nameParts = permission.name.split('-');
      let category = nameParts.length > 1 ? nameParts[1] : 'general';
      
      // Handle plural forms
      if (category.endsWith('s')) {
        category = category;
      }
      
      if (!groups[category]) {
        groups[category] = [];
      }
      
      groups[category].push(permission);
    });
    
    return groups;
  };

  const permissionGroups: Record<string, Permission[]> = groupPermissions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading user permissions...</p>
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
        <h2 className="text-3xl font-bold tracking-tight">Manage Permissions</h2>
      </div>

      <Card className="w-full">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{user?.name}</CardTitle>
            <CardDescription>
              {user?.email} • {user?.roleName?.charAt(0).toUpperCase() + user?.roleName?.slice(1)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              Object.entries(permissionGroups).map(([category, categoryPermissions]) => (
                <div className="mb-4" key={category}>
                  <h3 className="text-sm font-medium mb-2 capitalize">{category}</h3>
                  <div className="grid grid-cols-2 gap-2 pl-4 sm:grid-cols-2">
                    {categoryPermissions.map(permission => (
                      <div key={permission._id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`permission-${permission._id}`}
                          checked={formData.selectedPermissions.includes(permission._id)}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(permission._id, checked as boolean)
                          }
                        />
                        <Label htmlFor={`permission-${permission._id}`} className="capitalize">
                          {permission.name.replace(/-/g, ' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Permissions"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}


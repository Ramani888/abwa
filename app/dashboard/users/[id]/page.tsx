"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Loader2 } from "lucide-react"
import { IRole } from "@/types/user"
import { serverGetAllPermission, serverGetAllRole, serverGetUser, serverUpdateUser } from "@/services/serverApi"

// Define permission type
type Permission = {
  _id: string;
  name: string;
  selected?: boolean;
}

export default function EditUserPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [role, setRole] = useState<IRole[]>([]);

  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    email: "",
    number: "",
    role: "salesperson",
    selectedPermissions: [] as string[] // Store selected permission IDs
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await serverGetUser();
        const userData = res?.data?.find((user: any) => user?._id === params?.id);
  
        setFormData({
          _id: userData?._id,
          name: userData?.name,
          email: userData?.email,
          number: userData?.number,
          role: userData?.roleId,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true)
      const finalData = {
        ...formData,
        permissionIds: formData?.selectedPermissions,
        roleId: formData?.role,
        number: Number(formData?.number)
      }
      await serverUpdateUser(finalData);
      setIsLoading(false)
      router.push("/dashboard/users")
    } catch (error) {
      console.error("Error update user:", error)
      setIsLoading(false)
    }
  }

  const getPermissionData = async () => {
    try {
      setLoading(true);
      const res = await serverGetAllPermission();
      
      // Initialize permissions state with data from API
      if (res?.data && Array.isArray(res?.data)) {
        setPermissions(res?.data?.map((permission: any) => ({
          ...permission,
          selected: false
        })));
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error getting permission data:", error)
      setLoading(false);
    }
  }

  const getRoleData = async () => {
    try {
      setLoading(true)
      const res = await serverGetAllRole();
      setRole(res?.data)
      setLoading(false)
    } catch (err) {
      console.error("Error getting permission data:", err)
      setLoading(false);
      setRole([])
    }
  }

  useEffect(() => {
    getPermissionData();
    getRoleData();
  }, [])

  // Group permissions by their type
  const groupPermissions = () => {
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

  const permissionGroups = groupPermissions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading user data...</p>
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
        <h2 className="text-3xl font-bold tracking-tight">Edit User</h2>
      </div>

      <Card className="w-full">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Update user details and permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="number">Phone Number</Label>
                <Input
                  id="number"
                  name="number"
                  type="number"
                  placeholder="+91 9876543210"
                  value={formData.number}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => handleSelectChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {role?.map((item) => {
                    return (
                      <SelectItem key={item?._id} value={item?._id}>{item?.name}</SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Permissions</Label>
              
              {loading ? (
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
              
              {!loading && permissions.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No permissions found
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || loading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}


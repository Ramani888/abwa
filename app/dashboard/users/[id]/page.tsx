"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Loader2, User, Mail, Phone } from "lucide-react";
import { IRole } from "@/types/user";
import { serverGetAllPermission, serverGetAllRole, serverGetUser, serverUpdateUser } from "@/services/serverApi";

// Define permission type
type Permission = {
  _id: string;
  name: string;
  selected?: boolean;
};

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  number: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone Number is required"),
  role: Yup.string().required("Role is required")
  // selectedPermissions: Yup.array().of(Yup.string()).min(1, "At least one permission must be selected"),
});

export default function EditUserPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [role, setRole] = useState<IRole[]>([]);
  const router = useRouter();

  const fetchUser = async (setFieldValue: (field: string, value: any) => void) => {
    try {
      const res = await serverGetUser();
      const userData = res?.data?.find((user: any) => user?._id === params?.id);

      if (userData) {
        setFieldValue("_id", userData._id);
        setFieldValue("name", userData.name);
        setFieldValue("email", userData.email);
        setFieldValue("number", userData.number);
        setFieldValue("role", userData.roleId);
        setFieldValue("selectedPermissions", userData.permissionIds);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const getPermissionData = async () => {
    try {
      setLoading(true);
      const res = await serverGetAllPermission();

      if (res?.data && Array.isArray(res?.data)) {
        setPermissions(
          res?.data?.map((permission: any) => ({
            ...permission,
            selected: false,
          }))
        );
      }

      setLoading(false);
    } catch (error) {
      console.error("Error getting permission data:", error);
      setLoading(false);
    }
  };

  const getRoleData = async () => {
    try {
      setLoading(true);
      const res = await serverGetAllRole();
      setRole(res?.data);
      setLoading(false);
    } catch (err) {
      console.error("Error getting role data:", err);
      setLoading(false);
      setRole([]);
    }
  };

  useEffect(() => {
    getPermissionData();
    getRoleData();
  }, []);

  const groupPermissions = () => {
    const groups: Record<string, Permission[]> = {};

    permissions.forEach((permission) => {
      const nameParts = permission.name.split("-");
      let category = nameParts.length > 1 ? nameParts[1] : "general";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(permission);
    });

    return groups;
  };

  const permissionGroups = groupPermissions();

  const handleSubmit = async (values: any, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      const finalData = {
        ...values,
        permissionIds: values.selectedPermissions,
        roleId: values.role,
        number: Number(values.number),
      };
      await serverUpdateUser(finalData);
      setSubmitting(false);
      router.push("/dashboard/users");
    } catch (error) {
      console.error("Error updating user:", error);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading user data...</p>
        </div>
      </div>
    );
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
        <Formik
          initialValues={{
            _id: "",
            name: "",
            email: "",
            number: "",
            role: "",
            selectedPermissions: [] as string[],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting, setFieldValue }) => {
            useEffect(() => {
              fetchUser(setFieldValue);
            }, [setFieldValue]);

            return (
              <Form>
                <CardHeader>
                  <CardTitle>User Information</CardTitle>
                  <CardDescription>Update user details and permissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <Field
                        as={Input}
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        className="pl-10"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <ErrorMessage name="name" component="p" className="text-red-500 text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Field
                          as={Input}
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          className="pl-10"
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="number">Phone Number</Label>
                      <div className="relative">
                        <Field
                          as={Input}
                          id="number"
                          name="number"
                          type="number"
                          placeholder="+91 9876543210"
                          className="pl-10"
                        />
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <ErrorMessage name="number" component="p" className="text-red-500 text-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={values.role}
                      onValueChange={(value) => setFieldValue("role", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {role?.map((item) => (
                          <SelectItem key={item?._id} value={item?._id}>
                            {item?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ErrorMessage name="role" component="p" className="text-red-500 text-sm" />
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
                            {categoryPermissions.map((permission) => (
                              <div key={permission._id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`permission-${permission._id}`}
                                  checked={values.selectedPermissions.includes(permission._id)}
                                  onCheckedChange={(checked) =>
                                    setFieldValue(
                                      "selectedPermissions",
                                      checked
                                        ? [...values.selectedPermissions, permission._id]
                                        : values.selectedPermissions.filter((id) => id !== permission._id)
                                    )
                                  }
                                />
                                <Label htmlFor={`permission-${permission._id}`} className="capitalize">
                                  {permission.name.replace(/-/g, " ")}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving....</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>Save Changes</span>
                      </div>
                    )}
                  </Button>
                </CardFooter>
              </Form>
            );
          }}
        </Formik>
      </Card>
    </div>
  );
}


"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCheckIcon, CheckSquare, CrownIcon, Edit, Loader2, MoreHorizontal, Search, Shield, Trash, UserCog } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { serverDeleteUser, serverGetUser } from "@/services/serverApi"
import { IUser } from "@/types/user"
import { useAuth } from "../auth-provider"
import { usePermission } from "@/hooks/usePermission"
import { Permissions } from "@/utils/consts/permission"

export function UsersTable({ setRefreshFunction }: { setRefreshFunction?: (fn: () => Promise<void>) => void }) {
  const { hasPermission, hasAnyPermission } = usePermission();
  const { user, owner } = useAuth();
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<IUser[]>([]);

  const filteredUsers = users?.filter(
    (item) =>
      item?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.email.toLowerCase().includes(searchQuery.toLowerCase())
      // user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Administrator":
        return "default"
      case "Manager":
        return "outline"
      case "Salesperson":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "Administrator":
        return "Administrator"
      case "Manager":
        return "Manager"
      case "Salesperson":
        return "Salesperson"
      case "Inventory Manager":
        return "Inventory Manager"
      default:
        return role
    }
  }

  const getUserData = async () => {
    try {
      setLoading(true);
      const res = await serverGetUser();
      setUsers(res?.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user data:", err)
      setLoading(false);
    }
  }

  const handleDeleteClick = (id: string) => {
    setUserToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    try {
      setLoading(true)
      await serverDeleteUser(userToDelete ?? '');
      setDeleteDialogOpen(false)
      setUserToDelete(null)
      getUserData();
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error("Error deleting user:", error)
    }
  }

  useEffect(() => {
    if (setRefreshFunction) {
      setRefreshFunction(getUserData);
    }
  }, [setRefreshFunction]);

  useEffect(() => {
    getUserData();
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Contact</TableHead>
              {/* <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead> */}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="flex justify-center items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span>Loading users...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((item) => {
                const isOwner = owner?.number === item?.number;
                const isCurrentUser = user?.number === item?.number;
                return (
                  <TableRow key={item?._id} className={`${isCurrentUser ? 'bg-muted' : ''}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>{item?.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{item?.name}</div>
                    </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(item.roleName ?? '')} className="pl-5 pr-5 pt-1.5 pb-1.5">
                        {isOwner && (
                          <CrownIcon className="mr-1 h-4 w-4" />
                        )}
                        {getRoleLabel(item.roleName ?? '')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{item.email}</span>
                        <span className="text-xs text-muted-foreground">{item?.number}</span>
                      </div>
                    </TableCell>
                    {/* <TableCell>
                      <Badge variant={user === "active" ? "outline" : "secondary"}>
                        {user.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell> */}
                    {/* <TableCell>{user.lastActive}</TableCell> */}
                    {/* {owner?._id === item?._id ? (
                      // because this is main user so we need to show another message here
                      <TableCell className="text-right">
                        <Badge variant={"default"}>
                          Owner
                        </Badge>
                      </TableCell>
                    ) : ( */}
                      {hasAnyPermission([Permissions.DELETE_USER, Permissions.UPDATE_USER]) && (
                        <TableCell className="text-right">
                          {isOwner && !isCurrentUser ? (
                            <Badge variant={"default"}>
                              OWNER
                            </Badge>
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {hasPermission(Permissions.UPDATE_USER) && (
                                  <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/users/${item?._id}`}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit User
                                    </Link>
                                  </DropdownMenuItem>
                                )}
                                {hasPermission(Permissions.UPDATE_USER) && (
                                  <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/users/permissions/${item?._id}`}>
                                      <Shield className="mr-2 h-4 w-4" />
                                      Manage Permissions
                                    </Link>
                                  </DropdownMenuItem>
                                )}
                                {hasPermission(Permissions.UPDATE_USER) && (
                                  <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/users/reset-password/${item?._id}`}>
                                      <UserCog className="mr-2 h-4 w-4" />
                                      Reset Password
                                    </Link>
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                {hasPermission(Permissions.DELETE_USER) && (
                                  <DropdownMenuItem onClick={() => handleDeleteClick(item?._id)} className="text-destructive">
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete User
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </TableCell>
                      )}
                    {/* )} */}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this user account. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


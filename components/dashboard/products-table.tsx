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
import { Badge } from "@/components/ui/badge"
import { Edit, Loader2, MoreHorizontal, Search, Trash } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { serverDeleteProduct, serverGetProduct } from "@/services/serverApi"
import { IProduct } from "@/types/product"
import { usePermission } from "@/hooks/usePermission"
import { Permissions } from "@/utils/consts/permission"

export function ProductsTable({ setRefreshFunction }: { setRefreshFunction?: (fn: () => Promise<void>) => void }) {
  const { hasPermission, hasAnyPermission } = usePermission();
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false);
  const [productData, setProductData] = useState<IProduct[]>([]);

  const filteredProducts = productData?.filter((product) => {
    const matchesSearch =
      product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product?.categoryName || '').toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || (product?.categoryName || '').toLowerCase() === categoryFilter.toLowerCase()

    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "in-stock" && product?.status === "In Stock") ||
      (stockFilter === "low-stock" && product?.status === "Low Stock") ||
      (stockFilter === "out-of-stock" && product?.status === "Out of Stock")

    return matchesSearch && matchesCategory && matchesStock
  })

  // Get unique categories
  const categories = ["all", ...new Set(productData?.map((product) => (product?.categoryName || '').toLowerCase()))]

  const handleDeleteClick = (id?: string) => {
    setProductToDelete(id ?? null)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      setLoading(true);
      const res = await serverDeleteProduct(productToDelete ?? '');
      if (res?.success) {
        setDeleteDialogOpen(false)
        setProductToDelete(null)
        getProductData();
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      setLoading(false);
    }
  }

  const getProductData = async () => {
    try {
      setLoading(true)
      const res = await serverGetProduct();
      setProductData(res?.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error("Error fetching category data:", error)
    }
  }

  useEffect(() => {
    if (setRefreshFunction) {
      setRefreshFunction(getProductData);
    }
  }, [setRefreshFunction]);

  useEffect(() => {
    getProductData();
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories
                .filter((c) => c !== "all")
                .map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Stock Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Retail Price</TableHead>
              <TableHead>Wholesale</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span>Loading Product...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : 
            filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product?._id}>
                  <TableCell className="font-medium">{product?.name}</TableCell>
                  <TableCell>{product?.categoryName}</TableCell>
                  <TableCell>₹{product?.retailPrice}</TableCell>
                  <TableCell>₹{product?.wholesalePrice}</TableCell>
                  <TableCell>
                    {product?.quantity} {product?.unit}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product?.status === "In Stock"
                          ? "default"
                          : product?.status === "Low Stock"
                            ? "outline"
                            : "destructive"
                      }
                    >
                      {product?.status}
                    </Badge>
                  </TableCell>
                  {hasAnyPermission([Permissions.UPDATE_PRODUCT, Permissions.DELETE_PRODUCT]) && (
                    <TableCell className="text-right">
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
                          {hasPermission(Permissions.UPDATE_PRODUCT) && (
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/products/${product?._id}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                          )}
                          {hasPermission(Permissions.DELETE_PRODUCT) && (
                            <DropdownMenuItem onClick={() => handleDeleteClick(product?._id)}>
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No products found.
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
              This will permanently delete this product from your inventory. This action cannot be undone.
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


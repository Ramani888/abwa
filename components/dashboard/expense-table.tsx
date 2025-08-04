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
import { Edit, Loader2, MoreHorizontal, Trash, Tag } from "lucide-react"
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
import { serverDeleteExpense, serverGetExpense } from "@/services/serverApi"
import { formatCurrency } from "@/utils/helpers/general"
import { usePermission } from "@/hooks/usePermission"
import { Permissions } from "@/utils/consts/permission"
import { IExpense } from "@/types/expense"
import { Badge } from "@/components/ui/badge"

export function ExpenseTable({ setRefreshFunction }: { setRefreshFunction?: (fn: () => Promise<void>) => void }) {
  const { hasPermission, hasAnyPermission } = usePermission();
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false);
  const [expenseData, setExpenseData] = useState<IExpense[]>([])

  const filteredExpenses = expenseData?.filter((expense) => {
    const type = expense?.type?.toLowerCase() || '';
    const notes = expense?.notes?.toLowerCase() || '';
    const query = searchQuery?.toLowerCase() || '';
    return type.includes(query) || notes.includes(query);
  });

  const handleDeleteClick = (id: string) => {
    setExpenseToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!expenseToDelete) return;
    try {
      setLoading(true);
      const res = await serverDeleteExpense(expenseToDelete ?? '');
      if (res?.success) {
        setDeleteDialogOpen(false)
        setExpenseToDelete(null)
        getExpenseData();
      }
    } catch (error) {
      console.error("Error deleting expense:", error)
      setLoading(false);
    }
  }

  const getExpenseData = async () => {
    try {
      setLoading(true)
      const res = await serverGetExpense();
      setExpenseData(res?.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error("Error fetching expense data:", error)
    }
  }

  useEffect(() => {
    if (setRefreshFunction) {
      setRefreshFunction(getExpenseData);
    }
  }, [setRefreshFunction]);

  useEffect(() => {
    getExpenseData();
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full max-w-full sm:max-w-sm">
          <Tag className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search expense type or notes..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Mode</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span>Loading Expenses...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : 
            filteredExpenses?.length > 0 ? (
              filteredExpenses?.map((expense) => (
                <TableRow key={expense?._id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {expense?.captureDate ? new Date(expense.captureDate).toLocaleDateString() : "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {expense?.type}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {formatCurrency(expense?.amount)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        expense?.paymentMode === "Cash"
                          ? "default"
                          : "secondary"
                      }>
                        {expense?.paymentMode}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{expense?.notes}</TableCell>
                  {hasAnyPermission([Permissions.UPDATE_USER, Permissions.DELETE_USER]) && (
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
                          {hasPermission(Permissions.UPDATE_USER) && (
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/expense/${expense?._id}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                          )}
                          {hasPermission(Permissions.DELETE_USER) && (
                            <DropdownMenuItem onClick={() => handleDeleteClick(expense?._id ?? '')}>
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
                <TableCell colSpan={6} className="h-24 text-center">
                  No expenses found.
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
              This will permanently delete this expense. This action cannot be undone.
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
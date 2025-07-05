"use client"

import { Pie, PieChart, Cell, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"

export function CustomerStats() {
  const { customers, loading, error } = useSelector((state: RootState) => state.customers)

  const retailCustomers = customers.filter(customer => customer?.customerType === "retail").length;
  const wholesaleCustomers = customers.filter(customer => customer?.customerType === "wholesale").length;
  const activeCustomersThisMonth = customers.filter(customer => {
    if (!customer?.captureDate) return false;
    const captureDateStr = (typeof customer.captureDate === "string")
      ? (customer.captureDate as string).slice(0, 7)
      : customer.captureDate instanceof Date
        ? customer.captureDate.toISOString().slice(0, 7)
        : "";
    return captureDateStr === new Date().toISOString().slice(0, 7);
  }).length;
  const totalCustomers = customers?.length;

  const customerData = [
    { name: "Retail Customers", value: retailCustomers, color: "hsl(var(--chart-1))" },
    { name: "Wholesale Customers", value: wholesaleCustomers, color: "hsl(var(--chart-2))" },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="h-8 bg-muted animate-pulse rounded mb-4 w-1/2" />
            <div className="h-[300px] bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="h-8 bg-muted animate-pulse rounded mb-4 w-1/2" />
            <div className="space-y-4">
              {/* Skeleton for Total Customers */}
              <div>
                <div className="flex justify-between mb-1">
                  <div className="h-4 bg-muted animate-pulse rounded w-1/3" />
                  <div className="h-4 bg-muted animate-pulse rounded w-1/6" />
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 animate-pulse" />
              </div>
              {/* Skeleton for Retail Customers */}
              <div>
                <div className="flex justify-between mb-1">
                  <div className="h-4 bg-muted animate-pulse rounded w-1/3" />
                  <div className="h-4 bg-muted animate-pulse rounded w-1/6" />
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 animate-pulse" />
              </div>
              {/* Skeleton for Wholesale Customers */}
              <div>
                <div className="flex justify-between mb-1">
                  <div className="h-4 bg-muted animate-pulse rounded w-1/3" />
                  <div className="h-4 bg-muted animate-pulse rounded w-1/6" />
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 animate-pulse" />
              </div>
              {/* Skeleton for Active This Month */}
              <div>
                <div className="flex justify-between mb-1">
                  <div className="h-4 bg-muted animate-pulse rounded w-1/3" />
                  <div className="h-4 bg-muted animate-pulse rounded w-1/6" />
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Customer Distribution</h3>
          <div className="h-[320px] sm:h-[300px] px-2 sm:px-6"> {/* Increased height and added horizontal padding */}
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={typeof window !== "undefined" && window.innerWidth < 640 ? 100 : 130} // Increased radius for both mobile and desktop
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => {
                    // Responsive label: abbreviate on small screens
                    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
                    const shortName =
                      name === "Retail Customers"
                        ? "Retail"
                        : name === "Wholesale Customers"
                        ? "Wholesale"
                        : name;
                    return `${isMobile ? shortName : name} ${(percent * 100).toFixed(0)}%`;
                  }}
                >
                  {customerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Customer Statistics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs sm:text-sm font-medium">Total Customers</span>
                <span className="text-xs sm:text-sm font-medium">{totalCustomers}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${((totalCustomers / totalCustomers) * 100).toFixed(2)}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs sm:text-sm font-medium">Retail Customers</span>
                <span className="text-xs sm:text-sm font-medium">{retailCustomers}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${((retailCustomers / totalCustomers) * 100).toFixed(2)}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs sm:text-sm font-medium">Wholesale Customers</span>
                <span className="text-xs sm:text-sm font-medium">{wholesaleCustomers}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${((wholesaleCustomers / totalCustomers) * 100).toFixed(2)}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs sm:text-sm font-medium">Active This Month</span>
                <span className="text-xs sm:text-sm font-medium">{activeCustomersThisMonth}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${((activeCustomersThisMonth / totalCustomers) * 100).toFixed(2)}%` }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


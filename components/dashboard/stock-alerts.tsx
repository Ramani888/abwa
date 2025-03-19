import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PackageOpen } from "lucide-react"

// Mock data for stock alerts
const alerts = [
  {
    id: "5",
    name: "Drip Irrigation Kit",
    category: "Equipment",
    stock: 0,
    minStock: 10,
    status: "Out of Stock",
  },
  {
    id: "4",
    name: "Garden Tools Set",
    category: "Equipment",
    stock: 18,
    minStock: 20,
    status: "Low Stock",
  },
  {
    id: "3",
    name: "Pesticide Spray",
    category: "Pesticides",
    stock: 42,
    minStock: 50,
    status: "Low Stock",
  },
]

export function StockAlerts() {
  return (
    <div className="space-y-4">
      {alerts.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">No stock alerts at this time.</p>
      ) : (
        <div className="space-y-3">
          {alerts.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.name}</span>
                  <Badge
                    variant={item.status === "Out of Stock" ? "destructive" : "outline"}
                    className={item.status === "Low Stock" ? "text-amber-500 border-amber-500" : ""}
                  >
                    {item.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {item.category} · Current: {item.stock} · Minimum: {item.minStock}
                </div>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/stock/update/${item.id}`}>
                  <PackageOpen className="mr-2 h-4 w-4" />
                  Update
                </Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


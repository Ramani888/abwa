import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { ShopCard } from "@/components/dashboard/shop-card"

// Mock data for shops
const shops = [
  {
    id: "1",
    name: "Green Harvest Agro Shop",
    address: "123 Farm Road, Agricity",
    phone: "+91 9876543210",
    email: "contact@greenharvest.com",
  },
  {
    id: "2",
    name: "Farm Fresh Supplies",
    address: "456 Rural Avenue, Croptown",
    phone: "+91 9876543211",
    email: "info@farmfresh.com",
  },
  {
    id: "3",
    name: "Agro Solutions Center",
    address: "789 Seed Street, Plantville",
    phone: "+91 9876543212",
    email: "support@agrosolutions.com",
  },
]

export default function ShopsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Manage Shops</h2>
        <Link href="/dashboard/shops/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Shop
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shops.map((shop) => (
          <ShopCard key={shop.id} shop={shop} />
        ))}
      </div>

      {shops.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No shops found</CardTitle>
            <CardDescription>You haven't added any shops yet. Create your first shop to get started.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/dashboard/shops/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Shop
              </Button>
            </Link>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}


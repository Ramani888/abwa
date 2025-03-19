import { Card, CardContent } from "@/components/ui/card"
import { Store, Mail, Phone, MapPin, Calendar, FileText, ShoppingCart, Users } from "lucide-react"

interface ShopDetailsProps {
  shop: {
    id: string
    name: string
    owner: string
    address: string
    phone: string
    email: string
    gstNumber: string
    established: string
    totalProducts: number
    totalOrders: number
    totalCustomers: number
    totalRevenue: string
  }
}

export function ShopDetails({ shop }: ShopDetailsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Store className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Shop Name</p>
                <p className="text-muted-foreground">{shop.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-muted-foreground">{shop.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Phone Number</p>
                <p className="text-muted-foreground">{shop.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-muted-foreground">{shop.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Business Details</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">GST Number</p>
                <p className="text-muted-foreground">{shop.gstNumber}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Established</p>
                <p className="text-muted-foreground">{new Date(shop.established).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShoppingCart className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Total Orders</p>
                <p className="text-muted-foreground">{shop.totalOrders}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Total Customers</p>
                <p className="text-muted-foreground">{shop.totalCustomers}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, Mail, Phone, MapPin, Edit, Trash } from "lucide-react"

interface ShopCardProps {
  shop: {
    id: string
    name: string
    address: string
    phone: string
    email: string
  }
}

export function ShopCard({ shop }: ShopCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Store className="h-5 w-5" />
          <CardTitle className="text-xl">{shop.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <p className="text-sm">{shop.address}</p>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm">{shop.phone}</p>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm">{shop.email}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/dashboard/shops/${shop.id}`}>
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </Link>
        <Button variant="outline" size="sm" className="text-destructive">
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}


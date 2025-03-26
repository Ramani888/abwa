"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Store, ChevronDown } from "lucide-react"

// Mock data for shops
const shops = [
  { id: "1", name: "Green Harvest Agro Shop" },
  { id: "2", name: "Farm Fresh Supplies" },
  { id: "3", name: "Agro Solutions Center" },
]

export function ShopSelector() {
  const [selectedShop, setSelectedShop] = useState(shops[0])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[240px] justify-between">
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            <span>{selectedShop.name}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px]">
        <DropdownMenuLabel>Select Shop</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {shops.map((shop) => (
          <DropdownMenuItem key={shop.id} onClick={() => setSelectedShop(shop)} className="cursor-pointer">
            {shop.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


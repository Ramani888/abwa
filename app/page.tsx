import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, BarChart3, Package, Users, FileText, Database } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-auto">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6" />
              <span className="font-bold">AgroBill</span>
            </Link>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Agro Billing System</h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Manage your agro shop, inventory, billing, and customers all in one place.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/register">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Package className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Product Management</h3>
                  <p className="text-muted-foreground">
                    Easily manage your products, categories, and pricing for retail and wholesale customers.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Order & Billing</h3>
                  <p className="text-muted-foreground">
                    Create and manage orders, generate invoices, and track payments with ease.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Database className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Stock Management</h3>
                  <p className="text-muted-foreground">
                    Track inventory levels, get low stock alerts, and manage stock movements.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Users className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Customer Management</h3>
                  <p className="text-muted-foreground">
                    Manage retail and wholesale customers with different pricing and payment terms.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <BarChart3 className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Reports & Analytics</h3>
                  <p className="text-muted-foreground">
                    Get insights into sales, inventory, and customer behavior with detailed reports.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <FileText className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">User Management</h3>
                  <p className="text-muted-foreground">
                    Create staff accounts with specific permissions to manage your shop.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-muted">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <ShoppingBag className="h-6 w-6" />
            <p className="text-center text-sm leading-loose md:text-left">© 2025 AgroBill. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}


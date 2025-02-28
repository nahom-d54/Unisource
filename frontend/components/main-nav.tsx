"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { FiBook, FiMenu } from "react-icons/fi"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MainNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/resources", label: "Resources" },
    { href: "/categories", label: "Categories" },
    { href: "/dashboard", label: "Dashboard" },
  ]

  return (
    <div className="mr-4 flex items-center justify-between w-full">
      <Link href="/" className="flex items-center space-x-2">
        <FiBook className="h-6 w-6" />
        <span className="font-bold">Unisource</span>
      </Link>
      <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === item.href ? "text-foreground" : "text-foreground/60",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <FiMenu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] sm:w-[300px]">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-foreground/60 hover:text-foreground transition-colors",
                    pathname === item.href && "text-foreground",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}


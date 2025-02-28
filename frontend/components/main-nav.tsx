"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { FiBook } from "react-icons/fi"
import { ThemeToggle } from "@/components/theme-toggle"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex items-center">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <FiBook className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">Unisource</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Home
        </Link>
        <Link
          href="/resources"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/resources") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Resources
        </Link>
        <Link
          href="/categories"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/categories") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Categories
        </Link>
        <Link
          href="/dashboard"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/dashboard") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Dashboard
        </Link>
      </nav>
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </div>
  )
}


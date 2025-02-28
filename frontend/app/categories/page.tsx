import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import CategoryList from "@/components/category-list"

export default function CategoriesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1 py-6 md:py-10">
        <div className="container">
          <h1 className="text-3xl font-bold mb-6">Categories</h1>
          <CategoryList />
        </div>
      </main>
    </div>
  )
}


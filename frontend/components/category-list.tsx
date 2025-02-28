"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Category } from "@/types"
import Link from "next/link"
import { FiBook } from "react-icons/fi"
import { useCategories } from "@/hooks/useCategories"

export default function CategoryList() {
  const { data: categories, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
          ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 p-4 text-center">
        <p className="text-destructive">Failed to load categories</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {categories?.map((category: Category) => (
        <Link key={category.id} href={`/categories/${category.id}`}>
          <Card className="h-full transition-all hover:bg-muted/50">
            <CardHeader className="pb-2">
              <div className="flex justify-center">
                <FiBook className="h-8 w-8" />
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <CardTitle className="text-base">{category.name}</CardTitle>
              <CardDescription>{category.resource_count} resources</CardDescription>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}


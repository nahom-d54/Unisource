"use client"

import type React from "react"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { apiClient } from "@/lib/api-client"
import type { Category } from "@/types"
import Link from "next/link"
import { BookOpen, Code, FlaskRoundIcon as Flask, History, Lightbulb, Microscope } from "lucide-react"
import { getCategories } from "@/api/category"

// Map of category names to icons
const categoryIcons: Record<string, React.ReactNode> = {
  "Computer Science": <Code className="h-8 w-8" />,
  Mathematics: <BookOpen className="h-8 w-8" />,
  Chemistry: <Flask className="h-8 w-8" />,
  Biology: <Microscope className="h-8 w-8" />,
  History: <History className="h-8 w-8" />,
  Psychology: <Lightbulb className="h-8 w-8" />,
}

export default function CategoryQuickAccess() {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {Array(6)
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

  // Fallback to sample data if API returns empty
  const displayCategories = categories?.length
    ? categories
    : [
        { id: "1", name: "Computer Science", resource_count: 120 },
        { id: "2", name: "Mathematics", resource_count: 85 },
        { id: "3", name: "Chemistry", resource_count: 64 },
        { id: "4", name: "Biology", resource_count: 72 },
        { id: "5", name: "History", resource_count: 53 },
        { id: "6", name: "Psychology", resource_count: 41 },
      ]

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {displayCategories.map((category: Category) => (
        <Link key={category.id} href={`/categories/${category.id}`}>
          <Card className="h-full transition-all hover:bg-muted/50">
            <CardHeader className="pb-2">
              <div className="flex justify-center">
                {categoryIcons[category.name] || <BookOpen className="h-8 w-8" />}
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


"use client"

import { useQuery } from "@tanstack/react-query"
import { ResourceCard } from "@/components/resource-card"
import { Skeleton } from "@/components/ui/skeleton"
import { apiClient } from "@/lib/api-client"
import type { Resource } from "@/types"
import { getFeaturedResource } from "@/api/resource"

export default function FeaturedResources() {
  const {
    data: resources,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["featuredResources"],
    queryFn: () => getFeaturedResource(),
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="col-span-1">
              <Skeleton className="h-[300px] w-full rounded-xl" />
            </div>
          ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 p-4 text-center">
        <p className="text-destructive">Failed to load featured resources</p>
      </div>
    )
  }

  // Fallback to sample data if API returns empty
  const displayResources = resources?.length
    ? resources
    : [
        {
          id: "1",
          title: "Introduction to Computer Science",
          description: "Comprehensive guide to CS fundamentals",
          category: "Computer Science",
          subcategory: "Introduction",
          file_url: "#",
          thumbnail: "/placeholder.svg?height=400&width=300",
          created_at: "2023-01-15T00:00:00Z",
          updated_at: "2023-01-15T00:00:00Z",
          author: "Prof. Smith",
          avg_rating: 4.5,
          reviews_count: 12,
        },
        {
          id: "2",
          title: "Advanced Calculus Handbook",
          description: "Complete reference for advanced calculus topics",
          category: "Mathematics",
          subcategory: "Calculus",
          file_url: "#",
          thumbnail: "/placeholder.svg?height=400&width=300",
          created_at: "2023-02-10T00:00:00Z",
          updated_at: "2023-02-10T00:00:00Z",
          author: "Dr. Johnson",
          avg_rating: 4.8,
          reviews_count: 24,
        },
        {
          id: "3",
          title: "Organic Chemistry Lab Manual",
          description: "Step-by-step guide for organic chemistry experiments",
          category: "Chemistry",
          subcategory: "Organic Chemistry",
          file_url: "#",
          thumbnail: "/placeholder.svg?height=400&width=300",
          created_at: "2023-03-05T00:00:00Z",
          updated_at: "2023-03-05T00:00:00Z",
          author: "Prof. Williams",
          avg_rating: 4.2,
          reviews_count: 18,
        },
      ]

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {displayResources.map((resource: Resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  )
}


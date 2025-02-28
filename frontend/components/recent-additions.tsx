"use client"

import { useQuery } from "@tanstack/react-query"
import { ResourceCard } from "@/components/resource-card"
import { Skeleton } from "@/components/ui/skeleton"
import { apiClient } from "@/lib/api-client"
import type { Resource } from "@/types"

export default function RecentAdditions() {
  const {
    data: resources,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recentResources"],
    queryFn: async () => {
      const { data } = await apiClient.get<Resource[]>("/api/v1/resources/recent/")
      return data
    },
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
        <p className="text-destructive">Failed to load recent resources</p>
      </div>
    )
  }

  // Fallback to sample data if API returns empty
  const displayResources = resources?.length
    ? resources
    : [
        {
          id: "4",
          title: "Machine Learning Fundamentals",
          description: "Introduction to machine learning algorithms and applications",
          category: "Computer Science",
          subcategory: "Machine Learning",
          file_url: "#",
          thumbnail: "/placeholder.svg?height=400&width=300",
          created_at: "2023-04-20T00:00:00Z",
          updated_at: "2023-04-20T00:00:00Z",
          author: "Dr. Chen",
          avg_rating: 4.7,
          reviews_count: 9,
        },
        {
          id: "5",
          title: "World History: Modern Era",
          description: "Comprehensive overview of modern world history",
          category: "History",
          subcategory: "Modern History",
          file_url: "#",
          thumbnail: "/placeholder.svg?height=400&width=300",
          created_at: "2023-04-18T00:00:00Z",
          updated_at: "2023-04-18T00:00:00Z",
          author: "Prof. Garcia",
          avg_rating: 4.3,
          reviews_count: 15,
        },
        {
          id: "6",
          title: "Introduction to Psychology",
          description: "Foundational concepts in psychology and human behavior",
          category: "Psychology",
          subcategory: "Introduction",
          file_url: "#",
          thumbnail: "/placeholder.svg?height=400&width=300",
          created_at: "2023-04-15T00:00:00Z",
          updated_at: "2023-04-15T00:00:00Z",
          author: "Dr. Martinez",
          avg_rating: 4.6,
          reviews_count: 21,
        },
      ]

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {displayResources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  )
}


"use client"


import { ResourceCard } from "@/components/resource-card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Resource } from "@/types"
import { useResources } from "@/hooks/useResources"

export default function ResourceList() {
  const { data: resources, isLoading, error } = useResources();

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
        <p className="text-destructive">Failed to load resources</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {resources?.map((resource: Resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  )
}


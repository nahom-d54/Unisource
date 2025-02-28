"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RatingStars } from "@/components/rating-stars"
import type { Resource } from "@/types"
import { formatDistanceToNow } from "date-fns"
import { FiDownload, FiHeart } from "react-icons/fi"
import Link from "next/link"
import Image from "next/image"
import { useFavorites } from "@/lib/use-favorites"
import { cn } from "@/lib/utils"

interface ResourceCardProps {
  resource: Resource
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites(resource.id)

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative aspect-[3/2] w-full">
        <Image
          src={resource.thumbnail || "/placeholder.svg?height=400&width=600"}
          alt={resource.title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-2">
            <CardTitle className="line-clamp-1 text-lg">{resource.title}</CardTitle>
            <CardDescription className="line-clamp-1 text-sm">
              {resource.category} • {resource.subcategory}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => toggleFavorite()}>
            <FiHeart className={cn("h-4 w-4", isFavorite ? "fill-primary text-primary" : "")} />
            <span className="sr-only">Toggle favorite</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="line-clamp-2 text-sm text-muted-foreground">{resource.description}</p>
        <div className="mt-2 flex items-center gap-2">
          <RatingStars rating={resource.avg_rating} />
          <span className="text-xs text-muted-foreground">({resource.reviews_count} reviews)</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 pt-0 gap-2">
        <div className="text-xs text-muted-foreground w-full sm:w-auto">
          Added {formatDistanceToNow(new Date(resource.created_at), { addSuffix: true })}
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-initial">
            <Link href={`/resources/${resource.id}`}>View</Link>
          </Button>
          <Button size="sm" asChild className="flex-1 sm:flex-initial">
            <a href={resource.file_url} download>
              <FiDownload className="mr-1 h-3 w-3" />
              Download
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}


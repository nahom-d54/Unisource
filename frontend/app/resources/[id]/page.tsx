"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import type { Resource, Review } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { RatingStars } from "@/components/rating-stars"
import { ResourceCard } from "@/components/resource-card"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { formatDistanceToNow } from "date-fns"
import { Download, Heart, Share2 } from "lucide-react"
import Image from "next/image"
import { useFavorites } from "@/lib/use-favorites"
import { cn } from "@/lib/utils"
import ReviewsList from "@/components/reviews-list"

export default function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data: resource, isLoading: isLoadingResource } = useQuery({
    queryKey: ["resource", id],
    queryFn: async () => {
      const { data } = await apiClient.get<Resource>(`/api/v1/resources/${id}/`)
      return data
    },
  })

  const { data: relatedResources, isLoading: isLoadingRelated } = useQuery({
    queryKey: ["relatedResources", id],
    queryFn: async () => {
      const { data } = await apiClient.get<Resource[]>(`/api/v1/resources/${id}/related/`)
      return data
    },
    enabled: !!resource,
  })

  const { isFavorite, toggleFavorite } = useFavorites(id)

  if (isLoadingResource) {
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <Skeleton className="h-[400px] w-full rounded-xl" />
                <div className="mt-6 space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
              <div>
                <Skeleton className="h-[300px] w-full rounded-xl" />
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Fallback to sample data if API returns empty
  const displayResource = resource || {
    id: id as string,
    title: "Sample Resource",
    description: "This is a sample resource description. The actual resource data will be loaded from the API.",
    category: "Sample Category",
    subcategory: "Sample Subcategory",
    file_url: "#",
    thumbnail: "/placeholder.svg?height=600&width=800",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: "Sample Author",
    avg_rating: 4.5,
    reviews_count: 10,
    content: "Sample content for the resource. This would typically include detailed information about the resource.",
    reviews: [
      {
        id: "1",
        user: { id: "1", name: "John Doe", avatar: null },
        rating: 5,
        comment: "Great resource, very helpful!",
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        user: { id: "2", name: "Jane Smith", avatar: null },
        rating: 4,
        comment: "Good content, but could use more examples.",
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
  }

  // Fallback for related resources
  const displayRelated = relatedResources?.length
    ? relatedResources
    : [
        {
          id: "related1",
          title: "Related Resource 1",
          description: "A related resource in the same category",
          category: displayResource.category,
          subcategory: displayResource.subcategory,
          file_url: "#",
          thumbnail: "/placeholder.svg?height=400&width=300",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          author: "Author 1",
          avg_rating: 4.2,
          reviews_count: 8,
        },
        {
          id: "related2",
          title: "Related Resource 2",
          description: "Another related resource in the same category",
          category: displayResource.category,
          subcategory: displayResource.subcategory,
          file_url: "#",
          thumbnail: "/placeholder.svg?height=400&width=300",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          author: "Author 2",
          avg_rating: 4.7,
          reviews_count: 12,
        },
      ]

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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={displayResource.thumbnail || "/placeholder.svg"}
                  alt={displayResource.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="mt-6">
                <h1 className="text-3xl font-bold">{displayResource.title}</h1>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <RatingStars rating={displayResource.avg_rating} />
                    <span className="text-sm text-muted-foreground">({displayResource.reviews_count} reviews)</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Added {formatDistanceToNow(new Date(displayResource.created_at), { addSuffix: true })}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild>
                    <a href={displayResource.file_url} download>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                  <Button variant="outline" onClick={() => toggleFavorite()}>
                    <Heart className={cn("mr-2 h-4 w-4", isFavorite ? "fill-primary text-primary" : "")} />
                    {isFavorite ? "Favorited" : "Add to Favorites"}
                  </Button>
                  <Button variant="outline">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>

                <Tabs defaultValue="details" className="mt-6">
                  <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="mt-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium">Description</h3>
                            <p className="mt-1 text-muted-foreground">{displayResource.description}</p>
                          </div>
                          <div>
                            <h3 className="font-medium">Category</h3>
                            <p className="mt-1 text-muted-foreground">
                              {displayResource.category} &gt; {displayResource.subcategory}
                            </p>
                          </div>
                          <div>
                            <h3 className="font-medium">Author</h3>
                            <p className="mt-1 text-muted-foreground">{displayResource.author}</p>
                          </div>
                          {displayResource.content && (
                            <div>
                              <h3 className="font-medium">Content</h3>
                              <div className="mt-1 text-muted-foreground">{displayResource.content}</div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="reviews" className="mt-4">
                    <ReviewsList resourceId={id} initialReviews={displayResource.reviews as Review[]} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold">Related Resources</h2>
              {isLoadingRelated ? (
                <div className="space-y-4">
                  {Array(2)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-[250px] w-full rounded-xl" />
                    ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {displayRelated.map((related) => (
                    <ResourceCard key={related.id} resource={related} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ResourceCard } from "@/components/resource-card"
import { apiClient } from "@/lib/api-client"
import type { Resource } from "@/types"
import { useAuth } from "@/lib/auth-provider"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { BookOpen, Clock, Heart, Star } from "lucide-react"
import DashboardNav from "@/components/dashboard-nav"

export default function DashboardPage() {
  const { user } = useAuth()

  const { data: recentlyViewed, isLoading: isLoadingRecent } = useQuery({
    queryKey: ["recentlyViewed"],
    queryFn: async () => {
      const { data } = await apiClient.get<Resource[]>("/api/v1/resources/recently-viewed/")
      return data
    },
  })

  const { data: favorites, isLoading: isLoadingFavorites } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const { data } = await apiClient.get<Resource[]>("/api/v1/resources/favorites/")
      return data
    },
  })

  const { data: topRated, isLoading: isLoadingTopRated } = useQuery({
    queryKey: ["topRated"],
    queryFn: async () => {
      const { data } = await apiClient.get<Resource[]>("/api/v1/resources/top-rated/")
      return data
    },
  })

  // Fallback data for recently viewed resources
  const displayRecentlyViewed = recentlyViewed?.length
    ? recentlyViewed
    : [
        {
          id: "recent1",
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
          id: "recent2",
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
      ]

  // Fallback data for favorite resources
  const displayFavorites = favorites?.length
    ? favorites
    : [
        {
          id: "fav1",
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
        {
          id: "fav2",
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

  // Fallback data for top rated resources
  const displayTopRated = topRated?.length
    ? topRated
    : [
        {
          id: "top1",
          title: "Machine Learning Fundamentals",
          description: "Introduction to machine learning algorithms and applications",
          category: "Computer Science",
          subcategory: "Machine Learning",
          file_url: "#",
          thumbnail: "/placeholder.svg?height=400&width=300",
          created_at: "2023-04-20T00:00:00Z",
          updated_at: "2023-04-20T00:00:00Z",
          author: "Dr. Chen",
          avg_rating: 4.9,
          reviews_count: 32,
        },
        {
          id: "top2",
          title: "World History: Modern Era",
          description: "Comprehensive overview of modern world history",
          category: "History",
          subcategory: "Modern History",
          file_url: "#",
          thumbnail: "/placeholder.svg?height=400&width=300",
          created_at: "2023-04-18T00:00:00Z",
          updated_at: "2023-04-18T00:00:00Z",
          author: "Prof. Garcia",
          avg_rating: 4.8,
          reviews_count: 27,
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
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex lg:w-[240px]">
          <DashboardNav />
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recently Viewed</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{displayRecentlyViewed.length}</div>
                <p className="text-xs text-muted-foreground">Resources you've viewed recently</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favorites</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{displayFavorites.length}</div>
                <p className="text-xs text-muted-foreground">Resources you've saved as favorites</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Rated</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{displayTopRated.length}</div>
                <p className="text-xs text-muted-foreground">Highest rated resources</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {displayRecentlyViewed.length + displayFavorites.length + displayTopRated.length}
                </div>
                <p className="text-xs text-muted-foreground">Total resources available to you</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="recent" className="mt-6">
            <TabsList>
              <TabsTrigger value="recent">Recently Viewed</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
            </TabsList>
            <TabsContent value="recent" className="pt-6">
              {isLoadingRecent ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
                    ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {displayRecentlyViewed.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="favorites" className="pt-6">
              {isLoadingFavorites ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
                    ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {displayFavorites.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="top-rated" className="pt-6">
              {isLoadingTopRated ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
                    ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {displayTopRated.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}


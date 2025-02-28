"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-provider"
import { useToast } from "@/components/ui/use-toast"

export function useFavorites(resourceId: string) {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isFavorite, setIsFavorite] = useState(false)

  // Check if resource is in favorites
  const { data: favorites } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      if (!user) return []
      const { data } = await apiClient.get("/api/v1/resources/favorites/")
      return data
    },
    enabled: !!user,
  })

  // Set initial favorite state
  useEffect(() => {
    if (favorites) {
      const isInFavorites = favorites.some((fav: any) => fav.id === resourceId)
      setIsFavorite(isInFavorites)
    }
  }, [favorites, resourceId])

  // Add to favorites mutation
  const addToFavorites = useMutation({
    mutationFn: async () => {
      await apiClient.post(`/api/v1/resources/${resourceId}/favorite/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] })
      toast({
        title: "Added to favorites",
        description: "This resource has been added to your favorites.",
      })
    },
    onError: () => {
      setIsFavorite(false)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add to favorites. Please try again.",
      })
    },
  })

  // Remove from favorites mutation
  const removeFromFavorites = useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/api/v1/resources/${resourceId}/favorite/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] })
      toast({
        title: "Removed from favorites",
        description: "This resource has been removed from your favorites.",
      })
    },
    onError: () => {
      setIsFavorite(true)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove from favorites. Please try again.",
      })
    },
  })

  // Toggle favorite
  const toggleFavorite = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to add resources to favorites.",
      })
      return
    }

    setIsFavorite((prev) => !prev)

    if (isFavorite) {
      removeFromFavorites.mutate()
    } else {
      addToFavorites.mutate()
    }
  }

  return {
    isFavorite,
    toggleFavorite,
    isLoading: addToFavorites.isPending || removeFromFavorites.isPending,
  }
}


"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RatingStars } from "@/components/rating-stars"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { apiClient } from "@/lib/api-client"
import type { Review } from "@/types"
import { useAuth } from "@/lib/auth-provider"
import { formatDistanceToNow } from "date-fns"
import { Pencil, Trash2, User } from "lucide-react"
import { createReview, deleteReview, listReviews, updateReview } from "@/api/review"

interface ReviewsListProps {
  resourceId: string
  initialReviews?: Review[]
}

export default function ReviewsList({ resourceId, initialReviews = [] }: ReviewsListProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [userRating, setUserRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", resourceId],
    queryFn: () => listReviews(resourceId),
    initialData: initialReviews,
  })

  const createReviewMutation = useMutation({
    mutationFn: (review: Review) => createReview(resourceId, review),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", resourceId] })
      queryClient.invalidateQueries({ queryKey: ["resource", resourceId] })
      setUserRating(0)
      setReviewText("")
      toast({
        title: "Review submitted",
        description: "Your review has been submitted successfully.",
      })
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit your review. Please try again.",
      })
    },
  })

  const updateReviewMutation = useMutation({
    mutationFn: (review: Review) => updateReview(review), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", resourceId] })
      queryClient.invalidateQueries({ queryKey: ["resource", resourceId] })
      setEditingReviewId(null)
      toast({
        title: "Review updated",
        description: "Your review has been updated successfully.",
      })
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update your review. Please try again.",
      })
    },
  })

  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: String) => deleteReview(reviewId || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", resourceId] })
      queryClient.invalidateQueries({ queryKey: ["resource", resourceId] })
      toast({
        title: "Review deleted",
        description: "Your review has been deleted successfully.",
      })
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete your review. Please try again.",
      })
    },
  })

  const handleSubmitReview = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to submit a review.",
      })
      return
    }

    if (userRating === 0) {
      toast({
        variant: "destructive",
        title: "Rating required",
        description: "Please provide a rating before submitting.",
      })
      return
    }

    createReviewMutation.mutate({
      rating: userRating,
      comment: reviewText,
    })
  }

  const handleEditReview = (review: Review) => {
    setEditingReviewId(review?.id || null)
    setUserRating(review.rating)
    setReviewText(review.comment)
  }

  const handleUpdateReview = () => {
    if (!editingReviewId) return

    updateReviewMutation.mutate({
      id: editingReviewId,
    
        rating: userRating,
        comment: reviewText,
    
    })
  }

  const handleDeleteReview = (reviewId: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      deleteReviewMutation.mutate(reviewId)
    }
  }

  const handleCancelEdit = () => {
    setEditingReviewId(null)
    setUserRating(0)
    setReviewText("")
  }

  const userReview = reviews?.find((review) => user && review?.user?.id === user.id)

  return (
    <div className="space-y-6">
      {!userReview && !editingReviewId && user && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-2 text-sm font-medium">Your Rating</div>
                <RatingStars rating={userRating} onRatingChange={setUserRating} readOnly={false} size="lg" />
              </div>
              <div>
                <div className="mb-2 text-sm font-medium">Your Review</div>
                <Textarea
                  placeholder="Share your thoughts about this resource..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmitReview} disabled={createReviewMutation.isPending}>
              {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {editingReviewId && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Your Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-2 text-sm font-medium">Your Rating</div>
                <RatingStars rating={userRating} onRatingChange={setUserRating} readOnly={false} size="lg" />
              </div>
              <div>
                <div className="mb-2 text-sm font-medium">Your Review</div>
                <Textarea
                  placeholder="Share your thoughts about this resource..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleUpdateReview} disabled={updateReviewMutation.isPending}>
              {updateReviewMutation.isPending ? "Updating..." : "Update Review"}
            </Button>
          </CardFooter>
        </Card>
      )}

      <h3 className="text-lg font-semibold">
        {reviews?.length} {reviews?.length === 1 ? "Review" : "Reviews"}
      </h3>

      {isLoading ? (
        <div>Loading reviews...</div>
      ) : reviews?.length === 0 ? (
        <div className="rounded-lg border p-4 text-center text-muted-foreground">
          No reviews yet. Be the first to review this resource!
        </div>
      ) : (
        <div className="space-y-4">
          {reviews?.map((review) => (
            <Card key={review.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={review?.user?.avatar || ""} alt={review?.user?.name} />
                      <AvatarFallback>{review?.user?.name?.charAt(0) || <User className="h-4 w-4" />}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{review?.user?.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(review?.created_at || ""), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  <RatingStars rating={review.rating} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{review.comment}</p>
              </CardContent>
              {user && review?.user?.id === user.id && !editingReviewId && (
                <CardFooter className="flex justify-end gap-2 pt-0">
                  <Button variant="ghost" size="sm" onClick={() => handleEditReview(review)}>
                    <Pencil className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteReview(review?.id || "")}>
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


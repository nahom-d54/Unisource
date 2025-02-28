import { Review } from "@/types";
import { api } from "./api";

export async function getReviews() {
  const response = await api.get("/review/");
  return response.data;
}


export async function listReviews(resourceId: String) {
  const response = await api.get<Review[]>(`/api/resources/${resourceId}/reviews/`)
  return response.data;
}

export async function createReview(resourceId: String, review: Review) {
    const response = await api.post<Review>(`/api/resources/${resourceId}/reviews/`, review)
    return response.data;
    }

export async function updateReview(review: Review) {
    const response = await api.put<Review>(`/api/reviews/${review.id}/`, review)
    return response.data;
    }
export async function deleteReview(reviewId: String) {
    await api.delete(`/api/reviews/${reviewId}/`)
    return;
    }
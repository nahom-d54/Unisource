import { useMutation, useQuery } from "@tanstack/react-query";
import { createReview, getReviews, listReviews } from "@/api/review";
import { Review } from "@/types";

export function useReviews() {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: getReviews,
  });
}


// export function useReviewsGetReviews(resourceId: number) {
//   return useQuery({
//     queryKey: ["reviews", resourceId],
//     queryFn: () => listReviews(resourceId),
//     enabled: !!resourceId, // Only fetch if resourceId is available
//     initialData: [],
//   });
// }

// export function useReviewsCreateReview(resourceId: number, review: Review) {
//     return useMutation({
//         mutationFn: (review: Review) => createReview(resourceId, review),
//         onSuccess: () => {
//           queryClient.invalidateQueries({ queryKey: ["reviews", resourceId] })
//           queryClient.invalidateQueries({ queryKey: ["resource", resourceId] })
//           setUserRating(0)
//           setReviewText("")
//           toast({
//             title: "Review submitted",
//             description: "Your review has been submitted successfully.",
//           })
//         },
//         onError: () => {
//           toast({
//             variant: "destructive",
//             title: "Error",
//             description: "Failed to submit your review. Please try again.",
//           })
//         },
//       });
//     }
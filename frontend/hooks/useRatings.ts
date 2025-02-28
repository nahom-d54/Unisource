import { useQuery } from "@tanstack/react-query";
import { getRatings } from "@/api/rating";

export function useRatings(resourceId: number) {
  return useQuery({
    queryKey: ["ratings", resourceId],
    queryFn: () => getRatings(resourceId),
    enabled: !!resourceId, // Only fetch if resourceId is available
  });
}

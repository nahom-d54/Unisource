import { useQuery } from "@tanstack/react-query";
import { getResources } from "@/api/resource";

export function useResources() {
  return useQuery({
    queryKey: ["resources"],
    queryFn: () => getResources(),
  });
}

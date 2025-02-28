import { api } from "./api";

export async function getRatings(resourceId: number) {
  const response = await api.get(`/rating/${resourceId}/`);
  return response.data;
}

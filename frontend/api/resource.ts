import { api } from "./api";

export async function getResources() {
  const response = await api.get("/resource/");
  return response.data;
}


export async function getFeaturedResource() {
  const response = await api.get("/resource/featured/");
  return response.data;
}
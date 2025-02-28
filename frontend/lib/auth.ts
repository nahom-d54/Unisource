import { apiClient } from "@/lib/api-client"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string | null
  role: "student" | "librarian" | "admin"
}

export async function login(email: string, password: string): Promise<User> {
  const { data } = await apiClient.post("/api/v1/token/", {
    email,
    password,
  })

  // Store tokens in localStorage
  localStorage.setItem("access", data.access)
  localStorage.setItem("refresh", data.refresh)

  // Get user data
  return getUserData()
}

export async function register(userData: {
  first_name: string
  last_name: string
  email: string
  student_id: string
  password: string
}): Promise<void> {
  await apiClient.post("/api/v1/users/register/", userData)
}

export async function logout(): Promise<void> {
  localStorage.removeItem("access")
  localStorage.removeItem("refresh")
}

export async function refreshToken(): Promise<string> {
  const refresh = localStorage.getItem("refresh")

  if (!refresh) {
    throw new Error("No refresh token available")
  }

  const { data } = await apiClient.post("/api/v1/token/refresh/", {
    refresh,
  })

  localStorage.setItem("access", data.access)

  return data.access
}

export async function getUserData(): Promise<User> {
  const { data } = await apiClient.get("/api/v1/users/me/")
  return data
}

export async function verifyToken(): Promise<boolean> {
  const token = localStorage.getItem("access")

  if (!token) {
    return false
  }

  try {
    await apiClient.post("/api/v1/token/verify/", {
      token,
    })
    return true
  } catch (error) {
    return false
  }
}


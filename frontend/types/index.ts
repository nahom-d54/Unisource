export interface User {
  id: string
  name: string
  email?: string
  avatar?: string | null
}

export interface Resource {
  id: string
  title: string
  description: string
  category: string
  subcategory: string
  file_url: string
  thumbnail: string
  created_at: string
  updated_at: string
  author: string
  avg_rating: number
  reviews_count: number
  content?: string
  reviews?: Review[]
}

export interface Review {
  id?: string
  user?: User
  rating: number
  comment: string
  created_at?: string
}

export interface Category {
  id: string
  name: string
  resource_count: number
  subcategories?: Category[]
}


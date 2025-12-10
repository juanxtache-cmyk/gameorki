export interface Game {
  id: number
  title: string
  description: string
  price: number
  imageUrl: string
  screenShots: string[]
  category: string
  releaseDate: string
  publisher: string
  developer?: string
  rating: number
  discount?: number
  stock?: number
  active?: boolean
  tags?: string[]
  trailerUrl?: string
  systemRequirements?: {
    minimum: string
    recommended: string
  }
  ageRating?: string
}

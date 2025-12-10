import type { Game } from "./game.model"

export interface CartItem {
  game: Game
  quantity: number
}

export interface Cart {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

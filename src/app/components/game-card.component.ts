import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import type { Game } from "../models/game.model"
import { CartService } from "../services/cart.service"

@Component({
  selector: "app-game-card",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="game-card">
      <div class="game-image">
        <a [routerLink]="['/games', game.id]">
          <img [src]="game.imageUrl" [alt]="game.title">
          <div class="game-overlay">
            <span class="view-details">Ver detalles</span>
          </div>
        </a>
        <div class="game-badge" *ngIf="game.discount">
          -{{ (game.discount * 100) | number:'1.0-0' }}%
        </div>
      </div>
      
      <div class="game-info">
        <div class="game-category">{{ game.category }}</div>
        <h3 class="game-title">
          <a [routerLink]="['/games', game.id]">{{ game.title }}</a>
        </h3>
        
        <div class="game-rating">
          <div class="stars">
            <span *ngFor="let star of getStars(game.rating)" class="star" [class.half]="star === 0.5" [class.empty]="star === 0">
              <svg *ngIf="star === 1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
              </svg>
              <svg *ngIf="star === 0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.354 5.119 7.538.792A.516.516 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0 1 16 6.32a.548.548 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.52.52 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.58.58 0 0 1 .085-.302.513.513 0 0 1 .37-.245l4.898-.696zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.565.565 0 0 1 .162-.505l2.907-2.77-4.052-.576a.525.525 0 0 1-.393-.288L8.001 2.223 8 2.226v9.8z"/>
              </svg>
              <svg *ngIf="star === 0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
              </svg>
            </span>
          </div>
          <span class="rating-value">{{ game.rating }}</span>
        </div>
        
        <div class="game-price">
          <div class="price-container">
            <span class="original-price" *ngIf="game.discount">{{ game.price | currency:'USD' }}</span>
            <span class="current-price">{{ getCurrentPrice(game) | currency:'USD' }}</span>
          </div>
          <button class="add-to-cart" (click)="addToCart(game)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .game-card {
      background-color: var(--bg-secondary);
      border-radius: 0;
      overflow: hidden;
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
      transition: transform 0.3s, box-shadow 0.3s;
      border: 3px solid var(--border-color);
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .game-card:hover {
      transform: translate(-2px, -2px) rotate(0.5deg);
      box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.3);
    }
    
    .game-image {
      position: relative;
      height: clamp(140px, 25vw, 180px);
      overflow: hidden;
      border-bottom: 3px solid var(--border-color);
      flex-shrink: 0;
    }
    
    .game-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s;
      image-rendering: pixelated;
    }
    
    .game-image:hover img {
      transform: scale(1.05);
    }
    
    .game-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s;
    }
    
    .game-image:hover .game-overlay {
      opacity: 1;
    }
    
    .view-details {
      color: white;
      background-color: var(--accent-color);
      padding: clamp(6px, 2vw, 8px) clamp(10px, 3vw, 15px);
      border-radius: 0;
      font-weight: 500;
      border: 2px solid var(--border-color);
      font-family: var(--pixel-font);
      font-size: clamp(0.6rem, 2vw, 0.7rem);
      text-transform: uppercase;
      box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
    }
    
    .game-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      background-color: var(--accent-color);
      color: white;
      padding: clamp(3px, 1.5vw, 5px) clamp(6px, 2vw, 10px);
      border-radius: 0;
      font-weight: 600;
      font-size: clamp(0.7rem, 2.5vw, 0.9rem);
      border: 2px solid var(--border-color);
      font-family: var(--pixel-font);
      transform: rotate(5deg);
      box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
      z-index: 2;
    }
    
    .game-info {
      padding: clamp(10px, 3vw, 15px);
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    
    .game-category {
      color: var(--text-secondary);
      font-size: clamp(0.8rem, 2.5vw, 0.9rem);
      margin-bottom: 5px;
      font-family: var(--retro-font);
      text-transform: uppercase;
    }
    
    .game-title {
      margin: 0 0 10px 0;
      font-size: clamp(0.9rem, 3vw, 1.1rem);
      line-height: 1.3;
      flex-grow: 1;
    }
    
    .game-title a {
      color: var(--heading-color);
      text-decoration: none;
      transition: color 0.3s;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      letter-spacing: -1px;
      text-shadow: 2px 2px 0 rgba(0,0,0,0.5);
      display: block;
      word-wrap: break-word;
      hyphens: auto;
    }
    
    .game-title a:hover {
      color: var(--accent-color);
      text-shadow: 0 0 5px var(--accent-color);
    }
    
    .game-rating {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      gap: 5px;
    }
    
    .stars {
      display: flex;
      color: #ffc107;
      gap: 1px;
    }
    
    .star svg {
      width: clamp(12px, 3vw, 16px);
      height: clamp(12px, 3vw, 16px);
    }
    
    .rating-value {
      color: var(--text-secondary);
      font-size: clamp(0.8rem, 2.5vw, 0.9rem);
      font-family: var(--retro-font);
    }
    
    .game-price {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      gap: 10px;
    }
    
    .price-container {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    
    .original-price {
      color: var(--text-tertiary);
      text-decoration: line-through;
      font-size: clamp(0.7rem, 2.5vw, 0.8rem);
      font-family: var(--retro-font);
      line-height: 1;
    }
    
    .current-price {
      color: var(--accent-color);
      font-weight: 700;
      font-size: clamp(0.9rem, 3vw, 1.1rem);
      font-family: var(--pixel-font);
      text-shadow: 1px 1px 0 rgba(0,0,0,0.5);
      line-height: 1;
    }
    
    .add-to-cart {
      background-color: var(--bg-tertiary);
      color: white;
      border: 2px solid var(--border-color);
      border-radius: 0;
      width: clamp(32px, 8vw, 36px);
      height: clamp(32px, 8vw, 36px);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
      flex-shrink: 0;
    }

    .add-to-cart svg {
      width: clamp(12px, 3vw, 16px);
      height: clamp(12px, 3vw, 16px);
    }
    
    .add-to-cart:hover {
      background-color: var(--accent-color);
      transform: translate(-1px, -1px);
      box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.5);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .game-card:hover {
        transform: translate(-1px, -1px) rotate(0.25deg);
        box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
      }

      .game-image {
        height: clamp(120px, 30vw, 160px);
      }

      .game-badge {
        top: 6px;
        right: 6px;
      }

      .game-info {
        padding: clamp(8px, 2.5vw, 12px);
      }

      .game-title {
        margin-bottom: 8px;
      }

      .game-rating {
        margin-bottom: 8px;
      }
    }

    @media (max-width: 480px) {
      .game-card {
        border-width: 2px;
      }

      .game-image {
        height: clamp(100px, 35vw, 140px);
        border-bottom-width: 2px;
      }

      .game-badge {
        top: 4px;
        right: 4px;
        border-width: 1px;
        transform: rotate(3deg);
      }

      .game-info {
        padding: clamp(6px, 2vw, 10px);
      }

      .game-price {
        gap: 8px;
      }

      .add-to-cart {
        border-width: 1px;
        box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
      }

      .add-to-cart:hover {
        transform: none;
        box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
      }
    }

    @media (max-width: 380px) {
      .game-card {
        min-height: 240px;
      }

      .game-image {
        height: 80px;
      }

      .game-title a {
        font-size: 0.8rem;
        letter-spacing: 0;
      }

      .price-container {
        min-width: 0;
      }
    }

    /* Touch devices improvements */
    @media (hover: none) and (pointer: coarse) {
      .game-card:hover {
        transform: none;
        box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
      }

      .game-image:hover img {
        transform: none;
      }

      .game-overlay {
        display: none;
      }

      .add-to-cart {
        min-width: 44px;
        min-height: 44px;
      }

      .add-to-cart:hover {
        transform: none;
      }
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
      .game-card,
      .game-image,
      .add-to-cart,
      .game-badge {
        border-width: 3px;
      }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .game-card,
      .game-image img,
      .game-overlay,
      .add-to-cart {
        transition: none;
      }

      .game-badge {
        transform: none;
      }

      .game-card:hover {
        transform: none;
      }
    }
  `]
})
export class GameCardComponent {
  @Input() game!: Game

  constructor(private cartService: CartService) {}

  getStars(rating: number): number[] {
    const stars: number[] = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    // Agregar estrellas completas
    for (let i = 0; i < fullStars; i++) {
      stars.push(1)
    }

    // Agregar media estrella si es necesario
    if (hasHalfStar) {
      stars.push(0.5)
    }

    // Completar con estrellas vacías hasta llegar a 5
    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(0)
    }

    return stars
  }

  getCurrentPrice(game: Game): number {
    return game.discount ? game.price * (1 - game.discount) : game.price
  }

  addToCart(game: Game): void {
    console.log('🎮 GameCard: Agregando al carrito:', game.title);
    this.cartService.addToCart(game);
  }
}

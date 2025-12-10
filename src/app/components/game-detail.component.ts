import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink, ActivatedRoute, Router } from "@angular/router";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { GameService } from "../services/game.service"
import { CartService } from "../services/cart.service"
import { Game } from "../models/game.model"

@Component({
  selector: "app-game-detail",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="game-detail-container" *ngIf="game">
      <div class="game-detail-content">
        <div class="game-image-container">
          <div class="main-media-container">
            <!-- Mostrar trailer si está seleccionado -->
            <div *ngIf="showTrailer && game.trailerUrl" class="trailer-container">
              <iframe 
                [src]="getEmbedUrl(game.trailerUrl)" 
                class="main-trailer"
                frameborder="0" 
                allowfullscreen>
              </iframe>
            </div>
            
            <!-- Mostrar imagen si no hay trailer seleccionado -->
            <img *ngIf="!showTrailer"
                 [src]="currentImage" 
                 [alt]="game.title" 
                 class="game-image">
          </div>
          
          <div class="gallery-container">
            <div class="gallery-scroll">
              <!-- Trailer si existe -->
              <div class="gallery-item trailer-item" 
                   *ngIf="game.trailerUrl"
                   [class.active]="activeMediaIndex === -1"
                   (click)="selectTrailer()">
                <div class="trailer-thumb">
                  <div class="play-icon">▶️</div>
                  <div class="trailer-label">🎬 Trailer</div>
                </div>
              </div>
              
              <!-- Screenshots -->
              <div class="gallery-item" 
                   *ngFor="let item of game.screenShots; let i = index"
                   [class.active]="i === activeMediaIndex"
                   (click)="selectMedia(i)">
                <img [src]="item" [alt]="game.title + ' screenshot ' + (i + 1)">
              </div>
            </div>
          </div>
        </div>
        
        <div class="game-info">
          <div class="game-header">
            <div class="game-category">{{ game.category }}</div>
            <h1 class="game-title">{{ game.title }}</h1>
            
            <div class="game-meta">
              <div class="publisher">
                <span class="meta-label">Desarrollador:</span>
                <span class="meta-value">{{ game.publisher }}</span>
              </div>
              <div class="release-date">
                <span class="meta-label">Fecha de lanzamiento:</span>
                <span class="meta-value">{{ game.releaseDate | date:'dd/MM/yyyy' }}</span>
              </div>
              <div class="rating">
                <span class="meta-label">Calificación:</span>
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
            </div>
          </div>
          
          <div class="game-description">
            <h2>Descripción</h2>
            <p>{{ game.description }}</p>
          </div>
          
          <div class="game-purchase">
            <div class="game-price">
              <div *ngIf="game.discount" class="original-price">{{ game.price | currency:'USD' }}</div>
              <div class="current-price">{{ getCurrentPrice(game) | currency:'USD' }}</div>
              <div *ngIf="game.discount" class="discount-badge">-{{ (game.discount * 100) | number:'1.0-0' }}%</div>
            </div>
            
            <div class="purchase-actions">
              <button class="btn-add-cart" (click)="addToCart(game)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                Añadir al Carrito
              </button>
              <button class="btn-buy-now">Comprar Ahora</button>
            </div>
          </div>
          
          <div class="game-details">
            <h2>Detalles del Juego</h2>
            <div class="details-grid">
              <div class="detail-item">
                <span class="detail-label">Género:</span>
                <span class="detail-value">{{ game.category }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Desarrollador:</span>
                <span class="detail-value">{{ game.publisher }}</span>
              </div>
              <div class="detail-item" *ngIf="game.developer">
                <span class="detail-label">Estudio:</span>
                <span class="detail-value">{{ game.developer }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Fecha de Lanzamiento:</span>
                <span class="detail-value">{{ game.releaseDate | date:'dd/MM/yyyy' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Plataforma:</span>
                <span class="detail-value">PC</span>
              </div>
              <div class="detail-item" *ngIf="game.tags && game.tags.length > 0">
                <span class="detail-label">Etiquetas:</span>
                <span class="detail-value">{{ game.tags.join(', ') }}</span>
              </div>
              <div class="detail-item" *ngIf="game.ageRating">
                <span class="detail-label">Clasificación:</span>
                <span class="detail-value">{{ game.ageRating }}</span>
              </div>
            </div>
          </div>

          <!-- Requisitos del Sistema -->
          <div class="system-requirements" *ngIf="game.systemRequirements && (game.systemRequirements.minimum || game.systemRequirements.recommended)">
            <h2>Requisitos del Sistema</h2>
            <div class="requirements-grid">
              <div class="requirement-card" *ngIf="game.systemRequirements.minimum">
                <h3>🔧 Mínimos</h3>
                <div class="requirement-text">{{ game.systemRequirements.minimum }}</div>
              </div>
              <div class="requirement-card" *ngIf="game.systemRequirements.recommended">
                <h3>⚡ Recomendados</h3>
                <div class="requirement-text">{{ game.systemRequirements.recommended }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="related-games">
        <h2>Juegos Relacionados</h2>
        <div class="related-games-grid">
          <div class="related-game-card" *ngFor="let relatedGame of relatedGames">
            <a [routerLink]="['/games', relatedGame.id]" class="related-game-image">
              <img [src]="relatedGame.imageUrl" [alt]="relatedGame.title">
            </a>
            <div class="related-game-info">
              <h3><a [routerLink]="['/games', relatedGame.id]">{{ relatedGame.title }}</a></h3>
              <div class="related-game-price">
                <span *ngIf="relatedGame.discount" class="original-price">{{ relatedGame.price | currency:'USD' }}</span>
                <span class="current-price">{{ getCurrentPrice(relatedGame) | currency:'USD' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="loading" *ngIf="!game">
      <div class="spinner"></div>
      <p>Cargando detalles del juego...</p>
    </div>
  `,
  styles: [
    `
    .game-detail-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
      background-color: var(--bg-secondary);
      border: 3px solid var(--border-color);
      box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.3);
    }
    
    .game-detail-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 60px;
    }
    
    /* Game Image Container */
    .game-image-container {
      display: flex;
      flex-direction: column;
      margin-left: -20px;
    }
    
    .main-media-container {
      width: 100%;
      height: 400px;
      margin-bottom: 15px;
      border-radius: 0;
      overflow: hidden;
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
      background-color: var(--bg-tertiary);
      border: 3px solid var(--border-color);
    }
    
    .game-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      image-rendering: pixelated;
    }

    .trailer-container {
      width: 100%;
      height: 100%;
    }

    .main-trailer {
      width: 100%;
      height: 100%;
      border: none;
    }
    
    /* Gallery Styles */
    .gallery-container {
      width: calc(100% + 40px);
      overflow-x: auto;
      padding: 10px 20px;
      margin-left: -20px;
    }
    
    .gallery-scroll {
      display: flex;
      gap: 12px;
      padding-bottom: 10px;
    }
    
    .gallery-item {
      width: 100px;
      height: 75px;
      border-radius: 0;
      overflow: hidden;
      cursor: pointer;
      opacity: 0.7;
      transition: all 0.3s ease;
      flex-shrink: 0;
      border: 2px solid var(--border-color);
      box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.3);
    }
    
    .gallery-item:hover {
      opacity: 0.9;
      transform: translate(-2px, -2px);
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
    }
    
    .gallery-item.active {
      opacity: 1;
      border-color: var(--accent-color);
      transform: translate(-2px, -2px);
    }

    .trailer-item {
      border-color: #ff6b00 !important;
      background: linear-gradient(135deg, #ff6b00 0%, #ff8c42 100%);
    }

    .trailer-item.active {
      border-color: #ff6b00 !important;
      box-shadow: 4px 4px 0 #ff6b00 !important;
    }

    .trailer-thumb {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background: linear-gradient(135deg, #ff6b00 0%, #ff8c42 100%);
    }

    .play-icon {
      font-size: 20px;
      color: white;
      filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));
    }

    .trailer-label {
      position: absolute;
      bottom: 2px;
      left: 2px;
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 1px 4px;
      font-size: 8px;
      border-radius: 2px;
    }
    
    .gallery-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      image-rendering: pixelated;
    }
    
    /* Custom scrollbar */
    .gallery-container::-webkit-scrollbar {
      height: 6px;
    }
    
    .gallery-container::-webkit-scrollbar-track {
      background: var(--bg-tertiary);
      border-radius: 0;
    }
    
    .gallery-container::-webkit-scrollbar-thumb {
      background: var(--accent-color);
      border-radius: 0;
      border: 1px solid var(--border-color);
    }
    
    .gallery-container::-webkit-scrollbar-thumb:hover {
      background: var(--accent-hover);
    }

    /* Game Info */
    .game-header {
      margin-bottom: 25px;
      border-bottom: 3px solid var(--border-color);
      padding-bottom: 15px;
    }
    
    .game-category {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-bottom: 5px;
      font-family: var(--retro-font);
      text-transform: uppercase;
    }
    
    .game-title {
      font-size: 2rem;
      color: var(--heading-color);
      margin: 0 0 15px 0;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      letter-spacing: -1px;
      text-shadow: 3px 3px 0 rgba(0,0,0,0.5);
    }
    
    .game-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
    }
    
    .meta-label {
      color: var(--text-secondary);
      margin-right: 5px;
      font-family: var(--retro-font);
    }
    
    .meta-value {
      color: var(--text-primary);
      font-weight: 500;
      font-family: var(--retro-font);
    }
    
    .rating {
      display: flex;
      align-items: center;
    }
    
    .stars {
      display: flex;
      color: #ffc107;
      margin: 0 5px;
    }
    
    .star {
      margin-right: 2px;
    }
    
    .rating-value {
      color: var(--text-primary);
      font-weight: 500;
      font-family: var(--retro-font);
    }
    
    /* Game Description */
    .game-description {
      margin-bottom: 30px;
      border: 2px solid var(--border-color);
      padding: 15px;
      background-color: var(--bg-tertiary);
    }
    
    .game-description h2 {
      font-size: 1.3rem;
      color: var(--heading-color);
      margin-bottom: 15px;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      text-shadow: 2px 2px 0 rgba(0,0,0,0.5);
    }
    
    .game-description p {
      color: var(--text-secondary);
      line-height: 1.6;
      font-family: var(--retro-font);
      font-size: 1.1rem;
    }
    
    /* Game Purchase */
    .game-purchase {
      background-color: var(--bg-tertiary);
      border-radius: 0;
      padding: 20px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 3px solid var(--border-color);
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
    }
    
    .game-price {
      display: flex;
      align-items: center;
    }
    
    .original-price {
      color: var(--text-tertiary);
      text-decoration: line-through;
      font-size: 1rem;
      margin-right: 10px;
      font-family: var(--retro-font);
    }
    
    .current-price {
      color: var(--accent-color);
      font-size: 1.5rem;
      font-weight: 700;
      font-family: var(--pixel-font);
      text-shadow: 2px 2px 0 rgba(0,0,0,0.5);
    }
    
    .discount-badge {
      background-color: var(--accent-color);
      color: white;
      padding: 3px 8px;
      border-radius: 0;
      font-size: 0.9rem;
      margin-left: 10px;
      border: 2px solid var(--border-color);
      font-family: var(--pixel-font);
      transform: rotate(5deg);
    }
    
    .purchase-actions {
      display: flex;
      gap: 10px;
    }
    
    .btn-add-cart, .btn-buy-now {
      padding: 10px 20px;
      border-radius: 0;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      font-size: 0.8rem;
      border: 3px solid var(--border-color);
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
    }
    
    .btn-add-cart {
      background-color: var(--bg-secondary);
      color: var(--text-primary);
    }
    
    .btn-add-cart:hover {
      background-color: var(--bg-tertiary);
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.5);
    }
    
    .btn-add-cart svg {
      margin-right: 8px;
    }
    
    .btn-buy-now {
      background-color: var(--accent-color);
      color: white;
    }
    
    .btn-buy-now:hover {
      background-color: var(--accent-hover);
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.5);
    }
    
    /* Game Details */
    .game-details {
      margin-bottom: 30px;
      border: 2px solid var(--border-color);
      padding: 15px;
      background-color: var(--bg-tertiary);
    }
    
    .game-details h2 {
      font-size: 1.3rem;
      color: var(--heading-color);
      margin-bottom: 15px;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      text-shadow: 2px 2px 0 rgba(0,0,0,0.5);
    }
    
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    
    .detail-item {
      display: flex;
      flex-direction: column;
    }
    
    .detail-label {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-bottom: 5px;
      font-family: var(--retro-font);
      text-transform: uppercase;
    }
    
    .detail-value {
      color: var(--text-primary);
      font-weight: 500;
      font-family: var(--retro-font);
      font-size: 1.1rem;
    }

    /* System Requirements */
    .system-requirements {
      margin-top: 30px;
      padding: 20px;
      background: rgba(0, 255, 136, 0.05);
      border: 2px solid var(--accent-color);
      border-radius: 8px;
    }

    .system-requirements h2 {
      color: var(--accent-color);
      margin-bottom: 20px;
      font-size: 1.4rem;
      text-transform: uppercase;
      font-family: var(--retro-font);
    }

    .requirements-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .requirement-card {
      background: rgba(0, 0, 0, 0.3);
      border: 2px solid var(--border-color);
      border-radius: 6px;
      padding: 15px;
    }

    .requirement-card h3 {
      color: var(--accent-color);
      margin-bottom: 10px;
      font-size: 1.1rem;
      font-family: var(--retro-font);
      text-transform: uppercase;
    }

    .requirement-text {
      color: var(--text-primary);
      font-family: var(--retro-font);
      line-height: 1.4;
      font-size: 0.9rem;
      white-space: pre-wrap;
    }
    
    /* Related Games */
    .related-games {
      margin-top: 40px;
      border-top: 3px solid var(--border-color);
      padding-top: 20px;
    }
    
    .related-games h2 {
      font-size: 1.5rem;
      color: var(--heading-color);
      margin-bottom: 20px;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      text-shadow: 2px 2px 0 rgba(0,0,0,0.5);
    }
    
    .related-games-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
    }
    
    .related-game-card {
      background-color: var(--bg-tertiary);
      border-radius: 0;
      overflow: hidden;
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
      transition: transform 0.3s;
      border: 2px solid var(--border-color);
    }
    
    .related-game-card:hover {
      transform: translate(-4px, -4px);
      box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.3);
    }
    
    .related-game-image {
      display: block;
      height: 120px;
      overflow: hidden;
      border-bottom: 2px solid var(--border-color);
    }
    
    .related-game-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s;
      image-rendering: pixelated;
    }
    
    .related-game-card:hover .related-game-image img {
      transform: scale(1.05);
    }
    
    .related-game-info {
      padding: 15px;
    }
    
    .related-game-info h3 {
      margin: 0 0 10px 0;
      font-size: 1rem;
      line-height: 1.3;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      letter-spacing: -1px;
    }
    
    .related-game-info h3 a {
      color: var(--heading-color);
      text-decoration: none;
      transition: color 0.3s;
      text-shadow: 1px 1px 0 rgba(0,0,0,0.5);
    }
    
    .related-game-info h3 a:hover {
      color: var(--accent-color);
      text-shadow: 0 0 5px var(--accent-color);
    }
    
    .related-game-price {
      display: flex;
      align-items: center;
    }
    
    .related-game-price .original-price {
      font-size: 0.8rem;
      color: var(--text-tertiary);
      text-decoration: line-through;
      margin-right: 5px;
      font-family: var(--retro-font);
    }
    
    .related-game-price .current-price {
      font-size: 1rem;
      color: var(--accent-color);
      font-weight: 700;
      font-family: var(--pixel-font);
      text-shadow: 1px 1px 0 rgba(0,0,0,0.5);
    }
    
    /* Loading */
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 100px 0;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-radius: 0;
      border-top-color: var(--accent-color);
      animation: spin 1s ease-in-out infinite;
      margin-bottom: 20px;
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    
    .loading p {
      color: var(--text-secondary);
      font-family: var(--retro-font);
      font-size: 1.2rem;
    }
    
    @media (max-width: 992px) {
      .game-detail-content {
        grid-template-columns: 1fr;
      }
      
      .game-image-container {
        margin-left: 0;
      }
      
      .gallery-container {
        width: 100%;
        padding: 10px 0;
        margin-left: 0;
      }
      
      .game-purchase {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .game-price {
        margin-bottom: 15px;
      }
      
      .purchase-actions {
        width: 100%;
      }
      
      .btn-add-cart, .btn-buy-now {
        flex: 1;
      }
    }
    
    @media (max-width: 768px) {
      .game-detail-container {
        padding: 20px;
      }
      
      .details-grid {
        grid-template-columns: 1fr;
      }

      .requirements-grid {
        grid-template-columns: 1fr;
      }
      
      .related-games-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }
    }
  `,
  ],
})
export class GameDetailComponent implements OnInit {
  game: Game | undefined
  relatedGames: Game[] = []
  activeMediaIndex = 0
  currentImage = ""
  showTrailer = false

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    private cartService: CartService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const gameId = Number(params.get("id"))

      if (isNaN(gameId)) {
        this.router.navigate(["/games"])
        return
      }

      this.gameService.getGame(gameId).subscribe((game) => {
        if (!game) {
          this.router.navigate(["/games"])
          return
        }

        this.game = game
        this.updateCurrentImage()

        this.gameService.getGamesByCategory(game.category).subscribe((games) => {
          this.relatedGames = games.filter((g) => g.id !== game.id).slice(0, 4)
        })
      })
    })
  }

  selectMedia(index: number): void {
    this.activeMediaIndex = index
    this.showTrailer = false
    this.updateCurrentImage()
  }

  selectTrailer(): void {
    this.activeMediaIndex = -1
    this.showTrailer = true
  }

  updateCurrentImage(): void {
    if (!this.game?.screenShots?.length) {
      this.currentImage = this.game?.imageUrl || ""
      return
    }

    this.currentImage = this.game.screenShots[this.activeMediaIndex]
  }

  getStars(rating: number): number[] {
    const stars: number[] = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) stars.push(1)
    if (hasHalfStar) stars.push(0.5)
    while (stars.length < 5) stars.push(0)

    return stars
  }

  getCurrentPrice(game: Game): number {
    return game.discount ? game.price * (1 - game.discount) : game.price
  }

  addToCart(game: Game): void {
    this.cartService.addToCart(game)
  }

  // YouTube helper functions
  isYouTubeUrl(url: string): boolean {
    if (!url) return false;
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  }

  getEmbedUrl(url: string): SafeResourceUrl {
    if (!url) return this.sanitizer.bypassSecurityTrustResourceUrl('');
    
    // Extraer video ID de diferentes formatos de YouTube
    let videoId = '';
    
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url); // Ya está en formato embed
    }
    
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }
}

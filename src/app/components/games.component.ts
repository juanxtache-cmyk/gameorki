import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink, ActivatedRoute } from "@angular/router";
import { FormsModule } from "@angular/forms"
import { GameService } from "../services/game.service"
import { CartService } from "../services/cart.service"
import type { Game } from "../models/game.model"
import { GameCardComponent } from "./game-card.component"

@Component({
  selector: "app-games",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, GameCardComponent],
  template: `
    <div class="games-container">
      <div class="games-header">
        <h1>Catálogo de Juegos</h1>
        <p *ngIf="selectedCategory">Categoría: {{ selectedCategory }}</p>
        <p *ngIf="showDiscounted">Ofertas Especiales</p>
      </div>
      
      <div class="mobile-filter-toggle">
        <button class="btn-toggle-filters" (click)="toggleMobileFilters()">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
          </svg>
          Filtros
        </button>
      </div>
      
      <div class="games-content">
        <div class="filters-sidebar" [class.mobile-open]="showMobileFilters">
          <div class="mobile-filter-overlay" (click)="closeMobileFilters()"></div>
          
          <div class="filter-content">
            <div class="filter-section">
              <h3>Categorías</h3>
              <ul class="category-list">
                <li>
                  <a 
                    [routerLink]="['/games']" 
                    [queryParams]="{}" 
                    [class.active]="!selectedCategory"
                    (click)="closeMobileFilters()"
                  >
                    Todos los Juegos
                  </a>
                </li>
                <li *ngFor="let category of categories">
                  <a 
                    [routerLink]="['/games']" 
                    [queryParams]="{category: category}" 
                    [class.active]="selectedCategory === category"
                    (click)="closeMobileFilters()"
                  >
                    {{ category }}
                  </a>
                </li>
              </ul>
            </div>
            
            <div class="filter-section">
              <h3>Precio</h3>
              <div class="price-range">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="5" 
                  [(ngModel)]="priceFilter" 
                  (ngModelChange)="applyFilters()"
                >
                <div class="price-values">
                  <span>$0</span>
                  <span>\${{priceFilter}}</span>
                </div>
              </div>
            </div>
            
            <div class="filter-section">
              <h3>Ofertas</h3>
              <div class="checkbox-filter">
                <input 
                  type="checkbox" 
                  id="discounted" 
                  [(ngModel)]="showDiscounted" 
                  (ngModelChange)="applyFilters()"
                >
                <label for="discounted">Mostrar solo ofertas</label>
              </div>
            </div>
            
            <div class="filter-section">
              <h3>Ordenar por</h3>
              <select [(ngModel)]="sortBy" (ngModelChange)="applyFilters()">
                <option value="relevance">Relevancia</option>
                <option value="price-low">Precio: Menor a Mayor</option>
                <option value="price-high">Precio: Mayor a Menor</option>
                <option value="name">Nombre</option>
                <option value="rating">Calificación</option>
                <option value="newest">Más Recientes</option>
              </select>
            </div>
            
            <button class="btn-clear-filters" (click)="clearFilters()">Limpiar Filtros</button>
          </div>
        </div>
        
        <div class="games-grid">
          <div class="search-bar">
            <input 
              type="text" 
              placeholder="Buscar juegos..." 
              [(ngModel)]="searchTerm" 
              (ngModelChange)="applyFilters()"
            >
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </button>
          </div>
          
          <div class="results-info">
            <p>Mostrando {{ filteredGames.length }} de {{ allGames.length }} juegos</p>
          </div>
          
          <div class="games-list" *ngIf="filteredGames.length > 0">
            <app-game-card 
              *ngFor="let game of filteredGames" 
              [game]="game">
            </app-game-card>
          </div>
          
          <div class="no-results" *ngIf="filteredGames.length === 0">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
            <h3>No se encontraron resultados</h3>
            <p>Intenta con otros filtros o términos de búsqueda</p>
            <button class="btn-primary" (click)="clearFilters()">Limpiar Filtros</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .games-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .games-header {
      margin-bottom: 30px;
      border-bottom: 3px solid var(--border-color);
      padding-bottom: 15px;
    }
    
    .games-header h1 {
      font-size: clamp(1.5rem, 5vw, 2rem);
      color: var(--heading-color);
      margin-bottom: 10px;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      text-shadow: 3px 3px 0 rgba(0,0,0,0.5);
      line-height: 1.2;
    }
    
    .games-header p {
      color: var(--text-secondary);
      font-size: clamp(1rem, 3vw, 1.1rem);
      font-family: var(--retro-font);
      margin: 5px 0;
    }

    /* Mobile Filter Toggle */
    .mobile-filter-toggle {
      display: none;
      margin-bottom: 20px;
    }

    .btn-toggle-filters {
      display: flex;
      align-items: center;
      gap: 8px;
      background-color: var(--accent-color);
      color: white;
      border: 3px solid var(--border-color);
      border-radius: 0;
      padding: 12px 20px;
      cursor: pointer;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      font-size: 0.9rem;
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
      transition: all 0.3s;
    }

    .btn-toggle-filters:hover {
      background-color: var(--accent-hover);
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.3);
    }
    
    .games-content {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 30px;
    }
    
    /* Filters Sidebar */
    .filters-sidebar {
      background-color: var(--bg-secondary);
      border-radius: 0;
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
      padding: 20px;
      height: fit-content;
      border: 3px solid var(--border-color);
      position: relative;
    }

    .mobile-filter-overlay {
      display: none;
    }

    .filter-content {
      position: relative;
      z-index: 2;
    }
    
    .filter-section {
      margin-bottom: 25px;
    }
    
    .filter-section h3 {
      font-size: clamp(1rem, 3vw, 1.1rem);
      color: var(--heading-color);
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--border-color);
      font-family: var(--pixel-font);
      text-transform: uppercase;
      text-shadow: 2px 2px 0 rgba(0,0,0,0.5);
    }
    
    .category-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .category-list li {
      margin-bottom: 8px;
    }
    
    .category-list a {
      color: var(--text-secondary);
      text-decoration: none;
      transition: all 0.3s;
      display: block;
      padding: 8px 0;
      font-family: var(--retro-font);
      font-size: clamp(0.9rem, 2.5vw, 1.1rem);
    }
    
    .category-list a:hover, .category-list a.active {
      color: var(--accent-color);
      text-shadow: 0 0 5px var(--accent-color);
      transform: translateX(5px);
    }
    
    .price-range {
      padding: 0 5px;
    }
    
    .price-range input {
      width: 100%;
      margin-bottom: 10px;
      -webkit-appearance: none;
      height: 12px;
      background: var(--bg-tertiary);
      border: 2px solid var(--border-color);
      border-radius: 0;
      cursor: pointer;
    }
    
    .price-range input::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 24px;
      height: 24px;
      background: var(--accent-color);
      cursor: pointer;
      border: 2px solid var(--border-color);
      border-radius: 0;
      box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.3);
    }

    .price-range input::-moz-range-thumb {
      width: 24px;
      height: 24px;
      background: var(--accent-color);
      cursor: pointer;
      border: 2px solid var(--border-color);
      border-radius: 0;
      box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.3);
    }
    
    .price-values {
      display: flex;
      justify-content: space-between;
      color: var(--text-secondary);
      font-family: var(--retro-font);
      font-size: clamp(0.9rem, 2.5vw, 1rem);
    }
    
    .checkbox-filter {
      display: flex;
      align-items: center;
    }
    
    .checkbox-filter input {
      margin-right: 12px;
      width: 24px;
      height: 24px;
      -webkit-appearance: none;
      appearance: none;
      background-color: var(--bg-tertiary);
      border: 2px solid var(--border-color);
      border-radius: 0;
      cursor: pointer;
      position: relative;
      flex-shrink: 0;
    }
    
    .checkbox-filter input:checked {
      background-color: var(--accent-color);
    }
    
    .checkbox-filter input:checked::after {
      content: "✓";
      position: absolute;
      color: white;
      font-size: 16px;
      font-weight: bold;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    
    .checkbox-filter label {
      color: var(--text-secondary);
      font-family: var(--retro-font);
      font-size: clamp(0.9rem, 2.5vw, 1.1rem);
      cursor: pointer;
    }
    
    select {
      width: 100%;
      padding: 12px;
      border: 3px solid var(--border-color);
      border-radius: 0;
      background-color: var(--bg-tertiary);
      color: var(--text-primary);
      font-family: var(--retro-font);
      font-size: clamp(0.9rem, 2.5vw, 1rem);
      -webkit-appearance: none;
      appearance: none;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 15px center;
      background-size: 1em;
      cursor: pointer;
    }
    
    .btn-clear-filters {
      width: 100%;
      padding: 12px;
      background-color: var(--bg-tertiary);
      color: var(--text-primary);
      border: 3px solid var(--border-color);
      border-radius: 0;
      cursor: pointer;
      transition: all 0.3s;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      font-size: clamp(0.8rem, 2.5vw, 0.9rem);
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
    }
    
    .btn-clear-filters:hover {
      background-color: var(--accent-color);
      color: white;
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.3);
    }
    
    /* Games Grid */
    .games-grid {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    
    .search-bar {
      position: relative;
      margin-bottom: 20px;
    }
    
    .search-bar input {
      width: 100%;
      padding: 15px 50px 15px 20px;
      border: 3px solid var(--border-color);
      border-radius: 0;
      font-size: clamp(1rem, 3vw, 1.1rem);
      background-color: var(--bg-tertiary);
      color: var(--text-primary);
      font-family: var(--retro-font);
      box-sizing: border-box;
    }

    .search-bar input:focus {
      outline: none;
      border-color: var(--accent-color);
      box-shadow: 0 0 0 2px var(--accent-color);
    }
    
    .search-bar button {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      box-shadow: none;
      padding: 8px;
    }
    
    .search-bar button:hover {
      color: var(--accent-color);
    }
    
    .results-info {
      margin-bottom: 20px;
      color: var(--text-secondary);
      font-family: var(--retro-font);
      font-size: clamp(1rem, 3vw, 1.1rem);
      border-bottom: 2px solid var(--border-color);
      padding-bottom: 10px;
    }
    
    .games-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }
    
    .no-results {
      text-align: center;
      padding: 60px 20px;
      color: var(--text-secondary);
      background-color: var(--bg-secondary);
      border: 3px solid var(--border-color);
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
    }
    
    .no-results svg {
      color: var(--accent-color);
      margin-bottom: 20px;
    }
    
    .no-results h3 {
      font-size: clamp(1.2rem, 4vw, 1.5rem);
      margin-bottom: 15px;
      color: var(--heading-color);
      font-family: var(--pixel-font);
      text-transform: uppercase;
      text-shadow: 2px 2px 0 rgba(0,0,0,0.5);
    }
    
    .no-results p {
      margin-bottom: 25px;
      font-family: var(--retro-font);
      font-size: clamp(1rem, 3vw, 1.1rem);
    }
    
    .btn-primary {
      background-color: var(--accent-color);
      color: white;
      padding: 15px 30px;
      border: 3px solid var(--border-color);
      border-radius: 0;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      font-size: clamp(0.9rem, 2.5vw, 1rem);
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
    }
    
    .btn-primary:hover {
      background-color: var(--accent-hover);
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.3);
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .games-container {
        padding: 15px;
      }
      
      .games-content {
        grid-template-columns: 260px 1fr;
        gap: 20px;
      }
      
      .games-list {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      }
    }

    @media (max-width: 992px) {
      .mobile-filter-toggle {
        display: block;
      }

      .games-content {
        grid-template-columns: 1fr;
        gap: 0;
      }
      
      .filters-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1000;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .filters-sidebar.mobile-open {
        opacity: 1;
        visibility: visible;
      }

      .mobile-filter-overlay {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
      }

      .filter-content {
        background-color: var(--bg-secondary);
        border: 3px solid var(--border-color);
        border-radius: 0;
        padding: 30px;
        max-width: 400px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.5);
        position: relative;
        z-index: 2;
      }

      .games-list {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 15px;
      }
    }
    
    @media (max-width: 768px) {
      .games-container {
        padding: 10px;
      }
      
      .games-header {
        margin-bottom: 20px;
        padding-bottom: 10px;
      }

      .filter-content {
        padding: 20px;
        max-width: 350px;
      }
      
      .games-list {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      }

      .no-results {
        padding: 40px 15px;
      }
    }

    @media (max-width: 600px) {
      .games-list {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 12px;
      }

      .filter-content {
        max-width: 320px;
        padding: 15px;
      }

      .filter-section {
        margin-bottom: 20px;
      }
    }
    
    @media (max-width: 480px) {
      .games-container {
        padding: 5px;
      }
      
      .games-list {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 10px;
      }

      .filter-content {
        max-width: 280px;
        padding: 15px;
        max-height: 85vh;
      }

      .search-bar input {
        padding: 12px 40px 12px 15px;
      }

      .search-bar button {
        right: 10px;
      }
    }

    @media (max-width: 380px) {
      .games-list {
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      .filter-content {
        max-width: 260px;
        padding: 10px;
      }
    }

    /* Touch devices improvements */
    @media (hover: none) and (pointer: coarse) {
      .category-list a {
        padding: 12px 0;
        min-height: 44px;
        display: flex;
        align-items: center;
      }
      
      .checkbox-filter input,
      .price-range input::-webkit-slider-thumb {
        min-width: 44px;
        min-height: 44px;
      }
      
      .btn-toggle-filters {
        min-height: 44px;
      }
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
      .filters-sidebar,
      .filter-content,
      .search-bar input,
      select,
      .btn-clear-filters {
        border-width: 4px;
      }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .filters-sidebar,
      .btn-toggle-filters,
      .category-list a,
      .btn-clear-filters,
      .btn-primary {
        transition: none;
      }
    }
    `
  ],
})
export class GamesComponent implements OnInit {
  allGames: Game[] = []
  filteredGames: Game[] = []
  categories: string[] = []
  showMobileFilters = false

  // Filtros
  selectedCategory = ""
  priceFilter = 100
  showDiscounted = false
  sortBy = "relevance"
  searchTerm = ""

  constructor(
    private gameService: GameService,
    private cartService: CartService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.gameService.getGames().subscribe((games) => {
      this.allGames = games

      // Extraer categorías únicas
      const categorySet = new Set<string>()
      games.forEach((games) => categorySet.add(games.category))
      this.categories = Array.from(categorySet)

      // Obtener parámetros de la URL
      this.route.queryParams.subscribe((params) => {
        if (params["category"]) {
          this.selectedCategory = params["category"]
        }

        if (params["discount"] === "true") {
          this.showDiscounted = true
        }

        if (params["sort"]) {
          this.sortBy = params["sort"]
        }

        this.applyFilters()
      })
    })
  }

  toggleMobileFilters(): void {
    this.showMobileFilters = !this.showMobileFilters
    
    // Prevent body scroll when filters are open
    if (this.showMobileFilters) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }

  closeMobileFilters(): void {
    this.showMobileFilters = false
    document.body.style.overflow = 'auto'
  }

  applyFilters(): void {
    // Filtrar por categoría
    let result = this.allGames

    if (this.selectedCategory) {
      result = result.filter((game) => game.category === this.selectedCategory)
    }

    // Filtrar por precio
    result = result.filter((game) => {
      const price = game.discount ? game.price * (1 - game.discount) : game.price
      return price <= this.priceFilter
    })

    // Filtrar por descuento
    if (this.showDiscounted) {
      result = result.filter((game) => game.discount)
    }

    // Filtrar por término de búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase()
      result = result.filter(
        (game) => game.title.toLowerCase().includes(term) || game.description.toLowerCase().includes(term),
      )
    }

    // Ordenar resultados
    switch (this.sortBy) {
      case "price-low":
        result.sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount) : a.price
          const priceB = b.discount ? b.price * (1 - b.discount) : b.price
          return priceA - priceB
        })
        break
      case "price-high":
        result.sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount) : a.price
          const priceB = b.discount ? b.price * (1 - b.discount) : b.price
          return priceB - priceA
        })
        break
      case "name":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        result.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
        break
      default:
        // Por defecto, ordenar por relevancia (rating)
        result.sort((a, b) => b.rating - a.rating)
    }

    this.filteredGames = result
  }

  clearFilters(): void {
    this.selectedCategory = ""
    this.priceFilter = 100
    this.showDiscounted = false
    this.sortBy = "relevance"
    this.searchTerm = ""
    this.applyFilters()
    this.closeMobileFilters()
  }
}

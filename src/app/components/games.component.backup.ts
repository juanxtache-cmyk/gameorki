import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink, ActivatedRoute } from "@angular/router";
import { FormsModule } from "@angular/forms"
import { GameService } from "../services/game.service"
import type { Game } from "../models/game.model"
import { GameCardComponent } from "./game-card.component"

@Component({
  selector: "app-games",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, GameCardComponent],
  template: `
    <div class="games-container">
      <div class="games-header">
        <h1 class="page-title">🎮 CATÁLOGO DE JUEGOS</h1>
        <div class="status-bar" *ngIf="selectedCategory || showDiscounted">
          <span class="status-text" *ngIf="selectedCategory">
            ▶ CATEGORÍA: {{ selectedCategory.toUpperCase() }}
          </span>
          <span class="status-text" *ngIf="showDiscounted">
            ▶ OFERTAS ESPECIALES ACTIVAS
          </span>
        </div>
      </div>
      
      <div class="games-content">
        <!-- Filters Sidebar -->
        <div class="filters-sidebar">
          <div class="filter-section">
            <h3 class="filter-title">
              <span class="filter-icon">🔍</span>
              FILTROS
            </h3>
            
            <!-- Categories -->
            <div class="filter-group">
              <h4 class="filter-label">CATEGORÍAS</h4>
              <div class="category-list">
                <button 
                  class="category-btn"
                  [class.active]="!selectedCategory"
                  (click)="clearFilters()"
                >
                  <span class="btn-icon">📁</span>
                  TODOS LOS JUEGOS
                </button>
                <button 
                  *ngFor="let category of categories"
                  class="category-btn"
                  [class.active]="selectedCategory === category"
                  (click)="filterByCategory(category)"
                >
                  <span class="btn-icon">🎯</span>
                  {{ category.toUpperCase() }}
                </button>
              </div>
            </div>
            
            <!-- Price Range -->
            <div class="filter-group">
              <h4 class="filter-label">PRECIO</h4>
              <div class="price-range">
                <label class="range-label">MIN: ${{ minPrice }}</label>
                <input 
                  type="range" 
                  class="price-slider"
                  min="0" 
                  max="100" 
                  [(ngModel)]="minPrice"
                  (input)="applyFilters()"
                >
                <label class="range-label">MAX: ${{ maxPrice }}</label>
                <input 
                  type="range" 
                  class="price-slider"
                  min="0" 
                  max="100" 
                  [(ngModel)]="maxPrice"
                  (input)="applyFilters()"
                >
              </div>
            </div>
            
            <!-- Rating Filter -->
            <div class="filter-group">
              <h4 class="filter-label">RATING MÍNIMO</h4>
              <select 
                class="rating-select"
                [(ngModel)]="minRating" 
                (change)="applyFilters()"
              >
                <option value="0">Cualquier Rating</option>
                <option value="3">⭐⭐⭐ 3+</option>
                <option value="4">⭐⭐⭐⭐ 4+</option>
                <option value="4.5">⭐⭐⭐⭐⭐ 4.5+</option>
              </select>
            </div>
            
            <!-- Quick Filters -->
            <div class="filter-group">
              <h4 class="filter-label">FILTROS RÁPIDOS</h4>
              <button 
                class="quick-filter-btn"
                [class.active]="showDiscounted"
                (click)="toggleDiscounted()"
              >
                <span class="btn-icon">💰</span>
                OFERTAS
              </button>
              <button 
                class="quick-filter-btn"
                (click)="sortByNewest()"
              >
                <span class="btn-icon">🆕</span>
                NUEVOS
              </button>
              <button 
                class="quick-filter-btn"
                (click)="sortByRating()"
              >
                <span class="btn-icon">⭐</span>
                MEJOR RATING
              </button>
            </div>
          </div>
        </div>
        
        <!-- Games Grid -->
        <div class="games-main">
          <div class="games-toolbar">
            <div class="results-count">
              <span class="count-text">
                {{ filteredGames.length }} juegos encontrados
              </span>
            </div>
            <div class="sort-controls">
              <select 
                class="sort-select"
                [(ngModel)]="sortBy" 
                (change)="applySort()"
              >
                <option value="">Orden por defecto</option>
                <option value="name">Nombre A-Z</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="rating">Rating: Mayor a Menor</option>
                <option value="date">Fecha: Más Nuevos</option>
              </select>
            </div>
          </div>
          
          <!-- Loading State -->
          <div *ngIf="!filteredGames.length && !loading" class="empty-state">
            <div class="empty-icon">🎮</div>
            <h3>No se encontraron juegos</h3>
            <p>Prueba ajustando los filtros o busca en todas las categorías</p>
            <button class="clear-filters-btn" (click)="clearFilters()">
              Limpiar Filtros
            </button>
          </div>
          
          <!-- Games Grid -->
          <div class="games-grid" *ngIf="filteredGames.length > 0">
            <app-game-card 
              *ngFor="let game of filteredGames" 
              [game]="game"
              (gameSelected)="onGameSelected($event)"
              class="game-card-wrapper">
            </app-game-card>
          </div>
        </div>
      </div>
    </div>
  `, 
                type="range" 
                min="0" 
                max="100" 
                step="5" 
                [(ngModel)]="priceFilter" 
                (ngModelChange)="applyFilters()"
              >
              <div class="price-values">
                <span>$0</span>
                <span>{{priceFilter}}</span>
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
      padding: 20px 0;
    }
    
    .games-header {
      margin-bottom: 30px;
      border-bottom: 3px solid var(--border-color);
      padding-bottom: 10px;
    }
    
    .games-header h1 {
      font-size: 2rem;
      color: var(--heading-color);
      margin-bottom: 10px;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      text-shadow: 3px 3px 0 rgba(0,0,0,0.5);
    }
    
    .games-header p {
      color: var(--text-secondary);
      font-size: 1.1rem;
      font-family: var(--retro-font);
    }
    
    .games-content {
      display: grid;
      grid-template-columns: 250px 1fr;
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
    }
    
    .filter-section {
      margin-bottom: 25px;
    }
    
    .filter-section h3 {
      font-size: 1.1rem;
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
      margin-bottom: 10px;
    }
    
    .category-list a {
      color: var(--text-secondary);
      text-decoration: none;
      transition: color 0.3s;
      display: block;
      padding: 5px 0;
      font-family: var(--retro-font);
      font-size: 1.1rem;
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
      height: 10px;
      background: var(--bg-tertiary);
      border: 2px solid var(--border-color);
      border-radius: 0;
    }
    
    .price-range input::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      background: var(--accent-color);
      cursor: pointer;
      border: 2px solid var(--border-color);
      border-radius: 0;
    }
    
    .price-values {
      display: flex;
      justify-content: space-between;
      color: var(--text-secondary);
      font-family: var(--retro-font);
    }
    
    .checkbox-filter {
      display: flex;
      align-items: center;
    }
    
    .checkbox-filter input {
      margin-right: 10px;
      width: 20px;
      height: 20px;
      -webkit-appearance: none;
      appearance: none;
      background-color: var(--bg-tertiary);
      border: 2px solid var(--border-color);
      border-radius: 0;
      cursor: pointer;
    }
    
    .checkbox-filter input:checked {
      background-color: var(--accent-color);
      position: relative;
    }
    
    .checkbox-filter input:checked::after {
      content: "✓";
      position: absolute;
      color: white;
      font-size: 14px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    
    .checkbox-filter label {
      color: var(--text-secondary);
      font-family: var(--retro-font);
      font-size: 1.1rem;
    }
    
    select {
      width: 100%;
      padding: 10px;
      border: 3px solid var(--border-color);
      border-radius: 0;
      background-color: var(--bg-tertiary);
      color: var(--text-primary);
      font-family: var(--retro-font);
      font-size: 1.1rem;
      -webkit-appearance: none;
      appearance: none;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 10px center;
      background-size: 1em;
    }
    
    .btn-clear-filters {
      width: 100%;
      padding: 10px;
      background-color: var(--bg-tertiary);
      color: var(--text-primary);
      border: 3px solid var(--border-color);
      border-radius: 0;
      cursor: pointer;
      transition: all 0.3s;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      font-size: 0.8rem;
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
    }
    
    .search-bar {
      position: relative;
      margin-bottom: 20px;
    }
    
    .search-bar input {
      width: 100%;
      padding: 12px 40px 12px 15px;
      border: 3px solid var(--border-color);
      border-radius: 0;
      font-size: 1rem;
      background-color: var(--bg-tertiary);
      color: var(--text-primary);
      font-family: var(--retro-font);
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
    }
    
    .search-bar button:hover {
      color: var(--accent-color);
    }
    
    .results-info {
      margin-bottom: 20px;
      color: var(--text-secondary);
      font-family: var(--retro-font);
      font-size: 1.1rem;
      border-bottom: 2px solid var(--border-color);
      padding-bottom: 10px;
    }
    
    .games-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }
    
    .no-results {
      text-align: center;
      padding: 40px 0;
      color: var(--text-secondary);
      background-color: var(--bg-secondary);
      border: 3px solid var(--border-color);
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
    }
    
    .no-results svg {
      color: var(--accent-color);
      margin-bottom: 15px;
    }
    
    .no-results h3 {
      font-size: 1.3rem;
      margin-bottom: 10px;
      color: var(--heading-color);
      font-family: var(--pixel-font);
      text-transform: uppercase;
      text-shadow: 2px 2px 0 rgba(0,0,0,0.5);
    }
    
    .no-results p {
      margin-bottom: 20px;
      font-family: var(--retro-font);
      font-size: 1.1rem;
    }
    
    .btn-primary {
      background-color: var(--accent-color);
      color: white;
      padding: 10px 20px;
      border: 3px solid var(--border-color);
      border-radius: 0;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
      font-family: var(--pixel-font);
      text-transform: uppercase;
      font-size: 0.8rem;
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
    }
    
    .btn-primary:hover {
      background-color: var(--accent-hover);
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.3);
    }
    
    @media (max-width: 992px) {
      .games-content {
        grid-template-columns: 1fr;
      }
      
      .filters-sidebar {
        margin-bottom: 20px;
      }
    }
    
    @media (max-width: 768px) {
      .games-list {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      }
    }
  `,
  ],
})
export class GamesComponent implements OnInit {
  allGames: Game[] = []
  filteredGames: Game[] = []
  categories: string[] = []

  // Filtros
  selectedCategory = ""
  priceFilter = 100
  showDiscounted = false
  sortBy = "relevance"
  searchTerm = ""

  constructor(
    private gameService: GameService,
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
  }
}

import { Injectable } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import { type Observable, of, BehaviorSubject, catchError, map } from "rxjs"
import type { Game } from "../models/game.model"
import { environment } from "../../environments/environment"

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

interface SearchFilters {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

@Injectable({
  providedIn: "root",
})
export class GameService {
  private readonly apiUrl = `${environment.apiUrl}/games`;
  private gamesSubject = new BehaviorSubject<Game[]>([]);
  public games$ = this.gamesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadGames();
  }

  // Cargar todos los juegos
  private loadGames(): void {
    this.getAllGames().subscribe({
      next: (games) => this.gamesSubject.next(games),
      error: (error) => {
        console.error('Error loading games:', error);
        this.gamesSubject.next(this.getFallbackGames());
      }
    });
  }

  // Obtener todos los juegos desde la API
  getAllGames(): Observable<Game[]> {
    return this.http.get<ApiResponse<Game[]>>(this.apiUrl).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error fetching games:', error);
        return of(this.getFallbackGames());
      })
    );
  }

  // Obtener juegos destacados
  getFeaturedGames(): Observable<Game[]> {
    return this.http.get<ApiResponse<Game[]>>(`${this.apiUrl}/featured`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error fetching featured games:', error);
        return of([]);
      })
    );
  }

  // Obtener juego por ID
  getGameById(id: number): Observable<Game | null> {
    return this.http.get<ApiResponse<Game>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error fetching game by ID:', error);
        return of(null);
      })
    );
  }

  // Obtener juegos por categoría
  getGamesByCategory(category: string): Observable<Game[]> {
    return this.http.get<ApiResponse<Game[]>>(`${this.apiUrl}/category/${encodeURIComponent(category)}`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error fetching games by category:', error);
        return of([]);
      })
    );
  }

  // Buscar juegos con filtros
  searchGames(filters: SearchFilters): Observable<Game[]> {
    let params = new HttpParams();
    
    if (filters.q) params = params.set('q', filters.q);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.minPrice !== undefined) params = params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params = params.set('maxPrice', filters.maxPrice.toString());
    if (filters.sort) params = params.set('sort', filters.sort);

    return this.http.get<ApiResponse<Game[]>>(`${this.apiUrl}/search`, { params }).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error searching games:', error);
        return of([]);
      })
    );
  }

  // Obtener categorías disponibles
  getCategories(): Observable<string[]> {
    return this.http.get<ApiResponse<string[]>>(`${this.apiUrl}/categories`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error fetching categories:', error);
        return of(['RPG', 'Acción/Aventura', 'Deportes', 'FPS']);
      })
    );
  }

  // Obtener datos de fallback en caso de error de API
  private getFallbackGames(): Game[] {
    return [
      {
        id: 1,
        title: "Cyberpunk 2077",
        description: "Cyberpunk 2077 es un RPG de aventura y acción de mundo abierto ambientado en el futuro sombrío de Night City.",
        price: 59.99,
        imageUrl: "/asset/cyber.png",
        screenShots: [
          "https://via.placeholder.com/800x450/00FFFF/000000?text=Cyberpunk+Screenshot+1",
          "https://via.placeholder.com/800x450/FF00FF/000000?text=Cyberpunk+Screenshot+2",
          "https://picsum.photos/800/450?random=201",
        ],
        category: "RPG",
        releaseDate: "2020-12-10",
        publisher: "CD Projekt RED",
        rating: 4.2,
        discount: 0.2,
        stock: 25,
        active: true,
        tags: ["RPG", "Ciencia Ficción", "Mundo Abierto"],
        ageRating: "M",
        trailerUrl: "https://www.youtube.com/watch?v=8X2kIfS6fb8",
        developer: "CD Projekt RED",
        systemRequirements: {
          minimum: "OS: Windows 7 64-bit, Processor: Intel Core i5-3570K, Memory: 8 GB RAM",
          recommended: "OS: Windows 10 64-bit, Processor: Intel Core i7-4790, Memory: 12 GB RAM"
        },
      },
      {
        id: 2,
        title: "The Last of Us Part II",
        description: "Cinco años después de su peligroso viaje a través de los Estados Unidos, Ellie y Joel se han establecido en Jackson, Wyoming.",
        price: 49.99,
        imageUrl: "/asset/us.jpg",
        screenShots: [
          "https://via.placeholder.com/800x450/8B4513/FFFFFF?text=The+Last+of+Us+Screenshot+1",
          "https://via.placeholder.com/800x450/654321/FFFFFF?text=The+Last+of+Us+Screenshot+2", 
          "https://picsum.photos/800/450?random=202",
        ],
        category: "Acción/Aventura",
        releaseDate: "2020-06-19",
        publisher: "Sony Interactive Entertainment",
        rating: 4.8,
        stock: 15,
        active: true,
        tags: ["Acción", "Aventura", "Post-Apocalíptico"],
        ageRating: "M",
      },
      {
        id: 3,
        title: "FIFA 23",
        description: "FIFA 23 nos acerca al mayor juego del mundo con avances tecnológicos que aumentan el realismo.",
        price: 39.99,
        imageUrl: "/asset/fifa23.png",
        screenShots: [
          "https://via.placeholder.com/800x450/228B22/FFFFFF?text=FIFA+23+Screenshot+1",
          "https://via.placeholder.com/800x450/32CD32/FFFFFF?text=FIFA+23+Screenshot+2",
          "https://picsum.photos/800/450?random=203",
        ],
        category: "Deportes",
        releaseDate: "2022-09-30",
        publisher: "EA Sports",
        rating: 4.0,
        discount: 0.15,
        stock: 50,
        active: true,
        tags: ["Deportes", "Fútbol", "Multijugador"],
        ageRating: "E",
        trailerUrl: "https://www.youtube.com/watch?v=0tIW9jZarcY",
        developer: "EA Sports",
        systemRequirements: {
          minimum: "OS: Windows 10, Processor: AMD FX 6300, Memory: 8 GB RAM",
          recommended: "OS: Windows 11, Processor: AMD Ryzen 3 1300X, Memory: 12 GB RAM"
        },
      },
      {
        id: 4,
        title: "Elden Ring",
        description: "Elden Ring es un RPG de acción desarrollado por FromSoftware y publicado por Bandai Namco Entertainment.",
        price: 59.99,
        imageUrl: "/asset/elden.png",
        screenShots: [
          "https://via.placeholder.com/800x450/8B4513/FFFFFF?text=Elden+Ring+Screenshot+1",
          "https://via.placeholder.com/800x450/D2691E/FFFFFF?text=Elden+Ring+Screenshot+2",
          "https://picsum.photos/800/450?random=204",
        ],
        category: "RPG",
        releaseDate: "2022-02-25",
        publisher: "Bandai Namco",
        rating: 4.9,
        stock: 30,
        active: true,
        tags: ["RPG", "Souls-like", "Fantasy"],
        ageRating: "M",
      },
      {
        id: 5,
        title: "Call of Duty: Modern Warfare II",
        description: "Call of Duty: Modern Warfare II es un videojuego de disparos en primera persona desarrollado por Infinity Ward.",
        price: 69.99,
        imageUrl: "/asset/call.png",
        screenShots: [
          "https://via.placeholder.com/800x450/FF4500/FFFFFF?text=Call+of+Duty+Screenshot+1",
          "https://via.placeholder.com/800x450/DC143C/FFFFFF?text=Call+of+Duty+Screenshot+2",
          "https://picsum.photos/800/450?random=205",
        ],
        category: "FPS",
        releaseDate: "2022-10-28",
        publisher: "Activision",
        rating: 4.3,
        stock: 40,
        active: true,
        tags: ["FPS", "Multijugador", "Guerra"],
        ageRating: "M",
      },
      {
        id: 6,
        title: "Horizon Forbidden West",
        description: "Horizon Forbidden West continúa la historia de Aloy, una cazadora que viaja a una nueva frontera.",
        price: 49.99,
        imageUrl: "/asset/horizon.png",
        screenShots: [
          "https://via.placeholder.com/800x450/4682B4/FFFFFF?text=Horizon+Screenshot+1",
          "https://via.placeholder.com/800x450/1E90FF/FFFFFF?text=Horizon+Screenshot+2",
          "https://picsum.photos/800/450?random=206",
        ],
        category: "Acción/Aventura",
        releaseDate: "2022-02-18",
        publisher: "Sony Interactive Entertainment",
        rating: 4.7,
        discount: 0.1,
        stock: 20,
        active: true,
        tags: ["Aventura", "RPG", "Ciencia Ficción"],
        ageRating: "T",
      }
    ];
  }

  // Métodos legacy para compatibilidad hacia atrás
  getGames(): Observable<Game[]> {
    return this.getAllGames();
  }

  getGame(id: number): Observable<Game | undefined> {
    return this.getGameById(id).pipe(
      map(game => game || undefined)
    );
  }

  getFeaturedGamesLegacy(): Observable<Game[]> {
    return this.getFeaturedGames();
  }

  searchGamesLegacy(term: string, category?: string): Observable<Game[]> {
    return this.searchGames({ q: term, category });
  }

  getGamesByPriceRange(min: number, max: number): Observable<Game[]> {
    return this.searchGames({ minPrice: min, maxPrice: max });
  }

  getTopRatedGames(): Observable<Game[]> {
    return this.searchGames({ sort: 'rating' });
  }

  getNewestGames(): Observable<Game[]> {
    return this.searchGames({ sort: 'newest' });
  }

  // Métodos administrativos
  updateGame(id: number, updatedGame: Partial<Game>): Observable<Game> {
    return this.http.put<ApiResponse<Game>>(`${this.apiUrl}/${id}`, updatedGame).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error updating game:', error);
        throw error;
      })
    );
  }

  addGame(newGame: Omit<Game, 'id'>): Observable<Game> {
    return this.http.post<ApiResponse<Game>>(this.apiUrl, newGame).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error adding game:', error);
        throw error;
      })
    );
  }

  deleteGame(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error deleting game:', error);
        return of(false);
      })
    );
  }

  updateStock(id: number, stock: number): Observable<boolean> {
    return this.http.patch<ApiResponse<Game>>(`${this.apiUrl}/${id}/stock`, { stock }).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error updating stock:', error);
        return of(false);
      })
    );
  }
}
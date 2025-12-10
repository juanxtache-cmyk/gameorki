import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { GameService } from "../services/game.service";
import { AuthService } from "../services/auth.service";
import { Game } from "../models/game.model";
import { User } from "../models/user.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-admin-panel",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="admin-panel" *ngIf="isAdmin; else accessDenied">
      <div class="admin-header">
        <h1>Panel de Administración</h1>
        <p>Gestión de inventario de juegos</p>
      </div>

      <div class="admin-tabs">
        <button 
          class="tab-button"
          [class.active]="activeTab === 'list'"
          (click)="setActiveTab('list')">
          📋 Lista de Juegos
        </button>
        <button 
          class="tab-button"
          [class.active]="activeTab === 'add'"
          (click)="setActiveTab('add')">
          ➕ Agregar Juego
        </button>
        <button 
          class="tab-button"
          [class.active]="activeTab === 'stock'"
          (click)="setActiveTab('stock')">
          📦 Gestión de Stock
        </button>
      </div>

      <!-- Lista de Juegos -->
      <div class="tab-content" *ngIf="activeTab === 'list'">
        <div class="games-list">
          <div class="list-header">
            <h2>Catálogo de Juegos</h2>
            <div class="search-bar">
              <input 
                type="text" 
                placeholder="Buscar juegos..."
                [(ngModel)]="searchTerm"
                (input)="filterGames()">
              <button class="search-btn">🔍</button>
            </div>
          </div>
          
          <div class="games-grid">
            <div class="game-card" *ngFor="let game of filteredGames">
              <div class="game-image">
                <img [src]="game.imageUrl" [alt]="game.title" class="game-img">
              </div>
              <div class="game-info">
                <h3>{{ game.title }}</h3>
                <p class="game-price">{{ game.price | currency:'USD':'symbol':'1.2-2' }}</p>
                <p class="game-stock">Stock: {{ game.stock }}</p>
                <p class="game-category">{{ game.category }}</p>
              </div>
              <div class="game-actions">
                <button class="btn-edit" (click)="editGame(game)">✏️ Editar</button>
                <button class="btn-delete" (click)="confirmDelete(game)">🗑️ Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Agregar/Editar Juego -->
      <div class="tab-content" *ngIf="activeTab === 'add'">
        <div class="game-form">
          <h2>{{ editingGame ? 'Editar Juego' : 'Agregar Nuevo Juego' }}</h2>
          
          <form [formGroup]="gameForm" (ngSubmit)="saveGame()">
            <div class="form-group">
              <label for="title">Título del juego</label>
              <input 
                type="text" 
                id="title"
                formControlName="title"
                placeholder="Ej. Cyberpunk 2077"
                class="form-input">
            </div>

            <div class="form-group">
              <label for="price">Precio</label>
              <input 
                type="number" 
                id="price"
                formControlName="price"
                placeholder="59.99"
                class="form-input"
                step="0.01">
            </div>

            <div class="form-group">
              <label for="stock">Stock</label>
              <input 
                type="number" 
                id="stock"
                formControlName="stock"
                placeholder="100"
                class="form-input"
                min="0">
            </div>

            <div class="form-group">
              <label for="category">Categoría</label>
              <select id="category" formControlName="category" class="form-input">
                <option value="">Seleccionar categoría</option>
                <option value="action">Acción</option>
                <option value="adventure">Aventura</option>
                <option value="rpg">RPG</option>
                <option value="sports">Deportes</option>
                <option value="strategy">Estrategia</option>
                <option value="simulation">Simulación</option>
              </select>
            </div>

            <div class="form-group">
              <label for="description">Descripción</label>
              <textarea 
                id="description"
                formControlName="description"
                placeholder="Descripción del juego..."
                class="form-input"
                rows="4">
              </textarea>
            </div>

            <div class="form-group">
              <label for="image">URL de la imagen principal</label>
              <input 
                type="text" 
                id="image"
                formControlName="image"
                placeholder="https://ejemplo.com/imagen.jpg"
                class="form-input">
              <div class="image-preview" *ngIf="gameForm.get('image')?.value">
                <img [src]="gameForm.get('image')?.value" alt="Vista previa" class="preview-img">
              </div>
            </div>

            <!-- Sección de Capturas simplificada -->
            <div class="form-group screenshots-section">
              <label>Capturas de pantalla</label>
              <div class="screenshots-controls">
                <div class="add-screenshot-controls">
                  <input 
                    type="url" 
                    [(ngModel)]="newScreenshotUrl"
                    [ngModelOptions]="{standalone: true}"
                    placeholder="URL de la captura..."
                    class="screenshot-input">
                  <button 
                    type="button" 
                    class="btn-add-simple" 
                    (click)="addScreenshot()">
                    ➕ Agregar Captura
                  </button>
                </div>
                
                <div class="example-buttons">
                  <p class="example-text">O usa estos ejemplos que funcionan:</p>
                  <button type="button" class="btn-example" (click)="addExampleScreenshot(1)">
                    📸 Ejemplo 1
                  </button>
                  <button type="button" class="btn-example" (click)="addExampleScreenshot(2)">
                    📸 Ejemplo 2
                  </button>
                  <button type="button" class="btn-example" (click)="addExampleScreenshot(3)">
                    📸 Ejemplo 3
                  </button>
                </div>
              </div>

              <div class="screenshots-grid" *ngIf="currentScreenshots.length > 0">
                <div class="screenshot-item" *ngFor="let screenshot of currentScreenshots; let i = index">
                  <img [src]="screenshot" [alt]="'Captura ' + (i + 1)" class="screenshot-thumb">
                  <button type="button" class="btn-remove" (click)="removeScreenshot(i)">❌</button>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-save" [disabled]="!gameForm.valid">
                {{ editingGame ? '💾 Actualizar' : '💾 Guardar' }}
              </button>
              <button type="button" class="btn-cancel" (click)="cancelEdit()">
                ❌ Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Gestión de Stock -->
      <div class="tab-content" *ngIf="activeTab === 'stock'">
        <div class="stock-management">
          <h2>Gestión de Stock</h2>
          
          <div class="stock-grid">
            <div class="stock-item" *ngFor="let game of games">
              <div class="stock-info">
                <img [src]="game.imageUrl" [alt]="game.title" class="stock-img">
                <div class="stock-details">
                  <h4>{{ game.title }}</h4>
                  <p class="current-stock">Stock actual: <span>{{ game.stock }}</span></p>
                </div>
              </div>
              <div class="stock-controls">
                <div class="stock-adjustment">
                  <input 
                    type="number" 
                    [(ngModel)]="stockAdjustments[game.id]"
                    placeholder="Nueva cantidad"
                    class="stock-input"
                    min="0">
                  <button 
                    class="btn-update-stock"
                    (click)="updateStock(game)">
                    🔄 Actualizar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ng-template #accessDenied>
      <div class="access-denied">
        <h2>🚫 Acceso Denegado</h2>
        <p>No tienes permisos para acceder al panel de administración.</p>
        <button class="btn-back" (click)="goBack()">← Volver</button>
      </div>
    </ng-template>
  `,
  styles: [`
    .admin-panel {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
      font-family: 'Orbitron', monospace;
      color: #00ff88;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
      min-height: 100vh;
    }

    .admin-header {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px;
      background: rgba(0, 255, 136, 0.1);
      border: 2px solid #00ff88;
      border-radius: 10px;
    }

    .admin-header h1 {
      color: #00ff88;
      text-shadow: 0 0 10px #00ff88;
      margin: 0;
      font-size: 2.5em;
    }

    .admin-tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 30px;
      justify-content: center;
    }

    .tab-button {
      background: #16213e;
      border: 2px solid #0f3460;
      color: #00ff88;
      padding: 12px 24px;
      cursor: pointer;
      border-radius: 8px;
      font-family: 'Orbitron', monospace;
      font-weight: bold;
      transition: all 0.3s ease;
    }

    .tab-button:hover {
      background: #0f3460;
      box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
    }

    .tab-button.active {
      background: #00ff88;
      color: #0a0a0a;
      box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
    }

    .tab-content {
      background: rgba(22, 33, 62, 0.8);
      border: 2px solid #0f3460;
      border-radius: 15px;
      padding: 30px;
    }

    /* Lista de Juegos */
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .search-bar {
      display: flex;
      gap: 10px;
    }

    .search-bar input {
      background: #0a0a0a;
      border: 2px solid #00ff88;
      color: #00ff88;
      padding: 10px;
      border-radius: 5px;
      font-family: 'Orbitron', monospace;
    }

    .search-btn {
      background: #00ff88;
      color: #0a0a0a;
      border: none;
      padding: 10px 15px;
      border-radius: 5px;
      cursor: pointer;
    }

    .games-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .game-card {
      background: rgba(10, 10, 10, 0.8);
      border: 2px solid #00ff88;
      border-radius: 10px;
      padding: 15px;
      transition: all 0.3s ease;
    }

    .game-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 255, 136, 0.3);
    }

    .game-img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 5px;
      margin-bottom: 10px;
    }

    .game-actions {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }

    .btn-edit, .btn-delete {
      padding: 8px 15px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-family: 'Orbitron', monospace;
      font-weight: bold;
    }

    .btn-edit {
      background: #ffa500;
      color: #0a0a0a;
    }

    .btn-delete {
      background: #ff0040;
      color: white;
    }

    /* Formulario */
    .game-form {
      max-width: 800px;
      margin: 0 auto;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      color: #00ff88;
      font-weight: bold;
    }

    .form-input {
      width: 100%;
      background: #0a0a0a;
      border: 2px solid #00ff88;
      color: #00ff88;
      padding: 12px;
      border-radius: 5px;
      font-family: 'Orbitron', monospace;
      font-size: 14px;
    }

    .form-input:focus {
      outline: none;
      box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
    }

    .image-preview {
      margin-top: 10px;
      text-align: center;
    }

    .preview-img {
      max-width: 200px;
      max-height: 200px;
      border-radius: 5px;
      border: 2px solid #00ff88;
    }

    /* Screenshots */
    .screenshots-section {
      border: 2px solid #0f3460;
      padding: 20px;
      border-radius: 10px;
      background: rgba(15, 52, 96, 0.2);
    }

    .screenshots-controls {
      margin-bottom: 20px;
    }

    .add-screenshot-controls {
      display: flex;
      gap: 10px;
      margin-bottom: 15px;
    }

    .screenshot-input {
      flex: 1;
      background: #0a0a0a;
      border: 2px solid #00ff88;
      color: #00ff88;
      padding: 10px;
      border-radius: 5px;
      font-family: 'Orbitron', monospace;
    }

    .btn-add-simple {
      background: #00ff88;
      color: #0a0a0a;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-family: 'Orbitron', monospace;
      font-weight: bold;
      white-space: nowrap;
    }

    .btn-add-simple:hover {
      background: #00cc6a;
      box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
    }

    .example-buttons {
      text-align: center;
    }

    .example-text {
      color: #888;
      margin: 0 0 10px 0;
      font-size: 12px;
    }

    .btn-example {
      background: #0f3460;
      color: #00ff88;
      border: 2px solid #00ff88;
      padding: 8px 16px;
      margin: 0 5px;
      border-radius: 5px;
      cursor: pointer;
      font-family: 'Orbitron', monospace;
      font-size: 12px;
    }

    .btn-example:hover {
      background: #00ff88;
      color: #0a0a0a;
    }

    .screenshots-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 10px;
    }

    .screenshot-item {
      position: relative;
      border: 2px solid #00ff88;
      border-radius: 5px;
      overflow: hidden;
    }

    .screenshot-thumb {
      width: 100%;
      height: 100px;
      object-fit: cover;
      display: block;
    }

    .btn-remove {
      position: absolute;
      top: 5px;
      right: 5px;
      background: #ff0040;
      color: white;
      border: none;
      border-radius: 50%;
      width: 25px;
      height: 25px;
      cursor: pointer;
      font-size: 12px;
    }

    /* Botones del formulario */
    .form-actions {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-top: 30px;
    }

    .btn-save, .btn-cancel {
      padding: 15px 30px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-family: 'Orbitron', monospace;
      font-weight: bold;
      font-size: 16px;
    }

    .btn-save {
      background: #00ff88;
      color: #0a0a0a;
    }

    .btn-save:disabled {
      background: #666;
      cursor: not-allowed;
    }

    .btn-cancel {
      background: #ff0040;
      color: white;
    }

    /* Stock Management */
    .stock-grid {
      display: grid;
      gap: 15px;
    }

    .stock-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(10, 10, 10, 0.5);
      border: 2px solid #00ff88;
      border-radius: 10px;
      padding: 15px;
    }

    .stock-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .stock-img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 5px;
    }

    .current-stock span {
      color: #00ff88;
      font-weight: bold;
    }

    .stock-controls {
      display: flex;
      gap: 10px;
    }

    .stock-input {
      width: 120px;
      background: #0a0a0a;
      border: 2px solid #00ff88;
      color: #00ff88;
      padding: 8px;
      border-radius: 5px;
      font-family: 'Orbitron', monospace;
    }

    .btn-update-stock {
      background: #00ff88;
      color: #0a0a0a;
      border: none;
      padding: 8px 15px;
      border-radius: 5px;
      cursor: pointer;
      font-family: 'Orbitron', monospace;
      font-weight: bold;
    }

    /* Access Denied */
    .access-denied {
      text-align: center;
      padding: 50px;
      background: rgba(255, 0, 64, 0.1);
      border: 2px solid #ff0040;
      border-radius: 15px;
      max-width: 600px;
      margin: 50px auto;
    }

    .access-denied h2 {
      color: #ff0040;
      margin-bottom: 20px;
    }

    .btn-back {
      background: #0f3460;
      color: #00ff88;
      border: 2px solid #00ff88;
      padding: 15px 30px;
      border-radius: 8px;
      cursor: pointer;
      font-family: 'Orbitron', monospace;
      font-weight: bold;
      margin-top: 20px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .admin-panel {
        padding: 10px;
      }

      .admin-tabs {
        flex-direction: column;
        gap: 5px;
      }

      .games-grid {
        grid-template-columns: 1fr;
      }

      .list-header {
        flex-direction: column;
        gap: 15px;
      }

      .stock-item {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }
    }
  `]
})
export class AdminPanelComponent implements OnInit {
  isAdmin = false;
  activeTab = 'list';
  
  games: Game[] = [];
  filteredGames: Game[] = [];
  searchTerm = '';
  
  gameForm!: FormGroup;
  editingGame: Game | null = null;
  
  stockAdjustments: { [key: string]: number } = {};
  
  // Screenshots
  newScreenshotUrl = '';
  currentScreenshots: string[] = [];

  constructor(
    private gameService: GameService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    this.checkAdminAccess();
    this.loadGames();
  }

  checkAdminAccess() {
    this.authService.currentUser$.subscribe(user => {
      this.isAdmin = !!(user && user.role === 'admin');
      if (!this.isAdmin) {
        console.log('Acceso denegado - Usuario no es admin');
      }
    });
  }

  initializeForm() {
    this.gameForm = this.fb.group({
      title: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      description: [''],
      image: ['']
    });
  }

  loadGames() {
    this.gameService.getGames().subscribe(games => {
      this.games = games;
      this.filteredGames = [...this.games];
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab !== 'add') {
      this.cancelEdit();
    }
  }

  filterGames() {
    if (!this.searchTerm.trim()) {
      this.filteredGames = [...this.games];
    } else {
      this.filteredGames = this.games.filter(game =>
        game.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        game.category.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  editGame(game: Game) {
    this.editingGame = game;
    this.gameForm.patchValue({
      title: game.title,
      price: game.price,
      stock: game.stock,
      category: game.category,
      description: game.description,
      image: game.imageUrl
    });
    
    this.currentScreenshots = [...(game.screenShots || [])];
    this.setActiveTab('add');
  }

  saveGame() {
    if (this.gameForm.valid) {
      const gameData = {
        ...this.gameForm.value,
        screenShots: [...this.currentScreenshots]
      };

      if (this.editingGame) {
        this.gameService.updateGame(this.editingGame.id, gameData);
        console.log('Juego actualizado:', gameData);
      } else {
        this.gameService.addGame(gameData);
        console.log('Juego agregado:', gameData);
      }

      this.loadGames();
      this.cancelEdit();
      this.setActiveTab('list');
    }
  }

  cancelEdit() {
    this.editingGame = null;
    this.gameForm.reset();
    this.currentScreenshots = [];
    this.newScreenshotUrl = '';
  }

  confirmDelete(game: Game) {
    if (confirm(`¿Estás seguro de que deseas eliminar "${game.title}"?`)) {
      this.gameService.deleteGame(game.id);
      this.loadGames();
      console.log('Juego eliminado:', game.title);
    }
  }

  updateStock(game: Game) {
    const newStock = this.stockAdjustments[game.id];
    if (newStock !== undefined && newStock >= 0) {
      this.gameService.updateStock(game.id, newStock);
      this.loadGames();
      console.log(`Stock actualizado para ${game.title}: ${newStock}`);
      delete this.stockAdjustments[game.id];
    }
  }

  // Screenshot management - FUNCIONES ÚNICAS Y LIMPIAS
  addScreenshot() {
    const url = this.newScreenshotUrl.trim();
    if (url) {
      // Validar que sea una URL válida
      try {
        new URL(url);
        this.currentScreenshots.push(url);
        this.newScreenshotUrl = '';
        console.log('Screenshot agregado:', url);
        console.log('Screenshots actuales:', this.currentScreenshots);
      } catch (e) {
        alert('Por favor ingresa una URL válida');
      }
    } else {
      alert('Por favor ingresa una URL');
    }
  }

  addExampleScreenshot(example: number) {
    const examples = [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800', 
      'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800'
    ];
    
    if (example >= 1 && example <= examples.length) {
      const url = examples[example - 1];
      this.currentScreenshots.push(url);
      console.log('Screenshot de ejemplo agregado:', url);
      console.log('Screenshots actuales:', this.currentScreenshots);
    }
  }

  removeScreenshot(index: number) {
    if (index >= 0 && index < this.currentScreenshots.length) {
      const removed = this.currentScreenshots.splice(index, 1);
      console.log('Screenshot eliminado:', removed[0]);
      console.log('Screenshots actuales:', this.currentScreenshots);
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}

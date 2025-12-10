import { Injectable } from '@angular/core';

export interface GameKey {
  id: string;
  gameId: number;
  gameTitle: string;
  key: string;
  userId: string;
  purchaseDate: Date;
  isUsed: boolean;
  activationPlatform: 'Steam' | 'Origin' | 'Epic Games' | 'Game Store';
}

@Injectable({
  providedIn: 'root'
})
export class KeyGeneratorService {
  private readonly KEY_STORAGE_KEY = 'generated_keys';

  constructor() {}

  /**
   * Genera una key de activación tipo Steam
   * Formato: XXXXX-XXXXX-XXXXX-XXXXX-XXXXX
   */
  generateSteamKey(gameId: number, gameTitle: string, userId: string): GameKey {
    const segments: string[] = [];
    
    // Generar 5 segmentos de 5 caracteres cada uno
    for (let i = 0; i < 5; i++) {
      segments.push(this.generateKeySegment());
    }

    const key = segments.join('-');
    
    const gameKey: GameKey = {
      id: this.generateUniqueId(),
      gameId,
      gameTitle,
      key,
      userId,
      purchaseDate: new Date(),
      isUsed: false,
      activationPlatform: 'Steam'
    };

    // Guardar la key localmente
    this.saveKey(gameKey);

    return gameKey;
  }

  /**
   * Genera un segmento de key de 5 caracteres alfanuméricos
   */
  private generateKeySegment(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let segment = '';
    
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      segment += chars[randomIndex];
    }
    
    return segment;
  }

  /**
   * Genera un ID único para la key
   */
  private generateUniqueId(): string {
    return 'key_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Guarda la key en localStorage
   */
  private saveKey(gameKey: GameKey): void {
    const existingKeys = this.getAllKeys();
    existingKeys.push(gameKey);
    localStorage.setItem(this.KEY_STORAGE_KEY, JSON.stringify(existingKeys));
  }

  /**
   * Obtiene todas las keys generadas
   */
  getAllKeys(): GameKey[] {
    const stored = localStorage.getItem(this.KEY_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Obtiene las keys de un usuario específico
   */
  getUserKeys(userId: string): GameKey[] {
    return this.getAllKeys().filter(key => key.userId === userId);
  }

  /**
   * Marca una key como utilizada
   */
  markKeyAsUsed(keyId: string): boolean {
    const keys = this.getAllKeys();
    const keyIndex = keys.findIndex(key => key.id === keyId);
    
    if (keyIndex !== -1) {
      keys[keyIndex].isUsed = true;
      localStorage.setItem(this.KEY_STORAGE_KEY, JSON.stringify(keys));
      return true;
    }
    
    return false;
  }

  /**
   * Verifica si una key es válida
   */
  validateKey(keyString: string): GameKey | null {
    const keys = this.getAllKeys();
    return keys.find(key => key.key === keyString && !key.isUsed) || null;
  }

  /**
   * Genera múltiples keys para una compra con varios juegos
   */
  generateKeysForPurchase(cartItems: {gameId: number, gameTitle: string, quantity: number}[], userId: string): GameKey[] {
    const generatedKeys: GameKey[] = [];
    
    cartItems.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        const key = this.generateSteamKey(item.gameId, item.gameTitle, userId);
        generatedKeys.push(key);
      }
    });
    
    return generatedKeys;
  }
}
import { Injectable } from "@angular/core"
import { BehaviorSubject, type Observable } from "rxjs"
import { HttpClient } from "@angular/common/http"
import type { Cart } from "../models/cart.model"
import type { Game } from "../models/game.model"
import { AuthService } from "./auth.service"
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`
  private initialCart: Cart = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  }

  private cartSubject = new BehaviorSubject<Cart>(this.initialCart)
  public cart$ = this.cartSubject.asObservable()  
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Suscribirse a cambios en el estado de autenticación
    this.authService.currentUser$.subscribe(user => {
      if (user && this.authService.getToken()) {
        // Si el usuario está autenticado, cargar su carrito desde el backend
        this.loadCart()
      } else {
        // Si no hay usuario autenticado o se cerró sesión
        // Limpiar el carrito local y del backend
        this.cartSubject.next(this.initialCart)
        localStorage.removeItem('cart')
      }
    })
  }

  private loadCart(): void {
    if (!this.authService.isLoggedIn()) {
      const storedCart = localStorage.getItem('cart')
      if (storedCart) {
        try {
          const cart = JSON.parse(storedCart)
          this.cartSubject.next(this.validateCartStructure(cart))
        } catch (error) {
          console.error('Error al parsear carrito del localStorage:', error)
          this.initializeEmptyCart()
        }
      }
      return
    }

    // Solo usar localStorage - no hacer llamadas HTTP
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      try {
        const cart = JSON.parse(storedCart)
        this.cartSubject.next(this.validateCartStructure(cart))
        console.log('Carrito cargado desde localStorage:', cart)
      } catch (error) {
        console.error('Error al parsear carrito del localStorage:', error)
        this.initializeEmptyCart()
      }
    } else {
      this.initializeEmptyCart()
    }
  }

  // Validar y corregir la estructura del carrito
  private validateCartStructure(cart: any): Cart {
    console.log('🔍 Validando estructura del carrito:', cart);
    
    if (!cart || typeof cart !== 'object') {
      console.log('⚠️ Carrito inválido, retornando carrito inicial');
      return this.initialCart;
    }

    // Si el carrito tiene formato de respuesta del backend, extraer los datos
    if (cart.success && cart.data) {
      console.log('🔄 Detectado formato de respuesta backend, extrayendo datos...');
      cart = cart.data;
    }

    const validCart = {
      items: Array.isArray(cart.items) ? cart.items : [],
      totalItems: typeof cart.totalItems === 'number' ? cart.totalItems : 0,
      totalPrice: typeof cart.totalPrice === 'number' ? cart.totalPrice : 0,
    };
    
    console.log('✅ Carrito validado:', validCart);
    return validCart;
  }

  private initializeEmptyCart(): void {
    const emptyCart: Cart = {
      items: [],
      totalItems: 0,
      totalPrice: 0
    }
    this.cartSubject.next(emptyCart)
    localStorage.setItem('cart', JSON.stringify(emptyCart))
    console.log('Carrito vacío inicializado')
  }

  private recalculateCart(cart: Cart): Cart {
    console.log('🧮 Recalculando carrito:', cart);
    
    const validCart = this.validateCartStructure(cart);
    const items = validCart.items || [];
    
    const totalItems = items.reduce((total, item) => {
      return total + (item?.quantity || 0);
    }, 0);
    
    const totalPrice = items.reduce((total, item) => {
      if (!item?.game?.price) return total;
      const price = item.game.discount ? 
        item.game.price * (1 - item.game.discount) : 
        item.game.price;
      return total + (price * (item.quantity || 0));
    }, 0);
    
    const recalculatedCart = {
      ...validCart,
      totalItems,
      totalPrice: Math.round(totalPrice * 100) / 100 // Redondear a 2 decimales
    };
    
    console.log('📊 Carrito recalculado:', recalculatedCart);
    return recalculatedCart;
  }

  private updateCartInBackend(cart: Cart): void {
    console.log('� INICIO updateCartInBackend con:', cart);
    console.log('�🔒 Verificando autenticación...');
    console.log('👤 Usuario logueado:', this.authService.isLoggedIn());
    console.log('🎫 Token disponible:', !!this.authService.getToken());
    
    if (!this.authService.isLoggedIn()) {
      console.log('💾 Usuario no autenticado, guardando localmente');
      console.log('🔄 Actualizando BehaviorSubject...');
      this.cartSubject.next(cart);
      console.log('💾 Guardando en localStorage...');
      localStorage.setItem('cart', JSON.stringify(cart));
      console.log('✅ Guardado local completado');
      return;
    }

    console.log('🌐 Enviando carrito al backend:', cart);
    this.http.put<any>(this.apiUrl, cart).subscribe({
      next: (response) => {
        console.log('✅ Respuesta del backend recibida:', response);
        
        // Extraer el carrito de la respuesta del backend
        const updatedCart = response.success ? response.data : response;
        console.log('📦 Carrito extraído de la respuesta:', updatedCart);
        
        console.log('🔄 Actualizando BehaviorSubject con carrito correcto...');
        this.cartSubject.next(updatedCart);
        console.log('💾 Guardando carrito correcto en localStorage...');
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        console.log('✅ Backend update completado');
      },
      error: (error) => {
        console.error('❌ Error al actualizar el carrito:', error)
        console.error('📊 Status:', error.status);
        console.error('📝 Message:', error.message);
        console.error('🔍 Error completo:', error);
        // Si hay error, mantener la versión local
        console.log('🔄 Fallback: guardando localmente debido a error');
        this.cartSubject.next(cart)
        localStorage.setItem('cart', JSON.stringify(cart))
      }
    })
  }

  getCart(): Observable<Cart> {
    return this.cart$
  }

  addToCart(game: Game, quantity = 1): void {
    console.log('🛒 Agregando al carrito:', game.title, 'Cantidad:', quantity);
    
    try {
      const currentCart = this.cartSubject.value;
      const validCart = this.validateCartStructure(currentCart);
      const existingItemIndex = validCart.items.findIndex((item) => item.game?.id === game.id);

      let updatedCart: Cart

      if (existingItemIndex !== -1) {
        console.log('🔄 Actualizando cantidad de producto existente');
        const updatedItems = [...validCart.items]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        }
        updatedCart = { ...validCart, items: updatedItems }
      } else {
        console.log('➕ Agregando nuevo producto al carrito');
        updatedCart = {
          ...validCart,
          items: [...validCart.items, { game, quantity }],
        }
      }

      const finalCart = this.recalculateCart(updatedCart)
      console.log('📊 Carrito actualizado:', finalCart.totalItems, 'items, $' + finalCart.totalPrice);
      this.updateCartInBackend(finalCart)
    } catch (error) {
      console.error('❌ Error en addToCart:', error);
      throw error;
    }
  }

  updateQuantity(gameId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(gameId)
      return
    }

    const currentCart = this.cartSubject.value
    const existingItemIndex = currentCart.items.findIndex((item) => item.game.id === gameId)

    if (existingItemIndex !== -1) {
      const updatedItems = [...currentCart.items]
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity,
      }

      const updatedCart = {
        ...currentCart,
        items: updatedItems,
      }

      const finalCart = this.recalculateCart(updatedCart)
      this.updateCartInBackend(finalCart)
    }
  }

  removeFromCart(gameId: number): void {
    const currentCart = this.cartSubject.value
    const updatedItems = currentCart.items.filter((item) => item.game.id !== gameId)
    const updatedCart = {
      ...currentCart,
      items: updatedItems,
    }

    const finalCart = this.recalculateCart(updatedCart)
    this.updateCartInBackend(finalCart)
  }

  clearCart(): void {
    console.log('🛒 Iniciando limpieza del carrito');
    console.log('🔐 Usuario logueado:', this.authService.isLoggedIn());
    console.log('🎯 Token disponible:', !!this.authService.getToken());
    
    if (!this.authService.isLoggedIn()) {
      console.log('👤 Usuario no logueado, limpiando solo localmente');
      this.cartSubject.next(this.initialCart)
      localStorage.removeItem('cart')
      return
    }

    console.log('🌐 Enviando petición DELETE a:', this.apiUrl);
    this.http.delete(this.apiUrl).subscribe({
      next: (response) => {
        console.log('✅ Carrito limpiado exitosamente en backend:', response);
        this.cartSubject.next(this.initialCart)
        localStorage.removeItem('cart')
      },
      error: (error) => {
        console.error('❌ Error al limpiar el carrito:', error)
        console.error('📊 Status:', error.status);
        console.error('📝 Message:', error.message);
        console.error('🔍 Error completo:', error);
        // Si hay error, limpiar localmente
        this.cartSubject.next(this.initialCart)
        localStorage.removeItem('cart')
      }
    })
  }
}

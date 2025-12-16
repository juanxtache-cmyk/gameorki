import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, Observable, catchError, map, tap, of } from "rxjs"
import { environment } from '../../environments/environment';
import type { User } from "../models/user.model"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = environment.apiUrl
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  // Usuarios de prueba para desarrollo
  private testUsers: User[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@gamestore.com',
      password: 'admin123',
      firstName: 'Administrador',
      lastName: 'Sistema',
      role: 'admin'
    },
    {
      id: 2,
      username: 'user',
      email: 'user@gamestore.com',
      password: 'user123',
      firstName: 'Usuario',
      lastName: 'Prueba',
      role: 'user'
    }
  ];

  constructor(private http: HttpClient) {
    // Cargar usuario del localStorage si existe
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser))
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value
  }

  public getToken(): string | null {
    return localStorage.getItem('token')
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token)
  }

  register(user: User): Observable<boolean> {
    return this.http.post<{message: string, user: User, token: string}>( 
      `${this.apiUrl}/auth/register`, 
      user,
      { 
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: false
      }
    ).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token)
          this.currentUserSubject.next(response.user)
          localStorage.setItem('currentUser', JSON.stringify(response.user))
        }
      }),
      map(response => {
        return true
      }),
      catchError(error => {
        console.error('Error en el registro:', error)
        throw error
      })
    );
  }  login(usernameOrEmail: string, password: string): Observable<User | null> {
    // Primero verificar usuarios de prueba (para desarrollo)
    const testUser = this.testUsers.find(user => 
      (user.username === usernameOrEmail || user.email === usernameOrEmail) && 
      user.password === password
    );

    if (testUser) {
      // Login exitoso con usuario de prueba
      const { password: _, ...userWithoutPassword } = testUser;
      localStorage.setItem('token', 'test-token-' + testUser.id);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      this.currentUserSubject.next(userWithoutPassword);
      return of(userWithoutPassword);
    }

    // Si no es usuario de prueba, intentar con API
    const loginData = {
      email: usernameOrEmail.includes('@') ? usernameOrEmail : undefined,
      username: !usernameOrEmail.includes('@') ? usernameOrEmail : undefined,
      password
    };

    return this.http.post<{message: string, user: User, token: string}>(
      `${this.apiUrl}/auth/login`, 
      loginData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    ).pipe(
      tap(response => {
        if (response.user && response.token) {
          localStorage.setItem('token', response.token);
          const { password, ...userWithoutPassword } = response.user;
          localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
          this.currentUserSubject.next(userWithoutPassword);
        }
      }),
      map(response => response.user),
      catchError(error => {
        console.error('Error en el login:', error);
        // Manejo más específico del error
        if (error.status === 401) {
          throw new Error('Credenciales inválidas');
        } else if (error.status === 404) {
          throw new Error('Usuario no encontrado');
        } else {
          throw new Error('Error en el servidor. Por favor, intente más tarde');
        }
      })
    );
  }  logout(): void {
    // Primero notificar el cambio de estado para que los servicios dependientes se actualicen
    this.currentUserSubject.next(null);
    
    // Luego limpiar el almacenamiento local
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    localStorage.removeItem("cart"); // Asegurarnos de limpiar también el carrito local
  }
    // Método para solicitar restablecimiento de contraseña
  forgotPassword(email: string): Observable<any> {
    return this.http.post<{message: string, token?: string}>(
      `${this.apiUrl}/auth/forgot-password`,
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    ).pipe(
      catchError(error => {
        console.error('Error en la solicitud de restablecimiento de contraseña:', error);
        throw error;
      })
    );
  }
  
  // Método para verificar código
  verifyCode(email: string, code: string): Observable<any> {
    return this.http.post<{message: string, token: string}>(
      `${this.apiUrl}/auth/verify-code`,
      { email, code },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    ).pipe(
      catchError(error => {
        console.error('Error al verificar el código:', error);
        throw error;
      })
    );
  }
  
  // Método para restablecer contraseña
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post<{message: string}>(
      `${this.apiUrl}/auth/reset-password`,
      { token, newPassword },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    ).pipe(
      catchError(error => {
        console.error('Error al restablecer la contraseña:', error);
        throw error;
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue && !!this.getToken();
  }

  isAdmin(): boolean {
    return this.currentUserValue?.role === 'admin';
  }

  hasRole(role: string): boolean {
    return this.currentUserValue?.role === role;
  }
}
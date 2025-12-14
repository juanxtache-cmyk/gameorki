import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, Observable, catchError, map, tap, of } from "rxjs"
import type { User } from "../models/user.model"
import { environment } from "src/environments/environment"

@Injectable({
  providedIn: "root",
})
export class AuthService {

  // 🔥 AQUÍ YA NO HAY LOCALHOST
  private apiUrl = `${environment.apiUrl}/api`

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
  ]

  constructor(private http: HttpClient) {
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

  // ============================
  // REGISTRO
  // ============================
  register(user: User): Observable<boolean> {
    return this.http.post<{ message: string, user: User, token: string }>(
      `${this.apiUrl}/auth/register`,
      user,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    ).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token)
          this.currentUserSubject.next(response.user)
          localStorage.setItem('currentUser', JSON.stringify(response.user))
        }
      }),
      map(() => true),
      catchError(error => {
        console.error('Error en el registro:', error)
        throw error
      })
    )
  }

  // ============================
  // LOGIN
  // ============================
  login(usernameOrEmail: string, password: string): Observable<User | null> {

    // Usuarios de prueba (solo desarrollo)
    const testUser = this.testUsers.find(user =>
      (user.username === usernameOrEmail || user.email === usernameOrEmail) &&
      user.password === password
    )

    if (testUser) {
      const { password: _, ...userWithoutPassword } = testUser
      localStorage.setItem('token', 'test-token-' + testUser.id)
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))
      this.currentUserSubject.next(userWithoutPassword)
      return of(userWithoutPassword)
    }

    const loginData = {
      email: usernameOrEmail.includes('@') ? usernameOrEmail : undefined,
      username: !usernameOrEmail.includes('@') ? usernameOrEmail : undefined,
      password
    }

    return this.http.post<{ message: string, user: User, token: string }>(
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
          localStorage.setItem('token', response.token)
          const { password, ...userWithoutPassword } = response.user
          localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))
          this.currentUserSubject.next(userWithoutPassword)
        }
      }),
      map(response => response.user),
      catchError(error => {
        console.error('Error en el login:', error)
        throw error
      })
    )
  }

  // ============================
  // LOGOUT
  // ============================
  logout(): void {
    this.currentUserSubject.next(null)
    localStorage.removeItem("currentUser")
    localStorage.removeItem("token")
    localStorage.removeItem("cart")
  }

  // ============================
  // PASSWORD RECOVERY
  // ============================
  forgotPassword(email: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/auth/forgot-password`,
      { email }
    )
  }

  verifyCode(email: string, code: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/auth/verify-code`,
      { email, code }
    )
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/auth/reset-password`,
      { token, newPassword }
    )
  }

  // ============================
  // HELPERS
  // ============================
  isLoggedIn(): boolean {
    return !!this.currentUserValue && !!this.getToken()
  }

  isAdmin(): boolean {
    return this.currentUserValue?.role === 'admin'
  }

  hasRole(role: string): boolean {
    return this.currentUserValue?.role === role
  }
}

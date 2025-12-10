import type { Routes } from "@angular/router"
import { HomeComponent } from "./components/home.component"
import { GamesComponent } from "./components/games.component"
import { GameDetailComponent } from "./components/game-detail.component"
import { CartComponent } from "./components/cart.component"
import { CheckoutComponent } from "./components/checkout.component"
import { PurchaseHistoryComponent } from "./components/purchase-history.component"
import { LoginComponent } from "./components/login.component"
import { RegisterComponent } from "./components/register.component"
import { ForgotPasswordComponent } from "./components/forgot-password.component"
import { ResetPasswordComponent } from "./components/reset-password.component"
import { VerifyCodeComponent } from "./components/verify-code.component"
import { AdminPanelComponent } from "./components/admin-panel.component"
import { UiDemoComponent } from "./components/ui-demo.component"
import { SettingsComponent } from "./components/settings.component"
import { TypographyComponent } from "./components/typography/typography.component"

export const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "games", component: GamesComponent },
  { path: "games/:id", component: GameDetailComponent },
  { path: "cart", component: CartComponent },
  { path: "checkout", component: CheckoutComponent },
  { path: "purchase-history", component: PurchaseHistoryComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "forgot-password", component: ForgotPasswordComponent },
  { path: "verify-code", component: VerifyCodeComponent },
  { path: "reset-password/:token", component: ResetPasswordComponent },
  { path: "reset-password", component: ResetPasswordComponent }, // Ruta alternativa para pasar token por query params
  { path: "admin", component: AdminPanelComponent },
  { path: "ui-demo", component: UiDemoComponent }, // Nueva ruta para el demo
  // { path: "**", redirectTo: "/home" }, // Ruta para manejar rutas no encontradas
  { path: "settings", component: SettingsComponent },
  { path: "typography", component: TypographyComponent }
]

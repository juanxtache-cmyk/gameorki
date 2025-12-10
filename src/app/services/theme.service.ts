import { Injectable, Renderer2, RendererFactory2 } from "@angular/core"
import { BehaviorSubject } from "rxjs"

export type Theme = "retro" | "dark" | "grayscale"

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private renderer: Renderer2
  private currentThemeSubject = new BehaviorSubject<Theme>(this.getInitialTheme())
  public currentTheme$ = this.currentThemeSubject.asObservable()

  constructor(rendererFactory: RendererFactory2) {
    console.log("ThemeService: Constructor iniciado")
    this.renderer = rendererFactory.createRenderer(null, null)
    this.initTheme()
    console.log("ThemeService: Constructor completado")
  }

  private getInitialTheme(): Theme {
    console.log("ThemeService: Obteniendo tema inicial")
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme && (savedTheme === 'retro' || savedTheme === 'dark' || savedTheme === 'grayscale')) {
      console.log(`ThemeService: Tema encontrado en localStorage: ${savedTheme}`)
      return savedTheme
    }

    console.log("ThemeService: No hay tema guardado, usando tema por defecto")
    return "dark"
  }

  private initTheme(): void {
    console.log("ThemeService: Inicializando tema")
    const theme = this.currentThemeSubject.value
    console.log(`ThemeService: Tema actual: ${theme}`)
    this.setTheme(theme)
    
    // Listener para refrescar tema al volver a la ventana
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        console.log('ThemeService: Ventana visible, replicando tema')
        setTimeout(() => this.setTheme(this.currentThemeSubject.value), 100)
      }
    })
    
    // Listener para refrescar tema al hacer focus en la ventana
    window.addEventListener('focus', () => {
      console.log('ThemeService: Ventana en focus, replicando tema')
      setTimeout(() => this.setTheme(this.currentThemeSubject.value), 100)
    })
  }

  setTheme(theme: Theme): void {
    console.log(`ThemeService: Estableciendo tema: ${theme}`)
    this.currentThemeSubject.next(theme)
    localStorage.setItem("theme", theme)
    console.log(`ThemeService: Tema guardado en localStorage: ${theme}`)

    const html = document.querySelector("html")
    const body = document.body

    if (html && body) {
      console.log(`ThemeService: Aplicando clase de tema a HTML y BODY: ${theme}`)

      // Remover todas las clases de tema existentes
      html.classList.remove("light-theme", "dark-theme", "retro-theme", "grayscale-theme")
      body.classList.remove("light-theme", "dark-theme", "retro-theme", "grayscale-theme")

      // Limpiar estilos inline previos y filtros
      html.removeAttribute('style')
      body.removeAttribute('style')
      html.style.filter = ''
      body.style.filter = ''

      // Aplicar el tema seleccionado
      const themeClass = `${theme}-theme`
      html.classList.add(themeClass)
      body.classList.add(themeClass)

      // Aplicar colores de fondo directamente para asegurar consistencia
      if (theme === "dark") {
       body.style.setProperty('background-color', '#121212', 'important')
        body.style.setProperty('color', '#f5f5f7', 'important')
        console.log("ThemeService: Tema dark aplicado")
      } else if (theme === "retro") {
       body.style.setProperty('background-color', '#220033', 'important')
        body.style.setProperty('color', '#00ff99', 'important')
        console.log("ThemeService: Tema retro aplicado")
      } else if (theme === "grayscale") {
        body.style.setProperty('background-color', '#2a2a2a', 'important')
        body.style.setProperty('color', '#e0e0e0', 'important')
        // Aplicar filtro de escala de grises a toda la interfaz
        html.style.setProperty('filter', 'grayscale(100%)', 'important')
        console.log("ThemeService: Tema grayscale aplicado con filtro global")
      }

      // Forzar re-renderizado
      body.style.display = 'none'
      body.offsetHeight // Trigger reflow
      body.style.display = ''
      
    } else {
      console.error("ThemeService: No se pudo encontrar el elemento HTML o BODY")
    }

    if (html) {
      console.log(`ThemeService: Clases actuales en HTML: ${html.className}`)
    }
    if (body) {
      console.log(`ThemeService: Clases actuales en BODY: ${body.className}`)
    }

    // Aplicar estilos específicos con retraso para asegurar que se apliquen
    setTimeout(() => this.applySpecificStyles(theme), 50)
  }

  // Método para alternar entre temas - ya no se usa, reemplazado por setTheme directo
  toggleTheme(): void {
    const currentTheme = this.currentThemeSubject.value
    console.log(`ThemeService: Alternando tema. Tema actual: ${currentTheme}`)
    let newTheme: Theme;
    
    // Ciclar entre los tres temas
    switch (currentTheme) {
      case "retro":
        newTheme = "dark"
        break
      case "dark":
        newTheme = "grayscale"
        break
      case "grayscale":
        newTheme = "retro"
        break
      default:
        newTheme = "dark"
        break
    }
    
    console.log(`ThemeService: Cambiando a tema: ${newTheme}`)
    this.setTheme(newTheme)
  }

  private applySpecificStyles(theme: Theme): void {
    console.log("ThemeService: Aplicando estilos específicos a componentes clave")

    // Definir los colores para cada tema
    let themeColors: any = {}
    
    if (theme === "retro") {
      themeColors = {
        headerBg: "#220033",
        headerText: "#00ffaa",
        cardBg: "#440066",
        cardText: "#00ff99",
        cardBorder: "#ff00ff",
        inputBg: "#220044",
        inputText: "#00ff99",
        inputBorder: "#00ffaa",
        bodyBg: "#220033"
      }
    } else if (theme === "dark") {
      themeColors = {
        headerBg: "#121212",
        headerText: "#ffffff",
        cardBg: "#1e1e1e",
        cardText: "#f5f5f7",
        cardBorder: "#00ff00",
        inputBg: "#2d2d2d",
        inputText: "#f5f5f7",
        inputBorder: "#444444",
        bodyBg: "#121212"
      }
    } else if (theme === "grayscale") {
      themeColors = {
        headerBg: "#1a1a1a",
        headerText: "#f0f0f0",
        cardBg: "#333333",
        cardText: "#e0e0e0",
        cardBorder: "#666666",
        inputBg: "#404040",
        inputText: "#f0f0f0",
        inputBorder: "#777777"
      }
    }

    // Aplicar fondo consistente al body y elementos principales
    const body = document.body
    const html = document.querySelector("html")
    const main = document.querySelector("main")
    
    if (body) {
      body.style.setProperty('background-color', themeColors.bodyBg, 'important')
    }
    if (html) {
      html.style.setProperty('background-color', themeColors.bodyBg, 'important')
    }
    if (main) {
      main.style.setProperty('background-color', themeColors.bodyBg, 'important')
    }

    // Aplicar estilos al header
    const header = document.querySelector("header")
    if (header) {
      header.style.setProperty('background-color', themeColors.headerBg, 'important')
      header.style.setProperty('color', themeColors.headerText, 'important')
    }

    // Aplicar estilos al footer
    const footer = document.querySelector("footer")
    if (footer) {
      footer.style.setProperty('background-color', themeColors.headerBg, 'important')
      footer.style.setProperty('color', themeColors.headerText, 'important')
    }

    // Aplicar estilos a las tarjetas de juegos
    const gameCards = document.querySelectorAll(".game-card")
    gameCards.forEach((card: any) => {
      card.style.setProperty('background-color', themeColors.cardBg, 'important')
      card.style.setProperty('color', themeColors.cardText, 'important')
      card.style.setProperty('box-shadow', `0 0 0 4px ${themeColors.cardBorder}`, 'important')
    })

    // Aplicar estilos a los inputs
    const inputs = document.querySelectorAll("input, select, textarea")
    inputs.forEach((input: any) => {
      input.style.setProperty('background-color', themeColors.inputBg, 'important')
      input.style.setProperty('color', themeColors.inputText, 'important')
      input.style.setProperty('border-color', themeColors.inputBorder, 'important')
    })

    // Aplicar estilos a botones
    const buttons = document.querySelectorAll("button:not(.theme-selector-btn):not(.theme-option)")
    buttons.forEach((button: any) => {
      if (!button.classList.contains('btn-register') && !button.classList.contains('btn-login')) {
        button.style.setProperty('background-color', themeColors.cardBg, 'important')
        button.style.setProperty('color', themeColors.cardText, 'important')
        button.style.setProperty('border-color', themeColors.cardBorder, 'important')
      }
    })

    this.applyTextStyles(theme)
  }

  private applyTextStyles(theme: Theme): void {
    console.log("ThemeService: Aplicando estilos a textos y títulos")

    // Definir colores para cada tema
    let textColors: any = {}
    
    if (theme === "dark") {
      textColors = {
        primary: "#f5f5f7",
        secondary: "#b0b0b0",
        link: "#ff6b8b",
        heading: "#ffffff"
      }
    } else if (theme === "retro") {
      textColors = {
        primary: "#00ff99",
        secondary: "#ff00ff", 
        link: "#ff00ff",
        heading: "#00ffaa"
      }
    } else if (theme === "grayscale") {
      textColors = {
        primary: "#e0e0e0",
        secondary: "#b0b0b0",
        link: "#cccccc",
        heading: "#f0f0f0"
      }
    }

    // Aplicar estilos a párrafos
    const paragraphs = document.querySelectorAll("p")
    paragraphs.forEach((p: any) => {
      p.style.setProperty('color', textColors.secondary, 'important')
    })

    // Aplicar estilos a títulos
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
    headings.forEach((heading: any) => {
      heading.style.setProperty('color', textColors.heading, 'important')
    })

    // Aplicar estilos a links que no sean botones
    const links = document.querySelectorAll("a:not(.btn):not(.btn-login):not(.btn-register)")
    links.forEach((link: any) => {
      if (!link.closest('.nav-list')) {
        link.style.setProperty('color', textColors.link, 'important')
      }
    })

    // Aplicar estilos a spans
    const spans = document.querySelectorAll("span")
    spans.forEach((span: any) => {
      if (!span.closest("button") && !span.classList.contains("cart-count")) {
        span.style.setProperty('color', textColors.secondary, 'important')
      }
    })

    // Estilos específicos para elementos de juegos
    const gameElements = [
      ".game-category",
      ".game-description p", 
      ".meta-label",
      ".detail-label"
    ]
    
    gameElements.forEach(selector => {
      const elements = document.querySelectorAll(selector)
      elements.forEach((element: any) => {
        element.style.setProperty('color', textColors.secondary, 'important')
      })
    })

    // Estilos para títulos de juegos y secciones
    const titleElements = [
      ".game-title a",
      ".section-header h2",
      ".game-details h2"
    ]
    
    titleElements.forEach(selector => {
      const elements = document.querySelectorAll(selector)
      elements.forEach((element: any) => {
        element.style.setProperty('color', textColors.heading, 'important')
      })
    })
  }

  logCurrentState(): void {
    const html = document.querySelector("html")
    const body = document.body
    const currentTheme = this.currentThemeSubject.value
    const localStorageTheme = localStorage.getItem("theme")
    const htmlClasses = html ? html.className : "No se pudo acceder a HTML"
    const bodyClasses = body ? body.className : "No se pudo acceder a BODY"
    const bodyStyles = body ? body.style.cssText : "No se pudo acceder a BODY"

    console.group("Estado actual del tema")
    console.log(`Tema en servicio: ${currentTheme}`)
    console.log(`Tema en localStorage: ${localStorageTheme}`)
    console.log(`Clases en HTML: ${htmlClasses}`)
    console.log(`Clases en BODY: ${bodyClasses}`)
    console.log(`Estilos en BODY: ${bodyStyles}`)
    console.groupEnd()
  }
}

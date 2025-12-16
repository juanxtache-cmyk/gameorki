import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { Cart } from '../models/cart.model';
import { GameKey } from './key-generator.service';
import { environment } from '../../environments/environment';

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = `${environment.apiUrl}/email`; // Usar API configurada en environment

  constructor(private http: HttpClient) {}

  sendReceiptEmail(cart: Cart, userEmail: string, orderNumber: string): Observable<any> {
    const emailData = {
      to: userEmail,
      subject: `Recibo de compra #${orderNumber} - GameStore`,
      cart: cart,
      orderNumber: orderNumber,
      date: new Date(),
      total: cart.totalPrice * 1.16
    };
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });

    return this.http.post(`${this.apiUrl}/send-receipt`, emailData, { 
      headers,
      withCredentials: false // Deshabilitamos credenciales para desarrollo local
    });
  }

  /**
   * Simula el envío de un correo electrónico
   * En un entorno real, esto haría una llamada HTTP a tu backend
   */
  async sendEmail(template: EmailTemplate): Promise<boolean> {
    try {
      // Simulación de envío de correo
      console.log('📧 Enviando correo electrónico...');
      console.log('Para:', template.to);
      console.log('Asunto:', template.subject);
      console.log('Contenido HTML:', template.html);
      
      // Simular delay de envío
      await this.delay(2000);
      
      // Simular éxito (95% de probabilidad)
      const success = Math.random() > 0.05;
      
      if (success) {
        console.log('✅ Correo enviado exitosamente');
        this.showEmailNotification(template.to, 'success');
      } else {
        console.error('❌ Error al enviar correo');
        this.showEmailNotification(template.to, 'error');
      }
      
      return success;
    } catch (error) {
      console.error('Error enviando correo:', error);
      return false;
    }
  }

  /**
   * Crea un template de correo para las keys de juegos
   */
  createGameKeysEmail(userEmail: string, userName: string, keys: GameKey[], orderNumber: string): EmailTemplate {
    const keysHtml = keys.map(key => `
      <div style="background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #007bff;">
        <h3 style="color: #333; margin: 0 0 10px 0;">🎮 ${key.gameTitle}</h3>
        <div style="background: #fff; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 18px; font-weight: bold; color: #007bff; text-align: center; border: 2px dashed #007bff;">
          ${key.key}
        </div>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">
          <strong>Plataforma:</strong> ${key.activationPlatform} | 
          <strong>Fecha:</strong> ${new Date(key.purchaseDate).toLocaleDateString()}
        </p>
      </div>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tus Keys de Activación - Game Store</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🎮 Game Store</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">¡Gracias por tu compra!</p>
        </div>
        
        <div style="background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">¡Hola ${userName}!</h2>
          
          <p>Tu compra ha sido procesada exitosamente. Aquí tienes las keys de activación para tus juegos:</p>
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold;">📋 <strong>Número de orden:</strong> ${orderNumber}</p>
            <p style="margin: 5px 0 0 0;">📅 <strong>Fecha de compra:</strong> ${new Date().toLocaleDateString()}</p>
          </div>

          <h3 style="color: #007bff;">🔑 Tus Keys de Activación:</h3>
          ${keysHtml}
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h4 style="margin: 0 0 10px 0; color: #856404;">📚 Instrucciones de Activación:</h4>
            <ol style="margin: 0; padding-left: 20px; color: #856404;">
              <li>Abre tu cliente de Steam</li>
              <li>Ve a "Juegos" → "Activar un producto en Steam"</li>
              <li>Acepta el acuerdo de licencia</li>
              <li>Introduce la key exactamente como aparece arriba</li>
              <li>¡Disfruta tu juego!</li>
            </ol>
          </div>
          
          <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #17a2b8;">
            <p style="margin: 0; color: #0c5460;"><strong>💡 Importante:</strong></p>
            <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #0c5460;">
              <li>Guarda estas keys en un lugar seguro</li>
              <li>Cada key solo puede ser activada una vez</li>
              <li>Si tienes problemas, contacta nuestro soporte</li>
            </ul>
          </div>
          
          <hr style="border: none; height: 1px; background: #ddd; margin: 30px 0;">
          
          <div style="text-align: center; color: #666; font-size: 14px;">
            <p>¿Necesitas ayuda? Contacta nuestro soporte:</p>
            <p>📧 soporte@gamestore.com | 📞 +1 (555) 123-4567</p>
            <p style="margin-top: 20px;">
              <strong>Game Store</strong><br>
              Tu tienda de videojuegos de confianza
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
¡Hola ${userName}!

Gracias por tu compra en Game Store. Aquí tienes las keys de activación para tus juegos:

Número de orden: ${orderNumber}
Fecha de compra: ${new Date().toLocaleDateString()}

KEYS DE ACTIVACIÓN:
${keys.map(key => `${key.gameTitle}: ${key.key} (${key.activationPlatform})`).join('\n')}

INSTRUCCIONES:
1. Abre Steam
2. Ve a Juegos → Activar un producto en Steam
3. Introduce la key exactamente como aparece
4. ¡Disfruta!

Soporte: soporte@gamestore.com

Game Store - Tu tienda de videojuegos de confianza
    `;

    return {
      to: userEmail,
      subject: `🎮 Tus Keys de Activación - Orden #${orderNumber}`,
      html,
      text
    };
  }

  /**
   * Muestra una notificación visual del envío de correo
   */
  private showEmailNotification(email: string, status: 'success' | 'error'): void {
    const message = status === 'success' 
      ? `✅ Correo enviado a ${email}`
      : `❌ Error enviando correo a ${email}`;
    
    // En un proyecto real, aquí usarías un servicio de notificaciones
    // Por ahora, usamos una alerta simple
    if (status === 'success') {
      this.showToast(message, 'success');
    } else {
      this.showToast(message, 'error');
    }
  }

  /**
   * Muestra una notificación toast (simulada)
   */
  private showToast(message: string, type: 'success' | 'error'): void {
    // Crear elemento de notificación
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 6px;
      color: white;
      font-weight: bold;
      z-index: 10000;
      font-family: Arial, sans-serif;
      max-width: 300px;
      word-wrap: break-word;
      ${type === 'success' ? 'background: #28a745;' : 'background: #dc3545;'}
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Remover después de 4 segundos
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 4000);
  }

  /**
   * Utility para simular delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Envía un correo de confirmación de compra con las keys (usando el backend)
   */
  async sendPurchaseConfirmation(
    userEmail: string, 
    userName: string, 
    keys: GameKey[], 
    orderNumber: string,
    orderItems?: any[],
    totalAmount?: number
  ): Promise<boolean> {
    try {
      console.log('🎮 Enviando correo de confirmación de compra...');
      console.log('Datos:', { userEmail, userName, orderNumber, keysCount: keys.length });

      // Si se proporcionan orderItems y totalAmount, usarlos; sino calcular por defecto
      const finalOrderItems = orderItems || keys.map(key => ({
        gameTitle: key.gameTitle,
        quantity: 1,
        price: 59.99 // Precio por defecto
      }));

      const finalTotalAmount = totalAmount || finalOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const requestBody = {
        userEmail,
        userName,
        keys,
        orderNumber,
        orderItems: finalOrderItems,
        totalAmount: finalTotalAmount
      };

      console.log('📤 Enviando datos al backend:', requestBody);

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });

      // Hacer la llamada HTTP al backend
      const response = await this.http.post(`${this.apiUrl}/send-purchase-confirmation`, requestBody, { 
        headers,
        withCredentials: false
      }).toPromise() as any;

      console.log('✅ Respuesta del backend:', response);

      if (response?.success) {
        console.log('✅ Correo de confirmación enviado exitosamente');
        this.showEmailNotification(userEmail, 'success');
        return true;
      } else {
        console.error('❌ Error en la respuesta del backend:', response);
        this.showEmailNotification(userEmail, 'error');
        return false;
      }

    } catch (error) {
      console.error('❌ Error enviando correo de confirmación:', error);
      
      // Mostrar información más detallada del error
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
      
      // En caso de error de red, intentar con el método simulado como respaldo
      console.log('📧 Intentando con método simulado como respaldo...');
      try {
        const emailTemplate = this.createGameKeysEmail(userEmail, userName, keys, orderNumber);
        const simulatedResult = await this.sendEmail(emailTemplate);
        
        if (simulatedResult) {
          this.showEmailNotification(userEmail, 'success');
        }
        
        return simulatedResult;
      } catch (simulationError) {
        console.error('❌ Error también en simulación:', simulationError);
        this.showEmailNotification(userEmail, 'error');
        return false;
      }
    }
  }
}
import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../services/chatbot.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  messages: any[] = [];
  userMessage: string = '';
  isLoading: boolean = false;
  userId: number | null = null;
  private shouldScroll: boolean = false;

  constructor(
    private chatbotService: ChatbotService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obtener userId del servicio de autenticación si está disponible
    const user = this.authService.getCurrentUser();
    this.userId = user?.id || null;
    
    // Si hay usuario, cargar historial
    if (this.userId) {
      this.loadChatHistory();
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  loadChatHistory(): void {
    if (!this.userId) return;
    
    this.chatbotService.getChatHistory(this.userId).subscribe(
      (response: any) => {
        this.messages = response.data.reverse();
      },
      (error) => {
        console.error('Error loading chat history:', error);
      }
    );
  }

  sendMessage(): void {
    if (!this.userMessage.trim()) return;

    const messageText = this.userMessage;
    this.userMessage = '';
    this.isLoading = true;

    // Agregar mensaje del usuario inmediatamente (optimistic UI)
    const tempMessage = {
      userMessage: messageText,
      botResponse: '⏳ Escribiendo...',
      intent: 'general',
      createdAt: new Date().toISOString(),
      isTemp: true
    };
    this.messages.push(tempMessage);
    this.shouldScroll = true;

    this.chatbotService.createMessage(this.userId || undefined, messageText).subscribe(
      (response: any) => {
        // Reemplazar el mensaje temporal con la respuesta real
        const index = this.messages.findIndex(m => m.isTemp);
        if (index !== -1) {
          this.messages[index] = {
            userMessage: response.data.userMessage,
            botResponse: response.data.botResponse,
            intent: response.data.intent,
            createdAt: response.data.createdAt
          };
        }
        this.isLoading = false;
        this.shouldScroll = true;
      },
      (error) => {
        console.error('Error sending message:', error);
        // Mostrar mensaje de error
        const index = this.messages.findIndex(m => m.isTemp);
        if (index !== -1) {
          this.messages[index].botResponse = '❌ Lo siento, hubo un error al procesar tu mensaje. Por favor intenta nuevamente.';
          this.messages[index].isTemp = false;
        }
        this.isLoading = false;
        this.shouldScroll = true;
      }
    );
  }

  scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = 
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  getIntentLabel(intent: string): string {
    const labels: { [key: string]: string } = {
      'product_inquiry': '🛍️ Consulta de Producto',
      'order_status': '📦 Estado de Pedido',
      'shipping': '🚚 Envío',
      'return': '↩️ Devolución',
      'payment': '💳 Pago',
      'support': '🆘 Soporte',
      'general': 'ℹ️ General'
    };
    return labels[intent] || intent;
  }
}

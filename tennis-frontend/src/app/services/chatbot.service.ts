import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = `${environment.API_URL}/api/chatbot`;

  constructor(private http: HttpClient) {}

  createMessage(userId: number | undefined, userMessage: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/message`, {
      userId: userId || null,
      userMessage
    });
  }

  getChatHistory(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/history/${userId}`, {
      headers: this.getHeaders()
    });
  }

  getAllMessages(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`, {
      headers: this.getHeaders()
    });
  }

  getChatStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`, {
      headers: this.getHeaders()
    });
  }

  markAsResolved(chatId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${chatId}/resolve`, {}, {
      headers: this.getHeaders()
    });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}

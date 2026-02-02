import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = `${environment.API_URL}/api/reservations`;

  constructor(private http: HttpClient) {}

  createReservation(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, {
      headers: this.getHeaders()
    });
  }

  getUserReservations(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`, {
      headers: this.getHeaders()
    });
  }

  getAllReservations(params?: any): Observable<any> {
    return this.http.get(this.apiUrl, {
      headers: this.getHeaders(),
      params
    });
  }

  getReservationById(reservationId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${reservationId}`, {
      headers: this.getHeaders()
    });
  }

  updateReservationStatus(reservationId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${reservationId}`, data, {
      headers: this.getHeaders()
    });
  }

  cancelReservation(reservationId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${reservationId}`, {
      headers: this.getHeaders()
    });
  }

  getReservationStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`, {
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

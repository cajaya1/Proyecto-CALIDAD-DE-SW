import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  username: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface ProductRating {
  average: number;
  count: number;
}

export interface ProductReviewsResponse {
  reviews: Review[];
  rating: ProductRating;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.API_URL}/api/reviews`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  /**
   * Obtener todas las reviews de un producto
   */
  getProductReviews(productId: number): Observable<ProductReviewsResponse> {
    return this.http.get<ProductReviewsResponse>(`${this.apiUrl}/product/${productId}`);
  }

  /**
   * Obtener las reviews de un usuario
   */
  getUserReviews(userId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/user/${userId}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Crear una nueva review
   */
  createReview(productId: number, rating: number, comment: string): Observable<any> {
    return this.http.post(
      this.apiUrl,
      { productId, rating, comment },
      { headers: this.getHeaders() }
    );
  }

  /**
   * Actualizar una review existente
   */
  updateReview(reviewId: number, rating: number, comment: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${reviewId}`,
      { rating, comment },
      { headers: this.getHeaders() }
    );
  }

  /**
   * Eliminar una review
   */
  deleteReview(reviewId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${reviewId}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Obtener estadísticas de reviews (solo admin)
   */
  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`, {
      headers: this.getHeaders()
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { ReviewService, ProductRating } from '../services/review.service';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container">
      <h1 class="my-4">Catálogo de Tenis Deportivos</h1>
      
      <div class="row" *ngIf="products.length > 0">
        <div class="col-md-4 mb-4" *ngFor="let product of products">
          <div class="card h-100">
            <img [src]="getImageUrl(product.image)" 
                 class="card-img-top" 
                 [alt]="product.name"
                 loading="lazy"
                 (error)="onImageError($event)"
                 style="width: 100%; height: 250px; object-fit: contain; background-color: #f8f9fa;">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{{ product.name }}</h5>
              <p class="card-text flex-grow-1">{{ product.description }}</p>
              
              <!-- Rating -->
              <div class="mb-2" *ngIf="productRatings[product.id]">
                <div class="d-flex align-items-center">
                  <span class="text-warning me-2">
                    <span *ngFor="let star of [1,2,3,4,5]">
                      {{ productRatings[product.id].average >= star ? '★' : '☆' }}
                    </span>
                  </span>
                  <small class="text-muted">
                    {{ productRatings[product.id].average.toFixed(1) }} 
                    ({{ productRatings[product.id].count }} {{ productRatings[product.id].count === 1 ? 'reseña' : 'reseñas' }})
                  </small>
                </div>
              </div>
              
              <p class="card-text"><strong>\${{ (+product.price).toFixed(2) }}</strong></p>
              <div class="mt-auto">
                <a [routerLink]="['/product-detail', product.id]" class="btn btn-primary me-2">Ver Detalles</a>
                <button 
                  class="btn btn-success" 
                  (click)="addToCart(product.id)"
                  [disabled]="!isLoggedIn() || isAddingToCart"
                >
                  {{ isAddingToCart ? 'Agregando...' : 'Agregar al Carrito' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center my-5" *ngIf="products.length === 0 && !loading">
        <h3>No hay productos disponibles</h3>
        <p>Por favor, intenta más tarde.</p>
      </div>

      <div class="text-center my-5" *ngIf="loading">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-2">Cargando productos...</p>
      </div>

    </div>
  `,
  styles: []
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  isAddingToCart = false;
  productRatings: { [key: number]: ProductRating } = {};

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
        // Cargar ratings de cada producto
        this.loadProductRatings();
      },
      error: (error) => {
        this.loading = false;
      }
    });
  }

  loadProductRatings() {
    this.products.forEach(product => {
      this.reviewService.getProductReviews(product.id).subscribe({
        next: (response) => {
          this.productRatings[product.id] = response.rating;
        },
        error: (error) => {
          console.error(`Error cargando rating para producto ${product.id}:`, error);
        }
      });
    });
  }

  addToCart(productId: number) {
    if (!this.isLoggedIn()) {
      this.notificationService.showWarning(
        'Para agregar productos al carrito necesitas iniciar sesión',
        '🔐 Sesión Requerida'
      );
      return;
    }

    // Encontrar el producto para mostrar su nombre
    const product = this.products.find(p => p.id === productId);
    
    this.isAddingToCart = true;
    this.cartService.addToCart(productId, 1).subscribe({
      next: () => {
        this.notificationService.productAddedToCart(product?.name || 'Producto');
        this.isAddingToCart = false;
      },
      error: (error) => {
        
        if (error.status === 0) {
          this.notificationService.networkError();
        } else {
          this.notificationService.showError(
            'No pudimos agregar el producto al carrito. Intenta nuevamente.',
            '❌ Error al Agregar'
          );
        }
        
        this.isAddingToCart = false;
      }
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  onImageError(event: any): void {
    // Fallback to placeholder for broken images
    event.target.src = 'https://via.placeholder.com/300x250/e9ecef/6c757d?text=Imagen+No+Disponible';
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return 'https://via.placeholder.com/300x250/e9ecef/6c757d?text=Sin+Imagen';
    
    // Si la imagen ya es una URL completa, devolverla tal como está
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Si empieza con slash, agregar solo el dominio
    if (imagePath.startsWith('/')) {
      return `${environment.API_URL}${imagePath}`;
    }
    
    // Limpiar path y construir URL
    const cleanPath = imagePath.replace('../', '');
    if (cleanPath.startsWith('assets/')) {
      return cleanPath;
    }
    
    return `${environment.API_URL}/${cleanPath}`;
  }
}

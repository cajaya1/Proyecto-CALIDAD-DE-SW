import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { ReviewService, Review, ProductRating } from '../services/review.service';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container mt-4">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a routerLink="/">Inicio</a></li>
          <li class="breadcrumb-item"><a routerLink="/products">Productos</a></li>
          <li class="breadcrumb-item active" *ngIf="product">{{ product.name }}</li>
        </ol>
      </nav>

      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando producto...</span>
        </div>
      </div>

      <div *ngIf="!loading && !product" class="text-center py-5">
        <h3>Producto no encontrado</h3>
        <p class="text-muted">El producto que buscas no existe o ha sido eliminado.</p>
        <a routerLink="/products" class="btn btn-primary">Volver a Productos</a>
      </div>

      <div *ngIf="product" class="row">
        <div class="col-md-6">
          <div class="text-center">
            <img [src]="getImageUrl(product.image)" 
                 [alt]="product.name" 
                 class="img-fluid rounded shadow"
                 style="max-height: 400px; object-fit: contain;">
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h1 class="card-title">{{ product.name }}</h1>
              <p class="card-text">{{ product.description }}</p>
              
              <div class="mb-4">
                <span class="h2 text-success">\${{ (+product.price).toFixed(2) }}</span>
              </div>

              <div class="mb-3">
                <div class="row">
                  <div class="col-6">
                    <label for="quantity" class="form-label">Cantidad:</label>
                    <select class="form-select" id="quantity" [(ngModel)]="selectedQuantity">
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="d-grid gap-2">
                <button 
                  class="btn btn-success btn-lg" 
                  (click)="addToCart()"
                  [disabled]="!isLoggedIn() || isAddingToCart"
                >
                  {{ isAddingToCart ? 'Agregando...' : 'Agregar al Carrito' }}
                </button>
                
                <button class="btn btn-outline-primary" (click)="goBack()">
                  Volver a Productos
                </button>
              </div>

              <div class="alert alert-warning mt-3" *ngIf="!isLoggedIn()">
                <strong>¡Importante!</strong> Debes <a routerLink="/login" class="alert-link">iniciar sesión</a> para agregar productos al carrito.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección de características del producto -->
      <div *ngIf="product" class="row mt-5">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h4>Características del Producto</h4>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <ul class="list-unstyled">
                    <li><strong>✓</strong> Materiales de alta calidad</li>
                    <li><strong>✓</strong> Diseño ergonómico</li>
                    <li><strong>✓</strong> Suela antideslizante</li>
                    <li><strong>✓</strong> Transpirable</li>
                  </ul>
                </div>
                <div class="col-md-6">
                  <ul class="list-unstyled">
                    <li><strong>✓</strong> Garantía de calidad</li>
                    <li><strong>✓</strong> Envío gratis</li>
                    <li><strong>✓</strong> Devoluciones fáciles</li>
                    <li><strong>✓</strong> Soporte técnico</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección de Reseñas -->
      <div *ngIf="product" class="row mt-5">
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <div>
                <h4 class="mb-1">Reseñas de Clientes</h4>
                <div *ngIf="productRating" class="d-flex align-items-center">
                  <span class="text-warning h5 me-2">
                    <span *ngFor="let star of [1,2,3,4,5]">
                      {{ productRating.average >= star ? '★' : (productRating.average >= star - 0.5 ? '⯨' : '☆') }}
                    </span>
                  </span>
                  <span class="text-muted">
                    {{ productRating.average.toFixed(1) }} de 5 
                    ({{ productRating.count }} {{ productRating.count === 1 ? 'reseña' : 'reseñas' }})
                  </span>
                </div>
              </div>
              <button 
                *ngIf="isLoggedIn()" 
                class="btn btn-primary"
                (click)="showReviewForm = !showReviewForm"
              >
                {{ showReviewForm ? 'Cancelar' : 'Escribir Reseña' }}
              </button>
            </div>
            <div class="card-body">
              <!-- Formulario para nueva reseña -->
              <div *ngIf="showReviewForm && isLoggedIn()" class="mb-4 p-3 border rounded bg-light">
                <h5>Deja tu reseña</h5>
                <form (ngSubmit)="submitReview()">
                  <div class="mb-3">
                    <label class="form-label">Calificación</label>
                    <div class="btn-group d-block" role="group">
                      <button 
                        *ngFor="let star of [1,2,3,4,5]" 
                        type="button"
                        class="btn btn-outline-warning"
                        [class.active]="newReview.rating >= star"
                        (click)="newReview.rating = star"
                      >
                        {{ newReview.rating >= star ? '★' : '☆' }}
                      </button>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="comment" class="form-label">Comentario (opcional)</label>
                    <textarea 
                      class="form-control" 
                      id="comment" 
                      rows="3"
                      [(ngModel)]="newReview.comment"
                      name="comment"
                      placeholder="Cuéntanos tu experiencia con este producto..."
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    class="btn btn-success"
                    [disabled]="newReview.rating === 0 || isSubmittingReview"
                  >
                    {{ isSubmittingReview ? 'Enviando...' : 'Publicar Reseña' }}
                  </button>
                </form>
              </div>

              <div *ngIf="!isLoggedIn()" class="alert alert-info">
                <a routerLink="/login" class="alert-link">Inicia sesión</a> para dejar una reseña de este producto.
              </div>

              <!-- Lista de reseñas -->
              <div *ngIf="loadingReviews" class="text-center py-3">
                <div class="spinner-border spinner-border-sm text-primary" role="status">
                  <span class="visually-hidden">Cargando reseñas...</span>
                </div>
              </div>

              <div *ngIf="!loadingReviews && reviews.length === 0" class="text-center text-muted py-4">
                <p>Aún no hay reseñas para este producto. ¡Sé el primero en dejar una!</p>
              </div>

              <div *ngIf="!loadingReviews && reviews.length > 0" class="reviews-list">
                <div *ngFor="let review of reviews" class="review-item border-bottom py-3">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <strong>{{ review.username }}</strong>
                      <div class="text-warning">
                        <span *ngFor="let star of [1,2,3,4,5]">
                          {{ review.rating >= star ? '★' : '☆' }}
                        </span>
                      </div>
                    </div>
                    <small class="text-muted">{{ formatDate(review.created_at) }}</small>
                  </div>
                  <p class="mt-2 mb-0" *ngIf="review.comment">{{ review.comment }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = false;
  isAddingToCart = false;
  selectedQuantity = 1;
  
  // Reviews
  reviews: Review[] = [];
  productRating: ProductRating | null = null;
  loadingReviews = false;
  showReviewForm = false;
  isSubmittingReview = false;
  newReview = {
    rating: 0,
    comment: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      if (productId) {
        this.loadProduct(productId);
      }
    });
  }

  loadProduct(id: number) {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
        this.loadReviews(id);
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.loading = false;
      }
    });
  }

  loadReviews(productId: number) {
    this.loadingReviews = true;
    this.reviewService.getProductReviews(productId).subscribe({
      next: (response) => {
        this.reviews = response.reviews;
        this.productRating = response.rating;
        this.loadingReviews = false;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.loadingReviews = false;
      }
    });
  }

  submitReview() {
    if (!this.product || this.newReview.rating === 0) return;

    this.isSubmittingReview = true;
    this.reviewService.createReview(
      this.product.id,
      this.newReview.rating,
      this.newReview.comment
    ).subscribe({
      next: () => {
        this.notificationService.showSuccess(
          '¡Gracias por tu reseña! Ha sido publicada exitosamente.',
          '✓ Reseña Publicada'
        );
        this.newReview = { rating: 0, comment: '' };
        this.showReviewForm = false;
        this.isSubmittingReview = false;
        this.loadReviews(this.product!.id);
      },
      error: (error) => {
        console.error('Error submitting review:', error);
        if (error.status === 400 && error.error?.error?.includes('ya has dejado')) {
          this.notificationService.showWarning(
            'Ya has dejado una reseña para este producto.',
            '⚠ Reseña Duplicada'
          );
        } else {
          this.notificationService.showError(
            'No se pudo publicar tu reseña. Intenta nuevamente.',
            '❌ Error'
          );
        }
        this.isSubmittingReview = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  addToCart() {
    if (!this.product) return;
    
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.isAddingToCart = true;
    this.cartService.addToCart(this.product.id, this.selectedQuantity).subscribe({
      next: () => {
        this.notificationService.productAddedToCart(this.product!.name);
        this.isAddingToCart = false;
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        if (error?.status === 401 || error?.status === 403) {
          this.authService.logout();
          this.notificationService.showWarning(
            'Tu sesión expiró o no es válida. Inicia sesión nuevamente para agregar al carrito.',
            '🔐 Sesión requerida'
          );
          this.isAddingToCart = false;
          this.router.navigate(['/login']);
          return;
        }

        if (error?.status === 0) {
          this.notificationService.networkError();
        } else {
          this.notificationService.showError('No se pudo agregar el producto al carrito. Intenta nuevamente.');
        }
        this.isAddingToCart = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/products']);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return 'assets/images/default-shoe.jpg';
    
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {
  reservations: any[] = [];
  filteredReservations: any[] = [];
  userId: number = 1; // En producción, obtener del servicio de autenticación
  isLoading: boolean = false;
  selectedStatus: string = '';
  showNewReservationForm: boolean = false;

  newReservation = {
    productId: '',
    quantity: 1,
    reservationDate: '',
    notes: ''
  };

  statusLabels: { [key: string]: string } = {
    'pending': '⏳ Pendiente',
    'confirmed': '✅ Confirmada',
    'ready': '📦 Lista',
    'picked_up': '🎉 Recogida',
    'cancelled': '❌ Cancelada'
  };

  statusColors: { [key: string]: string } = {
    'pending': '#FFA500',
    'confirmed': '#4CAF50',
    'ready': '#2196F3',
    'picked_up': '#8BC34A',
    'cancelled': '#F44336'
  };

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.isLoading = true;
    this.reservationService.getUserReservations(this.userId).subscribe(
      (response: any) => {
        this.reservations = response.data;
        this.applyFilter();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading reservations:', error);
        this.isLoading = false;
      }
    );
  }

  applyFilter(): void {
    if (this.selectedStatus) {
      this.filteredReservations = this.reservations.filter(
        (r) => r.status === this.selectedStatus
      );
    } else {
      this.filteredReservations = this.reservations;
    }
  }

  createReservation(): void {
    if (!this.newReservation.productId || !this.newReservation.reservationDate) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    this.isLoading = true;
    const payload = {
      userId: this.userId,
      ...this.newReservation,
      quantity: parseInt(this.newReservation.quantity.toString())
    };

    this.reservationService.createReservation(payload).subscribe(
      (response: any) => {
        this.reservations.push(response.data);
        this.applyFilter();
        this.resetForm();
        this.isLoading = false;
        alert('Reserva creada exitosamente');
      },
      (error) => {
        console.error('Error creating reservation:', error);
        alert('Error al crear la reserva: ' + error.error.error);
        this.isLoading = false;
      }
    );
  }

  cancelReservation(reservationId: number): void {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      return;
    }

    this.reservationService.cancelReservation(reservationId).subscribe(
      (response: any) => {
        const index = this.reservations.findIndex((r) => r.id === reservationId);
        if (index !== -1) {
          this.reservations[index].status = 'cancelled';
          this.applyFilter();
        }
        alert('Reserva cancelada exitosamente');
      },
      (error) => {
        console.error('Error cancelling reservation:', error);
        alert('Error al cancelar la reserva');
      }
    );
  }

  resetForm(): void {
    this.newReservation = {
      productId: '',
      quantity: 1,
      reservationDate: '',
      notes: ''
    };
    this.showNewReservationForm = false;
  }

  getStatusStyle(status: string): { [key: string]: string } {
    return {
      'background-color': this.statusColors[status] || '#999',
      'color': 'white',
      'padding': '5px 12px',
      'border-radius': '12px',
      'font-size': '12px',
      'font-weight': '500'
    };
  }
}

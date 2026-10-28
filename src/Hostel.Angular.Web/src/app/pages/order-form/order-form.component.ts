import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.css'
})
export class OrderFormComponent implements OnInit {
  order = { id: 0, guestName: '', roomId: 0, checkIn: '', checkOut: '', totalPrice: 0 };
  rooms$: Observable<any[]>;
  isEdit = false;
  loading = false;
  error = '';

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.rooms$ = this.api.getRooms();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loading = true;
      this.api.getOrder(parseInt(id)).subscribe({
        next: (loadedOrder) => {
          this.order = loadedOrder;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load order: ' + err.message;
          this.loading = false;
        }
      });
    }
  }

  save() {
    if (!this.order.guestName || !this.order.roomId || !this.order.checkIn || !this.order.checkOut) {
      alert('Please fill in all required fields');
      return;
    }

    if (this.isEdit) {
      this.api.updateOrder(this.order.id, this.order).subscribe({
        next: () => this.router.navigate(['/orders']),
        error: (err) => this.error = 'Failed to update order: ' + err.message
      });
    } else {
      this.api.createOrder(this.order).subscribe({
        next: () => this.router.navigate(['/orders']),
        error: (err) => this.error = 'Failed to create order: ' + err.message
      });
    }
  }
}

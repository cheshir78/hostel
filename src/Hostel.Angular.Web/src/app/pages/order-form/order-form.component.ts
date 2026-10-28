import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Order, Room } from '../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.css'
})
export class OrderFormComponent implements OnInit {
  order: Order = { 
    id: 0, 
    name: '', 
    dateFrom: new Date().toISOString().split('T')[0], 
    night: 1, 
    dateTo: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    roomId: 0 
  };
  rooms$: Observable<Room[]>;
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

  onDateFromChange() {
    const dateFrom = new Date(this.order.dateFrom);
    const dateTo = new Date(dateFrom);
    dateTo.setDate(dateTo.getDate() + this.order.night);
    this.order.dateTo = dateTo.toISOString().split('T')[0];
  }

  onNightChange() {
    this.onDateFromChange();
  }

  save() {
    if (!this.order.name || !this.order.roomId || !this.order.dateFrom || this.order.night <= 0) {
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

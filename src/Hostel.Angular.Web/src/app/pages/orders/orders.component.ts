import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Order } from '../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  orders$: Observable<Order[]>;

  constructor(public auth: AuthService, private api: ApiService) {
    this.orders$ = this.api.getOrders();
  }

  ngOnInit() {
    this.orders$ = this.api.getOrders();
  }

  deleteOrder(id: number) {
    if (confirm('Are you sure?')) {
      this.api.deleteOrder(id).subscribe({
        next: () => this.orders$ = this.api.getOrders()
      });
    }
  }
}

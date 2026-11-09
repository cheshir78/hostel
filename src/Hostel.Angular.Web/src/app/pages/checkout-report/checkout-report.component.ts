import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Observable, of } from 'rxjs';
import { Order, OrderRoomReport } from '../../models';

@Component({
  selector: 'app-checkout-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout-report.component.html',
  styleUrl: './checkout-report.component.css'
})
export class CheckoutReportComponent implements OnInit {
  onDate$: Observable<Date>;
  occupancy$: Observable<OrderRoomReport>;
  selectedDate: string;

  constructor(private api: ApiService) {
    this.selectedDate = this.toInputDateValue(new Date());
    this.onDate$ = of(new Date());
    this.occupancy$ = this.api.getOrdersByDate(new Date().toISOString());
  }

  ngOnInit() {
    //this.loadOrdersByDate(this.selectedDate);
  }

  onDateChange(date: string) {
    this.selectedDate = date;
    this.loadOrdersByDate(this.selectedDate);
  }

  private loadOrdersByDate(date: string) {
    this.occupancy$ = this.api.getCheckoutByDate(new Date(date).toISOString());
  }

  private toInputDateValue(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Observable, of } from 'rxjs';
import { Order, OrderDayReport } from '../../models';

@Component({
  selector: 'app-occupancy-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orderday-report.component.html',
  styleUrl: './orderday-report.component.css'
})
export class OrderDayReportComponent implements OnInit {
  onDate$: Observable<Date>;
  occupancy$: Observable<OrderDayReport>;
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
    this.occupancy$ = this.api.getOrdersByDate(new Date(date).toISOString());
  }

  private toInputDateValue(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

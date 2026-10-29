import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-occupancy-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './occupancy-report.component.html',
  styleUrl: './occupancy-report.component.css'
})
export class OccupancyReportComponent implements OnInit {
  occupancy$: Observable<any[]>;
  days$: Observable<string[]>;

  constructor(private api: ApiService) {
    this.occupancy$ = this.api.getOccupancyReport();
    this.days$ = new Observable(observer => {
      const days = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        days.push(d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
      }
      observer.next(days);
    });
  }

  ngOnInit() {
    this.occupancy$ = this.api.getOccupancyReport();
  }
}

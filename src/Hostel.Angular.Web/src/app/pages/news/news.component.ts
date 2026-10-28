import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent implements OnInit {
  news$: Observable<any[]>;

  constructor(private api: ApiService) {
    this.news$ = of([
      { id: 1, title: 'Welcome to Hostel', date: new Date(), content: 'Welcome to our hostel management system!' },
      { id: 2, title: 'New Features', date: new Date(), content: 'Check out our new booking features.' }
    ]);
  }

  ngOnInit() {
    // Load news from API
  }
}

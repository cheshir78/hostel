import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent implements OnInit {
  rooms$: Observable<any[]>;

  constructor(public auth: AuthService, private api: ApiService) {
    this.rooms$ = this.api.getRooms();
  }

  ngOnInit() {
    this.rooms$ = this.api.getRooms();
  }

  deleteRoom(id: number) {
    if (confirm('Are you sure?')) {
      this.api.deleteRoom(id).subscribe({
        next: () => this.rooms$ = this.api.getRooms()
      });
    }
  }
}

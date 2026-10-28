import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Room } from '../../models';

@Component({
  selector: 'app-room-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './room-form.component.html',
  styleUrl: './room-form.component.css'
})
export class RoomFormComponent implements OnInit {
  room: Room = { id: 0, name: '', number: undefined, capacity: 1 };
  isEdit = false;
  loading = false;
  error = '';

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loading = true;
      this.api.getRoom(parseInt(id)).subscribe({
        next: (loadedRoom) => {
          this.room = loadedRoom;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load room: ' + err.message;
          this.loading = false;
        }
      });
    }
  }

  save() {
    if (!this.room.name || this.room.capacity <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    if (this.isEdit) {
      this.api.updateRoom(this.room.id, this.room).subscribe({
        next: () => this.router.navigate(['/rooms']),
        error: (err) => this.error = 'Failed to update room: ' + err.message
      });
    } else {
      this.api.createRoom(this.room).subscribe({
        next: () => this.router.navigate(['/rooms']),
        error: (err) => this.error = 'Failed to create room: ' + err.message
      });
    }
  }
}

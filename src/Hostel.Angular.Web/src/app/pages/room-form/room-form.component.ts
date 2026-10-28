import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-room-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './room-form.component.html',
  styleUrl: './room-form.component.css'
})
export class RoomFormComponent implements OnInit {
  room = { id: 0, name: '', beds: 1, price: 0 };
  isEdit = false;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.api.getRoom(parseInt(id)).subscribe(room => this.room = room);
    }
  }

  save() {
    if (this.isEdit) {
      this.api.updateRoom(this.room.id, this.room).subscribe({
        next: () => this.router.navigate(['/rooms'])
      });
    } else {
      this.api.createRoom(this.room).subscribe({
        next: () => this.router.navigate(['/rooms'])
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { UserDto } from '../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {
  users$: Observable<UserDto[]>;
  filterText = '';

  constructor(private api: ApiService) {
    this.users$ = this.api.getUsers();
  }

  ngOnInit() {
    this.users$ = this.api.getUsers();
  }

  deleteUser(id: number) {
    if (confirm('Are you sure?')) {
      this.api.deleteUser(id).subscribe({
        next: () => this.users$ = this.api.getUsers()
      });
    }
  }

  getRolesDisplay(roles: string[]): string {
    return roles && roles.length > 0 ? roles.join(', ') : 'No roles';
  }
}

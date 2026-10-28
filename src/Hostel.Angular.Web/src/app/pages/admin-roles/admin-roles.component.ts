import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-roles.component.html',
  styleUrl: './admin-roles.component.css'
})
export class AdminRolesComponent implements OnInit {
  users$: Observable<any[]>;
  selectedUserId: number = 0;
  userRoles: string[] = [];
  roles = ['ROLE_USER', 'ROLE_ADMIN'];

  constructor(private api: ApiService) {
    this.users$ = this.api.getUsers();
  }

  ngOnInit() {
    this.users$ = this.api.getUsers();
  }

  toggleRole(role: string) {
    const index = this.userRoles.indexOf(role);
    if (index > -1) {
      this.userRoles.splice(index, 1);
    } else {
      this.userRoles.push(role);
    }
  }

  saveRoles() {
    if (this.selectedUserId) {
      this.api.assignRole(this.selectedUserId, this.userRoles[0]).subscribe();
    }
  }
}

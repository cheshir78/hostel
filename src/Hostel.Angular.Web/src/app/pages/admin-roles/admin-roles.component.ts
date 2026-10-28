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
  users: any[] = [];
  selectedUserId: number = 0;
  userRoles: string[] = [];
  roles = ['ROLE_USER', 'ROLE_ADMIN'];
  saving = false;

  constructor(private api: ApiService) {
    this.users$ = this.api.getUsers();
  }

  ngOnInit() {
    this.users$ = this.api.getUsers();
    this.users$.subscribe(users => {
      this.users = users;
    });
  }

  onUserSelected() {
    if (this.selectedUserId) {
      const selectedUser = this.users.find(u => u.id === this.selectedUserId);
      if (selectedUser && selectedUser.roles) {
        this.userRoles = selectedUser.roles || [];
      } else {
        this.userRoles = [];
      }
    }
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
    if (!this.selectedUserId) {
      alert('Please select a user');
      return;
    }

    this.saving = true;

    const selectedUser = this.users.find(u => u.id === this.selectedUserId);
    const currentRoles: string[] = selectedUser?.roles || [];

    const rolesToAdd = this.userRoles.filter(r => !currentRoles.includes(r));
    const rolesToRemove = currentRoles.filter(r => !this.userRoles.includes(r));

    let completed = 0;
    const total = rolesToAdd.length + rolesToRemove.length;

    if (total === 0) {
      this.saving = false;
      alert('No changes made');
      return;
    }

    rolesToAdd.forEach((role: string) => {
      this.api.assignRole(this.selectedUserId, role).subscribe({
        next: () => {
          completed++;
          if (completed === total) {
            this.saving = false;
            alert('Roles updated successfully');
            this.users$ = this.api.getUsers();
            this.users$.subscribe(users => {
              this.users = users;
              this.onUserSelected();
            });
          }
        },
        error: (err) => {
          this.saving = false;
          alert('Error updating roles: ' + err.message);
        }
      });
    });

    rolesToRemove.forEach((role: string) => {
      this.api.removeRole(this.selectedUserId, role).subscribe({
        next: () => {
          completed++;
          if (completed === total) {
            this.saving = false;
            alert('Roles updated successfully');
            this.users$ = this.api.getUsers();
            this.users$.subscribe(users => {
              this.users = users;
              this.onUserSelected();
            });
          }
        },
        error: (err) => {
          this.saving = false;
          alert('Error updating roles: ' + err.message);
        }
      });
    });
  }
}

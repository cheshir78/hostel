import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { UserDto, RoleDto } from '../../models';
import { Observable, forkJoin, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-roles.component.html',
  styleUrl: './admin-roles.component.css'
})
export class AdminRolesComponent implements OnInit {
  users$: Observable<UserDto[]>;
  users: UserDto[] = [];
  selectedUserId: number = 0;
  selectedUser: UserDto | null = null;
  selectedRoles: string[] = [];
  //availableRoles = ['ROLE_USER', 'ROLE_ADMIN'];
  availableRoles$!: Observable<RoleDto[]>;
  //availableRoles: RoleDto[] = [];
  saving = false;
  error = '';

  constructor(
    private api: ApiService,
    private route: ActivatedRoute
  ) {
    this.users$ = this.api.getUsers();
    //this.availableRoles$ = this.api.getAllRoles();
  }

  ngOnInit() {
    const userIdParam = this.route.snapshot.paramMap.get('id');
    
    this.users$ = this.api.getUsers();
    this.users$.subscribe(users => {
      this.users = users;
      if (userIdParam) {
        this.selectedUserId = parseInt(userIdParam);
        this.onUserSelected();
      }
    });
    this.availableRoles$ = this.api.getAllRoles();
  }

  onUserSelected() {
    if (this.selectedUserId) {
      this.selectedUser = this.users.find(u => u.id === this.selectedUserId) || null;
      if (this.selectedUser) {
        this.selectedRoles = [...this.selectedUser.roles];
      } else {
        this.selectedRoles = [];
      }
    } else {
      this.selectedUser = null;
      this.selectedRoles = [];
    }
  }

  toggleRole(role: string) {
    const index = this.selectedRoles.indexOf(role);
    if (index > -1) {
      this.selectedRoles.splice(index, 1);
    } else {
      this.selectedRoles.push(role);
    }
  }

  async saveRoles() {
    if (!this.selectedUserId || !this.selectedUser) {
      alert('Please select a user');
      return;
    }

    this.saving = true;
    this.error = '';

    const currentRoles = this.selectedUser.roles;
    const rolesToAdd = this.selectedRoles.filter(r => !currentRoles.includes(r));
    const rolesToRemove = currentRoles.filter(r => !this.selectedRoles.includes(r));

    let completed = 0;
    const total = rolesToAdd.length + rolesToRemove.length;

    if (total === 0) {
      this.saving = false;
      alert('No changes made');
      return;
    }

    const performedActions = (count: number) => {
      completed+=count;
      if (completed === total) {
        this.saving = false;
        alert('Roles updated successfully');
        this.users$ = this.api.getUsers();
        this.users$.subscribe(users => {
          this.users = users;
          this.onUserSelected();
        });
      }
    };

    const handleError = (err: any) => {
      this.saving = false;
      this.error = 'Error updating roles: ' + err.message;
    };

    const availableRoles = await firstValueFrom(this.availableRoles$);

    const requestsAdd = rolesToAdd.map((role: string) => {
      const roleId = availableRoles.find(r => r.name === role)?.id || 0;

      return this.api.assignRole(this.selectedUserId, roleId);
    });

    if (requestsAdd.length > 0) {
      forkJoin(requestsAdd).subscribe({
        next: (results) => {
          performedActions(requestsAdd.length);
        },
        error: (err) => {
          handleError(err);
        }
      });
    }

    const requestsRemove = rolesToRemove.map((role: string) => {
      const roleId = availableRoles.find(r => r.name === role)?.id || 0;

      return this.api.removeRole(this.selectedUserId, roleId);
    });

    if (requestsRemove.length > 0) {
      forkJoin(requestsRemove).subscribe({
        next: (results) => {
          performedActions(requestsRemove.length);
        },
        error: (err) => {
          handleError(err);
        }
      });
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Room, Order, UserDto, Role, OrderDayReport, RoleDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // Rooms
  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/rooms`).pipe(catchError(this.handleError));
  }

  getRoom(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/rooms/${id}`).pipe(catchError(this.handleError));
  }

  createRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(`${this.apiUrl}/rooms`, room).pipe(catchError(this.handleError));
  }

  updateRoom(id: number, room: Room): Observable<Room> {
    return this.http.put<Room>(`${this.apiUrl}/rooms/${id}`, room).pipe(catchError(this.handleError));
  }

  deleteRoom(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/rooms/${id}`).pipe(catchError(this.handleError));
  }

  // Orders
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`).pipe(catchError(this.handleError));
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${id}`).pipe(catchError(this.handleError));
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/orders`, order).pipe(catchError(this.handleError));
  }

  updateOrder(id: number, order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/orders/${id}`, order).pipe(catchError(this.handleError));
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/orders/${id}`).pipe(catchError(this.handleError));
  }

  getNews(): Observable<any> {
    return this.http.get(`${this.apiUrl}/news`).pipe(catchError(this.handleError));
  }

  // Reports
  getOccupancyReport(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reports/occupancy`).pipe(catchError(this.handleError));
  }

  getOrdersByDate(date: string): Observable<any> {
    return this.http.get<OrderDayReport>(`${this.apiUrl}/orders/date?date=${date}`).pipe(catchError(this.handleError));
  }

  // Admin - Users
  getUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.apiUrl}/admin/users`).pipe(catchError(this.handleError));
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/users/${id}`).pipe(catchError(this.handleError));
  }

  // Admin - Roles
  getUserRoles(userId: number): Observable<RoleDto[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/admin/users/${userId}/roles`).pipe(catchError(this.handleError));
  }

  getAllRoles(): Observable<RoleDto[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/admin/roles`).pipe(catchError(this.handleError));
  }

  assignRole(userId: number, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/users/${userId}/roles/${role}`, {}).pipe(catchError(this.handleError));
  }

  removeRole(userId: number, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/users/${userId}/roles/${role}`, { userId, role }).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      message = error.error.message;
    } else if (error.status === 400) {
      message = error.error?.message || 'Bad request';
    } else if (error.status === 404) {
      message = 'Resource not found';
    } else if (error.status === 500) {
      message = 'Server error';
    }
    return throwError(() => new Error(message));
  }
}

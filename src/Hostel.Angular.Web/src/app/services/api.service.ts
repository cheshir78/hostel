import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // Rooms
  getRooms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/rooms`).pipe(catchError(this.handleError));
  }

  getRoom(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/rooms/${id}`).pipe(catchError(this.handleError));
  }

  createRoom(room: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/rooms`, room).pipe(catchError(this.handleError));
  }

  updateRoom(id: number, room: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/rooms/${id}`, room).pipe(catchError(this.handleError));
  }

  deleteRoom(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/rooms/${id}`).pipe(catchError(this.handleError));
  }

  // Orders
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders`).pipe(catchError(this.handleError));
  }

  getOrder(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/orders/${id}`).pipe(catchError(this.handleError));
  }

  createOrder(order: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/orders`, order).pipe(catchError(this.handleError));
  }

  updateOrder(id: number, order: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/orders/${id}`, order).pipe(catchError(this.handleError));
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/orders/${id}`).pipe(catchError(this.handleError));
  }

  // Reports
  getOccupancyReport(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reports/occupancy`).pipe(catchError(this.handleError));
  }

  getOrdersByDate(date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders/by-date/${date}`).pipe(catchError(this.handleError));
  }

  // Admin
  getUsers(minId?: number): Observable<any[]> {
    const url = minId ? `${this.apiUrl}/admin/gt/${minId}` : `${this.apiUrl}/admin`;
    return this.http.get<any[]>(url).pipe(catchError(this.handleError));
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/${id}`).pipe(catchError(this.handleError));
  }

  assignRole(userId: number, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/assign-role`, { userId, role }).pipe(catchError(this.handleError));
  }

  removeRole(userId: number, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/remove-role`, { userId, role }).pipe(catchError(this.handleError));
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

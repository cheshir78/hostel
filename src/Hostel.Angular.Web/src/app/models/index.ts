export interface Room {
  id: number;
  name: string;
  number?: number;
  capacity: number;
}

export interface Order {
  id: number;
  name: string;
  age?: number;
  documentId?: string;
  dateFrom: Date | string;
  dateFromStr?: string;
  night: number;
  dateTo: Date | string;
  roomId?: number;
  roomName?: string;
  room?: Room;
}

export interface User {
  id: number;
  username: string;
  roles: string[];
  token?: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface UserDto {
  id: number;
  username: string;
  roles: string[];
}

export interface RoleDto {
  id: number;
  name: string;
}

export interface OrderDayReport {
  allOrders: Order[];
  orderDateStr: string;
}

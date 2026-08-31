export interface User {
  id: number;
  username: string;
  roles: string[];
}

export interface Role {
  id: number;
  name: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  roles: string[];
}

export interface Room {
  id: number;
  name: string;
  number?: number | null;
  capacity: number;
}

export interface Order {
  id: number;
  name: string;
  age?: number | null;
  documentId?: string | null;
  dateFrom: string;
  dateFromStr?: string;
  night: number;
  dateTo: string;
  roomId?: number | null;
  roomName?: string | null;
  room?: Room | null;
}

export interface CreateOrderRequest {
  id?: number;
  name: string;
  age?: number | null;
  documentId?: string | null;
  dateFromStr: string;
  night: number;
  roomId: number;
}

export interface ReportRestLine {
  room: Room;
  line: number[];
}

export interface ReportResponse {
  reportHeader: string[];
  allOrders: ReportRestLine[];
  orderDateStr: string;
}

export interface NewsItem {
  id: number;
  title: string;
  date: string;
  content: string;
}

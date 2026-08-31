# Hostel Management System (.NET 10 + React)

A full-stack hostel and room booking management system ported from Java Spring Boot (Spring Security, JPA/Hibernate, JSP) to **.NET 10 (C#)** and **ReactJS (TypeScript + Vite)**.

---

## 🚀 Features

- **Authentication & Authorization**:
  - JWT Bearer Authentication + BCrypt password hashing.
  - Role-based access control with `ROLE_USER` and `ROLE_ADMIN`.
  - User self-registration with password confirmation.
- **Room Management**:
  - List rooms, add new rooms, edit room parameters (name, room number, capacity), delete rooms.
  - Validation to prevent duplicate room names.
- **Booking & Order Management**:
  - Create and edit bookings with guest details (Name, Age, Document ID, Date From, Nights).
  - Automated room capacity check for every night of the reservation (`isCheckFreeRoom`).
  - View bookings active on a specific date (`/hostel/orderdate`).
- **7-Day Occupancy Matrix Report**:
  - Live 7-day occupancy calculation per room comparing booked spots against capacity (`/hostel/reportrestdate`).
- **Admin Panel**:
  - User list with `ID > minId` filter (`/admin/gt/{id}`).
  - User deletion and role assignment/removal (`ROLE_USER`, `ROLE_ADMIN`).
- **News Page**:
  - Accessible to users with `ROLE_USER`.
- **REST API & Swagger**:
  - Full REST API compatibility including `/rest/order` endpoints with OpenAPI/Swagger UI at `/swagger`.

---

## 👥 Default Credentials

The database is seeded on startup with the following test accounts:

| Username | Password | Roles |
|---|---|---|
| `admin` | `admin` | `ROLE_USER`, `ROLE_ADMIN` |
| `user` | `user` | `ROLE_USER` |

---

## 🛠 Project Structure

```
.
├── Hostel.sln
├── src/
│   ├── Hostel.Api/               # ASP.NET Core (.NET 10) Web API
│   │   ├── Controllers/          # Auth, Rooms, Orders, Reports, Admin, News, RestOrder
│   │   ├── Data/                 # AppDbContext, DbInitializer (SQLite EF Core)
│   │   ├── Exceptions/           # Custom domain exceptions
│   │   ├── Models/
│   │   │   ├── Entities/         # User, Role, Room, Order
│   │   │   └── DTOs/             # Request & Response models
│   │   └── Services/             # Business logic (UserService, RoomService, OrderService, JwtService)
│   └── Hostel.Web/               # React + TypeScript + Vite Frontend
│       ├── src/
│       │   ├── api/              # Axios HTTP client with JWT interceptor
│       │   ├── components/       # Navbar, ProtectedRoute, UI components
│       │   ├── context/          # AuthContext (state & tokens)
│       │   ├── pages/            # Home, Login, Register, Rooms, Orders, Reports, Admin, News
│       │   └── styles/           # Modern responsive CSS
└── tests/
    └── Hostel.Tests/             # xUnit test suite
```

---

## 🏃 Getting Started

### Prerequisites
- [.NET SDK](https://dotnet.microsoft.com/) (.NET 10 / .NET 9)
- [Node.js](https://nodejs.org/) (v18+) & `npm`

### 1. Run the Backend API
```powershell
cd src/Hostel.Api
dotnet run
```
Backend API will be available at: `http://localhost:5000` (Swagger UI: `http://localhost:5000/swagger`)

### 2. Run the React Frontend
```powershell
cd src/Hostel.Web
npm install
npm run dev
```
Frontend application will be available at: `http://localhost:3000`

### 3. Run Unit Tests
```powershell
dotnet test
```

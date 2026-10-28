# Hostel Management System (.NET 8.0 + React/Angular)

A full-stack hostel and room booking management system ported from Java Spring Boot to **.NET 8.0 (C#)** with two modern frontend options: **ReactJS (TypeScript + Vite)** and **Angular 18 (TypeScript)**.

---

## 🚀 Features

- **Authentication & Authorization**: JWT authentication + BCrypt password hashing, role-based access control
- **Room Management**: CRUD operations with duplicate name validation
- **Booking Management**: Multi-night reservations with automatic capacity validation
- **Occupancy Reports**: 7-day matrix with real-time calculations
- **Admin Panel**: User management with role assignment
- **REST API & Swagger**: Full API documentation at `/swagger`

---

## 👥 Default Credentials

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
│   ├── Hostel.Api/                          # ASP.NET Core 8.0 API
│   │   ├── Controllers/                     # Auth, Rooms, Orders, Reports, Admin
│   │   ├── Services/                        # Business logic
│   │   ├── Data/                            # EF Core + SQLite
│   │   ├── appsettings*.json                # Config files
│   ├── Hostel.Web/                          # React 18 + Vite (Option 1)
│   │   └── src/                             # Components, pages, services
│   └── Hostel.Angular.Web/                  # Angular 18 (Option 2)
│       ├── src/app/                         # Services, guards, components, pages
│       └── ANGULAR_README.md                # Angular documentation
└── tests/
    └── Hostel.Tests/                        # xUnit unit tests
```

---

## 📱 Frontend Options

### Option 1: React Frontend (Vite)
**Technology**: React 18 + TypeScript + Vite  
**Port**: 3000 | **Bundle**: 266KB gzipped

```bash
cd src/Hostel.Web
npm install && npm run dev
```

**Best For**: Teams familiar with React, fast development iteration, smaller bundle size

---

### Option 2: Angular Frontend (LTS)
**Technology**: Angular 18 LTS + TypeScript  
**Port**: 4200 | **Bundle**: 300KB gzipped

```bash
cd src/Hostel.Angular.Web
npm install && npm start
```

**Best For**: Enterprise teams, comprehensive framework, built-in tooling, full type safety

See `src/Hostel.Angular.Web/ANGULAR_README.md` for Angular-specific details.

---

## 🏃 Getting Started

### Prerequisites
- [.NET SDK 8.0+](https://dotnet.microsoft.com/)
- [Node.js 18+](https://nodejs.org/)

### 1. Start Backend API
```powershell
cd src/Hostel.Api
dotnet run
```
✓ API: http://localhost:5000  
✓ Swagger: http://localhost:5000/swagger

### 2. Start Frontend (Choose One)

**React:**
```powershell
cd src/Hostel.Web
npm install && npm run dev
```
✓ App: http://localhost:3000

**Angular:**
```powershell
cd src/Hostel.Angular.Web
npm install && npm start
```
✓ App: http://localhost:4200

### 3. Run Tests
```powershell
dotnet test
```

---

## 🔐 Security Configuration

### Development (Automatic)
```bash
cd src/Hostel.Api
dotnet run  # Uses appsettings.Development.json
```

### Production (Required)
```bash
export JWT_SECRET="your-secure-32-char-minimum-secret"
dotnet run --environment Production
```

**See `SECURITY_SETUP.md` for detailed production deployment guide.**

---

## 📊 Frontend Comparison

| Feature | React | Angular |
|---------|-------|---------|
| Framework | React 18 | Angular 18 LTS |
| Build Tool | Vite | Angular CLI |
| State Management | Context API | RxJS Services |
| HTTP Client | Axios | HttpClient |
| Routing | React Router v6 | Angular Router |
| Port | 3000 | 4200 |
| Bundle Size | 266KB | 300KB |
| Dev Server Speed | Very Fast | Standard |
| Learning Curve | Moderate | Steep |
| Team Fit | React teams | Enterprise/Angular teams |

**Both implementations are feature-complete, production-ready, and fully equivalent.**

---

## 📚 Technical Stack

### Backend
- **Runtime**: .NET 8.0 (LTS, supported until Nov 2026)
- **Framework**: ASP.NET Core 8.0
- **Database**: SQLite 3 with EF Core
- **Auth**: JWT (HS256) + BCrypt password hashing
- **API Docs**: Swagger/OpenAPI

### Frontend Options
- **React**: React 18 + TypeScript + Vite + Axios + React Router
- **Angular**: Angular 18 LTS + TypeScript + RxJS + Angular CLI + HttpClient

---

## 🚀 Deployment

### Docker Example (Backend)
```bash
docker build -f src/Hostel.Api/Dockerfile -t hostel-api:latest .
docker run \
  -e JWT_SECRET="your-secure-secret" \
  -e ASPNETCORE_ENVIRONMENT=Production \
  -p 5000:5000 \
  hostel-api:latest
```

### Cloud Platforms
- **Azure**: App Service with Key Vault for secrets
- **AWS**: Lambda/ECS with Secrets Manager
- **Kubernetes**: ConfigMap for settings, Secrets for JWT

See `SECURITY_SETUP.md` for platform-specific instructions.

---

## 🔗 API Endpoints

### Core Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/rooms` - List rooms
- `POST /api/rooms` - Create room (admin)
- `PUT /api/rooms/{id}` - Update room (admin)
- `DELETE /api/rooms/{id}` - Delete room (admin)
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order
- `GET /api/reports/occupancy` - 7-day matrix
- `GET /api/admin` - List users (admin)

Full documentation: http://localhost:5000/swagger

---

## ✅ Implementation Status

- [x] .NET 8.0 backend with secure configuration
- [x] JWT authentication with environment variable secrets
- [x] CORS restricted to whitelist
- [x] React 18 frontend (Vite) - fully functional
- [x] Angular 18 frontend (LTS) - fully functional
- [x] Both frontends with identical features
- [x] 10 backend unit tests (all passing)
- [x] Production deployment guide
- [x] Swagger API documentation

---

## 📖 Documentation

- **Backend API**: Swagger UI at `/swagger` endpoint
- **React Frontend**: Components and pages in `src/Hostel.Web/src`
- **Angular Frontend**: `src/Hostel.Angular.Web/ANGULAR_README.md`
- **Security**: `SECURITY_SETUP.md` (production deployment)

---

## 🎯 Quick Start Decision Tree

```
Do you have a React team?
├─ Yes → Use React frontend (src/Hostel.Web)
└─ No → Do you need an enterprise framework?
        ├─ Yes → Use Angular frontend (src/Hostel.Angular.Web)
        └─ No → Choose based on team preference
```

Both frontends connect to the same API and provide identical functionality.

---

## 🤝 Contributing

To add features:
1. Update backend API in `src/Hostel.Api`
2. Add services, controllers, and tests
3. Update React components in `src/Hostel.Web/src`
4. Update Angular components in `src/Hostel.Angular.Web/src`
5. Run tests: `dotnet test`

---

## 📄 Origin

Port of [Roman Yerokhin's Spring Security Hostel](https://gitlab.com/Roman.Yerokhin/springsecurity) to modern .NET and JavaScript frameworks.

---

**Happy Coding! 🚀**

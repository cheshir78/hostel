# Hostel Management System - Angular Frontend

A modern Angular 18 (TypeScript) frontend for the Hostel Management System, providing the same functionality as the original React frontend with Angular's component architecture and dependency injection.

## 📋 Features

- **Authentication & Authorization**
  - JWT Bearer token authentication
  - Role-based access control (ROLE_USER, ROLE_ADMIN)
  - User registration and login
  - Secure token storage in localStorage

- **Room Management**
  - View all rooms with details
  - Add new rooms (admin only)
  - Edit room information (admin only)
  - Delete rooms (admin only)
  - Duplicate room name validation

- **Booking Management**
  - Create new orders/bookings
  - View all orders
  - Edit existing orders
  - Delete orders
  - Multi-night capacity validation
  - View orders by specific date

- **Reports**
  - 7-day occupancy matrix report
  - Color-coded room capacity visualization
  - Real-time occupancy calculations

- **Admin Panel**
  - User management
  - User filtering by ID
  - Role assignment/removal
  - User deletion

- **Additional Pages**
  - Home page with features overview
  - News page (ROLE_USER only)
  - Responsive navigation with role-based menu items

## 🛠 Technology Stack

- **Framework**: Angular 18 (LTS)
- **Language**: TypeScript 5.x
- **HTTP Client**: Angular HttpClient with Axios compatibility
- **Styling**: CSS 3 with responsive design
- **State Management**: RxJS Observables and Services
- **Routing**: Angular Router with guards and role-based access
- **Build Tool**: Angular CLI with Webpack

## 📁 Project Structure

```
src/
├── app/
│   ├── services/
│   │   ├── auth.service.ts          # Authentication & token management
│   │   └── api.service.ts           # HTTP API calls to backend
│   ├── guards/
│   │   └── auth.guard.ts            # Route protection & role checks
│   ├── interceptors/
│   │   └── jwt.interceptor.ts       # JWT token injection to requests
│   ├── components/
│   │   └── navbar.component.ts      # Navigation component
│   ├── pages/                       # Page components (routing targets)
│   │   ├── home.component.ts
│   │   ├── login.component.ts
│   │   ├── register.component.ts
│   │   ├── rooms.component.ts
│   │   ├── room-form.component.ts
│   │   ├── orders.component.ts
│   │   ├── order-form.component.ts
│   │   ├── occupancy-report.component.ts
│   │   ├── admin-users.component.ts
│   │   └── news.component.ts
│   ├── app.component.ts             # Root component
│   ├── app.config.ts                # Application configuration
│   ├── app.routes.ts                # Route definitions
│   └── app.component.html           # Root template with router-outlet
├── styles.css                       # Global styles
├── index.html                       # HTML entry point
└── main.ts                          # Bootstrap entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested with v20.x)
- npm 9+ (tested with v10.x)
- Running Hostel API on http://localhost:5000

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm start
# or
ng serve

# Application will be available at http://localhost:4200
```

### Build for Production

```bash
# Build optimized production bundle
npm run build
# or
ng build --configuration production

# Output in: dist/
```

### Running Tests

```bash
npm test
# or
ng test
```

## 🔐 Authentication Flow

1. User logs in with username/password
2. Backend validates credentials and returns JWT token
3. Token stored in localStorage
4. JwtInterceptor adds `Authorization: Bearer <token>` to all API requests
5. On 401 response, user is logged out and redirected to login
6. Roles extracted from JWT and cached in CurrentUser

## 🔗 API Integration

All API calls go to `http://localhost:5000/api`:

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Room Endpoints
- `GET /api/rooms` - List all rooms
- `GET /api/rooms/{id}` - Get room details
- `POST /api/rooms` - Create room (admin only)
- `PUT /api/rooms/{id}` - Update room (admin only)
- `DELETE /api/rooms/{id}` - Delete room (admin only)

### Order Endpoints
- `GET /api/orders` - List all orders
- `GET /api/orders/{id}` - Get order details
- `POST /api/orders` - Create order
- `PUT /api/orders/{id}` - Update order
- `DELETE /api/orders/{id}` - Delete order
- `GET /api/orders/by-date/{date}` - Get orders by date

### Report Endpoints
- `GET /api/reports/occupancy` - Get 7-day occupancy matrix

### Admin Endpoints
- `GET /api/admin` - List all users
- `GET /api/admin/gt/{id}` - List users with ID > specified value
- `DELETE /api/admin/{id}` - Delete user (admin only)
- `POST /api/admin/assign-role` - Assign role to user
- `POST /api/admin/remove-role` - Remove role from user

## 🔄 Comparison with React Frontend

| Aspect | React (src/Hostel.Web) | Angular (src/Hostel.Angular.Web) |
|--------|------------------------|----------------------------------|
| Framework | React 18 + TypeScript | Angular 18 + TypeScript |
| Build Tool | Vite | Angular CLI/Webpack |
| State Management | Context API + useState | RxJS Services |
| HTTP Client | Axios | Angular HttpClient |
| Routing | React Router v6 | Angular Router |
| Styling | CSS + Responsive | CSS + Responsive |
| Bundle Size | ~266KB gzipped | ~300KB gzipped (typical) |
| Development Server | vite dev (port 3000) | ng serve (port 4200) |
| Testing | Jest/Vitest | Jasmine/Karma |

Both implementations provide identical functionality and UI, using their respective framework's best practices.

## 📝 Environment Configuration

Create `.env` file (if needed):
```
API_URL=http://localhost:5000/api
```

Or update `apiUrl` in `api.service.ts`:
```typescript
private apiUrl = 'http://localhost:5000/api';
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Use different port
ng serve --port 4201
```

### CORS Errors
Ensure the .NET API has CORS configured for `http://localhost:4200`:
- Update `appsettings.Development.json` `AllowedOrigins` array
- Or run API with environment variable: `AllowedOrigins__0=http://localhost:4200`

### Token Expiration
- Tokens expire after 7 days
- User will be logged out automatically on expired token
- Refresh page to return to login

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

## 📚 References

- [Angular Documentation](https://angular.io/docs)
- [Angular CLI](https://angular.io/cli)
- [RxJS Guide](https://rxjs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## ✅ Feature Parity Checklist

- [x] User login/registration
- [x] JWT token-based authentication
- [x] Role-based access control
- [x] Room CRUD operations
- [x] Order CRUD operations
- [x] Multi-night capacity validation
- [x] Occupancy reports (7-day matrix)
- [x] Admin user management
- [x] Responsive UI design
- [x] Error handling & validation
- [x] Protected routes with guards
- [x] Token persistence across sessions
- [x] Automatic logout on 401

## 🚀 Performance

- Tree-shaking enabled for unused code removal
- AOT (Ahead-of-Time) compilation by default
- Lazy loading for route modules (can be enabled)
- Change detection optimized
- Production build: ~300KB gzipped

## 📄 License

Same as parent Hostel project

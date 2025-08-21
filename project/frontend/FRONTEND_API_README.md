# Frontend API Integration

This frontend application provides a React-based interface to interact with your Django API endpoints.

## Available Routes

- `/` - Home page
- `/welcome` - Welcome page
- `/dashboard` - Interactive API dashboard
- `/api-demo` - Complete API demo with documentation

## API Endpoints Covered

The frontend includes components and services for the following Django API endpoints:

### Authentication

- **GET** `/get-csrf-token/` - Get CSRF token for authentication
- **POST** `/signup/` - Create a new user account

### Users

- **GET** `/user/<int:user_id>/` - Get user profile by ID

### Products

- **GET** `/products/` - Get all products
- **POST** `/add_product/` - Add a new product

## Features

### 1. Signup Component (`/components/SignupComponent.tsx`)

- User registration form
- Real-time validation
- Error handling
- Success feedback

### 2. Products Component (`/components/ProductsComponent.tsx`)

- Display all products
- Add new products
- Product owner information
- Loading states and error handling

### 3. User Profile Component (`/components/UserProfileComponent.tsx`)

- Look up user profiles by ID
- Display user information
- Error handling for non-existent users

### 4. Dashboard (`/components/Dashboard.tsx`)

- Tabbed interface combining all features
- CSRF token testing
- Clean navigation between features

## API Services (`/api/services.ts`)

All API calls are centralized in the services file with:

- TypeScript interfaces for type safety
- Axios interceptors for CSRF token handling
- Consistent error handling
- Clean separation of concerns

## Usage Instructions

1. **Start the Django backend** (make sure it's running on `http://localhost:8000`)
2. **Start the React frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
3. **Navigate to** `http://localhost:5173/api-demo` for the full demo
4. **Test the flow**:
   - Create a user account via signup
   - Note the returned user ID
   - Use the user ID to fetch the profile
   - Add products using the user ID as owner_id
   - View all products

## Configuration

The API base URL is configured in `/api/axiosConfig.ts`:

```typescript
baseURL: "http://localhost:8000";
```

Update this if your Django server runs on a different port or domain.

## CSRF Protection

The frontend automatically handles CSRF protection by:

1. Fetching CSRF tokens before POST requests
2. Adding tokens to request headers
3. Handling CSRF-related errors gracefully

## Error Handling

All components include comprehensive error handling:

- Network errors
- API validation errors
- User-friendly error messages
- Loading states during requests

# 08 - API Contract

## Overview

The frontend communicates exclusively with `prodigo-api` via REST. The API is the source of truth, and we follow strict conventions for consistency.

## Base Configuration

```typescript
// config/env.ts
export const env = {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/1.0',
};
```

All requests go through `src/core/http/client.ts` (or `src/lib/http/client.ts` currently).

## HTTP Client

```typescript
// core/http/client.ts
const httpClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000,
});

// Request interceptor - attach token
httpClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle errors
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = toApiError(error);
    if (apiError.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(apiError);
  }
);
```

## API Conventions

### Versioning
All endpoints are versioned: `/api/v1/...` (or as configured in base URL)

### HTTP Methods
| Method | Purpose | Example |
|--------|---------|---------|
| `GET` | Retrieve resource(s) | `GET /products` |
| `POST` | Create resource | `POST /products` |
| `PUT` | Full update | `PUT /products/{id}` |
| `PATCH` | Partial update | `PATCH /products/{id}` |
| `DELETE` | Delete resource | `DELETE /products/{id}` |

### URL Structure
```text
/api/v1/{resource}           # Collection
/api/v1/{resource}/{id}      # Single resource
/api/v1/{resource}/{id}/sub  # Nested resource
```

## Error Handling

### Error Response Shapes

The backend returns two JSON shapes with HTTP 4xx/5xx:

#### Generic Error (ApiErrorResponse)
```json
{
  "timestamp": "2026-10-26T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid request",
  "path": "/api/v1/products",
  "errorCode": "PRODUCT_INVALID",
  "traceId": "abc123"
}
```

#### Validation Error (ValidationErrorResponse)
```json
{
  "timestamp": "2026-10-26T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/v1/products",
  "errorCode": "VALIDATION_FAILED",
  "traceId": "abc123",
  "errors": [
    { "field": "name", "message": "Name is required" },
    { "field": "price", "message": "Price must be positive" }
  ]
}
```

### ApiError Class

```typescript
// core/http/api-error.ts
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public errorCode?: string,
    public traceId?: string,
    public fieldErrors?: Record<string, string>,
    public path?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

### Mapping

```typescript
export function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const response = error.response?.data;
    
    if (response?.errors && Array.isArray(response.errors)) {
      // Validation error
      const fieldErrors: Record<string, string> = {};
      response.errors.forEach((e: FieldErrorResponse) => {
        fieldErrors[e.field] = e.message;
      });
      return new ApiError(
        response.status,
        response.message || 'Validation failed',
        response.errorCode,
        response.traceId,
        fieldErrors,
        response.path
      );
    }
    
    // Generic error
    if (response?.message) {
      return new ApiError(
        response.status,
        response.message,
        response.errorCode,
        response.traceId,
        undefined,
        response.path
      );
    }
  }
  
  // Fallback
  return new ApiError(500, 'Une erreur est survenue');
}
```

### Usage in Forms

```typescript
const { mutate: createProduct } = useMutation({
  mutationFn: (data) => productApi.create(data),
  onError: (error: ApiError) => {
    if (error.fieldErrors) {
      // Set form errors
      Object.entries(error.fieldErrors).forEach(([field, message]) => {
        form.setError(field as any, { message });
      });
    }
    // Show toast for general errors
    toast.error(error.message);
  },
});
```

## Pagination

### Request
```http
GET /api/v1/products?page=0&size=20&sort=createdAt,desc
```

### Response
```json
{
  "content": [...],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20,
    "sort": { "sorted": true, "orders": [...] },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalElements": 150,
  "totalPages": 8,
  "last": false,
  "first": true,
  "numberOfElements": 20,
  "size": 20,
  "number": 0,
  "sort": { "sorted": true, "orders": [...] },
  "empty": false
}
```

### Frontend Types
```typescript
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;      // current page
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
```

### Usage
```typescript
const { data } = useQuery({
  queryKey: ['products', page, size, sort],
  queryFn: () => productApi.list({ page, size, sort }),
});

const products = data?.content ?? [];
const totalPages = data?.totalPages ?? 0;
```

## Filtering & Sorting

### Filtering
```http
GET /api/v1/products?categoryId=123&status=ACTIVE&search=laptop
```

### Sorting
```http
GET /api/v1/products?sort=name,asc&sort=price,desc
```

Or combined with pagination.

## Authentication

### Login
```http
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "password"
}

Response:
{
  "accessToken": "...",
  "refreshToken": "...",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

### Authenticated Request
```http
GET /api/v1/me
Authorization: Bearer {accessToken}
```

### Token Refresh
```http
POST /api/v1/auth/refresh
{
  "refreshToken": "..."
}
```

### Logout
```http
POST /api/v1/auth/logout
```

## Common Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/auth/login` | POST | No | Login |
| `/auth/register` | POST | No | Register company + user |
| `/auth/refresh` | POST | No | Refresh token |
| `/auth/forgot-password` | POST | No | Request reset |
| `/auth/reset-password` | POST | No | Reset password |
| `/me` | GET | Yes | Current user + tenant + permissions + modules + theme |
| `/tenant/company` | GET/PATCH | Yes | Company profile |
| `/tenant/modules` | GET | Yes | Enabled modules |
| `/tenant/theme` | GET/PUT | Yes | Theme settings |

## Best Practices

1. **Always use httpClient** - Never use fetch/axios directly
2. **Handle ApiError properly** - Show user-friendly messages
3. **Map field errors to forms** - Use `error.fieldErrors`
4. **Respect pagination** - Don't fetch all data
5. **Use query keys consistently** - For React Query caching
6. **Handle 401 globally** - Already done in interceptor
7. **Don't log sensitive data** - Especially tokens/credentials
8. **Type all responses** - Use TypeScript interfaces
9. **Use AbortController if needed** - For request cancellation
10. **Follow REST conventions** - Keep URLs clean and predictable

## Related Documentation

- [03 - Multi-Tenancy](./03-multi-tenant.md)
- [04 - RBAC & Permissions](./04-rbac.md)
- [05 - Module System](./05-module-system.md)

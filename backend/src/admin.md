# Admin Permissions & Observability - Implementation Plan

## Current State

### ✅ Completed
| Component | Status | File |
|-----------|--------|------|
| Winston Logger | Done | `backend/src/shared/utils/logger.ts` |
| Sentry Backend | Done | `backend/src/shared/utils/instrument.ts`, `app.ts` |
| requireAdmin Middleware | Done | `backend/src/shared/middleware/auth.ts:43` |
| Admin Repository | Skeleton | `backend/src/modules/admin/admin.repository.ts` |

### ❌ Not Started
- Admin API routes
- Frontend admin pages
- Frontend logger utility

---

## Phase 1: Backend Admin API

### 1.1 Admin Service
**File**: `backend/src/modules/admin/admin.service.ts`

```typescript
class AdminService {
  // Stats
  async getStats() // users, tasks, sessions count
  
  // User Management
  async getUsers(page, limit, search, role, status)
  async getUserById(id)
  async updateUserRole(id, role)
  async updateUserStatus(id, isActive)
  
  // System Health
  async getSystemHealth() // DB, memory, uptime
}
```

### 1.2 Admin Controller
**File**: `backend/src/modules/admin/admin.controller.ts`

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/v1/admin/stats` | Aggregate stats |
| GET | `/api/v1/admin/users` | Paginated user list |
| GET | `/api/v1/admin/users/:id` | Single user |
| PATCH | `/api/v1/admin/users/:id/role` | Change role |
| PATCH | `/api/v1/admin/users/:id/status` | Ban/activate |
| GET | `/api/v1/admin/health` | System health |

### 1.3 Admin Route
**File**: `backend/src/modules/admin/admin.route.ts`

```typescript
router.get('/stats', requireAuth, requireAdmin, controller.getStats);
router.get('/users', requireAuth, requireAdmin, controller.getUsers);
router.patch('/users/:id/role', requireAuth, requireAdmin, controller.updateRole);
router.patch('/users/:id/status', requireAuth, requireAdmin, controller.updateStatus);
router.get('/health', controller.getHealth);
```

### 1.4 Update App.ts
```typescript
import adminRouter from "./modules/admin/admin.route.js";
// Add route
this.app.use("/api/v1/admin", adminRouter);
```

---

## Phase 2: Frontend Logger Utility

### 2.1 Logger Service
**File**: `frontend/src/lib/logger.ts`

```typescript
// Env-aware: verbose in dev, warn+ in prod
class Logger {
  debug(message, ...args)
  info(message, ...args)
  warn(message, ...args)
  error(message, ...args)
}
```

### 2.2 Replace console.* calls
- Search for `console.error` in frontend services
- Replace with logger calls

---

## Phase 3: Frontend Admin Pages

### 3.1 Admin Service
**File**: `frontend/src/services/adminService.ts`

```typescript
// Axios calls to /api/v1/admin/* endpoints
```

### 3.2 Admin Layout
**File**: `frontend/src/pages/admin/AdminLayout.tsx`
- Sidebar with nav links
- Protected route with admin guard

### 3.3 Admin Pages

| Page | Route | Content |
|------|-------|---------|
| Overview | `/admin` | Stats cards, recent activity |
| Users | `/admin/users` | Data table, actions |
| System | `/admin/system` | Health indicators |

### 3.4 Route Protection
**File**: `frontend/src/App.tsx`

```typescript
// Add admin routes with requireAdmin guard
<Route path="/admin" element={<AdminLayout />}>
  <Route index element={<AdminOverview />} />
  <Route path="users" element={<AdminUsers />} />
  <Route path="system" element={<AdminSystemHealth />} />
</Route>
```

---

## Files to Create/Modify

| Action | File |
|--------|------|
| Create | `backend/src/modules/admin/admin.service.ts` |
| Create | `backend/src/modules/admin/admin.controller.ts` |
| Modify | `backend/src/modules/admin/admin.route.ts` |
| Modify | `backend/src/app.ts` |
| Create | `frontend/src/lib/logger.ts` |
| Create | `frontend/src/services/adminService.ts` |
| Create | `frontend/src/pages/admin/AdminLayout.tsx` |
| Create | `frontend/src/pages/admin/AdminOverview.tsx` |
| Create | `frontend/src/pages/admin/AdminUsers.tsx` |
| Create | `frontend/src/pages/admin/AdminSystemHealth.tsx` |
| Create | `frontend/src/hooks/useAdmin.ts` |
| Modify | `frontend/src/App.tsx` |
| Modify | `frontend/i18n/locales/en.json` |
| Modify | `frontend/i18n/locales/ar.json` |

---

## Implementation Order

1. **Admin Service & Controller** (Backend)
2. **Admin Route** (Backend)
3. **Frontend Logger** (Frontend)
4. **Admin Service** (Frontend)
5. **Admin Pages** (Frontend)
6. **i18n Updates** (Frontend)

---

## Schema Considerations

User model needs `isActive` field for ban functionality:

```prisma
model User {
  // ... existing
  isActive Boolean @default(true) @map("is_active")
}
```

Run `prisma db push` after adding.
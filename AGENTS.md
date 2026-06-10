# MultiReserve — Agent Guide

## Stack
- **Backend**: Java 21, Spring Boot 3.5.5, Maven, PostgreSQL, JPA/Hibernate, JWT (jjwt 0.12.5), Lombok, Springdoc OpenAPI 2.8.9
- **Frontend**: React 19, TypeScript 6, Vite 8, Tailwind 4, React Router 7, TanStack React Query 5, Recharts, Axios, Framer Motion

## Project Structure
```
multireserve/        — Spring Boot backend (REST API on :8080)
reservas-web/        — React frontend (SPA on :5173)
```

## Backend (`multireserve/`)

### Key setup before first run
1. `src/main/resources/application.properties` is required but **not committed**. You must create it with DB and JWT config. See existing file or sample below.
2. Create a PostgreSQL database named `multireserve` (or update the URL in properties).
3. Default admin user is seeded on startup: `admin@gmail.com` / `123456` (via `DataInitializer`).

### Commands
```bash
cd multireserve
./mvnw clean install       # build without tests
./mvnw spring-boot:run     # start dev server on :8080
```

### Required `application.properties`
```
spring.datasource.url=jdbc:postgresql://localhost:5432/multireserve
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
jwt.secret=<at least 256-bit key>
jwt.expiration=86400000
```

### Architecture notes
- Layers: `controller/` → `service/` → `repository/` (Spring Data JPA), plus `dto/`, `entity/`, `security/`, `config/`, `exception/`
- CORS is hardcoded in `SecurityConfig.java` for `http://localhost:5173`
- RBAC with roles: `ADMIN`, `EMPLOYEE`, `CLIENT`. Role stored as a claim in JWT, NOT in DB prefix (no `ROLE_` prefix expected by default).
- Endpoints: Swagger UI at `/swagger-ui.html`, API docs at `/api-docs`
- JWT is read from `Authorization: Bearer <token>` header via `JwtAuthenticationFilter`

## Frontend (`reservas-web/`)

### Commands
```bash
cd reservas-web
npm install          # install deps
npm run dev          # dev server on :5173 (proxies /api to :8080)
npm run build        # tsc -b && vite build
npm run lint         # eslint
```

### Architecture
- **State-based routing**: no React Router. `App.tsx` manages page via `useState("pageName")` and renders via `switch`.
- **HTTP**: custom `http<T>()` fetch wrapper in `src/api/http.ts` with auto JWT injection and 401 handling.
- **API layer**: `src/api/{entity}.ts` — typed functions per entity (e.g. `businessesApi.list()`, `coursesApi.create()`).
- **TanStack Query hooks**: `src/api/{entity}.queries.ts` — `useQuery`/`useMutation` wrappers with cache invalidation.
- **Auth**: `src/context/AuthContext.tsx` manages JWT + user state, persisted in localStorage.
- **Layout**: `src/layouts/MainLayout.tsx` takes `sidebar` + `content` props. `src/components/SidebarMenu.tsx` renders nav buttons.
- **Charts**: chart.js + react-chartjs-2 via `src/charts/SalesChart.tsx` and `src/charts/ProductsChart.tsx`.
- **Styling**: Tailwind CSS 4 + inline styles. `@import "tailwindcss"` in `index.css`.
- No `.env` needed — API base URL hardcoded in `src/api/http.ts` as `http://localhost:8080/api`.
- Route protection via `PrivateRoute.tsx` (shows `<LoginPage />` if no session).

### File structure
```
src/
├── api/
│   ├── http.ts              # generic fetch wrapper
│   ├── auth.ts              # login, register, updateProfile
│   ├── auth.queries.ts
│   ├── businesses.ts        # CRUD + search/filter endpoints
│   ├── businesses.queries.ts
│   ├── resources.ts
│   ├── resources.queries.ts
│   ├── reservations.ts
│   ├── reservations.queries.ts
│   ├── users.ts
│   ├── users.queries.ts
│   ├── courses.ts
│   ├── courses.queries.ts
│   ├── departments.ts
│   ├── departments.queries.ts
│   ├── dashboard.ts         # real API + mock fallback
│   └── dashboard.queries.ts
├── charts/
│   ├── SalesChart.tsx
│   └── ProductsChart.tsx
├── components/
│   ├── SidebarMenu.tsx
│   ├── PrivateRoute.tsx
│   ├── ConfirmModal.tsx
│   ├── layout/
│   └── dashboard/
├── context/
│   └── AuthContext.tsx
├── layouts/
│   └── MainLayout.tsx
├── mocks/
│   └── dashboard.mock.ts
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── CoursesPage.tsx
│   ├── BusinessManagement.tsx
│   ├── ResourceManagement.tsx
│   ├── ReservationManagement.tsx
│   ├── BusinessCatalog.tsx
│   ├── ClientReservations.tsx
│   ├── EmployeePanel.tsx
│   ├── ProfilePage.tsx
│   └── admin/
├── App.tsx                  # state-based router
└── main.tsx                 # AuthProvider + QueryClientProvider
```

## Conventions
- Backend uses Lombok (`@Data`, `@Builder`, etc.) — make sure annotation processor is enabled in IDE
- Backend uses `@PreAuthorize` with authority checks (no `ROLE_` prefix, e.g., `hasAuthority('ADMIN')`)
- Frontend uses named exports, not default exports (except `App.tsx` and `main.tsx`)
- Frontend TypeScript strict mode enabled

## Frontend Design System

Import from `src/utils/colors.ts` for all shared styles:

```tsx
import { colors, layout, buttons, statusBadges, emptyState, loadingSpinner } from "../utils/colors";
```

### Zinc Palette (all colors in `colors` object)
- `colors.bgApp`: `#09090b` (page background)
- `colors.bgCard`: `#131314` (card surface)
- `colors.bgCardAlt`: `#18181b` (alt card)
- `colors.bgInput`: `#111111` (input fields)
- `colors.border`: `#27272a` (card borders)
- `colors.textPrimary`: `#ffffff`
- `colors.textMuted`: `#a1a1aa`
- `colors.textDim`: `#71717a`
- `colors.primary`: `#2563eb`

### Page Layout Pattern
```
Icon + Title (28px, 800 weight) + Role Badge (inline)
Description (14px, textMuted)
[card: bgCard, borderRadius 16px, border 1px border, padding 28px]
  └─ section title (uppercase, 11px, 700, textMuted, letterSpacing 0.05em)
  └─ fields grid (1fr 1fr, gap 16px) — all fields same width
  └─ button row (flex-end, gap 12px): Cancel (secondary) + Save (primary)
```
Use `layout.page`, `layout.card`, `layout.field`, `layout.buttonRow`, etc.

### Buttons (`buttons` object)
- **Primary**: `buttons.primary` — `#2563eb` bg, white text, 8px radius, 12px 24px padding, 700 weight
- **Primary disabled**: `buttons.primaryDisabled` — `#27272a` bg, `#71717a` text
- **Secondary**: `buttons.secondary` — transparent bg, border, muted text, 600 weight
- **Inline actions**: `buttons.inline` — icon+label, 6px radius, 6px 14px padding

### Status Badges (`statusBadges` object)
```tsx
<span style={statusBadges.CONFIRMED}>
  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: statusBadges.CONFIRMED.color }} />
  Confirmada
</span>
```
Statuses: `CONFIRMED` (green), `PENDING` (yellow), `COMPLETED` (blue), `CANCELLED` (red), `REJECTED` (red)

### Empty State (`emptyState` object)
Icon (Inbox 44px, `#52525b`), title 16px 700, message 13px, centered within a card.

### Loading Spinner (`loadingSpinner` object)
Centered container + 40x40 spinner div with CSS `animation: spin 0.8s linear infinite`.
Add a `<style>` tag with `@keyframes spin { to { transform: rotate(360deg); } }` if not globally defined.

### Form Fields
All fields are `width: 100%` of their container. Pairs use `display: grid; gridTemplateColumns: "1fr 1fr"; gap: 16px`. No mixed widths within the same form row.

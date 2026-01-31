# Архитектура проекта "СберБанк Онлайн"

## Общая информация

Проект представляет собой полнофункциональный банковский веб-приложение, стилистически вдохновлённое СберБанк Онлайн.

## Структура проекта

Проект организован как **монорепозиторий** с разделением на frontend и backend:

```
sber-bank-online/
├── apps/
│   ├── web/                    # React + TypeScript фронтенд
│   │   ├── src/
│   │   │   ├── components/     # React компоненты
│   │   │   ├── pages/          # Страницы приложения
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── store/          # State management (Zustand)
│   │   │   ├── services/       # API сервисы
│   │   │   ├── utils/          # Утилиты
│   │   │   ├── types/          # TypeScript типы
│   │   │   ├── styles/         # Глобальные стили
│   │   │   └── App.tsx
│   │   ├── public/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   └── api/                    # Node.js бэкенд
│       ├── src/
│       │   ├── controllers/    # Контроллеры
│       │   ├── models/         # Модели данных (Prisma)
│       │   ├── routes/         # API роуты
│       │   ├── middleware/     # Middleware
│       │   ├── services/       # Бизнес-логика
│       │   ├── utils/          # Утилиты
│       │   ├── config/         # Конфигурация
│       │   └── app.ts
│       ├── prisma/
│       │   └── schema.prisma   # Схема базы данных
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── shared/                 # Общие типы и утилиты
│   │   ├── src/
│   │   └── package.json
│   └── ui/                     # UI компоненты (опционально)
│       ├── src/
│       └── package.json
│
├── docs/                       # Документация
├── docker-compose.yml
├── turbo.json                  # Turborepo конфигурация
└── package.json                # Root package.json
```

## Технологический стек

### Frontend

| Технология | Назначение | Обоснование |
|------------|------------|-------------|
| **React 18** | UI библиотека | Стандарт индустрии, большое комьюнити |
| **TypeScript** | Типизация | Безопасность кода, лучший DX |
| **Vite** | Сборщик | Быстрая сборка, HMR, современный |
| **React Router v6** | Роутинг | Декларативный роутинг, data API |
| **Zustand** | State management | Лёгкий, производительный, простой API |
| **TanStack Query** | Серверный state | Кэширование, фоновые обновления |
| **Tailwind CSS** | Стилизация | Utility-first, быстрая разработка |
| **shadcn/ui** | UI компоненты | Кастомизируемые, доступные компоненты |
| **React Hook Form** | Формы | Производительность, валидация |
| **Zod** | Валидация | TypeScript-first схемы |
| **Recharts** | Графики | Простой API для финансовых графиков |

### Backend

| Технология | Назначение | Обоснование |
|------------|------------|-------------|
| **Node.js + Express** | Сервер | Зрелая экосистема, простота |
| **TypeScript** | Типизация | Единообразие с фронтендом |
| **Prisma** | ORM | Type-safe запросы, миграции |
| **PostgreSQL** | База данных | Надёжная, масштабируемая |
| **Redis** | Кэш / Сессии | Высокая производительность |
| **JWT** | Аутентификация | Stateless, масштабируемый |
| **bcrypt** | Хеширование | Безопасность паролей |
| **Winston** | Логирование | Гибкое логирование |
| **Helmet** | Безопасность | Защита HTTP заголовков |
| **Rate Limit** | Защита от DDoS | Ограничение запросов |

## Архитектура Frontend

### Компонентная структура

```
src/components/
├── ui/                         # Базовые UI компоненты
│   ├── Button/
│   ├── Input/
│   ├── Card/
│   ├── Modal/
│   ├── Select/
│   ├── Tabs/
│   └── ...
│
├── layout/                     # Компоненты раскладки
│   ├── MainLayout/
│   ├── Sidebar/
│   ├── Header/
│   └── Footer/
│
├── features/                   # Фича-компоненты
│   ├── auth/
│   │   ├── LoginForm/
│   │   ├── RegisterForm/
│   │   └── AuthGuard/
│   ├── accounts/
│   │   ├── AccountCard/
│   │   ├── AccountList/
│   │   └── AccountDetails/
│   ├── transfers/
│   │   ├── TransferForm/
│   │   ├── ContactList/
│   │   └── PaymentTemplates/
│   ├── transactions/
│   │   ├── TransactionList/
│   │   ├── TransactionFilter/
│   │   └── TransactionDetails/
│   └── dashboard/
│       ├── BalanceWidget/
│       ├── QuickActions/
│       └── RecentActivity/
│
└── common/                     # Общие компоненты
    ├── Loading/
    ├── ErrorBoundary/
    ├── ProtectedRoute/
    └── PageTransition/
```

### State Management

Используем **Zustand** для глобального состояния:

```typescript
// store/authStore.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

// store/uiStore.ts
interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
  toggleSidebar: () => void;
}
```

**TanStack Query** для серверного состояния:
- Кэширование API ответов
- Автоматические фоновые обновления
- Оптимистичные обновления

### Routing структура

```typescript
// Роуты приложения
const routes = [
  // Публичные роуты
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  
  // Защищённые роуты
  {
    path: '/app',
    element: <ProtectedRoute />,
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'accounts', element: <AccountsPage /> },
      { path: 'accounts/:id', element: <AccountDetailsPage /> },
      { path: 'transfers', element: <TransfersPage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'settings', element: <SettingsPage /> },
    ]
  }
];
```

## Архитектура Backend

### Структура API

```
src/
├── config/
│   ├── database.ts            # Подключение к БД
│   ├── redis.ts               # Подключение к Redis
│   └── env.ts                 # Переменные окружения
│
├── controllers/
│   ├── authController.ts
│   ├── accountController.ts
│   ├── transferController.ts
│   ├── transactionController.ts
│   └── userController.ts
│
├── routes/
│   ├── auth.routes.ts
│   ├── account.routes.ts
│   ├── transfer.routes.ts
│   ├── transaction.routes.ts
│   └── index.ts
│
├── middleware/
│   ├── auth.middleware.ts     # JWT verification
│   ├── error.middleware.ts    # Error handling
│   ├── rateLimit.middleware.ts
│   └── validation.middleware.ts
│
├── services/
│   ├── auth.service.ts
│   ├── account.service.ts
│   ├── transfer.service.ts
│   └── notification.service.ts
│
├── utils/
│   ├── jwt.ts
│   ├── password.ts
│   ├── validators.ts
│   └── logger.ts
│
└── types/
    └── index.ts
```

### API Endpoints

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password

GET    /api/v1/accounts
POST   /api/v1/accounts
GET    /api/v1/accounts/:id
PATCH  /api/v1/accounts/:id
DELETE /api/v1/accounts/:id

POST   /api/v1/transfers
GET    /api/v1/transfers/history
GET    /api/v1/transfers/:id

GET    /api/v1/transactions
GET    /api/v1/transactions/:id

GET    /api/v1/user/profile
PATCH  /api/v1/user/profile
GET    /api/v1/user/settings
PATCH  /api/v1/user/settings
```

### Модели данных (Prisma)

```prisma
// Основные сущности
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  phone     String   @unique
  password  String
  firstName String
  lastName  String
  patronymic String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  accounts      Account[]
  sessions      Session[]
  transactions  Transaction[]
  settings      UserSettings?
}

model Account {
  id            String   @id @default(uuid())
  userId        String
  type          AccountType
  number        String   @unique
  balance       Decimal  @default(0)
  currency      String   @default("RUB")
  name          String?
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  
  user          User     @relation(fields: [userId], references: [id])
  cards         Card[]
  fromTransactions Transaction[] @relation("FromAccount")
  toTransactions   Transaction[] @relation("ToAccount")
}

model Card {
  id            String   @id @default(uuid())
  accountId     String
  number        String   @unique
  expiryDate    DateTime
  cvv           String
  holderName    String
  isVirtual     Boolean  @default(false)
  isBlocked     Boolean  @default(false)
  
  account       Account  @relation(fields: [accountId], references: [id])
}

model Transaction {
  id            String   @id @default(uuid())
  fromAccountId String?
  toAccountId   String?
  amount        Decimal
  currency      String
  type          TransactionType
  status        TransactionStatus
  description   String?
  createdAt     DateTime @default(now())
  
  fromAccount   Account? @relation("FromAccount", fields: [fromAccountId], references: [id])
  toAccount     Account? @relation("ToAccount", fields: [toAccountId], references: [id])
}
```

### Аутентификация и авторизация

**JWT-based аутентификация:**

1. **Access Token**: Короткоживущий (15 мин), хранится в памяти
2. **Refresh Token**: Долгоживущий (7 дней), хранится в httpOnly cookie

**Flow:**
```
1. Login → Access + Refresh tokens
2. Access token в заголовке Authorization
3. Refresh token в httpOnly cookie
4. При истечении access → refresh endpoint
5. Logout → инвалидация refresh в Redis
```

**Защита:**
- Rate limiting (5 попыток входа за 15 мин)
- Helmet для security headers
- CORS настроен для конкретного origin
- Password hashing с bcrypt (10 rounds)

## База данных

### PostgreSQL

**Выбор обоснован:**
- ACID compliance для финансовых операций
- Поддержка JSON для гибких данных
- Отличная производительность
- Масштабируемость

### Redis

**Использование:**
- Сессии пользователей
- Rate limiting
- Кэш часто запрашиваемых данных
- Pub/sub для real-time уведомлений

## Масштабируемость

### Горизонтальное масштабирование

- Stateless backend (JWT аутентификация)
- Redis для shared сессий
- PostgreSQL репликация

### Оптимизации

- API response кэширование
- Database indexing
- Lazy loading компонентов
- Image optimization
- CDN для статики

## Безопасность

### Меры защиты

1. **HTTPS** everywhere
2. **CORS** строгие настройки
3. **Helmet** security headers
4. **Rate limiting** на все endpoints
5. **Input validation** с Zod
6. **SQL injection** защита (Prisma)
7. **XSS** защита (React escaping)
8. **CSRF** защита (SameSite cookies)

### Финансовая безопасность

- Подтверждение операций через SMS/пуш
- Лимиты на переводы
- Логирование всех операций
- Мониторинг подозрительной активности

## Деплой

### Docker Compose конфигурация

```yaml
version: '3.8'
services:
  web:
    build: ./apps/web
    ports:
      - "3000:3000"
  
  api:
    build: ./apps/api
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=postgresql://...
      - REDIS_URL=redis://redis:6379
  
  postgres:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
```

## Мониторинг

- **Логирование**: Winston + centralized logs
- **Метрики**: Prometheus + Grafana
- **APM**: Sentry для ошибок
- **Health checks**: /health endpoint

---

*Документ создан: 2026-01-30*
*Версия: 1.0*

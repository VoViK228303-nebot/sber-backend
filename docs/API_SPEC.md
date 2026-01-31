# API Specification

## Базовая информация

- **Base URL:** `https://api.sberbank-online.example/v1`
- **Формат:** JSON
- **Кодировка:** UTF-8
- **Аутентификация:** JWT Bearer Token

## Аутентификация

### Получение токена

Все защищённые endpoints требуют заголовок:
```
Authorization: Bearer <access_token>
```

## Общие ответы

### Успешный ответ (200 OK)
```json
{
  "success": true,
  "data": { ... }
}
```

### Ошибка (4xx/5xx)
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { ... }
  }
}
```

### HTTP Status Codes

| Код | Описание |
|-----|----------|
| 200 | OK - Успешный запрос |
| 201 | Created - Ресурс создан |
| 400 | Bad Request - Неверные параметры |
| 401 | Unauthorized - Не авторизован |
| 403 | Forbidden - Нет доступа |
| 404 | Not Found - Ресурс не найден |
| 422 | Unprocessable Entity - Ошибка валидации |
| 429 | Too Many Requests - Превышен лимит |
| 500 | Internal Server Error - Ошибка сервера |

---

## Auth Endpoints

### POST /auth/register

Регистрация нового пользователя.

**Request:**
```json
{
  "email": "user@example.com",
  "phone": "+79001234567",
  "password": "SecurePass123!",
  "firstName": "Иван",
  "lastName": "Иванов",
  "patronymic": "Иванович"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "phone": "+79001234567",
      "firstName": "Иван",
      "lastName": "Иванов",
      "createdAt": "2026-01-30T12:00:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Errors:**
- `EMAIL_EXISTS` - Email уже зарегистрирован
- `PHONE_EXISTS` - Телефон уже зарегистрирован
- `WEAK_PASSWORD` - Слабый пароль

---

### POST /auth/login

Авторизация пользователя.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "Иван",
      "lastName": "Иванов"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Errors:**
- `INVALID_CREDENTIALS` - Неверные учётные данные
- `ACCOUNT_BLOCKED` - Аккаунт заблокирован

---

### POST /auth/logout

Выход из системы (инвалидация refresh token).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Successfully logged out"
  }
}
```

---

### POST /auth/refresh

Обновление access token.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Errors:**
- `INVALID_REFRESH_TOKEN` - Невалидный refresh token
- `REFRESH_TOKEN_EXPIRED` - Refresh token истёк

---

### POST /auth/forgot-password

Запрос на сброс пароля.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Password reset instructions sent"
  }
}
```

---

### POST /auth/reset-password

Сброс пароля по токену.

**Request:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Password successfully reset"
  }
}
```

---

## Accounts Endpoints

### GET /accounts

Получение списка счетов пользователя.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
| Параметр | Тип | Описание |
|----------|-----|----------|
| type | string | Фильтр по типу (debit, credit, savings) |
| currency | string | Фильтр по валюте |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accounts": [
      {
        "id": "acc_uuid_1",
        "type": "debit",
        "number": "40817810100001234567",
        "maskedNumber": "**** 4567",
        "balance": 125000.50,
        "currency": "RUB",
        "name": "Основной счёт",
        "isActive": true,
        "createdAt": "2026-01-15T10:00:00Z",
        "cards": [
          {
            "id": "card_uuid_1",
            "number": "4276123456781234",
            "maskedNumber": "**** 1234",
            "expiryDate": "12/28",
            "holderName": "IVAN IVANOV",
            "isVirtual": false,
            "isBlocked": false
          }
        ]
      }
    ]
  }
}
```

---

### GET /accounts/:id

Получение деталей счёта.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "account": {
      "id": "acc_uuid_1",
      "type": "debit",
      "number": "40817810100001234567",
      "maskedNumber": "**** 4567",
      "balance": 125000.50,
      "availableBalance": 125000.50,
      "currency": "RUB",
      "name": "Основной счёт",
      "isActive": true,
      "openedAt": "2026-01-15T10:00:00Z",
      "cards": [...],
      "limits": {
        "dailyTransferLimit": 500000,
        "dailyWithdrawalLimit": 150000
      }
    }
  }
}
```

---

### POST /accounts

Открытие нового счёта.

**Request:**
```json
{
  "type": "savings",
  "currency": "RUB",
  "name": "Накопительный счёт"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "account": {
      "id": "acc_uuid_new",
      "type": "savings",
      "number": "40817810100007654321",
      "maskedNumber": "**** 4321",
      "balance": 0,
      "currency": "RUB",
      "name": "Накопительный счёт",
      "isActive": true,
      "createdAt": "2026-01-30T12:00:00Z"
    }
  }
}
```

---

### PATCH /accounts/:id

Обновление данных счёта.

**Request:**
```json
{
  "name": "Новое название"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "account": {
      "id": "acc_uuid_1",
      "name": "Новое название"
    }
  }
}
```

---

### POST /accounts/:id/close

Закрытие счёта.

**Request:**
```json
{
  "transferToAccountId": "acc_uuid_2"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Account successfully closed"
  }
}
```

---

## Transfers Endpoints

### POST /transfers

Создание перевода.

**Request:**
```json
{
  "fromAccountId": "acc_uuid_1",
  "toAccountNumber": "40817810100007654321",
  "amount": 5000,
  "currency": "RUB",
  "description": "За обед",
  "recipientName": "Петр Петров"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "transfer": {
      "id": "transfer_uuid",
      "fromAccountId": "acc_uuid_1",
      "toAccountNumber": "40817810100007654321",
      "amount": 5000,
      "currency": "RUB",
      "description": "За обед",
      "status": "completed",
      "createdAt": "2026-01-30T12:00:00Z",
      "completedAt": "2026-01-30T12:00:01Z"
    },
    "newBalance": 120000.50
  }
}
```

**Errors:**
- `INSUFFICIENT_FUNDS` - Недостаточно средств
- `INVALID_ACCOUNT` - Неверный счёт получателя
- `LIMIT_EXCEEDED` - Превышен лимит перевода

---

### GET /transfers/history

История переводов.

**Query Parameters:**
| Параметр | Тип | Описание |
|----------|-----|----------|
| accountId | string | ID счёта |
| from | date | Дата начала (ISO 8601) |
| to | date | Дата окончания |
| type | string | incoming, outgoing |
| limit | number | Количество записей (default: 20) |
| offset | number | Смещение для пагинации |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transfers": [
      {
        "id": "transfer_uuid",
        "type": "outgoing",
        "amount": 5000,
        "currency": "RUB",
        "description": "За обед",
        "recipientName": "Петр Петров",
        "status": "completed",
        "createdAt": "2026-01-30T12:00:00Z"
      }
    ],
    "pagination": {
      "total": 150,
      "limit": 20,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

---

### GET /transfers/:id

Детали перевода.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transfer": {
      "id": "transfer_uuid",
      "fromAccount": {
        "id": "acc_uuid_1",
        "maskedNumber": "**** 4567"
      },
      "toAccountNumber": "40817810100007654321",
      "recipientName": "Петр Петров",
      "amount": 5000,
      "currency": "RUB",
      "description": "За обед",
      "status": "completed",
      "commission": 0,
      "createdAt": "2026-01-30T12:00:00Z",
      "completedAt": "2026-01-30T12:00:01Z"
    }
  }
}
```

---

## Transactions Endpoints

### GET /transactions

История операций по счёту.

**Query Parameters:**
| Параметр | Тип | Описание |
|----------|-----|----------|
| accountId | string | ID счёта |
| category | string | Категория операции |
| from | date | Дата начала |
| to | date | Дата окончания |
| minAmount | number | Минимальная сумма |
| maxAmount | number | Максимальная сумма |
| limit | number | Лимит записей |
| offset | number | Смещение |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "txn_uuid",
        "accountId": "acc_uuid_1",
        "type": "debit",
        "amount": 1500,
        "currency": "RUB",
        "description": "Пятёрочка",
        "category": "groceries",
        "merchant": {
          "name": "Пятёрочка",
          "logo": "https://..."
        },
        "balanceAfter": 123500.50,
        "createdAt": "2026-01-30T10:30:00Z"
      }
    ],
    "summary": {
      "income": 150000,
      "expense": 25000
    },
    "pagination": {
      "total": 250,
      "limit": 20,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

---

### GET /transactions/:id

Детали операции.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "txn_uuid",
      "accountId": "acc_uuid_1",
      "type": "debit",
      "amount": 1500,
      "currency": "RUB",
      "description": "Пятёрочка",
      "category": "groceries",
      "merchant": {
        "name": "Пятёрочка",
        "address": "ул. Ленина, 1",
        "logo": "https://..."
      },
      "receipt": {
        "id": "receipt_uuid",
        "url": "https://..."
      },
      "balanceAfter": 123500.50,
      "createdAt": "2026-01-30T10:30:00Z"
    }
  }
}
```

---

### GET /transactions/categories

Получение списка категорий.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "groceries",
        "name": "Продукты",
        "icon": "shopping-cart",
        "color": "#21A038"
      },
      {
        "id": "transport",
        "name": "Транспорт",
        "icon": "bus",
        "color": "#007AFF"
      },
      {
        "id": "entertainment",
        "name": "Развлечения",
        "icon": "film",
        "color": "#FF9F0A"
      }
    ]
  }
}
```

---

## User Endpoints

### GET /user/profile

Получение профиля пользователя.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "phone": "+79001234567",
      "firstName": "Иван",
      "lastName": "Иванов",
      "patronymic": "Иванович",
      "fullName": "Иванов Иван Иванович",
      "avatar": "https://...",
      "verified": true,
      "createdAt": "2026-01-15T10:00:00Z"
    }
  }
}
```

---

### PATCH /user/profile

Обновление профиля.

**Request:**
```json
{
  "firstName": "Иван",
  "lastName": "Иванов",
  "patronymic": "Иванович",
  "avatar": "base64_encoded_image"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "firstName": "Иван",
      "lastName": "Иванов",
      "patronymic": "Иванович",
      "avatar": "https://..."
    }
  }
}
```

---

### GET /user/settings

Настройки пользователя.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "settings": {
      "notifications": {
        "email": true,
        "sms": true,
        "push": true,
        "transactionAlerts": true,
        "marketingEmails": false
      },
      "security": {
        "twoFactorEnabled": false,
        "loginNotifications": true,
        "sessionTimeout": 30
      },
      "interface": {
        "language": "ru",
        "theme": "light",
        "compactMode": false
      }
    }
  }
}
```

---

### PATCH /user/settings

Обновление настроек.

**Request:**
```json
{
  "notifications": {
    "email": false
  },
  "interface": {
    "theme": "dark"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "settings": {
      "notifications": {
        "email": false,
        "sms": true,
        "push": true
      },
      "interface": {
        "theme": "dark",
        "language": "ru"
      }
    }
  }
}
```

---

### POST /user/change-password

Смена пароля.

**Request:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Password successfully changed"
  }
}
```

---

### GET /user/sessions

Активные сессии.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "session_uuid",
        "device": "Chrome on Windows",
        "ip": "192.168.1.1",
        "location": "Moscow, Russia",
        "current": true,
        "lastActive": "2026-01-30T12:00:00Z"
      }
    ]
  }
}
```

---

### DELETE /user/sessions/:id

Завершение сессии.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Session terminated"
  }
}
```

---

## Dashboard Endpoints

### GET /dashboard

Данные для дашборда.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalBalance": {
      "amount": 125000.50,
      "currency": "RUB"
    },
    "accounts": [
      {
        "id": "acc_uuid_1",
        "type": "debit",
        "maskedNumber": "**** 4567",
        "balance": 125000.50,
        "currency": "RUB"
      }
    ],
    "quickActions": [
      {
        "id": "transfer",
        "name": "Перевод",
        "icon": "arrow-left-right",
        "route": "/transfers"
      },
      {
        "id": "payment",
        "name": "Оплата",
        "icon": "credit-card",
        "route": "/payments"
      },
      {
        "id": "history",
        "name": "История",
        "icon": "history",
        "route": "/history"
      }
    ],
    "recentTransactions": [
      {
        "id": "txn_uuid",
        "type": "debit",
        "amount": 1500,
        "description": "Пятёрочка",
        "createdAt": "2026-01-30T10:30:00Z"
      }
    ],
    "spendingChart": {
      "period": "month",
      "data": [
        { "category": "groceries", "amount": 15000 },
        { "category": "transport", "amount": 5000 },
        { "category": "entertainment", "amount": 8000 }
      ]
    }
  }
}
```

---

## WebSocket Events

Для real-time обновлений используется WebSocket соединение.

### Подключение

```javascript
const ws = new WebSocket('wss://api.sberbank-online.example/ws');

// Аутентификация
ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'auth',
    token: 'access_token'
  }));
};
```

### События от сервера

#### transaction.new
```json
{
  "type": "transaction.new",
  "data": {
    "transaction": {
      "id": "txn_uuid",
      "accountId": "acc_uuid_1",
      "type": "credit",
      "amount": 50000,
      "description": "Зачисление зарплаты"
    }
  }
}
```

#### transfer.completed
```json
{
  "type": "transfer.completed",
  "data": {
    "transferId": "transfer_uuid",
    "status": "completed",
    "newBalance": 120000.50
  }
}
```

#### notification.new
```json
{
  "type": "notification.new",
  "data": {
    "notification": {
      "id": "notif_uuid",
      "type": "security",
      "title": "Новый вход",
      "message": "Выполнен вход с нового устройства",
      "createdAt": "2026-01-30T12:00:00Z"
    }
  }
}
```

---

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| POST /auth/login | 5 | 15 minutes |
| POST /auth/register | 3 | 1 hour |
| POST /transfers | 10 | 1 minute |
| All other | 100 | 1 minute |

---

## Пагинация

Для endpoints с пагинацией используется cursor-based подход:

**Request:**
```
GET /transactions?limit=20&cursor=eyJpZCI6InR4bl91dWlkIn0
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [...],
    "pagination": {
      "nextCursor": "eyJpZCI6InR4bl91dWlkXzIifQ",
      "hasMore": true
    }
  }
}
```

---

*Документ создан: 2026-01-30*
*Версия: 1.0*

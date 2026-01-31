# Дизайн-система "СберБанк Онлайн"

## Общая концепция

Дизайн-система основана на принципах СберБанк Онлайн: чистый, современный интерфейс с фирменной зелёной цветовой палитрой, акцент на удобстве использования и доступности.

## Цветовая палитра

### Основные цвета (Primary)

| Название | HEX | RGB | Использование |
|----------|-----|-----|---------------|
| **Sber Green** | `#21A038` | rgb(33, 160, 56) | Основной брендовый цвет |
| **Sber Green Dark** | `#1A8030` | rgb(26, 128, 48) | Hover состояния |
| **Sber Green Light** | `#E6F4E9` | rgb(230, 244, 233) | Фоны, бейджи |
| **Sber Green Pale** | `#F0F9F2` | rgb(240, 249, 242) | Лёгкие фоны |

### Вторичные цвета (Secondary)

| Название | HEX | RGB | Использование |
|----------|-----|-----|---------------|
| **Dark** | `#1A1A1A` | rgb(26, 26, 26) | Основной текст |
| **Gray 900** | `#2D2D2D` | rgb(45, 45, 45) | Заголовки |
| **Gray 800** | `#4A4A4A` | rgb(74, 74, 74) | Вторичный текст |
| **Gray 600** | `#6B6B6B` | rgb(107, 107, 107) | Подписи |
| **Gray 400** | `#9E9E9E` | rgb(158, 158, 158) | Placeholder |
| **Gray 200** | `#E0E0E0` | rgb(224, 224, 224) | Границы |
| **Gray 100** | `#F5F5F5` | rgb(245, 245, 245) | Фоны секций |
| **White** | `#FFFFFF` | rgb(255, 255, 255) | Фон страницы |

### Функциональные цвета

| Название | HEX | RGB | Использование |
|----------|-----|-----|---------------|
| **Success** | `#21A038` | rgb(33, 160, 56) | Успешные операции |
| **Warning** | `#FF9F0A` | rgb(255, 159, 10) | Предупреждения |
| **Error** | `#FF3B30` | rgb(255, 59, 48) | Ошибки |
| **Info** | `#007AFF` | rgb(0, 122, 255) | Информация |

### Цвета для финансовых данных

| Название | HEX | RGB | Использование |
|----------|-----|-----|---------------|
| **Income** | `#21A038` | rgb(33, 160, 56) | Поступления |
| **Expense** | `#FF3B30` | rgb(255, 59, 48) | Списания |
| **Neutral** | `#6B6B6B` | rgb(107, 107, 107) | Нейтральные операции |

### Градиенты

```css
/* Основной градиент */
--gradient-primary: linear-gradient(135deg, #21A038 0%, #1A8030 100%);

/* Градиент для карточек */
--gradient-card: linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%);

/* Градиент для премиум */
--gradient-premium: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%);
```

## Типографика

### Шрифты

**Основной шрифт:** `Inter` или `SF Pro Display` (system-ui fallback)

```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-mono: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
```

### Размеры шрифтов

| Название | Размер | Вес | Line-height | Использование |
|----------|--------|-----|-------------|---------------|
| **H1** | 32px / 2rem | 700 | 1.2 | Главные заголовки |
| **H2** | 24px / 1.5rem | 600 | 1.3 | Заголовки секций |
| **H3** | 20px / 1.25rem | 600 | 1.4 | Подзаголовки |
| **H4** | 18px / 1.125rem | 600 | 1.4 | Карточки |
| **Body Large** | 17px / 1.0625rem | 400 | 1.5 | Основной текст |
| **Body** | 15px / 0.9375rem | 400 | 1.5 | Обычный текст |
| **Body Small** | 13px / 0.8125rem | 400 | 1.5 | Вторичный текст |
| **Caption** | 12px / 0.75rem | 500 | 1.4 | Подписи, бейджи |
| **Button** | 15px / 0.9375rem | 500 | 1 | Кнопки |

### Tailwind конфигурация

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        sber: {
          DEFAULT: '#21A038',
          dark: '#1A8030',
          light: '#E6F4E9',
          pale: '#F0F9F2',
        },
        dark: '#1A1A1A',
        gray: {
          900: '#2D2D2D',
          800: '#4A4A4A',
          600: '#6B6B6B',
          400: '#9E9E9E',
          200: '#E0E0E0',
          100: '#F5F5F5',
        },
        success: '#21A038',
        warning: '#FF9F0A',
        error: '#FF3B30',
        info: '#007AFF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'monospace'],
      },
      fontSize: {
        'h1': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'h4': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['17px', { lineHeight: '1.5', fontWeight: '400' }],
        'body': ['15px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.4', fontWeight: '500' }],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
    },
  },
};
```

## Компоненты

### Кнопки (Buttons)

#### Primary Button

```
Фон: #21A038
Текст: #FFFFFF
Border-radius: 12px
Padding: 12px 24px
Font-size: 15px
Font-weight: 500
Hover: #1A8030
Active: scale(0.98)
Disabled: opacity 0.5, cursor not-allowed
```

#### Secondary Button

```
Фон: transparent
Border: 1px solid #E0E0E0
Текст: #1A1A1A
Border-radius: 12px
Padding: 12px 24px
Hover: background #F5F5F5
```

#### Ghost Button

```
Фон: transparent
Текст: #21A038
Padding: 12px 24px
Hover: background #E6F4E9
```

#### Icon Button

```
Размер: 40px x 40px
Border-radius: 12px
Фон: #F5F5F5
Hover: #E0E0E0
```

### Карточки (Cards)

#### Account Card

```
Фон: #FFFFFF
Border-radius: 16px
Padding: 20px
Box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08)
Border: 1px solid #F5F5F5
Hover: box-shadow 0 8px 24px rgba(0, 0, 0, 0.12)
```

#### Product Card (кредиты, вклады)

```
Фон: linear-gradient(135deg, #21A038 0%, #1A8030 100%)
Border-radius: 20px
Padding: 24px
Текст: #FFFFFF
```

#### Info Card

```
Фон: #F5F5F5
Border-radius: 12px
Padding: 16px
```

### Формы (Forms)

#### Input

```
Height: 48px
Border: 1px solid #E0E0E0
Border-radius: 12px
Padding: 0 16px
Font-size: 15px
Background: #FFFFFF

Focus:
  Border: 1px solid #21A038
  Box-shadow: 0 0 0 3px rgba(33, 160, 56, 0.1)

Error:
  Border: 1px solid #FF3B30
  Background: #FFF5F5
```

#### Select

```
Height: 48px
Border: 1px solid #E0E0E0
Border-radius: 12px
Padding: 0 16px
Background: #FFFFFF
Arrow: ChevronDown icon
```

#### Checkbox

```
Size: 20px x 20px
Border-radius: 6px
Border: 2px solid #E0E0E0
Checked: background #21A038, border #21A038
Checkmark: white
```

### Навигация (Navigation)

#### Sidebar

```
Width: 280px (desktop) / 100% (mobile)
Background: #FFFFFF
Border-right: 1px solid #E0E0E0
Padding: 24px 16px

Item:
  Height: 44px
  Border-radius: 12px
  Padding: 0 16px
  
  Active:
    Background: #E6F4E9
    Color: #21A038
    
  Hover (inactive):
    Background: #F5F5F5
```

#### Top Navigation (Mobile)

```
Height: 56px
Background: #FFFFFF
Border-bottom: 1px solid #E0E0E0
Padding: 0 16px
```

#### Bottom Navigation (Mobile)

```
Height: 64px
Background: #FFFFFF
Border-top: 1px solid #E0E0E0
Box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05)

Item:
  Icon: 24px
  Label: 11px
  Active color: #21A038
  Inactive color: #9E9E9E
```

### Модальные окна (Modals)

```
Overlay: rgba(0, 0, 0, 0.5)
Backdrop-filter: blur(4px)

Content:
  Background: #FFFFFF
  Border-radius: 20px
  Padding: 24px
  Max-width: 480px
  Box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25)

Animation:
  Enter: opacity 0→1, scale 0.95→1
  Exit: opacity 1→0, scale 1→0.95
  Duration: 200ms
  Easing: ease-out
```

### Тосты / Уведомления (Toasts)

```
Position: top-right (desktop) / top (mobile)
Gap: 12px
Max-width: 400px

Toast:
  Background: #FFFFFF
  Border-radius: 12px
  Padding: 16px
  Box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
  Border-left: 4px solid

  Success: border #21A038
  Error: border #FF3B30
  Warning: border #FF9F0A
  Info: border #007AFF
```

### Бейджи (Badges)

```
Height: 24px
Padding: 0 10px
Border-radius: 12px
Font-size: 12px
Font-weight: 500

Success: bg #E6F4E9, text #21A038
Error: bg #FFF5F5, text #FF3B30
Warning: bg #FFF9E6, text #FF9F0A
Info: bg #E6F2FF, text #007AFF
```

## Layout

### Контейнеры

```
Container max-width:
  - Mobile: 100% (padding 16px)
  - Tablet: 720px
  - Desktop: 1200px
  - Large: 1400px

Page padding:
  - Mobile: 16px
  - Tablet: 24px
  - Desktop: 32px
```

### Сетка (Grid)

```
Dashboard grid:
  - Desktop: 3 columns (1fr 1fr 1fr)
  - Tablet: 2 columns
  - Mobile: 1 column

Gap: 16px (mobile) / 24px (desktop)
```

### Отступы (Spacing Scale)

```
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
```

## Анимации

### Переходы

```css
/* Базовый transition */
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;

/* Hover эффекты */
--hover-transform: scale(0.98);
--hover-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
```

### Keyframes

```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up */
@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(10px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pulse (для уведомлений) */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Spinner */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

## Иконки

**Библиотека:** Lucide React

**Размеры:**
- Small: 16px
- Medium: 20px (default)
- Large: 24px
- XLarge: 32px

**Ключевые иконки:**
- Home, Wallet, CreditCard, ArrowLeftRight (переводы)
- History, Settings, User, Bell
- ChevronLeft, ChevronRight, ChevronDown
- Plus, Minus, X, Check
- Search, Filter, MoreVertical

## Responsive Breakpoints

```javascript
// Tailwind breakpoints
screens: {
  'sm': '640px',   // Mobile landscape
  'md': '768px',   // Tablet
  'lg': '1024px',  // Desktop
  'xl': '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
}
```

### Mobile-first подход

```css
/* Базовые стили для mobile */
.sidebar {
  position: fixed;
  left: -100%;
  width: 100%;
  height: 100vh;
}

/* Tablet и выше */
@media (min-width: 768px) {
  .sidebar {
    position: static;
    width: 280px;
    left: 0;
  }
}
```

## Доступность (Accessibility)

### Контрастность

- Основной текст: 4.5:1 минимум
- Крупный текст: 3:1 минимум
- Интерактивные элементы: 3:1 минимум

### Фокус-стили

```css
:focus-visible {
  outline: 2px solid #21A038;
  outline-offset: 2px;
}
```

### ARIA атрибуты

- Все интерактивные элементы имеют accessible names
- Иконки с aria-hidden="true"
- Состояния loading/disabled корректно анонсируются
- Модальные окна с role="dialog" и aria-modal="true"

## Примеры компонентов

### Account Card Component

```tsx
interface AccountCardProps {
  accountNumber: string;
  balance: number;
  currency: string;
  name?: string;
  type: 'debit' | 'credit' | 'savings';
}

// Структура:
// ┌─────────────────────────────┐
// │  [Icon]  Account Name       │
// │          **** 1234          │
// │                             │
// │  125 000 ₽                  │
// │  Доступно                   │
// └─────────────────────────────┘
```

### Transfer Form Component

```tsx
interface TransferFormProps {
  fromAccount: string;
  onSubmit: (data: TransferData) => void;
}

// Структура:
// ┌─────────────────────────────┐
// │  Счёт списания              │
// │  [Select ▼]                 │
// │                             │
// │  Получатель                 │
// │  [Input]                    │
// │                             │
// │  Сумма                      │
// │  [Input] [RUB]              │
// │                             │
// │  [Перевести]                │
// └─────────────────────────────┘
```

---

*Документ создан: 2026-01-30*
*Версия: 1.0*

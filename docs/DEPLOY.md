# Деплой фронтенда на Vercel

## Предварительные требования

- Аккаунт на [Vercel](https://vercel.com)
- Установленный [Vercel CLI](https://vercel.com/docs/cli) (опционально)
- Доступ к репозиторию проекта

## Настройка проекта

### 1. Проверка конфигурации

Проект уже настроен для деплоя на Vercel:

- [`vercel.json`](../vercel.json) - конфигурация деплоя
- [`apps/web/package.json`](../apps/web/package.json) - скрипт `build` настроен

### 2. Переменные окружения

Фронтенд использует следующие переменные окружения (см. [`apps/web/.env.example`](../apps/web/.env.example)):

```env
VITE_API_URL=http://localhost:3001/api
```

При деплое на Vercel нужно указать URL вашего бэкенда:

```env
VITE_API_URL=https://your-api-domain.com/api
```

## Способы деплоя

### Способ 1: Через Vercel Dashboard (рекомендуется)

1. Зайдите на [vercel.com](https://vercel.com) и авторизуйтесь
2. Нажмите "Add New Project"
3. Импортируйте репозиторий с GitHub/GitLab/Bitbucket
4. Настройте проект:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (корень проекта)
   - **Build Command**: `cd apps/web && npm run build`
   - **Output Directory**: `apps/web/dist`
   - **Install Command**: `npm install`
5. Добавьте переменные окружения в разделе "Environment Variables"
6. Нажмите "Deploy"

### Способ 2: Через Vercel CLI

```bash
# Установите Vercel CLI если еще не установлен
npm i -g vercel

# Авторизуйтесь
vercel login

# Запустите деплой из корня проекта
vercel

# Или для production деплоя
vercel --prod
```

### Способ 3: Git Integration (Auto-deploy)

1. Подключите репозиторий в Vercel Dashboard
2. Vercel автоматически будет деплоить при пуше в main/master ветку
3. Для preview деплоев создавайте Pull Requests

## Проверка деплоя

После успешного деплоя:

1. Откройте URL проекта (предоставляется Vercel)
2. Проверьте работу приложения
3. Убедитесь, что API запросы идут на правильный бэкенд URL

## Troubleshooting

### Ошибка "Cannot find module"

Убедитесь, что в [`vercel.json`](../vercel.json) правильно указаны пути:
- `buildCommand` должен содержать `cd apps/web`
- `outputDirectory` должен быть `apps/web/dist`

### Ошибка "Build failed"

1. Проверьте локально: `cd apps/web && npm run build`
2. Убедитесь, что все зависимости установлены
3. Проверьте логи сборки в Vercel Dashboard

### API не работает

1. Проверьте переменную `VITE_API_URL`
2. Убедитесь, что бэкенд доступен и настроен CORS
3. Проверьте Network tab в DevTools браузера

## Дополнительно

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)

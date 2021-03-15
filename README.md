# chat_bot_family_test_task
ChatBot_Family test task

# Getting Started
  1. Create ```.env``` file and fill it. (See ```.env.example```)
  2. npm i

## Start instructions for production
  1. npm run build
  2. npm run start:prod

## Start instruction for development
  1. npm run start

## Start tests
  1. npm run test

# Админка
  Чтобы зайти в админку, необходимо написать боту команду /start.
  
  Функионал админки доступен только для аккаунта, id которого равен TELEGRAM_ADMIN_CHAT_ID из переменных окружения.

# Функционал бота для обычного пользователя
Если боту напишет обычный пользователь, то будет доступен следующий функционал:

- Просмотр всех товаров
- Просмотр всех товаров в корзине
- Очистка корзины 

# Бот в канале
Для добавления бота в канал, нуобходимо сделать следующее:

1. Создать канал в телеграме.
2. Добавить бота в канал.
3. Написать /show_items в канале. После этого бот разместит товары в канале.

### Generate migrations
    npm run typeorm migration:generate -- -n {Name}Migration

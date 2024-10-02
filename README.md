# [link](https://blog-fsd.vercel.app/)

# Blog Feature-Sliced Design

### Структура проекта

```
src/
├── assets/                             // Статические ресурсы (изображения, шрифты)
│   ├── fonts/                          // Шрифты
│   │   └── (файлы шрифтов)
│   ├── images/                         // Изображения
│   │   └── (файлы изображений)
│
├── app/                                // Основная настройка приложения
│   ├── AppRoutes.js                    // Настройка маршрутов
│   ├── PrivateRoute.js                 // Логика для защищённых маршрутов
│   └── store.js                        // Конфигурация Redux store
│
├── pages/                              // Страницы приложения
│   ├── ArticlePage/                    // Страница отдельной статьи
│   │   ├── ArticlePage.jsx                   // Страница статьи
│   │   └── ArticlePage.module.scss     // Стили страницы статьи
│   ├── ArticlesPage/                   // Страница со списком статей
│   │   ├── ArticlesPage.jsx                   // Список статей
│   │   └── ArticlesPage.module.scss    // Стили списка статей
│   ├── EditArticlePage/                // Страница редактирования статьи
│   │   ├── EditArticlePage.jsx
│   │   └── EditArticlePage.module.scss
│   ├── NewArticlePage/                 // Страница создания новой статьи
│   │   ├── NewArticlePage.jsx
│   │   └── NewArticlePage.module.scss
│   ├── ProfilePage/                    // Страница профиля пользователя
│   │   ├── ProfilePage.jsx
│   │   └── ProfilePage.module.scss
│   ├── SignInPage/                     // Страница входа
│   │   ├── SignInPage.jsx
│   │   └── SignInPage.module.scss
│   ├── SignUpPage/                     // Страница регистрации
│   │   ├── SignUpPagejsx
│   │   └── SignUpPage.module.scss
│   ├── NotFoundPage/                   // Страница 404
│   │   ├── NotFoundPage.jsx                   // Страница 404 с компонентом NotFound
│   │   └── NotFoundPage.module.scss    // Стили страницы 404
│
├── features/                           // Бизнес-функционал
│   ├── auth/                           // Авторизация
│   │   ├── model/
│   │   │   ├── authFormSlice.js        // Redux срез для авторизации
│   │   └── ui/
│   │       ├── SignInForm.jsx          // Форма входа
│   │       ├── SignInFormStyled.js     // Стили для формы (styled-components)
│   │       ├── SignInForm.module.scss  // Стили для формы (SCSS)
│   │       ├── SignUpForm.jsx          // Форма регистрации
│   │       └── SignUpForm.module.scss  // Стили для формы регистрации
│   └── profile/                        // Работа с профилем
│       ├── model/
│       └── ui/
│           ├── ProfileForm.jsx         // Форма профиля
│           └── ProfileForm.module.scss // Стили для формы профиля
│
├── entities/                           // Сущности (модели и UI)
│   ├── article/                        // Работа со статьями
│   │   ├── model/
│   │   │   ├── articleSlice.js         // Redux срез для работы со статьями
│   │   └── ui/
│   │       ├── Article.jsx             // Компонент статьи
│   │       ├── Article.module.scss     // Стили статьи
│   │       ├── ArticleComments.jsx     // Компонент комментариев
│   │       ├── ArticleComments.module.scss // Стили для комментариев
│   │       ├── ArticleForm/            // Форма для работы со статьей
│   │       │   ├── ArticleForm.jsx     // Форма для создания/редактирования статьи
│   │       │   └── ArticleForm.module.scss // Стили для формы статьи
│   └── pagination/                     // Пагинация
│       ├── model/
│       │   └── PaginationComponent.constants.js // Константы для пагинации
│       └── ui/
│           ├── PaginationComponent.jsx // Компонент пагинации
│           └── PaginationComponent.module.scss // Стили пагинации
│
├── shared/                             // Переиспользуемые компоненты и утилиты
│   ├── ui/
│   │   ├── Header.jsx                  // Шапка сайта
│   │   ├── Header.module.scss          // Стили для шапки
│   │   ├── InputField.jsx              // Поле ввода
│   │   ├── InputField.module.scss      // Стили для поля ввода
│   │   ├── NotFound.jsx                // Компонент для страницы 404
│   │   └── NotFound.module.scss        // Стили для компонента NotFound
│   ├── hooks/
│   │   ├── useArticleFormatting.js     // Хук для форматирования статьи
│   │   └── useWindowSize.js            // Хук для отслеживания размеров окна
│   ├── utils/
│   │   ├── axiosInstance.js            // Шаблон для axios запросов
│   │   ├── dateFormatter.js            // Форматирование дат
│   │   ├── formatMarkdownSeparators.js // Форматирование markdown
│   │   ├── textFormatter.js            // Форматирование текста
│   │   └── toastify.js                 // Уведомления toast
│   └── validation/
│       └── yupSchemas.js               // Схемы валидации с Yup
│
├── widgets/                            // Виджеты и макеты
│   └── layout/
│       ├── MainLayout.jsx              // Основной макет страницы
│       └── MainLayout.module.scss      // Стили основного макета
```
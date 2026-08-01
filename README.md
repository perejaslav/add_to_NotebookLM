<p align="center">
  <img src="icons/icon128.png" alt="Add to Gemini Notebook" width="80">
</p>

<h1 align="center">Add to Gemini Notebook</h1>

<p align="center">
  Chrome-расширение для быстрой отправки веб-страниц, YouTube-видео, комментариев, выделенного текста и PDF в Google Gemini Notebook.
</p>

<p align="center">
  <strong>Текущая версия: 1.3.1</strong>
</p>

---

## О проекте

Add to Gemini Notebook — расширение для Google Chrome, которое добавляет контент в [Gemini Notebook](https://notebook.google.com/) прямо из браузера. Оно работает без официального API: использует внутренний RPC-клиент Google и автоматически выбирает домен, связанный с активным Google-аккаунтом.

Проект создан [@AndyShaman](https://github.com/AndyShaman) и развивается как open-source при участии [@perejaslav](https://github.com/perejaslav).

## Что изменилось в версии 1.3.1

Версия 1.3.1 завершает переход на современное название **Gemini Notebook**. Обновлены название расширения, русская и английская локализации, интерфейс, уведомления, контекстное меню, внутренние пути и релизная сборка. Техническая совместимость версии 1.3.0 с прежними доменами Google сохранена.

## Что изменилось в версии 1.3.0

Google переименовал Gemini Notebook в Gemini Notebook и перевёл часть аккаунтов на новые домены. Версия 1.2.0 обращалась только к старому адресу `notebooklm.google.com`, поэтому после перенаправления не могла получить токены и выполнить RPC-запросы.

Версия 1.3.0:

- поддерживает `notebook.google.com`;
- поддерживает Workspace-домен `notebook.cloud.google.com`;
- сохраняет совместимость с `notebooklm.google.com` и `notebooklm.cloud.google.com`;
- следует перенаправлению Google при получении токенов;
- запоминает фактический домен отдельно для каждого `authuser`;
- направляет RPC- и PDF-запросы на домен активного аккаунта;
- использует новый service worker `background-entry.js`, который загружает слой совместимости до основной логики;
- выпускается под названием **Add to Gemini Notebook**.

Возможности версии 1.2.0 сохранены полностью, включая добавление выделенного текста через контекстное меню.

## Возможности

### Основное

- добавление текущей страницы в блокнот одним кликом;
- создание нового блокнота прямо из расширения;
- захват страницы как PDF через Chrome Debugger API;
- добавление выделенного текста как отдельного текстового источника;
- уведомления об успешной отправке и ошибках;
- защита от повторной отправки одного и того же выделения.

### YouTube

- добавление отдельного видео;
- массовое добавление плейлистов и каналов;
- загрузка комментариев и ответов через InnerTube API;
- работа без отдельного YouTube API-ключа.

### Массовые операции

- импорт списка ссылок;
- импорт открытых вкладок;
- массовое удаление источников;
- синхронизация источников Google Drive, включая Docs и Sheets.

### Интерфейс и настройки

- несколько Google-аккаунтов;
- автоматический выбор домена аккаунта;
- тёмная тема;
- русский и английский интерфейс;
- настройка минимальной и максимальной длины выделения;
- настройка добавления URL, заголовка страницы и времени сохранения к выделенному тексту.

## Установка готовой версии

1. Откройте раздел [Releases](https://github.com/perejaslav/add_to_Gemini Notebook/releases).
2. Скачайте ZIP последней версии.
3. Распакуйте архив в постоянную папку. После установки эту папку нельзя перемещать или удалять.
4. Откройте `chrome://extensions/`.
5. Включите «Режим разработчика».
6. Нажмите «Загрузить распакованное расширение».
7. Выберите папку, в корне которой находится `manifest.json`.

После обновления существующей установки нажмите кнопку «Обновить» на странице расширений или удалите старую распакованную копию и загрузите новую папку.

## Использование

1. Войдите в [Gemini Notebook](https://notebook.google.com/).
2. Откройте нужную веб-страницу или YouTube-видео.
3. Нажмите значок расширения.
4. Выберите блокнот.
5. Выберите подходящее действие: добавить ссылку, видео, комментарии или страницу как PDF.

### Добавление выделенного текста

1. Выделите текст на любой странице.
2. Нажмите правую кнопку мыши.
3. Выберите «Добавить выделение в Gemini Notebook».
4. Текст будет добавлен как отдельный источник с настроенными метаданными.

### Добавление страницы как PDF

Кнопка добавления как PDF создаёт полный снимок страницы и загружает его в Gemini Notebook. Этот вариант полезен для длинных статей и динамических страниц, где обычный импорт по URL может получить неполное содержимое.

## Поддерживаемые домены

| Тип аккаунта | Основной домен |
|---|---|
| Обычный Google-аккаунт | `notebook.google.com` |
| Google Workspace | `notebook.cloud.google.com` |
| Старые адреса | `notebooklm.google.com`, `notebooklm.cloud.google.com` |

Расширение автоматически определяет конечный домен после входа и перенаправляет последующие запросы на него.

## Разработка и проверка

Основные файлы:

- `manifest.json` — конфигурация Manifest V3;
- `background-entry.js` — входной файл service worker;
- `lib/gemini-notebook-compat.js` — совместимость со старыми и новыми доменами;
- `background.js` — основная логика расширения;
- `popup/` — всплывающее окно;
- `app/` — массовые операции и настройки;
- `content/` — скрипты страниц Gemini Notebook и YouTube.

GitHub Actions проверяет JSON-файлы, локализации, обязательные файлы, соответствие версии и собирает установочный ZIP.

## История версий

- **1.3.1** — завершён полный ребрендинг интерфейса и сборки на Gemini Notebook.
- **1.3.1** — завершён полный ребрендинг интерфейса и сборки на Gemini Notebook.
- **1.3.1** — завершён полный ребрендинг интерфейса и сборки на Gemini Notebook.
- **1.3.0** — восстановлена работа после переименования Gemini Notebook в Gemini Notebook и миграции доменов.
- **1.2.0** — добавлена отправка выделенного текста через контекстное меню, уведомления, настройки длины и метаданных.
- **1.1.0** — базовый выпуск с импортом страниц, PDF, YouTube, массовыми операциями и синхронизацией Drive.

Подробности находятся в [CHANGELOG.md](CHANGELOG.md).

## Приватность

URL, заголовок страницы, выделенный текст и другой выбранный контент передаются в Google Gemini Notebook только после явного действия пользователя. Расширение не использует сторонний сервер для хранения этих данных.

## Лицензия

MIT — разрешено использовать, изменять и распространять проект на условиях файла [LICENSE](LICENSE).

---

# English

## About

Add to Gemini Notebook is a Chrome extension for sending web pages, YouTube videos, comments, selected text, and full-page PDF captures directly to [Google Gemini Notebook](https://notebook.google.com/).

Current version: **1.3.1**.

The extension uses Google's internal RPC client and automatically selects the correct host for the active Google account.

## What changed in 1.3.0

Google renamed Gemini Notebook to Gemini Notebook and migrated some accounts to new domains. Version 1.2.0 used only `notebooklm.google.com`, so redirected accounts could no longer retrieve authentication tokens or complete RPC requests.

Version 1.3.0:

- supports `notebook.google.com`;
- supports the Workspace host `notebook.cloud.google.com`;
- preserves compatibility with the legacy Gemini Notebook hosts;
- follows Google redirects during token extraction;
- remembers the resolved host separately for each `authuser`;
- routes RPC and PDF requests to the active account host;
- loads a dedicated compatibility layer before the existing background logic;
- uses the product name **Add to Gemini Notebook**.

All 1.2.0 features remain available, including selected-text import from the context menu.

## Installation

1. Open the [Releases](https://github.com/perejaslav/add_to_Gemini Notebook/releases) page.
2. Download the ZIP for the latest version.
3. Extract it to a permanent folder.
4. Open `chrome://extensions/`.
5. Enable Developer mode.
6. Click **Load unpacked**.
7. Select the folder containing `manifest.json` at its root.

## Core features

- add the current web page to a notebook;
- capture and upload a full page as PDF;
- add selected text with optional page metadata;
- create notebooks from the extension;
- import links and open tabs in bulk;
- add YouTube videos, playlists, channels, comments, and replies;
- delete sources in bulk;
- synchronize Google Drive sources;
- use multiple Google accounts, dark mode, and English/Russian localization.

## Privacy

URLs, page titles, selected text, and chosen content are sent to Google Gemini Notebook only after an explicit user action. The extension does not use a third-party server to store this content.

## Authors

[@AndyShaman](https://github.com/AndyShaman) · [@perejaslav](https://github.com/perejaslav) · [Repository](https://github.com/perejaslav/add_to_Gemini Notebook)

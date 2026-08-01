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

Add to Gemini Notebook — расширение для Google Chrome, которое добавляет контент в [Gemini Notebook](https://notebook.google.com/) прямо из браузера. Оно работает без официального API, использует внутренний RPC-клиент Google и автоматически выбирает домен активного Google-аккаунта.

Проект создан [@AndyShaman](https://github.com/AndyShaman) и развивается как open-source при участии [@perejaslav](https://github.com/perejaslav).

## Что изменилось в версии 1.3.1

Версия 1.3.1 завершает переход на современное название **Gemini Notebook**:

- обновлено название расширения в Manifest V3;
- переработаны русская и английская локализации;
- обновлены заголовки, кнопки, уведомления, подсказки и контекстное меню;
- `content/notebooklm.js` переименован в `content/gemini-notebook.js`;
- версия синхронизирована в интерфейсе, CI и релизной сборке;
- добавлена автоматическая проверка отсутствия устаревшего пользовательского брендинга;
- сохранена техническая совместимость со старыми доменами Google.

Рабочая логика версии 1.3.0 не менялась.

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

- поддержка нескольких Google-аккаунтов;
- автоматический выбор домена аккаунта;
- тёмная тема;
- русский и английский интерфейс;
- настройка минимальной и максимальной длины выделения;
- добавление URL, заголовка страницы и времени сохранения к выделенному тексту.

## Установка

1. Откройте раздел [Releases](https://github.com/perejaslav/add_to_NotebookLM/releases).
2. Скачайте ZIP последней версии.
3. Распакуйте архив в постоянную папку.
4. Откройте `chrome://extensions/`.
5. Включите «Режим разработчика».
6. Нажмите «Загрузить распакованное расширение».
7. Выберите папку, в корне которой находится `manifest.json`.

После обновления существующей установки нажмите «Обновить» на странице расширений либо удалите старую распакованную копию и загрузите новую папку.

## Использование

1. Войдите в [Gemini Notebook](https://notebook.google.com/).
2. Откройте нужную веб-страницу или YouTube-видео.
3. Нажмите значок расширения.
4. Выберите блокнот.
5. Выберите действие: добавить ссылку, видео, комментарии или страницу как PDF.

### Добавление выделенного текста

1. Выделите текст на странице.
2. Нажмите правую кнопку мыши.
3. Выберите «Добавить выделение в Gemini Notebook».
4. Текст будет добавлен как отдельный источник с настроенными метаданными.

### Добавление страницы как PDF

Кнопка добавления как PDF создаёт полный снимок страницы и загружает его в Gemini Notebook. Этот режим полезен для длинных статей и динамических страниц, где обычный импорт по URL может получить неполное содержимое.

## Поддерживаемые домены

| Тип аккаунта | Основной домен |
|---|---|
| Обычный Google-аккаунт | `notebook.google.com` |
| Google Workspace | `notebook.cloud.google.com` |
| Legacy-адреса | `notebooklm.google.com`, `notebooklm.cloud.google.com` |

Legacy-адреса используются только для обратной совместимости и автоматически перенаправляются на актуальный домен аккаунта.

## Структура проекта

- `manifest.json` — конфигурация Manifest V3;
- `background-entry.js` — входной файл service worker;
- `lib/gemini-notebook-compat.js` — совместимость с актуальными и legacy-доменами;
- `background.js` — основная логика расширения;
- `content/gemini-notebook.js` — интеграция со страницей Gemini Notebook;
- `popup/` — всплывающее окно;
- `app/` — массовые операции и настройки;
- `content/` — дополнительные content scripts.

GitHub Actions проверяет JSON, локализации, обязательные файлы, версию, пользовательский брендинг и структуру релизного ZIP.

## История версий

- **1.3.1** — завершён полный ребрендинг интерфейса, локализаций и сборки на Gemini Notebook.
- **1.3.0** — восстановлена работа после миграции Google на новые домены.
- **1.2.0** — добавлена отправка выделенного текста, уведомления и настройки метаданных.
- **1.1.0** — базовый выпуск с импортом страниц, PDF, YouTube и массовыми операциями.

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

## What changed in 1.3.1

Version 1.3.1 completes the product rename to **Gemini Notebook** across the extension name, English and Russian localizations, interface text, notifications, context menu, content-script path, CI checks, and release packaging. Runtime behavior from version 1.3.0 remains unchanged.

## Installation

1. Open the [Releases](https://github.com/perejaslav/add_to_NotebookLM/releases) page.
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

## Compatibility

The extension supports `notebook.google.com` and `notebook.cloud.google.com`. Legacy Google domains remain supported only for transparent migration and redirect handling.

## Privacy

URLs, page titles, selected text, and chosen content are sent to Google Gemini Notebook only after an explicit user action. The extension does not use a third-party server to store this content.

## Authors

[@AndyShaman](https://github.com/AndyShaman) · [@perejaslav](https://github.com/perejaslav) · [Repository](https://github.com/perejaslav/add_to_NotebookLM)

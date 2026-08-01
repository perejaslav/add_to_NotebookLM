// Selection-to-Source module for Add to Gemini Notebook
// Normalizes selected text, builds title/body payload, provides i18n strings.
// Loaded via importScripts in background.js.

const SelectionToSource = {
  DEFAULT_MAX_CHARS: 50000,
  DEFAULT_MIN_CHARS: 20,

  // Localized strings — no dependency on lib/i18n.js (service worker)
  STRINGS: {
    en: {
      menuTitle: 'Add selection to Gemini Notebook',
      titlePrefix: 'Selection',
      notifySuccess: 'Selection added to Gemini Notebook',
      notifyTruncated: 'Selection added to Gemini Notebook (truncated)',
      errNoNotebook: 'No notebook selected. Open Add to Gemini Notebook and choose a notebook.',
      errTooShort: 'Selection is too short (minimum 20 characters).',
      errEmpty: 'Selection is empty.',
      errAuth: 'Please login to Gemini Notebook first.',
      errRpc: 'Failed to add selection. Please try again.',
      errRateLimited: 'Please wait a few seconds before sending again.',
      untitledPage: 'Untitled page',
      labelSource: 'Source',
      labelPageTitle: 'Page title',
      labelCaptured: 'Captured',
      labelFrame: 'Frame',
      truncatedSuffix: '\n\n… [truncated]'
    },
    ru: {
      menuTitle: 'Добавить выделение в Gemini Notebook',
      titlePrefix: 'Выделение',
      notifySuccess: 'Выделение добавлено в Gemini Notebook',
      notifyTruncated: 'Выделение добавлено в Gemini Notebook (обрезано)',
      errNoNotebook: 'Нотбук не выбран. Откройте Add to Gemini Notebook и выберите нотбук.',
      errTooShort: 'Выделение слишком короткое (минимум 20 символов).',
      errEmpty: 'Выделение пустое.',
      errAuth: 'Сначала войдите в Gemini Notebook.',
      errRpc: 'Не удалось добавить выделение. Попробуйте ещё раз.',
      errRateLimited: 'Подождите несколько секунд перед повторной отправкой.',
      untitledPage: 'Страница без заголовка',
      labelSource: 'Источник',
      labelPageTitle: 'Заголовок страницы',
      labelCaptured: 'Сохранено',
      labelFrame: 'Фрейм',
      truncatedSuffix: '\n\n… [обрезано]'
    }
  },

  normalizeSelection(raw) {
    if (!raw || typeof raw !== 'string') return '';
    return raw
      .replace(/\0/g, '')
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .trim()
      .replace(/\n{3,}/g, '\n\n');
  },

  length(text) {
    return Array.from(text).length;
  },

  truncate(text, max) {
    const chars = Array.from(text);
    if (chars.length <= max) return { text, truncated: false };
    return { text: chars.slice(0, max).join(''), truncated: true };
  },

  validate(normalized, min) {
    const len = this.length(normalized);
    if (len === 0) return { ok: false, code: 'SELECTION_EMPTY' };
    if (len < min) return { ok: false, code: 'SELECTION_TOO_SHORT' };
    return { ok: true };
  },

  buildPayload({ selectionText, pageTitle, pageUrl, frameUrl, lang, includeContext, maxChars, minChars }) {
    const s = this.STRINGS[lang] || this.STRINGS.en;
    const normalized = this.normalizeSelection(selectionText);
    const check = this.validate(normalized, minChars || this.DEFAULT_MIN_CHARS);
    if (!check.ok) return { title: '', text: '', truncated: false, error: check.code };

    const { text: finalText, truncated } = this.truncate(normalized, maxChars || this.DEFAULT_MAX_CHARS);

    const displayPageTitle = pageTitle && pageTitle.trim()
      ? Array.from(pageTitle.trim()).slice(0, 80).join('')
      : s.untitledPage;
    const title = `${s.titlePrefix}: ${displayPageTitle}`;

    let body = '';
    if (includeContext) {
      body += `${s.labelSource}: ${pageUrl || ''}\n`;
      body += `${s.labelPageTitle}: ${displayPageTitle}\n`;
      if (frameUrl && frameUrl !== pageUrl) body += `${s.labelFrame}: ${frameUrl}\n`;
      body += `${s.labelCaptured}: ${new Date().toISOString()}\n`;
      body += '\n---\n\n';
    }
    body += finalText;
    if (truncated) body += s.truncatedSuffix;

    return { title, text: body, truncated };
  },

  getMenuTitle(lang) {
    return (this.STRINGS[lang] || this.STRINGS.en).menuTitle;
  },

  getNotificationMessage(lang, code) {
    const s = this.STRINGS[lang] || this.STRINGS.en;
    const map = {
      success: 'notifySuccess', truncated: 'notifyTruncated',
      NO_NOTEBOOK: 'errNoNotebook', SELECTION_TOO_SHORT: 'errTooShort',
      SELECTION_EMPTY: 'errEmpty', AUTH_REQUIRED: 'errAuth',
      RPC_FAILED: 'errRpc', RATE_LIMITED: 'errRateLimited'
    };
    return s[map[code]] || s.errRpc;
  },

  simpleHash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) + h + str.charCodeAt(i)) | 0;
    }
    return h.toString(36);
  }
};

// ============================================
// Self-check (throw-based, runs on importScripts in SW)
// ============================================
(function selfCheck() {
  function assert(cond, msg) {
    if (!cond) throw new Error('[SelectionToSource] Self-check failed: ' + msg);
  }
  const S = SelectionToSource;

  assert(S.normalizeSelection('a\r\nb') === 'a\nb', 'normalize \\r\\n');
  assert(S.normalizeSelection('a\0b') === 'ab', 'normalize \\0');
  assert(S.normalizeSelection('a\n\n\n\nb') === 'a\n\nb', 'normalize triple-newline');
  assert(S.length('😀') === 1, 'length emoji');
  const t = S.truncate('abcdef', 3);
  assert(t.text === 'abc' && t.truncated, 'truncate');
  const t2 = S.truncate('abc', 5);
  assert(t2.text === 'abc' && !t2.truncated, 'truncate no-op');
  assert(!S.validate('', 20, 50000).ok, 'validate empty');
  assert(!S.validate('abc', 20, 50000).ok, 'validate short');
  assert(S.validate('a'.repeat(100), 20, 50000).ok, 'validate ok');

  const p1 = S.buildPayload({
    selectionText: 'Hello world', pageTitle: 'Test', pageUrl: 'https://e.com',
    lang: 'en', includeContext: true, maxChars: 50000, minChars: 20
  });
  assert(p1.error === 'SELECTION_TOO_SHORT', 'buildPayload short error');

  const p2 = S.buildPayload({
    selectionText: 'Привет мир это длинный текст для теста',
    pageTitle: '', pageUrl: 'https://e.com',
    lang: 'ru', includeContext: true, maxChars: 50000, minChars: 20
  });
  assert(!p2.error, 'buildPayload ru ok');
  assert(p2.title.startsWith('Выделение:'), 'buildPayload ru title');

  const p3 = S.buildPayload({
    selectionText: 'Just the selection text here for testing',
    pageTitle: 'Page', pageUrl: 'https://e.com',
    lang: 'en', includeContext: false, maxChars: 50000, minChars: 20
  });
  assert(!p3.error, 'buildPayload no-context ok');
  assert(p3.text === 'Just the selection text here for testing', 'buildPayload no-context text');

  assert(S.getMenuTitle('en') === 'Add selection to Gemini Notebook', 'menu en');
  assert(S.getMenuTitle('ru') === 'Добавить выделение в Gemini Notebook', 'menu ru');
  assert(S.getNotificationMessage('en', 'success') === 'Selection added to Gemini Notebook', 'notify en');
  assert(S.getNotificationMessage('ru', 'truncated') === 'Выделение добавлено в Gemini Notebook (обрезано)', 'notify ru');
  assert(S.simpleHash('x') === S.simpleHash('x'), 'hash deterministic');
})();

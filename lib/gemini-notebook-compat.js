// Compatibility layer for the Gemini Notebook domain migration.
// Loaded before background.js and transparently redirects legacy NotebookLM
// requests to the host used by the selected Google account.

(() => {
  'use strict';

  const nativeFetch = globalThis.fetch.bind(globalThis);

  const NOTEBOOK_HOSTS = new Set([
    'notebook.google.com',
    'notebook.cloud.google.com',
    'notebooklm.google.com',
    'notebooklm.cloud.google.com'
  ]);

  const LEGACY_TO_CURRENT = new Map([
    ['notebooklm.google.com', 'notebook.google.com'],
    ['notebooklm.cloud.google.com', 'notebook.cloud.google.com']
  ]);

  // Different Google accounts can be migrated to different hosts.
  // Store the final host separately for each authuser value.
  const accountOrigins = new Map();

  function getAuthuser(url) {
    const raw = url.searchParams.get('authuser');
    return raw && /^\d+$/.test(raw) ? raw : '0';
  }

  function isNotebookHost(hostname) {
    return NOTEBOOK_HOSTS.has(hostname.toLowerCase());
  }

  function resolveTargetUrl(inputUrl) {
    const url = new URL(inputUrl);
    if (!isNotebookHost(url.hostname)) return url;

    const authuser = getAuthuser(url);
    const rememberedOrigin = accountOrigins.get(authuser);

    if (rememberedOrigin) {
      const remembered = new URL(rememberedOrigin);
      url.protocol = remembered.protocol;
      url.host = remembered.host;
      return url;
    }

    const replacementHost = LEGACY_TO_CURRENT.get(url.hostname.toLowerCase());
    if (replacementHost) url.hostname = replacementHost;
    return url;
  }

  function rememberFinalOrigin(response, authuser) {
    try {
      if (!response?.url) return;
      const finalUrl = new URL(response.url);
      if (isNotebookHost(finalUrl.hostname)) {
        accountOrigins.set(authuser, finalUrl.origin);
      }
    } catch (_) {
      // Ignore malformed or opaque response URLs.
    }
  }

  globalThis.fetch = async function geminiNotebookFetch(input, init = {}) {
    const originalUrl = input instanceof Request ? input.url : String(input);
    let parsed;

    try {
      parsed = new URL(originalUrl);
    } catch (_) {
      return nativeFetch(input, init);
    }

    if (!isNotebookHost(parsed.hostname)) {
      return nativeFetch(input, init);
    }

    const authuser = getAuthuser(parsed);
    const targetUrl = resolveTargetUrl(parsed.toString());
    const nextInit = { ...init };

    // The old client explicitly used redirect: manual. That now returns an
    // opaque redirect after Google's domain migration, so token extraction
    // receives no HTML. Following redirects restores the expected response.
    if (nextInit.redirect === 'manual') nextInit.redirect = 'follow';

    let nextInput;
    if (input instanceof Request) {
      nextInput = new Request(targetUrl.toString(), input);
    } else {
      nextInput = targetUrl.toString();
    }

    const response = await nativeFetch(nextInput, nextInit);
    rememberFinalOrigin(response, authuser);
    return response;
  };

  globalThis.GeminiNotebookCompat = Object.freeze({
    supportedHosts: [...NOTEBOOK_HOSTS],
    getOrigin(authuser = 0) {
      return accountOrigins.get(String(authuser)) || 'https://notebook.google.com';
    }
  });
})();

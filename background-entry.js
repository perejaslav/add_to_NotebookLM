// Service-worker entrypoint.
// Load the Gemini Notebook migration compatibility layer before the legacy
// background implementation so all network calls use the correct account host.

importScripts('lib/gemini-notebook-compat.js', 'background.js');

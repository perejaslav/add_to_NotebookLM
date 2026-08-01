from pathlib import Path
import json
import re

ROOT = Path('.')


def replace_json_values(value):
    if isinstance(value, dict):
        return {k: replace_json_values(v) for k, v in value.items()}
    if isinstance(value, list):
        return [replace_json_values(v) for v in value]
    if isinstance(value, str):
        return value.replace('Add to NotebookLM', 'Add to Gemini Notebook').replace('NotebookLM', 'Gemini Notebook')
    return value


for path in [Path('_locales/en/messages.json'), Path('_locales/ru/messages.json'), Path('manifest.json')]:
    data = replace_json_values(json.loads(path.read_text(encoding='utf-8')))
    if path.name == 'manifest.json':
        data['version'] = '1.3.1'
        data['short_name'] = 'Add to Gemini Notebook'
        for item in data.get('content_scripts', []):
            item['js'] = ['content/gemini-notebook.js' if x == 'content/notebooklm.js' else x for x in item.get('js', [])]
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

package = Path('package.json')
if package.exists():
    data = replace_json_values(json.loads(package.read_text(encoding='utf-8')))
    data['version'] = '1.3.1'
    if data.get('name') == 'add-to-notebooklm':
        data['name'] = 'add-to-gemini-notebook'
    package.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

old_script = Path('content/notebooklm.js')
new_script = Path('content/gemini-notebook.js')
if old_script.exists():
    old_script.rename(new_script)

string_re = re.compile(r'("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'|`(?:\\.|[^`\\])*`)', re.DOTALL)


def replace_in_js(text):
    text = string_re.sub(lambda m: m.group(0).replace('Add to NotebookLM', 'Add to Gemini Notebook').replace('NotebookLM', 'Gemini Notebook'), text)
    text = re.sub(r'(^\s*//.*$)', lambda m: m.group(0).replace('NotebookLM', 'Gemini Notebook'), text, flags=re.MULTILINE)
    text = re.sub(r'/\*.*?\*/', lambda m: m.group(0).replace('NotebookLM', 'Gemini Notebook'), text, flags=re.DOTALL)
    return text


for path in ROOT.rglob('*.js'):
    if '.git' in path.parts or path == Path('lib/gemini-notebook-compat.js'):
        continue
    text = path.read_text(encoding='utf-8')
    updated = replace_in_js(text)
    if updated != text:
        path.write_text(updated, encoding='utf-8')

for path in ROOT.rglob('*.html'):
    text = path.read_text(encoding='utf-8')
    text = string_re.sub(lambda m: m.group(0).replace('Add to NotebookLM', 'Add to Gemini Notebook').replace('NotebookLM', 'Gemini Notebook'), text)
    text = re.sub(r'>([^<>]*NotebookLM[^<>]*)<', lambda m: '>' + m.group(1).replace('NotebookLM', 'Gemini Notebook') + '<', text)
    text = text.replace('v1.3.0', 'v1.3.1')
    path.write_text(text, encoding='utf-8')

readme = Path('README.md')
text = readme.read_text(encoding='utf-8')
text = text.replace('Add to NotebookLM', 'Add to Gemini Notebook').replace('NotebookLM', 'Gemini Notebook')
text = text.replace('Текущая версия: 1.3.0', 'Текущая версия: 1.3.1').replace('Current version: **1.3.0**', 'Current version: **1.3.1**')
marker = '## Что изменилось в версии 1.3.0'
section = '## Что изменилось в версии 1.3.1\n\nВерсия 1.3.1 завершает переход на современное название **Gemini Notebook**. Обновлены название расширения, русская и английская локализации, интерфейс, уведомления, контекстное меню, внутренние пути и релизная сборка. Техническая совместимость версии 1.3.0 с прежними доменами Google сохранена.\n\n'
if marker in text and '## Что изменилось в версии 1.3.1' not in text:
    text = text.replace(marker, section + marker)
text = text.replace('- **1.3.0** —', '- **1.3.1** — завершён полный ребрендинг интерфейса и сборки на Gemini Notebook.\n- **1.3.0** —', 1)
readme.write_text(text, encoding='utf-8')

changelog = Path('CHANGELOG.md')
text = changelog.read_text(encoding='utf-8')
entry = '''## [1.3.1] — 2026-08-01

### Переименовано

- Пользовательское название расширения окончательно изменено с прежнего бренда на **Add to Gemini Notebook**
- Обновлены названия в русском и английском интерфейсе, контекстном меню, уведомлениях и подсказках
- Content script `content/notebooklm.js` переименован в `content/gemini-notebook.js`

### Изменено

- Версия расширения: `1.3.0` → `1.3.1`
- README и описание проекта приведены к актуальному бренду Gemini Notebook
- CI и релизная сборка обновлены для версии 1.3.1
- Имя установочного архива: `add_to_Gemini_Notebook-1.3.1.zip`

### Исправлено

- Удалены устаревшие пользовательские упоминания прежнего названия из локализаций и интерфейсных файлов
- Версия в дополнительных страницах расширения синхронизирована с `manifest.json`

### Совместимость

- Сетевая совместимость с прежними доменами Google сохранена; они используются только как технические legacy-адреса
- Все функции версии 1.3.0 сохранены без изменения поведения

'''
if '## [1.3.1]' not in text:
    pos = text.index('## [1.3.0]')
    text = text[:pos] + entry + text[pos:]
changelog.write_text(text, encoding='utf-8')

ci = Path('.github/workflows/ci.yml')
text = ci.read_text(encoding='utf-8').replace('expected 1.3.0', 'expected 1.3.1').replace("== '1.3.0'", "== '1.3.1'").replace('content/notebooklm.js', 'content/gemini-notebook.js')
ci.write_text(text, encoding='utf-8')

for disposable in [Path('.github/workflows/rebrand-1.3.1.yml'), Path('.github/workflows/rebrand-pr-1.3.1.yml'), Path('scripts/rebrand_1_3_1.py')]:
    if disposable.exists():
        disposable.unlink()

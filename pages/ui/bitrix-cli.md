## Bitrix CLI (@bitrix/cli) — Краткая справка

Это краткая справочная документация по использованию Bitrix CLI для сборки, тестирования и создания JS/CSS расширений для 1C‑Bitrix/Bitrix24.

### Обзор
- CLI `bitrix` рекурсивно находит файлы `bundle.config.js` и запускает сборку/транспиляцию для каждого.
- Тесты основаны на Mocha и обнаруживаются в `./test` относительно каждого `bundle.config.js`.
- Расширения (экстеншны) находятся в `local/js/{module}/...` и загружаются в PHP через `\Bitrix\Main\UI\Extension::load(...)`.

### Сборка
Запустить полную сборку проекта:

```bash
bitrix build
```

Часто используемые флаги:
- `--watch[=<exts>]`, `-w[=<exts>]`: Пересборка при изменении файлов. По умолчанию отслеживает `js,jsx,vue,css,scss` при использовании `defaults`.
- `--test`, `-t`: Запускать тесты после каждой сборки (показывает только сводку прохождений/ошибок; полный отчёт через `bitrix test`).
- `--modules <name[,name...]>`, `-m=<...>`: Собирать только выбранные модули (корневой контекст для `local/js` и `bitrix/modules`).
- `--path <path>`, `-p=<path>`: Собрать конкретную директорию (относительный путь).
- `--extensions <name[,name...]>`, `-e=<...>`: Собрать конкретные расширения; можно запускать из любой точки репозитория.

Примеры:
```bash
bitrix build --watch
bitrix build -w=defaults,json,mjs,svg
bitrix build --modules main,ui,landing
bitrix build -p=./main/install/js/main/loader
bitrix build -e=main.core,ui.buttons,landing.main
```

### Тестирование
Запустить Mocha тесты с полным отчётом:

```bash
bitrix test
```

Примечания:
- Файлы тестов — это JS файлы в `./test` рядом с каждым `bundle.config.js`.
- Исходный код и тесты обрабатываются/транспилируются на лету; поддерживается ES6+.

Часто используемые флаги (та же семантика, что и у сборки):
- `--watch[=<exts>]`, `-w[=<exts>]`
- `--modules <name[,name...]>`, `-m=<...>`
- `--path <path>`, `-p=<path>`
- `--extensions <name[,name...]>`, `-e=<...>`

Примеры:
```bash
bitrix test --watch
bitrix test -w=defaults,json,mjs,svg
bitrix test --modules main,ui,landing
bitrix test -p=./main/install/js/main/loader
bitrix test -e=main.core,ui.buttons,landing.main
```

### Создание расширения
Создать новое расширение:

```bash
cd local/js/{module}
bitrix create
```

Советы:
- `{module}` должен быть именем модуля без точек (например, префикс партнёра).
- Также можно запустить прямо в `local/js/`: `bitrix create myext`.

Загрузка расширения (PHP):

```php
\Bitrix\Main\UI\Extension::load("partner.ext"); // для local/js/partner/ext/
\Bitrix\Main\UI\Extension::load("myext");       // при создании прямо в local/js/
```

### Практические заметки
- Значения по умолчанию для watch покрывают: `js,jsx,vue,css,scss`.
- Используйте `--extensions` при итерации над небольшим набором расширений для ускорения сборки/тестирования.
- Храните тесты в `./test` рядом с соответствующим `bundle.config.js` для их обнаружения.

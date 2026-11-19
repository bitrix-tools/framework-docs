---
title: Получить каталог ядра Application::getPersonalRoot
description: Статический метод Application::getPersonalRoot возвращает путь к каталогу /bitrix от корня сайта. Значение меняет переменная BX_PERSONAL_ROOT.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Application::getPersonalRoot` возвращает путь к каталогу ядра от корня сайта, по умолчанию `/bitrix`. В этом каталоге лежат кеш, временные файлы и шаблоны. Метод нужен, чтобы строить пути к ним, например `/bitrix/cache`.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
public static function getPersonalRoot()
```

## Возвращаемое значение

Метод возвращает строку, например `/bitrix`.

## Особенности

- Переменная сервера `BX_PERSONAL_ROOT` меняет каталог, ее задают в настройках веб-сервера. Так несколько сайтов на одном ядре хранят кеш раздельно.
- Метод запоминает значение из контекста при первом вызове.
- Метод обращается к объекту приложения. Если объект еще не создан, вызов приводит к ошибке PHP.

## Примеры

**Пример.** Код строит путь к каталогу кеша:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Application::getPersonalRoot() . '/cache';
```

Код выведет `/bitrix/cache`.

## Смотрите также

- [Application::getDocumentRoot](get-document-root.md)

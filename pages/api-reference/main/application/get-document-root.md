---
title: Получить корневой каталог сайта Application::getDocumentRoot
description: Статический метод Application::getDocumentRoot возвращает абсолютный путь к корневому каталогу сайта.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Application::getDocumentRoot` возвращает абсолютный путь к корневому каталогу сайта, например `/home/bitrix/www`. Метод заменяет обращение к `$_SERVER['DOCUMENT_ROOT']` и работает в агентах и консольных скриптах.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
public static function getDocumentRoot()
```

## Возвращаемое значение

Метод возвращает строку без `/` в конце.

## Особенности

- Источник пути — данные сервера в контексте. Если контекста еще нет, результат совпадает с путем от загрузчика классов `Loader::getDocumentRoot()`.
- Для вызова нужен объект приложения. Если объект еще не создан, вызов приводит к ошибке PHP. До пролога используйте `Loader::getDocumentRoot()`.
- Первый вызов запоминает путь из контекста, и смена контекста потом не меняет результат.

## Примеры

**Пример.** Код строит абсолютный путь к файлу сайта:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Application::getDocumentRoot() . '/local/php_interface/init.php';
```

Код выведет путь к файлу, например `/home/bitrix/www/local/php_interface/init.php`.

## Смотрите также

- [Application::getPersonalRoot](get-personal-root.md)

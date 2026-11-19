---
title: Получить корень сайта Loader::getDocumentRoot
description: Метод Loader::getDocumentRoot возвращает значение $_SERVER['DOCUMENT_ROOT'] без косой черты в конце.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Loader::getDocumentRoot` возвращает корень сайта на сервере. Метод берет значение `$_SERVER['DOCUMENT_ROOT']` и убирает косую черту в конце.

Сигнатура метода в классе `Bitrix\Main\Loader`:

```php
public static function getDocumentRoot()
```

## Возвращаемое значение

Метод возвращает строку. Метод запоминает значение при первом вызове. Если код позже изменит `$_SERVER['DOCUMENT_ROOT']`, метод вернет прежнее значение.

## Примеры

**Пример.** Код собирает путь к файлу в каталоге `/upload/`:

```php
<?php
use Bitrix\Main\Loader;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Loader::getDocumentRoot() . '/upload/units/kg.txt';
```

Код выведет путь вида `/var/www/html/upload/units/kg.txt`.

## Смотрите также

- [Loader::getLocal](get-local.md)
- [Path::convertRelativeToAbsolute](../io/path/convert-relative-to-absolute.md)

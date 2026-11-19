---
title: Получить часть каталога по имени скрипта Cache::getSalt
description: Метод Cache::getSalt возвращает часть каталога кеша из трех символов хеша имени текущего скрипта.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Cache::getSalt` возвращает часть каталога кеша, которая зависит от текущей страницы. Ядро добавляет ее к пути кеша компонентов, чтобы разные страницы хранили кеш раздельно.

Сигнатура метода в классе `Bitrix\Main\Data\Cache`:

```php
public static function getSalt()
```

## Возвращаемое значение

Метод возвращает строку вида `/<три символа>` — косую черту и первые три символа MD5 от имени скрипта, например `/7d4`.

Метод берет имя скрипта из `$_SERVER['SCRIPT_NAME']`. Для `/bitrix/urlrewrite.php` и `/404.php` метод берет реальный путь страницы из `$_SERVER['REAL_FILE_PATH']`, если он задан.

## Примеры

**Пример.** Код добавляет часть каталога к каталогу кеша:

```php
<?php
use Bitrix\Main\Data\Cache;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$initDir = '/units' . Cache::getSalt();

echo strlen($initDir);
```

Код выведет `10`.

## Смотрите также

- [Cache::initCache](init-cache.md)

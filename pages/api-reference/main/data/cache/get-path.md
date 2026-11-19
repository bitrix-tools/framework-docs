---
title: Получить путь к файлу кеша Cache::getPath
description: Метод Cache::getPath возвращает относительный путь к файлу кеша по ключу — подкаталог из двух символов хеша и имя файла.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Cache::getPath` возвращает относительный путь к файлу кеша по ключу. Методы [initCache](init-cache.md) и [clean](clean.md) добавляют этот путь к каталогу кеша.

Сигнатура метода в классе `Bitrix\Main\Data\Cache`:

```php
public static function getPath($uniqueString)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| uniqueString\* | `string` | Задает ключ кеша |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку вида `<первые два символа хеша>/<хеш>.php`, где хеш — MD5 ключа. Например, для ключа `units_list` метод вернет `a2/a22343721c40bca364e51125b1e7ce90.php`.

## Примеры

**Пример.** Код выводит путь к файлу кеша:

```php
<?php
use Bitrix\Main\Data\Cache;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Cache::getPath('units_list');
```

Код выведет `a2/a22343721c40bca364e51125b1e7ce90.php`.

## Смотрите также

- [Cache::isCacheExpired](is-cache-expired.md)

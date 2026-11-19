---
title: Получить значение параметра Option::get
description: Метод Option::get возвращает параметр модуля с учетом сайта, общего значения и значения по умолчанию.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Option::get` возвращает значение параметра модуля. Аналог в классическом API — `COption::GetOptionString`. Классический метод перехватывает `ArgumentNullException`, а `Option::get` передает исключение вызывающему коду.

Сигнатура метода в классе `Bitrix\Main\Config\Option`:

```php
public static function get($moduleId, $name, $default = "", $siteId = false)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| moduleId\* | `string` | Задает идентификатор модуля без учета регистра |
| name\* | `string` | Задает имя параметра без учета регистра |
| default | `string` | Задает результат, если сохраненного значения нет. По умолчанию — `""`. При пустом значении метод также проверяет файл значений по умолчанию |
| siteId | `string`, `bool` | Выбирает сайт. По умолчанию — `false`, то есть сайт из текущего контекста. Пустая строка выбирает общие параметры |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их типы.

## Возвращаемое значение

Метод возвращает первое найденное значение в следующем порядке.

1. Сохраненное значение для выбранного сайта, включая пустую строку.
2. Сохраненное общее значение.
3. Значение из [getDefaults](get-defaults.md), если `$default == ""`.
4. Переданное значение `$default`.

Сохраненные значения — строки. Метод возвращает значение из файла модуля или `$default` без дополнительного преобразования типа. Непустой `$default` отключает проверку файла, но не заменяет сохраненное общее значение.

Метод кеширует загруженные параметры модуля. Вызовы `set` и `delete` сбрасывают этот кеш для модуля. Значения из файла по умолчанию метод кеширует отдельно в пределах выполнения скрипта.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentNullException` | Аргумент `moduleId` или `name` равен пустой строке |
| `Bitrix\Main\ArgumentOutOfRangeException` | Метод обращается к файлу значений по умолчанию, а `moduleId` содержит символы вне `a-z`, `A-Z`, `0-9`, точки и подчеркивания |
| `Bitrix\Main\DB\ConnectionException` | Не удалось установить соединение с базой данных |
| `Bitrix\Main\DB\SqlQueryException` | Не удалось прочитать общие параметры из базы данных |

## Примеры

{% list tabs %}

- D7

  **Пример.** Код читает общий параметр `site_name` модуля `main`:

  ```php
  <?php
  use Bitrix\Main\Config\Option;

  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  $value = Option::get('main', 'site_name', 'Site', '');
  var_dump($value);
  ```

- Классический API

  {% note warning "" %}

  Класс `COption` устарел. Его методы продолжают работать. Для нового кода используйте `Option`.

  {% endnote %}

  **Пример.** Код читает тот же общий параметр через `COption`:

  ```php
  <?php
  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  $value = COption::GetOptionString('main', 'site_name', 'Site', '');
  var_dump($value);
  ```

{% endlist %}

## Смотрите также

- [Option::getRealValue](get-real-value.md).
- [Option::getDefaults](get-defaults.md).
- [Option::set](set.md).

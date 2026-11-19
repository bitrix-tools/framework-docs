---
title: Получить сохраненное значение Option::getRealValue
description: Метод Option::getRealValue возвращает сохраненный параметр без подстановки общих значений и значений по умолчанию.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Option::getRealValue` возвращает сохраненное значение параметра для выбранного сайта или общих параметров. Аналог в классическом API — `COption::GetOptionString` с пятым аргументом `true`. При отсутствии значения классический метод возвращает `false`, а `getRealValue` — `null`.

Сигнатура метода в классе `Bitrix\Main\Config\Option`:

```php
public static function getRealValue($moduleId, $name, $siteId = false)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| moduleId\* | `string` | Задает идентификатор модуля без учета регистра |
| name\* | `string` | Задает имя параметра без учета регистра |
| siteId | `string`, `bool` | Выбирает сайт. По умолчанию — `false`, то есть сайт из текущего контекста. Пустая строка выбирает общие параметры |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их типы.

## Возвращаемое значение

Метод возвращает строку, если параметр сохранен для выбранного сайта, или `null`, если его нет. Пустая сохраненная строка остается пустой строкой.

При непустом `siteId` метод не подставляет общий параметр. Для чтения общего параметра передайте `''`. Метод не обращается к значениям из `default_option.php`.

Метод кеширует загруженные параметры модуля. Вызовы `set` и `delete` сбрасывают этот кеш для модуля. При повторном обращении к модулю во время загрузки его параметров метод вызывает предупреждение `E_USER_WARNING`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentNullException` | Аргумент `moduleId` или `name` равен пустой строке |
| `Bitrix\Main\DB\ConnectionException` | Не удалось установить соединение с базой данных |
| `Bitrix\Main\DB\SqlQueryException` | Не удалось прочитать общие параметры из базы данных |

## Примеры

{% list tabs %}

- D7

  **Пример.** Код проверяет, сохранен ли общий параметр `site_name`:

  ```php
  <?php
  use Bitrix\Main\Config\Option;

  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  $value = Option::getRealValue('main', 'site_name', '');
  var_dump($value);
  ```

- Классический API

  {% note warning "" %}

  Класс `COption` устарел. Его методы продолжают работать. Для нового кода используйте `Option`.

  {% endnote %}

  **Пример.** Пятый аргумент включает чтение без подстановки значений:

  ```php
  <?php
  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  $value = COption::GetOptionString('main', 'site_name', '', '', true);
  var_dump($value);
  ```

{% endlist %}

## Смотрите также

- [Option::get](get.md).
- [Option::getForModule](get-for-module.md).

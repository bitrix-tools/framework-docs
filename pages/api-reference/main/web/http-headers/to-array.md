---
title: Получить внутренний массив заголовков HttpHeaders::toArray
description: Метод HttpHeaders::toArray возвращает заголовки в том виде, в котором их хранит объект, с ключами — именами в нижнем регистре.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpHeaders::toArray` возвращает заголовки в том виде, в котором их хранит объект. Для массива «имя — значения» используйте [getHeaders](get-headers.md).

Сигнатура метода в классе `Bitrix\Main\Web\HttpHeaders`:

```php
public function toArray()
```

## Возвращаемое значение

Метод возвращает массив. Ключ — имя заголовка в нижнем регистре. Значение — массив с ключами `name` (исходное имя) и `values` (массив значений).

## Примеры

**Пример.** Код выводит внутренний массив:

```php
<?php
use Bitrix\Main\Web\HttpHeaders;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$headers = new HttpHeaders(['X-Units' => ['kg', 'g']]);

var_export($headers->toArray());
```

Код выведет:

```text
array (
  'x-units' => 
  array (
    'name' => 'X-Units',
    'values' => 
    array (
      0 => 'kg',
      1 => 'g',
    ),
  ),
)
```

## Смотрите также

- [HttpHeaders::getHeaders](get-headers.md)

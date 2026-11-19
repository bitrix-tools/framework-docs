---
title: Получить заголовки массивом HttpHeaders::getHeaders
description: Метод HttpHeaders::getHeaders возвращает заголовки массивом, где ключ — имя заголовка, значение — массив значений.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpHeaders::getHeaders` возвращает заголовки двумерным массивом. Ключ — имя заголовка в том виде, в котором его добавили. Значение — массив значений.

Сигнатура метода в классе `Bitrix\Main\Web\HttpHeaders`:

```php
public function getHeaders(): array
```

## Возвращаемое значение

Метод возвращает массив `string[][]`. Метод собирает его через [getIterator](get-iterator.md).

## Примеры

**Пример.** Код выводит заголовки массивом:

```php
<?php
use Bitrix\Main\Web\HttpHeaders;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$headers = new HttpHeaders(['Content-Type' => 'text/csv', 'X-Units' => ['kg', 'g']]);

var_export($headers->getHeaders());
```

Код выведет:

```text
array (
  'Content-Type' => 
  array (
    0 => 'text/csv',
  ),
  'X-Units' => 
  array (
    0 => 'kg',
    1 => 'g',
  ),
)
```

## Смотрите также

- [HttpHeaders::toArray](to-array.md)
- [HttpHeaders::getIterator](get-iterator.md)

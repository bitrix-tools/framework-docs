---
title: Получить итератор HttpHeaders::getIterator
description: Метод HttpHeaders::getIterator возвращает итератор, через который foreach перебирает заголовки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpHeaders::getIterator` возвращает итератор по заголовкам. Класс реализует интерфейс `IteratorAggregate`, поэтому объект можно перебрать в `foreach` без вызова `getIterator`.

Сигнатура метода в классе `Bitrix\Main\Web\HttpHeaders`:

```php
public function getIterator(): Traversable
```

## Возвращаемое значение

Метод возвращает объект `\ArrayIterator`. Ключ — имя заголовка в том виде, в котором его добавили, значение — массив значений.

## Примеры

**Пример.** Код перебирает заголовки в `foreach`:

```php
<?php
use Bitrix\Main\Web\HttpHeaders;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$headers = new HttpHeaders(['Content-Type' => 'text/csv', 'X-Units' => ['kg', 'g']]);

foreach ($headers as $name => $values)
{
    echo $name . '=' . implode(',', $values) . ';';
}
```

Код выведет `Content-Type=text/csv;X-Units=kg,g;`.

## Смотрите также

- [HttpHeaders::getHeaders](get-headers.md)

---
title: Получить заголовки строкой HttpHeaders::toString
description: Метод HttpHeaders::toString возвращает заголовки строкой в формате HTTP — по строке на каждое значение.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpHeaders::toString` возвращает заголовки строкой в формате HTTP. Каждое значение метод выводит отдельной строкой `Имя: значение` и завершает ее символами `\r\n`.

Сигнатура метода в классе `Bitrix\Main\Web\HttpHeaders`:

```php
public function toString()
```

## Возвращаемое значение

Метод возвращает строку. Метод не добавляет строку статуса. Для пустой коллекции метод возвращает пустую строку.

## Примеры

**Пример.** Код выводит заголовки строкой:

```php
<?php
use Bitrix\Main\Web\HttpHeaders;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$headers = new HttpHeaders(['Content-Type' => 'text/csv', 'X-Units' => ['kg', 'g']]);

echo $headers->toString();
```

Код выведет:

```text
Content-Type: text/csv
X-Units: kg
X-Units: g
```

## Смотрите также

- [HttpHeaders::getHeaders](get-headers.md)
- [HttpHeaders::createFromString](create-from-string.md)

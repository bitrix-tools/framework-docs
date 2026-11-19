---
title: Создать коллекцию заголовков HttpHeaders::__construct
description: Конструктор HttpHeaders создает коллекцию заголовков, пустую или из массива «имя — значение».
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Конструктор `HttpHeaders::__construct` создает коллекцию заголовков. Если передать массив, конструктор добавляет каждый заголовок методом [add](add.md).

Сигнатура метода в классе `Bitrix\Main\Web\HttpHeaders`:

```php
public function __construct(?array $headers = null)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| headers | `array` или `null` | Задает заголовки. Ключ — имя заголовка, значение — строка или массив строк. Числовой ключ станет именем заголовка, например `0`. По умолчанию — `null`, коллекция пустая |

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `\InvalidArgumentException` | Имя или значение заголовка недопустимо. Подробнее — на странице [add](add.md) |

## Примеры

**Пример.** Код создает коллекцию из массива:

```php
<?php
use Bitrix\Main\Web\HttpHeaders;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$headers = new HttpHeaders([
    'Content-Type' => 'application/json',
    'X-Units' => ['kg', 'g'],
]);

echo $headers->toString();
```

Код выведет:

```text
Content-Type: application/json
X-Units: kg
X-Units: g
```

## Смотрите также

- [HttpHeaders::add](add.md)
- [HttpHeaders::createFromString](create-from-string.md)

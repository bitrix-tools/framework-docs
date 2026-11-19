---
title: Добавить заголовок HttpResponse::addHeader
description: Метод HttpResponse::addHeader добавляет заголовок в HTTP-ответ. Повторный вызов с тем же именем добавляет еще одно значение.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpResponse::addHeader` добавляет заголовок в ответ и возвращает тот же объект. Метод передает имя и значение в метод `add` коллекции заголовков `Bitrix\Main\Web\HttpHeaders`. Метод [writeHeaders](write-headers.md) отправляет заголовок клиенту.

Сигнатура метода в классе `Bitrix\Main\HttpResponse`:

```php
public function addHeader($name, $value = '')
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает имя заголовка, например `Content-Type`. Имя не может содержать пробелы, двоеточие и управляющие символы |
| value | `string` | Задает значение заголовка. По умолчанию — пустая строка |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает текущий объект.

Метод не заменяет заголовок. Если заголовок с таким именем уже есть, метод добавляет в коллекцию еще одно значение. Коллекция сравнивает имена без учета регистра, поэтому `X-Unit` и `x-unit` — один заголовок. Чтобы заменить значение, вызовите `getHeaders()->set($name, $value)`.

Метод `writeHeaders` отправляет каждое значение отдельным вызовом функции PHP `header`. По умолчанию функция заменяет заголовок с тем же именем, поэтому клиент получит последнее значение.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentNullException` | Имя пустое по правилам функции `empty`, в том числе `'0'` |
| `\InvalidArgumentException` | Имя содержит недопустимые символы, например пробел, или значение содержит перевод строки или другой управляющий символ, кроме табуляции |

## Примеры

**Пример.** Код добавляет в ответ два значения одного заголовка и выводит их:

```php
<?php
use Bitrix\Main\HttpResponse;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$response = new HttpResponse();
$response
    ->addHeader('X-Unit', 'kg')
    ->addHeader('X-Unit', 'g')
;

echo implode(', ', $response->getHeaders()->get('X-Unit', true));
```

Код выведет `kg, g`.

## Смотрите также

- [HttpResponse::getHeaders](get-headers.md)
- [HttpResponse::writeHeaders](write-headers.md)

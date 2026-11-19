---
title: Задать время для заголовка Last-Modified HttpResponse::setLastModified
description: Метод HttpResponse::setLastModified задает время для заголовка Last-Modified и сохраняет самое позднее из переданных значений.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 17.5.10

{% endnote %}

Метод `HttpResponse::setLastModified` задает время последнего изменения данных ответа и возвращает тот же объект. Метод [writeHeaders](write-headers.md) отправляет это время в заголовке `Last-Modified` по Гринвичу.

Сигнатура метода в классе `Bitrix\Main\HttpResponse`:

```php
public function setLastModified(Type\DateTime $time)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| time\* | `Bitrix\Main\Type\DateTime` | Задает время изменения |

## Возвращаемое значение

Метод возвращает текущий объект.

Метод сохраняет время, только если оно позже уже сохраненного. Поэтому несколько частей страницы могут передать время изменения своих данных, и заголовок получит самое позднее. Метод хранит переданный объект, а не копию.

## Примеры

**Пример.** Код передает время изменения двух записей, ответ запоминает более позднее:

```php
<?php
use Bitrix\Main\HttpResponse;
use Bitrix\Main\Type\DateTime;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$response = new HttpResponse();
$response
    ->setLastModified(new DateTime('2026-01-15 12:00:00', 'Y-m-d H:i:s'))
    ->setLastModified(new DateTime('2026-01-10 12:00:00', 'Y-m-d H:i:s'))
;
$response->writeHeaders();

echo 'Last-Modified отправлен для 15.01.2026';
```

Код отправит заголовок `Last-Modified` со временем 15 января 2026 года 12:00 по времени сервера, переведенным на Гринвич. При запуске из консоли PHP не отправляет заголовки, и код выведет только текст.

## Смотрите также

- [HttpResponse::writeHeaders](write-headers.md)
- [DateTime](../type/date-time/index.md)

---
title: Получить заголовки ответа HttpResponse::getHeaders
description: Метод HttpResponse::getHeaders возвращает коллекцию заголовков ответа HttpHeaders, которая хранит и статус ответа.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpResponse::getHeaders` возвращает коллекцию заголовков ответа. Методы коллекции читают, заменяют и удаляют заголовки.

Сигнатура метода в классе `Bitrix\Main\HttpResponse`:

```php
public function getHeaders()
```

## Возвращаемое значение

Метод возвращает сам объект `Bitrix\Main\Web\HttpHeaders` из ответа, а не его копию. Изменения в объекте сразу попадают в ответ.

Основные методы коллекции:

- `get($name, $returnArray = false)` — возвращает первое значение заголовка, а при `returnArray`, равном `true`, — массив всех значений. Если заголовка нет, возвращает `null`,
- `set($name, $value)` — заменяет значения заголовка,
- `delete($name)` — удаляет заголовок,
- `getReasonPhrase()` — возвращает текст статуса, например `Not Found`.

В цикле `foreach` коллекция возвращает имя заголовка и массив его значений.

## Примеры

**Пример.** Код заменяет значение заголовка и выводит все заголовки ответа:

```php
<?php
use Bitrix\Main\HttpResponse;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$response = new HttpResponse();
$response->addHeader('X-Unit', 'kg');
$response->getHeaders()->set('X-Unit', 'g');

foreach ($response->getHeaders() as $name => $values)
{
    echo $name . ': ' . implode(', ', $values);
}
```

Код выведет `X-Unit: g`.

## Смотрите также

- [HttpResponse::addHeader](add-header.md)
- [HttpResponse::setHeaders](set-headers.md)

---
title: Получить разделитель частей HttpHeaders::getBoundary
description: Метод HttpHeaders::getBoundary возвращает разделитель частей составного содержимого из атрибута boundary заголовка Content-Type.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpHeaders::getBoundary` возвращает разделитель частей из атрибута `boundary` заголовка `Content-Type`. Разделитель нужен, чтобы разобрать составное содержимое, например `multipart/form-data`. Метод вызывает [getContentTypeAttribute](get-content-type-attribute.md) с именем `boundary`.

Сигнатура метода в классе `Bitrix\Main\Web\HttpHeaders`:

```php
public function getBoundary()
```

## Возвращаемое значение

Метод возвращает строку или `null`, если атрибута нет. Метод не убирает кавычки вокруг значения.

## Примеры

**Пример.** Код читает разделитель составного содержимого:

```php
<?php
use Bitrix\Main\Web\HttpHeaders;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$headers = new HttpHeaders(['Content-Type' => 'multipart/form-data; boundary=----units42']);

echo $headers->getBoundary();
```

Код выведет `----units42`.

## Смотрите также

- [HttpHeaders::getContentTypeAttribute](get-content-type-attribute.md)

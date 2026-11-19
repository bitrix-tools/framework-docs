---
title: Удалить все заголовки HttpHeaders::clear
description: Метод HttpHeaders::clear удаляет все заголовки и не меняет статус и версию.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpHeaders::clear` удаляет все заголовки. Статус и версию HTTP метод не меняет.

Сигнатура метода в классе `Bitrix\Main\Web\HttpHeaders`:

```php
public function clear()
```

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код очищает коллекцию и проверяет статус:

```php
<?php
use Bitrix\Main\Web\HttpHeaders;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$headers = new HttpHeaders(['X-Units' => 'kg']);
$headers->setStatus(404);
$headers->clear();

echo count($headers->toArray()) . ' ' . $headers->getStatus();
```

Код выведет `0 404`.

## Смотрите также

- [HttpHeaders::delete](delete.md)

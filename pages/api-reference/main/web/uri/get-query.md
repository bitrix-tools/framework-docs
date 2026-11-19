---
title: Получить строку запроса Uri::getQuery
description: Метод Uri::getQuery возвращает строку запроса адреса без знака вопроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.15

{% endnote %}

Метод `Uri::getQuery` возвращает строку запроса — часть адреса после `?` и до `#`.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function getQuery(): string
```

## Возвращаемое значение

Метод возвращает строку без `?` или пустую строку, если строки запроса нет. Метод не раскодирует значение. Чтобы получить параметры массивом, разберите строку функцией `parse_str`.

## Примеры

**Пример.** Код читает строку запроса и разбирает ее:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = (new Uri('/units/?page=2&sort=name#top'))->getQuery();
parse_str($query, $params);

echo $query . ' ' . $params['sort'];
```

Код выведет `page=2&sort=name name`.

## Смотрите также

- [Uri::addParams](add-params.md)
- [Uri::withQuery](with-query.md)

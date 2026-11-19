---
title: Получить путь со строкой запроса Uri::getPathQuery
description: Метод Uri::getPathQuery возвращает путь и строку запроса без схемы, хоста и фрагмента.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.15

{% endnote %}

Метод `Uri::getPathQuery` возвращает путь вместе со строкой запроса. Метод нужен, чтобы получить адрес внутри сайта из абсолютного адреса, например для редиректа.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function getPathQuery()
```

## Возвращаемое значение

Метод возвращает строку вида `/путь?запрос`. Если путь пустой, метод подставляет `/`.

## Примеры

**Пример.** Код получает путь со строкой запроса из абсолютного адреса:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo (new Uri('https://example.com/units/list.php?page=2#top'))->getPathQuery() . ' ';
echo (new Uri('https://example.com?page=2'))->getPathQuery();
```

Код выведет `/units/list.php?page=2 /?page=2`.

## Смотрите также

- [Uri::getPath](get-path.md)
- [Uri::getQuery](get-query.md)

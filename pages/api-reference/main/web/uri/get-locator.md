---
title: Получить адрес без фрагмента Uri::getLocator
description: Метод Uri::getLocator собирает адрес из частей без фрагмента после знака решетки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 15.5.10

{% endnote %}

Метод `Uri::getLocator` собирает адрес из частей без фрагмента после `#`. Метод нужен для адреса, который передают на сервер, например в HTTP-запросе. Браузер не передает фрагмент серверу. Устаревший метод `getUrl` возвращает то же значение.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function getLocator()
```

## Возвращаемое значение

Метод возвращает строку из схемы, учетных данных, хоста, порта, пути и строки запроса. Порт метод добавляет по тем же правилам, что [getUri](get-uri.md).

## Примеры

**Пример.** Код сравнивает адрес с фрагментом и без него:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$uri = new Uri('https://example.com/units/?page=2#top');

echo $uri->getLocator() . "\n" . $uri->getUri();
```

Код выведет:

```text
https://example.com/units/?page=2
https://example.com/units/?page=2#top
```

## Смотрите также

- [Uri::getUri](get-uri.md)

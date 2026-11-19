---
title: Дополнить относительный адрес Uri::resolveRelativeUri
description: Метод Uri::resolveRelativeUri дополняет относительный адрес схемой, хостом и путем базового адреса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Uri::resolveRelativeUri` превращает относительный адрес в абсолютный по базовому адресу. Метод нужен, например, чтобы обработать ссылки со страницы внешнего сайта или заголовок `Location` в ответе.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function resolveRelativeUri(Uri $base): Uri
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| base\* | `Bitrix\Main\Web\Uri` | Задает базовый адрес, например адрес страницы со ссылкой |

## Возвращаемое значение

Метод возвращает тот же объект `Uri`.

## Особенности

- Если у адреса есть схема, метод ничего не меняет.
- Метод добавляет путь без `/` в начале к каталогу базового пути.
- Если путь пустой, метод берет базовый путь. Если пустая и строка запроса, метод берет строку запроса базового адреса.
- Метод не убирает сегменты `.` и `..`. Путь `../x.php` останется в адресе как есть.
- Класс не поддерживает адреса вида `//host/path`. Метод получит из такой строки путь, а не хост.

## Примеры

**Пример.** Код дополняет ссылки со страницы:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$base = new Uri('https://example.com/units/list/index.php?a=1');

foreach (['item.php', '/root.php', '?b=2'] as $link)
{
    echo (new Uri($link))->resolveRelativeUri($base)->getUri() . "\n";
}
```

Код выведет:

```text
https://example.com/units/list/item.php
https://example.com/root.php
https://example.com/units/list/index.php?b=2
```

## Смотрите также

- [Uri::toAbsolute](to-absolute.md)

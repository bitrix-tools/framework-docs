---
title: Проверить фильтр в адресе Options::isSetFromRequest
description: Статический метод Options::isSetFromRequest проверяет, передал ли запрос значения фильтра в адресе страницы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Options::isSetFromRequest` проверяет, передал ли запрос значения фильтра в адресе страницы. Так работают ссылки вида `/units/?apply_filter=Y&NAME=kg`. [getFilter](get-filter.md) вызывает метод сам.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public static function isSetFromRequest(HttpRequest $request)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| request\* | `Bitrix\Main\HttpRequest` | Задает запрос |

## Возвращаемое значение

Метод возвращает `true`, если запрос содержит параметр `apply_filter`, не содержит `ajax_request` и это не AJAX-запрос. Иначе метод возвращает `false`.

## Примеры

**Пример.** Код проверяет запрос с параметром `apply_filter`:

```php
<?php
use Bitrix\Main\HttpRequest;
use Bitrix\Main\Server;
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$request = new HttpRequest(new Server($_SERVER), ['apply_filter' => 'Y', 'NAME' => 'kg'], [], [], []);

var_dump(Options::isSetFromRequest($request));
```

Код выведет `bool(true)`.

## Смотрите также

- [Options::fetchSettingsFromQuery](fetch-settings-from-query.md)

---
title: Включить перенос скриптов в конец body Asset::setJsToBody
description: Метод Asset::setJsToBody включает или выключает перенос всех тегов script в конец body для текущей страницы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::setJsToBody` включает или выключает перенос всех тегов `script` в конец `<body>` для текущей страницы. Ядро переносит скрипты в готовом HTML перед отправкой страницы. Скрипты с атрибутом `data-skip-moving="true"` остаются на месте.

По умолчанию перенос задает параметр `move_js_to_body` главного модуля. Метод переопределяет параметр для одной страницы.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function setJsToBody($flag)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| flag\* | `bool` | Значение `true` включает перенос, `false` выключает |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

- Ядро переносит только скрипты без атрибута `type` или с типом `text/javascript` или `application/javascript`.
- Для AJAX-запроса перенос не работает.

## Примеры

**Пример.** Код включает перенос и проверяет его:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();
$asset->setJsToBody(true);

var_dump($asset->canMoveJsToBody());
```

Код выведет `bool(true)`.

## Смотрите также

- [Asset::canMoveJsToBody](can-move-js-to-body.md)
- [Asset::moveJs](move-js.md)

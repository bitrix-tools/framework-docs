---
title: Проверить перенос скриптов в конец body Asset::canMoveJsToBody
description: Метод Asset::canMoveJsToBody проверяет, перенесет ли ядро теги script в конец body на текущей странице.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::canMoveJsToBody` проверяет, перенесет ли ядро теги `script` в конец `<body>` на текущей странице. Ядро вызывает метод перед отправкой страницы.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function canMoveJsToBody()
```

## Возвращаемое значение

Метод возвращает `true` при всех условиях ниже.

- Перенос включает метод [setJsToBody](set-js-to-body.md) или параметр `move_js_to_body` главного модуля. Параметр не действует в административном разделе.
- Запрос не AJAX.
- Константа `BX_BUFFER_SHUTDOWN` не определена.

Иначе метод возвращает `false`.

## Примеры

**Пример.** Код выключает перенос и проверяет его:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();
$asset->setJsToBody(false);

var_dump($asset->canMoveJsToBody());
```

Код выведет `bool(false)`.

## Смотрите также

- [Asset::setJsToBody](set-js-to-body.md)

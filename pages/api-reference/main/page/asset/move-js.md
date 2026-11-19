---
title: Перенести JS модуля в конец страницы Asset::moveJs
description: Метод Asset::moveJs переносит JS-файлы модуля ядра из секции head в набор BODY в конце страницы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::moveJs` переносит JS-файлы модуля ядра в набор `BODY`. Шаблон выводит этот набор в конце страницы методом `$APPLICATION->ShowBodyScripts()`, поэтому скрипты модуля не задерживают отрисовку страницы.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function moveJs($module = '')
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| module | `string` | Задает модуль. По умолчанию — пустая строка |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает. Для пустого имени и модуля `main` метод ничего не делает.

## Особенности

- Метод работает только при включенном объединении JS и для файлов, которые зарегистрировал [addJsKernelInfo](add-js-kernel-info.md).
- Если шаблон не вызывает `ShowBodyScripts()`, набор `BODY` выведется в секции `<head>` вместе со скриптами ядра.
- Чтобы перенести в конец страницы все скрипты, используйте [setJsToBody](set-js-to-body.md).

## Примеры

**Пример.** Код переносит скрипты модуля в конец страницы:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();
$asset->addJsKernelInfo('vendor_units', ['/bitrix/js/vendor.units/units.js']);
$asset->moveJs('vendor_units');

$info = $asset->isKernelJS('/bitrix/js/vendor.units/units.js');

var_dump(is_array($info) && $info['BODY']);
```

Код выведет `bool(true)`, если объединение JS включено.

## Смотрите также

- [Asset::setShowBodyScript](set-show-body-script.md)
- [Asset::setJsToBody](set-js-to-body.md)

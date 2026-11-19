---
title: Получить строки Asset::getStrings
description: Метод Asset::getStrings возвращает строки, которые добавил addString, для одного места на странице.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::getStrings` возвращает строки, которые добавил метод [addString](add-string.md), для одного места на странице. Методы [getJs](get-js.md) и `$APPLICATION->ShowHead()` вызывают его сами. Прикладной код вызывает метод, когда выводит строки в своем шаблоне без `ShowHead`.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function getStrings($location = AssetLocation::AFTER_JS_KERNEL)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| location | `string` | Задает место — константу `AssetLocation`. По умолчанию — `AssetLocation::AFTER_JS_KERNEL` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строки, разделенные переводом строки. Если строк нет, метод возвращает пустую строку.

## Особенности

- Метод выводит только строки, режим которых пересекается по битам с текущим режимом из [setMode](set-mode.md).
- Для места `AFTER_CSS` при подключенном JS-ядре метод добавляет в начало служебный скрипт `BX.message`.
- Ядро само добавляет строки, например скрипт часового пояса. Они тоже попадут в результат.
- При первом вызове метод задает режим строкам без своего режима. Строки без режима, которые добавили позже, метод не выведет.

## Примеры

**Пример.** Код добавляет строку и ищет ее в выводе:

```php
<?php
use Bitrix\Main\Page\Asset;
use Bitrix\Main\Page\AssetLocation;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();
$asset->addString('<link rel="preconnect" href="https://cdn.example.com">', false, AssetLocation::BEFORE_CSS);

echo trim($asset->getStrings(AssetLocation::BEFORE_CSS));
```

Код выведет `<link rel="preconnect" href="https://cdn.example.com">`.

## Смотрите также

- [Asset::addString](add-string.md)

---
title: Отметить вывод скриптов Asset::setShowHeadScript
description: Метод Asset::setShowHeadScript отмечает, что шаблон выводит скрипты шаблона и страницы отдельно методом ShowHeadScripts.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::setShowHeadScript` отмечает, что шаблон сайта выводит скрипты шаблона и страницы отдельно. Метод `$APPLICATION->ShowHeadScripts()` вызывает его сам.

Отметка влияет на [getJs](get-js.md). Если шаблон выводит строки методом `ShowHeadStrings()`, но не выводит скрипты отдельно, `getJs` с типом `KERNEL` выводит все скрипты сразу.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function setShowHeadScript($value = true)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| value | `bool` | Задает отметку. По умолчанию — `true` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код показывает разницу в выводе типа `KERNEL` с отметкой и без нее:

```php
<?php
use Bitrix\Main\Page\Asset;
use Bitrix\Main\Page\AssetLocation;
use Bitrix\Main\Page\AssetShowTargetType;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();
$asset->addString('<script>window.unit = "kg";</script>', false, AssetLocation::AFTER_JS);
$asset->setShowHeadString();
$asset->setShowHeadScript();

var_dump(str_contains($asset->getJs(AssetShowTargetType::KERNEL), 'window.unit'));
```

Код выведет `bool(false)`. Строки `AFTER_JS` выведет отдельный вызов для скриптов шаблона и страницы. Без `setShowHeadScript` код выведет `bool(true)`.

## Смотрите также

- [Asset::getJs](get-js.md)
- [Asset::setShowBodyScript](set-show-body-script.md)

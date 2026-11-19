---
title: Отметить вывод скриптов в конце страницы Asset::setShowBodyScript
description: Метод Asset::setShowBodyScript отмечает, что шаблон выводит скрипты набора BODY в конце страницы методом ShowBodyScripts.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::setShowBodyScript` отмечает, что шаблон сайта выводит скрипты набора `BODY` и строки `BODY_END` в конце страницы. Метод `$APPLICATION->ShowBodyScripts()` вызывает его сам. Без отметки [getJs](get-js.md) выводит их в секции `<head>` вместе со скриптами ядра.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function setShowBodyScript($value = true)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| value | `bool` | Задает отметку. По умолчанию — `true` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код добавляет строку в конец страницы и проверяет, где она выводится:

```php
<?php
use Bitrix\Main\Page\Asset;
use Bitrix\Main\Page\AssetLocation;
use Bitrix\Main\Page\AssetShowTargetType;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();
$asset->addString('<script>window.unit = "kg";</script>', false, AssetLocation::BODY_END);
$asset->setShowBodyScript();

echo var_export(str_contains($asset->getJs(AssetShowTargetType::KERNEL), 'window.unit'), true) . ' '
    . var_export(str_contains($asset->getJs(AssetShowTargetType::BODY), 'window.unit'), true);
```

Код выведет `false true`.

## Смотрите также

- [Asset::getJs](get-js.md)
- [Asset::moveJs](move-js.md)

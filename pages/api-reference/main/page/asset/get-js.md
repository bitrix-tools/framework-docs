---
title: Получить HTML подключения JS Asset::getJs
description: Метод Asset::getJs возвращает теги script для JS-файлов страницы вместе со строками из addString.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::getJs` возвращает HTML подключения JS-файлов — теги `script` — вместе со строками из [addString](add-string.md). Метод `$APPLICATION->ShowHead()` вызывает его сам. Прикладному коду вызывать метод нужно, только если шаблон выводит скрипты без `ShowHead`.

Если объединение JS включено, метод собирает файлы каждого набора в один файл в каталоге `/bitrix/cache/js/`.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
function getJs($type = AssetShowTargetType::ALL)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| type | `int` | Задает, какие наборы вывести, — константу `AssetShowTargetType`. По умолчанию — `AssetShowTargetType::ALL` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

| Константа `AssetShowTargetType` | Что выводит метод |
| --- | --- |
| `ALL` | Строки `AFTER_CSS`, скрипты ядра, строки `AFTER_JS_KERNEL`, скрипты шаблона и страницы, строки `AFTER_JS` |
| `KERNEL` | Строки `AFTER_CSS`, скрипты ядра и строки `AFTER_JS_KERNEL` |
| `TEMPLATE_PAGE` | Скрипты шаблона и страницы и строки `AFTER_JS` |
| `BODY` | Строки `BODY_END` и скрипты набора `BODY` |

## Возвращаемое значение

Метод возвращает строку HTML.

## Особенности

- Метод готовит список файлов при первом вызове. Файлы, которые добавили потом, метод не выведет.
- Если шаблон не вызвал `$APPLICATION->ShowBodyScripts()`, метод выводит строки `BODY_END` и набор `BODY` вместе со скриптами ядра.
- Если шаблон вызвал `ShowHeadStrings()`, но не `ShowHeadScripts()`, тип `KERNEL` работает как `ALL`.

## Примеры

**Пример.** Код добавляет строку после всех скриптов и проверяет вывод:

```php
<?php
use Bitrix\Main\Page\Asset;
use Bitrix\Main\Page\AssetLocation;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();
$asset->addString('<script>window.unit = "kg";</script>', false, AssetLocation::AFTER_JS);

var_dump(str_contains($asset->getJs(), 'window.unit = "kg"'));
```

Код выведет `bool(true)`.

## Смотрите также

- [Asset::addJs](add-js.md)
- [Asset::getCss](get-css.md)
- [Asset::setShowBodyScript](set-show-body-script.md)

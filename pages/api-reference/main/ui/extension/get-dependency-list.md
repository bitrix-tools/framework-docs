---
title: Получить зависимости расширения Extension::getDependencyList
description: Метод Extension::getDependencyList возвращает имена расширений, от которых зависит расширение, в порядке подключения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Extension::getDependencyList` возвращает имена расширений, от которых зависит расширение. Метод обходит зависимости `rel` и `post_rel` рекурсивно.

Сигнатура метода в классе `Bitrix\Main\UI\Extension`:

```php
public static function getDependencyList($extName)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| extName\* | `string` | Задает имя расширения |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает массив имен без повторов. Само расширение в массив не входит. Каждое расширение из `rel` стоит в массиве после расширений, от которых оно зависит. Если в цепочке есть расширение ядра без точки в имени и без флага `skip_core`, метод добавляет в начало `core`.

Имена с точкой, для которых нет конфигурации, метод тоже добавляет в массив. Существует ли расширение, метод не проверяет.

## Примеры

**Пример.** Код выводит зависимости расширения `ui.hint`:

```php
<?php
use Bitrix\Main\UI\Extension;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo implode(', ', Extension::getDependencyList('ui.hint'));
```

## Смотрите также

- [Extension::getAssets](get-assets.md)
- [Extension::getResourceList](get-resource-list.md)

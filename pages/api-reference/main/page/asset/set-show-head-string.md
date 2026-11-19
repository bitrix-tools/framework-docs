---
title: Отметить вывод строк Asset::setShowHeadString
description: Метод Asset::setShowHeadString отмечает, что шаблон выводит строки в секции head методом ShowHeadStrings.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::setShowHeadString` отмечает, что шаблон сайта выводит строки в секции `<head>`. Метод `$APPLICATION->ShowHeadStrings()` вызывает его сам. Отметка не дает вывести строки дважды и меняет поведение [getJs](get-js.md).

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function setShowHeadString($value = true)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| value | `bool` | Задает отметку. По умолчанию — `true` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код ставит отметку и проверяет ее:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();
$asset->setShowHeadString();

var_dump($asset->getShowHeadString());
```

Код выведет `bool(true)`.

## Смотрите также

- [Asset::getShowHeadString](get-show-head-string.md)
- [Asset::setShowHeadScript](set-show-head-script.md)

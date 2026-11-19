---
title: Проверить вывод строк Asset::getShowHeadString
description: Метод Asset::getShowHeadString проверяет, выводит ли шаблон строки в секции head.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::getShowHeadString` проверяет отметку из [setShowHeadString](set-show-head-string.md). Метод `$APPLICATION->ShowHeadStrings()` проверяет отметку, чтобы не вывести строки дважды.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function getShowHeadString()
```

## Возвращаемое значение

Метод возвращает значение отметки. По умолчанию — `false`.

## Примеры

**Пример.** Код проверяет отметку в консольном скрипте:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Asset::getInstance()->getShowHeadString());
```

Код выведет `bool(false)`. Консольный скрипт не выводит шаблон.

## Смотрите также

- [Asset::setShowHeadString](set-show-head-string.md)

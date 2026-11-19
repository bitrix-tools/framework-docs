---
title: Получить список файлов для JS-ядра Asset::showFilesList
description: Метод Asset::showFilesList возвращает скрипт, который сообщает JS-ядру список уже подключенных CSS- и JS-файлов.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::showFilesList` возвращает скрипт с вызовами `BX.setJSList` и `BX.setCSSList`. Скрипт сообщает JS-ядру, какие файлы страница уже подключила в составе файлов объединения. Так `BX.load` и расширения не загрузят их повторно.

Метод [getJs](get-js.md) вызывает его сам после скриптов ядра. Прикладному коду вызывать метод не нужно.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function showFilesList()
```

## Возвращаемое значение

Метод возвращает строку HTML. Если JS-ядро не подключено или класс не объединял файлы, метод возвращает пустую строку.

## Особенности

Список заполняют методы [getCss](get-css.md) и [getJs](get-js.md). До их вызова список пустой.

## Примеры

**Пример.** Код выводит список после подготовки скриптов:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();
$asset->addJs('/bitrix/js/main/core/core.js');
$before = $asset->showFilesList();
$asset->getCss();
$asset->getJs();

echo var_export($before, true) . ' ' . var_export(str_contains($asset->showFilesList(), 'BX.setJSList'), true);
```

Код выведет `'' true`, если JS-ядро подключено и объединение JS включено.

## Смотрите также

- [Asset::getJs](get-js.md)

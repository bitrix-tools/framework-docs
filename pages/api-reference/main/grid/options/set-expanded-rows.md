---
title: Запомнить раскрытые строки Options::setExpandedRows
description: Метод Grid\Options::setExpandedRows запоминает в сессии идентификаторы раскрытых строк грида.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::setExpandedRows` запоминает идентификаторы раскрытых строк грида с вложенными строками. Метод сразу записывает значение в сессию, вызывать [save](save.md) не нужно.

Сигнатура метода в классе `Bitrix\Main\Grid\Options`:

```php
public function setExpandedRows($ids = array())
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| ids | `array` | Задает идентификаторы раскрытых строк. По умолчанию — пустой массив |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Метод не проверяет значение и записывает его как есть.

## Примеры

**Пример.** Код запоминает раскрытые строки и читает их:

```php
<?php
use Bitrix\Main\Grid\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_grid');
$options->setExpandedRows([1, 2]);

echo implode(',', $options->getExpandedRows());
```

Код выведет `1,2`.

## Смотрите также

- [Options::getExpandedRows](get-expanded-rows.md)
- [Options::resetExpandedRows](reset-expanded-rows.md)

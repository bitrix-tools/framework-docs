---
title: Получить колонки с измененной шириной Options::getResizedColumns
description: Метод Grid\Options::getResizedColumns возвращает колонки текущего представления, ширину которых пользователь изменил вручную.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::getResizedColumns` возвращает колонки текущего представления, ширину которых пользователь изменил вручную. Метод [setColumnsSizes](set-columns-sizes.md) заполняет список по параметру `resizedColumns`.

Метод появился в версии `main` новее 26.150.0.

Сигнатура метода в классе `Bitrix\Main\Grid\Options`:

```php
public function getResizedColumns(): array
```

## Возвращаемое значение

Метод возвращает массив идентификаторов колонок. Если список не сохранен, метод возвращает пустой массив.

## Примеры

**Пример.** Код задает ширину колонок с отметкой об изменении и читает список:

```php
<?php
use Bitrix\Main\Grid\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_grid');

if (method_exists($options, 'getResizedColumns'))
{
    $options->setColumnsSizes(1, ['NAME' => 200, 'CODE' => 100], ['NAME']);
    echo implode(',', $options->getResizedColumns());
}
else
{
    echo 'not available';
}
```

На версии с методом код выведет `NAME`. На версии `main` 26.150.0 код выведет `not available`.

## Смотрите также

- [Options::setColumnsSizes](set-columns-sizes.md)

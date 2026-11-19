---
title: Задать размер страницы Options::setPageSize
description: Метод Grid\Options::setPageSize задает число строк на странице для текущего представления грида.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::setPageSize` задает число строк на странице для текущего представления грида. Чтобы сохранить значение, вызовите [save](save.md).

Сигнатура метода в классе `Bitrix\Main\Grid\Options`:

```php
public function setPageSize($size)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| size\* | `int` | Задает число строк на странице |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

- Метод приводит значение к целому числу. Для отрицательного числа и нескалярного значения метод записывает `20`, для нечисловой строки — `0`.
- Родительский метод `GetNavParams` читает размер страницы, который объект загрузил из `CUserOptions` при создании. Для авторизованного пользователя метод `GetNavParams` вернет новое значение только у объекта, который создан после вызова [save](save.md). Для гостя `GetNavParams` не учитывает настройки из сессии и возвращает размер по умолчанию. Метод [getCurrentOptions](get-current-options.md) возвращает значение текущего объекта.

## Примеры

**Пример.** Код задает размер страницы, сохраняет настройки и читает их новым объектом:

```php
<?php
use Bitrix\Main\Grid\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_grid');
$options->setPageSize(50);
$options->save();

$reloaded = new Options('units_grid');

echo $reloaded->getCurrentOptions()['page_size'] . ' ' . $reloaded->GetNavParams()['nPageSize'];
```

Для авторизованного пользователя код выведет `50 50`. Для гостя, например при запуске из консоли, код выведет `50 20`.

## Смотрите также

- [Options::save](save.md)
- [Options::getCurrentOptions](get-current-options.md)

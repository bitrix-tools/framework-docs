---
title: Получить видимые колонки Options::getUsedColumns
description: Метод Grid\Options::getUsedColumns возвращает колонки, которые пользователь выбрал в текущем представлении грида, или колонки по умолчанию.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::getUsedColumns` возвращает колонки, которые пользователь выбрал для показа в текущем представлении. Код страницы передает их в `select`, чтобы не выбирать лишние поля.

Сигнатура метода в классе `Bitrix\Main\Grid\Options`:

```php
public function getUsedColumns($defaultColumns = array())
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| defaultColumns | `array` | Задает колонки, которые метод вернет, если пользователь не выбирал колонки. По умолчанию — пустой массив |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает массив идентификаторов колонок. Если пользователь выбрал колонки, метод разбивает строку настроек по запятой. Иначе метод возвращает `defaultColumns`.

В отличие от родительского `GetVisibleColumns`, метод читает текущие настройки объекта, включая несохраненные изменения.

## Примеры

**Пример.** Код задает видимые колонки и читает их:

```php
<?php
use Bitrix\Main\Grid\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_grid');
echo implode(',', $options->getUsedColumns(['ID', 'NAME'])) . ' ';

$options->SetColumns('ID,CODE');
echo implode(',', $options->getUsedColumns(['ID', 'NAME']));
```

Для грида без сохраненных настроек код выведет `ID,NAME ID,CODE`.

## Смотрите также

- [Options::getCurrentOptions](get-current-options.md)

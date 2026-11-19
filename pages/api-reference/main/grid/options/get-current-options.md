---
title: Получить настройки текущего представления Options::getCurrentOptions
description: Метод Grid\Options::getCurrentOptions возвращает массив настроек текущего представления грида — колонки, сортировку, размер страницы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::getCurrentOptions` возвращает настройки текущего представления грида. Представление — набор настроек, между которыми пользователь переключается в гриде. Основное представление называется `default`.

Сигнатура метода в классе `Bitrix\Main\Grid\Options`:

```php
public function getCurrentOptions()
```

## Возвращаемое значение

Метод возвращает массив. Ключи зависят от того, что настроил пользователь.

#|
|| Ключ | Описание ||
|| columns<br>`string` | Видимые колонки через запятую. Пустая строка — колонки по умолчанию ||
|| page_size<br>`int` | Размер страницы ||
|| last_sort_by<br>`string` | Колонка последней сортировки ||
|| last_sort_order<br>`string` | Направление последней сортировки, например `asc` ||
|| columns_sizes<br>`array` | Ширина колонок, ключи `expand` и `columns`. В версиях новее `main` 26.150.0 есть еще ключ `resized` ||
|| name<br>`string` | Название представления из `SetViewSettings` ||
|| sort_by<br>`string` | Колонка сортировки представления из `SetViewSettings` ||
|| sort_order<br>`string` | Направление сортировки представления из `SetViewSettings` ||
|| saved_filter<br>`string` | Сохраненный фильтр представления ||
|| custom_names<br>`array` | Свои названия колонок ||
|| sticked_columns<br>`array` | Закрепленные колонки ||
|#

Метод читает настройки, которые объект содержит сейчас, включая несохраненные изменения.

## Примеры

**Пример.** Код задает размер страницы и читает его из настроек текущего представления:

```php
<?php
use Bitrix\Main\Grid\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_grid');
$options->setPageSize(50);

echo $options->getCurrentOptions()['page_size'];
```

Код выведет `50`.

## Смотрите также

- [Options::getSorting](get-sorting.md)
- [Options::getUsedColumns](get-used-columns.md)

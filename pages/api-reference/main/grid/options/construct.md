---
title: Загрузить настройки грида Options::__construct
description: Конструктор Grid\Options загружает пользовательские настройки грида по его идентификатору.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Конструктор `Options::__construct` загружает настройки грида по его идентификатору. Идентификатор совпадает с параметром `GRID_ID` компонента `main.ui.grid`.

Сигнатура метода в классе `Bitrix\Main\Grid\Options`:

```php
public function __construct($gridId, array $filterPresets = array())
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| gridId\* | `string` | Задает идентификатор грида |
| filterPresets | `array` | Задает предустановленные фильтры для родительского метода `InitFilter`. По умолчанию — пустой массив |

Тип `gridId` в таблице описывает назначение аргумента. Сигнатура PHP объявляет только тип `filterPresets`.

## Особенности

- Конструктор родительского класса читает настройки из `CUserOptions` в категории `main.interface.grid`, у гостя — общие записи без пользователя. Если представления `default` нет, конструктор берет общие настройки из категории `main.interface.grid.common`, а без них создает `default` с пустым списком колонок.
- Для гостя конструктор затем заменяет все настройки сохраненными в сессии, если метод [save](save.md) сохранил их туда раньше. Текущее представление и настройки, которые читают родительские методы `GetNavParams` и `GetVisibleColumns`, остаются из `CUserOptions`.
- Если текущее представление из `CUserOptions` не существует, конструктор делает текущим `default`. Для настроек из сессии эту проверку конструктор не выполняет.

## Примеры

**Пример.** Код загружает настройки грида и выводит идентификатор и текущее представление:

```php
<?php
use Bitrix\Main\Grid\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_grid');

echo $options->getId() . ' ' . $options->GetOptions()['current_view'];
```

Для грида без сохраненных настроек код выведет `units_grid default`.

## Смотрите также

- [Options::save](save.md)
- [Options::getCurrentOptions](get-current-options.md)

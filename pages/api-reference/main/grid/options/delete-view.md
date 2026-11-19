---
title: Удалить представление Options::deleteView
description: Метод Grid\Options::deleteView удаляет представление грида, сбрасывает данные грида в сессии и сохраняет настройки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::deleteView` удаляет представление грида. Метод сразу сохраняет изменения, вызывать [save](save.md) не нужно.

Метод переопределяет `CGridOptions::DeleteView`, который только удаляет представление из объекта.

Сигнатура метода в классе `Bitrix\Main\Grid\Options`:

```php
public function deleteView($viewId)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| viewId\* | `string` | Задает идентификатор представления |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

- Метод удаляет представление, удаляет из сессии сортировку, фильтр, раскрытые строки и свернутые группы грида, сохраняет настройки и заново загружает их конструктором родительского класса из `CUserOptions`.
- Для гостя, у которого настройки в сессии, объект после вызова содержит настройки из `CUserOptions`. Чтобы прочитать настройки гостя, создайте новый объект `Options`.
- Если метод удалил текущее представление, при следующей загрузке из `CUserOptions` конструктор сделает текущим `default`. Для гостя настройки из сессии сохранят удаленное текущее представление, и [getCurrentOptions](get-current-options.md) вернет `null`. Перед удалением сделайте текущим другое представление методом `SetView`.
- Если метод удалил `default`, конструктор при следующей загрузке создаст его из общих настроек `main.interface.grid.common` или с пустым списком колонок.

## Примеры

**Пример.** Код создает представление, сохраняет его и удаляет:

```php
<?php
use Bitrix\Main\Grid\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_grid');
$options->SetViewSettings('compact', [
    'name' => 'Compact',
    'columns' => 'ID',
    'sort_by' => 'ID',
    'sort_order' => 'asc',
    'page_size' => 5,
    'saved_filter' => '',
]);
$options->save();

$options = new Options('units_grid');
$options->deleteView('compact');

echo implode(',', array_keys((new Options('units_grid'))->GetOptions()['views']));
```

Код выведет `default`.

## Смотрите также

- [Options::resetView](reset-view.md)

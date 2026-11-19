---
title: Добавить условия во все запросы DataManager::setDefaultScope
description: Метод DataManager::setDefaultScope добавляет условия в каждый запрос к таблице. Наследник переопределяет его, например чтобы скрыть удаленные записи.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::setDefaultScope` добавляет условия в каждый запрос к таблице. Наследник переопределяет метод, например чтобы выбирать только активные записи. Запрос вызывает метод, когда строит SQL. Условия действуют, только когда таблица — основная в запросе: в `getList`, `getCount`, `getByPrimary` и `query`.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function setDefaultScope($query)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| query\* | `Bitrix\Main\ORM\Query\Query` | Задает запрос, в который метод добавляет условия, например через `where` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает запрос. Базовый класс возвращает его без изменений.

## Особенности

- Если таблицу присоединяет другой запрос через связь `Reference`, условия не применяются.
- Методы [update](update.md) и [delete](delete.md) пишут SQL сами и условия не учитывают.
- Обойти условия в отдельном запросе нельзя. Если иногда нужны все записи, создайте второй класс таблицы без этого метода.

## Примеры

**Пример.** Код создает класс таблицы языков, который выбирает только английский:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class EnglishLanguageTable extends LanguageTable
{
    public static function setDefaultScope($query)
    {
        return $query->where('LID', 'en');
    }
}

echo EnglishLanguageTable::getCount() . ' ' . implode(',', array_column(EnglishLanguageTable::getList(['select' => ['LID']])->fetchAll(), 'LID'));
```

Код выведет `1 en`.

## Смотрите также

- [DataManager::query](query.md)
- [DataManager::getList](get-list.md)

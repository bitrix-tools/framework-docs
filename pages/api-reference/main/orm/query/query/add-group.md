---
title: Добавить поле группировки Query::addGroup
description: Метод Query::addGroup добавляет поле в GROUP BY.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::addGroup` добавляет поле в группировку `GROUP BY`. Прежние поля остаются.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function addGroup($group)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| group\* | `string` | Задает поле |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `Query`.

## Примеры

**Пример.** Код добавляет два поля группировки:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query()->setSelect(['ACTIVE', 'DEF'])->addGroup('ACTIVE')->addGroup('DEF');

echo json_encode($query->getGroup());
```

Код выведет `["ACTIVE","DEF"]`.

## Смотрите также

- [Query::setGroup](set-group.md)

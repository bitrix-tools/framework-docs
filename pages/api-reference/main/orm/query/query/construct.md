---
title: Создать запрос Query::__construct
description: Конструктор Query::__construct создает запрос к сущности ORM по объекту сущности, имени сущности или другому запросу.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Конструктор `Query::__construct` создает запрос к сущности. Чаще запрос создают методом `query()` класса таблицы — он вызывает конструктор с сущностью таблицы.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function __construct($source)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| source\* | `Entity`, `string` или `Query` | Задает источник — объект [Entity](../../entity/index.md), имя сущности или другой запрос. Запрос становится подзапросом, как в [Entity::getInstanceByQuery](../../entity/get-instance-by-query.md) |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Источник не объект сущности, не строка и не запрос |

## Особенности

Конструктор клонирует сущность. Для источника-запроса конструктор создает новую временную сущность. Поля, которые добавит [registerRuntimeField](register-runtime-field.md), появятся только в копии и не затронут другие запросы.

## Примеры

**Пример.** Код создает запрос по сущности и по имени:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$byEntity = new Query(LanguageTable::getEntity());
$byName = new Query('Bitrix\Main\Localization\Language');

echo $byEntity->getEntity()->getName() . ' ' . $byName->getEntity()->getName() . ' '
    . var_export($byEntity->getEntity() === LanguageTable::getEntity(), true);
```

Код выведет `Language Language false`.

## Смотрите также

- [DataManager::query](../../data/data-manager/query.md)
- [Query::exec](exec.md)

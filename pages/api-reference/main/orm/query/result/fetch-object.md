---
title: Получить строку объектом Result::fetchObject
description: Метод ORM\Query\Result::fetchObject возвращает следующую строку выборки объектом ORM со значениями выбранных полей и связей.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::fetchObject` возвращает следующую строку выборки объектом ORM, например `EO_User`. Объект содержит значения полей из `select`, а значения связей — связанными объектами. Объект можно изменить и сохранить методом `save`.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Result`:

```php
final public function fetchObject()
```

## Возвращаемое значение

Метод возвращает объект класса сущности или `null`, если строк больше нет.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\SystemException` | Запрос группирует строки, например содержит `group` или агрегат вместе с обычными полями |
| `Bitrix\Main\SystemException` | В выборке нет первичного ключа основной или связанной сущности, например `select` содержит только агрегаты или запрос использует `DISTINCT` |

## Особенности

- При выполнении запрос сам добавляет в `select` первичные ключи основной и присоединенных сущностей, если их нет. Исключение — запросы с агрегатами и `DISTINCT`. Методы [fetch](fetch.md) и [fetchAll](fetch-all.md) не показывают эти колонки.
- Если в запросе — в `select`, `filter` или `order` — есть обратная связь `OneToMany` или `ManyToMany`, первый вызов читает все строки и собирает по одному объекту на первичный ключ. Следующие вызовы возвращают готовые объекты. При `limit` или фильтре по связи коллекция связи может быть неполной.
- Метод берет объект из реестра [getIdentityMap](get-identity-map.md), если объект с тем же первичным ключом там уже есть, в том числе в реестре, общем для нескольких выборок. Значения из строки перезаписывают значения объекта.
- Метод приводит значения полей-выражений [ExpressionField](../../fields/expression-field/index.md) к типу из `configureValueType`.

## Примеры

**Пример.** Код читает язык объектом:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$language = LanguageTable::getList([
    'select' => ['LID', 'NAME'],
    'filter' => ['=LID' => 'en'],
])->fetchObject();

echo get_class($language) . ' ' . $language->getLid() . ' ' . $language->getName();
```

Код выведет `Bitrix\Main\Localization\EO_Language en English`.

## Смотрите также

- [Result::fetchCollection](fetch-collection.md)
- [Объекты](../../../../../orm/objects.md)

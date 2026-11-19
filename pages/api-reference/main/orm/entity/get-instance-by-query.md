---
title: Создать сущность по запросу Entity::getInstanceByQuery
description: Статический метод Entity::getInstanceByQuery создает сущность, таблица которой — подзапрос. По такой сущности можно строить новые запросы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Entity::getInstanceByQuery` создает сущность, таблица которой — подзапрос из `query`. Поля сущности — поля из `select` запроса. По такой сущности можно строить новый запрос, например чтобы сгруппировать результат первого запроса.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public static function getInstanceByQuery(Query $query, &$entity_name = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| query\* | `Bitrix\Main\ORM\Query\Query` | Задает запрос |
| entity_name | `string` или `null` | Принимает имя сущности по ссылке. Если значение `null`, метод создаст случайное имя вида `Tmp...x` и запишет его в переменную. По умолчанию — `null` |

## Возвращаемое значение

Метод возвращает объект `Entity`. Сущность получает служебный первичный ключ `TMP_ID`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Имя сущности содержит символы, кроме латинских букв, цифр и `_` |

## Особенности

- Метод принимает `entity_name` по ссылке, поэтому передавайте переменную, а не строку.
- Метод создает класс через `eval`. Имя сущности должно быть уникальным в пределах хита.

## Примеры

**Пример.** Код строит сущность по выборке активных языков и запрашивает ее:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Entity;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$name = 'ActiveLanguage';
$entity = Entity::getInstanceByQuery(
    LanguageTable::query()->setSelect(['LID', 'NAME'])->where('ACTIVE', 'Y'),
    $name
);
$rows = (new Query($entity))->setSelect(['LID'])->setOrder(['LID' => 'ASC'])->fetchAll();

echo implode(',', array_keys($entity->getFields())) . ' / ' . implode(',', array_column($rows, 'LID'));
```

Код выведет `TMP_ID,LID,NAME / en,ru`. Список языков зависит от сайта.

## Смотрите также

- [Entity::compileEntity](compile-entity.md)
- [Конструктор запросов](../../../../orm/query-builder.md)

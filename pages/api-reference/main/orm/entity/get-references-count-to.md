---
title: Получить число связей Entity::getReferencesCountTo
description: Метод Entity::getReferencesCountTo возвращает число полей Reference, которые связывают сущность с другой сущностью.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::getReferencesCountTo` возвращает число полей [Reference](../fields/relations/reference/index.md), которые связывают сущность с другой сущностью.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function getReferencesCountTo($refEntityName)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| refEntityName\* | `string` | Задает имя связанной сущности |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает число связей или `0`.

## Особенности

Метод переводит имя в нижний регистр, а сущность хранит имена связанных сущностей в исходном регистре с ведущим `\`, например `\Bitrix\Main\Localization\Language`. Поэтому для классов с заглавными буквами метод возвращает `0`. Чтобы найти связи, переберите поля из [getFields](get-fields.md) и проверьте `Reference::getRefEntityName`.

## Примеры

**Пример.** Код ищет связь двумя способами:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Entity;
use Bitrix\Main\ORM\Fields\IntegerField;
use Bitrix\Main\ORM\Fields\Relations\Reference;
use Bitrix\Main\ORM\Fields\StringField;
use Bitrix\Main\ORM\Query\Join;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$entity = Entity::compileEntity('DemoUnit', [
    new IntegerField('ID', ['primary' => true]),
    new StringField('LANG_ID'),
    new Reference('LANG', LanguageTable::class, Join::on('this.LANG_ID', 'ref.LID')),
], ['namespace' => 'Vendor\Units']);

$found = array_filter($entity->getFields(), fn($field) => $field instanceof Reference
    && $field->getRefEntityName() === '\Bitrix\Main\Localization\Language');

echo $entity->getReferencesCountTo('\Bitrix\Main\Localization\Language') . ' ' . count($found);
```

Код выведет `0 1`.

## Смотрите также

- [Entity::getReferencesTo](get-references-to.md)
- [Reference](../fields/relations/reference/index.md)

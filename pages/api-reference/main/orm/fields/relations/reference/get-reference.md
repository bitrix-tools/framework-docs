---
title: Получить условие связи Reference::getReference
description: Метод Reference::getReference возвращает условие связи, которое передали в конструктор поля.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Reference::getReference` возвращает условие связи, которое передали в конструктор в параметре `referenceFilter`.

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\Relations\Reference`:

```php
public function getReference()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\ORM\Query\Filter\ConditionTree` или массив, если условие задали массивом в старом формате.

## Примеры

**Пример.** Код создает поле связи и выводит число условий в нем. Конструктор не проверяет, что класс связанной сущности существует, поэтому пример не объявляет его:

```php
<?php
use Bitrix\Main\ORM\Fields\Relations\Reference;
use Bitrix\Main\ORM\Query\Join;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$field = new Reference(
    'GROUP',
    '\Demo\UnitGroupTable',
    Join::on('this.GROUP_ID', 'ref.ID')->where('ref.ACTIVE', 'Y')
);

echo count($field->getReference()->getConditions());
```

Код выведет `2`.

## Смотрите также

- [Reference::getElementals](get-elementals.md)
- [Join::on](../../../query/join/on.md)

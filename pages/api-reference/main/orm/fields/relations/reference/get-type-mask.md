---
title: Получить маску типа поля Reference::getTypeMask
description: Метод Reference::getTypeMask возвращает маску типа поля FieldTypeMask::REFERENCE.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Reference::getTypeMask` возвращает маску типа поля. По маске код отличает поля связи от скалярных и вычисляемых, например когда объект ORM собирает свои значения.

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\Relations\Reference`:

```php
public function getTypeMask()
```

## Возвращаемое значение

Метод возвращает целое число — константу `Bitrix\Main\ORM\Fields\FieldTypeMask::REFERENCE` со значением `8`. Маска входит в группу `FieldTypeMask::RELATION`.

## Примеры

**Пример.** Код проверяет, что поле — связь. Класс связанной сущности пример не объявляет, метод его не загружает:

```php
<?php
use Bitrix\Main\ORM\Fields\FieldTypeMask;
use Bitrix\Main\ORM\Fields\Relations\Reference;
use Bitrix\Main\ORM\Query\Join;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$field = new Reference('GROUP', '\Demo\UnitGroupTable', Join::on('this.GROUP_ID', 'ref.ID'));

var_dump(($field->getTypeMask() & FieldTypeMask::RELATION) !== 0);
```

Код выведет `bool(true)`.

## Смотрите также

- [Reference::getDataType](get-data-type.md)

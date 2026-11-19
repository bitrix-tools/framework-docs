---
title: Проверить наличие поля Entity::hasField
description: Метод Entity::hasField проверяет, есть ли у сущности поле с таким именем.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::hasField` проверяет, есть ли у сущности поле. Регистр имени не важен. Вызывайте метод перед [getField](get-field.md), чтобы избежать исключения.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function hasField($name)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает имя поля |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если поле есть, иначе `false`.

## Примеры

**Пример.** Код проверяет два поля:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$entity = LanguageTable::getEntity();

var_dump($entity->hasField('lid'), $entity->hasField('WEIGHT'));
```

Код выведет:

```text
bool(true)
bool(false)
```

## Смотрите также

- [Entity::getField](get-field.md)

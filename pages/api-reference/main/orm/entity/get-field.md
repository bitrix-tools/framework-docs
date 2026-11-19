---
title: Получить поле Entity::getField
description: Метод Entity::getField возвращает поле сущности по имени без учета регистра.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::getField` возвращает поле сущности по имени. Регистр имени не важен. Через поле код читает его настройки, например обязательность или значение по умолчанию.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function getField($name)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает имя поля |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект поля — наследник `Bitrix\Main\ORM\Fields\Field`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Поля нет. Текст — `<Сущность> Entity has no `<поле>` field.` |

## Примеры

**Пример.** Код читает поле и проверяет обязательность:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$field = LanguageTable::getEntity()->getField('name');

echo get_class($field) . ' ' . var_export($field->isRequired(), true);
```

Код выведет `Bitrix\Main\ORM\Fields\StringField false`.

## Смотрите также

- [Entity::hasField](has-field.md)
- [Entity::getFields](get-fields.md)

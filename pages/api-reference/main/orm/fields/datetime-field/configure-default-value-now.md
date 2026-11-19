---
title: Задать текущее время по умолчанию DatetimeField::configureDefaultValueNow
description: Метод DatetimeField::configureDefaultValueNow задает значением поля по умолчанию текущее время на момент получения значения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DatetimeField::configureDefaultValueNow` задает значением поля по умолчанию текущее время. Метод передает в `configureDefaultValue` функцию, которая создает новый объект `Bitrix\Main\Type\DateTime`. Поэтому поле получает текущее время, когда ORM запрашивает значение по умолчанию, а не когда код описывает поле.

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\DatetimeField`:

```php
public function configureDefaultValueNow(): self
```

## Возвращаемое значение

Метод возвращает объект поля, поэтому вызов можно продолжить цепочкой.

## Примеры

**Пример.** Код описывает поле даты создания и выводит класс значения по умолчанию:

```php
<?php
use Bitrix\Main\ORM\Fields\DatetimeField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$field = (new DatetimeField('CREATED_AT'))->configureDefaultValueNow();

echo get_class($field->getDefaultValue());
```

Код выведет `Bitrix\Main\Type\DateTime`.

## Смотрите также

- [DatetimeField::configureUseTimezone](configure-use-timezone.md)

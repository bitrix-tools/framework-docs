---
title: LengthValidator — проверка длины значения поля ORM
description: Класс Bitrix\Main\ORM\Fields\Validators\LengthValidator проверяет минимальную и максимальную длину значения поля ORM.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\ORM\Fields\Validators`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.5

{% endnote %}

## Когда использовать

Валидатор `LengthValidator` проверяет длину значения поля в символах перед записью через ORM. Валидатор подключают к полю в методе `getMap`, например методом `addValidator` поля. Если длина не подходит, операция `add` или `update` возвращает ошибку и не записывает данные.

Старое имя класса `Bitrix\Main\Entity\Validator\Length` работает как псевдоним.

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [validate](validate.md) | Проверяет длину значения | |
| [getMin](get-min.md) | Возвращает минимальную длину | 14.9.4 |
| [getMax](get-max.md) | Возвращает максимальную длину | 14.9.4 |

## Наследование

Класс наследует `Bitrix\Main\ORM\Fields\Validators\Validator`.

### Реализация методов базового класса

#|
|| Метод | Особенность реализации ||
|| `__construct($min = 1, $max = null, $errorPhrase = ['MIN' => null, 'MAX' => null])` | Принимает минимальную и максимальную длину и тексты ошибок:
- `min` — минимальная длина, по умолчанию `1`. Значение `null` отключает проверку минимума,
- `max` — максимальная длина, по умолчанию `null`. Значение `null` отключает проверку максимума,
- `errorPhrase` — массив с ключами `MIN` и `MAX`, тексты ошибок вместо стандартных.

Если `min` или `max` не `null` и не целое число, конструктор выбрасывает `Bitrix\Main\ArgumentTypeException` ||
|#

## Примеры

**Пример.** Код подключает к полю `CODE` валидатор длины от одного до пяти символов и выводит число валидаторов поля:

```php
<?php
use Bitrix\Main\ORM\Fields\StringField;
use Bitrix\Main\ORM\Fields\Validators\LengthValidator;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$field =
    (new StringField('CODE'))
        ->addValidator(new LengthValidator(1, 5))
;

echo count($field->getValidators());
```

Код выведет `1`.

## Смотрите также

- [ORM: основные операции](../../../../../../orm/entity-operations.md)

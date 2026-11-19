---
title: Получить максимальную длину LengthValidator::getMax
description: Метод LengthValidator::getMax возвращает максимальную длину значения или null, если максимум не проверяется.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.9.4

{% endnote %}

Метод `LengthValidator::getMax` возвращает максимальную длину, которую задали в конструкторе.

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\Validators\LengthValidator`:

```php
public function getMax()
```

## Возвращаемое значение

Метод возвращает целое число или `null`, если в конструктор передали `max` со значением `null` или не передали `max`.

## Примеры

**Пример.** Код находит у поля `CODE` валидатор длины и выводит максимальную длину:

```php
<?php
use Bitrix\Main\ORM\Fields\StringField;
use Bitrix\Main\ORM\Fields\Validators\LengthValidator;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$field =
    (new StringField('CODE'))
        ->addValidator(new LengthValidator(1, 5))
;

foreach ($field->getValidators() as $validator)
{
    if ($validator instanceof LengthValidator)
    {
        echo $validator->getMax();
    }
}
```

Код выведет `5`.

## Смотрите также

- [LengthValidator::getMin](get-min.md)

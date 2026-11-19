---
title: Получить минимальную длину LengthValidator::getMin
description: Метод LengthValidator::getMin возвращает минимальную длину значения или null, если минимум не проверяется.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.9.4

{% endnote %}

Метод `LengthValidator::getMin` возвращает минимальную длину, которую задали в конструкторе.

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\Validators\LengthValidator`:

```php
public function getMin()
```

## Возвращаемое значение

Метод возвращает целое число или `null`, если в конструктор передали `min` со значением `null`. Если `min` не передали, метод возвращает `1`.

## Примеры

**Пример.** Код выводит минимальную длину валидатора по умолчанию и валидатора без минимума:

```php
<?php
use Bitrix\Main\ORM\Fields\Validators\LengthValidator;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump((new LengthValidator())->getMin());
var_dump((new LengthValidator(null, 255))->getMin());
```

Код выведет `int(1)` и `NULL`.

## Смотрите также

- [LengthValidator::getMax](get-max.md)

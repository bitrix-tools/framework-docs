---
title: Проверить, не зависит ли выражение от полей ExpressionField::isConstant
description: Метод ExpressionField::isConstant проверяет, что у выражения нет полей для подстановки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ExpressionField::isConstant` проверяет, что у выражения нет полей для подстановки, например `COUNT(*)` или `NOW()`. Такое выражение не зависит от колонок строки.

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\ExpressionField`:

```php
public function isConstant()
```

## Возвращаемое значение

Метод возвращает `true`, если [getBuildFrom](get-build-from.md) пустой, иначе `false`. Метод не считает постоянным выражение с функцией в `buildFrom`.

## Примеры

**Пример.** Код проверяет два выражения:

```php
<?php
use Bitrix\Main\ORM\Fields\ExpressionField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$count = new ExpressionField('CNT', 'COUNT(*)');
$length = new ExpressionField('NAME_LEN', 'LENGTH(%s)', 'NAME');

var_export([$count->isConstant(), $length->isConstant()]);
```

Код выведет:

```text
array (
  0 => true,
  1 => false,
)
```

## Смотрите также

- [ExpressionField::getBuildFrom](get-build-from.md)

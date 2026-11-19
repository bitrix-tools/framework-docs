---
title: Получить выражение ExpressionField::getExpression
description: Метод ExpressionField::getExpression возвращает SQL-выражение поля в исходном виде с подстановками %s.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ExpressionField::getExpression` возвращает выражение в том виде, в котором его передали в конструктор, с подстановками `%s`. Метод [getFullExpression](get-full-expression.md) возвращает выражение с раскрытыми вложенными выражениями.

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\ExpressionField`:

```php
public function getExpression()
```

## Возвращаемое значение

Метод возвращает строку.

## Примеры

**Пример.** Код выводит выражение поля:

```php
<?php
use Bitrix\Main\ORM\Fields\ExpressionField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$field = new ExpressionField('TOTAL', '%s * %s', ['PRICE', 'QUANTITY']);

echo $field->getExpression();
```

Код выведет `%s * %s`.

## Смотрите также

- [ExpressionField::getFullExpression](get-full-expression.md)
- [ExpressionField::getBuildFrom](get-build-from.md)

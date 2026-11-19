---
title: Получить полное выражение ExpressionField::getFullExpression
description: Метод ExpressionField::getFullExpression возвращает выражение, в которое подставлены выражения вложенных полей-выражений.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ExpressionField::getFullExpression` возвращает выражение, в которое подставлены выражения других полей-выражений из [getBuildFrom](get-build-from.md). Обычные поля остаются подстановками `%s`. Методы [isAggregated](is-aggregated.md) и [hasSubquery](has-subquery.md) ищут агрегаты и подзапросы в полном выражении.

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\ExpressionField`:

```php
public function getFullExpression()
```

## Возвращаемое значение

Метод возвращает строку. Вместо функции из `buildFrom` метод подставляет пустую строку.

## Особенности

Если в `buildFrom` есть поля, метод работает только после привязки к сущности, иначе выбросит ошибку PHP.

## Примеры

**Пример.** Код раскрывает выражение, построенное на другом выражении:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Fields\ExpressionField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query()
    ->registerRuntimeField(new ExpressionField('NAME_LEN', 'LENGTH(%s)', 'NAME'))
    ->registerRuntimeField(new ExpressionField('NAME_LEN2', '%s * 2', 'NAME_LEN'));

$field = $query->getEntity()->getField('NAME_LEN2');

echo $field->getExpression() . ' → ' . $field->getFullExpression();
```

Код выведет `%s * 2 → LENGTH(%s) * 2`.

## Смотрите также

- [ExpressionField::getExpression](get-expression.md)

---
title: Получить цепочки полей запроса Query::getRuntimeChains
description: Метод Query::getRuntimeChains возвращает цепочки полей, которые добавил registerRuntimeField.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::getRuntimeChains` возвращает цепочки полей, которые добавил [registerRuntimeField](register-runtime-field.md). Запрос тоже регистрирует выражения из выборки как поля запроса.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function getRuntimeChains()
```

## Возвращаемое значение

Метод возвращает массив объектов `Bitrix\Main\ORM\Query\Chain` или `null`, если полей запроса нет.

## Примеры

**Пример.** Код добавляет поле запроса и выводит его цепочку:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Fields\ExpressionField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query();
$before = $query->getRuntimeChains();
$query->registerRuntimeField(new ExpressionField('LID_UP', 'UPPER(%s)', 'LID'));

echo var_export($before, true) . ' ' . implode(',', array_keys($query->getRuntimeChains()));
```

Код выведет `NULL LID_UP`.

## Смотрите также

- [Query::registerRuntimeField](register-runtime-field.md)

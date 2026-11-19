---
title: Задать сериализованные колонки Result::setSerializedFields
description: Метод ORM\Query\Result::setSerializedFields задает колонки с сериализованными значениями, которые fetch раскодирует функцией unserialize.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::setSerializedFields` задает колонки с сериализованными значениями. Метод [fetch](fetch.md) раскодирует их значения функцией `unserialize`. Метод вызывает [DB\Result::setSerializedFields](../../../db/result/set-serialized-fields.md).

Для поля в `getMap` используйте метод `configureSerialized` поля, тогда ORM раскодирует значение сама.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Result`:

```php
public function setSerializedFields(array $serializedFields)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| serializedFields\* | `string[]` | Задает имена колонок результата |

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код раскодирует сериализованное значение выражения:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Fields\ExpressionField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = LanguageTable::getList([
    'select' => ['LID', 'UNITS'],
    'filter' => ['=LID' => 'en'],
    'runtime' => [new ExpressionField('UNITS', "'a:2:{i:0;s:2:\"kg\";i:1;s:1:\"g\";}'")],
]);
$result->setSerializedFields(['UNITS']);

echo implode(',', $result->fetch()['UNITS']);
```

Код выведет `kg,g`.

## Смотрите также

- [DB\Result::setSerializedFields](../../../db/result/set-serialized-fields.md)

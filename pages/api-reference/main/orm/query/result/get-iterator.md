---
title: Получить итератор Result::getIterator
description: Метод ORM\Query\Result::getIterator возвращает итератор, через который foreach перебирает строки выборки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::getIterator` возвращает итератор по строкам выборки. Объект `Result` можно перебрать в `foreach`, вызывать метод не нужно. Метод вызывает [DB\Result::getIterator](../../../db/result/get-iterator.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Result`:

```php
public function getIterator(): \Traversable
```

## Возвращаемое значение

Метод возвращает итератор. Ключ — номер строки, значение — строка массивом, как в [DB\Result::fetch](../../../db/result/fetch.md).

## Особенности

В отличие от [fetch](fetch.md), итератор не убирает служебные поля из [setHiddenObjectFields](set-hidden-object-fields.md). Если в `select` нет первичного ключа, строки содержат колонку вида `UALIAS_0`.

## Примеры

**Пример.** Код перебирает строки в `foreach`:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = LanguageTable::getList([
    'select' => ['LID'],
    'filter' => ['@LID' => ['en', 'ru']],
    'order' => ['LID' => 'ASC'],
]);

foreach ($result as $row)
{
    echo $row['LID'] . ' ';
}
```

Код выведет `en ru`.

## Смотрите также

- [Result::fetch](fetch.md)
- [Result::setHiddenObjectFields](set-hidden-object-fields.md)

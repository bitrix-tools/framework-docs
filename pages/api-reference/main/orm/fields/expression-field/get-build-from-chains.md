---
title: Получить цепочки полей выражения ExpressionField::getBuildFromChains
description: Метод ExpressionField::getBuildFromChains возвращает цепочки ORM для полей выражения и проверяет, что поля скалярные или выражения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ExpressionField::getBuildFromChains` возвращает цепочки `Bitrix\Main\ORM\Query\Chain` для полей из [getBuildFrom](get-build-from.md). Запрос строит соединения таблиц по цепочкам и подставляет колонки в выражение. Прикладному коду метод нужен редко.

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\ExpressionField`:

```php
public function getBuildFromChains()
```

## Возвращаемое значение

Метод возвращает массив объектов `Chain`. Метод пропускает функции из `buildFrom`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\SystemException` | Поле из `buildFrom` — не скалярное поле и не выражение, например связь |
| `Bitrix\Main\ArgumentException` | Поля из `buildFrom` нет в сущности |

## Особенности

Если в `buildFrom` есть поля, метод работает только после привязки к сущности, иначе выбросит ошибку PHP.

## Примеры

**Пример.** Код выводит последнее поле каждой цепочки:

```php
<?php
use Bitrix\Main\ORM\Fields\ExpressionField;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = UserTable::query()->registerRuntimeField(
    new ExpressionField('GROUP_COUNT', 'COUNT(%s)', 'GROUPS.GROUP_ID')
);

foreach ($query->getEntity()->getField('GROUP_COUNT')->getBuildFromChains() as $chain)
{
    echo $chain->getDefinition() . ' ' . get_class($chain->getLastElement()->getValue());
}
```

Код выведет `GROUPS.GROUP_ID Bitrix\Main\ORM\Fields\IntegerField`.

## Смотрите также

- [ExpressionField::getBuildFrom](get-build-from.md)

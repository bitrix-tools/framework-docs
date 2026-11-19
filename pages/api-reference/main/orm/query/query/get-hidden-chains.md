---
title: Получить скрытые цепочки Query::getHiddenChains
description: Метод Query::getHiddenChains возвращает цепочки полей, из которых запрос строит выражения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::getHiddenChains` возвращает скрытые цепочки — цепочки полей, из которых запрос строит выражения. Например, выражение `UPPER(%s)` по полю `LID` добавит скрытую цепочку `LID`. Скрытые поля не попадают в результат, но запрос соединяет для них таблицы.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function getHiddenChains()
```

## Возвращаемое значение

Метод возвращает массив объектов `Bitrix\Main\ORM\Query\Chain`. Ключи — служебные псевдонимы цепочек из кода сущности, имени выражения и имени поля. До построения SQL массив пустой.

## Примеры

**Пример.** Код выбирает выражение и выводит скрытые цепочки:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Fields\ExpressionField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query()->setSelect([new ExpressionField('LID_UP', 'UPPER(%s)', 'LID')]);
$query->getQuery();

echo implode(',', array_keys($query->getHiddenChains()));
```

Код выведет `MAIN_LOCALIZATION_LANGUAGE_LID_UP_LID`.

## Смотрите также

- [ExpressionField](../../fields/expression-field/index.md)

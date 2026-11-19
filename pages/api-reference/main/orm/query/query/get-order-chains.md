---
title: Получить цепочки сортировки Query::getOrderChains
description: Метод Query::getOrderChains возвращает цепочки полей сортировки запроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::getOrderChains` возвращает цепочки полей сортировки.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function getOrderChains()
```

## Возвращаемое значение

Метод возвращает массив объектов `Bitrix\Main\ORM\Query\Chain`. До построения SQL массив пустой.

## Примеры

**Пример.** Код строит запрос с сортировкой и выводит ее цепочки:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query()->setSelect(['LID'])->setOrder(['SORT' => 'DESC', 'LID' => 'ASC']);
$query->getQuery();

echo implode(',', array_keys($query->getOrderChains()));
```

Код выведет `SORT,LID`.

## Смотрите также

- [Query::setOrder](set-order.md)

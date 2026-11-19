---
title: Получить сортировку Query::getOrder
description: Метод Query::getOrder возвращает сортировку запроса — поля и направления.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::getOrder` возвращает сортировку — поля и направления, которые задали [setOrder](set-order.md) и [addOrder](add-order.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function getOrder()
```

## Возвращаемое значение

Метод возвращает массив `поле => направление`. Направление — `ASC` или `DESC` в виде, который задает помощник SQL базы данных.

## Примеры

**Пример.** Код задает сортировку и читает ее:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo json_encode(LanguageTable::query()->setOrder(['SORT' => 'desc'])->addOrder('LID')->getOrder());
```

Код выведет `{"SORT":"DESC","LID":"ASC"}`.

## Смотрите также

- [Query::setOrder](set-order.md)
